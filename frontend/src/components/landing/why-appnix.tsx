"use client";

import {
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const comparisons = [
  {
    category: "Disconnected Point Solutions",
    problem: "Separate tools for WhatsApp, live chat, CRM, bot builder, and broadcasts.",
    appnixSolution: "One unified omnichannel workspace with seamless native data sync.",
  },
  {
    category: "Lead Response Time",
    problem: "Hours or days to follow up with new inbound leads across scattered channels.",
    appnixSolution: "Instant 5-second automated response and lead routing to designated reps.",
  },
  {
    category: "Channel Compliance",
    problem: "Unofficial scraping tools and high ban risks with zero Meta guarantees.",
    appnixSolution: "100% Official Meta Cloud API & Google RCS Verified Partner infrastructure.",
  },
  {
    category: "Team Visibility & SLA",
    problem: "No centralized visibility into agent response speeds or missed chats.",
    appnixSolution: "Real-time CSAT tracking, SLA alerts, and multi-agent workload balancing.",
  },
];

export function WhyAppnix() {
  const { t } = useTranslation();

  return (
    <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Layers className="h-3.5 w-3.5" />
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
