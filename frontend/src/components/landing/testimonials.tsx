"use client";

import { Star, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

const testimonials = [
  {
    content:
      "Appnix helped us centralize our WhatsApp and Instagram customer conversations. The unified inbox and lead assignment have streamlined our support operations.",
    author: "Sarah Chen",
    role: "Operations Lead",
    company: "Retail Brands Hub",
    avatar: "SC",
    metric: "Unified Inbox",
    rating: 5,
  },
  {
    content:
      "The white-label capability allowed us to provide a branded messaging platform to our client accounts. The multi-tenant architecture keeps client data isolated and clean.",
    author: "Marcus Johnson",
    role: "Agency Director",
    company: "Growth Media Studio",
    avatar: "MJ",
    metric: "Tenant Isolation",
    rating: 5,
  },
  {
    content:
      "Setting up message templates and conversational flow triggers was straightforward. The visual builder helps our team manage customer inquiries efficiently.",
    author: "Priya Sharma",
    role: "Technical Lead",
    company: "Commerce Solutions",
    avatar: "PS",
    metric: "Template Management",
    rating: 5,
  },
];

const supportedPlatforms = [
  "WhatsApp Business Platform",
  "Google RCS Messaging",
  "Instagram Direct",
  "Facebook Messenger",
  "Custom Webhooks",
  "PostgreSQL Multi-Tenant",
];

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            {t.testimonials.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <CardContent className="p-6 sm:p-7 space-y-4">
                {/* Rating Stars & Result Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                    {item.metric}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                {/* Author Details */}
                <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {item.author}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {item.role}, <strong className="text-foreground/80 font-medium">{item.company}</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supported Messaging Channels & Ecosystem Strip */}
        <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8 text-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-4">
            Supported Messaging Channels &amp; Technical Integrations
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
