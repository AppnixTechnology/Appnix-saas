"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Play,
  MessageSquare,
  Clock,
  UserCheck,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

const automationHighlights = [
  "Visual workflow builder",
  "Conditional workflow steps",
  "Scheduled actions and delays",
  "Webhook-based integrations",
  "Automated conversation routing",
];

export function AutomationShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();
  const [activeBranch, setActiveBranch] = useState<"match" | "nomatch">("match");

  return (
    <section id="automations" className="py-12 sm:py-16 lg:py-20 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
                {t.automationShowcase.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {t.automationShowcase.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.automationShowcase.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {automationHighlights.map((item, idx) => (
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
                className="h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md cursor-pointer"
              >
                {t.automationShowcase.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Generic Illustrative Workflow Visual */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl space-y-4">
              {/* Canvas Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Visual Workflow Logic
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Configured Trigger &amp; Action Flow
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground bg-background">
                  Illustrative Workflow
                </Badge>
              </div>

              {/* Node 1: Trigger */}
              <div className="flex flex-col items-center">
                <div className="w-full sm:max-w-md rounded-xl border border-primary/40 bg-primary/5 p-3.5 shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Trigger
                    </span>
                    <h5 className="text-xs font-bold text-foreground truncate">
                      Incoming Customer Message or Webhook
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      Inbound communication event detected
                    </p>
                  </div>
                </div>

                {/* Line connector */}
                <div className="h-5 w-0.5 bg-border my-0.5" />

                {/* Node 2: Action */}
                <div className="w-full sm:max-w-md rounded-xl border border-border bg-background p-3.5 shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      Action
                    </span>
                    <h5 className="text-xs font-bold text-foreground truncate">
                      Send Configured Response Template
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      Transmits pre-approved message format
                    </p>
                  </div>
                </div>

                {/* Line connector */}
                <div className="h-5 w-0.5 bg-border my-0.5" />

                {/* Node 3: Condition / Delay */}
                <div className="w-full sm:max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 shadow-xs flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      Condition &amp; Delay Step
                    </span>
                    <h5 className="text-xs font-bold text-foreground truncate">
                      Check Keyword Match or Delay Condition
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      Evaluates response criteria and routing logic
                    </p>
                  </div>
                </div>

                {/* Line branching */}
                <div className="h-4 w-0.5 bg-border my-0.5" />

                {/* Branch Decision Cards */}
                <div className="grid grid-cols-2 gap-3 w-full sm:max-w-md pt-0.5">
                  {/* Branch A */}
                  <div
                    onClick={() => setActiveBranch("match")}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      activeBranch === "match"
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5"
                        : "border-border bg-card/60 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                        Condition Matched
                      </span>
                      <UserCheck className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">
                      Route to Team
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Assign conversation to agent queue
                    </p>
                  </div>

                  {/* Branch B */}
                  <div
                    onClick={() => setActiveBranch("nomatch")}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      activeBranch === "nomatch"
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5"
                        : "border-border bg-card/60 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-500/15 px-1.5 py-0.2 rounded">
                        Default Fallback
                      </span>
                      <Tag className="h-3 w-3 text-blue-600" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">
                      Apply Status Tag
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Update contact attributes &amp; log
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
