"use client";

import { ChevronRight, Save, Sparkles, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CampaignStepDetailsProps {
  campaign: {
    name: string;
    description: string;
    status: string;
  };
  updateCampaignData: (data: { name?: string; description?: string }) => void;
  canProceed: boolean;
  onNext: () => void;
  onSaveDraft?: () => void;
  isSaving?: boolean;
}

export function CampaignStepDetails({
  campaign,
  updateCampaignData,
  canProceed,
  onNext,
  onSaveDraft,
  isSaving,
}: CampaignStepDetailsProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Campaign Details</CardTitle>
            </div>
            <CardDescription>
              Give your campaign a clear, recognizable name and optional description
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300">
            Draft
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Campaign Name <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">Required</span>
            </div>
            <Input
              id="name"
              placeholder="e.g. Festival Season VIP Discount 25%"
              value={campaign.name}
              onChange={(e) => updateCampaignData({ name: e.target.value })}
              className="h-10 text-sm"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              The campaign will automatically be saved as a <strong>Draft</strong> when you proceed.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                Campaign Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
            </div>
            <Textarea
              id="description"
              placeholder="e.g. Exclusive 25% discount promo broadcast to VIP loyal customers for the festival holiday weekend."
              value={campaign.description}
              onChange={(e) => updateCampaignData({ description: e.target.value })}
              className="text-sm resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Internal notes or objectives to help your team track campaign goals.
            </p>
          </div>

          <div className="p-3.5 bg-muted/40 rounded-lg border flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Pro Tip:</strong> Use specific names that include the audience and offer (e.g. &quot;Summer Flash Sale 2026 - VIP Tier&quot;) to make reporting easier.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <div>
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving || !campaign.name.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving Draft..." : "Save Draft"}
            </Button>
          )}
        </div>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2 px-6 shadow-sm"
        >
          Continue to Audience
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}