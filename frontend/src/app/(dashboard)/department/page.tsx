"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Plus,
  Building2,
  TrendingUp,
  Headphones,
  Code2,
  HelpCircle,
  Inbox,
  AlertTriangle,
  ChevronsRight,
  Users,
  FileText,
  Pencil,
  Trash2,
  BarChart3,
  Calendar,
  MessageSquare,
  History,
  Network,
  Archive,
  Zap,
  MessageCircle,
} from "lucide-react";

// ---------- Types & data ----------
interface Department {
  id: string;
  name: string;
  status: { label: string; tone: "green" | "blue" };
  tag: { label: string; icon: React.ElementType; tone: "green" | "pink" | "red" };
  description: string;
  icon: React.ElementType;
  avatars: string[];
  extraCount: number;
  actions: { icon: React.ElementType; label: string }[];
}

const DEPARTMENTS: Department[] = [
  {
    id: "operations",
    name: "Operations",
    status: { label: "Active", tone: "green" },
    tag: { label: "System Help", icon: HelpCircle, tone: "green" },
    description:
      "To manage the overall operations of the company. Responsible for supply chain, logistics, and facility management.",
    icon: Building2,
    avatars: [
      "https://i.pravatar.cc/56?img=12",
      "https://i.pravatar.cc/56?img=33",
    ],
    extraCount: 12,
    actions: [
      { icon: Users, label: "Members" },
      { icon: FileText, label: "Docs" },
      { icon: Pencil, label: "Edit" },
      { icon: Trash2, label: "Delete" },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    status: { label: "High Growth", tone: "blue" },
    tag: { label: "Inquiry Pending", icon: Inbox, tone: "pink" },
    description:
      "Focused on revenue generation and client acquisition. Currently viewing the quarterly sales performance reports.",
    icon: TrendingUp,
    avatars: [
      "https://i.pravatar.cc/56?img=5",
      "https://i.pravatar.cc/56?img=48",
      "https://i.pravatar.cc/56?img=25",
    ],
    extraCount: 45,
    actions: [
      { icon: BarChart3, label: "Reports" },
      { icon: Calendar, label: "Calendar" },
      { icon: Pencil, label: "Edit" },
      { icon: Trash2, label: "Delete" },
    ],
  },
  {
    id: "support",
    name: "Support",
    status: { label: "Standard", tone: "blue" },
    tag: { label: "Issue Tracking", icon: AlertTriangle, tone: "red" },
    description:
      "This department handles all customer queries related to product usage and technical issue resolution via live chat.",
    icon: Headphones,
    avatars: ["https://i.pravatar.cc/56?img=44"],
    extraCount: 28,
    actions: [
      { icon: MessageSquare, label: "Chat" },
      { icon: History, label: "History" },
      { icon: Pencil, label: "Edit" },
      { icon: Trash2, label: "Delete" },
    ],
  },
  {
    id: "it-development",
    name: "IT & Development",
    status: { label: "Stable", tone: "green" },
    tag: { label: "Active Sprints", icon: ChevronsRight, tone: "green" },
    description:
      "Responsible for internal tools, software infrastructure, and maintaining the CRM core architecture.",
    icon: Code2,
    avatars: [],
    extraCount: 18,
    actions: [
      { icon: Network, label: "Structure" },
      { icon: Archive, label: "Archive" },
      { icon: Pencil, label: "Edit" },
      { icon: Trash2, label: "Delete" },
    ],
  },
];

const tagTone: Record<Department["tag"]["tone"], string> = {
  green: "text-green-600",
  pink: "text-pink-600",
  red: "text-destructive",
};

const statusTone: Record<Department["status"]["tone"], string> = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
};

// ---------- Page ----------
export default function DepartmentOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Department</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">Management</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-primary">
            Department Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage organizational units, personnel, and operational workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border bg-background px-3.5 py-2 text-sm font-medium">
            Department Status
            <Switch defaultChecked />
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Add New Department
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col rounded-xl border bg-background p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <dept.icon className="h-5 w-5" />
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full text-xs font-semibold",
                  statusTone[dept.status.tone]
                )}
              >
                {dept.status.label}
              </Badge>
            </div>

            <h3 className="mt-3 text-base font-bold text-foreground">
              {dept.name}
            </h3>

            <div
              className={cn(
                "mb-3 mt-1 flex items-center gap-1.5 text-xs font-medium",
                tagTone[dept.tag.tone]
              )}
            >
              <dept.tag.icon className="h-3.5 w-3.5" />
              {dept.tag.label}
            </div>

            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {dept.description}
            </p>

            <div className="flex items-center justify-between border-t pt-3.5">
              <div className="flex items-center">
                {dept.avatars.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={cn(
                      "h-7 w-7 rounded-full border-2 border-background object-cover",
                      i !== 0 && "-ml-2"
                    )}
                  />
                ))}
                <span
                  className={cn(
                    "flex h-7 items-center rounded-full border-2 border-background bg-green-500 px-2 text-[11px] font-bold text-white",
                    dept.avatars.length !== 0 && "-ml-2"
                  )}
                >
                  +{dept.extraCount}
                </span>
              </div>

              <div className="flex items-center gap-0.5 text-muted-foreground">
                {dept.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={action.label}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* New Unit */}
        <button
          type="button"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-secondary/40 p-5 text-center transition-colors",
            "hover:border-muted-foreground/40 hover:bg-secondary/60"
          )}
        >
          <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed bg-background text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-muted-foreground">New Unit</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Click to configure a new department structure
          </p>
        </button>
      </div>

      {/* Floating actions */}
      <div className="fixed bottom-7 right-7 flex flex-col gap-3">
        <Button
          size="icon"
          className="h-11 w-11 rounded-full shadow-lg"
          aria-label="Quick actions"
        >
          <Zap className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 rounded-full bg-green-600 shadow-lg hover:bg-green-700"
          aria-label="Chat"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}