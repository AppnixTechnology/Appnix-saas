"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  LayoutGrid,
  Camera,
  ScanLine,
  Smartphone,
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
  ChevronDown,
  BarChart3,
  GitBranch,
  Database,
  FileText,
  KeyRound,
  Contact,
  Megaphone,
  ShieldCheck,
  Wallet,
  CreditCard,
  User,
  Bell,
  Shield,
  Palette,
  Plug,
  History,
  Send,
} from "lucide-react";

// Sub-item type for expandable menu sections
interface SubItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: SubItem[];
}

// Main navigation items shown under the "MENU" label.
const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Channels",
    href: "/channels",
    icon: ArrowLeftRight,
    children: [
      { label: "All Channels", href: "/channels", icon: LayoutGrid },
      { label: "WhatsApp", href: "/channels/whatsapp", icon: MessageSquare },
      { label: "Instagram", href: "/channels/instagram", icon: Camera },
      { label: "Facebook", href: "/channels/facebook", icon: ScanLine },
      { label: "RCS", href: "/channels/rcs", icon: Smartphone },
    ],
  },
  {
    label: "CRM",
    href: "/crm",
    icon: Users,
    children: [
      { label: "Contacts", href: "/crm/contacts", icon: Contact },
      { label: "Bulk Campaign", href: "/crm/bulk-campaign", icon: Send },
      { label: "Live Chat", href: "/crm/live-chat", icon: MessageSquare },
    ],
  },
  { label: "Chatbots", href: "/chatbots", icon: Bot },
  {
    label: "Automations",
    href: "/automations",
    icon: Zap,
    children: [
      { label: "Analytics", href: "/automations/analytics", icon: BarChart3 },
      { label: "Workflow", href: "/automations/workflow", icon: GitBranch },
      { label: "Data Store", href: "/automations/datastore", icon: Database },
      { label: "Templates", href: "/automations/templates", icon: FileText },
      {
        label: "App Authentications",
        href: "/automations/app-authentications",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "WhatsApp Mini-Apps",
    href: "/whatsapp-mini-apps",
    icon: Grid3x3,
  },
  { label: "Chat Widget", href: "/chat-widget", icon: MessageSquare },
  { label: "Voice AI Agent", href: "/voice-ai-agent", icon: Headset },
  {
    label: "Department",
    href: "/department",
    icon: Building2,
    children: [
      { label: "Analytics", href: "/department/analytics", icon: BarChart3 },
      { label: "Departments", href: "/department/departments", icon: Building2 },
      { label: "Roles", href: "/department/roles", icon: ShieldCheck },
    ],
  },
  {
    label: "Workspace",
    href: "/workspace",
    icon: Share2,
    children: [
      {
        label: "Account Settings",
        href: "/workspace/account-settings",
        icon: Settings,
      },
      {
        label: "Wallet & Transactions",
        href: "/workspace/wallet",
        icon: Wallet,
      },
      {
        label: "Billing",
        href: "/workspace/billing",
        icon: CreditCard,
      },
      {
        label: "Support",
        href: "/workspace/support",
        icon: Headset,
      },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { label: "Profile", href: "/settings/profile", icon: User },
      { label: "Notifications", href: "/settings/notifications", icon: Bell },
      { label: "Security", href: "/settings/security", icon: Shield },
      { label: "Appearance", href: "/settings/appearance", icon: Palette },
      { label: "Integrations", href: "/settings/integrations", icon: Plug },
      { label: "Activity Logs", href: "/settings/activity-logs", icon: History },
      { label: "Account & Data", href: "/settings/account-data", icon: Database },
    ],
  },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Tracks which parent menu item (by label) is expanded.
  const [expanded, setExpanded] = useState<string | null>(null);

  // Auto-expand the parent whose child route matches the current path
  // (so refreshing on a sub-page keeps the section open).
  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
      item.children?.some(
        (child) =>
          pathname === child.href ||
          (child.href !== item.href && pathname.startsWith(child.href + "/"))
      ),
    );
    if (activeParent && activeParent.children?.length) {
      setExpanded(activeParent.label);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  const toggleExpand = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "app-surface fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r transition-transform duration-200 ease-in-out",
          "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:z-20 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo row */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="brand-box">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-foreground">
                CRM Admin
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                Management Console
              </p>
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
                const Icon = item.icon;
                const hasChildren = !!item.children?.length;
                const isParentActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
                  item.children?.some(
                    (c) =>
                      pathname === c.href ||
                      (c.href !== item.href && pathname.startsWith(c.href + "/"))
                  );
                const isOpen = expanded === item.label;

                // Item without children: render a plain link (unchanged behavior)
                if (!hasChildren) {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/dashboard" && pathname === "/products");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "sidebar-nav-item",
                        isActive
                          ? "sidebar-nav-item-active"
                          : "sidebar-nav-item-inactive",
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                }

                // Item with children: render an expandable button + submenu
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "sidebar-nav-item w-full justify-between",
                        isParentActive
                          ? "sidebar-nav-item-active"
                          : "sidebar-nav-item-inactive",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {/* Submenu: animated height via grid-rows trick */}
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-200 ease-in-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-1"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-6.75 space-y-0.5 border-l border-border pl-4">
                          {item.children!.map((sub) => {
                            const isSubActive =
                              pathname === sub.href ||
                              (sub.href !== "/channels" &&
                                sub.href !== "/crm" &&
                                sub.href !== "/department" &&
                                sub.href !== "/workspace" &&
                                sub.href !== "/settings" &&
                                sub.href !== "/automations" &&
                                pathname.startsWith(sub.href + "/"));
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                                  isSubActive
                                    ? "bg-primary/10 font-medium text-primary border-l-2 border-primary -ml-4.5 pl-3"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                {SubIcon && (
                                  <SubIcon className="h-4 w-4 shrink-0" />
                                )}
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Fixed bottom section — never scrolls, always pinned to the bottom */}
          <div className="shrink-0 space-y-1 border-t border-border px-3 py-3">
            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-nav-item-danger w-full justify-start"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
