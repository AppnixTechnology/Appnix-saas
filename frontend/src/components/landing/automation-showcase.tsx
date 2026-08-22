"use client";

import { useState } from "react";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  MessageSquare,
  Users,
  Smartphone,
  Send,
  GitBranch,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon, RCSIcon } from "@/components/landing/channel-icons";

export function AutomationShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const [activeBranch, setActiveBranch] = useState<"yes" | "no">("yes");

  return (
    <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
                <Zap className="h-3.5 w-3.5" />
                Visual Workflow Engine
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Automate Conversations.
                <br />
                <span className="text-primary">Not Relationships.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Empower your sales and support teams with 24/7 intelligent automations. Trigger instant responses, filter intent, and seamlessly pass hot opportunities to live agents.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Visual drag-and-drop workflow canvas",
                "Conditional branching based on user intent & tags",
                "Smart delays, business hours routing & holiday schedules",
                "Native webhooks for HubSpot, Salesforce, and custom APIs",
                "65%+ reduction in manual first-response time",
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
                Explore Automation Builder
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Workflow Canvas Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl space-y-4">
              {/* Canvas Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Workflow: Inbound Lead Qualification & Auto-Routing
                    </h4>
                    <p className="text-[10px] text-muted-foreground">Trigger: Webhook / Form Submit</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Live Workflow
                </Badge>
              </div>

              {/* Node 1: Trigger */}
              <div className="flex flex-col items-center">
                <div className="w-full sm:max-w-md rounded-xl border border-primary/40 bg-primary/5 p-3.5 shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Event Trigger
                    </span>
                    <h5 className="text-xs font-bold text-foreground truncate">
                      New Lead Form Submitted (Website / Ads)
                    </h5>
                    <p className="text-[10px] text-muted-foreground">Source: Google Ads / WhatsApp Widget</p>
                  </div>
                </div>

                {/* Line connector */}
                <div className="h-6 w-0.5 bg-border my-1" />

                {/* Node 2: Action */}
                <div className="w-full sm:max-w-md rounded-xl border border-border bg-background p-3.5 shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <WhatsAppIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      Action • WhatsApp API
                    </span>
                    <h5 className="text-xs font-bold text-foreground truncate">
                      Send Instant Catalog & Demo Access Link
                    </h5>
                    <p className="text-[10px] text-muted-foreground">Template: welcome_lead_v2 (98.6% delivered)</p>
                  </div>
                </div>

                {/* Line connector */}
                <div className="h-6 w-0.5 bg-border my-1" />

                {/* Node 3: Condition / Delay */}
                <div className="w-full sm:max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        Condition & Smart Delay
                      </span>
                      <h5 className="text-xs font-bold text-foreground">
                        Wait 5 Mins • Did User Click Demo Link?
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Line branching */}
                <div className="h-5 w-0.5 bg-border my-1" />

                {/* Branch Decision Tabs */}
                <div className="grid grid-cols-2 gap-3 w-full sm:max-w-md pt-1">
                  {/* Branch YES */}
                  <div
                    onClick={() => setActiveBranch("yes")}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      activeBranch === "yes"
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5"
                        : "border-border bg-card/60 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                        IF YES (Clicked)
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">
                      Assign Rep + Tag VIP
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Notify sales rep in CRM & book calendar
                    </p>
                  </div>

                  {/* Branch NO */}
                  <div
                    onClick={() => setActiveBranch("no")}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      activeBranch === "no"
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5"
                        : "border-border bg-card/60 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-500/15 px-1.5 py-0.2 rounded">
                        IF NO (No Click)
                      </span>
                      <RCSIcon className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">
                      Send RCS Rich Card
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Follow up with 20% discount offer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
