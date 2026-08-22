"use client";

import { Headphones, Sparkles, PhoneCall, Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/landing/channel-icons";

interface FloatingLeadTriggerProps {
  onClick: () => void;
}

export function FloatingLeadTrigger({ onClick }: FloatingLeadTriggerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3">
      {/* 1. Top Animated WhatsApp Sticky Button */}
      <div className="relative group">
        {/* Animated "Hurry Up / Instant Reply" Attention Tooltip */}
        <div className="absolute -top-7 right-0 flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping shrink-0" />
          <span>⚡ Fast Reply &lt;1 min</span>
        </div>

        <a
          href="https://wa.me/919328612083?text=Hi%20Appnix%20Team!%20I%20would%20like%20to%20learn%20more%20about%20your%20Omnichannel%20SaaS%20Platform."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <WhatsAppIcon className="h-5 w-5 text-white shrink-0 animate-pulse" />
          </div>
          <span>Chat on WhatsApp</span>
          <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wide">
            Online
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* 2. Bottom Animated "Talk to an Expert" Button */}
      <Button
        onClick={onClick}
        size="lg"
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-primary/95 to-indigo-700 px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-2xl shadow-primary/30 ring-4 ring-primary/15 transition-all duration-300 hover:scale-105 hover:shadow-primary/45 active:scale-95 cursor-pointer"
      >
        {/* Pulsing Live Agent Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>

        <Headphones className="h-4 w-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        <span>Talk to an Expert</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
          Free Demo
        </span>
      </Button>
    </div>
  );
}
