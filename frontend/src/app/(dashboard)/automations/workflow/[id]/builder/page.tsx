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
  Tag as TagIcon,
  Sliders,
  Shield,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagNodeConfig } from "@/types/workflow-tag-node";
import { TagActionNodeDrawer } from "@/components/automations/workflow/TagActionNodeDrawer";
import { TagBadge } from "@/components/crm/tags/TagBadge";
import { cn } from "@/lib/utils";

export default function WorkflowCanvasBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params?.id as string;

  const [workflowTitle, setWorkflowTitle] = useState("Inbound Lead Nurturing & VIP Tagging Flow");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // CRM Tag Action Node Configuration State
  const [tagNodeConfig, setTagNodeConfig] = useState<TagNodeConfig>({
    id: "node_crm_tag_1",
    name: "CRM Tag Action: Assign & Create VIP",
    actionType: "ASSIGN_AND_CREATE",
    targetContactMapping: "{{webhook.data.contact_id}}",
    identificationMode: "NAME",
    tagValues: ["VIP Customer", "Priority Support", "Q3 Deal"],
    rawTagString: "VIP Customer, Priority Support, Q3 Deal",
    defaultFallbackColor: "blue",
    defaultFallbackIcon: "tag",
  });

  const [isTagDrawerOpen, setIsTagDrawerOpen] = useState(false);

  const handleSaveCanvas = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3 animate-in fade-in duration-200">
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
            <p className="text-[11px] text-muted-foreground">Visual Canvas Builder • CRM Tag Strategy Engine active</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Node Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Flow Node</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">
                CRM & Tag Operations
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsTagDrawerOpen(true)}>
                <TagIcon className="h-3.5 w-3.5 mr-2 text-primary" />
                <span>CRM Tag Action Node</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/crm/super-fields")}>
                <Sliders className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                <span>Super Field Schema Update</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">
                Messaging & Webhooks
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <MessageSquare className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                <span>WhatsApp Template Dispatch</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Webhook className="h-3.5 w-3.5 mr-2 text-amber-600" />
                <span>External HTTP Webhook</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
      <div className="flex-1 rounded-2xl border bg-slate-50/60 dark:bg-slate-950/40 relative overflow-y-auto flex items-center justify-center p-8">
        {/* Canvas Background Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Interactive Flow Nodes Pipeline */}
        <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg w-full py-6">
          {/* Node 1: Trigger */}
          <div className="w-full p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-3 border-emerald-500/30 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  Trigger Event
                </span>
                <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  Realtime
                </Badge>
              </div>
              <h3 className="text-xs font-bold text-foreground mt-0.5">
                Inbound WhatsApp Lead Webhook
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono truncate">
                payload: contact_id, customer_tier
              </p>
            </div>
          </div>

          {/* Flow Connector */}
          <div className="h-6 w-0.5 bg-border flex items-center justify-center relative">
            <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
          </div>

          {/* Node 2: CRM TAG ACTION NODE */}
          <div
            onClick={() => setIsTagDrawerOpen(true)}
            className="w-full p-4 rounded-2xl border bg-card shadow-sm space-y-2.5 border-primary/40 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <TagIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                      CRM Tag Action Node
                    </span>
                    <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                      {tagNodeConfig.actionType === "ASSIGN_AND_CREATE"
                        ? "Assign & Auto-Create"
                        : tagNodeConfig.actionType === "ASSIGN_EXISTING"
                        ? "Assign Existing"
                        : "Remove Tags"}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {tagNodeConfig.name}
                  </h3>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground group-hover:text-foreground"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Target Contact Mapping Display */}
            <div className="p-2 rounded-lg bg-muted/40 text-[11px] flex items-center justify-between">
              <span className="text-muted-foreground">Target Contact:</span>
              <code className="font-mono font-bold text-foreground">
                {tagNodeConfig.targetContactMapping}
              </code>
            </div>

            {/* Configured Tag Badges */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {tagNodeConfig.tagValues.map((t, idx) => (
                <TagBadge key={idx} name={t} size="xs" />
              ))}
            </div>
          </div>

          {/* Flow Connector */}
          <div className="h-6 w-0.5 bg-border flex items-center justify-center relative">
            <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
          </div>

          {/* Node 3: Automated WhatsApp Response */}
          <div className="w-full p-4 rounded-2xl border bg-card shadow-sm flex items-center gap-3 border-purple-500/30 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                  Outbound Action
                </span>
                <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-200">
                  Cloud API
                </Badge>
              </div>
              <h3 className="text-xs font-bold text-foreground mt-0.5">
                Dispatch VIP Greeting Template
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Sends personalized WhatsApp welcome with interactive buttons
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Tag Action Node Configuration Drawer */}
      <TagActionNodeDrawer
        isOpen={isTagDrawerOpen}
        onClose={() => setIsTagDrawerOpen(false)}
        initialConfig={tagNodeConfig}
        onSaveNode={(newConfig) => {
          setTagNodeConfig(newConfig);
          setIsTagDrawerOpen(false);
        }}
      />
    </div>
  );
}
