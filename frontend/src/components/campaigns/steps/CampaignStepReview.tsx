"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2, AlertCircle, Send, Save, Loader2, MessageSquare, Camera, ScanLine, Smartphone, Users, FileText, Calendar, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface CampaignStepReviewProps {
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
    status: string;
    testHistory?: {
      sentAt: string;
      phoneNumber: string;
      contactName?: string;
      status: string;
      messageId: string;
    };
  };
  testSent: boolean;
  onSendTest: () => void;
  onLaunch: () => void;
  onSaveDraft: () => void;
  onPrev: () => void;
  isSaving: boolean;
  isLaunching: boolean;
}

export function CampaignStepReview({
  campaign,
  testSent,
  onSendTest,
  onLaunch,
  onSaveDraft,
  onPrev,
  isSaving,
  isLaunching,
}: CampaignStepReviewProps) {
  const Icon = channelIcons[campaign.channel] || MessageSquare;

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Review & Launch Campaign</CardTitle>
              </div>
              <CardDescription>
                Review campaign settings, test delivery, and verify before dispatching
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-semibold px-3 py-1">
              Status: Draft
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Summary Cards */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {/* Campaign info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Campaign Details</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {campaign.name || "Untitled Campaign"}
              </p>
              {campaign.description ? (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">No description provided</p>
              )}
            </div>

            {/* Audience info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Target Audience</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {campaign.audienceName || "VIP Customers"}
              </p>
              <p className="text-xs text-muted-foreground">
                Total eligible recipients: <strong className="text-primary font-bold">{campaign.audienceCount.toLocaleString()} contacts</strong>
              </p>
            </div>

            {/* Channel info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>Communication Channel</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs font-semibold gap-1.5", channelColors[campaign.channel])}>
                  <Icon className="h-3.5 w-3.5" />
                  {campaign.channel}
                </Badge>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  • Connected & Verified
                </span>
              </div>
            </div>

            {/* Template info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Meta Message Template</span>
              </div>
              <p className="text-sm font-mono font-bold text-foreground">
                {campaign.metaTemplateName || "festival_discount_25"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Language: <strong>{campaign.metaTemplateLanguage || "English"}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Approved</span>
              </div>
            </div>
          </div>

          {/* Test Status Section */}
          <div
            className={cn(
              "p-4 rounded-xl border transition-all",
              testSent
                ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800"
                : "bg-amber-50/80 border-amber-300 dark:bg-amber-950/40 dark:border-amber-900"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                {testSent ? (
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-foreground">
                    {testSent ? "Test Message Verified" : "Test Message Required"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {testSent
                      ? `Test message successfully dispatched to ${campaign.testHistory?.phoneNumber || "+91 98765 43210"}. Campaign is ready for launch confirmation.`
                      : "For safety, please send a test message to your personal device to verify copy and formatting before bulk launch."}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={onSendTest}
                size="sm"
                variant={testSent ? "outline" : "default"}
                className={cn("gap-2 shrink-0 self-start sm:self-auto", !testSent && "bg-primary shadow-xs")}
              >
                <Send className="h-3.5 w-3.5" />
                {testSent ? "Send Another Test" : "Send Test Message"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving Draft..." : "Save as Draft"}
          </Button>

          <Button
            onClick={onLaunch}
            disabled={!testSent || isLaunching}
            className="gap-2 px-6 bg-destructive hover:bg-destructive/90 text-white shadow-sm font-semibold"
          >
            {isLaunching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Confirm & Launch Campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}