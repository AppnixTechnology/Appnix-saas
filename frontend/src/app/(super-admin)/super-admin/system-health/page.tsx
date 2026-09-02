"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ServiceHealth } from "@/super-admin/types";
import { systemHealthService } from "@/super-admin/services";
import {
  Activity,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Zap,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const latencyData = [
  { time: "00:00", p50: 85, p95: 140, p99: 210 },
  { time: "04:00", p50: 78, p95: 125, p99: 190 },
  { time: "08:00", p50: 110, p95: 180, p99: 290 },
  { time: "12:00", p50: 142, p95: 220, p99: 340 },
  { time: "16:00", p50: 135, p95: 210, p99: 310 },
  { time: "20:00", p50: 105, p95: 165, p99: 240 },
];

export default function SuperAdminSystemHealthPage() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = () => {
    setIsRefreshing(true);
    systemHealthService.getHealth().then((res) => {
      setServices(res);
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">System Health</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            <Activity className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            System Health & Infrastructure Telemetry
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Distributed microservices status, latency percentiles, worker backpressure, and edge nodes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchHealth}
          disabled={isRefreshing}
          className="w-full gap-1.5 text-xs font-semibold sm:w-auto"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Refresh Metrics
        </Button>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Platform Status</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          </div>
          <p className="text-xl font-black text-primary sm:text-2xl">99.98%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">30-day cumulative uptime</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Median API Latency</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-black text-foreground sm:text-2xl">114 ms</p>
          <p className="mt-1 text-[11px] text-primary">p50 benchmark across edge</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Global Error Rate</span>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-black text-foreground sm:text-2xl">0.018%</p>
          <p className="mt-1 text-[11px] text-primary">Well below 0.1% SLA threshold</p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Throughput</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-foreground sm:text-2xl">14.2k</p>
          <p className="mt-1 text-[11px] text-muted-foreground">HTTP & WS reqs / minute</p>
        </div>
      </div>

      {/* Latency Percentiles Chart */}
      <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Edge Latency Distribution (Last 24 Hours)</h2>
            <p className="text-xs text-muted-foreground">Tracking p50, p95, and p99 response duration.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" /> p50 Median
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> p95 SLA
            </span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> p99 Peak
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-4 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="time" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} width={40} unit="ms" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="p99" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} name="p99 Peak" />
              <Area type="monotone" dataKey="p95" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.12} name="p95 SLA" />
              <Area type="monotone" dataKey="p50" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="p50 Median" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Infrastructure Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Service Gateway Infrastructure Health</h2>

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
          {services.map((srv) => {
            const isOperational = srv.status === "Operational";
            const isDegraded = srv.status === "Degraded";

            return (
              <div
                key={srv.id}
                className={cn(
                  "space-y-3 rounded-xl border bg-card p-4 shadow-xs transition-all",
                  isDegraded && "border-amber-400/60 bg-amber-50/10 dark:bg-amber-950/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="line-clamp-1 text-xs font-bold text-foreground">{srv.name}</p>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {srv.category}
                    </p>
                  </div>

                  <Badge
                    className={cn(
                      "px-1.5 py-0 text-[9px] font-bold",
                      isOperational && "bg-primary/10 text-primary",
                      isDegraded && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                      srv.status === "Down" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    )}
                  >
                    {srv.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-2 text-[11px] text-muted-foreground">
                  <div>
                    <span>Response</span>
                    <p className="font-mono font-bold text-foreground">{srv.responseTimeMs} ms</p>
                  </div>
                  <div>
                    <span>Uptime</span>
                    <p className="font-mono font-bold text-primary">{srv.uptimePercentage}%</p>
                  </div>
                </div>

                {srv.lastIncident && (
                  <p className="rounded-md border border-amber-200 bg-amber-50 p-1.5 text-[10px] text-amber-600 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-400">
                    ⚠ {srv.lastIncident}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}