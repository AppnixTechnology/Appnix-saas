"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Search,
  ArrowLeft,
  Lock,
  RefreshCw,
  Plus,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  MessageCircle,
  Smartphone,
  Play,
  FileCode,
  Edit3,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import {
  Flow,
  FlowStatus,
  FlowCategory,
  WorkspaceFlowQuota,
  UnlockResult,
} from "@/components/whatsapp-mini-apps/types";
import { CreateFlowModal } from "@/components/whatsapp-mini-apps/create-flow-modal";
import { FlowSimulatorModal } from "@/components/whatsapp-mini-apps/flow-simulator-modal";
import { FlowJsonViewerModal } from "@/components/whatsapp-mini-apps/flow-json-viewer-modal";
import { UnlockQuotaModal } from "@/components/whatsapp-mini-apps/unlock-quota-modal";

const INITIAL_FLOWS: Flow[] = [
  {
    id: "1432432311703148",
    name: "testing calendar booking",
    status: "DRAFT",
    channel: "01 Automations (+91 98765 43210)",
    category: "Appointment Booking",
    createdAt: "2026-08-20T10:00:00.000Z",
    updatedAt: "2026-08-28T14:30:00.000Z",
    responsesCount: 48,
  },
  {
    id: "1023034210890264",
    name: "test meet",
    status: "PENDING",
    channel: "01 Automations (+91 98765 43210)",
    category: "Appointment Booking",
    createdAt: "2026-08-22T11:20:00.000Z",
    updatedAt: "2026-08-27T09:15:00.000Z",
    responsesCount: 12,
  },
  {
    id: "2751767651840230",
    name: "testing purpose flow",
    status: "PUBLISH",
    channel: "01 Automations (+91 98765 43210)",
    category: "Lead Generation",
    createdAt: "2026-08-15T08:00:00.000Z",
    updatedAt: "2026-08-29T08:00:00.000Z",
    responsesCount: 342,
  },
  {
    id: "1430880388746054",
    name: "example flow",
    status: "PUBLISH",
    channel: "01 Automations (+91 98765 43210)",
    category: "Lead Generation",
    createdAt: "2026-08-12T16:00:00.000Z",
    updatedAt: "2026-08-29T07:30:00.000Z",
    responsesCount: 890,
  },
  {
    id: "937299775331284",
    name: "inquiry data",
    status: "DRAFT",
    channel: "01 Automations (+91 98765 43210)",
    category: "Customer Support / Inquiry",
    createdAt: "2026-08-25T13:40:00.000Z",
    updatedAt: "2026-08-28T16:20:00.000Z",
    responsesCount: 19,
  },
];

const INITIAL_QUOTA: WorkspaceFlowQuota = {
  planTier: "Starter Plan",
  maxPublishedFlows: 5,
  publishedFlowsUsed: 2,
  availableSlots: 3,
  percentageUsed: 40,
  features: [
    {
      key: "published_flows",
      label: "Up to 5 Published Flows",
      unlocked: true,
      description: "Simultaneously active customer-facing mini-apps",
    },
    {
      key: "dynamic_endpoints",
      label: "Dynamic Data API Endpoints",
      unlocked: false,
      description: "Fetch real-time products, pricing, and slots from external backends",
    },
    {
      key: "data_encryption",
      label: "AES-256 Client-Side Form Encryption",
      unlocked: true,
      description: "End-to-end tokenized payload transit inside WhatsApp",
    },
    {
      key: "webhook_routing",
      label: "Automation Webhook Triggers",
      unlocked: true,
      description: "Trigger workflow nodes automatically upon form completion",
    },
    {
      key: "advanced_analytics",
      label: "Screen Drop-off & Funnel Analytics",
      unlocked: false,
      description: "Detailed per-screen drop-off metrics & conversion rates",
    },
    {
      key: "multi_waba",
      label: "Multi-WABA Number Routing",
      unlocked: false,
      description: "Deploy the same flow across multiple phone numbers",
    },
  ],
};

const CATEGORY_TABS: (FlowCategory | "All")[] = [
  "All",
  "Appointment Booking",
  "Lead Generation",
  "Customer Support / Inquiry",
  "Feedback & Survey",
  "Product Catalog / Order",
];

function StatusBadge({ status }: { status: FlowStatus }) {
  const styles: Record<FlowStatus, string> = {
    DRAFT:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    PENDING:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    PUBLISH:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  };

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-semibold text-[11px] py-0.5 px-2.5", styles[status])}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "PUBLISH" && "bg-emerald-500 animate-pulse",
          status === "PENDING" && "bg-amber-500",
          status === "DRAFT" && "bg-blue-500"
        )}
      />
      {status === "PUBLISH" ? "PUBLISHED" : status}
    </Badge>
  );
}

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      title="Copy WhatsApp Flow ID"
    >
      <span className="font-mono">{id}</span>
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

export default function FlowsPage() {
  const router = useRouter();

  // Flows & Quota State
  const [flows, setFlows] = useState<Flow[]>(INITIAL_FLOWS);
  const [quota, setQuota] = useState<WorkspaceFlowQuota>(INITIAL_QUOTA);
  const [query, setQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<FlowCategory | "All">("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [simulatorFlow, setSimulatorFlow] = useState<Flow | null>(null);
  const [jsonViewerFlow, setJsonViewerFlow] = useState<Flow | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync published quota when flows change
  const publishedCount = useMemo(() => {
    return flows.filter((f) => f.status === "PUBLISH").length;
  }, [flows]);

  useEffect(() => {
    setQuota((prev) => {
      const used = publishedCount;
      const avail = Math.max(0, prev.maxPublishedFlows - used);
      const pct = Math.min(100, Math.round((used / prev.maxPublishedFlows) * 100));
      return {
        ...prev,
        publishedFlowsUsed: used,
        availableSlots: avail,
        percentageUsed: pct,
      };
    });
  }, [publishedCount]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = flows.length;
    const published = publishedCount;
    const drafts = flows.filter((f) => f.status === "DRAFT").length;
    const pending = flows.filter((f) => f.status === "PENDING").length;
    const totalResponses = flows.reduce(
      (sum, f) => sum + (f.responsesCount || 0),
      0
    );

    return { total, published, drafts, pending, totalResponses };
  }, [flows, publishedCount]);

  // Filtered Flows
  const filteredFlows = useMemo(() => {
    return flows.filter((flow) => {
      const matchesQuery =
        !query.trim() ||
        flow.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        flow.id.includes(query.trim());

      const matchesCategory =
        selectedCategoryTab === "All" || flow.category === selectedCategoryTab;

      const matchesStatus =
        selectedStatusFilter === "all" ||
        flow.status.toLowerCase() === selectedStatusFilter.toLowerCase();

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [flows, query, selectedCategoryTab, selectedStatusFilter]);

  // Actions
  const handleCreateFlow = (newFlow: Flow) => {
    setFlows((prev) => [newFlow, ...prev]);
    showToast(`Flow "${newFlow.name}" registered with Meta Graph API in DRAFT state!`);
  };

  const handleDuplicateFlow = (flow: Flow) => {
    const duplicated: Flow = {
      ...flow,
      id: `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      name: `${flow.name} (Copy)`,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responsesCount: 0,
    };
    setFlows((prev) => [duplicated, ...prev]);
    showToast(`Duplicated flow created: "${duplicated.name}"`);
  };

  const handleDeleteFlow = (flowId: string) => {
    setFlows((prev) => prev.filter((f) => f.id !== flowId));
    showToast("Flow deleted successfully.");
  };

  const handleUnlockSuccess = (result: UnlockResult) => {
    setQuota((prev) => ({
      ...prev,
      planTier: result.data.planTier,
      maxPublishedFlows: result.data.newMaxPublishedFlows,
      availableSlots: Math.max(0, result.data.newMaxPublishedFlows - prev.publishedFlowsUsed),
      percentageUsed: Math.min(
        100,
        Math.round((prev.publishedFlowsUsed / result.data.newMaxPublishedFlows) * 100)
      ),
      features: prev.features.map((feat) => ({
        ...feat,
        unlocked: true,
      })),
    }));
    showToast(result.message);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("WhatsApp Flow registry synced with Meta API.");
    }, 450);
  };

  const handleNavigateToBuilder = (flowId: string) => {
    router.push(`/whatsapp-mini-apps/builder/${flowId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 shadow-2xl border border-border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5 font-medium">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">WhatsApp Mini Apps</span>
      </div>

      {/* Header & Top CTA Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              WhatsApp Mini-App Flows
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-bold"
            >
              Meta API v20.0
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Design, test, and deploy interactive native forms, appointment booking flows, and multi-step surveys inside WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Unlock Button Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUnlockModalOpen(true)}
            className="h-10 text-xs font-semibold cursor-pointer border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 gap-1.5 shadow-xs transition-all"
            title="Unlock WhatsApp Flows Quota & Features"
          >
            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Unlock</span>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 font-mono bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30"
            >
              {quota.publishedFlowsUsed}/{quota.maxPublishedFlows}
            </Badge>
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 text-xs font-medium cursor-pointer"
            title="Refresh Flows from Meta API"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-1.5", isRefreshing && "animate-spin text-primary")}
            />
            <span>Refresh</span>
          </Button>

          {/* Primary CTA Trigger Button */}
          <Button
            size="default"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-sm cursor-pointer gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create New Flow</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Row (4 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Flows */}
        <div className="rounded-xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Flows
            </p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">
            {stats.total}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Across all business accounts</p>
        </div>

        {/* Published & Quota Limit */}
        <div
          onClick={() => setIsUnlockModalOpen(true)}
          className="rounded-xl border border-border bg-card p-4.5 shadow-xs transition-all hover:border-amber-500/40 hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Published & Quota
            </p>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.published}
            </h3>
            <span className="text-xs font-bold text-muted-foreground">
              / {quota.maxPublishedFlows} Limit
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Click to unlock more capacity
          </p>
        </div>

        {/* Drafts */}
        <div className="rounded-xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Drafts & In-Progress
            </p>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Edit3 className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {stats.drafts}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Ready for builder customization</p>
        </div>

        {/* Total Interactions */}
        <div className="rounded-xl border border-border bg-card p-4.5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Submissions
            </p>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mt-2">
            {stats.totalResponses.toLocaleString()}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Native form completions</p>
        </div>
      </div>

      {/* Main Flows Card Container */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-b border-border/80 pb-3">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer",
                  selectedCategoryTab === tab
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab}
                {tab === "All" && (
                  <span className="ml-1.5 text-[10px] opacity-80">({flows.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Search and Status Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search flow by name or 16-digit ID..."
                className="pl-9 h-10 text-xs bg-card"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="publish">Published Only</option>
                <option value="draft">Drafts Only</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Table (Desktop / Tablet View) */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border/80">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[120px] font-bold text-xs">STATUS</TableHead>
                  <TableHead className="font-bold text-xs">FLOW NAME & ID</TableHead>
                  <TableHead className="font-bold text-xs">CONNECTED CHANNEL</TableHead>
                  <TableHead className="font-bold text-xs">CATEGORY</TableHead>
                  <TableHead className="text-right font-bold text-xs">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlows.map((flow) => (
                  <TableRow key={flow.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <StatusBadge status={flow.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          href={`/whatsapp-mini-apps/builder/${flow.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors inline-block"
                        >
                          {flow.name}
                        </Link>
                        <div>
                          <CopyId id={flow.id} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-foreground">
                        {flow.channel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground bg-muted/30">
                        {flow.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Open Builder */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigateToBuilder(flow.id)}
                          className="h-8 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary cursor-pointer gap-1"
                          title="Open Visual Builder"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Builder</span>
                        </Button>

                        {/* Test Simulator */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSimulatorFlow(flow)}
                          className="h-8 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                          title="Test in WhatsApp Simulator"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                        </Button>

                        {/* View JSON */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJsonViewerFlow(flow)}
                          className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                          title="View JSON Definition"
                        >
                          <FileCode className="h-3.5 w-3.5" />
                        </Button>

                        {/* Duplicate */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateFlow(flow)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Duplicate Flow"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFlow(flow.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Delete Flow"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredFlows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-12 space-y-3"
                    >
                      <Smartphone className="h-10 w-10 mx-auto text-muted-foreground/40" />
                      <p className="font-semibold text-sm">No WhatsApp flows match your filters.</p>
                      <Button
                        size="sm"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        + Create New Flow
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card List (Mobile View) */}
          <div className="sm:hidden divide-y divide-border">
            {filteredFlows.map((flow) => (
              <div key={flow.id} className="py-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <StatusBadge status={flow.status} />
                  <Badge variant="outline" className="text-[10px]">
                    {flow.category}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href={`/whatsapp-mini-apps/builder/${flow.id}`}
                    className="font-bold text-sm text-foreground hover:text-primary"
                  >
                    {flow.name}
                  </Link>
                  <div>
                    <CopyId id={flow.id} />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{flow.channel}</p>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigateToBuilder(flow.id)}
                    className="flex-1 h-8 text-xs font-semibold text-primary"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1" /> Builder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSimulatorFlow(flow)}
                    className="h-8 text-xs"
                  >
                    <Play className="h-3.5 w-3.5 mr-1 fill-current" /> Simulator
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredFlows.length}</strong> of{" "}
              <strong className="text-foreground">{flows.length}</strong> flows
            </p>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="default" className="h-8 w-8 text-xs">
                1
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => p + 1)}
                disabled={true}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Support Quick Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-40">
        <Button
          size="icon"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl cursor-pointer"
          title="Create New WhatsApp Flow"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* 1. "+ Create New Flow" Modal */}
      <CreateFlowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingFlows={flows}
        onCreateFlow={handleCreateFlow}
        onNavigateToBuilder={handleNavigateToBuilder}
      />

      {/* 2. "Unlock WhatsApp Flows Quota" Modal */}
      <UnlockQuotaModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        quota={quota}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {/* 3. Flow Simulator Modal */}
      <FlowSimulatorModal
        isOpen={!!simulatorFlow}
        onClose={() => setSimulatorFlow(null)}
        flow={simulatorFlow}
      />

      {/* 4. Flow JSON Specification Viewer Modal */}
      <FlowJsonViewerModal
        isOpen={!!jsonViewerFlow}
        onClose={() => setJsonViewerFlow(null)}
        flow={jsonViewerFlow}
      />
    </div>
  );
}