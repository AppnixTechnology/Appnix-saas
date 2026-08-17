"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RotateCcw, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  // Holds the email the user types in.
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // make the reset-link API call using fetch or axios.
    console.log({ email });
  };

  return (
    // "auth-shell" comes from globals.css — same gradient background on every auth page
    <div className="auth-shell">
      <div className="w-full max-w-sm">
        {/* ================= LOGO + HEADING ================= */}
        <div className="flex flex-col items-center text-center">
          {/* "auth-logo-box" already applies bg-primary + rounded-2xl from globals.css */}
          <div className="auth-logo-box">
            <RotateCcw className="h-6 w-6 text-primary-foreground" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            CRM Admin
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Management Console
          </p>
        </div>

        {/* ================= FORM CARD ================= */}
        <div className="mt-6 auth-card">
          <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter the email address associated with your account and we&apos;ll
            send you a secure link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit button — default Button variant already uses bg-primary */}
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          {/* Back to sign in link */}
          <Link
            href="/signin"
            className="mt-6 flex items-center justify-center gap-1 text-sm auth-link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}