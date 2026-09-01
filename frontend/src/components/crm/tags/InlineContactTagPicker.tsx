"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Tag as TagIcon,
  Search,
  Check,
  Plus,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContactTag } from "@/types/contact-tag";
import { useContactTags } from "@/hooks/useContactTags";
import { TagBadge } from "./TagBadge";
import { cn } from "@/lib/utils";

interface InlineContactTagPickerProps {
  assignedTagLabels: string[]; // e.g. ["VIP", "star"]
  onTagsChange: (newTagLabels: string[]) => void;
  className?: string;
}

export function InlineContactTagPicker({
  assignedTagLabels,
  onTagsChange,
  className,
}: InlineContactTagPickerProps) {
  const { tags } = useContactTags();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filtered available tags
  const filteredAvailableTags = useMemo(() => {
    return tags.filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
    });
  }, [tags, search]);

  const toggleTag = (tagName: string) => {
    if (assignedTagLabels.includes(tagName)) {
      onTagsChange(assignedTagLabels.filter((t) => t !== tagName));
    } else {
      onTagsChange([...assignedTagLabels, tagName]);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
      >
        <TagIcon className="h-3 w-3" />
        <span>{assignedTagLabels.length > 0 ? "Edit Tags" : "+ Add Tag"}</span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-xl border bg-card p-3 shadow-xl space-y-2.5 animate-in zoom-in-95 text-xs">
          <div className="flex items-center justify-between border-b pb-1.5">
            <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
              <TagIcon className="h-3 w-3 text-primary" />
              <span>Assign Contact Tags</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search or filter tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 h-7 text-[11px] bg-background"
            />
          </div>

          {/* Tags List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {filteredAvailableTags.length === 0 ? (
              <p className="text-[11px] text-muted-foreground text-center py-2">
                No matching tags found
              </p>
            ) : (
              filteredAvailableTags.map((tag) => {
                const isAssigned = assignedTagLabels.some(
                  (label) =>
                    label.toLowerCase() === tag.name.toLowerCase() ||
                    label.toLowerCase() === tag.slug.toLowerCase()
                );

                return (
                  <div
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={cn(
                      "p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors",
                      isAssigned
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/50 border border-transparent"
                    )}
                  >
                    <TagBadge tag={tag} size="xs" />
                    {isAssigned && <Check className="h-3 w-3 text-primary stroke-[3]" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
