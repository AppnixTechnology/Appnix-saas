import { NextRequest, NextResponse } from "next/server";
import { cashfree, CashfreePaymentEntity } from "@/lib/cashfree";
import { prisma } from "@/lib/prisma";
import { saveStoredOrder } from "@/lib/transactions-store";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing required query param: order_id" }, { status: 400 });
    }

    // 1. Fetch remote order and payment details from Cashfree
    let cfOrder: any = null;
    let cfPayments: CashfreePaymentEntity[] = [];

    try {
      [cfOrder, cfPayments] = await Promise.all([
        cashfree.getOrder(orderId),
        cashfree.getOrderPayments(orderId).catch(() => []),
      ]);
    } catch (cfErr: any) {
      console.warn("[Cashfree Verify API] Remote lookup notice:", cfErr.message);
    }

    // 2. Fetch existing PaymentOrder from PostgreSQL database
    let localOrder = null;
    try {
      localOrder = await prisma.paymentOrder.findUnique({
        where: { orderId },
        include: { plan: true },
      });
    } catch (dbErr: any) {
      console.warn("[Cashfree Verify API] Database order query skipped:", dbErr.message);
    }

    // Determine order payment state
    const successfulPayment = cfPayments?.find((p) => p.payment_status === "SUCCESS");
    const isPaid =
      cfOrder?.order_status === "PAID" ||
      Boolean(successfulPayment) ||
      searchParams.get("status") === "SUCCESS" ||
      !cashfree.isLiveConfigured();

    const isFailed =
      cfOrder?.order_status === "EXPIRED" ||
      cfOrder?.order_status === "TERMINATED" ||
      searchParams.get("status") === "FAILED";

    let finalStatus: "SUCCESS" | "FAILED" | "PENDING" = isPaid
      ? "SUCCESS"
      : isFailed
      ? "FAILED"
      : "PENDING";

    const paymentId = successfulPayment?.cf_payment_id
      ? String(successfulPayment.cf_payment_id)
      : `cf_pay_${Date.now()}`;
    const paymentMethod =
      successfulPayment?.payment_group ||
      (successfulPayment?.payment_method ? Object.keys(successfulPayment.payment_method)[0] : "Cashfree UPI / NetBanking");

    const amount = localOrder ? Number(localOrder.amount) : cfOrder?.order_amount || 999;

    // 3. If PAID and local order is not already marked SUCCESS, run atomic updates
    if (finalStatus === "SUCCESS" && localOrder && localOrder.status !== "SUCCESS") {
      try {
        const workspaceId = localOrder.workspaceId;
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        const planSlug =
          orderId.includes("enterprise") ? "enterprise" : orderId.includes("pro") ? "pro" : "starter";
        const planDisplayName =
          localOrder?.plan?.name ||
          (planSlug === "enterprise"
            ? "Enterprise Custom"
            : planSlug === "pro"
            ? "Professional Tier"
            : "Starter Tier");

        // Record transaction in persistent store immediately
        saveStoredOrder({
          id: `ord_${Date.now()}`,
          orderId,
          workspaceId: workspaceId || "default",
          planId: planSlug,
          planName: planDisplayName,
          amount: Number(localOrder?.amount || amount || 999),
          currency: "INR",
          status: "SUCCESS",
          cfPaymentId: paymentId,
          paymentMethod: String(paymentMethod),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await prisma.$transaction(async (tx: any) => {
          // A. Upsert PaymentOrder as SUCCESS in Database
          await tx.paymentOrder.upsert({
            where: { orderId },
            create: {
              orderId,
              workspaceId: workspaceId || "default",
              amount: localOrder ? localOrder.amount : amount,
              currency: "INR",
              status: "SUCCESS",
              cfPaymentId: paymentId,
              paymentMethod: String(paymentMethod),
            },
            update: {
              status: "SUCCESS",
              cfPaymentId: paymentId,
              paymentMethod: String(paymentMethod),
            },
          });

          // B. Provision or Upgrade Workspace Subscription
          if (workspaceId) {
            const existingSub = await tx.subscription.findFirst({
              where: {
                OR: [{ tenantId: workspaceId }, { status: "ACTIVE" }],
              },
            });

            if (existingSub) {
              await tx.subscription.update({
                where: { id: existingSub.id },
                data: {
                  status: "ACTIVE",
                  planId: planSlug,
                  planRefId: localOrder?.planId || undefined,
                  planName: planDisplayName,
                  price: `₹${Number(localOrder?.amount || amount).toLocaleString()}/mo`,
                  currentPeriodEnd: oneMonthFromNow,
                  remainingDays: 30,
                },
              });
            } else {
              const tenantExists = await tx.tenant.findUnique({
                where: { id: workspaceId },
              });

              if (tenantExists) {
                await tx.subscription.create({
                  data: {
                    tenantId: workspaceId,
                    status: "ACTIVE",
                    planId: planSlug,
                    planRefId: localOrder?.planId || undefined,
                    planName: planDisplayName,
                    price: `₹${Number(localOrder?.amount || amount).toLocaleString()}/mo`,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: oneMonthFromNow,
                    totalDays: 30,
                    remainingDays: 30,
                  },
                });
              }
            }

            // C. Create Tax Invoice record in PostgreSQL
            const invNumber = `INV-${orderId.slice(-8).toUpperCase()}`;
            const tenantExists = await tx.tenant.findUnique({
              where: { id: workspaceId },
            });

            if (tenantExists) {
              await tx.invoice.create({
                data: {
                  tenantId: workspaceId,
                  invoiceNumber: invNumber,
                  date: new Date(),
                  plan: `${planDisplayName} (Monthly)`,
                  amount: `₹${Number(localOrder?.amount || amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                  status: "Paid",
                },
              }).catch(() => {});
            }
          }
        });
      } catch (txErr: any) {
        console.error("[Cashfree Verify API] Transaction fulfillment error:", txErr.message);
      }
    } else if (finalStatus === "FAILED" && localOrder && localOrder.status === "PENDING") {
      try {
        await prisma.paymentOrder.update({
          where: { orderId },
          data: { status: "FAILED" },
        });
      } catch (dbErr: any) {
        console.warn("[Cashfree Verify API] Error marking order failed:", dbErr.message);
      }
    }

    // 4. Plan details summary for UI presentation
    const planName =
      localOrder?.plan?.name ||
      (orderId.includes("enterprise")
        ? "Enterprise Custom"
        : orderId.includes("pro")
        ? "Professional Tier"
        : "Starter Tier");

    return NextResponse.json({
      orderId,
      status: finalStatus,
      amount,
      currency: "INR",
      planName,
      paymentMethod,
      cfPaymentId: paymentId,
      paidAt: cfOrder?.entity ? new Date().toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cashfree Verify API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Cashfree payment status" },
      { status: 500 }
    );
  }
}
