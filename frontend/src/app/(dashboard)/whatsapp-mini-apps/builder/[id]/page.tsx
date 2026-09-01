"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RotateCcw,
  Play,
  FileCode,
  Layers,
  ChevronRight,
  Eye,
  Settings2,
  Calendar,
  Send,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { Flow, FlowScreen, FlowScreenComponent } from "@/components/whatsapp-mini-apps/types";
import { STARTER_TEMPLATES } from "@/components/whatsapp-mini-apps/templates-data";
import { FlowSimulatorModal } from "@/components/whatsapp-mini-apps/flow-simulator-modal";
import { FlowJsonViewerModal } from "@/components/whatsapp-mini-apps/flow-json-viewer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function WhatsAppFlowBuilderPage({ params }: BuilderPageProps) {
  const resolvedParams = use(params);
  const flowId = resolvedParams?.id;
  const router = useRouter();

  // Load flow or fallback
  const initialScreens: FlowScreen[] = useMemo(() => {
    return (
      STARTER_TEMPLATES[0]?.screens || [
        {
          id: "SCREEN_START",
          title: "Welcome Screen",
          components: [
            {
              id: "comp_head",
              type: "TextHeading",
              label: "Welcome to Flow",
              description: "Please fill in your details.",
            },
            {
              id: "comp_input",
              type: "TextInput",
              label: "Customer Name",
              placeholder: "Enter full name",
              required: true,
            },
            {
              id: "comp_foot",
              type: "Footer",
              label: "Submit Information",
            },
          ],
          terminal: true,
        },
      ]
    );
  }, []);

  const [flowTitle, setFlowTitle] = useState("WhatsApp Flow #" + flowId.slice(-4));
  const [screens, setScreens] = useState<FlowScreen[]>(initialScreens);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const activeScreen = screens[selectedScreenIndex] || screens[0];

  const currentFlowObject: Flow = {
    id: flowId,
    name: flowTitle,
    status: isPublished ? "PUBLISH" : "DRAFT",
    channel: "01 Automations (+91 98765 43210)",
    category: "Appointment Booking",
    screens,
    version: "3.1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add Screen
  const handleAddScreen = () => {
    const newScreenId = `SCREEN_${screens.length + 1}`;
    const newScreen: FlowScreen = {
      id: newScreenId,
      title: `Screen ${screens.length + 1}`,
      components: [
        {
          id: `head_${Date.now()}`,
          type: "TextHeading",
          label: "New Screen",
          description: "Configure this screen's components in the left palette.",
        },
        {
          id: `foot_${Date.now()}`,
          type: "Footer",
          label: "Continue",
        },
      ],
    };
    setScreens((prev) => [...prev, newScreen]);
    setSelectedScreenIndex(screens.length);
  };

  // Add Component to Active Screen
  const handleAddComponent = (type: FlowScreenComponent["type"]) => {
    const newComp: FlowScreenComponent = {
      id: `comp_${Date.now()}`,
      type,
      label:
        type === "TextHeading"
          ? "Screen Heading"
          : type === "Dropdown"
          ? "Select Option"
          : type === "DatePicker"
          ? "Select Date"
          : type === "RadioGroup"
          ? "Choose One"
          : "Input Label",
      placeholder: "Enter details...",
      required: true,
      options:
        type === "Dropdown" || type === "RadioGroup"
          ? [
              { id: "opt_1", title: "Option 1" },
              { id: "opt_2", title: "Option 2" },
            ]
          : undefined,
    };

    setScreens((prev) =>
      prev.map((s, idx) =>
        idx === selectedScreenIndex
          ? {
              ...s,
              components: [
                ...s.components.filter((c) => c.type !== "Footer"),
                newComp,
                ...s.components.filter((c) => c.type === "Footer"),
              ],
            }
          : s
      )
    );
  };

  // Remove component
  const handleRemoveComponent = (compId: string) => {
    setScreens((prev) =>
      prev.map((s, idx) =>
        idx === selectedScreenIndex
          ? {
              ...s,
              components: s.components.filter((c) => c.id !== compId),
            }
          : s
      )
    );
  };

  // Update component label
  const handleUpdateComponentLabel = (compId: string, label: string) => {
    setScreens((prev) =>
      prev.map((s, idx) =>
        idx === selectedScreenIndex
          ? {
              ...s,
              components: s.components.map((c) =>
                c.id === compId ? { ...c, label } : c
              ),
            }
          : s
      )
    );
  };

  // Save Flow
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Publish Flow
  const handlePublish = () => {
    setIsPublished(true);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full gap-4 p-4 sm:p-6">
      {/* Top Builder Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/whatsapp-mini-apps"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Flows</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div>
            <div className="flex items-center gap-2">
              <input
                value={flowTitle}
                onChange={(e) => setFlowTitle(e.target.value)}
                className="font-bold text-base bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 rounded"
              />
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold",
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-700 border-blue-500/30"
                )}
              >
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Flow ID: {flowId} • Channel: 01 Automations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulatorOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span>Test Simulator</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJsonOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>JSON Spec</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="text-xs gap-1.5 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Draft</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish to WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Column 1: Screens Hierarchy (3 cols) */}
        <div className="lg:col-span-3 rounded-xl border bg-card p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Screens Tree ({screens.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddScreen}
                className="h-7 text-[11px] px-2 gap-1 text-primary hover:bg-primary/10 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Screen
              </Button>
            </div>

            <div className="space-y-1.5">
              {screens.map((screen, idx) => (
                <div
                  key={screen.id}
                  onClick={() => setSelectedScreenIndex(idx)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                    selectedScreenIndex === idx
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/60 bg-card hover:bg-muted/50 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] opacity-70">
                      0{idx + 1}
                    </span>
                    <span className="truncate">{screen.title}</span>
                  </div>
                  {screen.terminal && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      End
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Component Quick Palette */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-[11px] font-bold text-muted-foreground uppercase">
              + Add Element to Screen
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("TextInput")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Text Input
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("Dropdown")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Dropdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("DatePicker")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Date Picker
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("RadioGroup")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Radio Group
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("TextArea")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Text Area
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent("TextHeading")}
                className="h-8 text-[11px] justify-start cursor-pointer hover:bg-muted"
              >
                Heading
              </Button>
            </div>
          </div>
        </div>

        {/* Column 2: Screen Editor Canvas (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border bg-card p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Selected Screen
                </span>
                <input
                  value={activeScreen.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setScreens((prev) =>
                      prev.map((s, idx) =>
                        idx === selectedScreenIndex ? { ...s, title: newTitle } : s
                      )
                    );
                  }}
                  className="font-bold text-sm bg-transparent border-b border-dashed border-border hover:border-primary focus:border-primary focus:outline-none w-full mt-0.5"
                />
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {activeScreen.id}
              </Badge>
            </div>

            {/* Components List on Active Screen */}
            <div className="space-y-2.5">
              {activeScreen.components.map((comp, cIdx) => (
                <div
                  key={comp.id}
                  className="group relative rounded-xl border border-border/80 bg-muted/20 p-3.5 transition-all hover:border-primary/50 hover:bg-muted/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] py-0 font-mono font-medium">
                        {comp.type}
                      </Badge>
                      {comp.required && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          Required
                        </span>
                      )}
                    </div>
                    {comp.type !== "Footer" && (
                      <button
                        onClick={() => handleRemoveComponent(comp.id)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer p-1"
                        title="Delete component"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">
                      Label / Display Text
                    </Label>
                    <Input
                      value={comp.label}
                      onChange={(e) => handleUpdateComponentLabel(comp.id, e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                  </div>

                  {comp.description && (
                    <p className="text-[11px] text-muted-foreground italic">
                      Subtext: {comp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Live Native Mobile Simulator (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border bg-muted/30 p-4 flex flex-col items-center justify-center overflow-y-auto">
          {/* Smartphone Frame */}
          <div className="w-[270px] h-[480px] bg-background rounded-[32px] border-4 border-slate-800 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col">
            <div className="h-5 bg-slate-900 flex items-center justify-between px-4 text-[9px] text-slate-400">
              <span>9:41</span>
              <div className="w-12 h-2.5 bg-slate-950 rounded-full" />
              <span>100%</span>
            </div>

            <div className="bg-emerald-700 text-white px-3 py-2 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-bold text-[11px] truncate leading-tight">
                  {flowTitle}
                </p>
                <p className="text-[9px] opacity-75 truncate">{activeScreen.title}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background">
              {activeScreen.components.map((comp) => (
                <div key={comp.id} className="space-y-1">
                  {comp.type === "TextHeading" ? (
                    <div>
                      <h5 className="font-extrabold text-xs text-foreground">
                        {comp.label}
                      </h5>
                      {comp.description && (
                        <p className="text-[10px] text-muted-foreground">
                          {comp.description}
                        </p>
                      )}
                    </div>
                  ) : comp.type === "Footer" ? (
                    <div className="pt-2">
                      <Button className="w-full h-7 text-[11px] font-semibold bg-emerald-600 text-white">
                        {comp.label}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-foreground">
                        {comp.label}
                      </span>
                      <div className="h-7 rounded border bg-muted/20 px-2 flex items-center text-[10px] text-muted-foreground">
                        {comp.placeholder || "Select / Input..."}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Live screen preview updating in real-time
          </p>
        </div>
      </div>

      {/* Simulator Modal */}
      <FlowSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        flow={currentFlowObject}
      />

      {/* JSON Viewer Modal */}
      <FlowJsonViewerModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        flow={currentFlowObject}
      />
    </div>
  );
}
