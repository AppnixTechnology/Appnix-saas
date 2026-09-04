import { NextRequest, NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    // 1. Cryptographic HMAC-SHA256 signature verification
    const isValidSignature = cashfree.verifyWebhookSignature(rawBody, signature, timestamp);

    if (!isValidSignature && cashfree.isLiveConfigured()) {
      console.warn("[Cashfree Webhook] Invalid HMAC-SHA256 signature detected.");
      return NextResponse.json(
        { error: "Invalid cryptographic webhook signature" },
        { status: 400 }
      );
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = payload.type || payload.event;
    const data = payload.data || {};
    const order = data.order || {};
    const payment = data.payment || {};

    const orderId = order.order_id || payload.order_id || payload.orderId;
    if (!orderId) {
      console.warn("[Cashfree Webhook] Webhook received without identifiable order_id:", payload);
      return NextResponse.json({ received: true, note: "missing_order_id" }, { status: 200 });
    }

    const paymentStatus = payment.payment_status || data.payment_status;
    const paymentId = payment.cf_payment_id ? String(payment.cf_payment_id) : undefined;
    const paymentMethod = payment.payment_group || "Cashfree Webhook";

    // 2. Intercept PAYMENT_SUCCESS_WEBHOOK
    if (
      eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
      paymentStatus === "SUCCESS" ||
      eventType === "PAYMENT_SUCCESS"
    ) {
      try {
        const localOrder = await prisma.paymentOrder.findUnique({
          where: { orderId },
          include: { plan: true },
        });

        if (localOrder) {
          const workspaceId = localOrder.workspaceId;
          const oneMonthFromNow = new Date();
          oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

          await prisma.$transaction(async (tx: any) => {
            // Update order to SUCCESS
            await tx.paymentOrder.update({
              where: { orderId },
              data: {
                status: "SUCCESS",
                cfPaymentId: paymentId || localOrder.cfPaymentId,
                paymentMethod,
                rawWebhookData: payload,
              },
            });

            // Upsert / Refresh workspace Subscription
            if (workspaceId) {
              const existingSub = await tx.subscription.findFirst({
                where: { tenantId: workspaceId },
              });

              if (existingSub) {
                await tx.subscription.update({
                  where: { id: existingSub.id },
                  data: {
                    status: "ACTIVE",
                    planRefId: localOrder.planId || undefined,
                    planName: localOrder.plan?.name || "Active Tier",
                    currentPeriodEnd: oneMonthFromNow,
                    remainingDays: 30,
                  },
                });
              } else {
                await tx.subscription.create({
                  data: {
                    tenantId: workspaceId,
                    status: "ACTIVE",
                    planId: localOrder.plan?.slug || "pro",
                    planRefId: localOrder.planId || undefined,
                    planName: localOrder.plan?.name || "Professional Tier",
                    price: `₹${Number(localOrder.amount || 2999).toLocaleString()}/mo`,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: oneMonthFromNow,
                    totalDays: 30,
                    remainingDays: 30,
                  },
                });
              }
            }
          });
        }
      } catch (txErr: any) {
        console.error("[Cashfree Webhook] Fulfillment transaction error:", txErr.message);
      }
    } else if (
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      paymentStatus === "FAILED" ||
      eventType === "PAYMENT_USER_DROPPED_WEBHOOK"
    ) {
      try {
        const status = eventType.includes("DROPPED") ? "USER_DROPPED" : "FAILED";
        await prisma.paymentOrder.updateMany({
          where: { orderId, status: "PENDING" },
          data: {
            status,
            rawWebhookData: payload,
          },
        });
      } catch (dbErr: any) {
        console.warn("[Cashfree Webhook] Error recording failed order status:", dbErr.message);
      }
    }

    // 3. Return 200 OK acknowledgment to Cashfree
    return NextResponse.json({ received: true, status: "PROCESSED" }, { status: 200 });
  } catch (err: any) {
    console.error("[Cashfree Webhook] Uncaught handler error:", err);
    return NextResponse.json(
      { error: err.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
