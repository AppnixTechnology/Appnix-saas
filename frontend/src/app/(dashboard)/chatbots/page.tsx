"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  Plus,
  ListFilter,
  FolderPlus,
  Folder,
  Eye,
  Copy,
  Pencil,
  MoreVertical,
  MessageSquare,
  Camera,
  Zap,
  MessageCircle,
  Search,
  Bot,
  Play,
  Share2,
  Trash2,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react";

type Channel = "whatsapp" | "instagram" | "rcs" | "facebook";

interface Workflow {
  id: string;
  active: boolean;
  channel: Channel;
  name: string;
  trigger: string;
  status: "DRAFT" | "PUBLISHED" | "DISABLED";
  tags: string[];
  conversations: number;
  created: string;
}

const initialFolders = [
  { id: "all", name: "All Botflows", count: 12 },
  { id: "support", name: "Customer Support", count: 5 },
  { id: "sales", name: "Lead Generation & Sales", count: 4 },
  { id: "marketing", name: "Promotions & Offers", count: 3 },
];

const initialWorkflows: Workflow[] = [
  {
    id: "bot-101",
    active: true,
    channel: "whatsapp",
    name: "Customer Support AI Assistant",
    trigger: "Incoming Customer Message",
    status: "PUBLISHED",
    tags: ["AI", "Support", "24/7"],
    conversations: 4250,
    created: "22 Feb, 2026",
  },
  {
    id: "bot-102",
    active: true,
    channel: "instagram",
    name: "Instagram Story & DM Qualifier",
    trigger: "Keyword: 'PRICING'",
    status: "PUBLISHED",
    tags: ["Sales", "Promotions"],
    conversations: 1890,
    created: "20 Feb, 2026",
  },
  {
    id: "bot-103",
    active: true,
    channel: "rcs",
    name: "RCS OTP & Verification Bot",
    trigger: "Webhook: auth.otp.request",
    status: "PUBLISHED",
    tags: ["Security", "Carrier"],
    conversations: 8940,
    created: "15 Feb, 2026",
  },
  {
    id: "bot-104",
    active: false,
    channel: "whatsapp",
    name: "Abandoned Cart Recovery Flow",
    trigger: "Shopify Webhook: Cart_Drop",
    status: "DRAFT",
    tags: ["E-commerce", "High ROI"],
    conversations: 0,
    created: "10 Feb, 2026",
  },
];

const channelStyle: Record<Channel, { bg: string; icon: React.ElementType }> = {
  whatsapp: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: MessageSquare },
  instagram: { bg: "bg-pink-500/10 text-pink-600 border-pink-500/20", icon: Camera },
  rcs: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: MessageCircle },
  facebook: { bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", icon: Share2 },
};

export default function BotWorkflowPage() {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState("all");
  const [rows, setRows] = useState(initialWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");

  const toggleWorkflow = (id: string) => {
    setRows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, active: !w.active, status: !w.active ? "PUBLISHED" : "DISABLED" } : w
      )
    );
  };

  const handleDuplicate = (flow: Workflow) => {
    const cloned: Workflow = {
      ...flow,
      id: `bot-${Date.now().toString().slice(-4)}`,
      name: `${flow.name} (Copy)`,
      status: "DRAFT",
      active: false,
      conversations: 0,
      created: "Today",
    };
    setRows([cloned, ...rows]);
  };

  const handleDelete = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesChannel = selectedChannel === "all" || r.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Sleek Breadcrumb Back Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Chatbots & Automations</span>
      </nav>

      {/* Header Banner & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Chatbots & Workflow Automations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Design multi-channel visual botflows, keyword triggers, OpenAI responses, and human agent escalations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/chatbots/builder/new")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-sm px-4"
          >
            <Plus className="h-4 w-4" />
            Create Botflow
          </Button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Total Botflows</p>
          <p className="text-2xl font-bold text-foreground">{rows.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Active Workflows</p>
          <p className="text-2xl font-bold text-emerald-600">{rows.filter((r) => r.active).length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Conversations Handled</p>
          <p className="text-2xl font-bold text-primary">15,080</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-xs space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Resolution Rate</p>
          <p className="text-2xl font-bold text-foreground">94.2%</p>
        </div>
      </div>

      {/* Main Content Layout with Folders & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Folders Sidebar (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border bg-card p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Folders</h3>
            <button
              type="button"
              onClick={() => alert("Create new folder")}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> New
            </button>
          </div>

          <div className="space-y-1">
            {initialFolders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                  activeFolder === f.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="h-3.5 w-3.5" />
                  <span className="truncate">{f.name}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                  {f.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Workflows Table (9 cols) */}
        <div className="lg:col-span-9 rounded-2xl border bg-card shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/10">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search botflows, keywords, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="rcs">RCS</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/30 border-b text-muted-foreground uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Bot Name & Trigger</th>
                  <th className="p-3">Tags</th>
                  <th className="p-3">Traffic</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRows.map((flow) => {
                  const cfg = channelStyle[flow.channel] || channelStyle.whatsapp;
                  const Icon = cfg.icon;

                  return (
                    <tr key={flow.id} className="hover:bg-accent/30 transition-colors group">
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={flow.active}
                            onCheckedChange={() => toggleWorkflow(flow.id)}
                          />
                          <Badge
                            variant={flow.status === "PUBLISHED" ? "default" : "secondary"}
                            className={cn(
                              "text-[9px] py-0 px-1.5 font-bold",
                              flow.status === "PUBLISHED"
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {flow.status}
                          </Badge>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center border",
                            cfg.bg
                          )}
                          title={flow.channel}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      </td>

                      <td className="p-3 min-w-[200px]">
                        <Link
                          href={`/chatbots/builder/${flow.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {flow.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <Zap className="h-3 w-3 text-primary" />
                          {flow.trigger}
                        </p>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          {flow.tags.map((t, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-[10px] py-0 px-1 font-medium"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap font-medium text-foreground">
                        {flow.conversations.toLocaleString()} chats
                      </td>

                      <td className="p-3 whitespace-nowrap text-muted-foreground">
                        {flow.created}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => router.push(`/chatbots/builder/${flow.id}`)}
                            title="Edit Flow"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleDuplicate(flow)}
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/chatbots/builder/${flow.id}`)}
                              >
                                Open Visual Builder
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push("/crm/live-chat")}>
                                View Active Conversations
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(flow.id)}
                                className="text-destructive font-medium"
                              >
                                Delete Botflow
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}