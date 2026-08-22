"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";

interface StickyMobileCTAProps {
  onOpenDemoModal: () => void;
}

export function StickyMobileCTA({ onOpenDemoModal }: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md p-3 md:hidden shadow-2xl">
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenDemoModal}
          variant="outline"
          size="sm"
          className="flex-1 h-10 text-xs font-semibold border-border gap-1.5"
        >
          <PhoneCall className="h-3.5 w-3.5 text-primary" />
          Book Demo
        </Button>

        <Button
          asChild
          size="sm"
          className="flex-1 h-10 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm"
        >
          <Link href="/signup">
            Start Free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
