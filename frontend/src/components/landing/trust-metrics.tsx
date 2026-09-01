"use client";

import { useMemo } from "react";
import { MessageSquare, Zap, Layers, Users, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function TrustMetrics() {
  const { t } = useTranslation();

  const capabilities = useMemo(
    () => [
      {
        title: t.trustMetrics.stat1Label,
        description: t.trustMetrics.stat1Sub,
        feature: "WhatsApp, RCS, IG & FB",
        icon: MessageSquare,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
      },
      {
        title: t.trustMetrics.stat2Label,
        description: t.trustMetrics.stat2Sub,
        feature: "Visual Triggers & Delays",
        icon: Zap,
        iconColor: "text-amber-600",
        bgColor: "bg-amber-500/10",
      },
      {
        title: t.trustMetrics.stat3Label,
        description: t.trustMetrics.stat3Sub,
        feature: "Secure Workspace Isolation",
        icon: Layers,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-500/10",
      },
      {
        title: t.trustMetrics.stat4Label,
        description: t.trustMetrics.stat4Sub,
        feature: "Custom Tags & Fields",
        icon: Users,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-500/10",
      },
    ],
    [t]
  );

  return (
    <section id="trust-metrics" className="border-y border-border/60 bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {t.trustMetrics.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {t.trustMetrics.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-5 rounded-2xl border border-border/70 bg-card shadow-2xs hover:shadow-md transition-all duration-200"
            >
              <div className={`mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl ${item.bgColor} ${item.iconColor}`}>
                <item.icon className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-foreground">
                {item.title}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3 pt-3 border-t border-border/60 w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{item.feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
