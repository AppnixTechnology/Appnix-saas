/**
 * Appnix SaaS Tax Invoice & Receipt Generator
 */

export interface InvoiceDetails {
  invoiceNumber?: string;
  orderId: string;
  planName: string;
  amount: number;
  currency?: string;
  date?: string;
  paymentMethod?: string;
  cfPaymentId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  workspaceId?: string;
}

export function generateInvoiceHtml(details: InvoiceDetails): string {
  const invNumber = details.invoiceNumber || `INV-${details.orderId.slice(-8).toUpperCase()}`;
  const invDate = details.date || new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const amount = Number(details.amount) || 999;
  const baseAmount = Math.round((amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((amount - baseAmount) * 100) / 100;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Appnix Tax Invoice - ${invNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      background: #f8fafc;
      color: #1e293b;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .brand h1 {
      margin: 0 0 4px 0;
      color: #0284c7;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }
    .invoice-badge {
      text-align: right;
    }
    .invoice-badge h2 {
      margin: 0 0 6px 0;
      font-size: 20px;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .status-paid {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid #bbf7d0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
      font-size: 13px;
    }
    .meta-col h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      margin: 0 0 8px 0;
    }
    .meta-col p {
      margin: 0 0 4px 0;
      color: #334155;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .table th {
      background: #f1f5f9;
      text-align: left;
      padding: 12px;
      font-size: 12px;
      text-transform: uppercase;
      color: #475569;
      border-bottom: 1px solid #cbd5e1;
    }
    .table td {
      padding: 14px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }
    .totals {
      width: 280px;
      margin-left: auto;
      margin-bottom: 30px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      color: #475569;
    }
    .totals-row.grand-total {
      border-top: 2px solid #e2e8f0;
      margin-top: 8px;
      padding-top: 10px;
      font-weight: 800;
      font-size: 16px;
      color: #0f172a;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
    .print-btn {
      display: block;
      margin: 20px auto 0 auto;
      padding: 10px 24px;
      background: #0284c7;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    @media print {
      body { padding: 0; background: white; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="brand">
        <h1>Appnix Platform</h1>
        <p>Appnix Technologies Ltd.</p>
        <p>Bangalore, Karnataka, India | GSTIN: 29AAACA1234B1Z5</p>
      </div>
      <div class="invoice-badge">
        <h2>TAX INVOICE</h2>
        <span class="status-paid">PAYMENT CONFIRMED</span>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-col">
        <h3>Billed To</h3>
        <p><strong>${details.customerName || "Appnix Workspace Member"}</strong></p>
        <p>${details.customerEmail || "billing@appnix.io"}</p>
        <p>${details.customerPhone || "+91 98765 43210"}</p>
        <p>Workspace ID: ${details.workspaceId || "ws_default"}</p>
      </div>
      <div class="meta-col" style="text-align: right;">
        <h3>Invoice Details</h3>
        <p><strong>Invoice Number:</strong> ${invNumber}</p>
        <p><strong>Order ID:</strong> ${details.orderId}</p>
        <p><strong>Invoice Date:</strong> ${invDate}</p>
        <p><strong>Payment Gateway:</strong> ${details.paymentMethod || "Cashfree PG (Instant)"}</p>
        ${details.cfPaymentId ? `<p><strong>CF Reference:</strong> ${details.cfPaymentId}</p>` : ""}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Billing Cycle</th>
          <th style="text-align: center;">HSN / SAC</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${details.planName} Subscription</strong><br />
            <span style="font-size: 11px; color: #64748b;">Omnichannel WhatsApp, RCS, and Automation Suite</span>
          </td>
          <td style="text-align: center;">Monthly</td>
          <td style="text-align: center;">998315</td>
          <td style="text-align: right;">₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Taxable Value:</span>
        <span>₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row">
        <span>IGST (18%):</span>
        <span>₹${gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Paid:</span>
        <span>₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for subscribing to Appnix CRM. This is a computer-generated tax invoice and does not require a physical signature.</p>
      <p>Questions? Contact support@appnix.co.in</p>
    </div>

    <button class="print-btn" onclick="window.print()">Print or Save as PDF</button>
  </div>
</body>
</html>`;
}

/**
 * Triggers a client-side download of the tax invoice HTML file
 */
export function downloadReceipt(details: InvoiceDetails): void {
  if (typeof window === "undefined") return;

  const html = generateInvoiceHtml(details);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const fileName = `Appnix_Tax_Invoice_${details.orderId || "receipt"}.html`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
