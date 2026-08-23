"use client";

import { useState } from "react";
import { X, Send, Loader2, CheckCircle2, AlertCircle, MessageSquare, Camera, ScanLine, Smartphone, Phone, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TemplateVariable, MetaTemplate } from "@/hooks/useCampaignWizard";

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

interface TestMessageModalProps {
  campaign: {
    name: string;
    channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
    metaTemplateName: string;
    metaTemplateLanguage: string;
    templateVariables: TemplateVariable[];
    variableMappings: Record<string, string>;
  };
  templates?: MetaTemplate[];
  onClose: () => void;
  onSend: (phone: string, name?: string) => Promise<unknown>;
}

export function TestMessageModal({ campaign, templates = [], onClose, onSend }: TestMessageModalProps) {
  const [testPhoneNumber, setTestPhoneNumber] = useState("+91 98765 43210");
  const [testContactName, setTestContactName] = useState("Harshit");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    messageId?: string;
    error?: string;
  } | null>(null);

  const Icon = channelIcons[campaign.channel] || MessageSquare;

  // Render preview with test name
  const currentTemplate = templates.find((t) => t.name === campaign.metaTemplateName);
  let bodyText = "";
  if (currentTemplate?.components) {
    const b = currentTemplate.components.find((c) => c.type === "BODY" && c.text);
    if (b?.text) bodyText = b.text;
  }
  if (!bodyText) {
    bodyText = currentTemplate?.preview || "Hello {{1}}, don't miss our exclusive {{2}}% discount this weekend! Click here to redeem: {{3}}";
  }

  const sampleData: Record<string, string> = {
    customerName: testContactName || "Harshit Sharma",
    firstName: testContactName || "Harshit",
    lastName: "Sharma",
    phoneNumber: testPhoneNumber || "+91 98765 43210",
    email: "harshit@example.com",
    discount: "25%",
    customerId: "CUST-TEST",
    offerUrl: "https://appnix.io/offer/festive25",
    customFields: "VIP Tier",
  };

  const renderedPreview = bodyText.replace(/\{\{(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (match, varKey) => {
    const source = campaign.variableMappings[varKey];
    if (source && sampleData[source]) {
      return sampleData[source];
    }
    return sampleData.customerName || match;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhoneNumber.trim()) return;

    setIsSending(true);
    setSendResult(null);
    try {
      const res = (await onSend(testPhoneNumber, testContactName || undefined)) as { messageId?: string } | undefined;
      setSendResult({
        success: true,
        messageId: res?.messageId || `test_${Date.now()}`,
      });
    } catch (err) {
      setSendResult({
        success: false,
        error: "Failed to send test message. Please check the recipient number format and channel connection.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl animate-in max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Send className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Send Test Message</h2>
              <p className="text-xs text-muted-foreground">Verify template rendering before launching to audience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <strong>You are sending a TEST message only.</strong> This will send exactly one message to the test recipient number and will <strong>NOT</strong> dispatch to your campaign audience.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="testPhoneNumber" className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Test Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="testPhoneNumber"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                required
                disabled={isSending || sendResult?.success}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div>
              <Label htmlFor="testContactName" className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" />
                Test Contact Name <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="testContactName"
                placeholder="e.g. Harshit"
                value={testContactName}
                onChange={(e) => setTestContactName(e.target.value)}
                disabled={isSending || sendResult?.success}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Rendered Test Message Preview */}
          <div className="border rounded-xl p-3 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">Test Message Rendered Preview</span>
              <Badge variant="outline" className={cn("text-[10px] py-0", channelColors[campaign.channel])}>
                <Icon className="h-3 w-3 mr-1" />
                {campaign.channel}
              </Badge>
            </div>
            <div className="p-3 bg-card rounded-lg border text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {renderedPreview}
            </div>
          </div>

          {sendResult && (
            <div
              className={cn(
                "p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-medium",
                sendResult.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              )}
            >
              {sendResult.success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Test message sent successfully.</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
                      Message ID: {sendResult.messageId} • Status: Delivered
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{sendResult.error}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSending}
              size="sm"
            >
              {sendResult?.success ? "Close" : "Cancel"}
            </Button>
            {!sendResult?.success ? (
              <Button
                type="submit"
                disabled={isSending || !testPhoneNumber.trim()}
                size="sm"
                className="gap-2 bg-primary text-primary-foreground shadow-xs"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Test
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onClose}
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Done
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}