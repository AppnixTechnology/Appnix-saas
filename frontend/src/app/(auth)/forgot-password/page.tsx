"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, ArrowRight, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast({
        title: "Verification code sent!",
        description: `We've sent a 6-digit password reset OTP to ${email}.`,
        variant: "success",
      });
      // Navigate to reset password page with email prefilled
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message || "Failed to dispatch reset code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-slate-50/80 to-blue-50/40 p-4 sm:p-6 lg:p-8">
      {/* Ambient background glow */}
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
              Forgot Password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your email to receive a 6-digit verification code
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 text-xs leading-relaxed">
            <KeyRound className="h-5 w-5 text-primary shrink-0" />
            <span>
              We&apos;ll send an email OTP via our secure mail delivery system to verify your identity.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
              >
                Account Email Address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white text-sm transition-colors"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm shadow-sm hover:shadow transition-all bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Verification Code...
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Secured by Brevo Transactional Email & 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
}