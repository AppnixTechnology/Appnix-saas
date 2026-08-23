"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    token: z.string().length(6, "Reset code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, resendOtp } = useAuth();
  const { toast } = useToast();

  const tokenFromUrl = searchParams.get("token") || searchParams.get("code") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      token: tokenFromUrl,
    },
  });

  const password = watch("password") || "";

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const handleResend = async () => {
    const targetEmail = getValues("email") || emailFromUrl;
    if (!targetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      await resendOtp(targetEmail, "password_reset");
      toast({
        title: "New code sent!",
        description: `A fresh 6-digit verification code was sent to ${targetEmail}.`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Resend failed",
        description: err.message || "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.token, data.password, data.confirmPassword, data.email);
      setIsSuccess(true);
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. Redirecting to sign in...",
        variant: "success",
      });
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (error: any) {
      const message = error.message || "Failed to reset password. Please verify your OTP code.";
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 via-slate-50/80 to-blue-50/40 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[440px] text-center space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Password Reset Complete!
            </h1>
            <p className="text-sm text-slate-500">
              Your password has been updated securely. Redirecting you to sign in...
            </p>
            <Button asChild className="w-full h-11 mt-4">
              <Link href="/signin">Sign In Now</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              Set New Password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter the 6-digit OTP code sent to your email
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
              >
                Account Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white text-sm transition-colors"
                  {...register("email")}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 6-Digit Token */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="token"
                  className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                >
                  6-Digit OTP Code
                </Label>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || isResending}
                  className="text-xs font-medium text-primary hover:underline transition-colors disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="token"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white text-sm tracking-widest font-mono transition-colors"
                  {...register("token")}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              </div>
              {errors.token && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {errors.token.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white text-sm transition-colors"
                  {...register("password")}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthColors[strength - 1] || "bg-red-500"
                      }`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Strength: {strengthLabels[strength - 1] || "Very Weak"}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white text-sm transition-colors"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm shadow-sm hover:shadow transition-all bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <span>Save New Password</span>
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
          <span>Protected with bcrypt hashing & 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
