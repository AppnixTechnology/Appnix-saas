"use client";

import { ChevronLeft, ChevronRight, MessageSquare, Camera, ScanLine, Smartphone, CheckCircle2, WifiOff, Wifi, Save, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChannelItem } from "@/hooks/useCampaignWizard";

const channelMeta: Record<
  "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK",
  {
    label: string;
    icon: React.ElementType;
    iconStyle: string;
    description: string;
    badgeActive: string;
  }
> = {
  WHATSAPP: {
    label: "WhatsApp Business",
    icon: MessageSquare,
    iconStyle: "bg-emerald-500 text-white",
    description: "Send rich interactive messages, buttons, and media via WhatsApp Cloud API",
    badgeActive: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
  },
  INSTAGRAM: {
    label: "Instagram Direct",
    icon: Camera,
    iconStyle: "bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white",
    description: "Engage leads and followers via Instagram Messaging API",
    badgeActive: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-200",
  },
  RCS: {
    label: "Google RCS Business",
    icon: Smartphone,
    iconStyle: "bg-indigo-600 text-white",
    description: "Next-gen SMS with verified sender badges, carousels, and action chips",
    badgeActive: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200",
  },
  FACEBOOK: {
    label: "Facebook Messenger",
    icon: ScanLine,
    iconStyle: "bg-blue-600 text-white",
    description: "Reach your Facebook page audience with targeted campaign broadcasts",
    badgeActive: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
  },
};

interface CampaignStepChannelProps {
  campaign: {
    channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
  };
  channels: ChannelItem[];
  selectChannel: (channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK") => void;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  loadTemplates: (channel?: string) => Promise<void>;
  onSaveDraft?: () => void;
  isSaving?: boolean;
}

export function CampaignStepChannel({
  campaign,
  channels,
  selectChannel,
  canProceed,
  onNext,
  onPrev,
  onSaveDraft,
  isSaving,
}: CampaignStepChannelProps) {
  const channelList: Array<"WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK"> = [
    "WHATSAPP",
    "INSTAGRAM",
    "RCS",
    "FACEBOOK",
  ];

  const selectedChannelConfig = channels.find((c) => c.channel === campaign.channel);

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-bold">Select Communication Channel</CardTitle>
              </div>
              <CardDescription>
                Choose an active, connected communication channel to dispatch your campaign
              </CardDescription>
            </div>
            {selectedChannelConfig?.isConnected && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 gap-1.5 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Channel Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {channelList.map((chKey) => {
              const meta = channelMeta[chKey];
              const Icon = meta.icon;
              const serverConfig = channels.find((c) => c.channel === chKey);
              const isConnected = serverConfig?.isConnected ?? false;
              const isSelected = campaign.channel === chKey && isConnected;

              return (
                <button
                  key={chKey}
                  type="button"
                  onClick={() => isConnected && selectChannel(chKey)}
                  disabled={!isConnected}
                  className={cn(
                    "group relative flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                      : isConnected
                      ? "border-border hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
                      : "border-border/60 bg-muted/20 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs", meta.iconStyle)}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {meta.label}
                      </h4>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {meta.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isConnected ? "outline" : "secondary"}
                        className={cn(
                          "text-[11px] px-2 py-0.5 font-medium gap-1",
                          isConnected ? meta.badgeActive : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {isConnected ? (
                          <>
                            <Wifi className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            Connected
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3" />
                            Not Connected
                          </>
                        )}
                      </Badge>
                      {serverConfig?.accountName && isConnected && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {serverConfig.accountName}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-muted/40 rounded-lg border text-xs text-muted-foreground flex items-center justify-between">
            <span>Need to connect another channel? Configure API keys in <strong>Channels Settings</strong>.</span>
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
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="gap-2 px-6 shadow-sm"
          >
            Continue to Template
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}



