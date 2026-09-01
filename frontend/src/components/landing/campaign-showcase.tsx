"use client";

import {
  Send,
  CheckCircle2,
  ArrowRight,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

const campaignHighlights = [
  "Personalized message templates",
  "Audience segmentation and contact management",
  "Campaign scheduling and controls",
  "Message status tracking",
  "Campaign activity and response logging",
];

const campaignSteps = [
  {
    step: "01",
    icon: Users,
    title: "Audience Segmentation",
    description: "Filter verified opted-in customer lists by custom attributes, tags, and communication consent.",
    tags: ["Opt-in Consent", "Dynamic Segments"],
  },
  {
    step: "02",
    icon: FileText,
    title: "Message Templates",
    description: "Compose personalized messages with dynamic placeholders across WhatsApp Business and RCS.",
    tags: ["Variable Placeholders", "Media Templates"],
  },
  {
    step: "03",
    icon: Sliders,
    title: "Scheduled Dispatch & Controls",
    description: "Configure sending intervals and schedule campaigns in compliance with platform rate guidelines.",
    tags: ["Paced Sending", "Scheduled Queues"],
  },
  {
    step: "04",
    icon: Activity,
    title: "Status Tracking & Inbound Logs",
    description: "Monitor sent, delivered, and read status callbacks with direct customer reply routing to team inbox.",
    tags: ["Status Callbacks", "Inbound Routing"],
  },
];

export function CampaignShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();

  return (
    <section id="campaigns" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Campaign Pipeline Visual */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xl space-y-4">
              {/* Visual Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Campaign Management &amp; Dispatch Flow
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Controlled Messaging Pipeline
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-background">
                  Standard API Limits
                </Badge>
              </div>

              {/* 2x2 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaignSteps.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-border/60 text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <h5 className="text-xs font-bold text-foreground">
                            {item.title}
                          </h5>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">
                          {item.step}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded bg-background border border-border/60 text-foreground/80 px-1.5 py-0.5 text-[9px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compliance & Consent Notice Footer */}
              <div className="border-t border-border/60 pt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>
                  Designed for business messaging with customers who have provided verifiable opt-in consent.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-3">
                {t.campaignShowcase.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {t.campaignShowcase.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.campaignShowcase.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {campaignHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                onClick={onOpenDemoModal}
                size="lg"
                className="h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md cursor-pointer"
              >
                {t.campaignShowcase.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
