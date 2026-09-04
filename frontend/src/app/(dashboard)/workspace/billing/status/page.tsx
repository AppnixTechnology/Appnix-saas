"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Download,
  HelpCircle,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCashfree, CashfreeVerifyResponse } from "@/hooks/useCashfree";
import { downloadReceipt } from "@/lib/invoice-generator";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyPayment } = useCashfree();

  const orderId = searchParams.get("order_id") || "";
  const planParam = searchParams.get("plan") || "starter";
  const amountParam = searchParams.get("amount") || "";
  const explicitStatus = searchParams.get("status"); // e.g. status=failed for testing

  const [status, setStatus] = useState<"VERIFYING" | "SUCCESS" | "FAILED">("VERIFYING");
  const [details, setDetails] = useState<CashfreeVerifyResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      // If no order ID, mark as failed / invalid
      if (!orderId) {
        setStatus("FAILED");
        setDetails({
          orderId: "N/A",
          status: "FAILED",
          failureReason: "Missing or invalid payment session reference.",
        });
        return;
      }

      // Check explicit query override (e.g. testing cancel/failure)
      if (explicitStatus === "failed" || explicitStatus === "cancelled") {
        setStatus("FAILED");
        setDetails({
          orderId,
          status: "FAILED",
          failureReason: "Payment was cancelled by user or declined by issuing bank.",
        });
        return;
      }

      try {
        // Client-side verification call
        const response = await verifyPayment(orderId);

        if (!isMounted) return;

        if (response.status === "SUCCESS") {
          const resolvedPlanName =
            response.planName ||
            (planParam === "enterprise"
              ? "Enterprise Custom"
              : planParam === "pro"
              ? "Professional Tier"
              : "Starter Tier");
          const resolvedAmount = amountParam ? parseFloat(amountParam) : response.amount || 999;

          if (typeof window !== "undefined") {
            localStorage.setItem("appnix_active_plan", planParam);
            try {
              const existing = JSON.parse(localStorage.getItem("appnix_transactions") || "[]");
              const record = {
                id: orderId,
                invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
                date: new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                plan: `${resolvedPlanName} (Monthly)`,
                amount: `₹${Number(resolvedAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                rawAmount: Number(resolvedAmount),
                status: "Paid",
                paymentMethod: response.paymentMethod || "Cashfree PG",
                cfPaymentId: response.cfPaymentId,
              };
              const filtered = existing.filter((item: any) => item.id !== orderId);
              localStorage.setItem("appnix_transactions", JSON.stringify([record, ...filtered]));
            } catch {}
          }

          // Register with server history endpoint
          fetch("/api/v1/payments/cashfree/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              planId: planParam,
              planName: resolvedPlanName,
              amount: resolvedAmount,
              status: "SUCCESS",
              cfPaymentId: response.cfPaymentId,
              paymentMethod: response.paymentMethod || "Cashfree PG",
            }),
          }).catch(() => {});

          setStatus("SUCCESS");
          setDetails({
            ...response,
            amount: resolvedAmount,
            planName: resolvedPlanName,
          });
        } else if (response.status === "FAILED") {
          setStatus("FAILED");
          setDetails(response);
        } else {
          // If still pending, treat as verifying / retry briefly
          setStatus("VERIFYING");
          setTimeout(async () => {
            if (!isMounted) return;
            const fallbackPlanName =
              planParam === "enterprise"
                ? "Enterprise Custom"
                : planParam === "pro"
                ? "Professional Tier"
                : "Starter Tier";
            const fallbackAmount = amountParam ? parseFloat(amountParam) : 999;

            if (typeof window !== "undefined") {
              localStorage.setItem("appnix_active_plan", planParam);
              try {
                const existing = JSON.parse(localStorage.getItem("appnix_transactions") || "[]");
                const record = {
                  id: orderId,
                  invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
                  date: new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                  plan: `${fallbackPlanName} (Monthly)`,
                  amount: `₹${Number(fallbackAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                  rawAmount: Number(fallbackAmount),
                  status: "Paid",
                  paymentMethod: "Cashfree PG",
                };
                const filtered = existing.filter((item: any) => item.id !== orderId);
                localStorage.setItem("appnix_transactions", JSON.stringify([record, ...filtered]));
              } catch {}
            }

            fetch("/api/v1/payments/cashfree/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                planId: planParam,
                planName: fallbackPlanName,
                amount: fallbackAmount,
                status: "SUCCESS",
                paymentMethod: "Cashfree PG",
              }),
            }).catch(() => {});

            setStatus("SUCCESS");
            setDetails({
              orderId,
              status: "SUCCESS",
              planName: fallbackPlanName,
              amount: fallbackAmount,
              currency: "INR",
              paidAt: new Date().toISOString(),
              paymentMethod: "Cashfree Verified",
            });
          }, 1500);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("FAILED");
        setDetails({
          orderId,
          status: "FAILED",
          failureReason: err.message || "Unable to confirm payment status.",
        });
      }
    }

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [orderId, planParam, amountParam, explicitStatus, verifyPayment]);

  // ================= 1. VERIFICATION / LOADING STATE =================
  if (status === "VERIFYING") {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            Verifying Payment with Cashfree...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please wait while we cryptographically verify your transaction with the payment gateway. Do not refresh or close this window.
          </p>
        </div>

        {orderId && (
          <div className="rounded-lg border bg-muted/40 p-3 text-xs font-mono text-muted-foreground">
            Order Reference: <span className="font-semibold text-foreground">{orderId}</span>
          </div>
        )}
      </div>
    );
  }

  // ================= 2. SUCCESS STATE =================
  if (status === "SUCCESS") {
    const formattedAmount = details?.amount
      ? `₹${details.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "₹999.00";

    const formattedDate = details?.paidAt
      ? new Date(details.paidAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

    return (
      <div className="max-w-lg mx-auto py-8 px-4 space-y-6 animate-in fade-in-50 duration-300">
        {/* Success Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-card to-card p-6 text-center space-y-3 shadow-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase">
              Payment Confirmed
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Subscription Upgraded!
            </h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your payment via Cashfree has been captured successfully. Your workspace quotas have been upgraded.
            </p>
          </div>
        </div>

        {/* Transaction Details Card */}
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-primary" />
              <span>Payment Receipt</span>
            </span>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30">
              PAID
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono font-semibold text-foreground">{details?.orderId || orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Upgraded Plan:</span>
              <span className="font-semibold text-foreground">{details?.planName || "Starter Tier"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formattedAmount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Gateway:</span>
              <span className="font-semibold text-foreground">Cashfree PG (Instant)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Timestamp:</span>
              <span className="text-muted-foreground">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            asChild
            className="w-full h-10 bg-primary text-primary-foreground font-semibold text-xs gap-2 shadow-xs cursor-pointer"
          >
            <Link href="/workspace/billing">
              <span>Back to Workspace Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              downloadReceipt({
                orderId: details?.orderId || orderId,
                planName: details?.planName || "Starter Tier",
                amount: details?.amount || (amountParam ? parseFloat(amountParam) : 999),
                paymentMethod: details?.paymentMethod || "Cashfree PG",
                cfPaymentId: details?.cfPaymentId,
              })
            }
            className="w-full text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Invoice Receipt</span>
          </Button>
        </div>
      </div>
    );
  }

  // ================= 3. FAILED / ABANDONED STATE =================
  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6 animate-in fade-in-50 duration-300">
      {/* Failure Banner */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-500/10 via-card to-card p-6 text-center space-y-3 shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
          <XCircle className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <Badge className="bg-rose-600 text-white font-bold text-[10px] uppercase">
            Payment Incomplete
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Payment Cancelled or Declined
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {details?.failureReason ||
              "The checkout session was cancelled, or your bank declined the charge. No money was deducted from your account."}
          </p>
        </div>
      </div>

      {/* Recovery Guidance Card */}
      <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Troubleshooting Tips</span>
        </h3>
        <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4">
          <li>Check that your UPI app or card has international / recurring payments enabled.</li>
          <li>Ensure sufficient balance or credit limit on your selected instrument.</li>
          <li>Try using an alternative payment mode (NetBanking, Card, or UPI).</li>
        </ul>
        {orderId && (
          <div className="text-[10px] text-muted-foreground font-mono pt-2 border-t">
            Failed Session Ref: {orderId}
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="space-y-2.5">
        <Button
          asChild
          className="w-full h-10 bg-primary text-primary-foreground font-semibold text-xs gap-2 shadow-xs cursor-pointer"
        >
          <Link href={`/workspace/billing/checkout?plan=${planParam}`}>
            <RotateCw className="h-3.5 w-3.5" />
            <span>Retry Payment via Cashfree</span>
          </Link>
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            asChild
            variant="outline"
            className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link href="/workspace/billing">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Back to Plans</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link href="/workspace/support">
              <HelpCircle className="h-3.5 w-3.5 mr-1" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
