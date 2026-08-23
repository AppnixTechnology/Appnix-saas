"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Database,
  ArrowLeft,
  Download,
  AlertTriangle,
  Trash2,
  PauseCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  FileArchive,
  X,
} from "lucide-react";

export default function AccountDataSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  const handleTriggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 2000);
  };

  const handleDeactivate = () => {
    alert("Workspace has been deactivated. Logging out...");
    setIsDeactivateModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmationInput !== "DELETE") {
      alert("Please type 'DELETE' exactly to confirm.");
      return;
    }
    alert("Workspace account and all customer data permanently deleted.");
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Settings</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Account & Data</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Account Data & Compliance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Export your tenant data archives, manage data retention policies, or manage workspace deactivation.
        </p>
      </div>

      <div className="space-y-6">
        {/* Export Data */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileArchive className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Export Account Data Archive</h2>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Generate a full archive of all your workspace data, including CRM Contacts, Campaign Analytics, Botflows, Support Tickets, and Transaction Ledgers formatted in standard CSV & JSON packages.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
            <Button
              onClick={handleTriggerExport}
              disabled={isExporting}
              className="bg-primary text-primary-foreground text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Generating Archive (ZIP)..." : "Export Full Workspace Data"}
            </Button>

            {exportComplete && (
              <Button
                variant="outline"
                onClick={() => alert("Downloading workspace_archive_2026.zip")}
                className="text-xs text-emerald-600 dark:text-emerald-400 gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Download Ready (workspace_archive_2026.zip - 4.2 MB)
              </Button>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-destructive/20 pb-3">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-bold text-destructive">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Deactivate Workspace</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Temporarily disable logins, pause outgoing broadcasts, and put webhooks on hold. You can reactivate anytime.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsDeactivateModalOpen(true)}
                className="text-xs shrink-0 border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                <PauseCircle className="h-3.5 w-3.5 mr-1" />
                Deactivate Workspace
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-destructive/20 pt-4">
              <div>
                <h3 className="text-sm font-bold text-destructive">Permanently Delete Workspace & Data</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Irreversible action. All contacts, channels, bot automations, and billing records will be permanently erased.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-xs shrink-0 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <h3 className="text-base font-bold text-foreground mb-2">
              Confirm Workspace Deactivation
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Are you sure you want to deactivate your workspace? Team members will be signed out and all scheduled broadcasts will pause.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDeactivateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleDeactivate}>
                Deactivate Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                Delete Entire Workspace
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This action is permanent and cannot be undone. To proceed with deleting your workspace and all associated customer data, type <span className="font-bold font-mono text-destructive">DELETE</span> below:
            </p>

            <Input
              placeholder="Type DELETE to confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="font-mono text-xs h-9"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationInput("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteConfirmationInput !== "DELETE"}
                onClick={handleDelete}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
