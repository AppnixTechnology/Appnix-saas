"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Megaphone,
  Plus,
  Send,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  MessageSquare,
  Camera,
  Smartphone,
  ScanLine,
  X,
  Play,
  Pause,
  Copy,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";

// ---------- Types ----------
type ChannelType = "whatsapp" | "instagram" | "rcs" | "facebook";
type CampaignStatus = "active" | "scheduled" | "completed" | "draft" | "paused";

interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  audience: string;
  audienceCount: number;
  sentCount: number;
  status: CampaignStatus;
  scheduledAt: string;
  createdAt: string;
  deliveryRate: string;
  openRate: string;
}

// ---------- Mock Data ----------
const initialCampaigns: Campaign[] = [
  {
    id: "CMP-9041",
    name: "Spring Sale 2026 Promo Blast",
    channel: "whatsapp",
    audience: "VIP Customers Segment",
    audienceCount: 1240,
    sentCount: 1240,
    status: "completed",
    scheduledAt: "24 Feb 2026, 10:00 AM",
    createdAt: "24 Feb 2026",
    deliveryRate: "99.2%",
    openRate: "68.4%",
  },
  {
    id: "CMP-9042",
    name: "Product Launch V2 Webinar Invite",
    channel: "instagram",
    audience: "All Active Leads",
    audienceCount: 4500,
    sentCount: 3120,
    status: "active",
    scheduledAt: "25 Feb 2026, 02:30 PM",
    createdAt: "25 Feb 2026",
    deliveryRate: "96.5%",
    openRate: "42.1%",
  },
  {
    id: "CMP-9043",
    name: "Abandoned Cart 15% Off Reminder",
    channel: "rcs",
    audience: "Cart Drop-offs (Last 7 Days)",
    audienceCount: 820,
    sentCount: 820,
    status: "completed",
    scheduledAt: "22 Feb 2026, 06:15 PM",
    createdAt: "22 Feb 2026",
    deliveryRate: "98.8%",
    openRate: "54.0%",
  },
  {
    id: "CMP-9044",
    name: "Weekend Flash Sale Announcement",
    channel: "facebook",
    audience: "Social Engaged Users",
    audienceCount: 6200,
    sentCount: 0,
    status: "scheduled",
    scheduledAt: "28 Feb 2026, 09:00 AM",
    createdAt: "25 Feb 2026",
    deliveryRate: "0.0%",
    openRate: "0.0%",
  },
  {
    id: "CMP-9045",
    name: "Customer Feedback & NPS Survey",
    channel: "whatsapp",
    audience: "Recent Buyers (30 Days)",
    audienceCount: 2150,
    sentCount: 2150,
    status: "completed",
    scheduledAt: "20 Feb 2026, 11:45 AM",
    createdAt: "20 Feb 2026",
    deliveryRate: "97.4%",
    openRate: "61.8%",
  },
  {
    id: "CMP-9046",
    name: "Loyalty Tier Upgrade Notification",
    channel: "whatsapp",
    audience: "Gold & Platinum Members",
    audienceCount: 950,
    sentCount: 0,
    status: "draft",
    scheduledAt: "--Not Scheduled--",
    createdAt: "26 Feb 2026",
    deliveryRate: "0.0%",
    openRate: "0.0%",
  },
];

const channelConfig: Record<
  ChannelType,
  { label: string; icon: React.ElementType; style: string; badgeStyle: string }
> = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  },
  instagram: {
    label: "Instagram",
    icon: Camera,
    style: "bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white",
    badgeStyle: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300",
  },
  rcs: {
    label: "RCS",
    icon: Smartphone,
    style: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
  },
  facebook: {
    label: "Facebook",
    icon: ScanLine,
    style: "bg-blue-600 text-white",
    badgeStyle: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
};

const statusConfig: Record<
  CampaignStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "Running",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    dot: "bg-emerald-500 animate-pulse",
  },
  scheduled: {
    label: "Scheduled",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
    dot: "bg-slate-500",
  },
  draft: {
    label: "Draft",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    dot: "bg-amber-500",
  },
  paused: {
    label: "Paused",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    dot: "bg-rose-500",
  },
};

export default function BulkCampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsCount, setRowsCount] = useState<string>("20");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "whatsapp" as ChannelType,
    audience: "VIP Customers Segment",
    audienceCount: 1200,
    messageText: "",
    scheduleType: "now",
    scheduleDateTime: "",
  });

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesStatus =
      statusFilter === "all" || camp.status === statusFilter;
    const matchesChannel =
      channelFilter === "all" || camp.channel === channelFilter;
    const matchesSearch =
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.audience.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesChannel && matchesSearch;
  });

  const allSelected =
    filteredCampaigns.length > 0 &&
    filteredCampaigns.every((c) => selected.includes(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filteredCampaigns.map((c) => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.status === "active") return { ...c, status: "paused" };
          if (c.status === "paused") return { ...c, status: "active" };
        }
        return c;
      })
    );
  };

  const handleDuplicate = (camp: Campaign) => {
    const duplicated: Campaign = {
      ...camp,
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${camp.name} (Copy)`,
      status: "draft",
      sentCount: 0,
      createdAt: "Just now",
      scheduledAt: "--Not Scheduled--",
    };
    setCampaigns([duplicated, ...campaigns]);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    const created: Campaign = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCampaign.name.trim(),
      channel: newCampaign.channel,
      audience: newCampaign.audience,
      audienceCount: Number(newCampaign.audienceCount) || 500,
      sentCount: newCampaign.scheduleType === "now" ? Number(newCampaign.audienceCount) || 500 : 0,
      status: newCampaign.scheduleType === "now" ? "completed" : "scheduled",
      scheduledAt:
        newCampaign.scheduleType === "now"
          ? "Sent Immediately"
          : newCampaign.scheduleDateTime || "Tomorrow, 10:00 AM",
      createdAt: "Just now",
      deliveryRate: newCampaign.scheduleType === "now" ? "98.5%" : "0.0%",
      openRate: newCampaign.scheduleType === "now" ? "52.0%" : "0.0%",
    };

    setCampaigns([created, ...campaigns]);
    setIsCreateModalOpen(false);
    setNewCampaign({
      name: "",
      channel: "whatsapp",
      audience: "VIP Customers Segment",
      audienceCount: 1200,
      messageText: "",
      scheduleType: "now",
      scheduleDateTime: "",
    });
  };

  const totalAudience = campaigns.reduce((acc, c) => acc + c.audienceCount, 0);
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <span>CRM</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary font-medium">Bulk Campaign</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Bulk Campaigns
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create, schedule, and monitor bulk outreach across WhatsApp, Instagram, RCS, and Facebook.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                const csvContent =
                  "data:text/csv;charset=utf-8," +
                  ["ID,Campaign Name,Channel,Audience,Status,Sent,Delivery Rate"]
                    .concat(
                      campaigns.map(
                        (c) =>
                          `"${c.id}","${c.name}","${c.channel}","${c.audience}","${c.status}","${c.sentCount}/${c.audienceCount}","${c.deliveryRate}"`
                      )
                    )
                    .join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "bulk_campaigns.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-sm"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span>Create Campaign</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <Megaphone className="h-4.5 w-4.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Total Campaigns</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">{campaigns.length}</p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3 w-3" />
            +18% this month
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-3">
            <Send className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-muted-foreground">Messages Dispatched</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">
            {totalSent.toLocaleString()}
          </p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            98.6% delivered
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-3">
            <Users className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-muted-foreground">Audience Reach</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">
            {totalAudience.toLocaleString()}
          </p>
          <p className="text-xs mt-1 flex items-center gap-1 text-muted-foreground">
            <Zap className="h-3 w-3 text-amber-500" />
            4 active channels
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-3">
            <BarChart3 className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs text-muted-foreground">Avg Response / Open</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">58.2%</p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3 w-3" />
            +4.2% vs last week
          </p>
        </div>
      </div>

      {/* Channel & Status Filtering Tabs */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs">
        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { key: "all", label: "All Campaigns", count: campaigns.length },
            {
              key: "active",
              label: "Running",
              count: campaigns.filter((c) => c.status === "active").length,
            },
            {
              key: "scheduled",
              label: "Scheduled",
              count: campaigns.filter((c) => c.status === "scheduled").length,
            },
            {
              key: "completed",
              label: "Completed",
              count: campaigns.filter((c) => c.status === "completed").length,
            },
            {
              key: "draft",
              label: "Drafts",
              count: campaigns.filter((c) => c.status === "draft").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap",
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  statusFilter === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Channel filter pills & search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground text-xs font-medium mr-1 shrink-0">
              Channel:
            </span>
            {[
              { key: "all", label: "All Channels" },
              { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
              { key: "instagram", label: "Instagram", icon: Camera },
              { key: "rcs", label: "RCS", icon: Smartphone },
              { key: "facebook", label: "Facebook", icon: ScanLine },
            ].map((ch) => (
              <button
                key={ch.key}
                onClick={() => setChannelFilter(ch.key)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap border",
                  channelFilter === ch.key
                    ? "bg-accent border-primary text-primary font-semibold"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {ch.icon && <ch.icon className="h-3 w-3" />}
                {ch.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-56 max-w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
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
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setCampaigns(initialCampaigns);
                setStatusFilter("all");
                setChannelFilter("all");
                setSearchQuery("");
                setSelected([]);
              }}
              title="Reset Filters"
              className="h-8 w-8 text-muted-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-3 w-10 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Campaign
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Channel
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Target Audience
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Delivery Progress
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Scheduled / Sent
                </th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No campaigns found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => {
                  const ch = channelConfig[camp.channel];
                  const st = statusConfig[camp.status];
                  const Icon = ch.icon;
                  const progressPct =
                    camp.audienceCount > 0
                      ? Math.round((camp.sentCount / camp.audienceCount) * 100)
                      : 0;

                  return (
                    <tr
                      key={camp.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selected.includes(camp.id)}
                          onCheckedChange={() => toggleOne(camp.id)}
                        />
                      </td>
                      <td className="p-3 min-w-56">
                        <p className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                          {camp.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span className="font-mono">{camp.id}</span>
                          <span>•</span>
                          <span>Created {camp.createdAt}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5 font-medium", ch.badgeStyle)}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {ch.label}
                        </Badge>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs">
                            {camp.audience}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {camp.audienceCount.toLocaleString()} Contacts
                          </span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                            st.badge
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </span>
                      </td>
                      <td className="p-3 min-w-44 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {camp.sentCount.toLocaleString()} / {camp.audienceCount.toLocaleString()}
                            </span>
                            <span className="font-semibold text-foreground">
                              {progressPct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                camp.status === "completed"
                                  ? "bg-emerald-500"
                                  : camp.status === "active"
                                  ? "bg-primary"
                                  : "bg-slate-400"
                              )}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{camp.scheduledAt}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {camp.status === "active" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleStatus(camp.id)}
                              title="Pause Campaign"
                              className="h-7 w-7 text-amber-600 hover:bg-amber-50"
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {camp.status === "paused" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleStatus(camp.id)}
                              title="Resume Campaign"
                              className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDuplicate(camp)}
                            title="Duplicate Campaign"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  alert(
                                    `Campaign ${camp.id} Analytics:\nDelivery: ${camp.deliveryRate}\nOpen Rate: ${camp.openRate}`
                                  )
                                }
                              >
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(camp)}>
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(camp.id)}
                                className="text-destructive"
                              >
                                Delete Campaign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 border-t bg-muted/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Showing 1-{filteredCampaigns.length} of {campaigns.length} campaigns</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Button variant="outline" size="sm" disabled className="h-8 text-xs shrink-0">
              Previous
            </Button>
            <Button size="sm" className="h-8 w-8 p-0 shrink-0 bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl animate-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Megaphone className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Launch Bulk Campaign</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Campaign Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Festival Season VIP Discount 25%"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Select Channel *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["whatsapp", "instagram", "rcs", "facebook"] as ChannelType[]).map(
                    (channel) => {
                      const cfg = channelConfig[channel];
                      const Icon = cfg.icon;
                      const isSelected = newCampaign.channel === channel;
                      return (
                        <button
                          key={channel}
                          type="button"
                          onClick={() =>
                            setNewCampaign({ ...newCampaign, channel })
                          }
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center mb-1.5",
                              cfg.style
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">
                            {cfg.label}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Target Contact Segment
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newCampaign.audience}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, audience: e.target.value })
                    }
                  >
                    <option value="VIP Customers Segment">VIP Customers (1,240)</option>
                    <option value="All Active Leads">All Active Leads (4,500)</option>
                    <option value="Cart Drop-offs (Last 7 Days)">Cart Drop-offs (820)</option>
                    <option value="Recent Buyers (30 Days)">Recent Buyers (2,150)</option>
                    <option value="Newsletter Subscribers">Newsletter Subscribers (5,800)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Recipient Count
                  </label>
                  <Input
                    type="number"
                    value={newCampaign.audienceCount}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        audienceCount: Number(e.target.value),
                      })
                    }
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Message Content / Template Text
                </label>
                <textarea
                  rows={3}
                  placeholder="Hey {{name}}, don't miss our exclusive 25% discount this weekend! Click here to redeem: https://appnix.io/offer"
                  value={newCampaign.messageText}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, messageText: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Schedule Options
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={newCampaign.scheduleType === "now"}
                      onChange={() =>
                        setNewCampaign({ ...newCampaign, scheduleType: "now" })
                      }
                      className="accent-primary"
                    />
                    Send Immediately
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={newCampaign.scheduleType === "later"}
                      onChange={() =>
                        setNewCampaign({ ...newCampaign, scheduleType: "later" })
                      }
                      className="accent-primary"
                    />
                    Schedule for Later
                  </label>
                </div>

                {newCampaign.scheduleType === "later" && (
                  <div className="mt-2">
                    <Input
                      placeholder="e.g. 28 Feb 2026, 10:00 AM"
                      value={newCampaign.scheduleDateTime}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          scheduleDateTime: e.target.value,
                        })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {newCampaign.scheduleType === "now" ? "Dispatch Now" : "Schedule Campaign"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
