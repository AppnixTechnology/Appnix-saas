"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Plus,
  Lock,
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
  TrendingUp,
  MessageCircle,
} from "lucide-react";

// ---------- Types ----------
type Channel = "whatsapp" | "instagram";

interface Workflow {
  id: string;
  active: boolean;
  channel: Channel;
  name: string;
  trigger: string;
  tags: string[];
  created: string;
}

// ---------- Mock data ----------
const folders = [
  { id: "all", name: "All", count: 12 },
  { id: "nourin", name: "Nourin", count: 0 },
];

const workflows: Workflow[] = [
  {
    id: "1",
    active: true,
    channel: "whatsapp",
    name: "Main Support Flow",
    trigger: "Received Inbound Webhook",
    tags: [],
    created: "03 Mar, 2026",
  },
  {
    id: "2",
    active: true,
    channel: "instagram",
    name: "Marketing Promo Bot",
    trigger: "Hot-Keyword Received",
    tags: ["Promotions"],
    created: "02 Mar, 2026",
  },
  {
    id: "3",
    active: false,
    channel: "whatsapp",
    name: "Google Sheet Sync",
    trigger: "Data Entry Trigger",
    tags: ["Internal", "+2"],
    created: "26 Feb, 2026",
  },
  {
    id: "4",
    active: true,
    channel: "whatsapp",
    name: "Untitled Automation",
    trigger: "--NA--",
    tags: [],
    created: "26 Feb, 2026",
  },
];

const channelIcon: Record<Channel, React.ElementType> = {
  whatsapp: MessageSquare,
  instagram: Camera,
};

const channelStyle: Record<Channel, string> = {
  whatsapp: "bg-green-100 text-green-600",
  instagram: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white",
};

export default function BotWorkflowPage() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [rows, setRows] = useState(workflows);

  const toggleWorkflow = (id: string) => {
    setRows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + Header actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center text-sm gap-1">
          <span className="text-muted-foreground">Bot</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">Workflow</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
          <Button className="bg-green-600 hover:bg-green-700 text-white shrink-0">
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Create Botflow</span>
          </Button>
          <Button variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-foreground shrink-0">
            <Lock className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Unlock Botflow</span>
          </Button>
          <Button className="bg-blue-950 hover:bg-blue-900 text-white shrink-0">
            <ListFilter className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Open Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Left column: Folders + Active Flows */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Folders</h2>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors",
                    activeFolder === folder.id
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Folder
                      className={cn(
                        "h-4 w-4 shrink-0",
                        activeFolder === folder.id ? "fill-primary text-primary" : ""
                      )}
                    />
                    {folder.name}
                  </span>
                  {folder.count > 0 && (
                    <Badge className="bg-blue-950 hover:bg-blue-950 h-5 min-w-5 px-1.5 justify-center">
                      {folder.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-blue-950 text-white p-4 relative overflow-hidden">
            <p className="text-xs uppercase tracking-wide text-blue-200 font-medium">
              Active Flows
            </p>
            <p className="text-3xl font-bold mt-1">84%</p>
            <div className="flex items-center gap-1 mt-2 text-xs bg-green-500/20 text-green-400 w-fit px-1.5 py-0.5 rounded">
              <TrendingUp className="h-3 w-3" />
              +12% vs last month
            </div>
            <Zap className="absolute -bottom-3 -right-3 h-20 w-20 text-blue-800/40" />
          </div>
        </div>

        {/* Right column: Workflows table */}
        <div className="rounded-xl border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Active
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Action
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Channel
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Name
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Tags
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((flow) => {
                  const Icon = channelIcon[flow.channel];
                  return (
                    <tr key={flow.id} className="border-b last:border-0 hover:bg-accent/30">
                      <td className="p-3">
                        <Switch
                          checked={flow.active}
                          onCheckedChange={() => toggleWorkflow(flow.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem>Move to folder</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="p-3">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-md flex items-center justify-center",
                            channelStyle[flow.channel]
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="p-3 min-w-45">
                        <p className="font-medium text-primary">{flow.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Zap className="h-3 w-3" />
                          {flow.trigger}
                        </p>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {flow.tags.length === 0 ? (
                          <Badge variant="secondary" className="text-muted-foreground italic font-normal">
                            --Double Click to Edit--
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1 flex-wrap">
                            {flow.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className={cn(
                                  tag === "Promotions" && "bg-green-100 text-green-700",
                                  tag === "Internal" && "bg-blue-100 text-blue-700",
                                  tag === "+2" && "bg-muted text-muted-foreground"
                                )}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">
                        {flow.created}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing 1-{rows.length} of 12 workflows
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button size="sm" className="h-8 w-8 p-0 bg-blue-950 hover:bg-blue-900">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action buttons (bottom-right) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button size="icon" className="h-11 w-11 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <Zap className="h-5 w-5" />
        </Button>
        <Button size="icon" className="h-11 w-11 rounded-full bg-blue-950 hover:bg-blue-900 shadow-lg">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}