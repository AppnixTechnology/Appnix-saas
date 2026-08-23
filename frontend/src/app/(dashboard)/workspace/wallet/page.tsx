"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Zap,
  TrendingUp,
  X,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  type: "Recharge" | "Usage" | "Subscription" | "Refund";
  description: string;
  channel: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
}

const initialTransactions: Transaction[] = [
  {
    id: "TXN-90481",
    date: "24 Feb 2026, 11:30 AM",
    type: "Recharge",
    description: "UPI Instant Wallet Top-up",
    channel: "Payment Gateway",
    amount: 5000,
    status: "Success",
  },
  {
    id: "TXN-90480",
    date: "24 Feb 2026, 10:15 AM",
    type: "Usage",
    description: "Spring Promo WhatsApp Bulk Broadcast (1,240 msg)",
    channel: "WhatsApp API",
    amount: -482.4,
    status: "Success",
  },
  {
    id: "TXN-90479",
    date: "22 Feb 2026, 06:20 PM",
    type: "Usage",
    description: "Abandoned Cart RCS Messaging (820 msg)",
    channel: "RCS Messaging",
    amount: -246.0,
    status: "Success",
  },
  {
    id: "TXN-90478",
    date: "18 Feb 2026, 12:00 AM",
    type: "Subscription",
    description: "Professional Plan Monthly Renewal",
    channel: "Credit Card",
    amount: -2999.0,
    status: "Success",
  },
  {
    id: "TXN-90477",
    date: "15 Feb 2026, 04:45 PM",
    type: "Recharge",
    description: "NetBanking Corporate Top-up",
    channel: "HDFC Bank",
    amount: 10000,
    status: "Success",
  },
  {
    id: "TXN-90476",
    date: "12 Feb 2026, 02:10 PM",
    type: "Usage",
    description: "AI Voice Bot Inbound Minutes (120 min)",
    channel: "Voice AI Agent",
    amount: -360.0,
    status: "Success",
  },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(14850.5);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("5000");

  const filteredTransactions = transactions.filter((t) =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(topUpAmount) || 0;
    if (amountVal <= 0) return;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: "Just now",
      type: "Recharge",
      description: "Wallet Instant Top-up",
      channel: "UPI / NetBanking",
      amount: amountVal,
      status: "Success",
    };

    setBalance((prev) => prev + amountVal);
    setTransactions([newTxn, ...transactions]);
    setIsTopUpModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Workspace</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Wallet & Transactions</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Wallet & Transactions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your messaging balance, auto-recharge rules, and billing transaction history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsTopUpModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Top Up Balance
          </Button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Available Wallet Balance</p>
          <p className="text-2xl font-extrabold mt-0.5 text-foreground">
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Sufficient for ~32k messages
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Monthly Spend</p>
          <p className="text-2xl font-extrabold mt-0.5 text-foreground">₹4,087.40</p>
          <p className="text-xs text-muted-foreground mt-1">
            Across WhatsApp, RCS, & Voice AI
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-3">
            <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-muted-foreground">Auto-Recharge</p>
          <p className="text-2xl font-extrabold mt-0.5 text-foreground">Enabled</p>
          <p className="text-xs text-muted-foreground mt-1">
            Triggers when balance &lt; ₹500
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-3">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs text-muted-foreground">Default Payment Method</p>
          <p className="text-2xl font-extrabold mt-0.5 text-foreground">HDFC •••• 4018</p>
          <p className="text-xs text-muted-foreground mt-1">
            Auto-debit verified
          </p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/20">
          <div>
            <h2 className="font-bold text-sm text-foreground">Transaction Log & Invoices</h2>
            <p className="text-xs text-muted-foreground">
              Detailed ledger of top-ups, channel usage deductions, and subscription fees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-8 text-xs bg-background"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Exporting transaction CSV...")}
              className="text-xs gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left">Transaction ID</th>
                <th className="p-3.5 text-left">Date & Time</th>
                <th className="p-3.5 text-left">Type</th>
                <th className="p-3.5 text-left">Description</th>
                <th className="p-3.5 text-left">Channel / Method</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => {
                const isPositive = txn.amount > 0;
                return (
                  <tr key={txn.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-mono text-xs font-semibold text-foreground">
                      {txn.id}
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {txn.date}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-semibold",
                          txn.type === "Recharge" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                          txn.type === "Usage" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                          txn.type === "Subscription" && "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        )}
                      >
                        {txn.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-xs text-foreground max-w-72 truncate">
                      {txn.description}
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      {txn.channel}
                    </td>
                    <td className={cn(
                      "p-3.5 text-right font-semibold text-xs whitespace-nowrap",
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                    )}>
                      {isPositive ? `+₹${txn.amount.toFixed(2)}` : `-₹${Math.abs(txn.amount).toFixed(2)}`}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => alert(`Downloading invoice for ${txn.id}`)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Download Invoice"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-foreground">Top Up Wallet Balance</h2>
              <button
                onClick={() => setIsTopUpModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Select Pre-set Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["1000", "5000", "10000", "25000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={cn(
                        "p-2 rounded-lg border text-xs font-semibold transition-all",
                        topUpAmount === amt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      ₹{parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Custom Amount (INR)
                </label>
                <Input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="h-9"
                  min="100"
                />
              </div>

              <div className="p-3 border rounded-lg bg-muted/20 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Payment Gateways Supported</p>
                <p>UPI (GPay / PhonePe / Paytm), Credit / Debit Cards, NetBanking.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTopUpModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Proceed to Pay ₹{parseFloat(topUpAmount || "0").toLocaleString()}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
