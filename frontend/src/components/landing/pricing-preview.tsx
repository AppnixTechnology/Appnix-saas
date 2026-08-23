"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

interface PricingPreviewProps {
  onOpenDemoModal: (interest?: string) => void;
}

export function PricingPreview({ onOpenDemoModal }: PricingPreviewProps) {
  const { t } = useTranslation();
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = useMemo(
    () => [
      {
        id: "starter",
        name: t.pricing.starterPlan,
        priceMonthly: "₹999",
        priceAnnual: "₹799",
        period: "/month",
        description: t.pricing.starterDesc,
        popular: false,
        features: [
          "Up to 2,000 monthly messages",
          "2 WhatsApp / Social channels",
          "1 Automation Botflow",
          "2 Team Members",
          "Community & Email Support",
          "Standard CRM Contact Manager",
        ],
        ctaText: t.pricing.getStarted,
        ctaLink: "/signup",
        isCustom: false,
      },
      {
        id: "pro",
        name: t.pricing.proPlan,
        priceMonthly: "₹2,999",
        priceAnnual: "₹2,399",
        period: "/month",
        description: t.pricing.proDesc,
        popular: true,
        features: [
          "Up to 25,000 monthly messages",
          "Unlimited Channels (WhatsApp, IG, FB, RCS)",
          "5 Advanced AI Botflows",
          "10 Team Member Seats",
          "Priority Live Support & SLA",
          "Custom Webhooks & REST API",
          "Full Campaign & Broadcast Suite",
        ],
        ctaText: t.pricing.getStarted,
        ctaLink: "/signup",
        isCustom: false,
      },
      {
        id: "enterprise",
        name: t.pricing.enterprisePlan,
        priceMonthly: "₹8,999",
        priceAnnual: "₹7,199",
        period: "/month",
        description: t.pricing.enterpriseDesc,
        popular: false,
        features: [
          "Unlimited Monthly Messages",
          "Custom AI Voice Agent streaming",
          "Unlimited Automation Botflows",
          "Unlimited Team Seats & SSO",
          "Dedicated Account Manager",
          "Custom SLA & Dedicated IP Deployment",
          "Full White-Label Platform Access",
        ],
        ctaText: t.pricing.bookEnterprise,
        ctaLink: "#",
        isCustom: true,
      },
    ],
    [t]
  );

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Zap className="h-3.5 w-3.5" />
            {t.pricing.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            {t.pricing.subtitle}
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              onClick={() => setAnnualBilling(false)}
              className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                !annualBilling ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.pricing.monthly}
            </span>

            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                annualBilling ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              role="switch"
              aria-checked={annualBilling}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <span
              onClick={() => setAnnualBilling(true)}
              className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                annualBilling ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.pricing.annual}
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;

            return (
              <Card
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20 shadow-2xl bg-card scale-[1.02] lg:-translate-y-2"
                    : "border-border/80 bg-card/80 hover:bg-card shadow-sm hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {t.pricing.popular}
                  </div>
                )}

                <CardHeader className="p-6 sm:p-7 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {plan.name}
                    </CardTitle>
                    {plan.popular && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        {t.pricing.popular}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground min-h-[34px]">
                    {plan.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-foreground">
                        {price}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-7 pt-2 space-y-3 flex-1">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    What's Included:
                  </span>
                  <div className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 sm:p-7 pt-0">
                  {plan.isCustom ? (
                    <Button
                      onClick={() => onOpenDemoModal("Enterprise Tier Custom Solution")}
                      size="lg"
                      className="w-full h-11 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm cursor-pointer"
                    >
                      {plan.ctaText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className={`w-full h-11 text-xs font-semibold gap-2 shadow-sm ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted hover:bg-accent text-foreground"
                      }`}
                    >
                      <Link href={plan.ctaLink}>
                        {plan.ctaText}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee */}
        <div className="mt-12 text-center text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            14-Day Free Sandbox Access
          </span>
          <span>•</span>
          <span>No Credit Card Required</span>
          <span>•</span>
          <span>Instant Phone Number Migration</span>
        </div>
      </div>
    </section>
  );
}
