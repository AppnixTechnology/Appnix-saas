"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Save, Send, CheckCircle2, AlertCircle, Loader2, X, Megaphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CampaignStepDetails } from "./steps/CampaignStepDetails";
import { CampaignStepAudience } from "./steps/CampaignStepAudience";
import { CampaignStepChannel } from "./steps/CampaignStepChannel";
import { CampaignStepTemplate } from "./steps/CampaignStepTemplate";
import { CampaignStepConfigure } from "./steps/CampaignStepConfigure";
import { CampaignStepPreview } from "./steps/CampaignStepPreview";
import { CampaignStepReview } from "./steps/CampaignStepReview";
import { TestMessageModal } from "./TestMessageModal";
import { LaunchConfirmModal } from "./LaunchConfirmModal";
import type {
  CampaignData,
  WizardStep,
  AudienceItem,
  ChannelItem,
  MetaTemplate,
} from "@/hooks/useCampaignWizard";

interface CampaignWizardProps {
  campaign: CampaignData;
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  onSaveDraft: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isRefreshingTemplates?: boolean;
  error: string | null;
  audiences: AudienceItem[];
  channels: ChannelItem[];
  templates: MetaTemplate[];
  testSent: boolean;
  canProceed: boolean;
  nextStep: () => void;
  prevStep: () => void;
  selectAudience: (audienceId: string) => void;
  selectChannel: (channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK") => void;
  selectTemplate: (templateId: string) => void;
  configureTemplate: (mappings: Record<string, string>) => void;
  sendTest: (testPhoneNumber: string, testContactName?: string) => Promise<unknown>;
  validateCampaign: () => Promise<{ valid: boolean; errors: string[] }>;
  launchCampaign: (confirmed: boolean, launchMode: "IMMEDIATE" | "SCHEDULED", scheduledAt?: string) => Promise<unknown>;
  loadTemplates: (channel?: string) => Promise<void>;
  STEPS: Array<{ id: WizardStep; label: string; description: string }>;
}

export function CampaignWizard({
  campaign,
  currentStep,
  setCurrentStep,
  updateCampaignData,
  onSaveDraft,
  onComplete,
  isLoading,
  isRefreshingTemplates,
  error,
  audiences,
  channels,
  templates,
  testSent,
  canProceed,
  nextStep,
  prevStep,
  selectAudience,
  selectChannel,
  selectTemplate,
  configureTemplate,
  sendTest,
  validateCampaign,
  launchCampaign,
  loadTemplates,
  STEPS,
}: CampaignWizardProps) {
  const [showTestModal, setShowTestModal] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSaveDraft();
    } finally {
      setIsSaving(false);
    }
  }, [onSaveDraft]);

  const handleLaunchTrigger = useCallback(async () => {
    const validation = await validateCampaign();
    if (!validation.valid) {
      alert(`Please resolve the following before launching:\n\n• ${validation.errors.join("\n• ")}`);
      return;
    }
    setShowLaunchModal(true);
  }, [validateCampaign]);

  const handleLaunchConfirm = useCallback(
    async (confirmed: boolean, launchMode: "IMMEDIATE" | "SCHEDULED", scheduledAt?: string) => {
      setIsLaunching(true);
      try {
        await launchCampaign(confirmed, launchMode, scheduledAt);
        setShowLaunchModal(false);
        onComplete();
      } catch (err) {
        console.error("Launch failed:", err);
      } finally {
        setIsLaunching(false);
      }
    },
    [launchCampaign, onComplete]
  );

  const handleTestSend = useCallback(
    async (phone: string, name?: string) => {
      await sendTest(phone, name);
    },
    [sendTest]
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <CampaignStepDetails
            campaign={campaign}
            updateCampaignData={updateCampaignData}
            canProceed={canProceed}
            onNext={nextStep}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "audience":
        return (
          <CampaignStepAudience
            campaign={campaign}
            audiences={audiences}
            selectAudience={selectAudience}
            canProceed={canProceed}
            onNext={nextStep}
            onPrev={prevStep}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "channel":
        return (
          <CampaignStepChannel
            campaign={campaign}
            channels={channels}
            selectChannel={selectChannel}
            canProceed={canProceed}
            onNext={nextStep}
            onPrev={prevStep}
            loadTemplates={loadTemplates}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "template":
        return (
          <CampaignStepTemplate
            campaign={campaign}
            templates={templates}
            selectTemplate={selectTemplate}
            canProceed={canProceed}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
            isRefreshing={isRefreshingTemplates}
            loadTemplates={loadTemplates}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "configure":
        return (
          <CampaignStepConfigure
            campaign={campaign}
            configureTemplate={configureTemplate}
            canProceed={canProceed}
            onNext={nextStep}
            onPrev={prevStep}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "preview":
        return (
          <CampaignStepPreview
            campaign={campaign}
            templates={templates}
            canProceed={canProceed}
            onNext={nextStep}
            onPrev={prevStep}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
          />
        );
      case "review":
        return (
          <CampaignStepReview
            campaign={campaign}
            testSent={testSent}
            onSendTest={() => setShowTestModal(true)}
            onLaunch={handleLaunchTrigger}
            onSaveDraft={handleSaveDraft}
            onPrev={prevStep}
            isSaving={isSaving}
            isLaunching={isLaunching}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/crm/bulk-campaign"
              className="h-9 w-9 rounded-lg border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Back to Bulk Campaigns"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Campaign</h1>
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold px-2 py-0.5">
                  Draft
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {STEPS[currentStepIndex]?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving || !campaign.name.trim()}
              className="gap-2 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving Draft..." : "Save Draft"}
            </Button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="rounded-xl border bg-card p-4 shadow-2xs">
          <div className="hidden md:flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => {
                      // Allow clicking on previous steps or current step
                      if (index <= currentStepIndex) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={index > currentStepIndex}
                    className={cn(
                      "flex items-center gap-2 group text-left transition-colors",
                      index <= currentStepIndex ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold truncate",
                          isCurrent ? "text-primary font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-3 rounded-full transition-all",
                        index < currentStepIndex ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Step Status */}
          <div className="md:hidden flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-primary">
              Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex]?.label}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>

          {/* Progress track */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error notification if present */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Step Body */}
        <div>{renderStepContent()}</div>
      </div>

      {/* Test Message Modal */}
      {showTestModal && (
        <TestMessageModal
          campaign={campaign}
          templates={templates}
          onClose={() => setShowTestModal(false)}
          onSend={handleTestSend}
        />
      )}

      {/* Launch Confirmation Modal */}
      {showLaunchModal && (
        <LaunchConfirmModal
          campaign={campaign}
          onClose={() => setShowLaunchModal(false)}
          onConfirm={handleLaunchConfirm}
          onSaveDraft={handleSaveDraft}
          isLoading={isLaunching}
        />
      )}
    </div>
  );
}