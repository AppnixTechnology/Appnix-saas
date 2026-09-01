"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall, CheckCircle2, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FinalCTAProps {
  onOpenDemoModal: () => void;
}

export function FinalCTA({ onOpenDemoModal }: FinalCTAProps) {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-10 lg:py-14 relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-slate-900 via-[#0B1E5B] to-slate-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Subtle Ambient Glow Elements */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/40 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-xs">
              {t.finalCta.badge}
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white text-balance leading-tight">
              {t.finalCta.title}
            </h2>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-200 text-balance leading-relaxed">
              {t.finalCta.subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                onClick={onOpenDemoModal}
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
              >
                {t.finalCta.primaryBtn}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={onOpenDemoModal}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold border-white/20 bg-white/10 hover:bg-white/20 text-white gap-2 backdrop-blur-xs cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>{t.finalCta.secondaryBtn}</span>
              </Button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Multi-Channel Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Tenant-Isolated Workspaces
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Supported API Integrations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
