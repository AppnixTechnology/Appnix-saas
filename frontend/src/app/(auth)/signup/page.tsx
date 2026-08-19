"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  BarChart3,
} from "lucide-react";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    workspaceName: z
      .string()
      .min(2, "Workspace name must be at least 2 characters"),
    termsAccepted: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd?.length >= 8) strength++;
    if (/[A-Z]/.test(pwd || "")) strength++;
    if (/[a-z]/.test(pwd || "")) strength++;
    if (/[0-9]/.test(pwd || "")) strength++;
    if (/[^A-Za-z0-9]/.test(pwd || "")) strength++;
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

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        workspaceName: data.workspaceName,
        termsAccepted: data.termsAccepted,
      });
      toast({
        title: "Account created!",
        description: "Welcome aboard. Let's get you started.",
        variant: "success",
      });
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // "auth-shell" comes from globals.css — same gradient background as every other auth page
    <div className="auth-shell lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col lg:flex-row">
        {/* ================= LEFT PANEL (Branding) ================= */}
        {/* bg-primary reads from the global --primary variable now */}
        <div className="relative flex flex-col justify-between bg-primary p-8 sm:p-10 lg:w-[45%] lg:p-12">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-200">
              Precision CRM
            </p>

            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Master your data, accelerate your growth.
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-blue-200 sm:text-base">
              Join 10,000+ organizations using Precision CRM to orchestrate
              high-velocity sales cycles and complex data workflows.
            </p>
          </div>

          <div className="relative mt-10 hidden overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:block">
            <div className="flex items-center gap-2 text-blue-200">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Live Analytics</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-white/10 p-3">
                <div className="text-lg font-bold text-white">45,290</div>
                <div className="text-[10px] text-blue-300">Total Signups</div>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <div className="text-lg font-bold text-white">32,155</div>
                <div className="text-[10px] text-blue-300">Active Users</div>
              </div>
              <div className="rounded-md bg-white/10 p-3 flex items-end gap-1">
                <div className="h-4 w-1.5 rounded-full bg-blue-300/60" />
                <div className="h-6 w-1.5 rounded-full bg-blue-300/80" />
                <div className="h-3 w-1.5 rounded-full bg-blue-300/50" />
                <div className="h-8 w-1.5 rounded-full bg-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL (Form) ================= */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your details to start your 14-day free trial.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Sam"
                    className="pl-10"
                    {...register("name")}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Business Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10"
                    {...register("email")}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Workspace Name */}
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <div className="relative">
                  <Building className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="workspaceName"
                    type="text"
                    placeholder="Acme Inc."
                    className="pl-10"
                    {...register("workspaceName")}
                    disabled={isLoading}
                  />
                </div>
                {errors.workspaceName && (
                  <p className="text-sm text-red-600">
                    {errors.workspaceName.message}
                  </p>
                )}
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      {...register("password")}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      {...register("confirmPassword")}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthColors[strength - 1] || "bg-red-500"
                      }`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength: {strengthLabels[strength - 1] || "Very Weak"}
                  </p>
                </div>
              )}

              {/* Terms checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <Controller
                  name="termsAccepted"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="termsAccepted"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                      disabled={isLoading}
                    />
                  )}
                />
                <Label
                  htmlFor="termsAccepted"
                  className="text-sm font-normal leading-snug text-slate-600"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="auth-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600">
                  {errors.termsAccepted.message}
                </p>
              )}

              {/* Submit button — default Button variant already uses bg-primary */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">
                OR SIGN UP WITH
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Social buttons: wired to real redirects (Google + GitHub) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/api/auth/google")}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.58v2.98h3.93c2.3-2.12 3.52-5.24 3.52-8.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.93-2.98c-1.09.73-2.48 1.16-4 1.16-3.08 0-5.68-2.08-6.61-4.87H1.34v3.06C3.31 21.3 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.39 14.38c-.24-.73-.38-1.5-.38-2.38s.14-1.65.38-2.38V6.56H1.34C.49 8.24 0 10.06 0 12s.49 3.76 1.34 5.44l4.05-3.06z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.76 0 3.34.61 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.34 0 3.31 2.7 1.34 6.56l4.05 3.06C6.32 6.83 8.92 4.75 12 4.75z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/api/auth/github")}
                disabled={isLoading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/signin" className="auth-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
