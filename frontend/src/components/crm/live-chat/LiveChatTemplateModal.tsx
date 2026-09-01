"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  Search,
  Check,
  Zap,
} from "lucide-react";
import { MOCK_APPROVED_TEMPLATES } from "@/lib/live-chat-mock";
import { LiveChatConversation } from "@/types/live-chat";
import { cn } from "@/lib/utils";

interface LiveChatTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: LiveChatConversation | null;
  onSendTemplate: (templateName: string, header: string, body: string) => void;
}

export function LiveChatTemplateModal({
  isOpen,
  onClose,
  conversation,
  onSendTemplate,
}: LiveChatTemplateModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("tpl-reengage-1");
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !conversation) return null;

  const filteredTemplates = MOCK_APPROVED_TEMPLATES.filter((tpl) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      tpl.displayName.toLowerCase().includes(q) ||
      tpl.name.toLowerCase().includes(q) ||
      tpl.bodyText.toLowerCase().includes(q)
    );
  });

  const selectedTemplate = MOCK_APPROVED_TEMPLATES.find((t) => t.id === selectedTemplateId);

  const formatBodyWithVariables = (bodyText: string) => {
    return bodyText
      .replace("{{1}}", conversation.name || "Customer")
      .replace("{{2}}", conversation.superFields?.customerTier || "Omnichannel CRM")
      .replace("{{3}}", conversation.uid || "948210");
  };

  const handleSend = () => {
    if (!selectedTemplate) return;
    setIsSending(true);
    const resolvedBody = formatBodyWithVariables(selectedTemplate.bodyText);
    const resolvedHeader = selectedTemplate.header.replace("{{3}}", conversation.uid || "948210");

    setTimeout(() => {
      onSendTemplate(selectedTemplate.name, resolvedHeader, resolvedBody);
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Send Approved Template Message
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Re-open the 24-hour customer care session for <strong>{conversation.name}</strong> ({conversation.identifier}).
            </DialogDescription>
          </div>

          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
            Carrier Verified
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search approved message templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8.5 h-8.5 text-xs bg-muted/20"
            />
          </div>

          {/* Template Selection Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Select Verified Template:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={cn(
                      "p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500 shadow-xs"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs">
                          {tpl.displayName}
                        </span>
                        <code className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {tpl.name}
                        </code>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] uppercase font-mono">
                          {tpl.category}
                        </Badge>
                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview text */}
                    <p className="text-[11px] text-muted-foreground bg-background p-2.5 rounded-lg border font-mono whitespace-pre-wrap">
                      {formatBodyWithVariables(tpl.bodyText)}
                    </p>

                    {/* Interactive buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {tpl.buttons.map((btn, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-muted/70 text-muted-foreground px-2 py-0.5 rounded-md border font-medium"
                        >
                          🔘 {btn}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSending || !selectedTemplate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSending ? "Dispatching Template..." : "Dispatch Approved Template"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
