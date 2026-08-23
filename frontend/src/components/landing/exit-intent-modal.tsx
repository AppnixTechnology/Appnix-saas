"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ExitIntentModalProps {
  onOpenDemoModal: () => void;
}

export function ExitIntentModal({ onOpenDemoModal }: ExitIntentModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only on desktop
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const hasShown = sessionStorage.getItem("appnix_exit_intent_shown");
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !sessionStorage.getItem("appnix_exit_intent_shown")) {
        sessionStorage.setItem("appnix_exit_intent_shown", "true");
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleDemoClick = () => {
    setIsOpen(false);
    onOpenDemoModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        <div className="bg-gradient-to-br from-[#0B1E5B] to-slate-900 p-6 sm:p-7 text-white relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 mb-3">
            <Zap className="h-3.5 w-3.5" />
            Exclusive Product Sandbox
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            Before you go...
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm mt-1.5">
            Discover how Appnix unifies WhatsApp, Instagram, RCS, and CRM to increase your customer conversion rate by up to 3x.
          </DialogDescription>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Full WhatsApp Cloud API & RCS sandbox access</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>1-on-1 walkthrough tailored to your industry</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Zero commitment • 14 days 100% free trial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              onClick={handleDemoClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 h-10 text-sm shadow-md cursor-pointer"
            >
              {t.nav.bookDemo}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              className="font-medium h-10 text-sm border-border hover:bg-accent"
            >
              <Link href="/signup">{t.nav.startFreeTrial}</Link>
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
            >
              Continue exploring website
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
