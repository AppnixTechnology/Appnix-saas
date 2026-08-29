"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SlidersHorizontal,
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  Tag,
  Star,
  Plus,
  User,
  MessageSquare,
  Smartphone,
  MessagesSquare,
  SquarePen,
} from "lucide-react";

// ---------- Types & data ----------
type AvatarKind = "image" | "person" | "bot" | "phone";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  date: string;
  avatarKind: AvatarKind;
  avatarUrl?: string;
  online?: boolean;
  emoji?: string;
}

const TAGS = [
  {
    label: "test",
    icon: Tag,
    className: "bg-rose-50 text-rose-600 hover:bg-rose-50",
  },
  {
    label: "demo",
    icon: Tag,
    className: "bg-sky-50 text-sky-600 hover:bg-sky-50",
  },
  {
    label: "Important Lead",
    icon: Star,
    className: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  },
];

const CHATS: Chat[] = [
  {
    id: "1",
    name: "Nourin Sodawala",
    lastMessage: "You: Cta_url",
    date: "06 Mar",
    avatarKind: "image",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "2",
    name: "test",
    lastMessage: "You: Interactive",
    date: "05 Mar",
    avatarKind: "person",
    emoji: "🏳️",
  },
  {
    id: "3",
    name: "Ankit Bansal",
    lastMessage: "You: Location",
    date: "24 Feb",
    avatarKind: "image",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
  },
  {
    id: "4",
    name: "Com.Bot",
    lastMessage: "You: Template",
    date: "21 Feb",
    avatarKind: "bot",
  },
  {
    id: "5",
    name: "919911234578",
    lastMessage: "You: Hello, Hope you...",
    date: "18 Feb",
    avatarKind: "phone",
  },
];

// ---------- Avatar ----------
function ChatAvatar({ chat }: { chat: Chat }) {
  const base =
    "relative h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center";

  if (chat.avatarKind === "image" && chat.avatarUrl) {
    return (
      <div className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chat.avatarUrl}
          alt={chat.name}
          className="h-full w-full object-cover"
        />
        {chat.online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </div>
    );
  }

  const iconStyles: Record<AvatarKind, string> = {
    person: "bg-muted text-muted-foreground",
    bot: "bg-blue-50 text-blue-600",
    phone: "bg-blue-50 text-blue-600",
    image: "bg-muted text-muted-foreground",
  };

  return (
    <div className={cn(base, "rounded-lg", iconStyles[chat.avatarKind])}>
      {chat.avatarKind === "person" && <User className="h-5 w-5" />}
      {chat.avatarKind === "bot" && <MessageSquare className="h-5 w-5" />}
      {chat.avatarKind === "phone" && <Smartphone className="h-5 w-5" />}
    </div>
  );
}

// ---------- Chat list item ----------
function ChatListItem({
  chat,
  active,
  onClick,
}: {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left border-b transition-colors hover:bg-accent/40",
        active && "bg-accent/60",
      )}
    >
      <ChatAvatar chat={chat} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {chat.name}
            {chat.emoji && <span className="ml-1">{chat.emoji}</span>}
          </p>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {chat.date}
          </span>
        </div>
        <p className="truncate text-sm text-primary">{chat.lastMessage}</p>
      </div>
    </button>
  );
}

// ---------- Empty state (right pane) ----------
function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <MessagesSquare className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Open a Chat</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Select any chat to load conversation and start communicating with your
        leads.
      </p>
      <div className="mt-5 flex items-center gap-3 text-[11px] font-semibold tracking-wider text-muted-foreground">
        <span className="h-px w-8 bg-border" />
        SELECT A CONTACT
        <span className="h-px w-8 bg-border" />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden rounded-lg border bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full sm:max-w-[300px] sm:w-[300px] flex-col border-r shrink-0",
          mobileView === "list" ? "flex" : "hidden sm:flex",
        )}
      >
        {/* Breadcrumb Back Navigation */}
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 px-4 pt-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Chat Widget</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3 pt-2">
          {TAGS.map(({ label, icon: Icon, className }) => (
            <Badge
              key={label}
              variant="secondary"
              className={cn("gap-1 rounded-full font-medium", className)}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-6 rounded-full gap-1 px-2 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Tag
          </Button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {CHATS.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              active={activeChatId === chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setMobileView("chat");
              }}
            />
          ))}
        </div>
      </div>

      {/* Conversation pane */}
      {/* Conversation pane */}
      <div
        className={cn(
          "relative flex-1 min-w-0",
          mobileView === "chat"
            ? "flex flex-col"
            : "hidden sm:flex sm:flex-col",
        )}
      >
        {/* Mobile-only back button to return to chat list */}
        <button
          type="button"
          onClick={() => setMobileView("list")}
          className="sm:hidden absolute top-3 left-3 z-10 h-8 w-8 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Back to chats"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <EmptyState />

        {/* Floating new-chat button */}
        <Button
          size="icon"
          className="absolute bottom-6 right-6 h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          aria-label="Start new chat"
        >
          <SquarePen className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
