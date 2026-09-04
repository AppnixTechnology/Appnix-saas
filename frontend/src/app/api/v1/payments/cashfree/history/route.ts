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
    try {
      [dbOrders, subscription] = await Promise.all([
        prisma.paymentOrder
          .findMany({
            orderBy: { createdAt: "desc" },
            include: { plan: true },
            take: 30,
          })
          .catch(() => []),
        prisma.subscription
          .findFirst({
            where: {
              OR: [{ tenantId: workspaceId }, { status: "ACTIVE" }],
            },
            orderBy: { updatedAt: "desc" },
          })
          .catch(() => null),
      ]);
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

    // Detect latest active plan from most recent successful order
    const latestSuccessOrder = mergedOrders.find((o) => o.status === "SUCCESS");
    const activePlanSlug =
      subscription?.planId ||
      (latestSuccessOrder?.orderId.includes("enterprise")
        ? "enterprise"
        : latestSuccessOrder?.orderId.includes("starter")
        ? "starter"
        : "pro");

    return NextResponse.json({
      activePlan: {
        id: activePlanSlug,
        name:
          subscription?.planName ||
          (activePlanSlug === "enterprise"
            ? "Enterprise Custom"
            : activePlanSlug === "starter"
            ? "Starter Tier"
            : "Professional Tier"),
        price:
          subscription?.price ||
          (activePlanSlug === "enterprise"
            ? "₹8,999/mo"
            : activePlanSlug === "starter"
            ? "₹999/mo"
            : "₹2,999/mo"),
        status: subscription?.status || "ACTIVE",
        currentPeriodEnd:
          subscription?.currentPeriodEnd ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        remainingDays: subscription?.remainingDays ?? 30,
      },
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
