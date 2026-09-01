"use client";

import { useState } from "react";
import {
  Search,
  X,
  Filter,
  CheckCheck,
  Tag as TagIcon,
  Clock,
  Send,
  Users,
  Shield,
  ArrowRightLeft,
  CheckSquare,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BulkChatActionPayload,
  ChannelType,
  DepartmentId,
  LiveChatConversation,
} from "@/types/live-chat";
import { LiveChatConversationItem } from "./LiveChatConversationItem";
import { TagBadge } from "../tags/TagBadge";
import { useContactTags } from "@/hooks/useContactTags";
import { cn } from "@/lib/utils";

interface LiveChatConversationListProps {
  conversations: LiveChatConversation[];
  activeConvId: string;
  onSelectConversation: (id: string) => void;
  selectedChannel: ChannelType | "all";
  onSelectChannel: (channel: ChannelType | "all") => void;
  selectedTagId: string | null;
  onSelectTagId: (tagId: string | null) => void;
  sessionFilter: "all" | "active_24h" | "expired_24h";
  onSelectSessionFilter: (filter: "all" | "active_24h" | "expired_24h") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedConvIds: string[];
  isBulkMode: boolean;
  onToggleBulkSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onExecuteBulkAction: (payload: BulkChatActionPayload) => void;
  onOpenBulkTransferModal: () => void;
}

export function LiveChatConversationList({
  conversations,
  activeConvId,
  onSelectConversation,
  selectedChannel,
  onSelectChannel,
  selectedTagId,
  onSelectTagId,
  sessionFilter,
  onSelectSessionFilter,
  searchQuery,
  onSearchQueryChange,
  selectedConvIds,
  isBulkMode,
  onToggleBulkSelect,
  onToggleSelectAll,
  onExecuteBulkAction,
  onOpenBulkTransferModal,
}: LiveChatConversationListProps) {
  const { tags: workspaceTags } = useContactTags();

  return (
    <div className="w-full sm:w-80 md:w-88 lg:w-96 flex flex-col border-r bg-card shrink-0 h-full overflow-hidden">
      {/* 1. Search Bar */}
      <div className="p-3 border-b space-y-2.5 bg-card">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search chats by name, phone, message..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-8.5 h-8.5 text-xs bg-muted/20"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* 2. Quick Channel Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
          {[
            { id: "all", label: "All Channels" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "instagram", label: "Instagram" },
            { id: "rcs", label: "RCS" },
            { id: "facebook", label: "Facebook" },
          ].map((ch) => {
            const isSelected = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChannel(ch.id as any)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 whitespace-nowrap",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                {ch.label}
              </button>
            );
          })}
        </div>

        {/* 3. Session Status Filter (24-Hour Care Window) */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t text-[10px]">
          <span className="font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Clock className="h-3 w-3" />
            24h Window:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectSessionFilter("all")}
              className={cn(
                "px-2 py-0.5 rounded font-semibold transition-colors",
                sessionFilter === "all"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => onSelectSessionFilter("active_24h")}
              className={cn(
                "px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1",
                sessionFilter === "active_24h"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Active</span>
            </button>
            <button
              onClick={() => onSelectSessionFilter("expired_24h")}
              className={cn(
                "px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1",
                sessionFilter === "expired_24h"
                  ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>Expired</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bulk Action Floating Bar (when items are selected) */}
      {isBulkMode && selectedConvIds.length > 0 && (
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-900 flex items-center justify-between gap-2 animate-in slide-in-from-top-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">
              {selectedConvIds.length} selected
            </span>
            <button
              onClick={onToggleSelectAll}
              className="text-[11px] text-indigo-700 dark:text-indigo-300 underline font-medium"
            >
              {selectedConvIds.length === conversations.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={onOpenBulkTransferModal}
              className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1"
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>Transfer</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onExecuteBulkAction({
                  conversationIds: selectedConvIds,
                  action: "MARK_READ",
                })
              }
              className="h-7 text-[11px] gap-1"
            >
              <CheckCheck className="h-3 w-3" />
              <span>Mark Read</span>
            </Button>
          </div>
        </div>
      )}

      {/* 5. Conversation Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground space-y-2.5">
            <Filter className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <p className="text-xs font-bold text-foreground">No Conversations Found</p>
            <p className="text-[11px]">
              No conversations match your current search and channel filters.
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <LiveChatConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={activeConvId === conv.id}
              isBulkSelected={selectedConvIds.includes(conv.id)}
              isBulkMode={isBulkMode}
              onSelectConversation={onSelectConversation}
              onToggleBulkSelect={onToggleBulkSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
