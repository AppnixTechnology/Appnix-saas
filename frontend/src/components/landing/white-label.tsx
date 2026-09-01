"use client";

import {
  ShieldCheck,
  Globe,
  Users,
  Palette,
  Server,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

interface FeaturePillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: "Available Now" | "Planned";
  statusType: "available" | "planned";
  description: string;
}

const whiteLabelFeatures: FeaturePillar[] = [
  {
    icon: Users,
    title: "Multi-Tenant Workspace Isolation",
    status: "Available Now",
    statusType: "available",
    description:
      "Separate tenant workspaces with isolated organization data and access controls.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control (RBAC)",
    status: "Available Now",
    statusType: "available",
    description:
      "Role-based access controls for administrators and workspace members.",
  },
  {
    icon: Server,
    title: "Independent Channel Credentials",
    status: "Available Now",
    statusType: "available",
    description:
      "Separate channel configurations for each client workspace.",
  },
  {
    icon: Globe,
    title: "Custom Domain & CNAME Mapping",
    status: "Planned",
    statusType: "planned",
    description:
      "Custom domain mapping for branded client portals (Planned).",
  },
  {
    icon: Palette,
    title: "Custom Portal Branding & Themes",
    status: "Planned",
    statusType: "planned",
    description:
      "Custom branding and portal themes (Planned).",
  },
  {
    icon: Lock,
    title: "Reseller Sub-Account Console",
    status: "Planned",
    statusType: "planned",
    description:
      "Tools for managing multiple client workspaces (Planned).",
  },
];

export function WhiteLabel({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();

  return (
    <section id="white-label" className="py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-slate-950 via-[#0B1E5B] to-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-xs mb-4">
            {t.whiteLabel.badge}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {t.whiteLabel.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 text-balance leading-relaxed">
            {t.whiteLabel.subtitle}
          </p>
        </div>

        {/* Architecture & Roadmap Preview Card */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-2xl mb-8 sm:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Appnix Baseline Architecture */}
            <div className="rounded-xl border border-emerald-500/30 bg-black/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">Current Architecture</span>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  Available Now
                </Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>app.appnix.co.in</span>
              </div>
              <div className="h-8 rounded-lg bg-white/10 flex items-center px-3 text-xs font-bold text-white">
                Multi-Tenant Workspace Isolation
              </div>
            </div>

            {/* Right: Custom White-Label Brand (Planned Roadmap) */}
            <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4 space-y-2 relative">
              <div className="flex items-center justify-between text-xs text-blue-300">
                <span className="font-semibold text-white">Custom Brandable Portal</span>
                <Badge variant="outline" className="text-[10px] text-blue-300 border-blue-400/30 bg-blue-500/20">
                  Planned Roadmap
                </Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-blue-200">
                <Globe className="h-3.5 w-3.5" />
                <span>app.yourbrand.com (Planned)</span>
              </div>
              <div className="h-8 rounded-lg bg-blue-500/30 border border-blue-400/30 text-white flex items-center justify-between px-3 text-xs font-bold shadow-md">
                <span>Custom Logo &amp; Themes (Planned)</span>
                <span className="text-[10px] font-normal text-blue-200">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Capabilities Pillars */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whiteLabelFeatures.map((item, idx) => {
            const isAvailable = item.statusType === "available";
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-6 transition-all duration-200 space-y-3 flex flex-col justify-between ${
                  isAvailable
                    ? "border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-400/30"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                        isAvailable
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
                        isAvailable
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-blue-300 border-blue-400/30 bg-blue-500/10"
                      }`}
                    >
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.status}
                        </span>
                      )}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <Button
            onClick={onOpenDemoModal}
            size="lg"
            className="h-12 px-8 text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            {t.whiteLabel.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
