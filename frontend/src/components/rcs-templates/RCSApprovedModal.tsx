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
  Radio,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { RCSTemplate } from "@/types/rcs-template";
import { useRouter } from "next/navigation";

interface RCSApprovedModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: RCSTemplate | null;
  onDuplicate?: (template: RCSTemplate) => void;
}

export function RCSApprovedModal({
  isOpen,
  onClose,
  template,
  onDuplicate,
}: RCSApprovedModalProps) {
  const router = useRouter();

  if (!template) return null;

  const handleUseInCampaign = () => {
    onClose();
    router.push(`/crm/bulk-campaign?templateId=${template.id}&channel=RCS`);
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
                Carrier Approved & Live
              </DialogTitle>
              <DialogDescription className="text-xs">
                Verified across Google Jibe, Jio, Airtel, and Vi RCS Hubs
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
                  RCS ID: <span className="font-mono">{template.rcsTemplateId || "rcs_tpl_live"}</span>
                </p>
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
                Carrier Verified
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Category</span>
                <span className="font-semibold">{template.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Message Type</span>
                <span className="font-semibold">{template.messageType}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Agent</span>
                <span className="font-semibold truncate block">{template.agentName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Throughput</span>
                <span className="font-semibold text-emerald-600">250 msg/sec</span>
              </div>
            </div>
          </div>

          {/* Carrier Verification Tags */}
          <div className="rounded-xl border bg-card p-3.5 space-y-2 shadow-xs">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Radio className="h-3.5 w-3.5 text-emerald-600" /> Carrier Registry Whitelist
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Google Jibe Hub</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Reliance Jio RCS</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Bharti Airtel RCS</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Vodafone Idea (Vi)</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUseInCampaign}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Launch in Campaign</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
