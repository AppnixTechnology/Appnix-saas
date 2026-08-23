"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Camera, ScanLine, Smartphone, Users, FileText, Globe, CheckCircle2, ShieldCheck, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TemplateVariable, MetaTemplate } from "@/hooks/useCampaignWizard";

const channelIcons = {
  WHATSAPP: MessageSquare,
  INSTAGRAM: Camera,
  FACEBOOK: ScanLine,
  RCS: Smartphone,
};

const channelStyles = {
  WHATSAPP: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    headerBg: "bg-emerald-700 text-white",
    bubbleBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
  },
  INSTAGRAM: {
    badge: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-200",
    headerBg: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white",
    bubbleBg: "bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800",
  },
  RCS: {
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200",
    headerBg: "bg-indigo-700 text-white",
    bubbleBg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
  },
  FACEBOOK: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    headerBg: "bg-blue-600 text-white",
    bubbleBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
  },
};

const SAMPLE_DATA: Record<string, string> = {
  customerName: "Harshit Sharma",
  firstName: "Harshit",
  lastName: "Sharma",
  phoneNumber: "+91 98765 43210",
  email: "harshit@example.com",
  discount: "25%",
  customerId: "CUST-9041",
  offerUrl: "https://appnix.io/offer/festive25",
  customFields: "VIP Tier",
};

interface CampaignStepPreviewProps {
  campaign: {
    name: string;
    audienceName: string;
    audienceCount: number;
    channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
    metaTemplateId: string;
    metaTemplateName: string;
    metaTemplateLanguage: string;
    templateVariables: TemplateVariable[];
    variableMappings: Record<string, string>;
  };
  templates?: MetaTemplate[];
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft?: () => void;
  isSaving?: boolean;
}

export function CampaignStepPreview({
  campaign,
  templates = [],
  canProceed,
  onNext,
  onPrev,
  onSaveDraft,
  isSaving,
}: CampaignStepPreviewProps) {
  const Icon = channelIcons[campaign.channel] || MessageSquare;
  const currentStyle = channelStyles[campaign.channel] || channelStyles.WHATSAPP;

  const currentTemplate = templates.find((t) => t.id === campaign.metaTemplateId);

  const previewMessage = useMemo(() => {
    let bodyText = "";

    // Find body text from current template or components
    if (currentTemplate?.components) {
      const bodyComp = currentTemplate.components.find((c) => c.type === "BODY" && c.text);
      if (bodyComp?.text) {
        bodyText = bodyComp.text;
      }
    }

    if (!bodyText && currentTemplate?.preview) {
      bodyText = currentTemplate.preview;
    }

    if (!bodyText) {
      bodyText = "Hello {{1}}, don't miss our exclusive {{2}}% discount this weekend! Click here to redeem: {{3}}";
    }

    // Replace variables
    let rendered = bodyText;
    const regex = /\{\{(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    rendered = rendered.replace(regex, (match, varKey) => {
      const mappedSource = campaign.variableMappings[varKey];
      if (mappedSource && SAMPLE_DATA[mappedSource]) {
        return SAMPLE_DATA[mappedSource];
      }
      return SAMPLE_DATA.customerName || match;
    });

    return rendered;
  }, [currentTemplate, campaign.variableMappings]);

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-bold">Live Message Preview</CardTitle>
              </div>
              <CardDescription>
                Realistic real-time preview of how personalized messages appear on the recipient&apos;s device
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 gap-1.5 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Real-time Render
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Summary Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border bg-muted/30">
              <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                Channel
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{campaign.channel}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-muted/30">
              <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                Template
              </span>
              <div className="font-semibold text-xs text-foreground font-mono truncate" title={campaign.metaTemplateName}>
                {campaign.metaTemplateName || "Default Template"}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-muted/30">
              <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                Audience
              </span>
              <div className="font-semibold text-xs text-foreground truncate" title={campaign.audienceName}>
                {campaign.audienceName || "VIP Customers"}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-muted/30">
              <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                Recipients
              </span>
              <div className="font-bold text-xs text-primary">
                {campaign.audienceCount.toLocaleString()} contacts
              </div>
            </div>
          </div>

          {/* Device Mockup Preview */}
          <div className="flex justify-center py-2">
            <div className="w-full max-w-md rounded-2xl border-2 border-border shadow-md overflow-hidden bg-slate-950 text-slate-100">
              {/* Phone Header Bar */}
              <div className={cn("px-4 py-3 flex items-center justify-between shadow-xs", currentStyle.headerBg)}>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs leading-none">Appnix Official</span>
                      <ShieldCheck className="h-3 w-3 text-white/90" />
                    </div>
                    <span className="text-[10px] text-white/80 leading-none">Verified Business Account</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] py-0">
                  {campaign.channel}
                </Badge>
              </div>

              {/* Chat Viewport */}
              <div className="p-4 bg-slate-100 dark:bg-slate-900 min-h-[220px] flex flex-col justify-end">
                <div className="text-center mb-3">
                  <span className="text-[10px] bg-black/10 dark:bg-white/10 text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">
                    Today
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={cn("rounded-2xl rounded-tl-sm p-4 border shadow-xs max-w-[90%] text-slate-900 dark:text-slate-100", currentStyle.bubbleBg)}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {previewMessage}
                  </p>

                  <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-muted-foreground">
                    <span>10:30 AM</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Footer info bar */}
              <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <Globe className="h-3 w-3" />
                <span>End-to-end encrypted • Verified Meta Campaign</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-muted/40 rounded-lg border text-xs text-muted-foreground text-center">
            Sample values (e.g. <strong>&quot;Harshit Sharma&quot;</strong>, <strong>&quot;25%&quot;</strong>) are populated from sample audience records.
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
          )}
          <Button onClick={onNext} className="gap-2 px-6 shadow-sm">
            Continue to Review & Test
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}