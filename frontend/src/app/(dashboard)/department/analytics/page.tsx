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
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
  RefreshCw,
  Building2,
  Headphones,
  Code2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface DeptMetric {
  id: string;
  name: string;
  head: string;
  membersCount: number;
  openTasks: number;
  completedTasks: number;
  avgResolution: string;
  efficiencyScore: number;
  slaAdherence: string;
  status: "Optimal" | "High Load" | "Normal";
}

const deptMetrics: DeptMetric[] = [
  {
    id: "sales",
    name: "Sales Department",
    head: "Priya Sharma",
    membersCount: 45,
    openTasks: 38,
    completedTasks: 420,
    avgResolution: "8m 15s",
    efficiencyScore: 96,
    slaAdherence: "99.1%",
    status: "Optimal",
  },
  {
    id: "support",
    name: "Support Department",
    head: "Aman Gupta",
    membersCount: 28,
    openTasks: 84,
    completedTasks: 1150,
    avgResolution: "12m 40s",
    efficiencyScore: 92,
    slaAdherence: "96.4%",
    status: "High Load",
  },
  {
    id: "it-dev",
    name: "IT & Development",
    head: "Vikram Malhotra",
    membersCount: 18,
    openTasks: 16,
    completedTasks: 180,
    avgResolution: "4h 20m",
    efficiencyScore: 94,
    slaAdherence: "98.0%",
    status: "Normal",
  },
  {
    id: "operations",
    name: "Operations & Admin",
    head: "Neha Joshi",
    membersCount: 12,
    openTasks: 9,
    completedTasks: 95,
    avgResolution: "1h 10m",
    efficiencyScore: 95,
    slaAdherence: "99.5%",
    status: "Optimal",
  },
];

export default function DepartmentAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const totalMembers = deptMetrics.reduce((acc, d) => acc + d.membersCount, 0);
  const totalCompleted = deptMetrics.reduce((acc, d) => acc + d.completedTasks, 0);
  const totalOpen = deptMetrics.reduce((acc, d) => acc + d.openTasks, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/department"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Department</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Analytics</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Department Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track operational efficiency, staffing capacity, workload distribution, and SLA resolution times.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground border rounded-lg px-3 py-2 bg-card">
            <Calendar className="h-3.5 w-3.5" />
            <span>{selectedRange}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Exporting Department Analytics Report...")}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <Users className="h-4.5 w-4.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Total Staff / Personnel</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">{totalMembers}</p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            Across 4 active units
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-muted-foreground">Resolved Workflows</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">{totalCompleted.toLocaleString()}</p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            +14.2% this month
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-3">
            <Clock className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-muted-foreground">Avg First Response</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">11m 30s</p>
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            2.4m faster vs target
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-3">
            <ShieldCheck className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs text-muted-foreground">Overall SLA Adherence</p>
          <p className="text-2xl font-bold mt-0.5 text-foreground">98.2%</p>
          <p className="text-xs mt-1 text-muted-foreground">
            {totalOpen} active inquiries in progress
          </p>
        </div>
      </div>

      {/* Performance & Capacity Breakdown Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-foreground">Departmental Performance Index</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparative metrics across capacity, efficiency, and inquiry resolution.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left">Department</th>
                <th className="p-3.5 text-left">Team Lead</th>
                <th className="p-3.5 text-left">Members</th>
                <th className="p-3.5 text-left">Open Tasks</th>
                <th className="p-3.5 text-left">Completed</th>
                <th className="p-3.5 text-left">Avg Resolution</th>
                <th className="p-3.5 text-left">SLA Adherence</th>
                <th className="p-3.5 text-left">Efficiency</th>
                <th className="p-3.5 text-right">Workload Status</th>
              </tr>
            </thead>
            <tbody>
              {deptMetrics.map((dept) => (
                <tr key={dept.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-semibold text-foreground">
                    {dept.name}
                  </td>
                  <td className="p-3.5 text-muted-foreground text-xs">
                    {dept.head}
                  </td>
                  <td className="p-3.5 text-xs font-medium">
                    <span className="bg-muted px-2 py-0.5 rounded-full">
                      {dept.membersCount} staff
                    </span>
                  </td>
                  <td className="p-3.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {dept.openTasks} open
                  </td>
                  <td className="p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {dept.completedTasks} resolved
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground font-mono">
                    {dept.avgResolution}
                  </td>
                  <td className="p-3.5 text-xs font-semibold text-foreground">
                    {dept.slaAdherence}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${dept.efficiencyScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{dept.efficiencyScore}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5",
                        dept.status === "Optimal" &&
                          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
                        dept.status === "High Load" &&
                          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
                        dept.status === "Normal" &&
                          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                      )}
                    >
                      {dept.status}
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
