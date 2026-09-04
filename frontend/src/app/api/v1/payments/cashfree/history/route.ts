import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStoredOrders, saveStoredOrder } from "@/lib/transactions-store";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspace_id") || "default";

    // 1. Fetch from persistent file store
    const fileOrders = getStoredOrders();

    // 2. Fetch from PostgreSQL database
    let dbOrders: any[] = [];
    let subscription: any = null;
    let tenant: any = null;
    try {
      const queryTenantId = workspaceId && workspaceId !== "default" ? workspaceId : null;
      if (queryTenantId) {
        [dbOrders, subscription, tenant] = await Promise.all([
          prisma.paymentOrder
            .findMany({
              where: { workspaceId: queryTenantId },
              orderBy: { createdAt: "desc" },
              take: 30,
            })
            .catch(() => []),
          prisma.subscription
            .findFirst({
              where: {
                tenantId: queryTenantId,
              },
              orderBy: { createdAt: "desc" },
            })
            .catch(() => null),
          prisma.tenant
            .findUnique({
              where: { id: queryTenantId },
              select: { id: true, status: true },
            })
            .catch(() => null),
        ]);
      }
    } catch (e: any) {
      console.warn("[Billing History API] DB lookup notice:", e.message);
    }

    // 3. Merge and deduplicate by orderId
    const orderMap = new Map<string, any>();

    // Add file orders first
    if (Array.isArray(fileOrders)) {
      for (const ord of fileOrders) {
        orderMap.set(ord.orderId, {
          id: ord.orderId,
          orderId: ord.orderId,
          planName: ord.planName,
          amount: ord.amount,
          status: ord.status,
          cfPaymentId: ord.cfPaymentId,
          paymentMethod: ord.paymentMethod,
          createdAt: ord.createdAt,
        });
      }
    }

    // Overlay database orders
    if (Array.isArray(dbOrders)) {
      for (const ord of dbOrders) {
        orderMap.set(ord.orderId, {
          id: ord.orderId,
          orderId: ord.orderId,
          planName: ord.plan?.name || ord.planName,
          amount: Number(ord.amount),
          status: ord.status,
          cfPaymentId: ord.cfPaymentId,
          paymentMethod: ord.paymentMethod,
          createdAt: ord.createdAt,
        });
      }
    }

    const mergedOrders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 4. Map to clean InvoiceItem format
    const invoices = mergedOrders.map((ord) => {
      const planName =
        ord.planName ||
        (ord.orderId.includes("enterprise")
          ? "Enterprise Custom (Monthly)"
          : ord.orderId.includes("pro")
          ? "Professional Tier (Monthly)"
          : "Starter Tier (Monthly)");

      return {
        id: ord.orderId,
        invoiceNumber: `INV-${ord.orderId.slice(-8).toUpperCase()}`,
        date: new Date(ord.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        plan: planName.includes("(") ? planName : `${planName} (Monthly)`,
        amount: `₹${Number(ord.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        rawAmount: Number(ord.amount),
        status: ord.status === "SUCCESS" ? "Paid" : ord.status === "PENDING" ? "Pending" : "Failed",
        cfPaymentId: ord.cfPaymentId,
        paymentMethod: ord.paymentMethod || "Cashfree PG",
      };
    });

    const now = new Date();
    const isTenantSuspended = tenant?.status === "SUSPENDED";
    const isTenantCancelled = tenant?.status === "CANCELLED";
    const isSubCancelled = subscription?.status === "CANCELLED";
    const isSubSuspended = (subscription as any)?.status === "SUSPENDED";

    const isCancelled = isTenantCancelled || isSubCancelled;
    const isSuspended = isTenantSuspended || isSubSuspended;
    const isExpired =
      subscription?.status === "PAST_DUE" ||
      subscription?.status === "EXPIRED" ||
      (subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) < now : false);

    const hasActiveSubscription =
      Boolean(subscription) &&
      !isExpired &&
      !isCancelled &&
      !isSuspended &&
      (subscription.status === "ACTIVE" || subscription.status === "TRIALING");

    const remainingDays = subscription?.currentPeriodEnd
      ? Math.max(
          0,
          Math.ceil(
            (new Date(subscription.currentPeriodEnd).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

    const resolvedStatus = isCancelled
      ? "CANCELLED"
      : isSuspended
      ? "SUSPENDED"
      : isExpired
      ? "EXPIRED"
      : subscription?.status || (hasActiveSubscription ? "ACTIVE" : "NONE");

    return NextResponse.json({
      hasActiveSubscription,
      isExpired,
      isCancelled,
      isSuspended,
      status: resolvedStatus,
      activePlan: hasActiveSubscription
        ? {
            id: subscription.planId,
            name: subscription.planName,
            price: subscription.price,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            remainingDays,
          }
        : null,
      invoices,
    });
  } catch (error: any) {
    console.error("[Billing History API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, planId, planName, amount, status = "SUCCESS", cfPaymentId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    saveStoredOrder({
      id: `ord_${Date.now()}`,
      orderId,
      workspaceId: "default",
      planId: planId || "starter",
      planName: planName || "Starter Tier",
      amount: Number(amount) || 999,
      currency: "INR",
      status,
      cfPaymentId,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, orderId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
