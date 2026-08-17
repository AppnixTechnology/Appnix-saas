"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Bot,
  Zap,
  Grid3x3,
  MessageSquare,
  Headset,
  Building2,
  Share2,
  Settings,
  LogOut,
  X,
} from "lucide-react";

// Main navigation items shown under the "MENU" label.
const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Channels", href: "/dashboard/channels", icon: ArrowLeftRight },
  { label: "CRM", href: "/dashboard/crm", icon: Users },
  { label: "Chatbots", href: "/dashboard/chatbots", icon: Bot },
  { label: "Automations", href: "/dashboard/automations", icon: Zap },
  { label: "WhatsApp Mini-Apps", href: "/dashboard/whatsapp-mini-apps", icon: Grid3x3 },
  { label: "Chat Widget", href: "/dashboard/chat-widget", icon: MessageSquare },
  { label: "Voice AI Agent", href: "/dashboard/voice-ai-agent", icon: Headset },
  { label: "Department", href: "/dashboard/department", icon: Building2 },
  { label: "Workspace", href: "/dashboard/workspace", icon: Share2 },
];

interface AppSidebarProps {
  // Controls the off-canvas drawer on mobile/tablet. Ignored on desktop (lg+),
  // where the sidebar is always visible in the layout's flex flow.
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop: only rendered on mobile when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "app-surface fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 ease-in-out",
          "lg:static lg:z-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo row */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="brand-box">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-foreground">CRM Admin</p>
              <p className="text-[11px] leading-tight text-muted-foreground">Management Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Outer content area*/}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Scrollable menu */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "sidebar-nav-item",
                      isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Fixed bottom section — never scrolls, always pinned to the bottom */}
          <div className="shrink-0 space-y-1 border-t border-border px-3 py-3">
            <Link href="/dashboard/settings" className="sidebar-nav-item sidebar-nav-item-inactive">
              <Settings className="h-[18px] w-[18px]" />
              Settings
            </Link>
            <button type="button" className="sidebar-nav-item-danger">
              <LogOut className="h-[18px] w-[18px]" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}