"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Wallet,
  CreditCard,
  Download,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  Search,
  X,
  FileText,
  Receipt,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  Check,
  Building,
  Info,
  SlidersHorizontal,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Phone,
  Copy,
  Calendar,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChannelTransaction,
  ChannelAccountDetails,
  ConversationCategory,
  DateFilterPreset,
  TransactionType,
} from "@/types/channel-balance";
import {
  DEFAULT_WHATSAPP_ACCOUNT,
  INITIAL_CHANNEL_TRANSACTIONS,
  getChannelAccountData,
  saveChannelAccountData,
  getChannelTransactions,
  saveChannelTransactions,
  formatCurrency4,
  formatCurrency2,
  CATEGORY_BADGE_STYLES,
} from "@/lib/channel-balance";
import { TransactionDetailsDrawer } from "./TransactionDetailsDrawer";
import { RechargeTopUpModal } from "./RechargeTopUpModal";
import { StatementInvoiceModal } from "./StatementInvoiceModal";
import { downloadCsv, escapeCsvField } from "@/components/crm/csv-utils";
import { WhatsAppIcon } from "@/components/landing/channel-icons";
import { cn } from "@/lib/utils";

interface ChannelBalanceOverviewProps {
  channelId?: string;
}

export function ChannelBalanceOverview({ channelId = "1" }: ChannelBalanceOverviewProps) {
  // Account State
  const [account, setAccount] = useState<ChannelAccountDetails>(() =>
    getChannelAccountData(channelId)
  );
  const [transactions, setTransactions] = useState<ChannelTransaction[]>(() =>
    getChannelTransactions(channelId)
  );

  // Live Sync State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncText, setLastSyncText] = useState<string>("Just now");

  // Filter State
  const [datePreset, setDatePreset] = useState<DateFilterPreset>("THIS_MONTH");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [campaignFilter, setCampaignFilter] = useState<string>("ALL");
  const [txnTypeFilter, setTxnTypeFilter] = useState<"ALL" | "DEBIT" | "CREDIT" | "REFUND">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | ConversationCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Drawers
  const [selectedTxnForDrawer, setSelectedTxnForDrawer] = useState<ChannelTransaction | null>(null);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false);
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);

  // Sync listener
  useEffect(() => {
    const handleAccountUpdate = () => {
      setAccount(getChannelAccountData(channelId));
    };
    const handleTxnUpdate = () => {
      setTransactions(getChannelTransactions(channelId));
    };

    window.addEventListener("channel-balance-updated", handleAccountUpdate);
    window.addEventListener("channel-transactions-updated", handleTxnUpdate);
    return () => {
      window.removeEventListener("channel-balance-updated", handleAccountUpdate);
      window.removeEventListener("channel-transactions-updated", handleTxnUpdate);
    };
  }, [channelId]);

  // Unique campaigns list for filter dropdown
  const availableCampaigns = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.campaignName) set.add(t.campaignName);
    });
    return Array.from(set);
  }, [transactions]);

  // Filter Transactions Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // 1. Transaction Type filter
      if (txnTypeFilter !== "ALL" && t.type !== txnTypeFilter) {
        return false;
      }

      // 2. Category filter
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) {
        return false;
      }

      // 3. Campaign filter
      if (campaignFilter !== "ALL" && t.campaignName !== campaignFilter) {
        return false;
      }

      // 4. Search query filter (Transaction ID, recipient phone, description, campaign)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchPhone = t.recipientPhone?.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchCamp = t.campaignName?.toLowerCase().includes(q);
        const matchMeta = t.metaBillingId?.toLowerCase().includes(q);
        if (!matchId && !matchPhone && !matchDesc && !matchCamp && !matchMeta) {
          return false;
        }
      }

      // 5. Date preset filter
      const txnDate = new Date(t.timestamp);
      const now = new Date();
      if (datePreset === "TODAY") {
        const isSameDay =
          txnDate.getDate() === now.getDate() &&
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear();
        if (!isSameDay) return false;
      } else if (datePreset === "YESTERDAY") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday =
          txnDate.getDate() === yesterday.getDate() &&
          txnDate.getMonth() === yesterday.getMonth() &&
          txnDate.getFullYear() === yesterday.getFullYear();
        if (!isYesterday) return false;
      } else if (datePreset === "LAST_7_DAYS") {
        const diffDays = (now.getTime() - txnDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (datePreset === "LAST_30_DAYS") {
        const diffDays = (now.getTime() - txnDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      } else if (datePreset === "THIS_MONTH") {
        if (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (datePreset === "CUSTOM" && customStartDate && customEndDate) {
        const start = new Date(customStartDate).getTime();
        const end = new Date(customEndDate).getTime() + 24 * 3600 * 1000;
        if (txnDate.getTime() < start || txnDate.getTime() > end) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    txnTypeFilter,
    categoryFilter,
    campaignFilter,
    searchQuery,
    datePreset,
    customStartDate,
    customEndDate,
  ]);

  // Reactive Summary Metrics Calculation
  const summaryMetrics = useMemo(() => {
    let totalSpend = 0;
    let totalUnits = 0;
    let totalCredits = 0;
    let refundCount = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === "DEBIT") {
        totalSpend += t.amount;
        totalUnits += t.unitCount || 1;
      } else if (t.type === "CREDIT" && t.category === "TOPUP") {
        totalCredits += t.amount;
      } else if (t.type === "REFUND") {
        refundCount += 1;
      }
    });

    const averageCostPerUnit = totalUnits > 0 ? totalSpend / totalUnits : 0;

    return {
      totalSpend,
      totalUnits,
      averageCostPerUnit,
      totalCredits,
      refundCount,
    };
  }, [filteredTransactions]);

  // Live Sync Action
  const handleLiveSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const syncedAccount: ChannelAccountDetails = {
        ...account,
        lastSyncedAt: new Date().toISOString(),
      };
      setAccount(syncedAccount);
      saveChannelAccountData(channelId, syncedAccount);
      setIsSyncing(false);
      setLastSyncText("Just now");
    }, 750);
  };

  // Perform Recharge Action
  const handleConfirmRecharge = async (amount: number, paymentMethod: string) => {
    const newBal = account.currentBalance + amount;
    const updatedAccount: ChannelAccountDetails = {
      ...account,
      currentBalance: newBal,
      lastSyncedAt: new Date().toISOString(),
    };

    const newTxn: ChannelTransaction = {
      id: `TXN_WA_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      description: `Wallet Top-up - ${paymentMethod.toUpperCase()} Instant Payment`,
      channel: "whatsapp",
      category: "TOPUP",
      type: "CREDIT",
      unitCount: 1,
      unitRate: amount,
      amount,
      closingBalance: newBal,
      deliveryStatus: "COMPLETED",
      recipientPhone: account.phoneNumber,
      metaBillingId: `pay_Rzp_${Date.now()}`,
      wabaId: account.wabaId,
      messagePayloadSnippet: `Prepaid funds added to ${account.name} wallet via ${paymentMethod.toUpperCase()}.`,
    };

    const updatedTxns = [newTxn, ...transactions];
    setAccount(updatedAccount);
    setTransactions(updatedTxns);
    saveChannelAccountData(channelId, updatedAccount);
    saveChannelTransactions(channelId, updatedTxns);
  };

  // Copy ID feedback
  const handleCopyTxnId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedTxnId(id);
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "Transaction ID",
      "Timestamp",
      "Description",
      "Campaign",
      "Category",
      "Type",
      "Unit Count",
      "Rate (INR)",
      "Amount (INR)",
      "Closing Balance (INR)",
      "Recipient Phone",
      "Delivery Status",
      "Meta Reference ID",
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      new Date(t.timestamp).toLocaleString("en-IN"),
      t.description,
      t.campaignName || "Direct Chat",
      t.category,
      t.type,
      t.unitCount,
      t.unitRate.toFixed(4),
      t.amount.toFixed(4),
      t.closingBalance.toFixed(4),
      t.recipientPhone,
      t.deliveryStatus,
      t.metaBillingId || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map(escapeCsvField).join(",")),
    ].join("\r\n");

    downloadCsv(`channel_ledger_${account.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`, csvContent);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setDatePreset("THIS_MONTH");
    setCampaignFilter("ALL");
    setTxnTypeFilter("ALL");
    setCategoryFilter("ALL");
    setSearchQuery("");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Breadcrumbs */}
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
            className="font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            WhatsApp Channels
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-primary font-semibold">Channel Balance & Ledger</span>
        </div>

        {/* Title & Channel Badge Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl border bg-card shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20">
              <WhatsAppIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {account.name}
                </h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified WhatsApp Cloud API</span>
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                  {account.wabaId}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span className="font-mono font-medium text-foreground">{account.phoneNumber}</span>
                <span>•</span>
                <span>Quality Score: <strong className="text-emerald-600">{account.qualityScore}</strong></span>
              </p>
            </div>
          </div>

          {/* Right Side: Available Balance Box & Quick Actions */}
          <div className="flex items-center gap-3 self-start lg:self-auto bg-muted/30 p-3 rounded-xl border">
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Available Channel Balance
              </span>
              <p className="text-2xl font-extrabold font-mono text-foreground tracking-tight">
                {formatCurrency4(account.currentBalance)} <span className="text-xs font-normal text-muted-foreground">INR</span>
              </p>
              <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                <Clock className="h-2.5 w-2.5" />
                <span>Synced {lastSyncText}</span>
              </span>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0 pl-2 border-l">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleLiveSync}
                disabled={isSyncing}
                className="h-7 text-xs px-2.5 gap-1 shadow-2xs"
              >
                <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin text-primary")} />
                <span>{isSyncing ? "Syncing..." : "Sync Live"}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsRechargeModalOpen(true)}
                className="h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-xs"
              >
                <Plus className="h-3 w-3" />
                <span>+ Recharge</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Summary Cards (3 Dynamic Cards reacting to filters) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Spend */}
        <div className="rounded-2xl border bg-card p-4 transition-all hover:shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Spend (Filtered Period)
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground mt-1">
            {formatCurrency4(summaryMetrics.totalSpend)}
          </p>
          <span className="text-[11px] text-muted-foreground block pt-1 border-t">
            Across {filteredTransactions.filter((t) => t.type === "DEBIT").length} billable transactions
          </span>
        </div>

        {/* Card 2: Total Paid Messages/Conversations */}
        <div className="rounded-2xl border bg-card p-4 transition-all hover:shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Billable Conversations
            </span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1">
            {summaryMetrics.totalUnits.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">sessions</span>
          </p>
          <span className="text-[11px] text-muted-foreground block pt-1 border-t">
            Marketing, Utility, Auth & 24h Windows
          </span>
        </div>

        {/* Card 3: Average Cost Per Conversation */}
        <div className="rounded-2xl border bg-card p-4 transition-all hover:shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Average Cost Per Conversation
            </span>
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground mt-1">
            {formatCurrency4(summaryMetrics.averageCostPerUnit)} <span className="text-xs font-normal text-muted-foreground">/ session</span>
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block pt-1 border-t">
            Meta Cloud Tier 1 Rate Optimized
          </span>
        </div>
      </div>

      {/* 3. 24-Hour Auto-Refund Guarantee Banner */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <p className="font-bold text-foreground">
              Carrier 24-Hour Auto-Refund Protection Active
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Messages failing carrier delivery within 24 hours are automatically credited back to your balance with a transparent audit trail.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto text-[10px] shrink-0">
          Zero-Loss Guarantee
        </Badge>
      </div>

      {/* 4. Multi-Filter & Search Bar */}
      <div className="rounded-2xl border bg-card p-4 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Transaction Ledger Filters</h3>
          </div>

          <div className="flex items-center gap-2">
            {(searchQuery || campaignFilter !== "ALL" || txnTypeFilter !== "ALL" || categoryFilter !== "ALL" || datePreset !== "THIS_MONTH") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" /> Reset Filters
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatementModalOpen(true)}
              className="h-8 text-xs gap-1.5 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Statement</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search ID, phone, campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date Range Selector */}
          <div>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as DateFilterPreset)}
              className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="THIS_MONTH">This Month (Aug 2026)</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="CUSTOM">Custom Date Range</option>
            </select>
          </div>

          {/* Campaign Filter */}
          <div>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="ALL">All Campaigns ({availableCampaigns.length})</option>
              {availableCampaigns.map((camp) => (
                <option key={camp} value={camp}>
                  {camp}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div>
            <select
              value={txnTypeFilter}
              onChange={(e) => setTxnTypeFilter(e.target.value as any)}
              className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="ALL">All Transactions</option>
              <option value="DEBIT">Usage Deductions (Debits)</option>
              <option value="CREDIT">Wallet Top-ups (Credits)</option>
              <option value="REFUND">Refunds & Adjustments</option>
            </select>
          </div>

          {/* Message Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full h-8 px-2.5 rounded-lg border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="ALL">All Message Categories</option>
              <option value="MARKETING">Marketing (Promotional)</option>
              <option value="UTILITY">Utility (Order updates, alerts)</option>
              <option value="AUTHENTICATION">Authentication (OTPs)</option>
              <option value="SERVICE">Service (24h Support)</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Row */}
        {datePreset === "CUSTOM" && (
          <div className="flex items-center gap-2 pt-2 border-t text-xs">
            <span className="text-muted-foreground">From:</span>
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="h-8 w-40 text-xs bg-background"
            />
            <span className="text-muted-foreground">To:</span>
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-8 w-40 text-xs bg-background"
            />
          </div>
        )}
      </div>

      {/* 5. Granular Transaction History Ledger (Data Table) */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-0">
        <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Transaction Audit Ledger</h3>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {filteredTransactions.length} records
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>High-precision (4 decimals)</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-7 text-xs gap-1 shadow-2xs"
            >
              <FileSpreadsheet className="h-3 w-3" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Responsive Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3">Date & Timestamp</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Description / Campaign</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Unit Count</th>
                <th className="px-4 py-3 text-right">Unit Rate</th>
                <th className="px-4 py-3 text-right">Debit / Credit</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
                <th className="px-4 py-3 text-center">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground text-xs">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground">No Transactions Found</p>
                    <p className="text-[11px] mt-0.5">
                      No records matched your active filter criteria. Try resetting the search or date range.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="mt-3 h-7 text-xs"
                    >
                      Reset All Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => {
                  const categoryConfig = CATEGORY_BADGE_STYLES[item.category] || {
                    label: item.category,
                    style: "bg-muted text-muted-foreground",
                  };
                  const isDebit = item.type === "DEBIT";
                  const isCredit = item.type === "CREDIT";
                  const isRefund = item.type === "REFUND";

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedTxnForDrawer(item)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      {/* 1. Date & Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-foreground">
                          {new Date(item.timestamp).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {new Date(item.timestamp).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </td>

                      {/* 2. Transaction ID (with copy) */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                            {item.id}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyTxnId(item.id, e)}
                            title="Copy ID"
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          >
                            {copiedTxnId === item.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. Description / Campaign & Recipient */}
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-foreground truncate">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                          {item.campaignName && (
                            <span className="font-semibold text-primary">[{item.campaignName}]</span>
                          )}
                          <span className="font-mono">{item.recipientPhone}</span>
                          {item.recipientName && <span>({item.recipientName})</span>}
                        </p>
                      </td>

                      {/* 4. Conversation Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-medium", categoryConfig.style)}
                        >
                          {categoryConfig.label}
                        </Badge>
                      </td>

                      {/* 5. Message / Unit Count */}
                      <td className="px-4 py-3 text-center whitespace-nowrap font-mono">
                        <span className="bg-muted px-2 py-0.5 rounded text-[11px] font-semibold text-foreground">
                          {item.unitCount} {item.category === "TOPUP" ? "txn" : "session"}
                        </span>
                      </td>

                      {/* 6. Rate / Cost per Unit */}
                      <td className="px-4 py-3 text-right font-mono whitespace-nowrap text-muted-foreground">
                        {formatCurrency4(item.unitRate)}
                      </td>

                      {/* 7. Debit / Credit Amount */}
                      <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            isDebit
                              ? "text-rose-600 dark:text-rose-400"
                              : isRefund
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {isDebit ? "-" : "+"} {formatCurrency4(item.amount)}
                        </span>
                      </td>

                      {/* 8. Closing Balance */}
                      <td className="px-4 py-3 text-right font-mono font-semibold text-foreground whitespace-nowrap">
                        {formatCurrency4(item.closingBalance)}
                      </td>

                      {/* 9. Delivery Status */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {item.deliveryStatus === "DELIVERED" || item.deliveryStatus === "READ" ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {item.deliveryStatus}
                            </Badge>
                          ) : item.deliveryStatus === "FAILED" ? (
                            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                              <XCircle className="h-3 w-3 mr-1" />
                              {item.isAutoRefunded ? "Failed (Refunded)" : "Failed"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.deliveryStatus}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-Over Inspection Drawer */}
      <TransactionDetailsDrawer
        isOpen={!!selectedTxnForDrawer}
        onClose={() => setSelectedTxnForDrawer(null)}
        transaction={selectedTxnForDrawer}
        onViewRefundTxn={(refundId) => {
          const found = transactions.find((t) => t.id === refundId);
          if (found) setSelectedTxnForDrawer(found);
        }}
      />

      {/* Recharge Modal */}
      <RechargeTopUpModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        channelName={account.name}
        phoneNumber={account.phoneNumber}
        currentBalance={account.currentBalance}
        onConfirmRecharge={handleConfirmRecharge}
      />

      {/* Statement & Invoices Modal */}
      <StatementInvoiceModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        channelName={account.name}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}
