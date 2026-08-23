"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
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
  X,
  CheckCircle2,
  Search,
} from "lucide-react";

// ---------- Types & Data ----------
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

const initialDepartments: Department[] = [
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
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [newDeptStatus, setNewDeptStatus] = useState("Active");

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    const newDept: Department = {
      id: newDeptName.toLowerCase().replace(/\s+/g, "-"),
      name: newDeptName.trim(),
      status: {
        label: newDeptStatus,
        tone: newDeptStatus === "Active" ? "green" : "blue",
      },
      tag: { label: "General", icon: HelpCircle, tone: "green" },
      description: newDeptDesc.trim() || "Department unit created to handle operational tasks.",
      icon: Building2,
      avatars: [],
      extraCount: 1,
      actions: [
        { icon: Users, label: "Members" },
        { icon: FileText, label: "Docs" },
        { icon: Pencil, label: "Edit" },
        { icon: Trash2, label: "Delete" },
      ],
    };

    setDepartments([...departments, newDept]);
    setNewDeptName("");
    setNewDeptDesc("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/department"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Department</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Departments</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
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
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Department
          </Button>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="flex items-center justify-between border rounded-xl bg-card p-3 shadow-xs">
        <div className="relative w-72 max-w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 text-sm bg-background"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filteredDepts.length} department{filteredDepts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col rounded-xl border bg-card p-5 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                      "h-7 w-7 rounded-full border-2 border-card object-cover",
                      i !== 0 && "-ml-2"
                    )}
                  />
                ))}
                <span
                  className={cn(
                    "flex h-7 items-center rounded-full border-2 border-card bg-emerald-500 px-2 text-[11px] font-bold text-white",
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
                    onClick={() => {
                      if (action.label === "Delete") {
                        handleDelete(dept.id);
                      } else {
                        alert(`${action.label} clicked for ${dept.name}`);
                      }
                    }}
                    className="h-8 w-8 hover:text-foreground"
                    aria-label={action.label}
                    title={action.label}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* New Unit Button Card */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 p-5 text-center transition-colors cursor-pointer",
            "hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed bg-background text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">New Unit</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Click to configure a new department structure
          </p>
        </button>
      </div>

      {/* Create Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-foreground">Create New Department</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Department Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Marketing & Growth"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={newDeptStatus}
                  onChange={(e) => setNewDeptStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="High Growth">High Growth</option>
                  <option value="Standard">Standard</option>
                  <option value="Stable">Stable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the department's mandate and primary responsibilities..."
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Create Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
