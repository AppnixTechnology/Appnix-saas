"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bell,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  CheckCheck,
  Search,
  Filter,
  Send,
  MessageSquare,
  Zap,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Settings,
  Info,
  Calendar,
  Sparkles,
  Inbox,
} from "lucide-react";

export type NotificationCategory =
  | "all"
  | "unread"
  | "campaign"
  | "crm"
  | "automation"
  | "billing"
  | "security";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: "campaign" | "crm" | "automation" | "billing" | "security";
  timestamp: string;
  date: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  severity?: "info" | "success" | "warning" | "error";
}

const initialNotifications: AppNotification[] = [
  {
    id: "notif-001",
    title: "Meta WhatsApp Campaign Completed",
    description: "Your bulk campaign 'Spring Flash Sale 2026' was successfully dispatched to 12,450 recipients with a 98.4% delivery rate.",
    category: "campaign",
    timestamp: "10 minutes ago",
    date: "24 Feb 2026, 11:45 AM",
    read: false,
    severity: "success",
    actionUrl: "/crm/campaigns",
    actionLabel: "View Campaign Analytics",
  },
  {
    id: "notif-002",
    title: "High Priority Customer Escalation",
    description: "Lead 'Nourin Sodawala' requested live human agent assistance on WhatsApp Live Chat.",
    category: "crm",
    timestamp: "45 minutes ago",
    date: "24 Feb 2026, 11:10 AM",
    read: false,
    severity: "warning",
    actionUrl: "/crm/live-chat",
    actionLabel: "Open Live Chat",
  },
  {
    id: "notif-003",
    title: "Wallet Top-up Successful",
    description: "Your workspace wallet was recharged with ₹5,000 via UPI / Instant NetBanking. Current balance: ₹12,450.",
    category: "billing",
    timestamp: "2 hours ago",
    date: "24 Feb 2026, 09:30 AM",
    read: false,
    severity: "success",
    actionUrl: "/workspace/wallet",
    actionLabel: "View Wallet Ledger",
  },
  {
    id: "notif-004",
    title: "New Automation Trigger Failure",
    description: "Botflow 'Lead Intake Webhook' encountered a timeout with endpoint https://api.crm-sync.internal/v1/lead.",
    category: "automation",
    timestamp: "5 hours ago",
    date: "24 Feb 2026, 06:40 AM",
    read: true,
    severity: "error",
    actionUrl: "/automations/workflow",
    actionLabel: "Inspect Botflow",
  },
  {
    id: "notif-005",
    title: "New Login from Chrome on Windows",
    description: "New sign-in detected from IP 103.21.124.89 (Mumbai, India). If this wasn't you, revoke session immediately.",
    category: "security",
    timestamp: "1 day ago",
    date: "23 Feb 2026, 02:15 PM",
    read: true,
    severity: "info",
    actionUrl: "/settings/security",
    actionLabel: "Review Security Sessions",
  },
  {
    id: "notif-006",
    title: "Template 'Festive Offer' Approved by Meta",
    description: "Your WhatsApp utility marketing template 'festive_offer_v2' has been approved and is ready for broadcast.",
    category: "campaign",
    timestamp: "2 days ago",
    date: "22 Feb 2026, 04:30 PM",
    read: true,
    severity: "success",
    actionUrl: "/crm/bulk-campaign",
    actionLabel: "Launch Broadcast",
  },
  {
    id: "notif-007",
    title: "Support Ticket Resolved (#SUP-10245)",
    description: "Technical Support resolved ticket: 'Webhook response signature verification mismatch'.",
    category: "crm",
    timestamp: "3 days ago",
    date: "21 Feb 2026, 11:00 AM",
    read: true,
    severity: "info",
    actionUrl: "/workspace/support",
    actionLabel: "View Ticket",
  },
  {
    id: "notif-008",
    title: "Monthly Pro Tier Subscription Renewed",
    description: "Invoice #INV-2026-081 for ₹2,999 has been generated and paid successfully via Visa •••• 4018.",
    category: "billing",
    timestamp: "6 days ago",
    date: "18 Feb 2026, 08:00 AM",
    read: true,
    severity: "info",
    actionUrl: "/workspace/billing",
    actionLabel: "Download Invoice",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearRead = () => {
    setNotifications(notifications.filter((n) => !n.read));
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === "unread") return !n.read;
    if (activeCategory !== "all") return n.category === activeCategory;
    return true;
  });

  const getCategoryIcon = (category: AppNotification["category"]) => {
    switch (category) {
      case "campaign":
        return <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "crm":
        return <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "automation":
        return <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "billing":
        return <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case "security":
        return <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryBadge = (category: AppNotification["category"]) => {
    switch (category) {
      case "campaign":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold">Campaign</Badge>;
      case "crm":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-semibold">CRM & Chat</Badge>;
      case "automation":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-semibold">Automation</Badge>;
      case "billing":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-semibold">Billing</Badge>;
      case "security":
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-semibold">Security</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Breadcrumb Back Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Notifications</span>
      </nav>

      {/* 45-Day Retention Notice Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300 flex items-start gap-3 shadow-xs">
        <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-bold text-sm">
            45-Day Retention Policy Notice
          </p>
          <p className="mt-0.5 text-amber-700 dark:text-amber-400/90 leading-relaxed">
            All notifications, broadcast dispatch alerts, and webhook event logs are automatically archived and removed after <strong>45 days</strong>. Export any critical records or audit trails prior to expiry.
          </p>
        </div>
        <Link
          href="/settings/notifications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline shrink-0 self-center hidden sm:flex"
        >
          <Settings className="h-3.5 w-3.5" />
          Preferences
        </Link>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notifications & Activity Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View realtime alerts across campaigns, customer chat triggers, bot automations, and security logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              Mark All as Read
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearRead}
            className="text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Read
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border rounded-xl bg-card p-3 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All", count: notifications.length },
            { id: "unread", label: "Unread", count: unreadCount },
            { id: "campaign", label: "Campaigns", count: notifications.filter((n) => n.category === "campaign").length },
            { id: "crm", label: "CRM & Chat", count: notifications.filter((n) => n.category === "crm").length },
            { id: "automation", label: "Automations", count: notifications.filter((n) => n.category === "automation").length },
            { id: "billing", label: "Billing", count: notifications.filter((n) => n.category === "billing").length },
            { id: "security", label: "Security", count: notifications.filter((n) => n.category === "security").length },
          ].map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as NotificationCategory)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Notification Stream List */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden divide-y divide-border/60">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">No notifications found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? "No notifications matching your search query."
                  : activeCategory === "unread"
                  ? "All caught up! You have zero unread notifications."
                  : "There are no notifications in this category."}
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "p-4 sm:p-5 flex items-start gap-4 transition-colors group hover:bg-accent/40",
                !n.read ? "bg-primary/5 dark:bg-primary/5" : ""
              )}
            >
              {/* Category Icon */}
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-border/50",
                  n.category === "campaign" && "bg-emerald-50 dark:bg-emerald-950/50",
                  n.category === "crm" && "bg-blue-50 dark:bg-blue-950/50",
                  n.category === "automation" && "bg-amber-50 dark:bg-amber-950/50",
                  n.category === "billing" && "bg-indigo-50 dark:bg-indigo-950/50",
                  n.category === "security" && "bg-rose-50 dark:bg-rose-950/50"
                )}
              >
                {getCategoryIcon(n.category)}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={cn("text-sm font-bold text-foreground", !n.read && "text-primary")}>
                      {n.title}
                    </h3>
                    {getCategoryBadge(n.category)}
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary inline-block" title="Unread" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {n.timestamp} • {n.date}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {n.description}
                </p>

                {/* Actions Row */}
                <div className="flex items-center gap-3 pt-2">
                  {n.actionUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-7 text-[11px] gap-1 px-2.5 font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Link href={n.actionUrl}>
                        <span>{n.actionLabel || "View Details"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}

                  <button
                    onClick={() => handleToggleRead(n.id)}
                    className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {n.read ? "Mark as unread" : "Mark as read"}
                  </button>

                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete notification"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
