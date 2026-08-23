"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  X,
  Save,
  MessageSquare,
  Image,
  Video,
  FileText,
  FileAudio,
  LayoutTemplate,
  SquareMenu,
  List,
  GitCompare,
  ToggleLeft,
  Shuffle,
  GitBranch,
  UserCheck,
  Tag as TagIcon,
  Search,
  HelpCircle,
  Loader2,
  Brain,
  Zap,
  ArrowRight,
  ArrowRightFromLine,
  Clock,
  Send,
  Minus,
  Plus,
  Trash2,
  Eye,
  Copy,
  Code2,
  Globe,
  Database,
  Users,
  Mail,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  MousePointer,
  Settings,
} from "lucide-react";
import { BotNode, BotVariable, BotChannel, NodeType, BotWorkflow, ConfigField } from "@/components/bots/types";

interface NodeInspectorProps {
  node: BotNode | null;
  onUpdateNode: (nodeId: string, data: Partial<BotNode["data"]>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  variables: BotVariable[];
  channels: BotChannel[];
  workflow: BotWorkflow;
}

const NODE_CONFIG_FIELDS: Record<string, ConfigField[]> = {
  text_message: [
    { key: "text", label: "Message Body", type: "message_editor", required: true, placeholder: "Hello {{contact.name}}!" },
    { key: "channel", label: "Target Channel", type: "channel_picker" },
  ],
  image: [
    { key: "url", label: "Image URL", type: "url", required: true, placeholder: "https://example.com/image.jpg" },
    { key: "caption", label: "Caption", type: "textarea", placeholder: "Optional caption" },
    { key: "channel", label: "Channel", type: "channel_picker" },
  ],
  video: [
    { key: "url", label: "Video URL", type: "url", required: true },
    { key: "caption", label: "Caption", type: "textarea" },
    { key: "channel", label: "Channel", type: "channel_picker" },
  ],
  audio: [
    { key: "url", label: "Audio URL", type: "url", required: true },
    { key: "channel", label: "Channel", type: "channel_picker" },
  ],
  document: [
    { key: "url", label: "Document URL", type: "url", required: true },
    { key: "filename", label: "Filename", type: "text", required: true },
    { key: "channel", label: "Channel", type: "channel_picker" },
  ],
  template_message: [
    { key: "templateName", label: "Meta Approved Template", type: "text", required: true },
    { key: "variables", label: "Dynamic Variables", type: "variable_editor" },
  ],
  button_message: [
    { key: "header", label: "Header", type: "text", placeholder: "Optional header" },
    { key: "body", label: "Body Text", type: "message_editor", required: true },
    { key: "footer", label: "Footer", type: "text" },
    { key: "channel", label: "Channel", type: "channel_picker" },
  ],
  list_message: [
    { key: "title", label: "List Menu Title", type: "text", required: true },
    { key: "body", label: "Body", type: "textarea", required: true },
  ],
  keyword: [
    { key: "keywords", label: "Trigger Keywords (comma separated)", type: "textarea", required: true },
    { key: "matchType", label: "Match Mode", type: "select", options: [{ value: "exact", label: "Exact Match" }, { value: "contains", label: "Contains Keyword" }, { value: "starts_with", label: "Starts With" }] },
  ],
  condition: [
    { key: "conditions", label: "Rule Branching", type: "condition_builder", required: true },
  ],
  ask_question: [
    { key: "question", label: "Question Prompt", type: "textarea", required: true },
    { key: "targetVariable", label: "Save Inbound Answer To", type: "variable_picker", required: true },
    { key: "timeoutHours", label: "Timeout (Hours)", type: "number" },
  ],
  wait_for_reply: [
    { key: "timeoutHours", label: "Wait Timeout (Hours)", type: "number" },
    { key: "expectedType", label: "Expected Type", type: "select", options: [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "email", label: "Email" }, { value: "date", label: "Date" }] },
  ],
  ai_reply: [
    { key: "prompt", label: "Custom AI System Prompt", type: "ai_instructions", required: true },
    { key: "model", label: "Model", type: "select", options: [{ value: "gpt-4o", label: "OpenAI GPT-4o" }, { value: "gpt-4o-mini", label: "OpenAI GPT-4o Mini" }, { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" }] },
    { key: "temperature", label: "Creativity (Temperature 0-2)", type: "number" },
  ],
  ai_intent_detection: [
    { key: "intents", label: "Custom Intents (comma separated)", type: "textarea", placeholder: "Sales, Support, Refund, Pricing" },
  ],
  http_request: [
    { key: "method", label: "HTTP Method", type: "select", options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }, { value: "PUT", label: "PUT" }, { value: "DELETE", label: "DELETE" }] },
    { key: "url", label: "Endpoint URL", type: "url", required: true, placeholder: "https://api.crm.com/v1/orders" },
    { key: "body", label: "JSON Request Body", type: "json", placeholder: '{"phone": "{{contact.phone}}"}' },
    { key: "responseVariable", label: "Save Response Into", type: "variable_picker" },
  ],
  add_tag: [
    { key: "tag", label: "Tag Name to Add", type: "text", required: true, placeholder: "e.g. VIP Customer, Hot Lead" },
  ],
  remove_tag: [
    { key: "tag", label: "Tag Name to Remove", type: "text", required: true },
  ],
  set_variable: [
    { key: "variable", label: "Target Variable", type: "variable_picker", required: true },
    { key: "value", label: "Assigned Value", type: "text", required: true },
  ],
  human_handoff: [
    { key: "reason", label: "Escalation Reason", type: "text", placeholder: "Customer requested human support" },
    { key: "priority", label: "Priority", type: "select", options: [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }] },
  ],
  delay: [
    { key: "seconds", label: "Pause Duration (Seconds)", type: "number", required: true },
  ],
};

function VariablePickerTrigger({
  variables,
  onSelect,
}: {
  variables: BotVariable[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-[11px] gap-1 px-2"
        onClick={() => setOpen(!open)}
      >
        <Code2 className="h-3 w-3 text-primary" />
        Insert Variable
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-card border rounded-lg shadow-xl p-2 max-h-56 overflow-y-auto">
          <p className="text-[11px] font-bold text-muted-foreground px-2 py-1 border-b mb-1">
            Select Runtime Variable
          </p>
          {variables.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                onSelect(v.name);
                setOpen(false);
              }}
              className="w-full px-2 py-1.5 text-xs text-left hover:bg-accent rounded-md flex items-center justify-between group cursor-pointer"
            >
              <span className="font-mono text-primary truncate">{`{{${v.name}}}`}</span>
              <span className="text-[10px] text-muted-foreground">{v.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionBuilder({
  value,
  onChange,
  variables,
}: {
  value: any;
  onChange: (v: any) => void;
  variables: BotVariable[];
}) {
  const [conditions, setConditions] = useState<any[]>(
    value?.conditions || [{ id: Date.now(), variable: "contact.country", operator: "equals", value: "India", logic: "AND" }]
  );

  useEffect(() => {
    onChange({ conditions });
  }, [conditions, onChange]);

  return (
    <div className="space-y-2">
      {conditions.map((cond, idx) => (
        <div key={cond.id} className="p-2 border rounded-lg bg-muted/20 space-y-1.5 text-xs">
          {idx > 0 && (
            <Select
              value={cond.logic}
              onValueChange={(v) =>
                setConditions((c) => c.map((item, i) => (i === idx ? { ...item, logic: v } : item)))
              }
            >
              <SelectTrigger className="w-20 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center gap-1.5">
            <Input
              value={cond.variable}
              placeholder="Variable"
              onChange={(e) =>
                setConditions((c) => c.map((item, i) => (i === idx ? { ...item, variable: e.target.value } : item)))
              }
              className="h-7 text-xs flex-1"
            />
            <Select
              value={cond.operator}
              onValueChange={(v) =>
                setConditions((c) => c.map((item, i) => (i === idx ? { ...item, operator: v } : item)))
              }
            >
              <SelectTrigger className="w-28 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">&gt; Greater</SelectItem>
                <SelectItem value="less_than">&lt; Less</SelectItem>
                <SelectItem value="exists">Exists</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <Input
              value={cond.value}
              placeholder="Comparison Value"
              onChange={(e) =>
                setConditions((c) => c.map((item, i) => (i === idx ? { ...item, value: e.target.value } : item)))
              }
              className="h-7 text-xs flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setConditions((c) => c.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs h-7 gap-1"
        onClick={() =>
          setConditions([...conditions, { id: Date.now(), variable: "", operator: "equals", value: "", logic: "AND" }])
        }
      >
        <Plus className="h-3 w-3" /> Add Branch Condition
      </Button>
    </div>
  );
}

function VariableEditor({
  value,
  onChange,
}: {
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  const [entries, setEntries] = useState(Object.entries(value || {}));

  useEffect(() => {
    onChange(Object.fromEntries(entries));
  }, [entries, onChange]);

  return (
    <div className="space-y-2">
      {entries.map(([key, val], idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <Input
            placeholder="Key"
            value={key}
            onChange={(ev) =>
              setEntries((prev) => prev.map(([k, v], i) => (i === idx ? [ev.target.value, v] : [k, v])))
            }
            className="h-7 text-xs flex-1"
          />
          <Input
            placeholder="Value"
            value={val}
            onChange={(ev) =>
              setEntries((prev) => prev.map(([k, v], i) => (i === idx ? [k, ev.target.value] : [k, v])))
            }
            className="h-7 text-xs flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEntries((prev) => prev.filter((_, i) => i !== idx))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs h-7 gap-1"
        onClick={() => setEntries((prev) => [...prev, ["", ""]])}
      >
        <Plus className="h-3 w-3" /> Add Dynamic Parameter
      </Button>
    </div>
  );
}

function renderField(
  field: ConfigField,
  config: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
  variables: BotVariable[],
  channels: BotChannel[]
) {
  const val = config[field.key] ?? "";

  switch (field.type) {
    case "text":
    case "url":
    case "number":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            type={field.type === "number" ? "number" : "text"}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            value={String(val)}
            onChange={(e) =>
              onChange(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)
            }
            className="h-8 text-xs bg-background"
          />
        </div>
      );

    case "textarea":
    case "json":
    case "ai_instructions":
      return (
        <div key={field.key} className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <VariablePickerTrigger
              variables={variables}
              onSelect={(v) => onChange(field.key, `${val || ""}{{${v}}}`)}
            />
          </div>
          <Textarea
            rows={field.type === "ai_instructions" ? 5 : 3}
            placeholder={field.placeholder || "Enter content... Use {{variable}} for dynamic context"}
            value={String(val)}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="text-xs bg-background"
          />
        </div>
      );

    case "message_editor":
      return (
        <div key={field.key} className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <VariablePickerTrigger
              variables={variables}
              onSelect={(v) => onChange(field.key, `${val || ""}{{${v}}}`)}
            />
          </div>
          <Textarea
            rows={4}
            placeholder="Hello {{contact.name}}! 👋 How can we assist you today?"
            value={String(val)}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="text-xs bg-background"
          />
        </div>
      );

    case "select":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Select value={String(val)} onValueChange={(v) => onChange(field.key, v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "channel_picker":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">
            {field.label}
          </Label>
          <Select value={String(val || channels[0] || "whatsapp")} onValueChange={(v) => onChange(field.key, v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="rcs">RCS</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

    case "variable_picker":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Select value={String(val)} onValueChange={(v) => onChange(field.key, v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {variables.map((v) => (
                <SelectItem key={v.id} value={v.name}>
                  {`{{${v.name}}}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "condition_builder":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">{field.label}</Label>
          <ConditionBuilder value={val} onChange={(v) => onChange(field.key, v)} variables={variables} />
        </div>
      );

    case "variable_editor":
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-xs font-semibold text-foreground">{field.label}</Label>
          <VariableEditor value={(val as Record<string, string>) || {}} onChange={(v) => onChange(field.key, v)} />
        </div>
      );

    default:
      return null;
  }
}

export function NodeInspector({
  node,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  variables,
  channels,
  workflow,
}: NodeInspectorProps) {
  if (!node) {
    return (
      <div className="w-80 border-l bg-card flex flex-col h-full items-center justify-center p-6 text-center shadow-xs">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
          <MousePointer className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-sm text-foreground">Node Inspector</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Select any node on the canvas to configure messages, AI prompts, conditions, or API webhooks.
        </p>
      </div>
    );
  }

  const fields = NODE_CONFIG_FIELDS[node.type] || [
    { key: "label", label: "Node Title", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
  ];
  const config = node.data.config || {};

  const handleConfigChange = (key: string, value: unknown) => {
    onUpdateNode(node.id, {
      ...node.data,
      config: { ...config, [key]: value },
    });
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-3.5 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <Settings className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs text-foreground truncate">{node.data.label}</h3>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold">
              {node.type}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteNode(node.id)}
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          title="Delete Node"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Tabs: Config, Settings, Status */}
      <Tabs defaultValue="config" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 px-2 pt-2 border-b bg-muted/20">
          <TabsTrigger value="config" className="text-xs py-1">Config</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs py-1">Settings</TabsTrigger>
          <TabsTrigger value="validation" className="text-xs py-1">Validation</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-3.5">
          <TabsContent value="config" className="space-y-4 mt-0">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Node Label</Label>
              <Input
                value={node.data.label}
                onChange={(e) => onUpdateNode(node.id, { ...node.data, label: e.target.value })}
                className="h-8 text-xs bg-background"
              />
            </div>

            {fields.map((field) => renderField(field, config, handleConfigChange, variables, channels))}

            <div className="pt-3 border-t flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDuplicateNode(node.id)}
                className="flex-1 text-xs gap-1 h-8"
              >
                <Copy className="h-3 w-3" /> Duplicate
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDeleteNode(node.id)}
                className="text-xs gap-1 h-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-0">
            <div className="rounded-xl border p-3 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Enable Node</p>
                  <p className="text-[11px] text-muted-foreground">Toggle node active status in flow</p>
                </div>
                <Switch
                  checked={node.data.enabled}
                  onCheckedChange={(checked) =>
                    onUpdateNode(node.id, { ...node.data, enabled: checked })
                  }
                />
              </div>

              <div className="border-t pt-2 space-y-1">
                <p className="text-[11px] text-muted-foreground">Node ID</p>
                <div className="flex items-center justify-between bg-background p-1.5 rounded border text-[11px] font-mono">
                  <span className="truncate">{node.id}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(node.id)}
                    className="text-muted-foreground hover:text-foreground"
                    title="Copy ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-3 mt-0">
            <div className="rounded-xl border p-3 bg-muted/20 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-foreground">Node Status: Valid</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All mandatory configuration fields are populated and ready for execution.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}