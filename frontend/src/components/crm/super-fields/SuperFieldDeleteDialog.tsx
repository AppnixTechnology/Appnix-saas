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
import { AlertTriangle, Archive, Trash2, ShieldAlert } from "lucide-react";
import { SuperField } from "@/types/super-field";

interface SuperFieldDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: SuperField | null;
  onConfirmArchive: (field: SuperField) => void;
  onConfirmDelete: (field: SuperField) => void;
}

export function SuperFieldDeleteDialog({
  isOpen,
  onClose,
  field,
  onConfirmArchive,
  onConfirmDelete,
}: SuperFieldDeleteDialogProps) {
  if (!isOpen || !field) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Archive or Delete Super Field
              </DialogTitle>
              <DialogDescription className="text-xs">
                {field.label} (<code>contact.{field.key}</code>)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {/* Usage Impact Callout */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 space-y-1 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>CRM Impact Analysis</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This field is currently active and populated on{" "}
              <strong>{field.usageCount.toLocaleString("en-IN")} contact records</strong>.
            </p>
          </div>

          <div className="space-y-2 text-muted-foreground text-[11px]">
            <p>
              • <strong>Archive Field (Recommended):</strong> Hides the attribute from agent creation forms and new live chats while preserving historical data on existing contacts.
            </p>
            <p>
              • <strong>Permanent Delete:</strong> Removes the field definition completely from your workspace schema.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onConfirmArchive(field);
                onClose();
              }}
              className="text-xs gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>Archive Field</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onConfirmDelete(field);
                onClose();
              }}
              className="text-xs gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Permanently</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
