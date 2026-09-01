"use client";

import { CheckCircle2, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";
import { useTranslation } from "@/lib/i18n";

interface ChannelDemoProps {
  onOpenDemoModal?: () => void;
}

interface ChannelItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBorder: string;
  badgeBg: string;
  capabilities: string[];
}

const channels: ChannelItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    subtitle: "WhatsApp Business API integration",
    description:
      "Manage incoming customer chats, send approved notification templates, and automate responses using the WhatsApp Business Cloud API.",
    icon: WhatsAppIcon,
    accentColor: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    badgeBg: "bg-emerald-500/10",
    capabilities: [
      "Two-way customer messaging",
      "Interactive template messages",
      "Webhook event synchronization",
      "Multi-agent chat routing",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    subtitle: "Instagram Direct integration",
    description:
      "Handle Instagram Direct messages, customer inquiries, and story replies directly from your centralized team inbox.",
    icon: InstagramIcon,
    accentColor: "text-pink-600 dark:text-pink-400",
    badgeBorder: "border-pink-500/20",
    badgeBg: "bg-pink-500/10",
    capabilities: [
      "Direct message (DM) inbox",
      "Story mention notifications",
      "Automated greeting replies",
      "Conversation assignment",
    ],
  },
  {
    id: "rcs",
    name: "RCS",
    subtitle: "RCS Business Messaging integration",
    description:
      "Engage mobile customers with branded profiles, rich multimedia cards, and interactive suggested action buttons.",
    icon: RCSIcon,
    accentColor: "text-blue-600 dark:text-blue-400",
    badgeBorder: "border-blue-500/20",
    badgeBg: "bg-blue-500/10",
    capabilities: [
      "Rich media carousels",
      "Suggested action chips",
      "Delivery & read receipts",
      "Direct SMS fallback support",
    ],
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    subtitle: "Facebook Messenger integration",
    description:
      "Consolidate Facebook Page communications, customer inquiries, and automated triage in one shared workspace.",
    icon: FacebookIcon,
    accentColor: "text-indigo-600 dark:text-indigo-400",
    badgeBorder: "border-indigo-500/20",
    badgeBg: "bg-indigo-500/10",
    capabilities: [
      "Facebook Page inbox",
      "Automated welcome flows",
      "Rich media & attachment support",
      "Internal team collaboration",
    ],
  },
];

export function ChannelDemo({ onOpenDemoModal }: ChannelDemoProps) {
  const { t } = useTranslation();

  return (
    <section id="channels" className="py-12 sm:py-16 lg:py-20 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            One Central Hub. Every Major Conversation Channel.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
            Connect supported business messaging channels in one platform and manage customer conversations from a unified workspace.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Channel Header with Icon & Subtitle */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${channel.badgeBorder} ${channel.badgeBg} ${channel.accentColor} shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {channel.name}
                      </h3>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                        {channel.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Concise Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                    {channel.description}
                  </p>

                  {/* Key Capabilities */}
                  <div className="pt-4 border-t border-border/60 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 block">
                      Capabilities
                    </span>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {channel.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-foreground/90">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA / Action */}
                <div className="pt-6 mt-6 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => onOpenDemoModal?.()}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-foreground bg-secondary/60 hover:bg-secondary border border-border/70 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <span>Connect {channel.name.split(" ")[0]}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Integration Architecture Strip */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Unified Inbound Webhooks &amp; Multi-Channel Routing
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                All conversations flow into one centralized agent inbox with real-time assignment and status tracking.
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenDemoModal}
            size="sm"
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer"
          >
            Explore Channel Setup
          </Button>
        </div>
      </div>
    </section>
  );
}
