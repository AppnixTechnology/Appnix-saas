"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Menu,
  Maximize2,
  Bell,
  QrCode,
  Shield,
  User,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
} from "lucide-react";

interface SuperAdminHeaderProps {
  onMenuClick: () => void;
}

export function SuperAdminHeader({ onMenuClick }: SuperAdminHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "Urgent Support Escalation",
      desc: "Acme Corp (Enterprise) opened Ticket #TKT-8902",
      time: "10 mins ago",
      type: "urgent",
    },
    {
      id: "n2",
      title: "Negative Wallet Balance",
      desc: "Global Logistics dipped to -$120.00",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: "n3",
      title: "Worker Node 04 Degraded",
      desc: "BullMQ background queue memory reached 88%",
      time: "3 hours ago",
      type: "warning",
    },
  ];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 shadow-2xs">
      {/* Left side: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients, tickets, plans, staff, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-emerald-600"
          />
        </div>
      </div>

      {/* Right side: Utilities, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* QR Utility Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => alert("Platform Authenticator QR & Token Console")}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Security QR"
        >
          <QrCode className="h-4.5 w-4.5" />
        </Button>

        {/* Fullscreen Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFullscreen}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="h-4.5 w-4.5" />
        </Button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileMenuOpen(false);
            }}
            className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
            title="Super Admin Alerts"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-card animate-pulse" />
          </Button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card p-3 shadow-xl z-50 animate-in space-y-2">
              <div className="flex items-center justify-between border-b pb-2 px-1">
                <span className="font-bold text-xs text-foreground">Platform Alerts</span>
                <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px]">
                  3 New
                </Badge>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors text-xs space-y-1"
                  >
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.desc}</p>
                    <span className="text-[10px] text-muted-foreground block">{n.time}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 text-center">
                <Link
                  href="/super-admin/audit-logs"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  View All Audit Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile & Avatar Menu */}
        <div className="relative border-l pl-2 sm:pl-3">
          <button
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold leading-tight text-foreground group-hover:text-emerald-600 transition-colors">
                Sarah Jenkins
              </p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Super Admin
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-600/30">
              SJ
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card p-2 shadow-xl z-50 animate-in space-y-1">
              <div className="px-3 py-2 border-b">
                <p className="text-xs font-bold text-foreground">Sarah Jenkins</p>
                <p className="text-[11px] text-muted-foreground">sarah.admin@appnix.io</p>
                <Badge className="mt-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold">
                  Root Administrator
                </Badge>
              </div>

              <Link
                href="/super-admin/settings"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Console Settings
              </Link>

              <Link
                href="/super-admin/team"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-foreground hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                Team & Access
              </Link>

              <div className="border-t pt-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (confirm("Sign out from Super Admin Console?")) {
                      router.push("/signin");
                    }
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
