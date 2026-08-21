"use client";

import { useState } from "react";
import { SuperAdminSidebar } from "../components/layout/SuperAdminSidebar";
import { SuperAdminHeader } from "../components/layout/SuperAdminHeader";

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20 text-foreground">
      {/* Super Admin Isolated Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Super Admin Isolated Header */}
        <SuperAdminHeader onMenuClick={() => setSidebarOpen((p) => !p)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
