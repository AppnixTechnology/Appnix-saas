"use client";

import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCheck,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    id: "inbox",
    icon: MessageSquare,
    title: "Unified Omnichannel Inbox",
    description:
      "Manage all customer conversations from WhatsApp, Instagram, RCS, and Facebook in one collaborative workspace with auto-routing and internal team notes.",
    color: "emerald",
    badge: "Omnichannel",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-foreground">Sarah Jenkins</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Just now</span>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1">
          "Can we book the Enterprise Demo for our sales team?"
        </p>
        <div className="flex items-center gap-1 pt-1">
          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-semibold px-1.5 py-0.2 rounded">
            WhatsApp
          </span>
          <span className="bg-primary/10 text-primary text-[9px] font-semibold px-1.5 py-0.2 rounded">
            Assigned: Alex
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "campaigns",
    icon: Send,
    title: "Campaign & Broadcast Manager",
    description:
      "Create, schedule, and send targeted rich media broadcasts across millions of subscribers with guaranteed delivery rates and deep conversion analytics.",
    color: "blue",
    badge: "High Delivery",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-foreground">Flash Summer Offer</span>
          <span className="text-emerald-600 font-semibold">Sent (25,482)</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between text-muted-foreground">
            <span>Delivered</span>
            <span className="font-bold text-foreground">97.8% (24,921)</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "97.8%" }} />
          </div>
          <div className="flex justify-between text-muted-foreground pt-0.5">
            <span>Read Rate</span>
            <span className="font-bold text-foreground">82.4% (20,421)</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "bots",
    icon: Bot,
    title: "No-Code Chatbot Builder",
    description:
      "Build intelligent visual chatbots in minutes. Automate customer triage, answer FAQs 24/7, collect lead data, and smoothly hand over to human reps.",
    color: "purple",
    badge: "24/7 AI Ready",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          Lead Qualification Flow
        </div>
        <div className="rounded-lg bg-muted/60 p-2 text-[10px] space-y-1">
          <p className="font-medium text-foreground">Bot: What is your team size?</p>
          <div className="flex gap-1.5">
            <span className="bg-background border px-2 py-0.5 rounded font-semibold text-primary">
              10-50 users ✓
            </span>
            <span className="bg-background border px-2 py-0.5 rounded text-muted-foreground">
              50+ users
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "automations",
    icon: Zap,
    title: "Visual Automation Workflows",
    description:
      "Design multi-step messaging journeys triggered by website forms, CRM status changes, abandoned carts, or custom webhook events.",
    color: "amber",
    badge: "Event-Driven",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
          <span className="font-bold text-foreground">Multi-Step Journey</span>
          <span className="text-emerald-600 font-semibold">Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium overflow-x-auto pb-1">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded shrink-0">New Lead</span>
          <span className="text-muted-foreground">→</span>
          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded shrink-0">WhatsApp DM</span>
          <span className="text-muted-foreground">→</span>
          <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 px-2 py-1 rounded shrink-0">Assign Rep</span>
        </div>
      </div>
    ),
  },
  {
    id: "crm",
    icon: Users,
    title: "Built-In CRM & Contact Intelligence",
    description:
      "Maintain a 360° customer profile. Filter contacts by tags, deal value, engagement score, and conversation history to personalize every outreach.",
    color: "rose",
    badge: "Contact 360°",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground text-[11px]">Ankit Bansal</span>
          <span className="text-[10px] font-bold text-emerald-600">$12,000 Deal</span>
        </div>
        <div className="flex flex-wrap gap-1 text-[9px]">
          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">VIP Lead</span>
          <span className="bg-purple-500/15 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded font-semibold">High Intent</span>
          <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground">WhatsApp + RCS</span>
        </div>
      </div>
    ),
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Real-Time Analytics & Reporting",
    description:
      "Gain full visibility into team response velocity, message deliverability rates, campaign ROI, and customer satisfaction CSAT scores.",
    color: "indigo",
    badge: "Actionable Insights",
    preview: (
      <div className="rounded-xl border border-border/80 bg-background/80 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-foreground">Performance Overview</span>
          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +18.4%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="bg-muted/50 p-1.5 rounded">
            <span className="text-muted-foreground block text-[9px]">Avg Reply</span>
            <span className="font-bold text-foreground">1.8 min</span>
          </div>
          <div className="bg-muted/50 p-1.5 rounded">
            <span className="text-muted-foreground block text-[9px]">Delivery</span>
            <span className="font-bold text-emerald-600">99.4%</span>
          </div>
          <div className="bg-muted/50 p-1.5 rounded">
            <span className="text-muted-foreground block text-[9px]">CSAT</span>
            <span className="font-bold text-foreground">4.9 / 5</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Complete Messaging Architecture
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything You Need to Scale Communication
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Replace fragmented single-purpose tools with one unified, high-performing platform built for enterprise reliability.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group relative overflow-hidden border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-105">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed min-h-[48px]">
                    {feature.description}
                  </p>
                </CardContent>
              </div>

              {/* Card Footer Micro Preview */}
              <div className="p-6 pt-0 mt-2">
                {feature.preview}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
