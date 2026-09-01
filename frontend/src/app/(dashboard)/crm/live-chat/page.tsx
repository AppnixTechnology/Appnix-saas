"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  ArrowLeft,
  Camera,
  Smartphone,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  ChevronRight,
  Phone,
  Video,
  User,
  CheckCheck,
  Clock,
  Sparkles,
  Info,
  Tag,
  Wallet,
  Flag,
  X,
  FileText,
  CheckCircle2,
  Filter,
  Calendar,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

// Lucide 1.0 removed all brand/logo icons (Facebook, WhatsApp, etc.) for
// trademark reasons, so we draw lightweight inline marks here. They use
// `currentColor` so they inherit color exactly like any other lucide icon.
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.32 4.86L2 22l5.36-1.4a9.9 9.9 0 0 0 4.68 1.19h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.18.83.85-3.1-.2-.32a8.14 8.14 0 0 1-1.26-4.36c0-4.51 3.68-8.19 8.2-8.19 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.51-3.68 8.27-8.1 8.27Zm4.49-6.13c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 320 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

// ---------- Types ----------
export type ChannelFilter =
  | "all"
  | "whatsapp"
  | "instagram"
  | "rcs"
  | "facebook";

export interface ChatMessage {
  id: string;
  sender: "customer" | "agent";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  name: string;
  channel: "whatsapp" | "instagram" | "rcs" | "facebook";
  identifier: string; // phone number, IG handle, FB name
  avatarUrl?: string;
  online: boolean;
  unreadCount: number;
  tags: string[];
  budget?: string;
  goal?: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

// ---------- Mock Data ----------
const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Ankit Bansal",
    channel: "whatsapp",
    identifier: "+91 93286 12083",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
    online: true,
    unreadCount: 2,
    tags: ["VIP", "High Intent"],
    budget: "$12,000",
    goal: "Lead Generation",
    lastMessage: "Can you send the pricing sheet for enterprise whatsapp bot?",
    lastMessageTime: "10:45 AM",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Hi Appnix team! We are looking to automate our lead intake.",
        timestamp: "10:40 AM",
      },
      {
        id: "m2",
        sender: "agent",
        text: "Hello Ankit! Happy to help. What channels are you planning to deploy on?",
        timestamp: "10:42 AM",
        status: "read",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Mainly WhatsApp and RCS for high delivery rates.",
        timestamp: "10:44 AM",
      },
      {
        id: "m4",
        sender: "customer",
        text: "Can you send the pricing sheet for enterprise whatsapp bot?",
        timestamp: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Nourin Sodawala",
    channel: "instagram",
    identifier: "@nourin_s",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    online: true,
    unreadCount: 0,
    tags: ["Promotions", "Influencer"],
    budget: "$15,000",
    goal: "Customer Retention",
    lastMessage: "The automation workflow looks great! Thank you.",
    lastMessageTime: "09:30 AM",
    messages: [
      {
        id: "m21",
        sender: "customer",
        text: "Hey! Saw your story about the new AI bot builder.",
        timestamp: "09:15 AM",
      },
      {
        id: "m22",
        sender: "agent",
        text: "Hey Nourin! Yes, it supports dynamic replies and webhook automations.",
        timestamp: "09:20 AM",
        status: "read",
      },
      {
        id: "m23",
        sender: "customer",
        text: "The automation workflow looks great! Thank you.",
        timestamp: "09:30 AM",
      },
    ],
  },
  {
    id: "conv-3",
    name: "Rahul Verma",
    channel: "rcs",
    identifier: "+91 99112 34578",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
    online: false,
    unreadCount: 1,
    tags: ["E-commerce", "RCS Verified"],
    budget: "$5,000",
    goal: "Brand Awareness",
    lastMessage: "Is Rich Card carousel supported in RCS messaging?",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "m31",
        sender: "customer",
        text: "Hello, we want to launch an interactive product catalog over RCS.",
        timestamp: "Yesterday 04:12 PM",
      },
      {
        id: "m32",
        sender: "customer",
        text: "Is Rich Card carousel supported in RCS messaging?",
        timestamp: "Yesterday 04:14 PM",
      },
    ],
  },
  {
    id: "conv-4",
    name: "Sneha Patel",
    channel: "facebook",
    identifier: "Sneha Patel (Messenger)",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
    online: true,
    unreadCount: 0,
    tags: ["Support", "VIP"],
    budget: "$20,000",
    goal: "Enterprise Outreach",
    lastMessage: "We have activated the Messenger webhook integration.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "m41",
        sender: "customer",
        text: "Hi support team, checking status of our Facebook Page connection.",
        timestamp: "Yesterday 02:00 PM",
      },
      {
        id: "m42",
        sender: "agent",
        text: "Everything is synced! We have activated the Messenger webhook integration.",
        timestamp: "Yesterday 02:05 PM",
        status: "read",
      },
    ],
  },
  {
    id: "conv-5",
    name: "Com.Bot Customer",
    channel: "whatsapp",
    identifier: "+91 90546 18623",
    online: false,
    unreadCount: 0,
    tags: ["Bot Flow"],
    budget: "$8,500",
    goal: "Conversion & Sales",
    lastMessage: "Bot flow test completed successfully.",
    lastMessageTime: "21 Feb",
    messages: [
      {
        id: "m51",
        sender: "agent",
        text: "Starting automated bot diagnostics...",
        timestamp: "21 Feb 10:30 AM",
        status: "read",
      },
      {
        id: "m52",
        sender: "customer",
        text: "Bot flow test completed successfully.",
        timestamp: "21 Feb 10:34 AM",
      },
    ],
  },
  {
    id: "conv-6",
    name: "David Miller",
    channel: "whatsapp",
    identifier: "+1 415 555 2671",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    online: true,
    unreadCount: 3,
    tags: ["Global Lead"],
    budget: "$30,000",
    goal: "Omnichannel Support",
    lastMessage: "What are the per-message rates for North America?",
    lastMessageTime: "21 Feb",
    messages: [
      {
        id: "m61",
        sender: "customer",
        text: "Hey! We are expanding our customer support across USA and Canada.",
        timestamp: "21 Feb 08:10 AM",
      },
      {
        id: "m62",
        sender: "customer",
        text: "What are the per-message rates for North America?",
        timestamp: "21 Feb 08:12 AM",
      },
    ],
  },
  {
    id: "conv-7",
    name: "Elena Rostova",
    channel: "instagram",
    identifier: "@elena_design",
    online: false,
    unreadCount: 0,
    tags: ["Design Partner"],
    budget: "$7,000",
    goal: "Brand Collaboration",
    lastMessage: "Sent the story mockup assets.",
    lastMessageTime: "20 Feb",
    messages: [
      {
        id: "m71",
        sender: "customer",
        text: "Sent the story mockup assets.",
        timestamp: "20 Feb 01:20 PM",
      },
    ],
  },
  {
    id: "conv-8",
    name: "Marcus Aurelius Tech",
    channel: "rcs",
    identifier: "+44 20 7946 0912",
    online: true,
    unreadCount: 0,
    tags: ["Fintech", "RCS Verified"],
    budget: "$40,000",
    goal: "Transactional OTPs",
    lastMessage: "Our telecom carrier approved the RCS agent profile.",
    lastMessageTime: "19 Feb",
    messages: [
      {
        id: "m81",
        sender: "customer",
        text: "Our telecom carrier approved the RCS agent profile.",
        timestamp: "19 Feb 11:00 AM",
      },
    ],
  },
  {
    id: "conv-9",
    name: "Urban Style Boutique",
    channel: "facebook",
    identifier: "Urban Style (Page Inbox)",
    online: true,
    unreadCount: 0,
    tags: ["Retail", "Catalog"],
    budget: "$10,000",
    goal: "Social Commerce",
    lastMessage: "Can we sync our Shopify product catalog directly?",
    lastMessageTime: "18 Feb",
    messages: [
      {
        id: "m91",
        sender: "customer",
        text: "Can we sync our Shopify product catalog directly?",
        timestamp: "18 Feb 04:30 PM",
      },
    ],
  },
  {
    id: "conv-10",
    name: "Vikram Malhotra",
    channel: "whatsapp",
    identifier: "+91 98765 43210",
    online: true,
    unreadCount: 0,
    tags: ["Enterprise"],
    budget: "$25,000",
    goal: "High Volume Campaigns",
    lastMessage:
      "Thanks for configuring the WhatsApp green badge verification.",
    lastMessageTime: "17 Feb",
    messages: [
      {
        id: "m101",
        sender: "customer",
        text: "Thanks for configuring the WhatsApp green badge verification.",
        timestamp: "17 Feb 03:15 PM",
      },
    ],
  },
];

// Channel configuration with branding and icons
const channelTabs: {
  id: ChannelFilter;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  activeClass: string;
}[] = [
  {
    id: "all",
    label: "All",
    icon: MessageSquare,
    colorClass: "text-foreground",
    activeClass: "bg-primary text-primary-foreground font-semibold shadow-xs",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    activeClass: "bg-emerald-600 text-white font-semibold shadow-xs",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Camera,
    colorClass: "text-pink-600 dark:text-pink-400",
    activeClass:
      "bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-semibold shadow-xs",
  },
  {
    id: "rcs",
    label: "RCS",
    icon: Smartphone,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    activeClass: "bg-indigo-600 text-white font-semibold shadow-xs",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    colorClass: "text-blue-600 dark:text-blue-400",
    activeClass: "bg-blue-600 text-white font-semibold shadow-xs",
  },
];

const channelMeta: Record<
  "whatsapp" | "instagram" | "rcs" | "facebook",
  {
    name: string;
    icon: React.ElementType;
    badgeStyle: string;
    iconStyle: string;
    channelReplyLabel: string;
  }
> = {
  whatsapp: {
    name: "WhatsApp",
    icon: WhatsAppIcon,
    badgeStyle:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
    iconStyle:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    channelReplyLabel: "Replying via WhatsApp Official API",
  },
  instagram: {
    name: "Instagram",
    icon: Camera,
    badgeStyle:
      "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300",
    iconStyle:
      "bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white",
    channelReplyLabel: "Replying via Instagram Direct Messenger",
  },
  rcs: {
    name: "RCS",
    icon: Smartphone,
    badgeStyle:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
    iconStyle:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
    channelReplyLabel: "Replying via RCS Business Messaging",
  },
  facebook: {
    name: "Facebook",
    icon: FacebookIcon,
    badgeStyle:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    iconStyle: "bg-blue-600 text-white",
    channelReplyLabel: "Replying via Facebook Messenger Platform",
  },
};

const CUSTOM_NAMES_STORAGE_KEY = "livechat_custom_contact_names";

export default function LiveChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedChannel, setSelectedChannel] = useState<ChannelFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [showRightDetails, setShowRightDetails] = useState<boolean>(true);

  // Mobile-only: whether we're showing the conversation list or the open
  // chat. On sm+ screens both panes are shown side by side regardless.
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  // Custom contact names the agent has saved. Stored in localStorage only —
  // this is private to this browser/agent, never sent anywhere or shown to
  // the customer. Until a name is saved, the raw number/handle is shown.
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_NAMES_STORAGE_KEY);
      if (stored) setCustomNames(JSON.parse(stored));
    } catch {
      // ignore malformed/unavailable localStorage
    }
  }, []);

  const persistCustomNames = (next: Record<string, string>) => {
    setCustomNames(next);
    try {
      localStorage.setItem(CUSTOM_NAMES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write failures (e.g. private browsing quota)
    }
  };

  const handleSaveName = (id: string, value: string) => {
    const trimmed = value.trim();
    const next = { ...customNames };
    if (trimmed) {
      next[id] = trimmed;
    } else {
      delete next[id];
    }
    persistCustomNames(next);
  };

  // What to actually display for a contact: their saved name if the agent
  // has set one, otherwise just their raw number/handle.
  const getDisplayName = (conv: Conversation) =>
    customNames[conv.id]?.trim() || conv.identifier;

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Filter conversations strictly based on the top Channel filter, search query, month, and date sorting
  const filteredConversations = conversations.filter((conv) => {
    const matchesChannel =
      selectedChannel === "all" || conv.channel === selectedChannel;
    const matchesSearch =
      getDisplayName(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesChannel && matchesSearch;
  });

  // Currently active conversation object
  const activeConversation =
    conversations.find((c) => c.id === activeConvId) ||
    filteredConversations[0] ||
    null;

  // Reset the inline name editor whenever the open conversation changes
  useEffect(() => {
    setIsEditingName(false);
    setNameDraft(
      activeConversation ? customNames[activeConversation.id] || "" : "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.id]);

  // Channel counts
  const getChannelCount = (channel: ChannelFilter) => {
    if (channel === "all") return conversations.length;
    return conversations.filter((c) => c.channel === channel).length;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "agent",
      text: inputMessage.trim(),
      timestamp: "Just now",
      status: "delivered",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: `You: ${inputMessage.trim()}`,
            lastMessageTime: "Just now",
            unreadCount: 0,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      }),
    );

    setInputMessage("");
  };

  const handleQuickReply = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className="space-y-3 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header & Channel Filter Bar */}
      <div className="shrink-0 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <Link
              href="/crm"
              className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>CRM</span>
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span className="text-primary font-medium">Live Chat</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden sm:inline">
                Realtime Multi-Channel Online
              </span>
              <span className="sm:hidden">Online</span>
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Prominent Channel Filter at the top:                  */}
        {/* All | WhatsApp | Instagram | RCS | Facebook          */}
        {/* ---------------------------------------------------- */}
        <div className="flex items-center justify-between gap-3 border rounded-xl bg-card p-2 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 shrink-0 hidden sm:inline">
              Channels:
            </span>
            {channelTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedChannel === tab.id;
              const count = getChannelCount(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedChannel(tab.id);
                    // If active conv is not in newly selected channel, switch to first item in filtered list
                    const matching =
                      tab.id === "all"
                        ? conversations
                        : conversations.filter((c) => c.channel === tab.id);
                    if (
                      matching.length > 0 &&
                      (!activeConversation ||
                        (tab.id !== "all" &&
                          activeConversation.channel !== tab.id))
                    ) {
                      setActiveConvId(matching[0].id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 whitespace-nowrap",
                    isSelected
                      ? tab.activeClass
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px]",
                      isSelected
                        ? "bg-black/20 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1 shrink-0 text-xs text-muted-foreground pr-2">
            <span>Filtering:</span>
            <span className="font-semibold text-foreground capitalize">
              {selectedChannel}
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Pane Live Chat Interface */}
      <div className="flex-1 flex overflow-hidden rounded-xl border bg-card shadow-sm min-h-0">
        {/* ==================================================== */}
        {/* LEFT PANE: Conversations List                        */}
        {/* On mobile this pane and the chat pane are mutually    */}
        {/* exclusive — tapping a chat switches to it, and a back */}
        {/* button in the chat header returns here.               */}
        {/* ==================================================== */}
        <div
          className={cn(
            "w-full sm:w-80 md:w-[22rem] flex-col border-r shrink-0 bg-card",
            mobileView === "list" ? "flex" : "hidden sm:flex",
          )}
        >
          {/* Search bar inside conversation list */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search chats by name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-muted/30"
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

            {/* Month & Year Dropdown Selector + Sort Order Toggle */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {/* Month Dropdown */}
              <div className="relative flex-1">
                <div className="absolute left-2 top-2 pointer-events-none text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-8 pl-7 pr-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[11px] font-medium text-slate-800 dark:text-slate-200 cursor-pointer appearance-none shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-3 w-3 pointer-events-none text-muted-foreground/60" />
              </div>

              {/* Year Selector */}
              <div className="relative w-18 shrink-0">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[11px] font-medium text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Sort Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                title={
                  sortOrder === "desc"
                    ? "Sorted: Newest first"
                    : "Sorted: Oldest first"
                }
                className={cn(
                  "h-8 px-2 text-[11px] font-medium gap-1 shrink-0 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs",
                  sortOrder === "asc"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "text-slate-700 dark:text-slate-300",
                )}
              >
                <ArrowUpDown className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {sortOrder === "desc" ? "Newest" : "Oldest"}
                </span>
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span>
                Showing {filteredConversations.length} conversation
                {filteredConversations.length !== 1 ? "s" : ""}
              </span>
              {(selectedChannel !== "all" ||
                selectedMonth !== "all" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedChannel("all");
                    setSelectedMonth("all");
                    setSearchQuery("");
                  }}
                  className="text-primary hover:underline font-semibold text-[10px]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Conversation items list */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground space-y-2">
                <Filter className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm font-medium">No conversations found</p>
                <p className="text-xs">
                  No {selectedChannel !== "all" ? selectedChannel : ""} chats
                  match your current filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedChannel("all");
                    setSearchQuery("");
                  }}
                  className="text-xs mt-2"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const meta = channelMeta[conv.channel];
                const ChannelIcon = meta.icon;
                const displayName = getDisplayName(conv);
                const hasCustomName = Boolean(customNames[conv.id]?.trim());

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setMobileView("chat");
                      setConversations((prev) =>
                        prev.map((c) =>
                          c.id === conv.id ? { ...c, unreadCount: 0 } : c,
                        ),
                      );
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 text-left transition-colors relative",
                      isSelected
                        ? "bg-accent/70 border-l-[3px] border-primary"
                        : "hover:bg-muted/40",
                    )}
                  >
                    {/* Avatar with Channel Overlay Badge */}
                    <div className="relative shrink-0">
                      {conv.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={conv.avatarUrl}
                          alt={displayName}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Channel Icon Badge on Avatar */}
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 h-[18px] w-[18px] rounded-full flex items-center justify-center ring-2 ring-card shadow-xs",
                          meta.iconStyle,
                        )}
                        title={meta.name}
                      >
                        <ChannelIcon className="h-2.5 w-2.5" />
                      </div>

                      {/* Online Status Dot */}
                      {conv.online && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                      )}
                    </div>

                    {/* Chat Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {displayName}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {/* Only show the raw number/handle as a sub-line once a
                          custom name has been saved for this contact — before
                          that, the number is already the main line above. */}
                      {hasCustomName && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {conv.identifier}
                        </p>
                      )}

                      <p
                        className={cn(
                          "text-xs truncate mt-1",
                          conv.unreadCount > 0
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {conv.lastMessage}
                      </p>

                      {/* Tags & Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 font-medium h-[18px] gap-1",
                            meta.badgeStyle,
                          )}
                        >
                          <ChannelIcon className="h-2.5 w-2.5" />
                          {meta.name}
                        </Badge>

                        {conv.tags.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}

                        {conv.unreadCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
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

        {/* ==================================================== */}
        {/* MIDDLE PANE: Active Chat & Messaging Console         */}
        {/* ==================================================== */}
        {activeConversation ? (
          <div
            className={cn(
              "flex-1 flex-col min-w-0 bg-background",
              mobileView === "chat" ? "flex" : "hidden sm:flex",
            )}
          >
            {/* Conversation Header */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 border-b bg-card shrink-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile-only back button to return to the conversation list */}
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="sm:hidden shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Back to chats"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="relative shrink-0">
                  {activeConversation.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeConversation.avatarUrl}
                      alt={getDisplayName(activeConversation)}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {getDisplayName(activeConversation)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  {activeConversation.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-sm text-foreground truncate">
                      {getDisplayName(activeConversation)}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0 h-[18px] gap-1 shrink-0",
                        channelMeta[activeConversation.channel].badgeStyle,
                      )}
                    >
                      {activeConversation.channel.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span>{activeConversation.identifier}</span>
                    <span>•</span>
                    <span
                      className={cn(
                        activeConversation.online
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {activeConversation.online ? "Online Now" : "Offline"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowRightDetails(!showRightDetails)}
                  className={cn(
                    "h-8 w-8",
                    showRightDetails
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground",
                  )}
                  title="Toggle Contact CRM Details"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                  title="More actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-muted/10">
              <div className="flex items-center justify-center my-2">
                <span className="text-[11px] bg-muted/60 text-muted-foreground px-3 py-1 rounded-full font-medium text-center">
                  Chat initiated via{" "}
                  {channelMeta[activeConversation.channel].name}
                </span>
              </div>

              {activeConversation.messages.map((msg) => {
                const isAgent = msg.sender === "agent";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-[70%]",
                      isAgent ? "ml-auto items-end" : "mr-auto items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-xs shadow-xs",
                        isAgent
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-card border text-foreground rounded-bl-xs",
                      )}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isAgent && (
                        <CheckCheck className="h-3 w-3 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Replies Tray */}
            <div className="px-3 py-1.5 bg-card border-t flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-muted-foreground text-[10px] shrink-0 font-medium">
                Quick:
              </span>
              {[
                "Hi! How can I help you today?",
                "Here is our pricing sheet: https://appnix.io/plans",
                "I have forwarded your request to our team.",
                "Thank you for contacting Appnix!",
              ].map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(qr)}
                  className="px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground shrink-0 transition-colors truncate max-w-56"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Chat Input Box */}
            <div className="p-2.5 sm:p-3 border-t bg-card shrink-0 space-y-2">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0 hidden sm:inline-flex"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="relative flex-1 min-w-0">
                  <Input
                    placeholder={`Message on ${
                      channelMeta[activeConversation.channel].name
                    }...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="h-9 text-xs bg-muted/20 pr-9"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    title="Insert emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="h-9 px-3 sm:px-3.5 bg-primary text-primary-foreground shrink-0 gap-1.5 text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>

              {/* Channel Sending Badge */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 gap-2">
                <span className="flex items-center gap-1 text-[10px] truncate">
                  <Sparkles className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">
                    {channelMeta[activeConversation.channel].channelReplyLabel}
                  </span>
                </span>
                <span className="text-[10px] hidden sm:inline shrink-0">
                  Shift + Enter for new line
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground",
              mobileView === "chat" ? "flex" : "hidden sm:flex",
            )}
          >
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-semibold text-foreground text-base">
              No conversation selected
            </h3>
            <p className="text-xs max-w-sm mt-1">
              Select a conversation from the left to start live multi-channel
              chat.
            </p>
          </div>
        )}

        {/* ==================================================== */}
        {/* RIGHT PANE: Customer CRM Profile & Meta Data         */}
        {/* ==================================================== */}

        {activeConversation && showRightDetails && (
          <>
            {/* Backdrop — only needed below lg, since lg+ shows it as a static side panel */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setShowRightDetails(false)}
            />
            <div
              className={cn(
                "flex flex-col border-l bg-card shrink-0 p-4 space-y-4 overflow-y-auto",
                "fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm shadow-2xl",
                "lg:static lg:z-auto lg:w-72 lg:max-w-none lg:shadow-none",
              )}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  CRM Profile
                </h3>
                <button
                  onClick={() => setShowRightDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Avatar & Info */}
              <div className="flex flex-col items-center text-center space-y-2">
                {activeConversation.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeConversation.avatarUrl}
                    alt={getDisplayName(activeConversation)}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {getDisplayName(activeConversation).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="w-full">
                  {isEditingName ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveName(activeConversation.id, nameDraft);
                        setIsEditingName(false);
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <Input
                        autoFocus
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        placeholder="Save a name for this contact"
                        className="h-8 text-xs text-center"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-8 px-2.5 text-[11px] shrink-0"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[11px] shrink-0"
                        onClick={() => setIsEditingName(false)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <>
                      <h4 className="font-bold text-sm text-foreground">
                        {getDisplayName(activeConversation)}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.identifier}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setNameDraft(
                            customNames[activeConversation.id] || "",
                          );
                          setIsEditingName(true);
                        }}
                        className="text-[11px] text-primary hover:underline mt-1"
                      >
                        {customNames[activeConversation.id]
                          ? "Edit saved name"
                          : "+ Save contact name"}
                      </button>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {customNames[activeConversation.id]
                          ? "Saved name — only visible to you"
                          : "Only visible to you once saved"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Channel Info */}
              <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Active Channel
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5",
                      channelMeta[activeConversation.channel].badgeStyle,
                    )}
                  >
                    {channelMeta[activeConversation.channel].name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Verified Inbound
                  </span>
                </div>
              </div>

              {/* CRM Attributes */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  CRM Attributes
                </p>

                <div className="flex items-center justify-between text-xs py-1 border-b gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Wallet className="h-3.5 w-3.5" />
                    Marketing Budget:
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {activeConversation.budget || "$10,000"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Flag className="h-3.5 w-3.5" />
                    Marketing Goal:
                  </span>
                  <span className="font-medium text-foreground text-right truncate max-w-32">
                    {activeConversation.goal || "Lead Generation"}
                  </span>
                </div>

                <div className="py-1">
                  <span className="text-xs text-muted-foreground block mb-1.5">
                    Tags & Segments:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeConversation.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Agent Internal Note
                </p>
                <textarea
                  rows={3}
                  placeholder="Add private internal note for this contact..."
                  className="w-full rounded-md border bg-background p-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="Customer interested in high-delivery WhatsApp & RCS templates. Follow up with case study."
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7 gap-1"
                  onClick={() => alert("Note saved to CRM Contact!")}
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Save Note
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
