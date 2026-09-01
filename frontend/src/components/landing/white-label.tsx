"use client";

import {
  ShieldCheck,
  Globe,
  Users,
  Palette,
  Server,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

export function WhiteLabel({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();

  return (
    <section id="white-label" className="py-20 sm:py-28 bg-gradient-to-b from-slate-950 via-[#0B1E5B] to-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-xs mb-4">
            <ShieldCheck className="h-4 w-4" />
            {t.whiteLabel.badge}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {t.whiteLabel.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 text-balance leading-relaxed">
            {t.whiteLabel.subtitle}
          </p>
        </div>

        {/* Transformation Card Preview */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Appnix Baseline */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Standard Appnix Core</span>
                <Badge variant="outline" className="text-[10px] text-slate-400 border-white/20">
                  Default
                </Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>app.appnix.co.in</span>
              </div>
              <div className="h-8 rounded-lg bg-white/10 flex items-center px-3 text-xs font-bold text-white">
                Appnix SaaS Engine
              </div>
            </div>

            {/* Right: Your Custom White-Label Brand */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2 relative">
              <div className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                100% Rebranded
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span className="font-semibold">Your Branded Client Portal</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-300">
                <Globe className="h-3.5 w-3.5" />
                <span>app.youragencybrand.com</span>
              </div>
              <div className="h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-between px-3 text-xs font-bold shadow-md">
                <span>Your Agency Logo & Theme</span>
                <span className="text-[10px] font-normal">Custom Plans</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 White Label Pillars */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Globe,
              title: "Custom Domain (CNAME)",
              description: "Host client portals on your own custom domain with automated SSL certificates.",
            },
            {
              icon: Palette,
              title: "Complete Brand Identity",
              description: "Customize logos, color palettes, custom login screens, and transactional email headers.",
            },
            {
              icon: Users,
              title: "Multi-Tenant Architecture",
              description: "Isolate client workspaces, allocate custom quota limits, and manage sub-accounts.",
            },
            {
              icon: Server,
              title: "Dedicated Infrastructure",
              description: "Scalable message pipelines with multi-tenant database isolation and performance routing.",
            },
            {
              icon: ShieldCheck,
              title: "Role-Based Access Control",
              description: "Granular permissions for Super Admin, Tenant Admin, Team Managers, and Agents.",
            },
            {
              icon: Lock,
              title: "100% Client Ownership",
              description: "Bill your clients directly on your own pricing plans with zero Appnix branding visible.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200 space-y-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            onClick={onOpenDemoModal}
            size="lg"
            className="h-12 px-8 text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 gap-2 shadow-lg shadow-emerald-500/25"
          >
            {t.whiteLabel.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
