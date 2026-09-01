"use client";

import React, { memo } from "react";
import {
  MessageSquare,
  Camera,
  Smartphone,
  ScanLine,
  CheckCheck,
  Clock,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChannelType, LiveChatConversation } from "@/types/live-chat";
import { TagBadge } from "../tags/TagBadge";
import { cn } from "@/lib/utils";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.32 4.86L2 22l5.36-1.4a9.9 9.9 0 0 0 4.68 1.19h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.18.83.85-3.1-.2-.32a8.14 8.14 0 0 1-1.26-4.36c0-4.51 3.68-8.19 8.2-8.19 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.51-3.68 8.27-8.1 8.27Zm4.49-6.13c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

const CHANNEL_CONFIG: Record<
  ChannelType,
  {
    name: string;
    icon: React.ElementType;
    iconStyle: string;
    badgeStyle: string;
  }
> = {
  whatsapp: {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    iconStyle: 'bg-emerald-500 text-white',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  },
  instagram: {
    name: 'Instagram',
    icon: Camera,
    iconStyle: 'bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white',
    badgeStyle: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
  },
  rcs: {
    name: 'RCS',
    icon: Smartphone,
    iconStyle: 'bg-indigo-600 text-white',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    iconStyle: 'bg-blue-600 text-white',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  },
};

interface LiveChatConversationItemProps {
  conversation: LiveChatConversation;
  isSelected: boolean;
  isBulkSelected: boolean;
  isBulkMode: boolean;
  onSelectConversation: (id: string) => void;
  onToggleBulkSelect: (id: string) => void;
}

export const LiveChatConversationItem = memo(function LiveChatConversationItem({
  conversation,
  isSelected,
  isBulkSelected,
  isBulkMode,
  onSelectConversation,
  onToggleBulkSelect,
}: LiveChatConversationItemProps) {
  const channelMeta = CHANNEL_CONFIG[conversation.channel];
  const ChannelIcon = channelMeta.icon;
  const session = conversation.session;

  return (
    <div
      onClick={() => onSelectConversation(conversation.id)}
      className={cn(
        "w-full flex items-start gap-3 p-3 text-left transition-all relative border-b border-border/40 cursor-pointer group select-none",
        isSelected
          ? "bg-accent/80 border-l-4 border-l-primary shadow-2xs"
          : "hover:bg-muted/40",
        isBulkSelected && "bg-indigo-50/50 dark:bg-indigo-950/30"
      )}
    >
      {/* Bulk Checkbox */}
      {isBulkMode && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleBulkSelect(conversation.id);
          }}
          className="pt-2 shrink-0"
        >
          <Checkbox checked={isBulkSelected} />
        </div>
      )}

      {/* Avatar & Channel Badge */}
      <div className="relative shrink-0 mt-0.5">
        {conversation.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={conversation.avatarUrl}
            alt={conversation.name}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-border shadow-2xs"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-2xs">
            {conversation.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Channel Icon Badge on Avatar Corner */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full flex items-center justify-center ring-2 ring-card shadow-2xs",
            channelMeta.iconStyle
          )}
          title={channelMeta.name}
        >
          <ChannelIcon className="h-2.5 w-2.5" />
        </div>

        {/* Online Indicator */}
        {conversation.online && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
        )}
      </div>

      {/* Main Conversation Details */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Row 1: Name & Timestamp */}
        <div className="flex items-center justify-between gap-1">
          <p className="font-bold text-xs text-foreground truncate">
            {conversation.name}
          </p>
          <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
            {conversation.lastMessageTime}
          </span>
        </div>

        {/* Row 2: Phone / Handle + 24-hr Care Session Status Indicator */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-muted-foreground truncate font-mono text-[10px]">
            {conversation.identifier}
          </span>

          {/* 24-Hour Session Status Badge */}
          {session.isActive ? (
            <span
              className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-900 shrink-0"
              title={`24-Hour customer care window active (${session.remainingHours}h ${session.remainingMinutes}m remaining)`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{session.remainingHours}h {session.remainingMinutes}m</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[9px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900 shrink-0"
              title="24-Hour window expired. Direct text disabled; template required."
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>Expired</span>
            </span>
          )}
        </div>

        {/* Row 3: Last Message Snippet */}
        <p
          className={cn(
            "text-xs truncate",
            conversation.unreadCount > 0
              ? "font-semibold text-foreground"
              : "text-muted-foreground"
          )}
        >
          {conversation.lastMessage}
        </p>

        {/* Row 4: Custom Tags, Department, Unread Counter */}
        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
          {/* Custom Tags */}
          {conversation.tags.slice(0, 2).map((t) => (
            <TagBadge key={t.id} name={t.name} color={t.color} icon={t.icon} size="xs" />
          ))}

          {/* Unread Counter Badge */}
          {conversation.unreadCount > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs animate-pulse">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
