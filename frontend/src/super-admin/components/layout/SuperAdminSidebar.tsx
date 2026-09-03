"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Flag,
  LifeBuoy,
  ShieldCheck,
  History,
  Activity,
  Settings,
  LogOut,
  X,
  Shield,
  ChevronDown,
  UserPlus,
  Plus,
  Users,
} from "lucide-react";

interface SuperAdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface SubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  badge?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  {
    id: "clients",
    label: "Clients",
    href: "/super-admin/clients",
    icon: Building2,
    children: [
      { label: "All Clients", href: "/super-admin/clients", icon: Users },
      {
        label: "Add Client",
        href: "/super-admin/clients?action=add",
        icon: UserPlus,
        badge: "New",
      },
    ],
  },
  { id: "billing", label: "Billing & Plans", href: "/super-admin/billing", icon: CreditCard },
  { id: "feature-flags", label: "Feature Flags", href: "/super-admin/feature-flags", icon: Flag },
  { id: "support", label: "Support Tickets", href: "/super-admin/support", icon: LifeBuoy },
  { id: "team", label: "Team / Staff", href: "/super-admin/team", icon: ShieldCheck },
  { id: "audit-logs", label: "Audit Logs", href: "/super-admin/audit-logs", icon: History },
  { id: "system-health", label: "System Health", href: "/super-admin/system-health", icon: Activity },
  { id: "settings", label: "Settings", href: "/super-admin/settings", icon: Settings },
];

export function SuperAdminSidebar({ open, onClose }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Keep Clients expanded by default or when on clients path
  const [expanded, setExpanded] = useState<string | null>(() => {
    return pathname.startsWith("/super-admin/clients") ? "clients" : null;
  });

  useEffect(() => {
    if (pathname.startsWith("/super-admin/clients")) {
      setExpanded("clients");
    }
  }, [pathname]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleLogout = () => {
    if (confirm("Sign out from Super Admin Console?")) {
      router.push("/signin");
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card text-card-foreground transition-transform duration-200 ease-in-out shadow-sm h-full",
          "lg:static lg:z-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-foreground uppercase">
                Appnix
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Super Admin Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Platform Administration
            </p>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const hasChildren = !!item.children?.length;
                const isParentActive =
                  pathname === item.href ||
                  (item.href !== "/super-admin" && pathname.startsWith(item.href));
                const isOpen = expanded === item.id;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                        isParentActive
                          ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold border-l-4 border-emerald-600 -ml-1 pl-3 shadow-xs"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isParentActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                }

                // Expandable parent item (e.g. Clients)
                return (
                  <div key={item.id} className="space-y-0.5">
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none",
                        isParentActive
                          ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold border-l-4 border-emerald-600 -ml-1 pl-3 shadow-xs"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          // Allow click on text/icon to navigate and expand
                          if (!isOpen) setExpanded(item.id);
                        }}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isParentActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(item.id);
                        }}
                        className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Toggle submenu"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                    </div>

                    {/* Submenu */}
                    {isOpen && (
                      <div className="ml-4 space-y-0.5 border-l border-border pl-3 pt-1 pb-1 animate-in fade-in duration-150">
                        {item.children!.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors cursor-pointer",
                                pathname === sub.href
                                  ? "bg-emerald-100/60 dark:bg-emerald-900/40 font-semibold text-emerald-700 dark:text-emerald-300"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {SubIcon && <SubIcon className="h-3.5 w-3.5 shrink-0" />}
                                <span className="truncate">{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white shadow-2xs">
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Logout Area */}
          <div className="shrink-0 space-y-2 border-t p-3 bg-muted/20">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
