"use client";

import { CheckCircle2, MessageSquare, Layers, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

const platformUseCases = [
  {
    icon: MessageSquare,
    title: "Unified Customer Support & Conversation Management",
    badge: "Support & Inbox",
    description:
      "Manage supported customer conversations from a unified workspace and organize them across teams.",
    capabilities: ["Multi-Agent Assignment", "Conversation Organization", "Internal Team Notes"],
    category: "Customer Support Teams",
  },
  {
    icon: Layers,
    title: "Multi-Tenant Client Workspaces",
    badge: "Workspaces & Teams",
    description:
      "Create separate workspaces for client organizations with role-based access and separate channel configurations.",
    capabilities: ["Tenant Workspace Isolation", "Role-Based Access Control", "Separate Channel Credentials"],
    category: "Client Organizations",
  },
  {
    icon: Send,
    title: "Broadcast Notifications & Workflow Automations",
    badge: "Campaigns & Workflows",
    description:
      "Create messaging campaigns and workflow automations for supported business communication channels.",
    capabilities: ["Message Templates", "Webhook Triggers", "Delivery Status Tracking"],
    category: "Growth & Operations",
  },
];

const supportedPlatforms = [
  "WhatsApp Business Platform",
  "RCS Business Messaging",
  "Instagram Direct",
  "Facebook Messenger",
  "HTTP Webhooks",
  "Multi-Tenant Data Architecture",
];

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 lg:pb-8 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            {t.testimonials.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Use Case Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {platformUseCases.map((item, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <CardContent className="p-6 sm:p-7 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-semibold text-primary bg-primary/10 border-primary/20">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Key Platform Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.capabilities.map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supported Messaging Channels & Ecosystem Strip */}
        <div className="mt-8 sm:mt-12 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8 text-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-4">
            Supported Messaging Integrations &amp; Platform Architecture
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {supportedPlatforms.map((platform, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-background border border-border/70 px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
