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
  CheckCircle2,
  Send,
  Copy,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { WhatsAppTemplate } from "@/types/whatsapp-template";
import { useRouter } from "next/navigation";

interface ApprovedTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WhatsAppTemplate | null;
  onDuplicate?: (template: WhatsAppTemplate) => void;
}

export function ApprovedTemplateModal({
  isOpen,
  onClose,
  template,
  onDuplicate,
}: ApprovedTemplateModalProps) {
  const router = useRouter();

  if (!template) return null;

  const handleUseInCampaign = () => {
    onClose();
    router.push(`/campaigns/new?templateId=${template.id}&channel=WHATSAPP`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Template Approved & Live
              </DialogTitle>
              <DialogDescription className="text-xs">
                Verified by Meta for WhatsApp Broadcasts
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Approved Summary Card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-foreground font-mono">
                  {template.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Meta ID: <span className="font-mono">{template.metaTemplateId || "meta_tpl_live"}</span>
                </p>
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
                Approved
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Category</span>
                <span className="font-semibold">{template.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Language</span>
                <span className="font-semibold">{template.language}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Quality Rating</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> High (Green)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Approved Date</span>
                <span className="font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {template.approvedAt ? new Date(template.approvedAt).toLocaleDateString() : "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Ready for Automation & Campaigns
            </p>
            <p>
              This template is active and ready to be used in Broadcast Campaigns, Automated Bot Workflows, and CRM Live Chat.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
          {onDuplicate && (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onDuplicate(template);
              }}
              className="text-xs gap-1"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate
            </Button>
          )}
          <Button
            onClick={handleUseInCampaign}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" /> Use in Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
