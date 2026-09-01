"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency2 } from "@/lib/channel-balance";

interface StatementInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  onExportCsv: () => void;
}

const INVOICE_RECORDS = [
  {
    id: "inv-2026-08",
    month: "August 2026",
    period: "01 Aug 2026 - 31 Aug 2026",
    invoiceNumber: "APNX-GST-2026-08-091",
    totalAmount: 5000.0,
    gstAmount: 762.71,
    status: "Paid",
  },
  {
    id: "inv-2026-07",
    month: "July 2026",
    period: "01 Jul 2026 - 31 Jul 2026",
    invoiceNumber: "APNX-GST-2026-07-048",
    totalAmount: 10000.0,
    gstAmount: 1525.42,
    status: "Paid",
  },
  {
    id: "inv-2026-06",
    month: "June 2026",
    period: "01 Jun 2026 - 30 Jun 2026",
    invoiceNumber: "APNX-GST-2026-06-012",
    totalAmount: 7500.0,
    gstAmount: 1144.07,
    status: "Paid",
  },
];

export function StatementInvoiceModal({
  isOpen,
  onClose,
  channelName,
  onExportCsv,
}: StatementInvoiceModalProps) {
  const handlePrint = (inv: typeof INVOICE_RECORDS[0]) => {
    alert(`Generating printable PDF Statement for ${inv.month} (${inv.invoiceNumber})...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Download Statements & Tax Invoices
              </DialogTitle>
              <DialogDescription className="text-xs">
                Monthly GST Invoices and Usage Statements for {channelName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Quick statement download */}
          <div className="rounded-xl border bg-muted/30 p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-foreground">Complete Ledger Export</p>
              <p className="text-[11px] text-muted-foreground">
                Export all raw per-message micro-deductions and top-up records.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onExportCsv();
                onClose();
              }}
              className="gap-1.5 shrink-0 text-xs h-8"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export All CSV</span>
            </Button>
          </div>

          {/* Monthly Invoices List */}
          <div className="space-y-2">
            <span className="font-bold text-foreground text-xs block">
              Monthly GST Tax Invoices
            </span>
            <div className="space-y-2">
              {INVOICE_RECORDS.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-xs">{inv.month}</span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Invoice: {inv.invoiceNumber} • Period: {inv.period}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Total: <span className="font-mono font-semibold text-foreground">{formatCurrency2(inv.totalAmount)}</span> (GST: {formatCurrency2(inv.gstAmount)})
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePrint(inv)}
                      className="h-8 text-xs gap-1"
                    >
                      <Printer className="h-3 w-3" />
                      <span>Print PDF</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        onExportCsv();
                      }}
                      className="bg-primary text-primary-foreground h-8 text-xs gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>CSV</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
