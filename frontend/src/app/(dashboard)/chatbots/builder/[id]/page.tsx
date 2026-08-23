"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Settings,
  ChevronRight,
  Sparkles,
  Bot,
  Zap,
} from "lucide-react";
import { BotBuilder, NODE_DEFINITIONS } from "@/components/bots/BotBuilder";
import { NodeLibrary } from "@/components/bots/NodeLibrary";
import { NodeInspector } from "@/components/bots/NodeInspector";
import { Toolbar } from "@/components/bots/Toolbar";
import { TestSimulator } from "@/components/bots/TestSimulator";
import { PublishDialog } from "@/components/bots/PublishDialog";
import { useUndoRedo } from "@/components/bots/useUndoRedo";
import { BotStepInfo } from "@/components/bots/steps/BotStepInfo";
import { BotStepChannels } from "@/components/bots/steps/BotStepChannels";
import { BotStepTrigger } from "@/components/bots/steps/BotStepTrigger";
import {
  useBotWizard,
  BotWizardStep,
  BotWorkflow,
  BotNode,
  BotChannel,
  PublishValidationResult,
  PublishCheck,
} from "@/hooks/useBotWizard";
import { NodeType } from "@/components/bots/types";

interface BotBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function BotBuilderPage({ params }: BotBuilderPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const botId = resolvedParams?.id;

  const {
    bot,
    currentStep,
    setCurrentStep,
    goToStep,
    nextStep,
    prevStep,
    updateBotData,
    updateWorkflow,
    updateTrigger,
    updateSettings,
    saveDraft,
    validateBot,
    publishBot,
    testBot,
    isSaving,
    isPublishing,
    workflow,
    trigger,
    settings,
    validationResult,
    testResult,
    canProceed,
    BOT_STEPS,
  } = useBotWizard(botId);

  const [selectedNode, setSelectedNode] = useState<BotNode | null>(null);
  const [showTestSimulator, setShowTestSimulator] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [publishValidation, setPublishValidation] = useState<PublishValidationResult>({
    valid: true,
    checks: [],
  });
  const [publishChecks, setPublishChecks] = useState<PublishCheck[]>([]);

  // Undo/Redo Hook
  const { canUndo, canRedo, pushHistory, undo, redo, getCurrentWorkflow } =
    useUndoRedo(workflow);

  const currentWorkflow = getCurrentWorkflow() || workflow;

  const handleWorkflowChange = useCallback(
    (newWorkflow: BotWorkflow) => {
      updateWorkflow(newWorkflow);
      pushHistory(newWorkflow);
    },
    [updateWorkflow, pushHistory]
  );

  const handleAddNodeFromLibrary = useCallback(
    (type: NodeType) => {
      const def = (NODE_DEFINITIONS as any)[type] || {
        label: "Node",
        description: "",
        category: "messages",
      };

      const newNode: BotNode = {
        id: `node-${type}-${Date.now().toString().slice(-4)}`,
        type,
        category: def.category,
        position: {
          x: 250 + Math.floor(Math.random() * 120),
          y: 180 + Math.floor(Math.random() * 120),
        },
        data: {
          label: def.label,
          description: def.description,
          config: {},
          enabled: true,
          validationStatus: "valid",
        },
      };

      const updated = {
        ...currentWorkflow,
        nodes: [...currentWorkflow.nodes, newNode],
      };
      handleWorkflowChange(updated);
      setSelectedNode(newNode);
    },
    [currentWorkflow, handleWorkflowChange]
  );

  const handleValidate = useCallback(async () => {
    const result = await validateBot();
    const checks: PublishCheck[] = [
      {
        id: "trigger",
        label: "Trigger Event Configured",
        passed: Boolean(trigger && trigger.type),
        severity: "error",
      },
      {
        id: "nodes",
        label: "Workflow contains actionable nodes",
        passed: currentWorkflow.nodes.length > 0,
        severity: "error",
      },
      {
        id: "channels",
        label: "At least one active channel selected",
        passed: Boolean(bot && bot.channels && bot.channels.length > 0),
        severity: "error",
      },
      {
        id: "ai-config",
        label: "OpenAI instructions configured (if AI nodes used)",
        passed:
          !currentWorkflow.nodes.some((n) => n.category === "ai") ||
          Boolean(settings.ai?.enabled),
        severity: "warning",
      },
      {
        id: "human-handoff",
        label: "Fallback agent escalation routing",
        passed: Boolean(settings.humanHandoff?.enabled),
        severity: "info",
      },
    ];

    setPublishValidation({
      valid: result.valid && checks.every((c) => c.passed || c.severity !== "error"),
      checks,
    });
    setPublishChecks(checks);
    return result;
  }, [validateBot, trigger, currentWorkflow, bot, settings]);

  const handlePublish = useCallback(async () => {
    await publishBot();
    setShowPublishDialog(false);
  }, [publishBot]);

  const handleTest = useCallback(async () => {
    setShowTestSimulator(true);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === "builder") {
      goToStep("trigger");
    } else {
      router.push("/chatbots");
    }
  }, [currentStep, goToStep, router]);

  // If in wizard creation steps (info, channels, trigger)
  if (currentStep !== "builder") {
    return (
      <div className="space-y-6 w-full max-w-5xl mx-auto p-4 sm:p-6">
        {/* Breadcrumb Back Button */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push("/chatbots")}
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Chatbots</span>
          </button>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="font-semibold text-primary">Create New Botflow</span>
        </nav>

        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Create Multi-Channel Botflow
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build AI-powered conversation bots for WhatsApp, Instagram, and RCS with visual drag-and-drop.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 border rounded-xl bg-card p-2 shadow-xs">
          {BOT_STEPS.map((step, idx) => {
            const isCurrent = currentStep === step.id;
            const isCompleted =
              BOT_STEPS.findIndex((s) => s.id === currentStep) > idx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(step.id)}
                className={cn(
                  "p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2.5",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : isCompleted
                    ? "bg-muted/40 text-foreground"
                    : "text-muted-foreground hover:bg-muted/20"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isCurrent
                      ? "bg-white text-primary"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-bold truncate">{step.label}</p>
                  <p
                    className={cn(
                      "text-[10px] truncate",
                      isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Container */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs">
          {currentStep === "info" && bot && (
            <BotStepInfo
              bot={bot}
              updateBotData={updateBotData}
              canProceed={canProceed}
              onNext={nextStep}
              onSaveDraft={saveDraft}
              isSaving={isSaving}
            />
          )}

          {currentStep === "channels" && bot && (
            <BotStepChannels
              bot={bot}
              settings={settings}
              updateBotData={updateBotData}
              updateSettings={updateSettings}
              canProceed={canProceed}
              onNext={nextStep}
              onPrev={prevStep}
              onSaveDraft={saveDraft}
              isSaving={isSaving}
            />
          )}

          {currentStep === "trigger" && (
            <BotStepTrigger
              trigger={trigger}
              updateTrigger={updateTrigger}
              canProceed={canProceed}
              onNext={() => goToStep("builder")}
              onPrev={prevStep}
              onSaveDraft={saveDraft}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    );
  }

  // Visual Flow Builder Screen
  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-40 flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <Toolbar
        botName={bot?.name || "Untitled Botflow"}
        status={bot?.status || "DRAFT"}
        onBack={handleBack}
        onSave={saveDraft}
        onTest={handleTest}
        onPublish={async () => {
          await handleValidate();
          setShowPublishDialog(true);
        }}
        onValidate={handleValidate}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        isPublishing={isPublishing}
        validationResult={validationResult}
      />

      {/* Main Builder Canvas Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left: Node Library */}
        <NodeLibrary
          onAddNode={handleAddNodeFromLibrary}
          activeChannels={bot?.channels || ["whatsapp"]}
          collapsed={libraryCollapsed}
          onToggleCollapse={() => setLibraryCollapsed(!libraryCollapsed)}
        />

        {/* Center: ReactFlow Canvas */}
        <BotBuilder
          workflow={currentWorkflow}
          onWorkflowChange={handleWorkflowChange}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          variables={settings.variables}
          channels={bot?.channels || ["whatsapp"]}
          isTestMode={showTestSimulator}
          testResult={testResult}
          onTest={handleTest}
          onSave={saveDraft}
          onPublish={() => {
            handleValidate();
            setShowPublishDialog(true);
          }}
          onValidate={handleValidate}
          isSaving={isSaving}
          isPublishing={isPublishing}
          validationResult={validationResult}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Right: Node Inspector */}
        {inspectorOpen && (
          <NodeInspector
            node={selectedNode}
            onUpdateNode={(nodeId, data) => {
              const updatedWorkflow = {
                ...currentWorkflow,
                nodes: currentWorkflow.nodes.map((n) =>
                  n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
                ),
              };
              handleWorkflowChange(updatedWorkflow);
            }}
            onDeleteNode={(nodeId) => {
              const updatedWorkflow = {
                ...currentWorkflow,
                nodes: currentWorkflow.nodes.filter((n) => n.id !== nodeId),
                connections: currentWorkflow.connections.filter(
                  (c) => c.source !== nodeId && c.target !== nodeId
                ),
              };
              handleWorkflowChange(updatedWorkflow);
              setSelectedNode(null);
            }}
            onDuplicateNode={(nodeId) => {
              const target = currentWorkflow.nodes.find((n) => n.id === nodeId);
              if (target) {
                const clonedNode: BotNode = {
                  ...target,
                  id: `node-${target.type}-${Date.now().toString().slice(-4)}`,
                  position: {
                    x: target.position.x + 40,
                    y: target.position.y + 40,
                  },
                };
                handleWorkflowChange({
                  ...currentWorkflow,
                  nodes: [...currentWorkflow.nodes, clonedNode],
                });
              }
            }}
            variables={settings.variables}
            channels={bot?.channels || ["whatsapp"]}
            workflow={currentWorkflow}
          />
        )}
      </div>

      {/* Test Simulator Dialog */}
      <TestSimulator
        isOpen={showTestSimulator}
        onClose={() => setShowTestSimulator(false)}
        workflow={currentWorkflow}
        variables={settings.variables}
        channels={bot?.channels || ["whatsapp"]}
        onRunTest={testBot}
      />

      {/* Publish Dialog */}
      <PublishDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        onPublish={handlePublish}
        validationResult={publishValidation}
        checks={publishChecks}
        botName={bot?.name || "Untitled Botflow"}
        currentVersion={bot?.currentVersion || 0}
        workflow={currentWorkflow}
        channels={bot?.channels || ["whatsapp"]}
        isPublishing={isPublishing}
      />
    </div>
  );
}