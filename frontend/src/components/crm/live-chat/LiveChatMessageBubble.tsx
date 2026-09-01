"use client";

import { useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  Info,
  Copy,
  Share2,
  FileText,
  Sparkles,
} from "lucide-react";
import { LiveChatMessage } from "@/types/live-chat";
import { cn } from "@/lib/utils";

interface LiveChatMessageBubbleProps {
  message: LiveChatMessage;
  onOpenMessageInfo: (message: LiveChatMessage) => void;
}

export function LiveChatMessageBubble({
  message,
  onOpenMessageInfo,
}: LiveChatMessageBubbleProps) {
  const isAgent = message.sender === "agent";
  const isSystem = message.sender === "system" || message.sender === "bot";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-3">
        <div className="rounded-full bg-muted/70 border px-3 py-1 text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%] group relative animate-in fade-in duration-150",
        isAgent ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {/* Sender Name if Agent */}
      {isAgent && message.senderName && (
        <span className="text-[10px] text-muted-foreground mb-0.5 px-1 font-semibold">
          {message.senderName}
        </span>
      )}

      {/* Message Bubble Container */}
      <div
        className={cn(
          "rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative transition-all",
          isAgent
            ? "bg-primary text-primary-foreground rounded-br-xs"
            : "bg-card border text-foreground rounded-bl-xs",
          message.status === "failed" && "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100"
        )}
      >
        {/* Template Notification Header (if sent via approved template) */}
        {message.isTemplate && (
          <div className="mb-1.5 pb-1 border-b border-primary-foreground/20 flex items-center justify-between gap-2 text-[10px] opacity-90">
            <span className="font-bold flex items-center gap-1">
              <FileText className="h-3 w-3" />
              WhatsApp / Carrier Approved Template
            </span>
            <code className="font-mono text-[9px] bg-black/10 px-1 rounded">
              {message.templateName}
            </code>
          </div>
        )}

        {/* Text Content */}
        <p className="leading-relaxed whitespace-pre-wrap select-text">
          {message.text}
        </p>

        {/* Message Action Hover Menu */}
        <div
          className={cn(
            "absolute -top-3 right-2 hidden group-hover:flex items-center gap-0.5 rounded-lg border bg-card/95 backdrop-blur-xs p-0.5 shadow-md text-foreground z-10 text-[10px]",
            isAgent ? "right-2" : "left-2"
          )}
        >
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy message"}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={() => onOpenMessageInfo(message)}
            title="Message Delivery Audit"
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            <Info className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Timestamp & Delivery Receipt */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 px-1">
        <span>{message.timestamp}</span>

        {isAgent && (
          <div className="flex items-center">
            {message.status === "sending" && <Clock className="h-3 w-3 animate-spin text-muted-foreground" />}
            {message.status === "sent" && <Check className="h-3 w-3 text-muted-foreground" />}
            {message.status === "delivered" && <CheckCheck className="h-3 w-3 text-muted-foreground" />}
            {message.status === "read" && <CheckCheck className="h-3 w-3 text-emerald-500 font-bold" />}
            {message.status === "failed" && (
              <button
                type="button"
                onClick={() => onOpenMessageInfo(message)}
                className="flex items-center gap-0.5 text-rose-500 font-semibold hover:underline"
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Failed</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
