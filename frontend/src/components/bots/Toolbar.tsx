"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Save,
  Play,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bug,
  Share2,
} from "lucide-react";

interface ToolbarProps {
  botName: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DISABLED";
  onBack: () => void;
  onSave: () => Promise<void>;
  onTest: () => void;
  onPublish: () => Promise<void>;
  onValidate: () => Promise<{ valid: boolean; errors: string[] }>;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  validationResult: { valid: boolean; errors: string[] };
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onSettings?: () => void;
  showMinimap?: boolean;
  onToggleMinimap?: () => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  snapToGrid?: boolean;
  onToggleSnapToGrid?: () => void;
}

export function Toolbar({
  botName,
  status,
  onBack,
  onSave,
  onTest,
  onPublish,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving,
  isPublishing,
  validationResult,
  showMinimap = true,
  onToggleMinimap,
  showGrid = true,
  onToggleGrid,
  snapToGrid = true,
  onToggleSnapToGrid,
}: ToolbarProps) {
  return (
    <div className="h-14 border-b bg-card px-4 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Chatbots</span>
        </Button>

        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-bold text-sm text-foreground truncate max-w-[180px] sm:max-w-[260px]">
            {botName || "Untitled Botflow"}
          </h2>
          <Badge
            variant={status === "PUBLISHED" ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-bold px-1.5 py-0",
              status === "PUBLISHED"
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
            )}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Center: Undo/Redo & View toggles */}
      <div className="hidden md:flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Right: Actions (Test, Save, Publish) */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTest}
          className="h-8 text-xs gap-1.5 font-semibold text-foreground hover:bg-accent"
        >
          <Bug className="h-3.5 w-3.5 text-primary" />
          <span>Test Simulator</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-8 text-xs gap-1.5 font-semibold text-foreground hover:bg-accent"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </Button>

        <Button
          size="sm"
          onClick={onPublish}
          disabled={isPublishing}
          className="h-8 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs px-3"
        >
          {isPublishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span>Publish</span>
        </Button>
      </div>
    </div>
  );
}