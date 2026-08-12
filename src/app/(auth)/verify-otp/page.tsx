"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Loader2, Clock, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;

type VerifyType = "email_verification" | "password_reset" | "2fa";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState<"verify" | "success">("verify");

  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") as VerifyType) || "email_verification";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  const otp = watch("otp");

  const startCountdown = useCallback(() => {
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {};
  }, [startCountdown]);

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    try {
      await resendOtp(email, type);
      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
        variant: "success",
      });
      startCountdown();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resend code";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "email_verification":
        return "Verify your email";
      case "password_reset":
        return "Reset your password";
      case "2fa":
        return "Two-factor authentication";
      default:
        return "Verify code";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "email_verification":
        return `Enter the 6-digit code sent to ${email}`;
      case "password_reset":
        return `Enter the 6-digit code sent to ${email} to reset your password`;
      case "2fa":
        return "Enter the 6-digit code from your authenticator app";
      default:
        return "Enter the verification code";
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      await verifyOtp(email, data.otp, type);
      setStep("success");
      toast({
        title: type === "password_reset" ? "Password reset!" : "Email verified!",
        description: type === "password_reset"
          ? "Your password has been reset successfully."
          : "Your email has been verified successfully.",
        variant: "success",
      });
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid or expired code";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
      setValue("otp", "");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">Appnix</span>
            </Link>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {type === "password_reset" ? "Password Reset!" : "Email Verified!"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {type === "password_reset"
                ? "Your password has been reset successfully. Redirecting to sign in..."
                : "Your email has been verified successfully. Redirecting to dashboard..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Appnix</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{getTitle()}</h1>
          <p className="mt-2 text-muted-foreground">{getDescription()}</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <CardDescription>
              We&apos;ve sent a 6-digit code to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-1">
                    <Input
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      className="text-center text-2xl font-medium tracking-widest h-14"
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setValue("otp", otp.slice(0, i) + value + otp.slice(i + 1));
                          if (value && i < 5) {
                            const nextInput = document.getElementById(`otp-${i + 1}`);
                            nextInput?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          const prevInput = document.getElementById(`otp-${i - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text");
                        if (/^\d{6}$/.test(pasted)) {
                          setValue("otp", pasted);
                          const lastInput = document.getElementById("otp-5");
                          lastInput?.focus();
                        }
                      }}
                      disabled={isLoading}
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
              {errors.otp && (
                <p className="text-sm text-destructive text-center">{errors.otp.message}</p>
              )}

              <Button type="submit" className="w-full" size="lg" loading={isLoading} disabled={otp.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Code expires in {countdown}s
                </span>
                {canResend && (
                  <>
                    <span>|</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResend}
                      loading={resendLoading}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Resend
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <Button variant="ghost" size="sm" onClick={handleResend} disabled={!canResend || resendLoading}>
            Resend code
          </Button>
        </p>
      </div>
    </div>
  );
}