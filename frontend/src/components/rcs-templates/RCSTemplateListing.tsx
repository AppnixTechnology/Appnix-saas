"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Edit,
  Trash2,
  Send,
  Eye,
  Sparkles,
  RefreshCw,
  Layers,
  Smartphone,
  Radio,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RCSTemplate,
  RCSTemplateStatus,
  RCSCategory,
  RCSMessageType,
} from "@/types/rcs-template";
import {
  getStoredRCSTemplates,
  saveStoredRCSTemplates,
  RCS_CATEGORY_CONFIG,
} from "@/lib/rcs-templates";
import { RCSRejectionModal } from "./RCSRejectionModal";
import { RCSApprovedModal } from "./RCSApprovedModal";
import { RCSSubmitApprovalModal } from "./RCSSubmitApprovalModal";
import { RCSPhonePreview } from "./RCSPhonePreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  RCSTemplateStatus,
  { label: string; badgeStyle: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Draft",
    badgeStyle:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",
    icon: FileText,
  },
  PENDING: {
    label: "Under Carrier Review",
    badgeStyle:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved (Carrier Verified)",
    badgeStyle:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    badgeStyle:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300",
    icon: XCircle,
  },
  DISABLED: {
    label: "Disabled",
    badgeStyle:
      "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400",
    icon: AlertCircle,
  },
};

export function RCSTemplateListing() {
  const router = useRouter();
  const [templates, setTemplates] = useState<RCSTemplate[]>(() =>
    getStoredRCSTemplates()
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "name" | "status">(
    "latest"
  );

  // Modals state
  const [selectedTemplateForRejection, setSelectedTemplateForRejection] =
    useState<RCSTemplate | null>(null);
  const [selectedTemplateForApproved, setSelectedTemplateForApproved] =
    useState<RCSTemplate | null>(null);
  const [selectedTemplateForSubmit, setSelectedTemplateForSubmit] =
    useState<RCSTemplate | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] =
    useState<RCSTemplate | null>(null);

  // Filter and Sort Logic
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => {
        const textToSearch = `${t.name} ${t.textBody || ""} ${
          t.card?.description || ""
        } ${t.rcsTemplateId || ""} ${t.agentName || ""}`.toLowerCase();

        const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || t.status === statusFilter;
        const matchesCategory =
          categoryFilter === "ALL" || t.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (sortBy === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "status") {
          return a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [templates, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Counters
  const counters = useMemo(() => {
    return {
      all: templates.length,
      approved: templates.filter((t) => t.status === "APPROVED").length,
      pending: templates.filter((t) => t.status === "PENDING").length,
      rejected: templates.filter((t) => t.status === "REJECTED").length,
      drafts: templates.filter((t) => t.status === "DRAFT").length,
    };
  }, [templates]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete template "${name}"?`)) {
      const updated = templates.filter((t) => t.id !== id);
      setTemplates(updated);
      saveStoredRCSTemplates(updated);
    }
  };

  const handleDuplicate = (template: RCSTemplate) => {
    const copy: RCSTemplate = {
      ...template,
      id: `rcs-tpl-${Date.now()}`,
      name: `${template.name}_copy`,
      status: "DRAFT",
      rcsTemplateId: undefined,
      carrierApprovals: undefined,
      rejectionReason: undefined,
      rejectionDetails: undefined,
      submittedAt: undefined,
      approvedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [copy, ...templates];
    setTemplates(updated);
    saveStoredRCSTemplates(updated);
    router.push(`/channels/rcs/templates/${copy.id}/edit`);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedTemplateForSubmit) return;

    const generatedId = `rcs_tpl_${Math.floor(100000 + Math.random() * 900000)}`;
    const updatedTemplate: RCSTemplate = {
      ...selectedTemplateForSubmit,
      status: "PENDING",
      rcsTemplateId: generatedId,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      carrierApprovals: [
        { carrier: "Google Jibe", status: "APPROVED", reviewedAt: new Date().toISOString() },
        { carrier: "Jio", status: "PENDING" },
        { carrier: "Airtel", status: "PENDING" },
        { carrier: "Vodafone Idea", status: "PENDING" },
      ],
    };

    const updatedList = templates.map((t) =>
      t.id === selectedTemplateForSubmit.id ? updatedTemplate : t
    );
    setTemplates(updatedList);
    saveStoredRCSTemplates(updatedList);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link
            href="/channels"
            className="hover:text-foreground transition-colors"
          >
            Channels
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <Link
            href="/channels/rcs"
            className="hover:text-foreground transition-colors"
          >
            RCS
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-medium">Templates</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-indigo-600" />
              <span>RCS Message Templates</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Design rich, interactive RCS business messages, carousel cards, and manage carrier approvals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/channels/rcs/templates/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                <span>+ Create New Template</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("APPROVED")}
          className={cn(
            "p-4 rounded-xl border text-left transition-all relative overflow-hidden bg-card hover:shadow-xs",
            statusFilter === "APPROVED" && "ring-2 ring-emerald-500 border-emerald-500"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Approved</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{counters.approved}</p>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
            Carrier Verified (Jio/Airtel/VI)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={cn(
            "p-4 rounded-xl border text-left transition-all relative overflow-hidden bg-card hover:shadow-xs",
            statusFilter === "PENDING" && "ring-2 ring-amber-500 border-amber-500"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Review</span>
            <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{counters.pending}</p>
          <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">
            Under Carrier Review
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("REJECTED")}
          className={cn(
            "p-4 rounded-xl border text-left transition-all relative overflow-hidden bg-card hover:shadow-xs",
            statusFilter === "REJECTED" && "ring-2 ring-rose-500 border-rose-500"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Rejected</span>
            <div className="h-7 w-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{counters.rejected}</p>
          <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
            Click to View Reason & Fix
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("DRAFT")}
          className={cn(
            "p-4 rounded-xl border text-left transition-all relative overflow-hidden bg-card hover:shadow-xs",
            statusFilter === "DRAFT" && "ring-2 ring-slate-500 border-slate-500"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Drafts</span>
            <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{counters.drafts}</p>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block">
            Unsubmitted Templates
          </span>
        </button>
      </div>

      {/* Toolbar: Search + Category Filter + Status Filter + View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl bg-card p-3 gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* View toggle */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/40 shrink-0">
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

          {/* Search Box */}
          <div className="relative w-64 max-w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search RCS templates..."
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

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 text-xs rounded-lg border bg-background px-2.5 text-foreground shrink-0"
          >
            <option value="ALL">All Statuses ({templates.length})</option>
            <option value="APPROVED">Approved ({counters.approved})</option>
            <option value="PENDING">Under Review ({counters.pending})</option>
            <option value="REJECTED">Rejected ({counters.rejected})</option>
            <option value="DRAFT">Drafts ({counters.drafts})</option>
          </select>

          {/* Category filter dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 text-xs rounded-lg border bg-background px-2.5 text-foreground shrink-0"
          >
            <option value="ALL">All Categories</option>
            <option value="PROMOTIONAL">Promotional / Marketing</option>
            <option value="TRANSACTIONAL">Transactional</option>
            <option value="OTP">Authentication / OTP</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground">
          <span>Showing {filteredTemplates.length} templates</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 text-xs rounded-lg border bg-background px-2 text-foreground"
          >
            <option value="latest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Templates Content: Grid or List Table */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground space-y-3">
          <Smartphone className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <h3 className="font-semibold text-foreground text-base">No RCS Templates Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL"
              ? "No templates match your current filters. Try resetting search."
              : "You have not created any RCS templates yet. Create rich cards and carousels with carrier verification."}
          </p>
          <Link href="/channels/rcs/templates/create">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
              <Plus className="h-4 w-4 mr-1" /> + Create RCS Template
            </Button>
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const statusInfo = STATUS_CONFIG[template.status];
            const StatusIcon = statusInfo.icon;
            const categoryInfo = RCS_CATEGORY_CONFIG[template.category];

            return (
              <div
                key={template.id}
                className="rounded-xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-4 border-b bg-muted/10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/channels/rcs/templates/${template.id}`}
                        className="font-bold text-sm text-foreground hover:text-indigo-600 truncate block font-mono"
                      >
                        {template.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Agent: <span className="font-medium text-foreground">{template.agentName}</span>
                      </p>
                    </div>

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
                        <DropdownMenuItem
                          onClick={() => setSelectedTemplateForPreview(template)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" /> Preview Simulator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/channels/rcs/templates/${template.id}`)}
                        >
                          <FileText className="h-3.5 w-3.5 mr-2" /> View Details
                        </DropdownMenuItem>
                        {template.status === "DRAFT" || template.status === "REJECTED" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/channels/rcs/templates/${template.id}/edit`)
                            }
                          >
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit Template
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(template.id, template.name)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-2 py-0.5 font-medium", statusInfo.badgeStyle)}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {template.messageType === "CAROUSEL" ? (
                        <Layers className="h-3 w-3 mr-1 inline" />
                      ) : template.messageType === "RICH_CARD" ? (
                        <Smartphone className="h-3 w-3 mr-1 inline" />
                      ) : (
                        <FileText className="h-3 w-3 mr-1 inline" />
                      )}
                      {template.messageType}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", categoryInfo.badgeStyle)}>
                      {template.category}
                    </Badge>
                  </div>
                </div>

                {/* Body Preview */}
                <div className="p-4 text-xs space-y-2 text-muted-foreground flex-1">
                  <p className="line-clamp-3 leading-relaxed">
                    {template.messageType === "TEXT"
                      ? template.textBody
                      : template.messageType === "RICH_CARD"
                      ? template.card?.description
                      : `${template.cards?.[0]?.title || "Carousel Card"}: ${
                          template.cards?.[0]?.description || ""
                        }`}
                  </p>

                  {template.rcsTemplateId && (
                    <p className="text-[10px] font-mono text-muted-foreground/80 pt-1">
                      Carrier Ref: {template.rcsTemplateId}
                    </p>
                  )}
                </div>

                {/* Footer Toolbar */}
                <div className="px-4 py-2.5 bg-muted/20 border-t flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      onClick={() => setSelectedTemplateForPreview(template)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>

                    {template.status === "APPROVED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        onClick={() => setSelectedTemplateForApproved(template)}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
                      </Button>
                    )}

                    {template.status === "REJECTED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        onClick={() => setSelectedTemplateForRejection(template)}
                      >
                        <AlertCircle className="h-3.5 w-3.5 mr-1" /> Reason
                      </Button>
                    )}

                    {template.status === "DRAFT" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        onClick={() => setSelectedTemplateForSubmit(template)}
                      >
                        <Radio className="h-3.5 w-3.5 mr-1" /> Submit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b text-muted-foreground font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Template Name & Agent</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTemplates.map((template) => {
                  const statusInfo = STATUS_CONFIG[template.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={template.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/channels/rcs/templates/${template.id}`}
                          className="font-bold text-foreground hover:text-indigo-600 font-mono block"
                        >
                          {template.name}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {template.agentName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {template.messageType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-medium", statusInfo.badgeStyle)}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs px-2 text-indigo-600 hover:text-indigo-700"
                            onClick={() => setSelectedTemplateForPreview(template)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => handleDuplicate(template)}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs px-2 text-rose-500 hover:text-rose-700"
                            onClick={() => handleDelete(template.id, template.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simulator Quick Preview Modal */}
      {selectedTemplateForPreview && (
        <Dialog
          open={!!selectedTemplateForPreview}
          onOpenChange={(open) => !open && setSelectedTemplateForPreview(null)}
        >
          <DialogContent className="max-w-md flex flex-col items-center justify-center p-6">
            <DialogHeader className="w-full text-center pb-2">
              <DialogTitle className="text-base font-bold font-mono">
                {selectedTemplateForPreview.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real-time Android RCS Messages Simulator
              </DialogDescription>
            </DialogHeader>
            <RCSPhonePreview template={selectedTemplateForPreview} />
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Details Modal */}
      <RCSRejectionModal
        isOpen={!!selectedTemplateForRejection}
        onClose={() => setSelectedTemplateForRejection(null)}
        template={selectedTemplateForRejection}
      />

      {/* Approved Template Modal */}
      <RCSApprovedModal
        isOpen={!!selectedTemplateForApproved}
        onClose={() => setSelectedTemplateForApproved(null)}
        template={selectedTemplateForApproved}
        onDuplicate={handleDuplicate}
      />

      {/* Carrier Review Submission Modal */}
      <RCSSubmitApprovalModal
        isOpen={!!selectedTemplateForSubmit}
        onClose={() => setSelectedTemplateForSubmit(null)}
        onConfirmSubmit={handleConfirmSubmit}
        template={selectedTemplateForSubmit || {}}
      />
    </div>
  );
}
