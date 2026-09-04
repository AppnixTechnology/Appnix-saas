"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Building2,
  Zap,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MockCashfreeModalOptions {
  orderId: string;
  paymentSessionId?: string;
  planId?: string;
  planName?: string;
  amount?: number; // in INR rupees
  currency?: string;
  returnUrl?: string;
  customerName?: string;
  customerEmail?: string;
  onDismiss?: () => void;
}

let activeCashfreeModalTrigger: ((options: MockCashfreeModalOptions) => void) | null = null;

export function triggerMockCashfreeModal(options: MockCashfreeModalOptions) {
  let handled = false;
  if (activeCashfreeModalTrigger) {
    activeCashfreeModalTrigger(options);
    handled = true;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-mock-cashfree-modal", { detail: options })
    );
  }
  // If modal was not attached in DOM, safely navigate to internal Appnix status screen (NEVER external Cashfree)
  if (!handled && typeof window !== "undefined") {
    const returnUrl =
      options.returnUrl ||
      `/workspace/billing/status?order_id=${options.orderId}&plan=${options.planId || "starter"}&amount=${options.amount || 999}&status=SUCCESS`;
    window.location.href = returnUrl;
  }
}

export function MockCashfreeModalContainer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<MockCashfreeModalOptions | null>(null);
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<MockCashfreeModalOptions>;
      if (customEvent.detail) {
        setOptions(customEvent.detail);
        setIsOpen(true);
        setIsProcessing(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("open-mock-cashfree-modal", handleCustomEvent);
    }

    activeCashfreeModalTrigger = (opts) => {
      setOptions(opts);
      setIsOpen(true);
      setIsProcessing(false);
    };

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-mock-cashfree-modal", handleCustomEvent);
      }
      activeCashfreeModalTrigger = null;
    };
  }, []);

  if (!isOpen || !options) return null;

  const displayAmount = options.amount ? options.amount.toLocaleString() : "999";
  const planName = options.planName || (options.planId === "enterprise" ? "Enterprise Custom" : options.planId === "pro" ? "Professional Tier" : "Starter Tier");

  const resolveReturnUrl = (resultStatus: "SUCCESS" | "FAILED") => {
    if (options.returnUrl && !options.returnUrl.includes("{order_id}")) {
      const url = new URL(options.returnUrl, window.location.origin);
      url.searchParams.set("order_id", options.orderId);
      url.searchParams.set("plan", options.planId || "starter");
      url.searchParams.set("amount", String(options.amount || 999));
      url.searchParams.set("status", resultStatus);
      return url.toString();
    }
    return `/workspace/billing/status?order_id=${options.orderId}&plan=${options.planId || "starter"}&amount=${options.amount || 999}&status=${resultStatus}`;
  };

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    const planId = options.planId || "starter";
    const planName =
      options.planName ||
      (planId === "enterprise"
        ? "Enterprise Custom"
        : planId === "pro"
        ? "Professional Tier"
        : "Starter Tier");
    const amt = Number(options.amount || 999);

    if (typeof window !== "undefined") {
      localStorage.setItem("appnix_active_plan", planId);
      try {
        const existing = JSON.parse(localStorage.getItem("appnix_transactions") || "[]");
        const record = {
          id: options.orderId,
          invoiceNumber: `INV-${options.orderId.slice(-8).toUpperCase()}`,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          plan: `${planName} (Monthly)`,
          amount: `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          rawAmount: amt,
          status: "Paid",
          paymentMethod: "Cashfree PG",
        };
        const filtered = existing.filter((item: any) => item.id !== options.orderId);
        localStorage.setItem("appnix_transactions", JSON.stringify([record, ...filtered]));
      } catch {}

      // Register with history store immediately
      fetch("/api/v1/payments/cashfree/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: options.orderId,
          planId,
          planName,
          amount: amt,
          status: "SUCCESS",
          paymentMethod: "Cashfree PG",
        }),
      }).catch(() => {});
    }

    // Trigger verify API
    fetch(
      `/api/v1/payments/cashfree/verify?order_id=${options.orderId}&plan=${planId}&amount=${amt}&status=SUCCESS`
    ).catch(() => {});

    setTimeout(() => {
      setIsOpen(false);
      setIsProcessing(false);
      const target = resolveReturnUrl("SUCCESS");
      router.push(target);
    }, 500);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsProcessing(false);
      const target = resolveReturnUrl("FAILED");
      router.push(target);
    }, 400);
  };

  const handleClose = () => {
    setIsOpen(false);
    options.onDismiss?.();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-indigo-500/30 bg-card shadow-2xl">
        {/* Header with Cashfree brand palette */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-sm border border-indigo-400/30 shadow-xs">
                CF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold leading-none">Cashfree Payments</h3>
                  <Badge className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] px-1.5 py-0">
                    SANDBOX
                  </Badge>
                </div>
                <p className="text-[11px] text-indigo-200/70 mt-1">Appnix CRM Workspace Checkout</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-indigo-300">Amount to Pay</span>
              <p className="text-2xl font-black tracking-tight text-white">₹{displayAmount}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-indigo-300">Upgrading To</span>
              <p className="text-sm font-bold text-white">{planName}</p>
            </div>
          </div>
        </div>

        {/* Customer Reference */}
        <div className="bg-muted/40 px-5 py-2.5 border-b text-[11px] flex items-center justify-between text-muted-foreground">
          <span>Order: <strong className="font-mono text-foreground">{options.orderId}</strong></span>
          <span>Customer: <strong className="text-foreground">{options.customerName || "Dev Admin"}</strong></span>
        </div>

        {/* Simulated Payment Methods */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upi")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "upi"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <QrCode className="h-4 w-4 mb-1" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "card"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4 mb-1" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("netbanking")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "netbanking"
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <Building2 className="h-4 w-4 mb-1" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Tab Information */}
          <div className="rounded-xl border bg-muted/20 p-3.5 text-xs text-muted-foreground space-y-1.5">
            {activeTab === "upi" && (
              <p className="flex items-center gap-1.5 text-foreground font-medium">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                Simulated UPI VPA: <span className="font-mono text-primary font-bold">appnix.dev@okhdfcbank</span>
              </p>
            )}
            {activeTab === "card" && (
              <p className="flex items-center gap-1.5 text-foreground font-medium">
                <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                Simulated Card: <span className="font-mono text-primary font-bold">•••• 4018</span> (Visa Sandbox)
              </p>
            )}
            {activeTab === "netbanking" && (
              <p className="flex items-center gap-1.5 text-foreground font-medium">
                <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                Simulated Bank: <span className="font-mono text-primary font-bold">HDFC / ICICI NetBanking</span>
              </p>
            )}

            <div className="pt-1 text-[11px] text-muted-foreground border-t border-border/60">
              <span className="font-semibold text-foreground">Why this simulator appears:</span> Cashfree JS SDK v3 requires a live order generated on Cashfree's server with valid merchant credentials. In local sandbox testing, this simulator validates the entire status callback lifecycle immediately.
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 shadow-sm cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>Simulate Payment Success (Confirm Order)</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateFailure}
                disabled={isProcessing}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900 cursor-pointer"
              >
                Simulate Decline / Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isProcessing}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Cancel Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
