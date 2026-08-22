"use client";

import { MessageSquareText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingLeadTriggerProps {
  onClick: () => void;
}

export function FloatingLeadTrigger({ onClick }: FloatingLeadTriggerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3">
      <Button
        onClick={onClick}
        size="lg"
        className="group relative flex items-center gap-2.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 ring-4 ring-primary/10 transition-all duration-300 hover:scale-105 hover:bg-primary/95 hover:shadow-2xl hover:shadow-primary/35 active:scale-95"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <MessageSquareText className="h-4 w-4 transition-transform group-hover:rotate-12" />
        <span>Talk to an Expert</span>
        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-medium tracking-wide">
          Live
        </span>
      </Button>
    </div>
  );
}
