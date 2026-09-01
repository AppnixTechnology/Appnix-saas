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
  ShoppingBag,
  Image as ImageIcon,
  PlayCircle,
  SlidersHorizontal,
  ExternalLink,
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
  WhatsAppTemplate,
  WhatsAppTemplateStatus,
  TemplateCategory,
} from "@/types/whatsapp-template";
import {
  getStoredTemplates,
  saveStoredTemplates,
  CATEGORY_DETAILS,
} from "@/lib/whatsapp-templates";
import { RejectionReasonModal } from "./RejectionReasonModal";
import { ApprovedTemplateModal } from "./ApprovedTemplateModal";
import { SubmitApprovalModal } from "./SubmitApprovalModal";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  WhatsAppTemplateStatus,
  { label: string; badgeStyle: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Draft",
    badgeStyle:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",
    icon: FileText,
  },
  PENDING: {
    label: "Pending Meta Review",
    badgeStyle:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
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

export function TemplateListing() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() =>
    getStoredTemplates()
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
    useState<WhatsAppTemplate | null>(null);
  const [selectedTemplateForApproved, setSelectedTemplateForApproved] =
    useState<WhatsAppTemplate | null>(null);
  const [selectedTemplateForSubmit, setSelectedTemplateForSubmit] =
    useState<WhatsAppTemplate | null>(null);

  // Filter and Sort Logic
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => {
        const matchesSearch =
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.metaTemplateId &&
            t.metaTemplateId.toLowerCase().includes(searchQuery.toLowerCase()));

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

  // Counts for summary pills
  const counts = useMemo(() => {
    return {
      all: templates.length,
      approved: templates.filter((t) => t.status === "APPROVED").length,
      pending: templates.filter((t) => t.status === "PENDING").length,
      draft: templates.filter((t) => t.status === "DRAFT").length,
      rejected: templates.filter((t) => t.status === "REJECTED").length,
      disabled: templates.filter((t) => t.status === "DISABLED").length,
    };
  }, [templates]);

  // Actions
  const handleDuplicate = (template: WhatsAppTemplate) => {
    const copy: WhatsAppTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      name: `${template.name}_copy`,
      status: "DRAFT",
      metaTemplateId: undefined,
      rejectionReason: undefined,
      rejectionDetails: undefined,
      submittedAt: undefined,
      approvedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [copy, ...templates];
    setTemplates(updated);
    saveStoredTemplates(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updated = templates.filter((t) => t.id !== id);
      setTemplates(updated);
      saveStoredTemplates(updated);
    }
  };

  const handleSimulateStatus = (
    template: WhatsAppTemplate,
    newStatus: WhatsAppTemplateStatus
  ) => {
    const updated = templates.map((t) => {
      if (t.id === template.id) {
        if (newStatus === "APPROVED") {
          return {
            ...t,
            status: "APPROVED" as WhatsAppTemplateStatus,
            approvedAt: new Date().toISOString(),
            rejectionReason: undefined,
            rejectionDetails: undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        if (newStatus === "REJECTED") {
          return {
            ...t,
            status: "REJECTED" as WhatsAppTemplateStatus,
            rejectionReason:
              "Category Mismatch: Contains promotional offers submitted as Utility.",
            rejectionDetails: {
              code: "CATEGORY_MISMATCH_PROMOTIONAL",
              reason:
                "Meta detected promotional discount content. Must be submitted under Marketing category.",
              recommendation:
                "Change template category to Marketing and resubmit.",
              date: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    setTemplates(updated);
    saveStoredTemplates(updated);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedTemplateForSubmit) return;
    const metaId = `meta_tpl_${Math.floor(10000000 + Math.random() * 90000000)}`;

    const updated = templates.map((t) =>
      t.id === selectedTemplateForSubmit.id
        ? {
            ...t,
            status: "PENDING" as WhatsAppTemplateStatus,
            metaTemplateId: metaId,
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rejectionReason: undefined,
            rejectionDetails: undefined,
          }
        : t
    );

    setTemplates(updated);
    saveStoredTemplates(updated);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link
            href="/channels"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Channels</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <Link
            href="/channels/whatsapp"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            WhatsApp Channels
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-medium">Message Templates</span>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
              Message Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create, manage and submit WhatsApp templates for Meta approval.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => router.push("/channels/whatsapp/templates/create")}
              className="primary primary text-white shrink-0 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Create Template</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs / Quick Stats Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "ALL", label: "All", count: counts.all },
          { id: "APPROVED", label: "Approved", count: counts.approved },
          { id: "PENDING", label: "Pending Approval", count: counts.pending },
          { id: "DRAFT", label: "Draft", count: counts.draft },
          { id: "REJECTED", label: "Rejected", count: counts.rejected },
          { id: "DISABLED", label: "Disabled", count: counts.disabled },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0",
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/40"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-xl bg-card p-3 gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
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

          {/* Search Box */}
          <div className="relative w-64 max-w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, body, or ID..."
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
          </select>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground">
          <span>
            Showing {filteredTemplates.length} of {templates.length}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs text-muted-foreground"
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Templates Display Grid / Table */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground space-y-3">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <h3 className="font-semibold text-foreground text-base">
            No Templates Found
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL"
              ? "No templates match your selected filters. Try resetting your search."
              : "You haven't created any WhatsApp message templates yet."}
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/channels/whatsapp/templates/create")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Create First Template
          </Button>
        </div>
      ) : view === "grid" ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const statusInfo = STATUS_CONFIG[template.status];
            const StatusIcon = statusInfo.icon;
            const categoryInfo = CATEGORY_DETAILS[template.category];

            return (
              <div
                key={template.id}
                className="rounded-xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-4 border-b bg-muted/10 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] px-2 py-0 font-medium", categoryInfo?.badgeColor)}
                        >
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {template.language}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                          {template.contentType}
                        </Badge>
                      </div>
                      <Link
                        href={`/channels/whatsapp/templates/${template.id}`}
                        className="font-bold text-sm text-foreground hover:text-emerald-600 transition-colors font-mono truncate block"
                      >
                        {template.name}
                      </Link>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0 text-muted-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/channels/whatsapp/templates/${template.id}`)
                          }
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                        </DropdownMenuItem>

                        {(template.status === "DRAFT" ||
                          template.status === "REJECTED") && (
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/channels/whatsapp/templates/${template.id}/edit`
                              )
                            }
                          >
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit Template
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleDuplicate(template)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>

                        {template.status === "DRAFT" && (
                          <DropdownMenuItem
                            onClick={() => setSelectedTemplateForSubmit(template)}
                            className="text-emerald-600 font-medium"
                          >
                            <Send className="h-3.5 w-3.5 mr-2" /> Submit to Meta
                          </DropdownMenuItem>
                        )}

                        {template.status === "REJECTED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedTemplateForRejection(template)
                            }
                            className="text-rose-600 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 mr-2" /> View Rejection Reason
                          </DropdownMenuItem>
                        )}

                        {template.status === "APPROVED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedTemplateForApproved(template)
                            }
                            className="text-emerald-600 font-medium"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approved Details
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {/* Developer Simulator Actions */}
                        <div className="px-2 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Simulate Meta Status
                        </div>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSimulateStatus(template, "APPROVED")
                          }
                          className="text-[11px] text-emerald-600"
                        >
                          Set Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSimulateStatus(template, "REJECTED")
                          }
                          className="text-[11px] text-rose-600"
                        >
                          Set Rejected
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSimulateStatus(template, "PENDING")
                          }
                          className="text-[11px] text-amber-600"
                        >
                          Set Pending
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(template.id)}
                          className="text-destructive text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5 font-medium flex items-center gap-1",
                        statusInfo.badgeStyle
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      <span>{statusInfo.label}</span>
                    </Badge>

                    {template.metaTemplateId && (
                      <span className="text-[10px] text-muted-foreground font-mono truncate">
                        ID: {template.metaTemplateId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body Snippet */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="rounded-lg bg-muted/20 p-2.5 text-xs text-foreground/90 font-mono line-clamp-3 leading-relaxed border">
                    {template.body || "No message body defined."}
                  </div>

                  {/* Variables and CTA tags */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                    {template.variables && template.variables.length > 0 && (
                      <span className="bg-muted px-2 py-0.5 rounded font-mono">
                        {template.variables.length} Variable{template.variables.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {template.buttons && template.buttons.length > 0 && (
                      <span className="bg-muted px-2 py-0.5 rounded">
                        {template.buttons.length} CTA Button{template.buttons.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {template.header?.type !== "NONE" && (
                      <span className="bg-muted px-2 py-0.5 rounded capitalize">
                        {template.header?.type?.toLowerCase()} Header
                      </span>
                    )}
                  </div>

                  {/* Rejection Alert Callout if Rejected */}
                  {template.status === "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => setSelectedTemplateForRejection(template)}
                      className="w-full rounded-lg border border-rose-200 bg-rose-50/70 dark:bg-rose-950/40 p-2 text-left text-xs text-rose-800 dark:text-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate text-[11px] font-medium">
                        ⚠️ Reason: {template.rejectionReason || "Policy Mismatch"}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 ml-1" />
                    </button>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 border-t bg-muted/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {template.status === "REJECTED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/channels/whatsapp/templates/${template.id}/edit`
                          )
                        }
                        className="h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-50"
                      >
                        Edit & Resubmit
                      </Button>
                    ) : template.status === "DRAFT" ? (
                      <Button
                        size="sm"
                        onClick={() => setSelectedTemplateForSubmit(template)}
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Submit Review
                      </Button>
                    ) : template.status === "APPROVED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/campaigns/new?templateId=${template.id}&channel=WHATSAPP`
                          )
                        }
                        className="h-7 text-xs text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300"
                      >
                        Use in Campaign
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          router.push(`/channels/whatsapp/templates/${template.id}`)
                        }
                        className="h-7 text-xs"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground text-left">
                  <th className="p-3 font-semibold">Template Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Language</th>
                  <th className="p-3 font-semibold">Content Type</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Last Updated</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTemplates.map((template) => {
                  const statusInfo = STATUS_CONFIG[template.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={template.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Link
                          href={`/channels/whatsapp/templates/${template.id}`}
                          className="font-semibold font-mono text-foreground hover:text-emerald-600 block"
                        >
                          {template.name}
                        </Link>
                        {template.metaTemplateId && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {template.metaTemplateId}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px]">
                          {template.category}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{template.language}</td>
                      <td className="p-3 capitalize">{template.contentType.toLowerCase()}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-2 py-0.5 font-medium flex items-center gap-1 w-fit",
                            statusInfo.badgeStyle
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.label}</span>
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {template.status === "REJECTED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedTemplateForRejection(template)
                              }
                              className="h-7 text-xs text-rose-600 border-rose-200"
                            >
                              Reason
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(
                                `/channels/whatsapp/templates/${template.id}`
                              )
                            }
                            className="h-7 text-xs"
                          >
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(template)}
                              >
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(template.id)}
                                className="text-destructive"
                              >
                                Delete
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
      )}

      {/* Modals */}
      <RejectionReasonModal
        isOpen={!!selectedTemplateForRejection}
        onClose={() => setSelectedTemplateForRejection(null)}
        template={selectedTemplateForRejection}
      />

      <ApprovedTemplateModal
        isOpen={!!selectedTemplateForApproved}
        onClose={() => setSelectedTemplateForApproved(null)}
        template={selectedTemplateForApproved}
        onDuplicate={handleDuplicate}
      />

      <SubmitApprovalModal
        isOpen={!!selectedTemplateForSubmit}
        onClose={() => setSelectedTemplateForSubmit(null)}
        onConfirmSubmit={handleConfirmSubmit}
        template={selectedTemplateForSubmit || {}}
      />
    </div>
  );
}
