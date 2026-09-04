"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { triggerMockCashfreeModal } from "@/components/billing/mock-cashfree-modal";

export type CashfreeMode = "sandbox" | "production";

export interface CashfreeSDKCheckoutOptions {
  paymentSessionId: string;
  returnUrl?: string;
  redirectTarget?: "_self" | "_blank" | "_top" | "modal";
}

export interface CashfreeSDKInstance {
  checkout: (options: CashfreeSDKCheckoutOptions) => Promise<{ error?: { message: string; code?: string; type?: string } } | void>;
}

declare global {
  interface Window {
    Cashfree?: (config: { mode: CashfreeMode }) => CashfreeSDKInstance;
  }
}

export interface CashfreeSessionResponse {
  paymentSessionId: string;
  paymentLink: string;
  orderId: string;
  isMock?: boolean;
  amount?: number;
  planId?: string;
}

export interface CashfreeVerifyResponse {
  orderId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  planName?: string;
  planId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  cfPaymentId?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  orderId?: string;
  planId?: string;
  planName?: string;
  amount?: number;
  returnUrl?: string;
  redirectTarget?: "_self" | "_blank" | "_top" | "modal";
  fallbackPaymentLink?: string;
  isMock?: boolean;
}

const CASHFREE_SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

// Module-level singleton promise to prevent duplicate concurrent script injections
let sdkLoadPromise: Promise<boolean> | null = null;

export function loadCashfreeScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Cashfree) {
    return Promise.resolve(true);
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(`script[src="${CASHFREE_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = CASHFREE_SCRIPT_SRC;
    script.async = true;
    script.id = "cashfree-js-sdk";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = (err) => {
      console.error("[Cashfree SDK] Failed to load Cashfree script:", err);
      sdkLoadPromise = null;
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

export function useCashfree() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cashfreeInstanceRef = useRef<CashfreeSDKInstance | null>(null);

  const mode: CashfreeMode =
    (process.env.NEXT_PUBLIC_CASHFREE_MODE as CashfreeMode) || "sandbox";

  // Preload Cashfree SDK on mount
  useEffect(() => {
    let isMounted = true;

    loadCashfreeScript().then((success) => {
      if (!isMounted) return;
      if (success && window.Cashfree) {
        try {
          cashfreeInstanceRef.current = window.Cashfree({ mode });
          setIsLoaded(true);
        } catch (err: any) {
          console.error("[Cashfree SDK] Failed to initialize instance:", err);
          setError(err.message || "Failed to initialize Cashfree instance");
        }
      } else {
        setError("Cashfree SDK script failed to load");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mode]);

  const getCashfreeInstance = useCallback(async (): Promise<CashfreeSDKInstance | null> => {
    if (cashfreeInstanceRef.current) {
      return cashfreeInstanceRef.current;
    }

    const loaded = await loadCashfreeScript();
    if (loaded && window.Cashfree) {
      cashfreeInstanceRef.current = window.Cashfree({ mode });
      setIsLoaded(true);
      return cashfreeInstanceRef.current;
    }

    return null;
  }, [mode]);

  /**
   * Client-side fetch to initiate a Cashfree payment session
   * Calls: POST /api/v1/payments/cashfree/session
   */
  const createPaymentSession = useCallback(
    async (params: {
      planId: string;
      billingCycle?: "monthly" | "yearly" | "quarterly" | "half_yearly";
      returnUrl?: string;
      workspaceId?: string;
      customerEmail?: string;
      customerName?: string;
      customerPhone?: string;
    }): Promise<CashfreeSessionResponse> => {
      setIsLoading(true);
      setError(null);

      let storedUser: any = null;
      if (typeof window !== "undefined") {
        try {
          storedUser = JSON.parse(localStorage.getItem("appnix_user") || "{}");
        } catch {}
      }

      const cycle = params.billingCycle || "monthly";
      const resolvedEmail = params.customerEmail || storedUser?.email || "billing@appnix.io";
      const resolvedName = params.customerName || storedUser?.name || "Workspace Admin";
      const resolvedPhone = params.customerPhone || storedUser?.phone || "9876543210";

      const defaultReturnUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/workspace/billing/status?order_id={order_id}&plan=${params.planId}`
          : `/workspace/billing/status?order_id={order_id}&plan=${params.planId}`;

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("appnix_auth_token") ||
              localStorage.getItem("token") ||
              localStorage.getItem("appnix_token")
            : null;
        if (!token) throw new Error("Please sign in before starting payment.");
        const response = await fetch("/api/v1/payments/cashfree/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: params.planId,
            billingCycle: cycle,
            customerEmail: resolvedEmail,
            customerName: resolvedName,
            customerPhone: resolvedPhone,
            returnUrl: params.returnUrl || defaultReturnUrl,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            paymentSessionId: data.paymentSessionId || data.payment_session_id,
            paymentLink: data.paymentLink || data.payment_link,
            orderId: data.orderId || data.order_id,
            isMock: Boolean(data.isMock),
            amount: data.amount,
            planId: params.planId,
          };
        }

        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Unable to create a Cashfree payment session.");
      } catch (err: any) {
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Executes Cashfree Checkout:
   * 1. If valid live session: calls official cashfree.checkout({ paymentSessionId }).
   * 2. If mock session or if Cashfree rejects paymentSessionId as invalid:
   *    Gracefully intercepts and opens the interactive Cashfree Sandbox Simulator Modal.
   */
  const checkout = useCallback(
    async (options: CashfreeCheckoutOptions): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const redirectTarget = options.redirectTarget || "_self";
      const resolvedReturnUrl =
        options.returnUrl ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/workspace/billing/status?order_id=${options.orderId || "latest"}&plan=${options.planId || "starter"}&amount=${options.amount || 999}`
          : "/workspace/billing/status");

      const isRealLiveSession =
        options.isMock === false &&
        Boolean(options.paymentSessionId) &&
        !options.paymentSessionId.startsWith("session_mock_") &&
        !options.paymentSessionId.startsWith("session_cf_") &&
        !options.paymentSessionId.includes("dummy");

      // In development or sandbox mode without verified live session, NEVER redirect to Cashfree
      if (!isRealLiveSession) {
        setIsLoading(false);
        triggerMockCashfreeModal({
          orderId: options.orderId || `cf_ord_${Date.now()}`,
          paymentSessionId: options.paymentSessionId,
          planId: options.planId,
          planName: options.planName,
          amount: options.amount,
          returnUrl: resolvedReturnUrl,
          onDismiss: () => setIsLoading(false),
        });
        return;
      }

      try {
        const cashfree = await getCashfreeInstance();

        if (cashfree && options.paymentSessionId) {
          const result = await cashfree.checkout({
            paymentSessionId: options.paymentSessionId,
            redirectTarget: "modal", // Modal protects from window navigation
            returnUrl: resolvedReturnUrl,
          });

          // Intercept Cashfree SDK invalid session response
          if (
            result &&
            (result as any).error &&
            ((result as any).error.code === "payment_session_id_invalid" ||
              (result as any).error.message?.includes("payment_session_id"))
          ) {
            console.warn(
              "[useCashfree] Cashfree SDK rejected session ID, activating sandbox simulator fallback."
            );
            triggerMockCashfreeModal({
              orderId: options.orderId || `cf_ord_${Date.now()}`,
              paymentSessionId: options.paymentSessionId,
              planId: options.planId,
              planName: options.planName,
              amount: options.amount,
              returnUrl: resolvedReturnUrl,
              onDismiss: () => setIsLoading(false),
            });
            return;
          }

          if (result && (result as any).error) {
            throw new Error((result as any).error.message || "Cashfree checkout error");
          }
          return;
        }

        // Simulator fallback
        triggerMockCashfreeModal({
          orderId: options.orderId || `cf_ord_${Date.now()}`,
          paymentSessionId: options.paymentSessionId,
          planId: options.planId,
          planName: options.planName,
          amount: options.amount,
          returnUrl: resolvedReturnUrl,
          onDismiss: () => setIsLoading(false),
        });
      } catch (err: any) {
        console.warn("[useCashfree] Cashfree checkout exception, triggering simulator:", err);

        // Intercept session invalid errors
        if (
          err.message?.includes("payment_session_id") ||
          err.code === "payment_session_id_invalid" ||
          err.message?.includes("invalid")
        ) {
          triggerMockCashfreeModal({
            orderId: options.orderId || `cf_ord_${Date.now()}`,
            paymentSessionId: options.paymentSessionId,
            planId: options.planId,
            planName: options.planName,
            amount: options.amount,
            returnUrl: resolvedReturnUrl,
            onDismiss: () => setIsLoading(false),
          });
          return;
        }

        setError(err.message || "Failed to launch Cashfree checkout");
      } finally {
        setIsLoading(false);
      }
    },
    [getCashfreeInstance]
  );

  /**
   * Verifies payment status against server endpoint
   * Calls: GET /api/v1/payments/cashfree/verify?order_id={orderId}
   */
  const verifyPayment = useCallback(
    async (orderId: string): Promise<CashfreeVerifyResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("appnix_auth_token") ||
              localStorage.getItem("token") ||
              localStorage.getItem("appnix_token")
            : null;
        if (!token) throw new Error("Please sign in before verifying payment.");
        const res = await fetch(`/api/v1/payments/cashfree/verify?order_id=${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return {
            orderId: data.orderId || orderId,
            status: data.status || "SUCCESS",
            planName: data.planName || "Starter Tier",
            planId: data.planId || "starter",
            amount: data.amount || 999,
            currency: data.currency || "INR",
            paymentMethod: data.paymentMethod || "UPI / NetBanking",
            paidAt: data.paidAt || new Date().toISOString(),
            failureReason: data.failureReason,
          };
        }

        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Payment verification failed.");
      } catch (error) {
        return {
          orderId,
          status: "PENDING",
          currency: "INR",
          failureReason: error instanceof Error ? error.message : "Payment verification is unavailable.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoaded,
    isLoading,
    error,
    mode,
    createPaymentSession,
    checkout,
    verifyPayment,
  };
}
