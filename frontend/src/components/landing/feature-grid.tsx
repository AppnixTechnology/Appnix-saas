"use client";

import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    id: "inbox",
    icon: MessageSquare,
    title: "Unified Team Inbox",
    description: "Manage WhatsApp, Instagram, RCS, and Facebook in one collaborative workspace.",
    highlights: ["Auto-routing", "SLA tracking", "Team internal notes"],
    badge: "Omnichannel",
    accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "campaigns",
    icon: Send,
    title: "Campaign Broadcasting",
    description: "Send high-converting broadcasts to millions with guaranteed 99%+ deliverability.",
    highlights: ["Verified templates", "Dynamic variables", "Click analytics"],
    badge: "Broadcasting",
    accent: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "bots",
    icon: Bot,
    title: "No-Code Chatbot Builder",
    description: "Deploy 24/7 AI bots for instant lead qualification and automated FAQ resolution.",
    highlights: ["Visual drag & drop", "Human handover", "24/7 instant replies"],
    badge: "AI Automation",
    accent: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "automations",
    icon: Zap,
    title: "Workflow Automations",
    description: "Trigger multi-step messaging journeys based on CRM status changes and webhooks.",
    highlights: ["Event triggers", "Smart delays", "Conditional branching"],
    badge: "Workflows",
    accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "crm",
    icon: Users,
    title: "Contact CRM & Pipeline",
    description: "Turn chats into customers with 360° lead profiles, stages, and custom tags.",
    highlights: ["Deal values", "Contact 360 view", "Lead auto-tagging"],
    badge: "Lead CRM",
    accent: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Gain full visibility into team response velocity, read rates, and campaign ROI.",
    highlights: ["Agent metrics", "Delivery funnels", "CSAT reports"],
    badge: "Insights",
    accent: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Scale Communication
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground text-balance">
            A complete suite of tools to manage, automate, and grow your customer conversations.
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
