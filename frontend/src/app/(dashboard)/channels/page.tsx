"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Plus,
  BarChart3,
  Wallet,
  Zap,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronRight,
  MoreVertical,
  Link2,
  FileText,
  CreditCard,
  Bot,
  MessageSquare,
  Camera,
  Image as ImageIcon,
  RefreshCw,
  ScanLine,
  MessageCircle,
  Users,
} from "lucide-react";

// ---------- Types ----------
type ChannelType = "whatsapp" | "instagram" | "facebook";

interface ChannelField {
  label: string;
  value: string;
  icon: React.ElementType;
}

interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  subtitle: string;
  status: "connected" | "disconnected";
  topRight?: { label: string; sub?: string };
  fields: ChannelField[];
  actions: React.ElementType[];
}

// ---------- Mock data ----------
const channels: Channel[] = [
  {
    id: "1",
    type: "whatsapp",
    name: "01 Automations",
    subtitle: "918062765557",
    status: "connected",
    topRight: { label: "39.1918 INR", sub: "Click to fetch" },
    fields: [
      { label: "Number Status", value: "NA", icon: MessageCircle },
      { label: "Quality Score", value: "NA", icon: ScanLine },
      { label: "Message Limit", value: "NA", icon: MessageSquare },
      { label: "2FA Enabled", value: "No", icon: Link2 },
    ],
    actions: [Link2, FileText, CreditCard, BarChart3, Bot, Zap, MessageSquare],
  },
  {
    id: "2",
    type: "instagram",
    name: "prayerofhopes",
    subtitle: "@prayerofhopes",
    status: "connected",
    fields: [
      { label: "Account Status", value: "Connected", icon: ScanLine },
      { label: "Media Post Count", value: "NA", icon: ImageIcon },
      { label: "Follower Count", value: "NA", icon: Users },
    ],
    actions: [Link2, BarChart3, Bot, Camera],
  },
  {
    id: "3",
    type: "facebook",
    name: "Sam",
    subtitle: "896015703596388",
    status: "connected",
    fields: [
      { label: "Page Status", value: "Connected", icon: ScanLine },
      { label: "Published", value: "NA", icon: RefreshCw },
      { label: "Follower Count", value: "NA", icon: Users },
      { label: "WhatsApp Number", value: "NA", icon: MessageSquare },
    ],
    actions: [Link2, FileText, BarChart3, Bot],
  },
];

const channelIconStyles: Record<ChannelType, string> = {
  whatsapp: "bg-green-100 text-green-600",
  instagram:
    "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white",
  facebook: "bg-blue-600 text-white",
};

const channelIcons: Record<ChannelType, React.ElementType> = {
  whatsapp: MessageSquare,
  instagram: Camera,
  facebook: ScanLine,
};

export default function ChannelsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-sm text-muted-foreground gap-1 overflow-x-auto whitespace-nowrap">
          <span>All Products</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Channel</span>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Channel
          </h1>

          {/* Action buttons: horizontal scroll on mobile, wrap on larger screens */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
            <Button className="bg-green-600 hover:bg-green-700 text-white shrink-0">
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add New Channel</span>
            </Button>
            <Button variant="outline" className="shrink-0">
              <BarChart3 className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Conversation Statistics</span>
            </Button>
            <Button variant="outline" className="shrink-0">
              <Wallet className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Total Balance</span>
            </Button>
            <Button variant="outline" className="shrink-0">
              <Zap className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Bulk Action</span>
            </Button>
          </div>
        </div>
      </div>

      {/* View toggle + Sort */}
      <div className="flex items-center justify-between border rounded-lg bg-background px-3 py-2">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={view === "grid" ? "default" : "outline"}
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "list" ? "default" : "outline"}
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ArrowUpDown className="h-4 w-4 mr-1" />
          <span className="hidden xs:inline">Sort</span>
        </Button>
      </div>

      {/* Channel Cards */}
      <div
        className={cn(
          "grid gap-4",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}
      >
        {channels.map((channel) => {
          const Icon = channelIcons[channel.type];
          return (
            <div key={channel.id} className="rounded-xl border bg-background overflow-hidden">
              {/* Card Header */}
              <div className="flex items-start sm:items-center justify-between gap-2 p-4 border-b">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      channelIconStyles[channel.type]
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          channel.status === "connected" ? "bg-green-500" : "bg-red-500"
                        )}
                      />
                      <p className="font-semibold text-foreground truncate">{channel.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{channel.subtitle}</p>
                  </div>
                </div>

                {channel.topRight ? (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium flex items-center gap-1 justify-end whitespace-nowrap">
                      <Wallet className="h-3.5 w-3.5" />
                      {channel.topRight.label}
                    </p>
                    {channel.topRight.sub && (
                      <button className="text-xs text-primary flex items-center gap-1 justify-end mt-0.5 whitespace-nowrap">
                        <RefreshCw className="h-3 w-3" />
                        {channel.topRight.sub}
                      </button>
                    )}
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Disconnect</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Stats Fields */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 p-4">
                {channel.fields.map((field) => (
                  <div key={field.label} className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">
                      {field.label}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm font-medium mt-1 truncate">
                      <field.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{field.value}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Icons: scrolls horizontally instead of squeezing */}
              <div className="flex items-center gap-1 px-2 py-2 border-t bg-muted/30 overflow-x-auto">
                {channel.actions.map((ActionIcon, idx) => (
                  <Button
                    key={idx}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 text-muted-foreground"
                  >
                    <ActionIcon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}