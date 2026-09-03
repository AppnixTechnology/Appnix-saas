"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { GuestModeBanner } from "@/components/layout/GuestModeBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // OUTER: now flex-col (vertical) instead of flex (horizontal).
    // Navbar comes first, full width, on its own row.
    <div className="dashboard-shell">
      <GuestModeBanner />
      <AppNavbar onMenuClick={() => setSidebarOpen((p) => !p)} />

      {/* INNER: horizontal row for sidebar + main, placed BELOW the navbar */}
      <div className="flex flex-1 items-start">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}