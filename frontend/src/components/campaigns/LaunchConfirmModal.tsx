"use client";

import { useState } from "react";
import { X, Send, Loader2, AlertCircle, CheckCircle2, Calendar, Clock, Users, MessageSquare, Camera, ScanLine, Smartphone, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const channelIcons = {
  WHATSAPP: MessageSquare,
  INSTAGRAM: Camera,
  FACEBOOK: ScanLine,
  RCS: Smartphone,
};

const channelColors = {
  WHATSAPP: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
  INSTAGRAM: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-300",
  FACEBOOK: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
  RCS: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300",
};

interface LaunchConfirmModalProps {
  campaign: {
    name: string;
    description: string;
    audienceName: string;
    audienceCount: number;
    channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
    metaTemplateName: string;
    metaTemplateLanguage: string;
    launchMode: "IMMEDIATE" | "SCHEDULED";
    scheduledAt: string;
    timezone?: string;
  };
  onClose: () => void;
  onConfirm: (confirmed: boolean, launchMode: "IMMEDIATE" | "SCHEDULED", scheduledAt?: string) => Promise<unknown>;
  onSaveDraft?: () => void;
  isLoading: boolean;
}

export function LaunchConfirmModal({
  campaign,
  onClose,
  onConfirm,
  onSaveDraft,
  isLoading,
}: LaunchConfirmModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [launchMode, setLaunchMode] = useState<"IMMEDIATE" | "SCHEDULED">(campaign.launchMode || "IMMEDIATE");
  const [scheduledAt, setScheduledAt] = useState(
    campaign.scheduledAt || new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );

  const Icon = channelIcons[campaign.channel] || MessageSquare;

  const handleLaunch = async () => {
    if (!confirmed) return;
    await onConfirm(true, launchMode, launchMode === "SCHEDULED" ? scheduledAt : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-2xl animate-in max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Send className="h-4.5 w-4.5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Confirm Campaign Launch</h2>
              <p className="text-xs text-muted-foreground">Final safety review before dispatching messages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Strong Warning Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-xs text-amber-900 dark:text-amber-200">
                  Bulk Outreach Confirmation
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  You are about to launch this campaign to <strong>{campaign.audienceCount.toLocaleString()} recipients</strong>. Please verify the audience, template, and message before continuing.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-muted/30 rounded-xl border">
              <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">Campaign</span>
              <p className="text-xs font-bold text-foreground truncate" title={campaign.name}>
                {campaign.name}
              </p>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl border">
              <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">Audience</span>
              <p className="text-xs font-bold text-foreground truncate">
                {campaign.audienceName} ({campaign.audienceCount.toLocaleString()} recipients)
              </p>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl border">
              <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">Channel</span>
              <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{campaign.channel}</span>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl border">
              <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">Template</span>
              <p className="text-xs font-bold font-mono text-foreground truncate">
                {campaign.metaTemplateName} ({campaign.metaTemplateLanguage})
              </p>
            </div>
          </div>

          {/* Schedule Options */}
          <div className="p-3.5 border rounded-xl bg-card space-y-3">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Launch Mode
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLaunchMode("IMMEDIATE")}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left",
                  launchMode === "IMMEDIATE"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Immediately</span>
              </button>

              <button
                type="button"
                onClick={() => setLaunchMode("SCHEDULED")}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left",
                  launchMode === "SCHEDULED"
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Schedule for Later</span>
              </button>
            </div>

            {launchMode === "SCHEDULED" && (
              <div className="pt-2">
                <Label htmlFor="schedModal" className="text-xs font-medium text-muted-foreground block mb-1">
                  Select Date & Time ({campaign.timezone || "Local Time"})
                </Label>
                <Input
                  id="schedModal"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="h-9 text-xs"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          {/* Mandatory Checkbox */}
          <div className="p-3 bg-muted/20 border rounded-xl flex items-start gap-3">
            <Checkbox
              id="confirmLaunchBox"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(!!checked)}
              className="mt-0.5"
            />
            <Label
              htmlFor="confirmLaunchBox"
              className="text-xs font-semibold text-foreground cursor-pointer leading-snug"
            >
              I have reviewed the campaign details, template mappings, and test message, and want to launch this campaign to {campaign.audienceCount.toLocaleString()} recipients.
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Back
            </Button>
            {onSaveDraft && (
              <Button variant="outline" size="sm" onClick={onSaveDraft} disabled={isLoading}>
                Save as Draft
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleLaunch}
              disabled={!confirmed || isLoading}
              className="gap-2 bg-destructive hover:bg-destructive/90 text-white shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Launching campaign...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  {launchMode === "IMMEDIATE" ? "Launch Campaign" : "Schedule Campaign"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}