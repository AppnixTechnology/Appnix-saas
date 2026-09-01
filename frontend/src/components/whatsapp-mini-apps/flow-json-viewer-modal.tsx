import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode, Code2 } from "lucide-react";
import { Flow } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FlowJsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  flow: Flow | null;
}

export function FlowJsonViewerModal({
  isOpen,
  onClose,
  flow,
}: FlowJsonViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !flow) return null;

  const jsonPayload =
    flow.rawJson ||
    JSON.stringify(
      {
        version: flow.version || "3.1",
        screens:
          flow.screens?.map((s) => ({
            id: s.id,
            title: s.title,
            terminal: s.terminal || false,
            layout: {
              type: "SingleColumnLayout",
              children: s.components.map((c) => ({
                type: c.type,
                label: c.label,
                name: c.name || c.id,
                required: c.required || false,
                ...(c.options ? { "data-source": c.options } : {}),
                ...(c.placeholder ? { placeholder: c.placeholder } : {}),
              })),
            },
          })) || [],
      },
      null,
      2
    );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonPayload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${flow.name.replace(/\s+/g, "_")}_flow_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  WhatsApp Flow JSON Specification
                </h3>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  v3.1 Spec
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Raw layout definition registered with Meta WhatsApp Business API
              </p>
            </div>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              Flow ID: <strong className="text-foreground">{flow.id}</strong> ({flow.name})
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download .json
              </Button>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
            <pre className="font-mono text-xs text-emerald-400 overflow-x-auto max-h-[50vh] leading-relaxed">
              {jsonPayload}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-muted/10">
          <Button size="sm" onClick={onClose} className="text-xs font-semibold cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
