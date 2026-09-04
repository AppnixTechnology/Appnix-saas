"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useCashfree } from "@/hooks/useCashfree";

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isCurrent?: boolean;
  features: string[];
  amount?: number;
  popular?: boolean;
}

export type CheckoutFlowMode = "sdk" | "checkout_page" | "hosted_redirect";

interface PlanCardProps {
  plan: PlanItem;
  billingCycle?: "monthly" | "yearly";
  flowMode?: CheckoutFlowMode;
  onUpgradeStart?: (planId: string) => void;
  onUpgradeComplete?: (planId: string) => void;
  className?: string;
}

export function PlanCard({
  plan,
  billingCycle = "monthly",
  flowMode = "sdk",
  onUpgradeStart,
  onUpgradeComplete,
  className,
}: PlanCardProps) {
  const router = useRouter();
  const { createPaymentSession, checkout, isLoaded } = useCashfree();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCurrent = Boolean(plan.isCurrent);

  const handleUpgradeClick = async () => {
    if (isCurrent || isProcessing) return;

    setErrorMessage(null);
    onUpgradeStart?.(plan.id);

    // FLOW 1: Dedicated Checkout Redirection Page
    if (flowMode === "checkout_page") {
      router.push(`/workspace/billing/checkout?plan=${encodeURIComponent(plan.id)}&cycle=${billingCycle}`);
      return;
    }

    // FLOW 2: Instant Seamless Cashfree Web SDK or Hosted Redirection
    setIsProcessing(true);

    try {
      // 1. Client-side fetch to session creation endpoint
      const session = await createPaymentSession({
        planId: plan.id,
        billingCycle,
        returnUrl:
          typeof window !== "undefined"
            ? `${window.location.origin}/workspace/billing/status?order_id={order_id}&plan=${plan.id}`
            : undefined,
      });

      if (!session?.paymentSessionId && !session?.paymentLink) {
        throw new Error("Unable to create Cashfree payment session.");
      }

      // 2. FLOW: Hosted Page Redirect Mode (Only for verified live orders)
      if (flowMode === "hosted_redirect" && session.isMock === false) {
        if (session.paymentLink && typeof window !== "undefined") {
          window.location.href = session.paymentLink;
          return;
        }
      }

      // 3. FLOW: Seamless Cashfree Web SDK Modal / Redirect (or Sandbox Simulator Fallback)
      const parsedAmount =
        plan.id === "enterprise" ? 8999 : plan.id === "pro" ? 2999 : 999;

      await checkout({
        paymentSessionId: session.paymentSessionId,
        orderId: session.orderId,
        planId: plan.id,
        planName: plan.name,
        amount: session.amount || parsedAmount,
        isMock: session.isMock,
        fallbackPaymentLink: session.paymentLink,
        redirectTarget: "modal",
        returnUrl: `${window.location.origin}/workspace/billing/status?order_id=${session.orderId}&plan=${plan.id}&amount=${session.amount || parsedAmount}`,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("appnix_active_plan", plan.id);
      }
      onUpgradeComplete?.(plan.id);
    } catch (err: any) {
      console.error("[PlanCard] Checkout initiation failed:", err);
      setErrorMessage(err.message || "Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6 flex flex-col justify-between shadow-xs transition-all relative overflow-hidden",
        isCurrent
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : plan.popular
          ? "border-purple-500/50 ring-2 ring-purple-500/20 bg-card hover:shadow-lg"
          : "bg-card hover:shadow-md border-border",
        className
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-xs flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
            {plan.name}
          </h3>
          {isCurrent && (
            <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
              Current Plan
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4 min-h-8 leading-relaxed">
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {plan.price}
            </span>
            <span className="text-xs font-normal text-muted-foreground">{plan.period}</span>
          </div>
          {billingCycle === "yearly" && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Billed annually (Save 20%)
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-2.5 mb-6 border-t pt-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Plan Features
          </p>
          {plan.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-2">
        {errorMessage && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
            {errorMessage}
          </p>
        )}

        <Button
          disabled={isCurrent || isProcessing}
          onClick={handleUpgradeClick}
          className={cn(
            "w-full text-xs font-semibold h-10 transition-all cursor-pointer flex items-center justify-center gap-2",
            isCurrent
              ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              <span>Initializing payment...</span>
            </>
          ) : isCurrent ? (
            <span>Current Active Plan</span>
          ) : (
            <>
              <span>Upgrade to this Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>

        {!isCurrent && (
          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground pt-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Secured by Cashfree Payments (UPI, Cards, NetBanking)</span>
          </div>
        )}
      </div>
    </div>
  );
}
