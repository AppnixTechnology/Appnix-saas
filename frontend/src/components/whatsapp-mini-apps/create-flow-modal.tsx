import React, { useState, useMemo } from "react";
import {
  X,
  Plus,
  Sparkles,
  Layers,
  FileCode,
  Calendar,
  UserPlus,
  HelpCircle,
  Star,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Loader2,
  Copy,
  Check,
  Smartphone,
  Phone,
  MessageSquare,
  Zap,
} from "lucide-react";
import {
  Flow,
  FlowCategory,
  StartingMethod,
  FlowTemplate,
  FlowChannel,
  FlowScreen,
} from "./types";
import { CONNECTED_CHANNELS, STARTER_TEMPLATES } from "./templates-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreateFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingFlows: Flow[];
  onCreateFlow: (newFlow: Flow) => Promise<void> | void;
  onNavigateToBuilder: (flowId: string) => void;
}

const CATEGORIES: { label: FlowCategory; icon: React.ElementType; description: string }[] = [
  {
    label: "Appointment Booking",
    icon: Calendar,
    description: "Doctor visits, salon appointments, consultations, and test slots.",
  },
  {
    label: "Lead Generation",
    icon: UserPlus,
    description: "Multi-step qualification, company info, quotes, and sales intake.",
  },
  {
    label: "Customer Support / Inquiry",
    icon: HelpCircle,
    description: "Troubleshooting steps, ticket escalation, and order tracking.",
  },
  {
    label: "Feedback & Survey",
    icon: Star,
    description: "CSAT, NPS, product review surveys, and sentiment capturing.",
  },
  {
    label: "Product Catalog / Order",
    icon: ShoppingBag,
    description: "Interactive item selection, delivery address, and UPI re-orders.",
  },
];

const MAX_NAME_LENGTH = 60;
const NAME_REGEX = /^[a-zA-Z0-9_ ]+$/;

export function CreateFlowModal({
  isOpen,
  onClose,
  existingFlows,
  onCreateFlow,
  onNavigateToBuilder,
}: CreateFlowModalProps) {
  // Form States
  const [flowName, setFlowName] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    CONNECTED_CHANNELS[0]?.id || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<FlowCategory>(
    "Appointment Booking"
  );
  const [startingMethod, setStartingMethod] = useState<StartingMethod>("blank");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    STARTER_TEMPLATES[0]?.id || ""
  );

  // JSON Import state
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Submitting / Loading & Registration Animation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // Validation
  const nameValidation = useMemo(() => {
    const trimmed = flowName.trim();
    if (!trimmed) {
      return { isValid: false, message: null };
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      return {
        isValid: false,
        message: `Name cannot exceed ${MAX_NAME_LENGTH} characters (${trimmed.length}/${MAX_NAME_LENGTH}).`,
      };
    }
    if (!NAME_REGEX.test(trimmed)) {
      return {
        isValid: false,
        message:
          "Flow name can only contain letters, numbers, spaces, and underscores (_).",
      };
    }

    const currentChannel = CONNECTED_CHANNELS.find(
      (c) => c.id === selectedChannelId
    );
    const channelName = currentChannel?.name || "";

    const isDuplicate = existingFlows.some(
      (f) =>
        f.name.toLowerCase() === trimmed.toLowerCase() &&
        f.channel.toLowerCase() === channelName.toLowerCase()
    );

    if (isDuplicate) {
      return {
        isValid: false,
        message: `A flow named "${trimmed}" already exists on channel "${channelName}". Please use a unique name.`,
      };
    }

    return { isValid: true, message: null };
  }, [flowName, selectedChannelId, existingFlows]);

  // Selected Channel Object
  const selectedChannel = useMemo(() => {
    return (
      CONNECTED_CHANNELS.find((c) => c.id === selectedChannelId) ||
      CONNECTED_CHANNELS[0]
    );
  }, [selectedChannelId]);

  // Filter templates matching chosen category or show all with category filter
  const relevantTemplates = useMemo(() => {
    return STARTER_TEMPLATES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const activeTemplate = useMemo(() => {
    return (
      STARTER_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      relevantTemplates[0] ||
      STARTER_TEMPLATES[0]
    );
  }, [selectedTemplateId, relevantTemplates]);

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // validation
        setJsonInput(text);
        setJsonError(null);
      } catch (err: any) {
        setJsonError("Uploaded file is not valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleJson = () => {
    const sample = {
      version: "3.1",
      screens: [
        {
          id: "WELCOME_SCREEN",
          title: "Welcome to Customer Service",
          data: {},
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "Select Your Issue",
              },
              {
                type: "Dropdown",
                label: "Department",
                name: "dept",
                required: true,
                "data-source": [
                  { id: "sales", title: "Sales & Invoicing" },
                  { id: "tech", title: "Technical Support" },
                ],
              },
              {
                type: "Footer",
                label: "Continue",
                "on-click-action": {
                  name: "navigate",
                  next: { type: "screen", name: "CONFIRM_SCREEN" },
                },
              },
            ],
          },
        },
      ],
    };
    setJsonInput(JSON.stringify(sample, null, 2));
    setJsonError(null);
  };

  // Submission handler
  const handleCreateAndOpenBuilder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!flowName.trim()) {
      setFormError("Flow name is required.");
      return;
    }

    if (!nameValidation.isValid) {
      setFormError(nameValidation.message || "Invalid flow name.");
      return;
    }

    if (startingMethod === "import") {
      if (!jsonInput.trim()) {
        setJsonError("Please paste or upload a WhatsApp Flow JSON definition.");
        return;
      }
      try {
        JSON.parse(jsonInput);
      } catch {
        setJsonError("The provided JSON definition is invalid. Please fix syntax errors.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Step 1: Simulated Meta Graph API validation
      setRegistrationStep("Validating flow layout & screen structure...");
      await new Promise((r) => setTimeout(r, 450));

      // Step 2: Register with WhatsApp Cloud API
      setRegistrationStep("Registering Flow with Meta WhatsApp Business API...");
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Generating Unique Flow ID
      setRegistrationStep("Allocating unique WhatsApp Flow ID...");
      await new Promise((r) => setTimeout(r, 400));

      // Generate realistic numeric WhatsApp Flow ID (15-16 digits)
      const generatedFlowId = `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;

      // Prepare Screens according to starting method
      let screens: FlowScreen[] = [];
      if (startingMethod === "blank") {
        screens = [
          {
            id: "START_SCREEN",
            title: "Welcome Screen",
            components: [
              {
                id: "heading_start",
                type: "TextHeading",
                label: `${flowName.trim()}`,
                description: "Fill in the required information below.",
              },
              {
                id: "input_name",
                type: "TextInput",
                label: "Your Full Name",
                placeholder: "Enter name",
                required: true,
              },
              {
                id: "footer_start",
                type: "Footer",
                label: "Submit",
              },
            ],
            terminal: true,
          },
        ];
      } else if (startingMethod === "template") {
        screens = activeTemplate?.screens || [];
      } else if (startingMethod === "import") {
        try {
          const parsed = JSON.parse(jsonInput);
          screens = parsed.screens || [
            {
              id: "IMPORTED_SCREEN_1",
              title: "Imported Screen",
              components: [
                {
                  id: "import_head",
                  type: "TextHeading",
                  label: "Imported Flow Layout",
                },
                {
                  id: "import_footer",
                  type: "Footer",
                  label: "Continue",
                },
              ],
            },
          ];
        } catch {
          screens = [];
        }
      }

      const newFlow: Flow = {
        id: generatedFlowId,
        name: flowName.trim(),
        status: "DRAFT",
        channel: selectedChannel.name,
        channelId: selectedChannel.id,
        category: selectedCategory,
        startingMethod,
        templateId: startingMethod === "template" ? activeTemplate.id : undefined,
        screens,
        rawJson: startingMethod === "import" ? jsonInput : undefined,
        version: "3.1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responsesCount: 0,
      };

      await onCreateFlow(newFlow);

      // Final Step: Complete & Navigate to Builder
      setRegistrationStep("Flow registered in DRAFT state! Opening builder...");
      await new Promise((r) => setTimeout(r, 350));

      onClose();
      onNavigateToBuilder(generatedFlowId);
    } catch (err: any) {
      setFormError(err?.message || "Failed to register flow with WhatsApp API.");
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    if (isSubmitting) return;
    setFlowName("");
    setJsonInput("");
    setJsonError(null);
    setFormError(null);
    setStartingMethod("blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4.5 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Create New WhatsApp Flow
                </h3>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px] font-semibold"
                >
                  WhatsApp Mini-Apps
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set up interactive native screens, forms, or booking steps inside WhatsApp.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAndClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleCreateAndOpenBuilder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Section: Flow Name & Channel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Flow Name (Required) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="flowName" className="text-xs font-bold text-foreground">
                  Flow Name <span className="text-destructive">*</span>
                </Label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    flowName.length > MAX_NAME_LENGTH
                      ? "text-destructive font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {flowName.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="flowName"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  placeholder="e.g. clinic_appointment_booking"
                  className={cn(
                    "h-10 text-sm",
                    flowName && !nameValidation.isValid && "border-destructive focus-visible:ring-destructive",
                    flowName && nameValidation.isValid && "border-emerald-500 focus-visible:ring-emerald-500"
                  )}
                  disabled={isSubmitting}
                  required
                />
                {flowName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nameValidation.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Only alphanumeric characters, spaces, and underscores. (e.g.{" "}
                <span className="font-mono text-foreground/80">car_service_booking</span>)
              </p>
              {flowName && !nameValidation.isValid && nameValidation.message && (
                <p className="text-[11px] text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {nameValidation.message}
                </p>
              )}
            </div>

            {/* 2. Linked Channel Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="channelSelect" className="text-xs font-bold text-foreground">
                  Linked WhatsApp Account / Channel <span className="text-destructive">*</span>
                </Label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live WABA Connected
                </span>
              </div>
              <div className="relative">
                <select
                  id="channelSelect"
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  {CONNECTED_CHANNELS.map((chan) => (
                    <option key={chan.id} value={chan.id}>
                      {chan.name} ({chan.phoneNumber})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Select the verified WhatsApp Business Number to register this flow.
              </p>
            </div>
          </div>

          {/* 3. Flow Category */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">
              Flow Category <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <div
                    key={cat.label}
                    onClick={() => !isSubmitting && setSelectedCategory(cat.label)}
                    className={cn(
                      "group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border group-hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-bold truncate",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {cat.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Template / Starting Method (Selectable Cards) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
                Starting Method <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Choose how you want to initialize your screens
              </span>
            </div>

            {/* 3 Main Method Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option A: Start Blank */}
              <div
                onClick={() => !isSubmitting && setStartingMethod("blank")}
                className={cn(
                  "relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  startingMethod === "blank"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        startingMethod === "blank"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </div>
                    {startingMethod === "blank" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground mt-3">Start Blank</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Initializes a clean canvas with a default starter screen to build custom forms from scratch.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit mt-3 text-[10px]">
                  Clean Canvas
                </Badge>
              </div>

              {/* Option B: Use Pre-built Template */}
              <div
                onClick={() => !isSubmitting && setStartingMethod("template")}
                className={cn(
                  "relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  startingMethod === "template"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        startingMethod === "template"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>
                    {startingMethod === "template" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground mt-3">Use Template</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Pick a battle-tested industry layout with date pickers, dropdowns, and confirmation steps.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit mt-3 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 font-semibold"
                >
                  {relevantTemplates.length} Available in Category
                </Badge>
              </div>

              {/* Option C: Import Flow Definition */}
              <div
                onClick={() => !isSubmitting && setStartingMethod("import")}
                className={cn(
                  "relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  startingMethod === "import"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        startingMethod === "import"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <FileCode className="h-4 w-4" />
                    </div>
                    {startingMethod === "import" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground mt-3">Import JSON</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Paste raw WhatsApp Flow JSON or upload screen definitions exported from Meta Developer portal.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit mt-3 text-[10px]">
                  Developer Schema
                </Badge>
              </div>
            </div>

            {/* Template Selection Sub-panel */}
            {startingMethod === "template" && (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-muted/30 p-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Select a Starter Layout for "{selectedCategory}"
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Pre-configured {activeTemplate?.screensCount || 3} native screens
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STARTER_TEMPLATES.map((tmpl) => {
                    const isTmplSelected = selectedTemplateId === tmpl.id;
                    const isMatchedCategory = tmpl.category === selectedCategory;

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={cn(
                          "flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer",
                          isTmplSelected
                            ? "border-primary bg-card ring-1 ring-primary shadow-xs"
                            : "border-border/80 bg-card/70 hover:bg-card hover:border-border"
                        )}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-xs text-foreground">
                              {tmpl.title}
                            </h5>
                            {tmpl.badge && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 shrink-0 font-semibold"
                              >
                                {tmpl.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {tmpl.description}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                          <span className="font-medium">{tmpl.screensCount} Screens Included</span>
                          {isTmplSelected ? (
                            <span className="font-bold text-primary flex items-center gap-0.5">
                              <Check className="h-3 w-3" /> Selected
                            </span>
                          ) : (
                            <span className="text-muted-foreground hover:text-foreground">Click to select</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Import JSON Sub-panel */}
            {startingMethod === "import" && (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-muted/30 p-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Paste WhatsApp Flow JSON Specification
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLoadSampleJson}
                      className="h-7 text-[11px] px-2 gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" /> Load Sample Schema
                    </Button>
                    <label className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium rounded-md border border-input bg-card hover:bg-muted cursor-pointer">
                      <Upload className="h-3 w-3" /> Upload .JSON
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      if (jsonError) setJsonError(null);
                    }}
                    placeholder={`{\n  "version": "3.1",\n  "screens": [\n    {\n      "id": "WELCOME_SCREEN",\n      "title": "Welcome"\n    }\n  ]\n}`}
                    className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {jsonError && (
                  <p className="text-xs text-destructive flex items-center gap-1.5 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {jsonError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Registration Progress Indicator (during submission) */}
          {isSubmitting && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Provider Handshake & Flow Registration
                </span>
                <span className="font-mono text-[11px]">Meta Graph API v20.0</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                &gt; {registrationStep}
              </p>
            </div>
          )}

          {/* Top Form Error */}
          {formError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAndClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="default"
              disabled={isSubmitting}
              className="h-10 px-5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-sm cursor-pointer gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering Flow...</span>
                </>
              ) : (
                <>
                  <span>Create & Open Builder</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
