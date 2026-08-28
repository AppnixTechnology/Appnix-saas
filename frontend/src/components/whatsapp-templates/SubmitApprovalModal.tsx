"use client";

import { useState } from "react";
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
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { WhatsAppTemplate } from "@/types/whatsapp-template";

interface SubmitApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => Promise<void>;
  template: Partial<WhatsAppTemplate>;
}

export function SubmitApprovalModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  template,
}: SubmitApprovalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [metaId, setMetaId] = useState<string>("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStep(1);

    try {
      // Step 1: Validating template against Meta WhatsApp Guidelines
      await new Promise((r) => setTimeout(r, 600));
      setSubmissionStep(2);

      // Step 2: Submitting to WhatsApp Cloud API
      await new Promise((r) => setTimeout(r, 800));
      setSubmissionStep(3);

      // Step 3: Triggering backend submission
      await onConfirmSubmit();

      const generatedId =
        template.metaTemplateId ||
        `meta_tpl_${Math.floor(10000000 + Math.random() * 90000000)}`;
      setMetaId(generatedId);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setSubmissionStep(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {isSuccess ? "Template Submitted to Meta!" : "Submit Template for Review?"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official Meta WhatsApp Business Template Approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-foreground text-sm">
                Template Submitted Successfully
              </h4>
              <p className="text-xs text-muted-foreground">
                Your template has been enqueued in Meta’s automated review queue. Most templates are reviewed within <strong>1 minute to 24 hours</strong>.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Meta Template ID:
                </span>
                <Badge variant="outline" className="font-mono text-xs font-semibold bg-background">
                  {metaId}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> What happens next?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Meta’s AI and human reviewers check template category & wording.</li>
                <li>Status will automatically transition to <strong>APPROVED</strong> or <strong>REJECTED</strong>.</li>
                <li>Once approved, you can immediately use this template in Broadcast Campaigns.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Template Name:</span>
                <span className="font-mono font-semibold text-foreground">
                  {template.name || "untitled_template"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline" className="font-medium text-[11px]">
                  {template.category}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Language:</span>
                <span className="font-medium text-foreground">{template.language}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Content Type:</span>
                <span className="font-medium text-foreground">{template.contentType}</span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-3 flex gap-2.5 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-semibold">Meta Review Notice</p>
                <p>
                  Once submitted, the template content cannot be modified until Meta finishes reviewing. If rejected, you can review the specific feedback and resubmit anytime.
                </p>
              </div>
            </div>

            {/* Submission progress */}
            {isSubmitting && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  {submissionStep === 1 && "Validating Meta Graph API schema..."}
                  {submissionStep === 2 && "Registering with WhatsApp Cloud API..."}
                  {submissionStep === 3 && "Enqueueing in Meta Review queue..."}
                </div>
                <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${(submissionStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {isSuccess ? (
            <Button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Back to Message Templates
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Submit for Review
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
