import { NextRequest, NextResponse } from "next/server";
import { cashfree, CashfreeAPIError } from "@/lib/cashfree";
import { prisma } from "@/lib/prisma";
import { saveStoredOrder } from "@/lib/transactions-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planId = "starter",
      workspaceId = "ws_default_tenant",
      customerEmail = "billing@appnix.io",
      customerPhone = "9876543210",
      customerName = "Appnix Workspace Admin",
      billingCycle = "monthly",
      returnUrl,
    } = body;

    // 1. Retrieve Plan Details (Query Database with fallback)
    let plan = null;
    try {
      plan = await prisma.plan.findFirst({
        where: {
          OR: [{ slug: planId }, { id: planId }],
        },
      });
    } catch (dbErr: any) {
      console.warn("[Cashfree Session API] Prisma plan query skipped/failed:", dbErr.message);
    }

    // Standardized fallback pricing if plan is not yet seeded in database
    let amount = 999;
    let resolvedPlanName = "Starter Tier";
    let resolvedPlanId = plan?.id || planId;

    if (plan) {
      amount = Number(plan.price);
      resolvedPlanName = plan.name;
    } else {
      if (planId === "pro") {
        amount = billingCycle === "yearly" ? 28790 : 2999;
        resolvedPlanName = "Professional Tier";
      } else if (planId === "enterprise") {
        amount = billingCycle === "yearly" ? 86390 : 8999;
        resolvedPlanName = "Enterprise Tier";
      } else {
        amount = billingCycle === "yearly" ? 9590 : 999;
        resolvedPlanName = "Starter Tier";
      }
    }

    // 2. Generate Unique Order ID
    const sanitizedWorkspaceId = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 16);
    const orderId = `order_${sanitizedWorkspaceId || "appnix"}_${Date.now()}`;

    // 3. Construct Return URL
    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const resolvedReturnUrl =
      returnUrl ||
      `${appUrl}/workspace/billing/status?order_id={order_id}&plan=${planId}`;

    // 4. Dispatch Payload to Cashfree Service
    const orderResponse = await cashfree.createOrder({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: sanitizedWorkspaceId || "cust_001",
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: customerName,
      },
      order_meta: {
        return_url: resolvedReturnUrl,
        notify_url: `${appUrl}/api/v1/payments/cashfree/webhook`,
      },
      order_note: `Appnix Subscription: ${resolvedPlanName} (${billingCycle})`,
    });

    const isMock = !cashfree.isLiveConfigured();

    // 5. Store Created Order in Database & Persistent Store with PENDING status
    saveStoredOrder({
      id: `ord_${Date.now()}`,
      orderId,
      workspaceId: sanitizedWorkspaceId || "default",
      planId,
      planName: resolvedPlanName,
      amount,
      currency: "INR",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    try {
      await prisma.paymentOrder.create({
        data: {
          orderId,
          workspaceId: sanitizedWorkspaceId || "default",
          planId: plan ? plan.id : null,
          amount,
          currency: "INR",
          paymentSessionId: orderResponse.payment_session_id,
          status: "PENDING",
        },
      });
    } catch (dbErr: any) {
      console.warn("[Cashfree Session API] Failed to record payment order in database:", dbErr.message);
    }

    // 6. Return standard Cashfree session payload to client
    return NextResponse.json({
      paymentSessionId: orderResponse.payment_session_id,
      orderId,
      amount,
      planId,
      paymentLink: orderResponse.payment_link || `/workspace/billing/checkout?plan=${planId}`,
      isMock,
    });
  } catch (error: any) {
    console.error("[Cashfree Session API] Exception:", error);

    if (error instanceof CashfreeAPIError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create Cashfree payment session" },
      { status: 500 }
    );
  }
}
