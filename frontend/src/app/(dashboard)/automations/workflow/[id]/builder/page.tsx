"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Play,
  Zap,
  Plus,
  Layers,
  Settings,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Webhook,
  Clock,
  FileText,
  CheckCircle2,
  Lock,
  MoreVertical,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function WorkflowCanvasBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params?.id as string;

  const [workflowTitle, setWorkflowTitle] = useState("Automation Workflow Canvas");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCanvas = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3">
      {/* Top Builder Navigation Bar */}
      <div className="flex items-center justify-between border-b pb-3 bg-card px-4 py-2.5 rounded-xl border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/automations/workflow"
            className="h-8 w-8 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{workflowTitle}</h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                {isActive ? "Active" : "Draft"}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">({workflowId})</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Visual Canvas Builder • Autosave enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveCanvas}
            className="text-xs h-8 gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Canvas"}</span>
          </Button>

          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1 shadow-sm"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Publish & Activate</span>
          </Button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="flex-1 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden flex items-center justify-center p-8">
        {/* Canvas Background Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Interactive Flow Nodes Preview */}
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full">
          {/* Node 1: Trigger */}
          <div className="w-full p-4 rounded-xl border bg-card shadow-md flex items-center gap-3 border-emerald-500/30">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Trigger Node</span>
              <h3 className="text-xs font-bold text-foreground">Inbound Message / Webhook Event</h3>
              <p className="text-[11px] text-muted-foreground">Listens for customer trigger event</p>
            </div>
          </div>

          <div className="h-6 w-0.5 bg-border flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>

          {/* Node 2: Condition / Filter */}
          <div className="w-full p-4 rounded-xl border bg-card shadow-md flex items-center gap-3 border-blue-500/30">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Condition Node</span>
              <h3 className="text-xs font-bold text-foreground">Filter: Customer Match & KYC Valid</h3>
              <p className="text-[11px] text-muted-foreground">Evaluates rules before message dispatch</p>
            </div>
          </div>

          <div className="h-6 w-0.5 bg-border flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>

          {/* Node 3: Action */}
          <div className="w-full p-4 rounded-xl border bg-card shadow-md flex items-center gap-3 border-purple-500/30">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Action Node</span>
              <h3 className="text-xs font-bold text-foreground">WhatsApp: Dispatch Template</h3>
              <p className="text-[11px] text-muted-foreground">Delivers automated messaging payload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
