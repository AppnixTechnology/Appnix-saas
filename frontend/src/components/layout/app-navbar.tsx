"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, Menu, ScanLine, Maximize2, Bell, Users } from "lucide-react";

interface AppNavbarProps {
  // Toggles the mobile sidebar drawer, lifted from the parent shell.
  onMenuClick: () => void;
}

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
  return (
    <header className="app-surface sticky top-0 z-30 flex h-16 items-stretch border-b">
      {/* Brand column: width-matched to the sidebar (w-64) on desktop so the
          right border lines up with the sidebar's border below it. */}
      <div className="flex shrink-0 items-center gap-2 border-r border-border px-4 lg:w-64">
        <div className="brand-box">
          <Users className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight text-foreground">CRM Admin</p>
          <p className="text-[11px] leading-tight text-muted-foreground">Management Console</p>
        </div>
      </div>

      {/* Right side of the header: hamburger, search, icons, user */}
      <div className="flex flex-1 items-center gap-3 px-3 sm:px-4 lg:px-6">
        {/* <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button> */}

        {/* Search bar: grows to fill space, shrinks gracefully on small screens */}
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search insights..."
            className="navbar-search-input"
          />
        </div>

        {/* Right-side icons + user */}
        <div className="ml-auto flex items-center gap-0.5 sm:gap-2">
          <button className="navbar-icon-btn" aria-label="Scan">
            <ScanLine className="h-[18px] w-[18px]" />
          </button>
          <button className="navbar-icon-btn" aria-label="Fullscreen">
            <Maximize2 className="h-[18px] w-[18px]" />
          </button>
          <button className="navbar-icon-btn relative" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive sm:right-1.5 sm:top-1.5" />
          </button>

          <div className="ml-1 flex items-center gap-2 border-l border-border pl-1.5 sm:pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-foreground">Video User</p>
              <p className="text-xs leading-tight text-muted-foreground">Administrator</p>
            </div>
            <Image
              src="/avatar-placeholder.jpg"
              alt="Video User"
              width={36}
              height={36}
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
}