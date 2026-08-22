"use client";

import { Star, ShieldCheck, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    content:
      "Appnix completely transformed how we communicate with customers. The unified inbox and automated lead assignment alone saved our sales team 20+ hours every week.",
    author: "Sarah Chen",
    role: "CEO & Co-Founder",
    company: "TechStart Global",
    avatar: "SC",
    metric: "20+ Hours Saved / Week",
    rating: 5,
  },
  {
    content:
      "The white-label solution allowed us to launch our own branded messaging platform for 40+ agency clients in weeks, not months. The multi-tenant architecture is bulletproof.",
    author: "Marcus Johnson",
    role: "Founder & Managing Director",
    company: "AgencyPro Media",
    avatar: "MJ",
    metric: "40+ Client Tenants Managed",
    rating: 5,
  },
  {
    content:
      "Best WhatsApp Business API integration we've ever deployed. Deliverability is consistently 99.4% and the visual bot builder reduced our support response time to under 2 minutes.",
    author: "Priya Sharma",
    role: "CTO",
    company: "E-Commerce Plus",
    avatar: "PS",
    metric: "99.4% Delivery Rate",
    rating: 5,
  },
];

const partners = [
  "Meta Tech Partner",
  "Google RCS Verified",
  "HubSpot Ecosystem",
  "Shopify Plus Ready",
  "AWS Cloud Certified",
  "ISO 27001 Standard",
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Proven Customer Results
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by Growing Businesses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            See how modern high-growth companies use Appnix to streamline operations and scale revenue.
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
                  "{item.content}"
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

        {/* Verified Technology Standards / Ecosystem Banner */}
        <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8 text-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-4">
            Enterprise Cloud & Messaging Ecosystem Standards
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-background border border-border/70 px-4 py-2 text-xs font-semibold text-foreground shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
