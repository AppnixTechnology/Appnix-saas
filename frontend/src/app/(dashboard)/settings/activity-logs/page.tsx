"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  History,
  Search,
  Download,
  Filter,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  status: "Success" | "Warning" | "Failed";
}

const initialLogs: ActivityLog[] = [
  {
    id: "act-101",
    timestamp: "24 Feb 2026, 11:32 AM",
    user: "Video Panel (Admin)",
    action: "Updated WhatsApp webhook URL",
    module: "Settings > Integrations",
    ip: "103.21.124.89",
    status: "Success",
  },
  {
    id: "act-102",
    timestamp: "24 Feb 2026, 10:15 AM",
    user: "Video Panel (Admin)",
    action: "Raised Support Ticket #SUP-10245",
    module: "Workspace > Support",
    ip: "103.21.124.89",
    status: "Success",
  },
  {
    id: "act-103",
    timestamp: "24 Feb 2026, 09:40 AM",
    user: "Priya Sharma",
    action: "Created bulk campaign 'Spring Promo 2026'",
    module: "CRM > Bulk Campaign",
    ip: "49.207.210.15",
    status: "Success",
  },
  {
    id: "act-104",
    timestamp: "23 Feb 2026, 08:30 PM",
    user: "System Automations",
    action: "Dispatched automated WhatsApp template batch (1,240 msg)",
    module: "Channels > WhatsApp",
    ip: "Internal (Worker 04)",
    status: "Success",
  },
  {
    id: "act-105",
    timestamp: "23 Feb 2026, 02:15 PM",
    user: "Aman Gupta",
    action: "Modified Department Role permissions for 'Support Agent'",
    module: "Department > Roles",
    ip: "103.21.124.91",
    status: "Warning",
  },
  {
    id: "act-106",
    timestamp: "22 Feb 2026, 11:20 AM",
    user: "Unknown Client",
    action: "Failed login attempt (Invalid password)",
    module: "Auth > Sign In",
    ip: "185.220.101.5",
    status: "Failed",
  },
  {
    id: "act-107",
    timestamp: "20 Feb 2026, 04:00 PM",
    user: "Video Panel (Admin)",
    action: "Recharged wallet with ₹5,000 via UPI",
    module: "Workspace > Wallet",
    ip: "103.21.124.89",
    status: "Success",
  },
];

export default function ActivityLogsSettingsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Settings</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">Activity Logs</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Audit & Activity Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete audit trail of user actions, authentication events, API interactions, and configuration updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Exporting Activity Logs CSV...")}
          className="text-xs gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export Audit Trail
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between border rounded-xl bg-card p-3 shadow-xs">
        <div className="relative w-72 max-w-full">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search activity by action or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-8 text-xs bg-background"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filteredLogs.length} event{filteredLogs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left">Date & Time</th>
                <th className="p-3.5 text-left">User</th>
                <th className="p-3.5 text-left min-w-56">Action Description</th>
                <th className="p-3.5 text-left">Module Scope</th>
                <th className="p-3.5 text-left">IP / Origin</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30 text-xs transition-colors">
                  <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5 font-semibold text-foreground whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="p-3.5 text-foreground font-medium">
                    {log.action}
                  </td>
                  <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="p-3.5 font-mono text-muted-foreground whitespace-nowrap">
                    {log.ip}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-semibold gap-1",
                        log.status === "Success" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        log.status === "Warning" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                        log.status === "Failed" && "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      )}
                    >
                      {log.status === "Success" && <CheckCircle2 className="h-3 w-3" />}
                      {log.status === "Warning" && <AlertTriangle className="h-3 w-3" />}
                      {log.status === "Failed" && <XCircle className="h-3 w-3" />}
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
