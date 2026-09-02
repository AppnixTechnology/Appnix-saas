"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { clientService, analyticsService } from "@/super-admin/services";
import { AddClientModal } from "@/super-admin/components/clients/AddClientModal";
import {
  TrendingUp,
  Plus,
  Zap,
  LifeBuoy,
  CreditCard,
  Building2,
  Calendar,
  ArrowRight,
  HardDrive,
  ShieldAlert,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export default function SuperAdminDashboardPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalClientsCount, setTotalClientsCount] = useState(2481);

  useEffect(() => {
    analyticsService.getGrowthChartData().then(setChartData);
    clientService.getAll().then((clients) => {
      if (clients.length > 0) {
        setTotalClientsCount(2481 + clients.length - 7);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Super Admin Welcome Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Hey Sarah, here&apos;s your platform today.
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Real-time multi-tenant analytics, infrastructure utilization, and client operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Sub-Navigation Tabs */}
          <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border bg-muted/60 p-1 text-xs font-semibold no-scrollbar">
            <Link
              href="/super-admin/dashboard"
              className="shrink-0 rounded-md bg-card px-3 py-1.5 text-foreground shadow-xs"
            >
              Dashboard
            </Link>
            <Link
              href="/super-admin/clients"
              className="shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Clients
            </Link>
            <Link
              href="/super-admin/billing"
              className="shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Billing
            </Link>
          </div>

          <Button
            onClick={() => setIsAddClientOpen(true)}
            className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      {/* Main Dashboard Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Clients Overview & Growth Chart (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Clients Overview Card */}
          <div className="space-y-5 rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Clients Overview
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    {totalClientsCount.toLocaleString()}
                  </span>
                  <Badge className="gap-1 bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs last month
                  </Badge>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last 30 Days</span>
              </div>
            </div>

            {/* Growth Curve Chart */}
            <div className="h-56 w-full rounded-xl border bg-muted/10 p-2 pt-4 sm:h-72 sm:p-3 sm:pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} />
                  <YAxis
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    width={36}
                    domain={["dataMin - 100", "dataMax + 100"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clients"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#clientGrad)"
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                    name="Active Client Tenants"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics Summary Grid */}
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs text-muted-foreground">Active Workspaces</p>
              <p className="mt-0.5 text-xl font-bold text-foreground sm:text-2xl">2,340</p>
              <p className="mt-1 text-[11px] font-medium text-primary">94.3% retention rate</p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs text-muted-foreground">Monthly Platform MRR</p>
              <p className="mt-0.5 text-xl font-bold text-foreground sm:text-2xl">$84,250</p>
              <p className="mt-1 text-[11px] font-medium text-primary">+18.4% YoY</p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs xs:col-span-2 sm:col-span-1">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs text-muted-foreground">Support Escalations</p>
              <p className="mt-0.5 text-xl font-bold text-foreground sm:text-2xl">4 Active</p>
              <p className="mt-1 text-[11px] font-medium text-amber-600">1 Urgent on-call</p>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Usage, Quick Actions & Health */}
        <div className="space-y-6">
          {/* Current Plan Usage Card */}
          <div className="space-y-5 rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground sm:text-base">Current Plan Usage</h2>
              <Badge variant="outline" className="text-[10px] font-semibold">
                Global Quota
              </Badge>
            </div>

            {/* API Requests */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  API Requests
                </span>
                <span className="font-bold text-foreground">8.4M / 10M</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-amber-500" style={{ width: "84%" }} />
              </div>
              <p className="text-right text-[10px] text-muted-foreground">84% Capacity utilized</p>
            </div>

            {/* Storage */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <HardDrive className="h-3.5 w-3.5 text-primary" />
                  Media & Object Storage
                </span>
                <span className="font-bold text-foreground">42GB / 50GB</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: "84%" }} />
              </div>
              <p className="text-right text-[10px] text-muted-foreground">8GB Available</p>
            </div>

            <Button
              variant="outline"
              onClick={() => alert("Redirecting to Infrastructure Capacity Provisioner...")}
              className="w-full text-xs font-semibold text-foreground hover:bg-muted"
            >
              Upgrade Limits
            </Button>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
            <h2 className="mb-1 text-sm font-bold text-foreground sm:text-base">Quick Actions</h2>

            <Link
              href="/super-admin/clients"
              className="group flex items-center justify-between rounded-xl border bg-muted/20 p-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <span>Manage Clients</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/super-admin/billing"
              className="group flex items-center justify-between rounded-xl border bg-muted/20 p-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span>Manage Billing & Plans</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/super-admin/support"
              className="group flex items-center justify-between rounded-xl border bg-muted/20 p-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <span>Support Tickets Triage</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onClientAdded={(newClient) => {
          clientService.create(newClient).then(() => {
            setTotalClientsCount((prev) => prev + 1);
            alert(`Client ${newClient.name} provisioned successfully!`);
          });
        }}
      />
    </div>
  );
}