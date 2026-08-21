"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";

// Number of digits in the OTP code.
const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  // Holds each digit of the OTP as a separate array item.
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  // Refs to each input box, used to move focus forward/backward automatically.
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Runs when a digit is typed into a box.
  const handleChange = (index: number, value: string) => {
    // Only allow a single digit in each box.
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move to the next box automatically once a digit is entered.
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Runs on Backspace so it moves focus back when a box is already empty.
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    // you will make the OTP verification API call using fetch or axios.
    console.log({ code });
  };

  return (
    // "auth-shell" comes from globals.css — same gradient background on every auth page
    <div className="auth-shell">
      <div className="w-full max-w-sm auth-card">
        {/* ================= LOGO + HEADING ================= */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-slate-900">CRM Admin</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Verify Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We&apos;ve sent a 6-digit verification code to{" "}
            <span className="font-semibold text-slate-700">ad***@company.com</span>.
            Please enter it below.
          </p>
        </div>

        {/* ================= OTP INPUT BOXES ================= */}
        <div className="mt-8 flex justify-center gap-2 sm:gap-3">
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
              className="h-14 w-11 text-center text-lg font-semibold sm:h-16 sm:w-12"
            />
          ))}
        </div>

        {/* Verify button — default Button variant already uses bg-primary */}
        <Button type="button" onClick={handleVerify} className="mt-8 w-full">
          Verify OTP
          <ShieldCheck className="ml-2 h-4 w-4" />
        </Button>

        {/* Resend code line */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Didn&apos;t receive the code?{" "}
          <button type="button" className="auth-link">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

