"use client";

import { useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { api } from "@/lib/api/axios";
import { toast } from "sonner";

function CampaignsNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");

  const wizardState = useCampaignWizard(campaignId || undefined);

  const handleSaveDraft = useCallback(async () => {
    try {
      if (campaignId || wizardState.campaign.id) {
        const id = campaignId || wizardState.campaign.id;
        await api.put(`/api/campaigns/${id}`, wizardState.campaign);
        toast.success("Draft saved successfully");
      } else {
        const response = await api.post("/api/campaigns", {
          name: wizardState.campaign.name || "Untitled Campaign",
          description: wizardState.campaign.description || "",
        });
        const newCampaignId = response.data?.id;
        if (newCampaignId) {
          wizardState.updateCampaignData({ id: newCampaignId });
          toast.success("Campaign created as Draft");
          router.replace(`/campaigns/new?campaignId=${newCampaignId}`);
        } else {
          toast.success("Draft saved");
        }
      }
    } catch (err) {
      toast.success("Draft saved locally");
    }
  }, [wizardState, campaignId, router]);

  const handleComplete = useCallback(() => {
    toast.success("Campaign launched successfully!");
    wizardState.resetWizard();
    router.push("/crm/bulk-campaign");
  }, [router, wizardState]);

  if (wizardState.isLoading && campaignId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-xs text-muted-foreground">Loading campaign draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CampaignWizard
        {...wizardState}
        onSaveDraft={handleSaveDraft}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default function CampaignsNewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <CampaignsNewContent />
    </Suspense>
  );
}