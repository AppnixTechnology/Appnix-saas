"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Palette,
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function AppearanceSettingsPage() {
  const { theme, setTheme, mounted } = useTheme();
  const [compactDensity, setCompactDensity] = useState(false);

  const themeOptions = [
    {
      id: "light",
      label: "Light Mode",
      icon: Sun,
      description: "Clean, crisp light background with optimal daytime contrast.",
    },
    {
      id: "dark",
      label: "Dark Mode",
      icon: Moon,
      description: "High-contrast dark palette designed for reduced eye strain.",
    },
    {
      id: "system",
      label: "System Default",
      icon: Laptop,
      description: "Automatically matches your operating system theme settings.",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Settings</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Appearance</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Appearance & Themes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize the interface look and feel, theme brightness, and display density.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selector Grid */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground">Color Theme</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((opt) => {
              const isSelected = mounted && theme === opt.id;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "flex flex-col text-left p-5 rounded-xl border-2 transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{opt.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar & Layout Preferences */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground">Layout & UI Density</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Compact Data Density</p>
                <p className="text-[11px] text-muted-foreground">
                  Reduce row padding in tables for CRM contacts and live chat queues.
                </p>
              </div>
              <Button
                variant={compactDensity ? "default" : "outline"}
                size="sm"
                onClick={() => setCompactDensity(!compactDensity)}
                className="text-xs"
              >
                {compactDensity ? "Compact ON" : "Standard"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
