"use client";

import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  FileText,
  DollarSign,
  ShieldAlert,
  Server,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveChatMessage } from "@/types/live-chat";
import { cn } from "@/lib/utils";

interface LiveChatMessageInfoDrawerProps {
  message: LiveChatMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveChatMessageInfoDrawer({
  message,
  isOpen,
  onClose,
}: LiveChatMessageInfoDrawerProps) {
  if (!isOpen || !message) return null;

  const audit = message.carrierAudit;
  const isFailed = message.status === "failed";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card text-card-foreground h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Message Delivery Audit
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                ID: {message.id}
              </p>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. Message Payload Preview */}
          <div className="rounded-xl border p-3 bg-muted/30 space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Message Payload Content:
            </span>
            <p className="font-mono text-xs bg-background p-2.5 rounded-lg border text-foreground whitespace-pre-wrap">
              {message.text}
            </p>
          </div>

          {/* 2. Error Diagnostic Banner if Failed */}
          {isFailed && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/50 p-3.5 space-y-2 text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300 text-xs">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Carrier Delivery Rejection</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <p>
                  <strong>Carrier Error Code:</strong>{" "}
                  <code className="font-mono bg-rose-200/60 dark:bg-rose-900/60 px-1 py-0.5 rounded text-rose-800 dark:text-rose-200">
                    {audit?.errorCode || "#131047"}
                  </code>
                </p>
                <p>
                  <strong>Reason:</strong>{" "}
                  {audit?.errorReason ||
                    "Direct text delivery failed because customer care 24-hour session has expired."}
                </p>
                <p className="text-[10px] text-rose-800/80 dark:text-rose-300/80 pt-1">
                  💡 <em>Resolution:</em> Re-open the conversation by sending an approved WhatsApp or RCS template message.
                </p>
              </div>
            </div>
          )}

          {/* 3. Delivery Lifecycle Timeline */}
          <div className="rounded-xl border p-3.5 space-y-3 bg-card shadow-2xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Delivery Lifecycle Status:
            </span>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {/* Sent */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 ring-4 ring-card">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Sent from SaaS Gateway</p>
                  <p className="text-[11px] text-muted-foreground">
                    {audit?.sentAt || message.timestamp}
                  </p>
                </div>
              </div>

              {/* Delivered */}
              <div className="flex items-start gap-3 relative z-10">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-card",
                    isFailed
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  )}
                >
                  {isFailed ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {isFailed ? "Delivery Failed / Undelivered" : "Delivered to Carrier Network"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {audit?.deliveredAt || (isFailed ? "Rejected by carrier" : message.timestamp)}
                  </p>
                </div>
              </div>

              {/* Read */}
              {!isFailed && (
                <div className="flex items-start gap-3 relative z-10">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-card",
                      message.status === "read"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {message.status === "read" ? "Read by Recipient" : "Awaiting Read Receipt"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {audit?.readAt || (message.status === "read" ? "Read" : "Pending")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Carrier Network & Billing Info */}
          <div className="rounded-xl border p-3.5 space-y-2 bg-card shadow-2xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
              Network & Carrier Telemetry:
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Server className="h-3.5 w-3.5" />
                  Carrier Route:
                </span>
                <span className="font-semibold text-foreground">
                  {audit?.carrierNetwork || "WhatsApp Cloud API Direct Tier 1"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Cost Deducted:
                </span>
                <span className="font-semibold text-foreground">
                  ₹{audit?.costInr ? audit.costInr.toFixed(4) : "0.8200"} INR
                </span>
              </div>

              {audit?.templateName && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Template Code:
                  </span>
                  <code className="font-mono text-[10px] font-bold text-primary">
                    {audit.templateName}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Audit
          </Button>
        </div>
      </div>
    </div>
  );
}
