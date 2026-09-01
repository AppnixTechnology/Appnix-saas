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
  Radio,
} from "lucide-react";
import { RCSTemplate } from "@/types/rcs-template";
import { useRouter } from "next/navigation";

interface RCSRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: RCSTemplate | null;
  onEdit?: (template: RCSTemplate) => void;
}

export function RCSRejectionModal({
  isOpen,
  onClose,
  template,
  onEdit,
}: RCSRejectionModalProps) {
  const router = useRouter();

  if (!template) return null;

  const rejection = template.rejectionDetails || {
    code: "CARRIER_POLICY_VIOLATION",
    carrier: "Telecom Carrier Hub (Jio / Airtel)",
    reason:
      template.rejectionReason ||
      "The submitted template did not meet carrier compliance or Rich Card specifications.",
    recommendation:
      "Review card action links, ensure all URLs use HTTPS, and verify character length limitations on title and action buttons.",
    date: template.updatedAt || new Date().toISOString(),
  };

  const handleEditAndResubmit = () => {
    onClose();
    if (onEdit) {
      onEdit(template);
    } else {
      router.push(`/channels/rcs/templates/${template.id}/edit`);
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
                Carrier Verification Rejected
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
                Carrier Feedback & Reason
              </span>
              <Badge variant="outline" className="border-rose-300 text-rose-700 dark:text-rose-300 text-[10px] font-mono">
                {rejection.code}
              </Badge>
            </div>
            <p className="text-rose-950 dark:text-rose-100 text-xs leading-relaxed font-medium">
              {rejection.reason}
            </p>
            <div className="text-[11px] text-rose-800/80 dark:text-rose-300/80 flex items-center gap-1 pt-1">
              <Radio className="h-3 w-3" />
              <span>Reviewing Carrier: {rejection.carrier}</span>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <HelpCircle className="h-4 w-4 text-primary" /> Recommended Fix:
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {rejection.recommendation}
            </p>
          </div>

          {/* Carrier Approvals Breakdown */}
          {template.carrierApprovals && template.carrierApprovals.length > 0 && (
            <div className="rounded-xl border bg-muted/40 p-3.5 space-y-2">
              <span className="font-semibold text-foreground text-xs">Carrier Breakdown</span>
              <div className="space-y-1.5">
                {template.carrierApprovals.map((ca, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b last:border-0">
                    <span className="font-medium text-foreground">{ca.carrier}</span>
                    <Badge
                      variant="outline"
                      className={
                        ca.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                          : ca.status === "REJECTED"
                          ? "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                          : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                      }
                    >
                      {ca.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleEditAndResubmit}
            className="bg-primary text-primary-foreground gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit & Fix Template</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
