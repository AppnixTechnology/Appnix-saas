import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { ConnectedApp } from './types';
import { AppBrandLogo } from './app-brand-logos';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  app: ConnectedApp | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  app,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Disconnect Integration</h3>
              <p className="text-xs text-muted-foreground">Remove stored API credentials</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-xl bg-muted/40 p-4 border border-border/80 flex items-center gap-3">
          <AppBrandLogo appName={app.appName} size="md" />
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{app.accountName}</h4>
            <p className="text-xs text-muted-foreground">{app.appTitle || app.appName}</p>
          </div>
        </div>

        {app.linkedWorkflowsCount > 0 && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> This credential is used in <strong>{app.linkedWorkflowsCount} workflows</strong>. Disconnecting will cause dependent actions in those workflows to fail.
            </span>
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to disconnect this app? You can re-authenticate anytime by connecting again with valid API keys.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Disconnecting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Yes, Disconnect</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
