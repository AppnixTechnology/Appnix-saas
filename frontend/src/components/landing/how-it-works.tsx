"use client";

import { Link2, Bot, TrendingUp, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Connect Your Channels",
    description: "Link WhatsApp, Instagram, RCS, and Facebook in minutes using official Meta & Google APIs.",
    icon: Link2,
    highlights: ["Official API connection", "Zero downtime setup"],
  },
  {
    step: "02",
    title: "Automate & Broadcast",
    description: "Deploy 24/7 AI chatbots to triage inquiries and launch targeted broadcast campaigns.",
    icon: Bot,
    highlights: ["No-code bot builder", "99%+ broadcast delivery"],
  },
  {
    step: "03",
    title: "Convert & Close Deals",
    description: "Track leads in your CRM pipeline, assign sales reps, and turn chats into repeat revenue.",
    icon: TrendingUp,
    highlights: ["Contact 360 profiles", "Team collaboration notes"],
  },
];

export function HowItWorks({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Zap className="h-3.5 w-3.5" />
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From First Message to Loyal Customer
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground text-balance">
            Get up and running in minutes without complex engineering setups.
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

        {/* Action Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={onOpenDemoModal}
            size="lg"
            className="h-10 px-6 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-xs"
          >
            See How Appnix Works
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
