"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  Tag as TagIcon,
  Sparkles,
  AlertCircle,
  Eye,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ContactTag,
  CreateTagPayload,
  TagColorId,
  TagIconId,
  TagValidationError,
} from "@/types/contact-tag";
import {
  TAG_COLOR_PALETTE,
  TAG_ICONS_LIST,
  generateTagSlug,
  validateTag,
} from "@/lib/contact-tags";
import { TagBadge } from "./TagBadge";
import { cn } from "@/lib/utils";

interface CreateTagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateTagPayload & { id?: string }) => Promise<void>;
  initialData?: ContactTag | null;
  existingTags?: ContactTag[];
}

export function CreateTagDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingTags = [],
}: CreateTagDrawerProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState<TagColorId>(initialData?.color || "blue");
  const [icon, setIcon] = useState<TagIconId>(initialData?.icon || "tag");
  const [validationErrors, setValidationErrors] = useState<TagValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setColor(initialData.color);
      setIcon(initialData.icon);
    } else {
      setName("");
      setDescription("");
      setColor("blue");
      setIcon("tag");
    }
    setValidationErrors([]);
    setIsSaving(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const payload = {
      id: initialData?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      icon,
    };

    const errors = validateTag(payload, existingTags);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setIsSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (e) {
      console.error("Failed to save tag:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentSlug = generateTagSlug(name || "tag-preview");

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card text-card-foreground h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b flex items-start justify-between bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <TagIcon className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                {initialData ? `Edit Tag: ${initialData.name}` : "Create New CRM Tag"}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Define tag nomenclature, icon iconography, and visual color taxonomy.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Validation Alert */}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3.5 space-y-1 text-xs text-rose-800 dark:text-rose-200">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Please fix validation issues:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. Live Preview Banner */}
          <div className="rounded-2xl border bg-gradient-to-br from-slate-50 to-muted/40 dark:from-slate-900 dark:to-muted/20 p-4 space-y-2 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Live Badge Preview
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                slug: {currentSlug}
              </span>
            </div>
            <div className="py-2 flex items-center justify-center">
              <TagBadge
                name={name || "Sample Tag"}
                color={color}
                icon={icon}
                size="md"
                className="shadow-xs"
              />
            </div>
          </div>

          {/* 2. Tag Name Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground text-xs block">
              Tag Name <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Hot Lead / VIP Customer / Paid User"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs bg-background font-semibold"
            />
            <span className="text-[10px] text-muted-foreground">
              Unique display label visible in contact lists, conversation cards, and workflow filters.
            </span>
          </div>

          {/* 3. Curated Icon Selector */}
          <div className="space-y-2">
            <label className="font-bold text-foreground text-xs block">
              Select Tag Icon <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TAG_ICONS_LIST.map((ic) => {
                const isSelected = icon === ic.id;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIcon(ic.id)}
                    className={cn(
                      "p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                        : "border-border hover:bg-muted/40 hover:border-primary/40"
                    )}
                  >
                    <TagBadge name="" color={color} icon={ic.id} size="xs" />
                    <span className="text-[9px] font-medium text-foreground truncate max-w-full">
                      {ic.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Color Swatch Palette */}
          <div className="space-y-2">
            <label className="font-bold text-foreground text-xs block">
              Select Color Swatch <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(TAG_COLOR_PALETTE) as TagColorId[]).map((cKey) => {
                const swatch = TAG_COLOR_PALETTE[cKey];
                const isSelected = color === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={cn(
                      "p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-2xs"
                        style={{ backgroundColor: swatch.dotColor }}
                      />
                      <span className="font-semibold text-xs text-foreground">
                        {swatch.name}
                      </span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Tag Description (Optional) */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground text-xs block">
              Description / Business Context (Optional)
            </label>
            <Input
              placeholder="e.g. Assigned to contacts with active enterprise pipeline deals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Tag...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{initialData ? "Update Tag" : "Create Tag"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
