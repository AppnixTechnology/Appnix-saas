"use client";

import {
  Star,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Bookmark,
  Tag as TagIcon,
  Heart,
  Zap,
  Sparkles,
  X,
} from "lucide-react";
import { ContactTag, TagColorId, TagIconId } from "@/types/contact-tag";
import { TAG_COLOR_PALETTE } from "@/lib/contact-tags";
import { cn } from "@/lib/utils";

const ICONS_MAP: Record<TagIconId, React.ElementType> = {
  star: Star,
  flame: Flame,
  "check-circle": CheckCircle2,
  "alert-triangle": AlertTriangle,
  shield: Shield,
  bookmark: Bookmark,
  tag: TagIcon,
  heart: Heart,
  zap: Zap,
  sparkles: Sparkles,
};

interface TagBadgeProps {
  tag?: ContactTag;
  name?: string;
  color?: TagColorId;
  icon?: TagIconId;
  size?: "xs" | "sm" | "md";
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({
  tag,
  name,
  color,
  icon,
  size = "sm",
  onRemove,
  className,
}: TagBadgeProps) {
  const tagName = tag?.name || name || "Tag";
  const tagColor = tag?.color || color || "slate";
  const tagIcon = tag?.icon || icon || "tag";

  const colorConfig = TAG_COLOR_PALETTE[tagColor] || TAG_COLOR_PALETTE.slate;
  const IconComponent = ICONS_MAP[tagIcon] || TagIcon;

  const sizeClasses = {
    xs: "text-[9px] px-1.5 py-0.5 gap-1",
    sm: "text-[10px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  const iconSizes = {
    xs: "h-2.5 w-2.5",
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold border transition-colors select-none",
        colorConfig.badgeClass,
        sizeClasses[size],
        className
      )}
    >
      <IconComponent className={cn(iconSizes[size], colorConfig.iconClass, "shrink-0")} />
      <span className="truncate">{tagName}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 focus:outline-hidden ml-0.5"
          title="Remove tag"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
}
