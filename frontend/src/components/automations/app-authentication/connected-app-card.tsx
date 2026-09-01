import React, { useState } from 'react';
import {
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Clock,
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ConnectedApp, TestResult } from './types';
import { AppBrandLogo } from './app-brand-logos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ConnectedAppCardProps {
  app: ConnectedApp;
  onTest: (app: ConnectedApp) => Promise<TestResult | void>;
  onEdit: (app: ConnectedApp) => void;
  onDelete: (app: ConnectedApp) => void;
  isTesting?: boolean;
}

export function ConnectedAppCard({
  app,
  onTest,
  onEdit,
  onDelete,
  isTesting = false,
}: ConnectedAppCardProps) {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleTestClick = async () => {
    try {
      const res = await onTest(app);
      if (res) {
        setTestResult(res);
      }
    } catch {
      setTestResult({
        success: false,
        latencyMs: 120,
        message: 'Connection ping timeout or network failure.',
      });
    }
  };

  const copyToClipboard = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatAuthType = (authType: string) => {
    switch (authType) {
      case 'API_KEY':
        return 'API Key';
      case 'BEARER_TOKEN':
        return 'Bearer Token';
      case 'OAUTH2':
        return 'OAuth 2.0';
      case 'BASIC_AUTH':
        return 'Basic Auth';
      default:
        return authType;
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md ${
        !app.isHealthy
          ? 'border-amber-500/60 bg-gradient-to-b from-amber-500/[0.03] to-card'
          : 'border-border hover:border-primary/40'
      }`}
    >
      <div>
        {/* Top Header: Logo + Title + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <AppBrandLogo appName={app.appName} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-base text-foreground truncate" title={app.accountName}>
                  {app.accountName}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-foreground/80">{app.appTitle || app.appName}</span>
                <span>•</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground bg-muted/40">
                  {formatAuthType(app.authType)}
                </Badge>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          {app.isHealthy ? (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1.5 text-xs font-semibold py-1 px-2.5 shrink-0"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              Connected
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 gap-1.5 text-xs font-semibold py-1 px-2.5 shrink-0 animate-pulse"
            >
              <AlertTriangle className="h-3 w-3 shrink-0" />
              Expired / Token Invalid
            </Badge>
          )}
        </div>

        {/* Credentials / Config Info */}
        <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs border border-border/60 space-y-1.5">
          {app.maskedCredentials && Object.keys(app.maskedCredentials).length > 0 ? (
            Object.entries(app.maskedCredentials).slice(0, 2).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground capitalize truncate">
                  {key.replace(/([A-Z])/g, ' $1')}:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground/90 font-medium shrink-0">
                  <span>{String(val)}</span>
                  <button
                    onClick={() => copyToClipboard(key, String(val))}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy masked identifier"
                  >
                    {copiedKey === key ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Encrypted token stored in vault</span>
            </div>
          )}
        </div>

        {/* Live Test Banner (if recently tested) */}
        {testResult && (
          <div
            className={`mt-3 rounded-lg p-2.5 text-xs border transition-all ${
              testResult.success
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/20'
                : 'bg-red-500/10 text-red-800 dark:text-red-200 border-red-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                {testResult.success ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
                {testResult.success ? 'Live Ping Succeeded' : 'Ping Failed'}
              </span>
              <span className="font-mono text-[10px] opacity-75">{testResult.latencyMs}ms</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
          </div>
        )}

        {/* Metadata Row: Linked Workflows + Last Tested */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
            <span>Used in {app.linkedWorkflowsCount || 0} workflows</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <Clock className="h-3 w-3" />
            <span>
              {app.lastTestedAt
                ? `Tested ${new Date(app.lastTestedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}`
                : 'Not tested yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-border/70">
        {/* Test Connection Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestClick}
          disabled={isTesting}
          className="flex-1 text-xs gap-1.5 font-medium hover:bg-muted cursor-pointer"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              <span>Test Connection</span>
            </>
          )}
        </Button>

        {/* Edit Credentials Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(app)}
          className="px-2.5 text-xs font-medium hover:bg-muted cursor-pointer"
          title="Edit Credentials"
        >
          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline ml-1.5">Edit</span>
        </Button>

        {/* Disconnect / Delete Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(app)}
          className="px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer"
          title="Disconnect / Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
