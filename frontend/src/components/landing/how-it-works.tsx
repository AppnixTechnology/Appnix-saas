"use client";

import { useMemo } from "react";
import { Link2, Bot, TrendingUp, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function HowItWorks({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();

  const steps = useMemo(
    () => [
      {
        step: t.howItWorks.step1Number,
        title: t.howItWorks.step1Title,
        description: t.howItWorks.step1Desc,
        icon: Link2,
        highlights: ["Supported channel connections", "Account configuration"],
      },
      {
        step: t.howItWorks.step2Number,
        title: t.howItWorks.step2Title,
        description: t.howItWorks.step2Desc,
        icon: Bot,
        highlights: ["Visual workflow builder", "Delivery status tracking"],
      },
      {
        step: t.howItWorks.step3Number,
        title: t.howItWorks.step3Title,
        description: t.howItWorks.step3Desc,
        icon: TrendingUp,
        highlights: ["Contact 360 profiles", "Team collaboration notes"],
      },
    ],
    [t]
  );

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            {t.howItWorks.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground text-balance">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Concise 3-Step Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border/80 bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold text-primary font-mono opacity-80">
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap gap-2">
                {item.highlights.map((h, i) => (
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
