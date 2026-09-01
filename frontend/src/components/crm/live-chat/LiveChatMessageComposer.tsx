"use client";

import { useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Sparkles,
  Lock,
  FileText,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveChatConversation } from "@/types/live-chat";
import { cn } from "@/lib/utils";

interface LiveChatMessageComposerProps {
  conversation: LiveChatConversation;
  onSendMessage: (text: string) => void;
  onOpenTemplateModal: () => void;
}

const QUICK_REPLIES = [
  "Hi! How can I help you today?",
  "Here is our pricing sheet: https://appnix.io/pricing",
  "I have escalated your inquiry to our senior solutions engineer.",
  "Thank you for contacting Appnix! Let us know if you need anything else.",
];

export function LiveChatMessageComposer({
  conversation,
  onSendMessage,
  onOpenTemplateModal,
}: LiveChatMessageComposerProps) {
  const [inputText, setInputText] = useState("");
  const isSessionActive = conversation.session.isActive;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !isSessionActive) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t bg-card shrink-0 space-y-2 select-none">
      {/* 1. Quick Replies Bar (if active) */}
      {isSessionActive && (
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
          <span className="text-muted-foreground text-[10px] shrink-0 font-bold uppercase">
            Quick:
          </span>
          {QUICK_REPLIES.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(qr)}
              className="px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary shrink-0 transition-colors truncate max-w-56 text-[10px]"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* 2. Session-Enforced Input Area */}
      {!isSessionActive ? (
        /* Expired Session State */
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs">24-Hour Customer Care Window Closed</p>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80">
                Direct text messaging is disabled by carrier policy. Send an approved template to re-open.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onOpenTemplateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 gap-1.5 shadow-sm shrink-0 w-full sm:w-auto"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Send Approved Template</span>
          </Button>
        </div>
      ) : (
        /* Active 24h Session Input */
        <form onSubmit={handleSend} className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8.5 w-8.5 text-muted-foreground hover:text-foreground shrink-0 hidden sm:inline-flex"
              title="Attach media or document"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="relative flex-1">
              <Input
                placeholder={`Message ${conversation.name} on ${conversation.channel.toUpperCase()}... (Press Enter to send)`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-9 text-xs bg-muted/20 pr-9"
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                title="Insert emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={!inputText.trim()}
              className="h-9 px-3.5 bg-primary text-primary-foreground shrink-0 gap-1.5 text-xs shadow-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Replying via {conversation.channel.toUpperCase()} Official API Gateway</span>
            </span>
            <span className="hidden sm:inline">Shift + Enter for new line</span>
          </div>
        </form>
      )}
    </div>
  );
}
