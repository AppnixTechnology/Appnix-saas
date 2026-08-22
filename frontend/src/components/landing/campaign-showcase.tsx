"use client";

import {
  Send,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Sparkles,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CampaignShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Campaign Analytics Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-foreground">
                      Campaign: Q1 Enterprise Product Launch & Special Offer
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Multi-Channel: WhatsApp Cloud API + RCS Verified • High Priority Broadcast
                  </p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border-emerald-500/20 w-fit">
                  Status: Completed
                </Badge>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground block font-medium">Recipients</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground">25,482</span>
                  <span className="text-[9px] text-muted-foreground block mt-0.5">100% Target Base</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-emerald-500/5 p-3.5 text-center border-emerald-500/20">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium">Delivered</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">24,921</span>
                  <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">97.8% Rate</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-blue-500/5 p-3.5 text-center border-blue-500/20">
                  <span className="text-[11px] text-blue-700 dark:text-blue-400 block font-medium">Read Rate</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-blue-600">20,421</span>
                  <span className="text-[9px] font-bold text-blue-600 block mt-0.5">82.0% Open</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-purple-500/5 p-3.5 text-center border-purple-500/20">
                  <span className="text-[11px] text-purple-700 dark:text-purple-400 block font-medium">Direct Replies</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-purple-600">4,281</span>
                  <span className="text-[9px] font-bold text-purple-600 block mt-0.5">17.2% Engagement</span>
                </div>
              </div>

              {/* Progress Visualizer */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    Delivery Performance Funnel
                  </span>
                  <span className="text-emerald-600 font-bold">Fast-Dispatch Rate: 1,200 msg/sec</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Broadcast Sent</span>
                    <span className="font-semibold text-foreground">25,482 (100%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Delivered to Handsets</span>
                    <span className="font-semibold text-emerald-600">24,921 (97.8%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "97.8%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-3">
                <Send className="h-3.5 w-3.5" />
                Targeted Multi-Channel Broadcasts
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Reach More Customers.
                <br />
                <span className="text-primary">With Less Effort.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Launch personalized bulk marketing campaigns, order status updates, and transactional alerts with enterprise speed and compliance.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Personalized message templates with dynamic custom attributes",
                "Advanced audience segmentation based on CRM tags & behavior",
                "Smart throttling to maximize delivery and protect sender score",
                "Detailed click-through rate, delivery, and conversion tracking",
                "A/B testing for messages, CTA buttons, and dispatch times",
              ].map((item, idx) => (
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
                className="h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md"
              >
                Create Your First Campaign
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
