"use client";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const comparisons = [
  {
    category: "Disconnected Point Solutions",
    problem: "Separate tools for messaging, CRM, automation, and customer management.",
    appnixSolution: "A unified workspace for supported messaging channels, CRM, and customer interaction management.",
  },
  {
    category: "Customer Response Workflows",
    problem: "Customer inquiries may require follow-up across multiple tools.",
    appnixSolution: "Create automated workflows for customer responses and conversation routing.",
  },
  {
    category: "Channel Integrations",
    problem: "Managing multiple communication channels can require separate configurations and tools.",
    appnixSolution: "Connect supported messaging platforms through available integrations.",
  },
  {
    category: "Team Visibility & Routing",
    problem: "Customer conversations and team activity may be managed across separate tools.",
    appnixSolution: "Use team assignment, conversation organization, and collaboration features available in the platform.",
  },
];

export function WhyAppnix() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            {t.whyAppnix.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {t.whyAppnix.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
            {t.whyAppnix.subtitle}
          </p>
        </div>

        {/* Concrete Comparison Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <h3 className="text-base font-bold text-foreground">
                {item.category}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 text-muted-foreground bg-destructive/5 p-3 rounded-xl border border-destructive/15">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-destructive block text-xs uppercase tracking-wider mb-0.5">
                      Traditional Approach
                    </span>
                    <span>{item.problem}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-foreground bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 block text-xs uppercase tracking-wider mb-0.5">
                      The Appnix Advantage
                    </span>
                    <span>{item.appnixSolution}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
