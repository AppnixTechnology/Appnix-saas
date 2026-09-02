"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Flag,
  LifeBuoy,
  Users,
  History,
  Activity,
  Settings,
  LogOut,
  X,
  Shield,
} from "lucide-react";

interface SuperAdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/super-admin/clients", icon: Building2 },
  { label: "Billing & Plans", href: "/super-admin/billing", icon: CreditCard },
  { label: "Feature Flags", href: "/super-admin/feature-flags", icon: Flag },
  { label: "Support Tickets", href: "/super-admin/support", icon: LifeBuoy },
  { label: "Team / Staff", href: "/super-admin/team", icon: Users },
  { label: "Audit Logs", href: "/super-admin/audit-logs", icon: History },
  { label: "System Health", href: "/super-admin/system-health", icon: Activity },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

export function SuperAdminSidebar({ open, onClose }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const asideRef = useRef<HTMLElement>(null);

  // Tracks whether the last click that caused navigation originated inside the sidebar.
  // Starts as true so the correct item is highlighted on first load / direct URL visit.
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedInsideSidebar = asideRef.current?.contains(target) ?? false;
      setHighlightEnabled(clickedInsideSidebar);
    };

    // capture phase so this runs before Link's own navigation logic
    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, []);

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
        ref={asideRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[80vw] max-w-64 flex-col border-r bg-card text-card-foreground transition-transform duration-200 ease-in-out shadow-sm",
          "lg:static lg:z-0 lg:w-64 lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-tight text-foreground uppercase truncate">
                Appnix
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                Super Admin Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
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
                const isActive =
                  highlightEnabled &&
                  (pathname === item.href ||
                    (item.href !== "/super-admin" && pathname.startsWith(item.href + "/")));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary font-bold border-l-4 border-primary -ml-1 pl-3 shadow-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
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