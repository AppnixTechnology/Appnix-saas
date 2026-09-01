"use client";

import {
  Users,
  CheckCircle2,
  ArrowRight,
  Tag,
  MessageSquare,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

const crmHighlights = [
  "Contact and account profile management",
  "Customer conversation history across connected channels",
  "Custom tags and metadata attributes",
  "Team assignment and conversation routing",
  "Internal team collaboration notes",
];

const crmModules = [
  {
    icon: Users,
    title: "Contact & Account Profiles",
    description: "Store verified phone numbers, names, and account identifiers in unified customer profiles.",
    tags: ["Phone & Identity", "Account ID", "Custom Fields"],
  },
  {
    icon: MessageSquare,
    title: "Omnichannel Conversation History",
    description: "Access complete chronological chat transcripts across WhatsApp, RCS, Instagram, and Messenger.",
    tags: ["Cross-Channel Logs", "Timestamps", "Delivery Status"],
  },
  {
    icon: Tag,
    title: "Custom Tags & Attributes",
    description: "Segment and organize contacts with flexible custom tags and organizational attributes.",
    tags: ["Dynamic Tags", "Customer Segments", "Search Filters"],
  },
  {
    icon: UserCheck,
    title: "Team Assignment & Collaboration",
    description: "Assign customer conversations to dedicated agents with internal team notes and status tracking.",
    tags: ["Agent Assignment", "Internal Notes", "Role Access"],
  },
];

export function CRMShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();

  return (
    <section id="crm" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean CRM Architecture & Feature Visual */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xl space-y-4">
              {/* Visual Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Customer Contact Management Architecture
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Unified CRM Data Layer
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-background">
                  Multi-Tenant Isolated
                </Badge>
              </div>

              {/* 2x2 Feature Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crmModules.map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2.5 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-border/60 text-primary shrink-0 shadow-2xs">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground">
                          {mod.title}
                        </h5>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {mod.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {mod.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded bg-background border border-border/60 text-foreground/80 px-1.5 py-0.5 text-[9px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Visual Footer */}
              <div className="border-t border-border/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>PostgreSQL Tenant Isolation</span>
                </div>
                <span>Granular RBAC: Admin, Manager, Agent</span>
              </div>
            </div>
          </div>

          {/* Right Column: CRM Features & Copy */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                <Users className="h-3.5 w-3.5" />
                {t.crmShowcase.badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {t.crmShowcase.title}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.crmShowcase.subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {crmHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Button
                onClick={onOpenDemoModal}
                size="lg"
                className="h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md cursor-pointer"
              >
                {t.crmShowcase.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
