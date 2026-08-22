"use client";

import { useState } from "react";
import { Link2, Bot, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  mockupSnippet: string;
}

const steps: Step[] = [
  {
    step: "01",
    title: "Connect Your Official Channels",
    subtitle: "Zero downtime • Instant Meta & Google onboarding",
    description:
      "Link your WhatsApp Business Number, Instagram Professional account, Google RCS profile, and Facebook Pages in a few clicks with verified API compliance.",
    icon: Link2,
    highlights: [
      "Official Meta Cloud API direct integration",
      "Google RCS verified brand profile setup",
      "Instant phone number migration & session sync",
      "100% compliance with zero ban risk",
    ],
    mockupSnippet: "Status: ✓ 4 Channels Connected & Synced",
  },
  {
    step: "02",
    title: "Automate Workflows & Build AI Bots",
    subtitle: "No-code visual builders • 24/7 responsiveness",
    description:
      "Design intelligent conversational bots to capture leads, answer FAQs, route VIP accounts, and launch targeted high-converting broadcast campaigns.",
    icon: Bot,
    highlights: [
      "Drag-and-drop conversational decision trees",
      "Instant AI smart auto-reply qualification",
      "Personalized broadcast scheduler with dynamic variables",
      "Real-time webhook triggers to your internal systems",
    ],
    mockupSnippet: "Active Bots: 5 AI Botflows Resolving 68% Inquiries",
  },
  {
    step: "03",
    title: "Manage CRM Leads & Accelerate Growth",
    subtitle: "Close deals faster • 360° contact tracking",
    description:
      "Unify contact profiles, track deal stages, assign agent owners, and monitor conversation metrics to turn casual chats into repeat paying customers.",
    highlights: [
      "Real-time lead qualification and scoring",
      "Multi-agent live triage with team collaboration notes",
      "Detailed delivery, read, and conversion analytics",
      "Comprehensive CRM pipeline and audit logs",
    ],
    icon: TrendingUp,
    mockupSnippet: "Conversion Funnel: +28% Increase in Qualified Pipeline",
  },
];

export function HowItWorks({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Zap className="h-3.5 w-3.5" />
            Simple 3-Step Setup
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            From First Message to Loyal Customer
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Get up and running in minutes. Scale your customer communication effortlessly without engineering complexity.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 lg:grid-cols-3 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`relative rounded-2xl border p-7 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                activeStep === index
                  ? "bg-card border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02]"
                  : "bg-card/70 hover:bg-card border-border/80 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-extrabold text-primary/30 tracking-tight font-mono">
                    {item.step}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3">
                  {item.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2 border-t border-border/60 pt-4">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step indicator tag at bottom */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{item.mockupSnippet}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="mt-14 text-center">
          <Button
            onClick={onOpenDemoModal}
            size="lg"
            className="h-11 px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md"
          >
            See How Appnix Fits Your Business
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
