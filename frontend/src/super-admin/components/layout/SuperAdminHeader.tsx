"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Search,
  Menu,
  Maximize2,
  Bell,
  QrCode,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Clock,
} from "lucide-react";

interface SuperAdminHeaderProps {
  onMenuClick: () => void;
}

export function SuperAdminHeader({ onMenuClick }: SuperAdminHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b bg-card px-3 sm:px-6 shadow-2xs">
      {/* Left side: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-lg">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients, tickets, plans, staff, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right side: Utilities, Notifications, Admin Profile */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* QR Utility Icon - hidden on mobile to save space */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => alert("Platform Authenticator QR & Token Console")}
          className="hidden sm:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Security QR"
        >
          <QrCode className="h-4.5 w-4.5" />
        </Button>

        {/* Fullscreen Icon - hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFullscreen}
          className="hidden sm:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
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
            }}
            className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
            title="Super Admin Alerts"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-card animate-pulse" />
          </Button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[90vw] max-w-sm sm:w-80 sm:max-w-none rounded-xl border bg-card p-3 shadow-xl z-50 animate-in space-y-2">
              <div className="flex items-center justify-between border-b pb-2 px-1">
                <span className="font-bold text-xs text-foreground">Platform Alerts</span>
                <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px]">
                  3 New
                </Badge>
              </div>

              {/* 45-Day Retention Notice */}
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Alerts are automatically removed after <strong>45 days</strong>.</span>
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
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  View All Audit Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile & Avatar Menu */}
        <div className="border-l pl-1.5 sm:pl-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-primary data-[state=open]:bg-muted/80">
              <div className="hidden text-right md:block">
                <p className="text-xs font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                  Sarah Jenkins
                </p>
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs ring-2 ring-primary/30">
                SJ
              </div>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 max-w-[90vw] p-1.5 shadow-lg">
              <DropdownMenuLabel className="font-normal px-2 py-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">Sarah Jenkins</p>
                    <Badge className="bg-primary/10 text-primary text-[10px] font-semibold">
                      Root Admin
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">sarah.admin@appnix.io</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href="/super-admin/settings"
                  className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-xs text-foreground hover:bg-accent focus:bg-accent transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">Profile & Settings</span>
                    <span className="text-[10px] text-muted-foreground">Admin console preferences</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/super-admin/team"
                  className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-xs text-foreground hover:bg-accent focus:bg-accent transition-colors"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">Manage Members</span>
                    <span className="text-[10px] text-muted-foreground">Staff access & permissions</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Sign out from Super Admin Console?")) {
                    router.push("/signin");
                  }
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40 transition-colors"
              >
                <LogOut className="h-4 w-4 text-rose-600" />
                <span className="font-semibold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}