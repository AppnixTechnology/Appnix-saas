import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceHtml } from "@/lib/invoice-generator";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "order_id query param is required" }, { status: 400 });
    }

    let localOrder: any = null;
    try {
      localOrder = await prisma.paymentOrder.findUnique({
        where: { orderId },
        include: { plan: true },
      });
    } catch (e: any) {
      console.warn("[Invoice Route] DB query notice:", e.message);
    }

    const planName =
      localOrder?.plan?.name ||
      (orderId.includes("enterprise")
        ? "Enterprise Custom"
        : orderId.includes("pro")
        ? "Professional Tier"
        : "Starter Tier");

    const amount = localOrder ? Number(localOrder.amount) : 999;
    const date = localOrder
      ? new Date(localOrder.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

    const html = generateInvoiceHtml({
      orderId,
      invoiceNumber: `INV-${orderId.slice(-8).toUpperCase()}`,
      planName,
      amount,
      date,
      paymentMethod: localOrder?.paymentMethod || "Cashfree PG",
      cfPaymentId: localOrder?.cfPaymentId,
      workspaceId: localOrder?.workspaceId || "default",
    });

    const download = searchParams.get("download") === "true";

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ...(download
          ? { "Content-Disposition": `attachment; filename="Appnix_Invoice_${orderId}.html"` }
          : {}),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
