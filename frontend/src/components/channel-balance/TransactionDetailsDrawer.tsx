"use client";

import { useState } from "react";
import {
  X,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Receipt,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  FileText,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChannelTransaction,
  ConversationCategory,
} from "@/types/channel-balance";
import {
  formatCurrency4,
  formatCurrency2,
  CATEGORY_BADGE_STYLES,
} from "@/lib/channel-balance";
import { cn } from "@/lib/utils";

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ChannelTransaction | null;
  onViewRefundTxn?: (txnId: string) => void;
}

export function TransactionDetailsDrawer({
  isOpen,
  onClose,
  transaction,
  onViewRefundTxn,
}: TransactionDetailsDrawerProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedWamid, setCopiedWamid] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyWamid = () => {
    if (transaction.metaBillingId) {
      navigator.clipboard.writeText(transaction.metaBillingId);
      setCopiedWamid(true);
      setTimeout(() => setCopiedWamid(false), 2000);
    }
  };

  const categoryConfig = CATEGORY_BADGE_STYLES[transaction.category] || {
    label: transaction.category,
    style: "bg-muted text-muted-foreground",
  };

  const isDebit = transaction.type === "DEBIT";
  const isCredit = transaction.type === "CREDIT";
  const isRefund = transaction.type === "REFUND";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Slide-over sheet panel */}
      <div className="w-full max-w-lg bg-card text-card-foreground h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-foreground">
                {transaction.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy Transaction ID"
                className="text-muted-foreground hover:text-foreground p-1"
              >
                {copiedId ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(transaction.timestamp).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Main Amount & Status Card */}
          <div
            className={cn(
              "rounded-2xl p-4 border space-y-3",
              isDebit
                ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900"
                : isRefund
                ? "bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900"
                : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                {isDebit ? "Total Debited Amount" : isRefund ? "Auto-Refund Credited" : "Funds Added"}
              </span>
              <Badge
                variant="outline"
                className={cn("text-[10px] font-semibold", categoryConfig.style)}
              >
                {categoryConfig.label}
              </Badge>
            </div>

            <div className="flex items-baseline justify-between">
              <p
                className={cn(
                  "text-3xl font-extrabold font-mono",
                  isDebit
                    ? "text-rose-600 dark:text-rose-400"
                    : isRefund
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {isDebit ? "-" : "+"} {formatCurrency4(transaction.amount)}
              </p>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Closing Balance</span>
                <span className="font-mono font-bold text-foreground text-xs">
                  {formatCurrency4(transaction.closingBalance)}
                </span>
              </div>
            </div>

            {/* Delivery Status Indicator */}
            <div className="pt-2 border-t flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Delivery / Service Status:</span>
              <span className="font-semibold flex items-center gap-1">
                {transaction.deliveryStatus === "DELIVERED" || transaction.deliveryStatus === "READ" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : transaction.deliveryStatus === "FAILED" ? (
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                )}
                <span
                  className={
                    transaction.deliveryStatus === "DELIVERED" || transaction.deliveryStatus === "READ"
                      ? "text-emerald-600 font-bold"
                      : transaction.deliveryStatus === "FAILED"
                      ? "text-rose-600 font-bold"
                      : "text-blue-600 font-bold"
                  }
                >
                  {transaction.deliveryStatus}
                </span>
              </span>
            </div>
          </div>

          {/* Auto-Refund Rule Note */}
          {transaction.deliveryStatus === "FAILED" && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                <span>24-Hour Auto-Refund Protection Active</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                {transaction.failedReason ||
                  "Carrier message delivery timed out. A 100% credit refund was automatically dispatched to your channel balance."}
              </p>
              {transaction.refundTxnId && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onViewRefundTxn && onViewRefundTxn(transaction.refundTxnId!)}
                    className="text-primary hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>View Refund Transaction ({transaction.refundTxnId})</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rate & Fee Breakdown (Sub-Ledger Details) */}
          {isDebit && (
            <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
              <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-primary" /> Cost & Tax Breakdown
              </h4>

              <div className="space-y-2 text-xs divide-y divide-border">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Base Meta / Carrier Rate</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency4(transaction.baseRate ?? transaction.amount * 0.92)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Platform Infrastructure & Webhook Routing</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency4(transaction.platformFee ?? transaction.amount * 0.05)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Applicable GST / Tax</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency4(transaction.taxAmount ?? transaction.amount * 0.03)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 font-bold text-foreground">
                  <span>Total Debit</span>
                  <span className="font-mono text-sm text-rose-600 dark:text-rose-400">
                    - {formatCurrency4(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recipient & Campaign Information */}
          <div className="rounded-xl border bg-card p-4 space-y-3 shadow-xs">
            <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" /> Recipient & Message Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Recipient Phone</span>
                <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {transaction.recipientPhone}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Recipient Name</span>
                <span className="font-semibold text-foreground">
                  {transaction.recipientName || "Registered Contact"}
                </span>
              </div>
              {transaction.campaignName && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase">Campaign Name</span>
                  <span className="font-semibold text-foreground">{transaction.campaignName}</span>
                </div>
              )}
              {transaction.templateName && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase">Template Used</span>
                  <span className="font-mono text-primary font-semibold">{transaction.templateName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payload Snippet Preview */}
          {transaction.messagePayloadSnippet && (
            <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
              <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Message Payload Snippet
              </h4>
              <div className="p-3 bg-muted/40 rounded-lg font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
                {transaction.messagePayloadSnippet}
              </div>
            </div>
          )}

          {/* Meta Cloud API Reference Details */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-2 text-xs">
            <span className="font-bold text-foreground block">Provider Billing Traceability</span>
            {transaction.metaBillingId && (
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block">Meta Message WAMID:</span>
                <div className="flex items-center justify-between p-2 bg-background rounded-lg border font-mono text-[10px] break-all">
                  <span className="truncate">{transaction.metaBillingId}</span>
                  <button
                    type="button"
                    onClick={handleCopyWamid}
                    className="text-muted-foreground hover:text-foreground shrink-0 ml-2"
                  >
                    {copiedWamid ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>WABA Identifier:</span>
              <span className="font-mono font-medium text-foreground">{transaction.wabaId || "waba_984102910842"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Drawer
          </Button>
        </div>
      </div>
    </div>
  );
}
