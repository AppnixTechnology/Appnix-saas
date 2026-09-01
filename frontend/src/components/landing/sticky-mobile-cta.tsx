"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones } from "lucide-react";
import { WhatsAppIcon } from "@/components/landing/channel-icons";
import { useTranslation } from "@/lib/i18n";

interface StickyMobileCTAProps {
  onOpenDemoModal: () => void;
}

export function StickyMobileCTA({ onOpenDemoModal }: StickyMobileCTAProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md p-2.5 md:hidden shadow-2xl">
      <div className="flex items-center gap-2">
        {/* WhatsApp Mobile Chat Action */}
        <a
          href="https://wa.me/917753983175?text=Hi%20Appnix%20Team!%20I%20would%20like%20to%20learn%20more%20about%20your%20Omnichannel%20SaaS%20Platform."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Chat"
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-xs font-bold text-white shadow-xs active:scale-95"
        >
          <WhatsAppIcon className="h-4 w-4 text-white shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Talk to Expert / Demo */}
        <Button
          onClick={onOpenDemoModal}
          variant="outline"
          size="sm"
          className="flex-1 h-10 text-xs font-semibold border-border gap-1.5"
        >
          <Headphones className="h-3.5 w-3.5 text-primary" />
          <span>{t.stickyMobile.talkToTeam}</span>
        </Button>

        {/* Start Free */}
        <Button
          asChild
          size="sm"
          className="flex-1 h-10 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1 shadow-xs"
        >
          <Link href="/signup">
            <span>{t.stickyMobile.startTrial}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
