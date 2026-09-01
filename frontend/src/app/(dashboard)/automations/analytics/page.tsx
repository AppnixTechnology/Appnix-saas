"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  ArrowUpRight,
  AlertTriangle,
  Layers,
  Search,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Zap,
  Activity,
  Check,
  FileSpreadsheet,
  Printer,
  Calendar,
  SlidersHorizontal,
  Code2,
  Terminal,
  Globe,
  Radio,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  RCSIcon,
} from "@/components/landing/channel-icons";
import { downloadCsv, escapeCsvField } from "@/components/crm/csv-utils";

// ---------- Types ----------
export interface WorkflowMetric {
  id: string;
  name: string;
  description: string;
  triggerType: "Inbound Message" | "Webhook Event" | "Form Submission" | "Scheduled Cron" | "RCS Event";
  channel: "WhatsApp" | "Instagram" | "Facebook" | "RCS" | "Omnichannel";
  totalRuns: number;
  successRuns: number;
  failedRuns: number;
  avgDurationMs: number;
  lastRunTime: string;
  status: "Active" | "Paused" | "Draft";
  executionSteps: Array<{
    stepNumber: number;
    name: string;
    type: "trigger" | "condition" | "action" | "crm";
    durationMs: number;
    status: "success" | "failed" | "skipped";
    details: string;
  }>;
}

export interface ErrorCause {
  cause: string;
  count: number;
  percentage: number;
  severity: "high" | "medium" | "low";
  suggestedAction: string;
}

// ---------- Mock Analytics Datasets ----------
const initialWorkflows: WorkflowMetric[] = [
  {
    id: "WF-1092",
    name: "Abandoned Cart Recovery Flow",
    description: "Triggers 1 hour after cart abandonment to send WhatsApp discount voucher.",
    triggerType: "Webhook Event",
    channel: "WhatsApp",
    totalRuns: 42850,
    successRuns: 42120,
    failedRuns: 730,
    avgDurationMs: 340,
    lastRunTime: "2 mins ago",
    status: "Active",
    executionSteps: [
      { stepNumber: 1, name: "Webhook: Cart Abandoned", type: "trigger", durationMs: 15, status: "success", details: "Received cart payload from Shopify store #4820" },
      { stepNumber: 2, name: "Condition: Cart Value > ₹1,000", type: "condition", durationMs: 8, status: "success", details: "Cart Total: ₹3,499.00 (Passed filter)" },
      { stepNumber: 3, name: "Action: WhatsApp Template Dispatch", type: "action", durationMs: 285, status: "success", details: "Template: cart_recovery_v2 sent to +91 77539 83175" },
      { stepNumber: 4, name: "CRM: Tag Contact as 'Cart-Recovery-Sent'", type: "crm", durationMs: 32, status: "success", details: "Updated CRM contact tags successfully" },
    ],
  },
  {
    id: "WF-1093",
    name: "Welcome Onboarding & KYC Sequence",
    description: "Instant omnichannel welcome message and KYC documentation request.",
    triggerType: "Inbound Message",
    channel: "WhatsApp",
    totalRuns: 36400,
    successRuns: 36110,
    failedRuns: 290,
    avgDurationMs: 410,
    lastRunTime: "5 mins ago",
    status: "Active",
    executionSteps: [
      { stepNumber: 1, name: "Inbound: Keyword 'START'", type: "trigger", durationMs: 12, status: "success", details: "Customer initiated session via WhatsApp Official" },
      { stepNumber: 2, name: "Action: Send Interactive Menu", type: "action", durationMs: 340, status: "success", details: "Sent interactive quick reply buttons" },
      { stepNumber: 3, name: "CRM: Create Contact Record", type: "crm", durationMs: 58, status: "success", details: "Assigned lead score: 85" },
    ],
  },
  {
    id: "WF-1094",
    name: "Lead Qualification AI Agent",
    description: "Evaluates incoming inquiry intent, collects budget, and assigns to sales agent.",
    triggerType: "Inbound Message",
    channel: "Omnichannel",
    totalRuns: 24800,
    successRuns: 24230,
    failedRuns: 570,
    avgDurationMs: 620,
    lastRunTime: "12 mins ago",
    status: "Active",
    executionSteps: [
      { stepNumber: 1, name: "Inbound: Query Received", type: "trigger", durationMs: 10, status: "success", details: "Received lead query via Instagram Direct" },
      { stepNumber: 2, name: "Action: AI Intent Classifier", type: "action", durationMs: 510, status: "success", details: "Classified Intent: Enterprise Inquiry (Confidence: 0.94)" },
      { stepNumber: 3, name: "Action: Handover to Live Agent", type: "action", durationMs: 100, status: "success", details: "Assigned to Agent: Rohit Sharma (Desk #4)" },
    ],
  },
  {
    id: "WF-1095",
    name: "RCS OTP & Transactional Router",
    description: "Carrier verified high-delivery OTP with automatic DLT SMS fallback.",
    triggerType: "Webhook Event",
    channel: "RCS",
    totalRuns: 14200,
    successRuns: 14080,
    failedRuns: 120,
    avgDurationMs: 180,
    lastRunTime: "18 mins ago",
    status: "Active",
    executionSteps: [
      { stepNumber: 1, name: "Webhook: Request OTP", type: "trigger", durationMs: 8, status: "success", details: "Auth request for mobile +91 90546 18623" },
      { stepNumber: 2, name: "Action: Dispatch Verified RCS Card", type: "action", durationMs: 160, status: "success", details: "RCS Delivered via Jio Telecom Gateway" },
      { stepNumber: 3, name: "Condition: Delivery Ack Received", type: "condition", durationMs: 12, status: "success", details: "Delivery receipt confirmed within 180ms" },
    ],
  },
  {
    id: "WF-1096",
    name: "Daily Inactive Lead Re-engagement Cron",
    description: "Scheduled daily batch to re-engage leads inactive for > 14 days.",
    triggerType: "Scheduled Cron",
    channel: "WhatsApp",
    totalRuns: 6800,
    successRuns: 6515,
    failedRuns: 285,
    avgDurationMs: 890,
    lastRunTime: "1 hour ago",
    status: "Active",
    executionSteps: [
      { stepNumber: 1, name: "Schedule: Cron 09:00 AM UTC", type: "trigger", durationMs: 25, status: "success", details: "Batch query returned 250 matching contacts" },
      { stepNumber: 2, name: "Action: Bulk Template Dispatch", type: "action", durationMs: 820, status: "success", details: "Broadcast dispatched to queue" },
      { stepNumber: 3, name: "CRM: Update Last Contacted Date", type: "crm", durationMs: 45, status: "success", details: "Audit timestamps updated" },
    ],
  },
  {
    id: "WF-1097",
    name: "Instagram Story Mention Auto-Reply",
    description: "Monitors brand mentions in stories and sends immediate direct discount code.",
    triggerType: "Inbound Message",
    channel: "Instagram",
    totalRuns: 3400,
    successRuns: 3340,
    failedRuns: 60,
    avgDurationMs: 290,
    lastRunTime: "3 hours ago",
    status: "Paused",
    executionSteps: [
      { stepNumber: 1, name: "Webhook: IG Story Mention", type: "trigger", durationMs: 14, status: "success", details: "User @lifestyle_priya tagged brand in story" },
      { stepNumber: 2, name: "Action: Send Direct Message Promo", type: "action", durationMs: 260, status: "success", details: "Sent coupon INSTA15 to user DM" },
      { stepNumber: 3, name: "CRM: Increment Engagement Score", type: "crm", durationMs: 16, status: "success", details: "Engagement +10" },
    ],
  },
];

const trendVolumeData = [
  { date: "22 Aug", successful: 15420, failed: 210, latencyMs: 410 },
  { date: "23 Aug", successful: 16890, failed: 280, latencyMs: 395 },
  { date: "24 Aug", successful: 18240, failed: 310, latencyMs: 430 },
  { date: "25 Aug", successful: 17650, failed: 240, latencyMs: 405 },
  { date: "26 Aug", successful: 19800, failed: 390, latencyMs: 450 },
  { date: "27 Aug", successful: 21200, failed: 340, latencyMs: 425 },
  { date: "28 Aug", successful: 17195, failed: 285, latencyMs: 420 },
];

const triggerDistribution = [
  { name: "WhatsApp Inbound", value: 56500, color: "#10b981", percentage: 44 },
  { name: "Webhook Event", value: 35900, color: "#3b82f6", percentage: 28 },
  { name: "Form Submission", value: 17980, color: "#8b5cf6", percentage: 14 },
  { name: "Scheduled Cron", value: 11560, color: "#f59e0b", percentage: 9 },
  { name: "RCS Event", value: 6510, color: "#ec4899", percentage: 5 },
];

const topErrorCauses: ErrorCause[] = [
  {
    cause: "API Rate Limit / Quota Exceeded",
    count: 780,
    percentage: 38.0,
    severity: "high",
    suggestedAction: "Upgrade Meta Tier / Enable exponential backoff retry",
  },
  {
    cause: "Invalid Phone Number / Missing Country Code",
    count: 540,
    percentage: 26.3,
    severity: "medium",
    suggestedAction: "Enable CRM phone auto-sanitization rule",
  },
  {
    cause: "Webhook Timeout (> 5000ms)",
    count: 395,
    percentage: 19.2,
    severity: "medium",
    suggestedAction: "Optimize downstream HTTP endpoint latency",
  },
  {
    cause: "Template Content / Param Mismatch",
    count: 215,
    percentage: 10.5,
    severity: "low",
    suggestedAction: "Validate variable mappings before workflow publish",
  },
  {
    cause: "Channel Session Expired (> 24h window)",
    count: 125,
    percentage: 6.0,
    severity: "low",
    suggestedAction: "Switch to pre-approved utility template message",
  },
];

export default function AutomationAnalyticsPage() {
  // Filter States
  const [dateRange, setDateRange] = useState<string>("7d");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chartMetric, setChartMetric] = useState<"volume" | "latency">("volume");

  // Selected Workflow for Detailed Execution Logs Drawer/Modal
  const [inspectedWorkflow, setInspectedWorkflow] = useState<WorkflowMetric | null>(null);

  // Filtered workflows table
  const filteredWorkflows = useMemo(() => {
    return initialWorkflows.filter((wf) => {
      const matchesSearch =
        wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWorkflow =
        selectedWorkflow === "all" || wf.id === selectedWorkflow;

      const matchesStatus =
        statusFilter === "all" || wf.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesWorkflow && matchesStatus;
    });
  }, [searchQuery, selectedWorkflow, statusFilter]);

  // Export CSV Handler with Formula Injection Sanitization
  const handleExportLogsCsv = () => {
    const headers = [
      "Workflow ID",
      "Workflow Name",
      "Trigger Type",
      "Channel",
      "Total Runs",
      "Successful Runs",
      "Failed Runs",
      "Success Rate (%)",
      "Avg Duration (ms)",
      "Last Run",
      "Status",
    ];

    const rows = filteredWorkflows.map((wf) => [
      wf.id,
      wf.name,
      wf.triggerType,
      wf.channel,
      wf.totalRuns.toString(),
      wf.successRuns.toString(),
      wf.failedRuns.toString(),
      ((wf.successRuns / wf.totalRuns) * 100).toFixed(1) + "%",
      wf.avgDurationMs.toString(),
      wf.lastRunTime,
      wf.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ].join("\r\n");

    downloadCsv(`automation_analytics_${Date.now()}.csv`, csvContent);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link
            href="/automations/workflow"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Automations</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-primary font-semibold">Analytics</span>
        </div>

        {/* Title Bar & Quick Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
                Live Telemetry
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl">
              View and analyze your automation performance data, trigger latencies, and error diagnostics.
            </p>
          </div>

          {/* Action Button: Export Report */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogsCsv}
              className="text-xs h-9 font-medium gap-1.5 shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Execution Report</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Filter Bar (Date Range, Workflow Dropdown, Status) */}
      <div className="rounded-2xl border bg-card p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Range Presets */}
          <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg text-xs font-medium">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "month", label: "This Month" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDateRange(preset.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  dateRange === preset.id
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Workflow Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="h-8.5 rounded-lg border bg-card px-2.5 pr-7 text-xs text-foreground cursor-pointer font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Workflows</option>
              {initialWorkflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name} ({wf.id})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 rounded-lg border bg-card px-2.5 pr-7 text-xs text-foreground cursor-pointer font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time tracking active</span>
        </div>
      </div>

      {/* 3. Top KPI Metric Cards (4 Cards Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Executions */}
        <div className="rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlayCircle className="h-5 w-5" />
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-semibold gap-1">
              <TrendingUp className="h-3 w-3" />
              +24.6%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Total Executions</p>
          <p className="text-2xl font-extrabold text-foreground mt-0.5">
            128,450
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
            <span>Triggers across 14 active flows</span>
            <span className="font-semibold text-foreground">18.3k / day</span>
          </div>
        </div>

        {/* KPI 2: Success Rate */}
        <div className="rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-semibold">
              98.4% SLA
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Overall Success Rate</p>
          <p className="text-2xl font-extrabold text-foreground mt-0.5">
            98.4%
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">126,395 successful runs</span>
            <span>Target: &gt; 95%</span>
          </div>
        </div>

        {/* KPI 3: Failed Executions */}
        <div className="rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[11px] font-semibold gap-1">
              <TrendingDown className="h-3 w-3" />
              -0.4%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Failed Executions</p>
          <p className="text-2xl font-extrabold text-foreground mt-0.5">
            2,055
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">1.6% failure rate</span>
            <span>Rate limits / timeouts</span>
          </div>
        </div>

        {/* KPI 4: Avg Execution Time */}
        <div className="rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[11px] font-semibold">
              Ultra Fast
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">Avg Execution Time</p>
          <p className="text-2xl font-extrabold text-foreground mt-0.5">
            420 ms
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
            <span>P95 Latency: 890 ms</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">-45ms vs base</span>
          </div>
        </div>
      </div>

      {/* 4. Visualization Charts Section (3 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Main Trend Line/Area Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3.5">
            <div>
              <h2 className="text-base font-bold text-foreground">Execution Volume & Success Trend</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily throughput of automated executions across all connected channels.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/40 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartMetric("volume")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  chartMetric === "volume"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Volume Runs
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("latency")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  chartMetric === "latency"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Avg Latency (ms)
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === "volume" ? (
                <AreaChart data={trendVolumeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(val: any, name: any) => [
                      `${Number(val ?? 0).toLocaleString()} runs`,
                      name === "successful" ? "Successful" : "Failed",
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    name="Successful"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#successGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    name="Failed"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#failedGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={trendVolumeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} unit="ms" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`${val} ms`, "Average Duration"]}
                  />
                  <Bar dataKey="latencyMs" name="Avg Latency (ms)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Trigger Source Distribution (Donut Chart - 1 Col) */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs space-y-4">
          <div className="border-b pb-3.5">
            <h2 className="text-base font-bold text-foreground">Trigger Sources</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Breakdown of execution triggers by origin event.
            </p>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={triggerDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {triggerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${Number(val ?? 0).toLocaleString()} runs`, "Volume"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-foreground">128k</span>
              <span className="text-[10px] text-muted-foreground font-medium">Total Runs</span>
            </div>
          </div>

          {/* Trigger list breakdown */}
          <div className="space-y-1.5 pt-1 text-xs">
            {triggerDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-muted-foreground font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Failure Breakdown & Error Causes Section */}
      <div className="rounded-2xl border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Top Failure Causes & Diagnostics</h2>
              <p className="text-xs text-muted-foreground">
                Ranked breakdown of 2,055 failed automation steps with actionable remediation recommendations.
              </p>
            </div>
          </div>
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs">
            5 Distinct Error Types
          </Badge>
        </div>

        <div className="space-y-3 pt-1">
          {topErrorCauses.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl border bg-muted/15 space-y-2 hover:border-rose-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">#{index + 1}</span>
                  <span className="text-xs font-bold text-foreground">{item.cause}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase font-bold",
                      item.severity === "high"
                        ? "bg-rose-500/10 text-rose-600 border-rose-300"
                        : item.severity === "medium"
                        ? "bg-amber-500/10 text-amber-600 border-amber-300"
                        : "bg-blue-500/10 text-blue-600 border-blue-300"
                    )}
                  >
                    {item.severity} severity
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono font-bold text-foreground">{item.count} incidents</span>
                  <span className="font-mono font-semibold text-rose-600">({item.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Suggested Fix:</span>
                <span>{item.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Workflow Performance Breakdown Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-0">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b bg-muted/10 gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-9 text-xs bg-background"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              Showing {filteredWorkflows.length} of {initialWorkflows.length} workflows
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogsCsv}
              className="h-8 text-xs gap-1 shadow-xs"
            >
              <Download className="h-3 w-3" />
              Export Table
            </Button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground">
                  Workflow Name & ID
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground">
                  Trigger Type
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Total Runs
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Success / Failed
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground">
                  Success Rate
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Avg Duration
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground">
                  Last Run
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredWorkflows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                    No workflows match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkflows.map((wf) => {
                  const rate = ((wf.successRuns / wf.totalRuns) * 100).toFixed(1);
                  return (
                    <tr key={wf.id} className="hover:bg-muted/20 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {wf.channel === "WhatsApp" ? (
                            <WhatsAppIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : wf.channel === "Instagram" ? (
                            <InstagramIcon className="h-4 w-4 text-pink-600 shrink-0" />
                          ) : wf.channel === "RCS" ? (
                            <RCSIcon className="h-4 w-4 text-violet-600 shrink-0" />
                          ) : (
                            <Layers className="h-4 w-4 text-primary shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-foreground leading-snug">{wf.name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{wf.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Trigger Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] font-medium bg-muted/30">
                          {wf.triggerType}
                        </Badge>
                      </td>

                      {/* Total Runs */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-xs whitespace-nowrap">
                        {wf.totalRuns.toLocaleString("en-IN")}
                      </td>

                      {/* Success / Failed */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs whitespace-nowrap">
                        <span className="text-emerald-600 font-semibold">{wf.successRuns.toLocaleString()}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-rose-600 font-semibold">{wf.failedRuns.toLocaleString()}</span>
                      </td>

                      {/* Success Rate with progress bar */}
                      <td className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-foreground">{rate}%</span>
                            <span className="text-muted-foreground text-[10px]">SLA</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Avg Duration */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {wf.avgDurationMs} ms
                      </td>

                      {/* Last Run */}
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]">
                        {wf.lastRunTime}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setInspectedWorkflow(wf)}
                            className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1 px-2"
                          >
                            <Activity className="h-3.5 w-3.5" />
                            <span>Inspect Logs</span>
                          </Button>

                          <Link href="/automations/workflow">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View</span>
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border-t bg-muted/10 text-xs text-muted-foreground gap-3">
          <span>Displaying real-time execution statistics</span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" disabled className="h-7 text-xs px-2.5">
              Previous
            </Button>
            <Button size="sm" className="h-7 w-7 p-0 bg-primary text-primary-foreground font-semibold">
              1
            </Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-xs px-2.5">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: STEP-BY-STEP EXECUTION LOGS INSPECTOR               */}
      {/* ========================================================= */}
      {inspectedWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{inspectedWorkflow.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground">Execution Telemetry • {inspectedWorkflow.id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInspectedWorkflow(null)}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border bg-muted/20 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Total Executions</span>
                <span className="font-bold font-mono text-sm text-foreground">
                  {inspectedWorkflow.totalRuns.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Success Rate</span>
                <span className="font-bold font-mono text-sm text-emerald-600">
                  {((inspectedWorkflow.successRuns / inspectedWorkflow.totalRuns) * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Avg Latency</span>
                <span className="font-bold font-mono text-sm text-foreground">
                  {inspectedWorkflow.avgDurationMs} ms
                </span>
              </div>
            </div>

            {/* Step-by-Step Node Execution Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Step-by-Step Node Execution Sequence (Latest Run)
              </h4>

              <div className="space-y-2.5">
                {inspectedWorkflow.executionSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-xl border bg-card flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                          step.status === "success"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        )}
                      >
                        {step.stepNumber}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{step.name}</span>
                          <Badge variant="outline" className="text-[9px] uppercase">
                            {step.type}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">{step.details}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground block">
                        {step.durationMs} ms
                      </span>
                      <Badge
                        className={cn(
                          "text-[9px] font-bold mt-0.5",
                          step.status === "success"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        )}
                      >
                        {step.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-[11px] text-muted-foreground">
                Triggered: {inspectedWorkflow.lastRunTime}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectedWorkflow(null)}
                  className="text-xs h-8"
                >
                  Close
                </Button>
                <Link href="/automations/workflow">
                  <Button size="sm" className="text-xs h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open in Workflow Builder</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}