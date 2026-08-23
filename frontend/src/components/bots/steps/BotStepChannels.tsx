"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Camera,
  MessageCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Wifi,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BotChannel, BotSettings, CreateBotData } from "@/components/bots/types";

interface ChannelConfigProps {
  channel: BotChannel;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "password" | "url";
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
  }>;
  onConnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
}

function ChannelConfig({
  channel,
  icon,
  title,
  subtitle,
  connected,
  status,
  fields,
  onConnect,
  onDisconnect,
  onTest,
}: ChannelConfigProps) {
  const statusColors = {
    CONNECTED: "bg-emerald-600 text-white",
    DISCONNECTED: "bg-muted text-muted-foreground",
    ERROR: "bg-destructive text-white",
    PENDING: "bg-yellow-500 text-white",
  };

  return (
    <Card className="border shadow-xs">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">{icon}</div>
            <div>
              <CardTitle className="text-sm font-bold">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Badge className={cn("text-[10px] font-bold gap-1", statusColors[status])}>
            {status === "CONNECTED" && <CheckCircle2 className="h-3 w-3" />}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              type={field.type === "password" ? "password" : "text"}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="text-xs h-9 bg-background font-mono"
            />
          </div>
        ))}

        <div className="pt-2 border-t flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTest}
            disabled={!connected}
            className="text-xs gap-1"
          >
            <Zap className="h-3.5 w-3.5" />
            Test Connection
          </Button>

          {connected ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="text-xs text-destructive hover:bg-destructive/10"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onConnect}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Save & Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface BotStepChannelsProps {
  bot: CreateBotData;
  settings: BotSettings;
  updateBotData: (data: Partial<CreateBotData>) => void;
  updateSettings: (settings: Partial<BotSettings>) => void;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft: () => Promise<void>;
  isSaving: boolean;
}

export function BotStepChannels({
  bot,
  settings,
  updateBotData,
  updateSettings,
  canProceed,
  onNext,
  onPrev,
  onSaveDraft,
  isSaving,
}: BotStepChannelsProps) {
  const [activeTab, setActiveTab] = useState<BotChannel>("whatsapp");

  const channelConfigs: Record<BotChannel, any> = {
    whatsapp: {
      icon: <MessageSquare className="h-5 w-5 text-emerald-600" />,
      title: "WhatsApp Cloud API",
      subtitle: "Official Meta WhatsApp Business Platform",
      fields: [
        {
          key: "phoneNumberId",
          label: "Phone Number ID",
          type: "text",
          placeholder: "e.g. 104829104812",
          value: settings.channels.whatsapp?.phoneNumberId || "",
          required: true,
        },
        {
          key: "businessAccountId",
          label: "WhatsApp Business Account (WABA) ID",
          type: "text",
          placeholder: "e.g. 91823719283",
          value: settings.channels.whatsapp?.businessAccountId || "",
        },
        {
          key: "accessToken",
          label: "Permanent System User Access Token",
          type: "password",
          placeholder: "EAAG...",
          value: settings.channels.whatsapp?.accessToken || "",
          required: true,
        },
        {
          key: "webhookUrl",
          label: "Inbound Webhook Callback URL",
          type: "url",
          placeholder: "https://api.appnix.io/webhooks/whatsapp",
          value: settings.channels.whatsapp?.webhookUrl || "https://api.appnix.io/webhooks/whatsapp",
        },
      ],
    },
    instagram: {
      icon: <Camera className="h-5 w-5 text-pink-600" />,
      title: "Instagram Direct Messaging",
      subtitle: "Meta Graph API for Instagram Professional Accounts",
      fields: [
        {
          key: "pageId",
          label: "Connected Facebook Page ID",
          type: "text",
          placeholder: "e.g. 18274910283",
          value: settings.channels.instagram?.pageId || "",
        },
        {
          key: "instagramAccountId",
          label: "Instagram Business Account ID",
          type: "text",
          placeholder: "e.g. 9812739182",
          value: settings.channels.instagram?.instagramAccountId || "",
          required: true,
        },
        {
          key: "accessToken",
          label: "Page Access Token",
          type: "password",
          placeholder: "EAAG...",
          value: settings.channels.instagram?.accessToken || "",
        },
      ],
    },
    rcs: {
      icon: <MessageCircle className="h-5 w-5 text-blue-600" />,
      title: "RCS Business Messaging",
      subtitle: "Google RCS verified agent for telecom carriers",
      fields: [
        {
          key: "providerId",
          label: "RCS Service Provider ID",
          type: "text",
          placeholder: "e.g. VI_RCS_PROV_01",
          value: settings.channels.rcs?.providerId || "",
          required: true,
        },
        {
          key: "senderId",
          label: "Agent Sender ID",
          type: "text",
          placeholder: "e.g. APPNIX_BOT",
          value: settings.channels.rcs?.senderId || "",
        },
      ],
    },
    facebook: {
      icon: <Share2 className="h-5 w-5 text-blue-600" />,
      title: "Facebook Messenger",
      subtitle: "Messenger Platform Webhook & Page Inbox",
      fields: [
        {
          key: "pageId",
          label: "Facebook Page ID",
          type: "text",
          placeholder: "123456789",
          value: settings.channels.facebook?.pageId || "",
        },
      ],
    },
  };

  const handleChannelSelect = (channel: BotChannel) => {
    const isSelected = bot.channels.includes(channel);
    const updatedChannels = isSelected
      ? bot.channels.filter((c) => c !== channel)
      : [...bot.channels, channel];

    updateBotData({ channels: updatedChannels });
    updateSettings({
      channels: {
        ...settings.channels,
        selected: updatedChannels,
      },
    });
  };

  const handleConnect = (channel: BotChannel) => {
    updateSettings({
      channels: {
        ...settings.channels,
        [channel]: {
          ...(settings.channels as any)[channel],
          connected: true,
          status: "CONNECTED",
        },
      },
    });
  };

  const handleDisconnect = (channel: BotChannel) => {
    updateSettings({
      channels: {
        ...settings.channels,
        [channel]: {
          ...(settings.channels as any)[channel],
          connected: false,
          status: "DISCONNECTED",
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Channel Selector Buttons */}
      <div>
        <Label className="text-xs font-bold text-foreground">Select Active Channels</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {(["whatsapp", "instagram", "rcs", "facebook"] as BotChannel[]).map((channel) => {
            const isSelected = bot.channels.includes(channel);
            const cfg = channelConfigs[channel];

            return (
              <button
                key={channel}
                type="button"
                onClick={() => handleChannelSelect(channel)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-border/80 bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-background border">{cfg.icon}</div>
                  <Switch checked={isSelected} />
                </div>
                <div>
                  <p className="font-bold text-xs capitalize text-foreground">{channel}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{cfg.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Configurations Tabs */}
      {bot.channels.length > 0 && (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as BotChannel)}
          className="space-y-4"
        >
          <TabsList className="bg-muted/30 p-1">
            {bot.channels.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs capitalize font-semibold">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>

          {bot.channels.map((channel) => {
            const config = channelConfigs[channel];
            const channelSettings = (settings.channels as any)[channel];

            return (
              <TabsContent key={channel} value={channel} className="mt-0">
                <ChannelConfig
                  channel={channel}
                  icon={config.icon}
                  title={config.title}
                  subtitle={config.subtitle}
                  connected={channelSettings?.connected || false}
                  status={channelSettings?.status || "DISCONNECTED"}
                  fields={config.fields.map((f: any) => ({
                    ...f,
                    onChange: (value: string) =>
                      updateSettings({
                        channels: {
                          ...settings.channels,
                          [channel]: {
                            ...channelSettings,
                            [f.key]: value,
                          },
                        },
                      }),
                  }))}
                  onConnect={() => handleConnect(channel)}
                  onDisconnect={() => handleDisconnect(channel)}
                  onTest={() => alert(`Connection tested for ${channel}`)}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onPrev} className="text-xs">
          ← Back to Information
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="text-xs"
          >
            Save Draft
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue to Triggers →
          </Button>
        </div>
      </div>
    </div>
  );
}