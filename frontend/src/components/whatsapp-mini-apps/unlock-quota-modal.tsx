import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Layers,
  ArrowUpRight,
  BarChart3,
  Flame,
  CheckCheck,
} from "lucide-react";
import { WorkspaceFlowQuota, UnlockResult } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UnlockQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  quota: WorkspaceFlowQuota;
  onUnlockSuccess: (result: UnlockResult) => void;
}

// Sample demo activation keys for test convenience
const DEMO_KEYS = [
  {
    key: "FLOW-PRO8-2026-UNLK",
    label: "Pro Tier (+10 Flows)",
    desc: "Unlocks +10 published flows & dynamic API endpoints",
    type: "valid",
  },
  {
    key: "FLOW-ENT9-9921-MAX",
    label: "Enterprise (+95 Flows)",
    desc: "Unlocks unlimited flows & multi-WABA routing",
    type: "valid",
  },
  {
    key: "FLOW-EXPD-2025-0001",
    label: "Expired Key",
    desc: "Simulates an expired promotional voucher",
    type: "error",
  },
  {
    key: "FLOW-USED-8812-CLAIM",
    label: "Claimed Key",
    desc: "Simulates an already redeemed single-use token",
    type: "error",
  },
];

export function UnlockQuotaModal({
  isOpen,
  onClose,
  quota,
  onUnlockSuccess,
}: UnlockQuotaModalProps) {
  const [activeTab, setActiveTab] = useState<"redeem" | "status">("redeem");
  const [licenseKey, setLicenseKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unlockSuccessData, setUnlockSuccessData] = useState<UnlockResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-format key to uppercase and standard pattern
  const handleKeyChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    setLicenseKey(cleaned);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSelectDemoKey = (key: string) => {
    setLicenseKey(key);
    if (errorMsg) setErrorMsg(null);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleKeyChange(text);
      }
    } catch {
      // fallback
    }
  };

  // Submit and Redeem License Key
  const handleRedeemKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = licenseKey.trim().toUpperCase();

    if (!formatted) {
      setErrorMsg("Please enter a valid license or activation key.");
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      // Realistic validation simulation with server response
      await new Promise((r) => setTimeout(r, 650));

      if (formatted === "FLOW-EXPD-2025-0001") {
        setErrorMsg("This promotional activation key expired on Dec 31, 2025.");
        setIsValidating(false);
        return;
      }

      if (formatted === "FLOW-USED-8812-CLAIM") {
        setErrorMsg("This voucher key has already been claimed by another workspace.");
        setIsValidating(false);
        return;
      }

      // Check standard format (FLOW-XXXX-XXXX-XXXX or APNX-FLOW-XXXX-XXXX)
      const validPattern = /^(FLOW|APNX-FLOW)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formatted);
      if (!validPattern) {
        setErrorMsg(
          "Invalid license key format. Expected format: FLOW-XXXX-XXXX-XXXX (e.g. FLOW-PRO8-2026-UNLK)."
        );
        setIsValidating(false);
        return;
      }

      const isEnterprise = formatted.includes("ENT") || formatted.includes("MAX");
      const bonus = isEnterprise ? 95 : 10;
      const planName = isEnterprise
        ? "Enterprise Unlimited Suite"
        : "Professional Growth Plan";

      const result: UnlockResult = {
        success: true,
        message: `Successfully activated ${planName}! +${bonus} published flows and premium features unlocked.`,
        data: {
          planTier: planName,
          newMaxPublishedFlows: quota.maxPublishedFlows + bonus,
          publishedFlowsUsed: quota.publishedFlowsUsed,
          unlockedFeatures: [
            `+${bonus} Active Published WhatsApp Flows`,
            "Dynamic Data API Endpoints (Live CRM Inventory & Pricing)",
            "Screen Drop-off & Funnel Analytics",
            "Multi-WABA Number Routing & Failover",
            "AES-256 Vault Client-side Encryption",
          ],
        },
      };

      setUnlockSuccessData(result);
      onUnlockSuccess(result);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to redeem activation key.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCloseAndReset = () => {
    setLicenseKey("");
    setErrorMsg(null);
    setUnlockSuccessData(null);
    setActiveTab("redeem");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4.5 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Unlock WhatsApp Flows Quota
                </h3>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold"
                >
                  {quota.planTier}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Expand your active flow limits or enable advanced endpoint features.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseAndReset}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Body: Success Screen or Tabbed Layout */}
        {unlockSuccessData ? (
          /* ================= SUCCESS STATE ================= */
          <div className="p-6 space-y-6 overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
                <CheckCheck className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-extrabold text-foreground">
                Quota Upgraded Successfully! 🎉
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {unlockSuccessData.message}
              </p>
            </div>

            {/* Upgraded Limit Banner */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  New Workspace Capacity:
                </p>
                <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {unlockSuccessData.data.newMaxPublishedFlows} Published Flows
                </h3>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/40 text-xs font-bold px-3 py-1"
              >
                {unlockSuccessData.data.planTier}
              </Badge>
            </div>

            {/* Unlocked Capabilities List */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Newly Unlocked Capabilities:
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unlockSuccessData.data.unlockedFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border/80 bg-muted/30 text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                onClick={handleCloseAndReset}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer gap-1.5"
              >
                <span>Back to Flows Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* ================= MAIN TABBED CONTENT ================= */
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("redeem")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  activeTab === "redeem"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Redeem Activation Key</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  activeTab === "status"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Current Quota & Plan Status</span>
              </button>
            </div>

            {/* TAB 1: REDEEM LICENSE KEY */}
            {activeTab === "redeem" && (
              <form onSubmit={handleRedeemKey} className="space-y-5 animate-in fade-in duration-200">
                {/* Key Form Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="licenseKeyInput" className="text-xs font-bold text-foreground">
                      License / Activation Key <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Paste from Clipboard
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="licenseKeyInput"
                      value={licenseKey}
                      onChange={(e) => handleKeyChange(e.target.value)}
                      placeholder="FLOW-XXXX-XXXX-XXXX"
                      className="h-11 font-mono text-sm uppercase tracking-wider pl-3.5 pr-20 bg-muted/20"
                      disabled={isValidating}
                      required
                    />
                    {licenseKey && (
                      <button
                        type="button"
                        onClick={() => setLicenseKey("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Enter the 16-character license key issued with your Appnix subscription or partner voucher.
                  </p>
                </div>

                {/* Demo Quick-Select Keys */}
                <div className="space-y-2 rounded-xl bg-muted/40 p-3.5 border border-border/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      Quick Test Keys (Click to auto-fill):
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEMO_KEYS.map((k) => (
                      <button
                        key={k.key}
                        type="button"
                        onClick={() => handleSelectDemoKey(k.key)}
                        className={cn(
                          "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                          licenseKey === k.key
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {k.key}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] py-0 px-1.5 font-semibold",
                              k.type === "valid"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-red-500/10 text-red-700 border-red-500/20"
                            )}
                          >
                            {k.label}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{k.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Where to find key */}
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/60">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">Where to find your key?</p>
                    <p className="text-[11px] leading-relaxed">
                      Activation tokens are delivered via order confirmation email, or generated in the Enterprise Agreement dashboard.
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive flex items-center gap-2 animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCloseAndReset}
                    disabled={isValidating}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    size="default"
                    disabled={isValidating || !licenseKey.trim()}
                    className="h-10 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer gap-2"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying Key...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Apply & Unlock Quota</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 2: CURRENT QUOTA & PLAN STATUS */}
            {activeTab === "status" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Usage Bar Card */}
                <div className="rounded-xl border border-border/80 bg-muted/30 p-4.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Published Flows Quota
                      </span>
                      <h4 className="text-xl font-extrabold text-foreground mt-0.5">
                        {quota.publishedFlowsUsed} of {quota.maxPublishedFlows} Flows Used
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 text-xs font-bold"
                    >
                      {quota.availableSlots} Slots Available
                    </Badge>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden border border-border/60">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          quota.percentageUsed >= 90
                            ? "bg-red-500"
                            : quota.percentageUsed >= 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        )}
                        style={{ width: `${quota.percentageUsed}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{quota.percentageUsed}% Consumed</span>
                      <span>Max limit: {quota.maxPublishedFlows} Active Flows</span>
                    </div>
                  </div>
                </div>

                {/* Feature Checklist (Locked vs Unlocked) */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Plan Capabilities Breakdown
                  </Label>
                  <div className="rounded-xl border border-border/80 bg-card divide-y divide-border/60">
                    {quota.features.map((feat) => (
                      <div
                        key={feat.key}
                        className="p-3 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {feat.label}
                            </span>
                            {feat.unlocked ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[9px] py-0 font-semibold"
                              >
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-muted text-muted-foreground border-border text-[9px] py-0"
                              >
                                Locked (Upgrade to Pro)
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feat.description}
                          </p>
                        </div>

                        <div className="shrink-0 ml-3">
                          {feat.unlocked ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground/60" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade Plan Callout */}
                <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-card to-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-foreground">
                      Need unlimited high-volume WhatsApp Flows?
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Upgrade to Enterprise Suite for custom SLA, dedicated WABA routes, and unlimited published flows.
                    </p>
                  </div>

                  <Link href="/workspace/billing" className="shrink-0">
                    <Button
                      size="sm"
                      className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Upgrade Plan</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseAndReset}
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
