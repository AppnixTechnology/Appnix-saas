import React, { useState } from "react";
import {
  X,
  Smartphone,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Send,
  Sparkles,
  Info,
} from "lucide-react";
import { Flow, FlowScreen } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FlowSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  flow: Flow | null;
}

export function FlowSimulatorModal({
  isOpen,
  onClose,
  flow,
}: FlowSimulatorModalProps) {
  if (!isOpen || !flow) return null;

  const screens: FlowScreen[] = flow.screens || [
    {
      id: "DEFAULT_SCREEN",
      title: "Flow Screen",
      components: [
        {
          id: "head_1",
          type: "TextHeading",
          label: flow.name,
          description: "This is a live preview of your WhatsApp Flow.",
        },
        {
          id: "input_1",
          type: "TextInput",
          label: "Full Name",
          placeholder: "e.g. John Doe",
          required: true,
        },
        {
          id: "footer_1",
          type: "Footer",
          label: "Submit Information",
        },
      ],
      terminal: true,
    },
  ];

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const activeScreen = screens[currentScreenIndex] || screens[0];

  const handleInputChange = (fieldName: string, value: any) => {
    setFormResponses((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleNextScreen = () => {
    if (activeScreen.terminal || currentScreenIndex >= screens.length - 1) {
      setIsCompleted(true);
    } else {
      setCurrentScreenIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentScreenIndex(0);
    setFormResponses({});
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Native WhatsApp Mobile Mockup */}
        <div className="flex-1 bg-muted/40 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border">
          {/* Smartphone Frame */}
          <div className="w-[310px] h-[540px] bg-background rounded-[36px] border-4 border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col relative">
            {/* Phone Notch & Status Bar */}
            <div className="h-6 bg-slate-900 flex items-center justify-between px-5 text-[10px] text-slate-400 select-none">
              <span>9:41</span>
              <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-emerald-700 text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                {currentScreenIndex > 0 && !isCompleted ? (
                  <button
                    onClick={() => setCurrentScreenIndex((p) => Math.max(0, p - 1))}
                    className="p-1 hover:bg-emerald-800 rounded-full cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="w-2" />
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-xs truncate leading-tight">
                    {flow.name}
                  </h4>
                  <p className="text-[10px] opacity-80 truncate">
                    {flow.channel} • WhatsApp Flow
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded">
                Screen {currentScreenIndex + 1}/{screens.length}
              </span>
            </div>

            {/* Interactive Screen Canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background">
              {isCompleted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3 animate-in zoom-in-90 duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">
                    Flow Completed Successfully!
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Payload transmitted to WhatsApp Business Webhook Endpoint.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-1.5 text-xs cursor-pointer mt-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restart Flow
                  </Button>
                </div>
              ) : (
                activeScreen.components.map((comp) => {
                  switch (comp.type) {
                    case "TextHeading":
                      return (
                        <div key={comp.id} className="space-y-1">
                          <h4 className="font-extrabold text-sm text-foreground leading-snug">
                            {comp.label}
                          </h4>
                          {comp.description && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {comp.description}
                            </p>
                          )}
                        </div>
                      );

                    case "TextBody":
                      return (
                        <p key={comp.id} className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                          {comp.label}
                        </p>
                      );

                    case "TextInput":
                      return (
                        <div key={comp.id} className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {comp.label} {comp.required && <span className="text-destructive">*</span>}
                          </Label>
                          <Input
                            placeholder={comp.placeholder || "Enter value"}
                            value={formResponses[comp.name || comp.id] || ""}
                            onChange={(e) =>
                              handleInputChange(comp.name || comp.id, e.target.value)
                            }
                            className="h-8 text-xs bg-muted/30"
                          />
                        </div>
                      );

                    case "TextArea":
                      return (
                        <div key={comp.id} className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {comp.label}
                          </Label>
                          <textarea
                            rows={3}
                            placeholder={comp.placeholder || "Enter notes"}
                            value={formResponses[comp.name || comp.id] || ""}
                            onChange={(e) =>
                              handleInputChange(comp.name || comp.id, e.target.value)
                            }
                            className="w-full rounded-md border border-input bg-muted/30 p-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </div>
                      );

                    case "Dropdown":
                      return (
                        <div key={comp.id} className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {comp.label} {comp.required && <span className="text-destructive">*</span>}
                          </Label>
                          <select
                            value={formResponses[comp.name || comp.id] || ""}
                            onChange={(e) =>
                              handleInputChange(comp.name || comp.id, e.target.value)
                            }
                            className="w-full h-8 rounded-md border border-input bg-muted/30 px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">Select an option...</option>
                            {comp.options?.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      );

                    case "RadioGroup":
                      return (
                        <div key={comp.id} className="space-y-1.5">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {comp.label} {comp.required && <span className="text-destructive">*</span>}
                          </Label>
                          <div className="space-y-1">
                            {comp.options?.map((opt) => {
                              const isChecked =
                                formResponses[comp.name || comp.id] === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  onClick={() =>
                                    handleInputChange(comp.name || comp.id, opt.id)
                                  }
                                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                    isChecked
                                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold"
                                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="h-3 w-3 text-emerald-600"
                                  />
                                  <span className="truncate">{opt.title}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );

                    case "DatePicker":
                      return (
                        <div key={comp.id} className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">
                            {comp.label}
                          </Label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={
                                formResponses[comp.name || comp.id] ||
                                new Date().toISOString().split("T")[0]
                              }
                              onChange={(e) =>
                                handleInputChange(comp.name || comp.id, e.target.value)
                              }
                              className="h-8 text-xs bg-muted/30"
                            />
                          </div>
                          {comp.helperText && (
                            <span className="text-[10px] text-muted-foreground">
                              {comp.helperText}
                            </span>
                          )}
                        </div>
                      );

                    case "Footer":
                      return (
                        <div key={comp.id} className="pt-2">
                          <Button
                            type="button"
                            onClick={handleNextScreen}
                            className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                          >
                            {comp.label || "Continue"}
                          </Button>
                        </div>
                      );

                    default:
                      return null;
                  }
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Flow Debug Inspector & Actions */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Flow Live Simulator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Test interactive screens in real-time
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Flow Info */}
            <div className="rounded-xl bg-muted/40 p-3.5 border border-border/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Flow Name:</span>
                <span className="font-bold text-foreground truncate max-w-[140px]">
                  {flow.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Flow ID:</span>
                <span className="font-mono text-[10px] text-primary">{flow.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Category:</span>
                <Badge variant="outline" className="text-[10px] py-0">
                  {flow.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Status:</span>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-700 border-blue-500/20 text-[10px] py-0 font-semibold"
                >
                  {flow.status}
                </Badge>
              </div>
            </div>

            {/* Captured Data Payload Inspector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-primary" />
                Live Captured Form State:
              </Label>
              <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                {JSON.stringify(formResponses, null, 2)}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset State
            </Button>

            <Button
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold cursor-pointer"
            >
              Done Testing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
