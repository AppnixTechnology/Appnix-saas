"use client";

import { useMemo } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

export function FeatureGrid() {
  const { t } = useTranslation();

  const features = useMemo(
    () => [
      {
        id: "inbox",
        icon: MessageSquare,
        title: t.featureGrid.feature1Title,
        description: t.featureGrid.feature1Desc,
        highlights: ["Multi-agent routing", "Conversation assignment", "Team notes"],
        badge: "Omnichannel",
        accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        id: "campaigns",
        icon: Send,
        title: t.featureGrid.feature2Title,
        description: t.featureGrid.feature2Desc,
        highlights: ["Message templates", "Dynamic variables", "Delivery tracking"],
        badge: "Broadcasting",
        accent: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      },
      {
        id: "bots",
        icon: Bot,
        title: t.featureGrid.feature5Title,
        description: t.featureGrid.feature5Desc,
        highlights: ["Automated replies", "Agent handover", "Inquiry triage"],
        badge: "Automated Bots",
        accent: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      },
      {
        id: "automations",
        icon: Zap,
        title: t.featureGrid.feature3Title,
        description: t.featureGrid.feature3Desc,
        highlights: ["Visual workflow canvas", "Event triggers", "HTTP webhooks"],
        badge: "Workflows",
        accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
      },
      {
        id: "crm",
        icon: Users,
        title: t.featureGrid.feature4Title,
        description: t.featureGrid.feature4Desc,
        highlights: ["Contact profiles", "Custom fields & tags", "Lead pipelines"],
        badge: "Lead CRM",
        accent: "text-rose-600 bg-rose-500/10 border-rose-500/20",
      },
      {
        id: "white-label",
        icon: BarChart3,
        title: t.featureGrid.feature6Title,
        description: t.featureGrid.feature6Desc,
        highlights: ["Tenant isolation (Live)", "Custom domains (Coming Soon)", "Branded themes (Coming Soon)"],
        badge: "White-Label",
        accent: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
      },
    ],
    [t]
  );

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            {t.featureGrid.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.featureGrid.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground text-balance">
            {t.featureGrid.subtitle}
          </p>
        </div>

        {/* Clean, Concise Feature Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${feature.accent} transition-transform group-hover:scale-105`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {feature.badge}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Clean Highlight Chips */}
              <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                {feature.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
