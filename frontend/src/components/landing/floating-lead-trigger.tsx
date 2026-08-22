"use client";

import { Headphones, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/landing/channel-icons";

interface FloatingLeadTriggerProps {
  onClick: () => void;
}

export function FloatingLeadTrigger({ onClick }: FloatingLeadTriggerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3">
      {/* 1. Animated WhatsApp Floating Button (Message appears ONLY on hover) */}
      <div className="relative group">
        {/* Hover Tooltip (Appears ONLY on hover) */}
        <div className="absolute -top-9 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap rounded-lg bg-slate-900 text-white dark:bg-card dark:text-foreground px-3 py-1 text-xs font-semibold shadow-xl border border-white/10 flex items-center gap-1.5 translate-y-1 group-hover:translate-y-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>Chat on WhatsApp • Instant Reply</span>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-900 dark:border-t-card" />
        </div>

        {/* WhatsApp Button with sleek pulse animation */}
        <a
          href="https://wa.me/919328612083?text=Hi%20Appnix%20Team!%20I%20would%20like%20to%20learn%20more%20about%20your%20Omnichannel%20SaaS%20Platform."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-95 cursor-pointer animate-[pulse_3s_ease-in-out_infinite]"
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
          {/* Subtle live ping badge */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
          </span>
        </a>
      </div>

      {/* 2. Animated "Talk to an Expert" Button (Message appears ONLY on hover) */}
      <div className="relative group">
        {/* Hover Tooltip (Appears ONLY on hover) */}
        <div className="absolute -top-9 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap rounded-lg bg-slate-900 text-white dark:bg-card dark:text-foreground px-3 py-1 text-xs font-semibold shadow-xl border border-white/10 flex items-center gap-1.5 translate-y-1 group-hover:translate-y-0">
          <span>Book a 1-on-1 Product Demo</span>
          <div className="absolute top-full right-6 border-4 border-transparent border-t-slate-900 dark:border-t-card" />
        </div>

        {/* Expert Button */}
        <Button
          onClick={onClick}
          size="lg"
          className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary/95 to-indigo-700 px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xl shadow-primary/25 ring-4 ring-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 cursor-pointer"
        >
          {/* Live pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>

          <Headphones className="h-4 w-4 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
          <span>Talk to an Expert</span>
        </Button>
      </div>
    </div>
  );
}
