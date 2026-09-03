"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogOut, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestSession {
  isGuest: boolean;
  clientId: string;
  clientName: string;
  clientEmail: string;
  ownerName: string;
  plan: string;
  returnUrl?: string;
}

export function GuestModeBanner() {
  const router = useRouter();
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("appnix_guest_impersonation");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isGuest) {
          setGuestSession(parsed);
        }
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  if (!guestSession) return null;

  const handleExitGuestMode = () => {
    localStorage.removeItem("appnix_guest_impersonation");
    router.push(guestSession.returnUrl || "/super-admin/clients");
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-emerald-500/30 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-4 py-2 text-white shadow-md text-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white font-bold">
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-extrabold uppercase tracking-wide text-emerald-200">
            Guest Session Active:
          </span>
          <span className="font-semibold">
            Viewing workspace for{" "}
            <strong className="underline underline-offset-2">{guestSession.clientName}</strong>
          </span>
          <span className="text-white/80">
            ({guestSession.ownerName} • {guestSession.clientEmail})
          </span>
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            {guestSession.plan} Plan
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleExitGuestMode}
          className="h-7 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Super Admin</span>
        </Button>
      </div>
    </div>
  );
}
