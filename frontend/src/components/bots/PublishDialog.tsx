"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Play,
  Loader2,
  GitBranch,
  Shield,
  Eye,
} from "lucide-react";
import { PublishValidationResult, PublishCheck, BotWorkflow, BotChannel } from "@/components/bots/types";

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => Promise<void>;
  validationResult: PublishValidationResult;
  checks: PublishCheck[];
  botName: string;
  currentVersion: number;
  workflow: BotWorkflow;
  channels: BotChannel[];
  isPublishing: boolean;
}

const SEVERITY_ICONS = {
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
};

const SEVERITY_COLORS = {
  error: "border-destructive/20 bg-destructive/5",
  warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
  info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
};

export function PublishDialog({
  isOpen,
  onClose,
  onPublish,
  validationResult,
  checks,
  botName,
  currentVersion,
  workflow,
  channels,
  isPublishing,
}: PublishDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("checks");
  const [changelog, setChangelog] = useState("");

  if (!isOpen) return null;

  const errorCount = checks.filter((c) => !c.passed && c.severity === "error").length;
  const warningCount = checks.filter((c) => !c.passed && c.severity === "warning").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Publish Workflow Version</h3>
              <p className="text-xs text-muted-foreground">
                {botName} • Target: v{currentVersion + 1} (Draft → Live)
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary Bar */}
        <div className="p-3.5 border-b bg-muted/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold",
              validationResult.valid ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
            )}
          >
            {validationResult.valid ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>All Pre-flight Validation Passed</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>{errorCount} Blocking Errors Found</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {warningCount > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                {warningCount} Warnings
              </Badge>
            )}
            <Badge variant="secondary">{workflow.nodes.length} Nodes</Badge>
            <Badge variant="secondary">{channels.join(", ")}</Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 border-b bg-muted/30 px-4">
            <TabsTrigger value="checks" className="text-xs py-2 flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Pre-Publish Checks
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs py-2 flex items-center justify-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Overview & Changelog
            </TabsTrigger>
          </TabsList>

          {/* Checks Tab */}
          <TabsContent value="checks" className="flex-1 flex flex-col overflow-hidden mt-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2.5">
                {checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-xl border flex items-start gap-3 transition-all",
                      check.passed ? "bg-emerald-500/5 border-emerald-500/20" : SEVERITY_COLORS[check.severity]
                    )}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      SEVERITY_ICONS[check.severity]
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">{check.label}</span>
                        <Badge
                          variant={check.passed ? "default" : "outline"}
                          className={cn(
                            "text-[10px] px-1.5 py-0",
                            check.passed && "bg-emerald-600 hover:bg-emerald-600 text-white"
                          )}
                        >
                          {check.passed ? "Passed" : check.severity}
                        </Badge>
                      </div>
                      {check.message && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{check.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-3 border-t bg-muted/20">
              <Label className="text-xs font-semibold text-foreground mb-1 block">
                Release Notes (Optional)
              </Label>
              <textarea
                placeholder="Describe what changed in this version release..."
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                className="w-full p-2 rounded-lg border bg-background text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
              />
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3 mt-0">
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2 text-xs">
              <h4 className="font-bold text-sm text-foreground">Deployment Scope</h4>
              <p className="text-muted-foreground leading-relaxed">
                Publishing makes this flow active on connected WhatsApp, Instagram, and RCS webhooks. Previous production version will be backed up automatically.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-3.5 border-t flex justify-end gap-2 bg-card">
          <Button variant="outline" onClick={onClose} disabled={isPublishing} className="text-xs">
            Cancel
          </Button>
          <Button
            onClick={onPublish}
            disabled={isPublishing || !validationResult.valid}
            className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isPublishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isPublishing ? "Deploying..." : "Confirm & Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}