"use client";

import {
  MessageSquare,
  Users,
  Shield,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  Send,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DepartmentId } from "@/types/live-chat";
import { cn } from "@/lib/utils";

interface LiveChatTopBarProps {
  selectedDepartment: DepartmentId;
  onSelectDepartment: (dept: DepartmentId) => void;
  assignedScope: "all" | "me";
  onSelectAssignedScope: (scope: "all" | "me") => void;
  departmentCounts: Record<DepartmentId, number>;
  isBulkMode: boolean;
  onToggleBulkMode: () => void;
  selectedCount: number;
}

const DEPARTMENTS: { id: DepartmentId; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All Departments", icon: Layers },
  { id: "sales", label: "Sales & Inbound", icon: Sparkles },
  { id: "support", label: "Customer Support", icon: Users },
  { id: "billing", label: "Billing & Accounts", icon: Shield },
  { id: "onboarding", label: "Onboarding", icon: UserCheck },
];

export function LiveChatTopBar({
  selectedDepartment,
  onSelectDepartment,
  assignedScope,
  onSelectAssignedScope,
  departmentCounts,
  isBulkMode,
  onToggleBulkMode,
  selectedCount,
}: LiveChatTopBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-card border rounded-2xl p-2.5 shadow-2xs">
      {/* 1. Department Switch Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDepartment === dept.id;
          const count = departmentCounts[dept.id] || 0;

          return (
            <button
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 select-none",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{dept.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isSelected
                    ? "bg-black/20 text-white"
                    : "bg-muted text-muted-foreground font-medium"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Scope Toggle & Bulk Mode Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {/* Scope Toggle: All Chats vs Assigned to Me */}
        <div className="flex items-center border rounded-xl p-0.5 bg-muted/40 text-xs">
          <button
            onClick={() => onSelectAssignedScope("all")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-semibold transition-all text-[11px]",
              assignedScope === "all"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Chats
          </button>
          <button
            onClick={() => onSelectAssignedScope("me")}
            className={cn(
              "px-2.5 py-1 rounded-lg font-semibold transition-all text-[11px] flex items-center gap-1",
              assignedScope === "me"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Assigned to Me</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>
        </div>

        {/* Multi-Select Bulk Actions Toggle */}
        <Button
          variant={isBulkMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleBulkMode}
          className={cn(
            "h-8 text-xs font-semibold gap-1.5 shadow-2xs",
            isBulkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""
          )}
        >
          {isBulkMode ? (
            <CheckSquare className="h-3.5 w-3.5" />
          ) : (
            <Square className="h-3.5 w-3.5" />
          )}
          <span>{isBulkMode ? `Bulk Mode (${selectedCount})` : "Bulk Actions"}</span>
        </Button>
      </div>
    </div>
  );
}
