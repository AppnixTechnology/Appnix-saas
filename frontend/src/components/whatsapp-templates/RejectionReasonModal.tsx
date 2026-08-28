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
  XCircle,
  AlertOctagon,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Edit,
} from "lucide-react";
import { WhatsAppTemplate } from "@/types/whatsapp-template";
import { useRouter } from "next/navigation";

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WhatsAppTemplate | null;
  onEdit?: (template: WhatsAppTemplate) => void;
}

export function RejectionReasonModal({
  isOpen,
  onClose,
  template,
  onEdit,
}: RejectionReasonModalProps) {
  const router = useRouter();

  if (!template) return null;

  const rejection = template.rejectionDetails || {
    code: "POLICY_VIOLATION_OR_CATEGORY_MISMATCH",
    reason:
      template.rejectionReason ||
      "The submitted template did not meet Meta's WhatsApp Message Template Guidelines.",
    recommendation:
      "Review the category, remove promotional keywords if submitting as Utility, and verify variable sequential numbering.",
    date: template.updatedAt || new Date().toISOString(),
  };

  const handleEditAndResubmit = () => {
    onClose();
    if (onEdit) {
      onEdit(template);
    } else {
      router.push(`/channels/whatsapp/templates/${template.id}/edit`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-rose-600 dark:text-rose-400">
                Meta Template Rejected
              </DialogTitle>
              <DialogDescription className="text-xs">
                Template: <span className="font-mono font-semibold">{template.name}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main Error Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:bg-rose-950/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <AlertOctagon className="h-4 w-4 text-rose-600" />
                Rejection Reason
              </span>
              <Badge variant="outline" className="border-rose-300 text-rose-700 dark:text-rose-300 text-[10px] font-mono">
                {rejection.code}
              </Badge>
            </div>
            <p className="text-rose-950 dark:text-rose-100 text-xs leading-relaxed font-medium">
              {rejection.reason}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <HelpCircle className="h-4 w-4 text-primary" /> Recommended Fix:
            </h4>
            <p className="text-muted-foreground leading-relaxed text-xs">
              {rejection.recommendation}
            </p>
          </div>

          {/* Meta Policy Guidelines Reminder */}
          <div className="rounded-lg bg-muted/40 p-3 text-muted-foreground space-y-1.5 text-[11px]">
            <p className="font-semibold text-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" /> Common Meta Rejection Triggers:
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Submitting marketing discounts / sales pitches under <strong>Utility</strong> category.</li>
              <li>Floating variables without surrounding descriptive context (e.g. `Your code is &#123;&#123;1&#125;&#125; &#123;&#123;2&#125;&#125;`).</li>
              <li>Using non-sequential variables like `&#123;&#123;1&#125;&#125;` and `&#123;&#123;3&#125;&#125;` with gaps.</li>
              <li>Generic shortened URLs (like bit.ly) instead of verified brand domains.</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            onClick={handleEditAndResubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit & Resubmit Template</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
