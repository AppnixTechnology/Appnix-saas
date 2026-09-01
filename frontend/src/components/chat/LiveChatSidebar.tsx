"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Calendar,
  ArrowUpDown,
  Filter,
  Loader2,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/axios";
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  RCSIcon,
} from "@/components/landing/channel-icons";

export interface ChatMessage {
  id: string;
  sender: "customer" | "agent";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface ConversationItem {
  id: string;
  contactName: string;
  phoneNumber?: string;
  identifier: string;
  channel: "whatsapp" | "instagram" | "rcs" | "facebook";
  avatarUrl?: string;
  online: boolean;
  unreadCount: number;
  tags: string[];
  budget?: string;
  goal?: string;
  lastMessage: string;
  lastMessageAt: string; // ISO string
  messages?: ChatMessage[];
}

export interface LiveChatSidebarProps {
  selectedChannel?: string;
  activeConversationId?: string | null;
  onSelectConversation: (conversation: ConversationItem) => void;
  className?: string;
}

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = ["2026", "2025", "2024", "2023"];

export function LiveChatSidebar({
  selectedChannel = "all",
  activeConversationId,
  onSelectConversation,
  className,
}: LiveChatSidebarProps) {
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("8"); // Default August (current month in 2026)
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Data & Loading State
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Fetch Conversations from Backend API
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/chat/conversations", {
        params: {
          channel: selectedChannel === "all" ? undefined : selectedChannel,
          search: searchQuery.trim() || undefined,
          year: selectedYear || undefined,
          month: selectedMonth === "all" ? undefined : selectedMonth,
          sortOrder,
        },
      });

      if (response.data && response.data.data) {
        setConversations(response.data.data);
        setTotalCount(response.data.meta?.total ?? response.data.data.length);
      }
    } catch (err) {
      // Fallback local mock filtering if backend is offline
      const mockData: ConversationItem[] = [
        {
          id: "conv-1",
          contactName: "Ankit Bansal",
          phoneNumber: "+91 77539 83175",
          identifier: "+91 77539 83175",
          channel: "whatsapp",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
          online: true,
          unreadCount: 2,
          tags: ["VIP", "High Intent"],
          budget: "$12,000",
          goal: "Lead Generation",
          lastMessage: "Can you send the pricing sheet for enterprise whatsapp bot?",
          lastMessageAt: "2026-08-28T10:45:00.000Z",
        },
        {
          id: "conv-2",
          contactName: "Com.Bot Customer Care",
          phoneNumber: "+91 90546 18623",
          identifier: "+91 90546 18623",
          channel: "whatsapp",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
          online: false,
          unreadCount: 0,
          tags: ["VIP", "Support"],
          budget: "$8,500",
          goal: "Conversion & Sales",
          lastMessage: "Thank you! The automated flow is working flawlessly now.",
          lastMessageAt: "2026-08-27T16:20:00.000Z",
        },
        {
          id: "conv-3",
          contactName: "Nourin Sodawala",
          phoneNumber: "+91 70486 90369",
          identifier: "+91 70486 90369",
          channel: "whatsapp",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
          online: true,
          unreadCount: 1,
          tags: ["Enterprise", "Warm Lead"],
          budget: "$15,000",
          goal: "Customer Retention",
          lastMessage: "Let us schedule a demo for our support team tomorrow.",
          lastMessageAt: "2026-08-25T14:15:00.000Z",
        },
        {
          id: "conv-4",
          contactName: "Rahul Verma",
          phoneNumber: "+91 99112 34578",
          identifier: "+91 99112 34578",
          channel: "whatsapp",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
          online: false,
          unreadCount: 0,
          tags: ["Marketing Lead"],
          budget: "$5,000",
          goal: "Brand Awareness",
          lastMessage: "Got the broadcast preview. Approved!",
          lastMessageAt: "2026-07-20T09:30:00.000Z",
        },
        {
          id: "conv-5",
          contactName: "Sneha Patel",
          phoneNumber: "+91 98765 43210",
          identifier: "@sneha_ventures",
          channel: "instagram",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
          online: true,
          unreadCount: 0,
          tags: ["VIP", "Outreach"],
          budget: "$20,000",
          goal: "Enterprise Outreach",
          lastMessage: "Replied to your story regarding AI live chat agents.",
          lastMessageAt: "2026-07-15T18:40:00.000Z",
        },
      ];

      let filtered = mockData.filter((item) => {
        const matchesChannel = selectedChannel === "all" || item.channel === selectedChannel;
        const matchesSearch =
          item.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.phoneNumber && item.phoneNumber.includes(searchQuery)) ||
          item.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesMonth = true;
        if (selectedMonth !== "all") {
          const date = new Date(item.lastMessageAt);
          matchesMonth = date.getUTCMonth() + 1 === parseInt(selectedMonth, 10);
        }

        return matchesChannel && matchesSearch && matchesMonth;
      });

      filtered.sort((a, b) => {
        const tA = new Date(a.lastMessageAt).getTime();
        const tB = new Date(b.lastMessageAt).getTime();
        return sortOrder === "asc" ? tA - tB : tB - tA;
      });

      setConversations(filtered);
      setTotalCount(filtered.length);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChannel, searchQuery, selectedYear, selectedMonth, sortOrder]);

  // Refetch when filters or sort change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Toggle Sort Order
  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Format Display Time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      {/* 1. Top Search & Controls Section */}
      <div className="p-3 border-b space-y-2.5 bg-muted/10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search chats by name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-8.5 text-xs bg-background rounded-lg border-slate-200 dark:border-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* 2. Month Selector & Date Sorting Toolbar */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {/* Month Dropdown Selector */}
          <div className="relative flex-1">
            <div className="absolute left-2 top-2 pointer-events-none text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full h-8 pl-7 pr-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[11px] font-medium text-slate-800 dark:text-slate-200 cursor-pointer appearance-none shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-3 w-3 pointer-events-none text-muted-foreground/60" />
          </div>

          {/* Year Selector */}
          <div className="relative w-20 shrink-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[11px] font-medium text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Date Sort Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSort}
            title={sortOrder === "desc" ? "Sorted: Newest first" : "Sorted: Oldest first"}
            className={cn(
              "h-8 px-2.5 text-[11px] font-medium gap-1 shrink-0 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs transition-colors",
              sortOrder === "asc"
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <ArrowUpDown className="h-3 w-3" />
            <span className="hidden sm:inline">
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </span>
          </Button>
        </div>

        {/* Active Filtering Info Line */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-0.5">
          <span>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Filtering conversations...
              </span>
            ) : (
              <span>
                {totalCount} conversation{totalCount !== 1 ? "s" : ""} •{" "}
                {selectedMonth === "all"
                  ? "All 2026"
                  : `${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
              </span>
            )}
          </span>

          {(selectedMonth !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMonth("all");
                setSearchQuery("");
              }}
              className="text-primary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Conversations Scrollable Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground space-y-2.5">
            <div className="h-10 w-10 rounded-full bg-muted/40 mx-auto flex items-center justify-center">
              <Calendar className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <p className="text-xs font-semibold text-foreground">No conversations found</p>
            <p className="text-[11px] max-w-[200px] mx-auto text-muted-foreground leading-relaxed">
              No chats active in{" "}
              <span className="font-semibold text-foreground">
                {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
              </span>
              . Try selecting another month or &quot;All Months&quot;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMonth("all")}
              className="text-xs h-7 px-3 mt-1"
            >
              Show All Months
            </Button>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = activeConversationId === conv.id;

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 text-left transition-colors relative cursor-pointer",
                  isSelected
                    ? "bg-emerald-500/10 border-l-[3px] border-emerald-600 dark:border-emerald-400"
                    : "hover:bg-muted/40"
                )}
              >
                {/* Avatar with Channel Indicator */}
                <div className="relative shrink-0">
                  {conv.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={conv.avatarUrl}
                      alt={conv.contactName}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      {conv.contactName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Channel icon badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-card ring-1 ring-border flex items-center justify-center p-0.5">
                    {conv.channel === "whatsapp" && <WhatsAppIcon className="h-3 w-3 text-emerald-600" />}
                    {conv.channel === "instagram" && <InstagramIcon className="h-3 w-3 text-pink-600" />}
                    {conv.channel === "facebook" && <FacebookIcon className="h-3 w-3 text-blue-600" />}
                    {conv.channel === "rcs" && <RCSIcon className="h-3 w-3 text-violet-600" />}
                  </span>

                  {/* Online status indicator */}
                  {conv.online && (
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>

                {/* Conversation Meta & Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {conv.contactName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-snug">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-1.5">
                    <div className="flex items-center gap-1 overflow-hidden">
                      {conv.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-muted text-muted-foreground border shrink-0"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
