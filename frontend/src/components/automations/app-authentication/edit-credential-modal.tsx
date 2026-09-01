import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Trash2,
  GitBranch,
} from 'lucide-react';
import { ConnectedApp, CatalogApp, TestResult, AuthType } from './types';
import { AppBrandLogo } from './app-brand-logos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface EditCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: ConnectedApp | null;
  catalog: CatalogApp[];
  onUpdate: (
    id: string,
    payload: {
      accountName?: string;
      authType?: AuthType;
      credentials?: Record<string, any>;
      isActive?: boolean;
    },
  ) => Promise<void>;
  onTest: (app: ConnectedApp) => Promise<TestResult | void>;
  onDelete: (app: ConnectedApp) => void;
}

export function EditCredentialModal({
  isOpen,
  onClose,
  app,
  catalog,
  onUpdate,
  onTest,
  onDelete,
}: EditCredentialModalProps) {
  if (!isOpen || !app) return null;

  const catalogInfo = catalog.find((c) => c.id === app.appName);

  const [accountName, setAccountName] = useState(app.accountName);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
    if (testResult) setTestResult(null);
    if (errorMsg) setErrorMsg(null);
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setErrorMsg(null);
    try {
      const res = await onTest({
        ...app,
        credentials: Object.keys(credentials).length > 0 ? credentials : app.credentials,
      });
      if (res) {
        setTestResult(res);
      }
    } catch {
      setErrorMsg('Test connection failed.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setErrorMsg('Please specify an account name.');
      return;
    }

    setIsUpdating(true);
    setErrorMsg(null);

    try {
      await onUpdate(app.id, {
        accountName: accountName.trim(),
        credentials: Object.keys(credentials).length > 0 ? credentials : undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update credentials.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <AppBrandLogo appName={app.appName} size="md" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Edit {app.accountName}</h3>
              <p className="text-xs text-muted-foreground">
                Update account label or rotate secret API credentials.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Account Label */}
          <div className="space-y-1.5">
            <Label htmlFor="editAccountName" className="text-xs font-semibold">
              Account Label / Nickname
            </Label>
            <Input
              id="editAccountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>

          {/* Dynamic Fields for Credential Rotation */}
          {catalogInfo && catalogInfo.fields.length > 0 && (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground">
                  Rotate API Keys / Tokens
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Leave blank to retain current vault credentials
                </span>
              </div>

              {catalogInfo.fields.map((field) => {
                const isSecret = field.type === 'password';
                const showSecret = showSecrets[field.key];
                const currentMasked = app.maskedCredentials?.[field.key];

                return (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`rotate_${field.key}`} className="text-xs font-medium">
                        {field.label}
                      </Label>
                      {currentMasked && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Current: {currentMasked}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        id={`rotate_${field.key}`}
                        type={isSecret && !showSecret ? 'password' : 'text'}
                        value={credentials[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={`Enter new ${field.label.toLowerCase()} to rotate`}
                        className={`h-10 text-sm ${isSecret ? 'pr-10' : ''}`}
                      />
                      {isSecret && (
                        <button
                          type="button"
                          onClick={() => toggleShowSecret(field.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Linked Workflows Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <GitBranch className="h-4 w-4 text-primary" />
              <span>Used in {app.linkedWorkflowsCount || 0} active automation workflows</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {app.isHealthy ? 'Healthy' : 'Needs Re-auth'}
            </Badge>
          </div>

          {/* Test Connection Banner */}
          {testResult && (
            <div
              className={`rounded-xl p-3.5 border text-xs space-y-1 ${
                testResult.success
                  ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-emerald-500/30'
                  : 'bg-destructive/10 text-destructive border-destructive/30'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {testResult.success ? 'Live Ping Validated' : 'Validation Failed'}
                </span>
                <span className="font-mono text-[11px] opacity-75">{testResult.latencyMs}ms</span>
              </div>
              <p className="text-[11px] opacity-90">{testResult.message}</p>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete(app)}
              className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 cursor-pointer gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTesting || isUpdating}
                className="cursor-pointer gap-1.5"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Test Ping</span>
                  </>
                )}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
                className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold cursor-pointer gap-1.5"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
