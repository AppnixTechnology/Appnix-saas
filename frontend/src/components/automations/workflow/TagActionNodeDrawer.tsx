"use client";

import { useState, useMemo } from "react";
import {
  X,
  Check,
  Tag as TagIcon,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Terminal,
  Activity,
  Sliders,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  TagActionType,
  TagIdentificationMode,
  TagNodeConfig,
  TagNodeExecutionResult,
} from "@/types/workflow-tag-node";
import { useContactTags } from "@/hooks/useContactTags";
import { executeTagActionNode } from "@/lib/workflow-tag-strategies/strategy-executor";
import { TagBadge } from "@/components/crm/tags/TagBadge";
import { cn } from "@/lib/utils";

interface TagActionNodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNode: (config: TagNodeConfig) => void;
  initialConfig?: TagNodeConfig | null;
}

const SAMPLE_TRIGGER_PAYLOAD = {
  event: "inbound_webhook",
  timestamp: "2026-08-31T00:30:00Z",
  webhook: {
    data: {
      contact_id: "919876543210",
      customer_tier: "Enterprise VIP",
      campaign_source: "Google Ads Q3",
    },
  },
  inbound_message: {
    sender_id: "919054618623",
    text: "I want to upgrade my plan to Enterprise tier",
  },
  contact: {
    id: "919876543210",
    name: "Sneha Patel",
    email: "sneha@example.com",
  },
};

export function TagActionNodeDrawer({
  isOpen,
  onClose,
  onSaveNode,
  initialConfig,
}: TagActionNodeDrawerProps) {
  const { tags } = useContactTags();

  // Config State
  const [actionType, setActionType] = useState<TagActionType>(
    initialConfig?.actionType || "ASSIGN_AND_CREATE"
  );
  const [targetContactMapping, setTargetContactMapping] = useState(
    initialConfig?.targetContactMapping || "{{webhook.data.contact_id}}"
  );
  const [identificationMode, setIdentificationMode] = useState<TagIdentificationMode>(
    initialConfig?.identificationMode || "NAME"
  );
  const [rawTagString, setRawTagString] = useState(
    initialConfig?.rawTagString || "VIP Customer, Priority Support"
  );

  // Diagnostic Test State
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [testResult, setTestResult] = useState<TagNodeExecutionResult | null>(null);

  if (!isOpen) return null;

  // Parsed tag values from comma-separated string
  const parsedTagValues = useMemo(() => {
    return rawTagString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rawTagString]);

  // Execute diagnostic test
  const handleRunDiagnosticTest = async () => {
    setIsExecutingTest(true);
    setTestResult(null);

    const config: TagNodeConfig = {
      id: initialConfig?.id || `node_tag_${Date.now()}`,
      name: "CRM Tag Automation Action",
      actionType,
      targetContactMapping,
      identificationMode,
      tagValues: parsedTagValues,
      rawTagString,
      defaultFallbackColor: "blue",
      defaultFallbackIcon: "tag",
    };

    try {
      const sampleExistingTags = tags.slice(0, 2);
      const result = await executeTagActionNode(config, SAMPLE_TRIGGER_PAYLOAD, sampleExistingTags);
      setTestResult(result);
    } catch (e: any) {
      setTestResult({
        status: "FAILED",
        actionType,
        resolvedContactId: "error",
        affectedTags: [],
        newTagsCreated: [],
        removedTags: [],
        resultingContactTags: [],
        executionDurationMs: 0,
        timestamp: new Date().toISOString(),
        logs: [`[Error] Execution exception: ${e?.message || "Unknown error"}`],
        error: e?.message,
      });
    } finally {
      setIsExecutingTest(false);
    }
  };

  // Save Node Configuration
  const handleSave = () => {
    const config: TagNodeConfig = {
      id: initialConfig?.id || `node_tag_${Date.now()}`,
      name:
        actionType === "ASSIGN_AND_CREATE"
          ? "Assign / Create Tags"
          : actionType === "ASSIGN_EXISTING"
          ? "Assign Tags"
          : "Remove Tags",
      actionType,
      targetContactMapping,
      identificationMode,
      tagValues: parsedTagValues,
      rawTagString,
      defaultFallbackColor: "blue",
      defaultFallbackIcon: "tag",
    };

    onSaveNode(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card text-card-foreground h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b flex items-start justify-between bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <TagIcon className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Configure CRM Tag Action Node
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Dynamically assign, auto-provision, or detach tags on contacts during workflow execution.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* SECTION 1: ACTION TYPE SELECTION */}
          <div className="space-y-2.5">
            <label className="font-bold text-foreground text-xs block">
              1. Select Tag Mutation Operation <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  id: "ASSIGN_AND_CREATE" as TagActionType,
                  title: "Assign & Create Tag (if not exists)",
                  desc: "Attaches tag to contact. Auto-provisions new taxonomy tag if missing.",
                  badge: "Recommended",
                  badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
                },
                {
                  id: "ASSIGN_EXISTING" as TagActionType,
                  title: "Assign Existing Tag",
                  desc: "Attaches only pre-existing registered workspace tags. Skips unregistered names.",
                  badge: "Strict",
                  badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
                },
                {
                  id: "REMOVE_TAG" as TagActionType,
                  title: "Remove Tag",
                  desc: "Detaches specified tags from the target contact (e.g. advance stage).",
                  badge: "Detachment",
                  badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
                },
              ].map((opt) => {
                const isSelected = actionType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActionType(opt.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground text-xs">{opt.title}</p>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.2 rounded border", opt.badgeClass)}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                    </div>

                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                        isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: TARGET CONTACT MAPPING */}
          <div className="rounded-xl border bg-card p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground text-xs block">
                2. Target Contact Mapping <span className="text-rose-500">*</span>
              </label>
              <Badge variant="outline" className="text-[10px] font-mono">
                Dynamic Variable
              </Badge>
            </div>

            <Input
              required
              placeholder="e.g. {{webhook.data.contact_id}} or phone number"
              value={targetContactMapping}
              onChange={(e) => setTargetContactMapping(e.target.value)}
              className="h-8 text-xs font-mono bg-background"
            />

            {/* Quick Variable Pill Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-muted-foreground font-semibold">Quick Tokens:</span>
              {[
                "{{webhook.data.contact_id}}",
                "{{inbound_message.sender_id}}",
                "{{form.phone}}",
              ].map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setTargetContactMapping(token)}
                  className="text-[10px] font-mono bg-muted/60 hover:bg-primary/10 hover:text-primary px-1.5 py-0.5 rounded border transition-colors"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: TAG IDENTIFICATION & VALUES */}
          <div className="rounded-xl border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground text-xs block">
                3. Tag Values & Identifiers <span className="text-rose-500">*</span>
              </label>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 border rounded-lg p-0.5 bg-muted/30 text-[10px]">
                <button
                  type="button"
                  onClick={() => setIdentificationMode("NAME")}
                  className={cn(
                    "px-2 py-0.5 rounded font-semibold transition-colors",
                    identificationMode === "NAME" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground"
                  )}
                >
                  Tag Name
                </button>
                <button
                  type="button"
                  onClick={() => setIdentificationMode("ID")}
                  className={cn(
                    "px-2 py-0.5 rounded font-semibold transition-colors",
                    identificationMode === "ID" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground"
                  )}
                >
                  Tag ID
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Input
                placeholder="Enter tags separated by comma (e.g. VIP Customer, Priority Support, Q3 Deal)..."
                value={rawTagString}
                onChange={(e) => setRawTagString(e.target.value)}
                className="h-8 text-xs bg-background"
              />
              <span className="text-[10px] text-muted-foreground">
                Supports single tag or comma-separated list for bulk assignment in one step.
              </span>
            </div>

            {/* Parsed Tag Badges Preview */}
            <div className="pt-2 border-t space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Parsed Actions ({parsedTagValues.length}):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {parsedTagValues.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">No tags specified</span>
                ) : (
                  parsedTagValues.map((val, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] gap-1 bg-background">
                      <TagIcon className="h-2.5 w-2.5 text-primary" />
                      <span>{val}</span>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: TEST EXECUTION & DIAGNOSTICS */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-foreground text-xs">
                  Diagnostic Test Simulator
                </h4>
              </div>

              <Button
                size="sm"
                onClick={handleRunDiagnosticTest}
                disabled={isExecutingTest || parsedTagValues.length === 0}
                className="bg-primary text-primary-foreground text-xs h-7 gap-1 shadow-xs"
              >
                {isExecutingTest ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Testing Node...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    <span>Run Test Step</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Runs this tag mutation strategy against a simulated sample trigger payload.
            </p>

            {/* Diagnostics Output Terminal */}
            {testResult && (
              <div className="rounded-xl border bg-slate-900 text-slate-100 p-3.5 space-y-2 font-mono text-[11px] shadow-inner animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    STATUS: {testResult.status}
                  </span>
                  <span className="text-slate-400">
                    Duration: {testResult.executionDurationMs}ms
                  </span>
                </div>

                <div className="space-y-1 text-[10px] text-slate-300">
                  <p className="text-slate-400">// Execution Telemetry Logs:</p>
                  {testResult.logs.map((log, i) => (
                    <p key={i} className="leading-tight">
                      {log}
                    </p>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Resulting Tags:</span>
                  <span className="text-emerald-300 font-bold">
                    {testResult.resultingContactTags.map((t) => t.name).join(", ") || "None"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={parsedTagValues.length === 0 || !targetContactMapping.trim()}
            className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Node Configuration</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
