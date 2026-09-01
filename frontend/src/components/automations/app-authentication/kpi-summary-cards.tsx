import React from 'react';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  GitBranch,
  ArrowUpRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { KpiSummary } from './types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface KpiSummaryCardsProps {
  summary: KpiSummary;
  onFilterNeedsReauth?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function KpiSummaryCards({
  summary,
  onFilterNeedsReauth,
  onRefresh,
  isLoading = false,
}: KpiSummaryCardsProps) {
  const hasIssues = summary.needsReauthCount > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Connected Apps Card */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connected Apps
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                {summary.totalConnected}
              </h3>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Integrations
              </span>
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Across 6 categories
          </span>
          <span className="font-medium text-foreground">Ready for workflows</span>
        </div>
      </div>

      {/* 2. Authentication Health Card */}
      <div
        className={`relative overflow-hidden rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
          hasIssues
            ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/5 via-card to-card dark:from-amber-950/20'
            : 'border-border/80 bg-card hover:border-emerald-500/40'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Authentication Health
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                {summary.healthyCount}
                <span className="text-lg font-normal text-muted-foreground">
                  /{summary.totalConnected}
                </span>
              </h3>
              {hasIssues ? (
                <Badge
                  variant="outline"
                  className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 text-[11px] font-semibold py-0.5"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {summary.needsReauthCount} Needs Re-auth
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 text-[11px] font-semibold py-0.5"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  All Healthy
                </Badge>
              )}
            </div>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              hasIssues
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            {hasIssues ? (
              <ShieldAlert className="h-5 w-5 animate-bounce" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60 text-xs">
          <span className="text-muted-foreground">
            {hasIssues ? '1 token expired or permissions changed' : 'All live API tokens pinging 200 OK'}
          </span>
          {hasIssues && onFilterNeedsReauth && (
            <button
              onClick={onFilterNeedsReauth}
              className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              View issues
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Active in Workflows Card */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active In Workflows
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                {summary.totalWorkflowsLinked}
              </h3>
              <span className="text-xs font-medium text-muted-foreground">
                Live Automation Nodes
              </span>
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 border border-violet-500/20">
            <GitBranch className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <span>Dependent execution nodes</span>
          <Link
            href="/automations/workflow"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            Open Workflows
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
