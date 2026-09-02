"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FeatureFlag } from "@/super-admin/types";
import { featureFlagService } from "@/super-admin/services";
import { FlagModal } from "@/super-admin/components/feature-flags/FlagModal";
import {
  Flag,
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  Edit2,
} from "lucide-react";

export default function SuperAdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);

  const fetchFlags = () => {
    featureFlagService.getAll().then(setFlags);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = (flag: FeatureFlag) => {
    const actionName = flag.isEnabled ? "DISABLE" : "ENABLE";
    if (
      flag.impactLevel === "High" &&
      !confirm(`Are you sure you want to ${actionName} high-impact flag "${flag.name}"?`)
    ) {
      return;
    }

    featureFlagService.toggle(flag.id).then(() => {
      fetchFlags();
    });
  };

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingFlag(null);
    setIsModalOpen(true);
  };

  const filteredFlags = flags.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "Enabled") return f.isEnabled;
    if (activeFilter === "Disabled") return !f.isEnabled;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Feature Flags</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            <Flag className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Feature Flags & Capabilities
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Control platform capabilities, experimental rollouts, and multi-tenant feature gating.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Feature Flag
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {["All", "Enabled", "Disabled"].map((tab) => {
            const isSelected = activeFilter === tab;
            const count =
              tab === "All"
                ? flags.length
                : tab === "Enabled"
                ? flags.filter((f) => f.isEnabled).length
                : flags.filter((f) => !f.isEnabled).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors",
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    isSelected ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search feature flags by key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 bg-background pl-8.5 text-xs"
          />
        </div>
      </div>

      {/* Feature Flags Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 text-left">Feature Name & Key</th>
                <th className="min-w-64 p-4 text-left">Description</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-left">Environment</th>
                <th className="p-4 text-left">Impact</th>
                <th className="p-4 text-left">Updated By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlags.map((flag) => (
                <tr
                  key={flag.id}
                  className="border-b text-xs transition-colors last:border-0 hover:bg-muted/30"
                >
                  {/* Name & Key */}
                  <td className="p-4">
                    <p className="font-bold text-foreground">{flag.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {flag.key}
                    </p>
                  </td>

                  {/* Description */}
                  <td className="p-4 text-xs leading-relaxed text-muted-foreground">
                    {flag.description}
                  </td>

                  {/* Status Toggle */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={flag.isEnabled}
                        onCheckedChange={() => handleToggle(flag)}
                      />
                      <span
                        className={cn(
                          "text-[11px] font-bold",
                          flag.isEnabled ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {flag.isEnabled ? "ON" : "OFF"}
                      </span>
                    </div>
                  </td>

                  {/* Environment */}
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        flag.environment === "Production" && "border-primary/30 bg-primary/10 text-primary",
                        flag.environment === "Beta" && "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        flag.environment === "Staging" && "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      )}
                    >
                      {flag.environment}
                    </Badge>
                  </td>

                  {/* Impact */}
                  <td className="p-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-semibold",
                        flag.impactLevel === "High" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                        flag.impactLevel === "Medium" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                        flag.impactLevel === "Low" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      )}
                    >
                      {flag.impactLevel} Impact
                    </Badge>
                  </td>

                  {/* Updated By */}
                  <td className="whitespace-nowrap p-4 text-muted-foreground">
                    <p className="font-medium text-foreground">{flag.updatedBy}</p>
                    <p className="text-[10px]">{flag.lastUpdated}</p>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(flag)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={isModalOpen}
        flag={editingFlag}
        onClose={() => setIsModalOpen(false)}
        onSaveFlag={(saved) => {
          featureFlagService.save(saved).then(() => {
            fetchFlags();
            alert(`Flag ${saved.name} saved successfully!`);
          });
        }}
      />
    </div>
  );
}