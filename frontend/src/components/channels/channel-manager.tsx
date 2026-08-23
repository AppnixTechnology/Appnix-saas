"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Plus,
  ArrowLeft,
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
  Smartphone,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
} from "lucide-react";

// ---------- Types ----------
export type ChannelType = "whatsapp" | "instagram" | "facebook" | "rcs";

export interface ChannelField {
  label: string;
  value: string;
  icon: React.ElementType;
}

export interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  subtitle: string;
  status: "connected" | "disconnected";
  topRight?: { label: string; sub?: string };
  fields: ChannelField[];
  actions: React.ElementType[];
}

// ---------- Mock Initial Data ----------
export const defaultChannels: Channel[] = [
  {
    id: "1",
    type: "whatsapp",
    name: "01 Automations",
    subtitle: "+91 80627 65557",
    status: "connected",
    topRight: { label: "39.1918 INR", sub: "Click to fetch" },
    fields: [
      { label: "Number Status", value: "Verified & Live", icon: MessageCircle },
      { label: "Quality Score", value: "High (Green)", icon: ScanLine },
      { label: "Message Limit", value: "100k / 24h", icon: MessageSquare },
      { label: "2FA Enabled", value: "Active", icon: Link2 },
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
      { label: "Media Post Count", value: "148 Posts", icon: ImageIcon },
      { label: "Follower Count", value: "24.5k Followers", icon: Users },
      { label: "Story Auto-Reply", value: "Enabled", icon: Bot },
    ],
    actions: [Link2, BarChart3, Bot, Camera],
  },
  {
    id: "3",
    type: "facebook",
    name: "Appnix Official Page",
    subtitle: "Page ID: 896015703596388",
    status: "connected",
    fields: [
      { label: "Page Status", value: "Connected & Published", icon: ScanLine },
      { label: "Follower Count", value: "18.2k Followers", icon: Users },
      { label: "Messenger Bot", value: "Active (99.4%)", icon: Bot },
      { label: "WhatsApp Link", value: "+91 80627 65557", icon: MessageSquare },
    ],
    actions: [Link2, FileText, BarChart3, Bot],
  },
  {
    id: "4",
    type: "rcs",
    name: "Appnix RCS Verified Agent",
    subtitle: "Agent: appnix-rcs-prod",
    status: "connected",
    topRight: { label: "Enterprise Tier", sub: "Carrier Verified" },
    fields: [
      { label: "Carrier Status", value: "Approved (Jio/Airtel/VI)", icon: CheckCircle2 },
      { label: "Verification", value: "Google Verified", icon: ScanLine },
      { label: "Rich Cards", value: "Supported", icon: Smartphone },
      { label: "Throughput", value: "250 msg/sec", icon: Zap },
    ],
    actions: [Link2, FileText, BarChart3, Bot, Zap, Smartphone],
  },
];

export const channelIconStyles: Record<ChannelType, string> = {
  whatsapp: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  instagram:
    "bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white",
  facebook: "bg-blue-600 text-white",
  rcs: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
};

export const channelIcons: Record<ChannelType, React.ElementType> = {
  whatsapp: MessageSquare,
  instagram: Camera,
  facebook: ScanLine,
  rcs: Smartphone,
};

export const channelTitles: Record<ChannelType | "all", { title: string; subtitle: string }> = {
  all: {
    title: "All Channels",
    subtitle: "Manage your integrated communication channels, numbers, and bots.",
  },
  whatsapp: {
    title: "WhatsApp Channels",
    subtitle: "Connect and monitor your official WhatsApp Business numbers and API limits.",
  },
  instagram: {
    title: "Instagram Channels",
    subtitle: "Manage connected Instagram professional accounts and direct message bots.",
  },
  facebook: {
    title: "Facebook Channels",
    subtitle: "Manage Facebook Pages and Messenger automation workflows.",
  },
  rcs: {
    title: "RCS Business Channels",
    subtitle: "Configure carrier-verified Google RCS agents and rich card templates.",
  },
};

interface ChannelManagerProps {
  filterType?: ChannelType | "all";
}

export function ChannelManager({ filterType = "all" }: ChannelManagerProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChannelType, setNewChannelType] = useState<ChannelType>(
    filterType === "all" ? "whatsapp" : filterType
  );
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelSubtitle, setNewChannelSubtitle] = useState("");

  const pageInfo = channelTitles[filterType];

  const displayedChannels = channels.filter((channel) => {
    const matchesType = filterType === "all" || channel.type === filterType;
    const matchesSearch =
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDisconnect = (id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "connected" ? "disconnected" : "connected",
            }
          : c
      )
    );
  };

  const handleRemove = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const channelToAdd: Channel = {
      id: String(Date.now()),
      type: newChannelType,
      name: newChannelName.trim(),
      subtitle: newChannelSubtitle.trim() || `${newChannelType} connection`,
      status: "connected",
      fields: [
        { label: "Connection Status", value: "Connected & Active", icon: CheckCircle2 },
        { label: "Webhook Sync", value: "Live", icon: ScanLine },
        { label: "Channel Type", value: newChannelType.toUpperCase(), icon: channelIcons[newChannelType] },
      ],
      actions: [Link2, FileText, BarChart3, Bot],
    };

    setChannels([channelToAdd, ...channels]);
    setNewChannelName("");
    setNewChannelSubtitle("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          {filterType !== "all" && (
            <>
              <Link
                href="/channels"
                className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Channels</span>
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            </>
          )}
          <span>Channels</span>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-medium">{pageInfo.title}</span>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
              {pageInfo.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pageInfo.subtitle}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
            <Button
              onClick={() => {
                setNewChannelType(filterType === "all" ? "whatsapp" : filterType);
                setIsAddModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
            >
              <Plus className="h-4 w-4 sm:mr-1" />
              <span>Add New Channel</span>
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

      {/* View toggle + Search + Sort toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl bg-card p-3 gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/40">
            <Button
              size="icon"
              variant={view === "grid" ? "default" : "ghost"}
              className="h-7 w-7 rounded-md"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant={view === "list" ? "default" : "ghost"}
              className="h-7 w-7 rounded-md"
              onClick={() => setView("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative w-64 max-w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={`Search ${filterType === "all" ? "all" : filterType} channels...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-8 text-xs bg-background"
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
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground">
          <span>
            Showing {displayedChannels.length} channel
            {displayedChannels.length !== 1 ? "s" : ""}
          </span>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {/* Channel Cards Grid / List */}
      {displayedChannels.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground space-y-3">
          <ScanLine className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <h3 className="font-semibold text-foreground text-base">No Channels Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchQuery
              ? "No channels matched your search query. Try clearing your search."
              : `You have not connected any ${filterType === "all" ? "" : filterType} channels yet.`}
          </p>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Connect Channel
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {displayedChannels.map((channel) => {
            const Icon = channelIcons[channel.type];
            return (
              <div
                key={channel.id}
                className="rounded-xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex items-start sm:items-center justify-between gap-2 p-4 border-b bg-muted/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs",
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
                            channel.status === "connected"
                              ? "bg-emerald-500 shadow-xs"
                              : "bg-rose-500"
                          )}
                        />
                        <p className="font-semibold text-sm text-foreground truncate">
                          {channel.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {channel.subtitle}
                      </p>
                    </div>
                  </div>

                  {channel.topRight ? (
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold flex items-center gap-1 justify-end whitespace-nowrap text-foreground">
                        <Wallet className="h-3.5 w-3.5 text-primary" />
                        {channel.topRight.label}
                      </p>
                      {channel.topRight.sub && (
                        <button
                          onClick={() => alert("Refreshed channel balance!")}
                          className="text-[11px] text-primary flex items-center gap-1 justify-end mt-0.5 whitespace-nowrap hover:underline"
                        >
                          <RefreshCw className="h-2.5 w-2.5" />
                          {channel.topRight.sub}
                        </button>
                      )}
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 text-muted-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Configuring ${channel.name}`)}>
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDisconnect(channel.id)}>
                          {channel.status === "connected" ? "Disconnect" : "Reconnect"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(channel.id)}
                          className="text-destructive"
                        >
                          Remove Channel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Stats Fields */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 p-4 bg-card">
                  {channel.fields.map((field) => (
                    <div key={field.label} className="min-w-0">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                        {field.label}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs font-medium mt-1 truncate text-foreground">
                        <field.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{field.value}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Icons toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-t bg-muted/20 overflow-x-auto">
                  {channel.actions.map((ActionIcon, idx) => (
                    <Button
                      key={idx}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <ActionIcon className="h-3.5 w-3.5" />
                    </Button>
                  ))}

                  <div className="ml-auto">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider",
                        channel.status === "connected"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                      )}
                    >
                      {channel.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Channel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-foreground">
                Connect New Channel
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddChannel} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Select Channel Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["whatsapp", "instagram", "facebook", "rcs"] as ChannelType[]).map(
                    (type) => {
                      const Icon = channelIcons[type];
                      const isSelected = newChannelType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewChannelType(type)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div
                            className={cn(
                              "h-7 w-7 rounded-md flex items-center justify-center mb-1",
                              channelIconStyles[type]
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[11px] font-semibold capitalize text-foreground">
                            {type}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Channel / Account Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Sales Support Number / @brand_instagram"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Identifier (Phone / Handle / ID)
                </label>
                <Input
                  placeholder="e.g. +91 98765 43210 or @myhandle"
                  value={newChannelSubtitle}
                  onChange={(e) => setNewChannelSubtitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Instant Webhook & Cloud API Sync
                </p>
                <p>
                  Connecting this channel will enable live chats, bulk campaigns, and automated bot workflows.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Connect Channel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
