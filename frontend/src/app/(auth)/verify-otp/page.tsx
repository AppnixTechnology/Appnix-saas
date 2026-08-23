"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";

const OTP_LENGTH = 6;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();
  const { toast } = useToast();

  const emailParam = searchParams.get("email") || "";
  const typeParam = (searchParams.get("type") as "email_verification" | "password_reset" | "2fa") || "email_verification";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Support pasting full 6-digit code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const updated = [...otp];
      digits.forEach((d, i) => {
        if (i < OTP_LENGTH) updated[i] = d;
      });
      setOtp(updated);
      const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast({
        title: "Incomplete Code",
        description: "Please enter all 6 digits of the verification code.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email Missing",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, code, typeParam);
      toast({
        title: "Verified successfully!",
        description:
          typeParam === "password_reset"
            ? "Verification code confirmed. Proceeding to set new password."
            : "Your email has been verified. Welcome to Appnix!",
        variant: "success",
      });

      if (typeParam === "password_reset") {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend the code.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      await resendOtp(email, typeParam);
      setCountdown(45);
      toast({
        title: "New code sent!",
        description: `We've sent a new 6-digit verification code to ${email}.`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/^(.)(.*)(@.*)$/, (_, first, middle, rest) => `${first}${"*".repeat(Math.min(middle.length, 5))}${rest}`)
    : "your email address";

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-slate-50/80 to-blue-50/40 p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[440px] space-y-6">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="group flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 hover:ring-primary/40 transition-all duration-200"
          >
            <Image
              src="/logo-favicon.png"
              alt="Appnix Logo"
              width={40}
              height={40}
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {typeParam === "password_reset" ? "Reset Code Verification" : "Verify Your Email"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              We&apos;ve sent a 6-digit code to <span className="font-semibold text-slate-700">{maskedEmail}</span>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
          {!emailParam && (
            <div className="mb-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Confirm Email Address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-slate-50/50 border-slate-200 text-sm"
              />
            </div>
          )}

          {/* OTP Input Boxes */}
          <div className="my-6 flex justify-center gap-2 sm:gap-2.5">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold text-slate-900 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== OTP_LENGTH}
            className="w-full h-11 font-semibold text-sm shadow-sm hover:shadow transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Code...
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Resend Code Section */}
          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <p className="text-xs text-slate-400">
                Resend code in <span className="font-semibold text-slate-600">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs font-semibold text-primary hover:underline transition-colors"
              >
                {isResending ? "Sending new code..." : "Didn't receive code? Resend"}
              </button>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Delivered securely via Brevo Transactional Mail</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
