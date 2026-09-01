"use client";

import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Handle,
  Position,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  ConnectionMode,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
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
  Send,
  ArrowRight,
  MessageCircle,
  Brain,
  Zap,
  ArrowRightFromLine,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  LayoutDashboard,
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Save,
  Play,
  Bug,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Edit3,
  Eye,
  Share2,
  Download,
  Upload,
  History,
  MousePointer,
  Clock,
  UserPlus,
  Shield,
  CreditCard,
  Mail,
  Ticket,
  UserCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  NodeDefinition,
  BotNode,
  BotConnection,
  BotWorkflow,
  NodeCategory,
  NodeType,
  BotVariable,
  BotChannel,
} from "@/components/bots/types";
import { NodeLibrary } from "./NodeLibrary";
import { NodeInspector } from "./NodeInspector";
import { Toolbar } from "./Toolbar";
import { VariablePicker } from "./VariablePicker";
import { TestSimulator } from "./TestSimulator";
import { PublishDialog } from "./PublishDialog";
import { useUndoRedo } from "./useUndoRedo";
import "@xyflow/react/dist/style.css";

export const NODE_DEFINITIONS: Record<NodeType, NodeDefinition> = {
  incoming_message: { type: "incoming_message", category: "triggers", label: "Incoming Message", description: "Trigger on any customer message", icon: "MessageSquare", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger", multiple: true }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  keyword: { type: "keyword", category: "triggers", label: "Keyword", description: "Trigger on keyword match", icon: "Search", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "Matched", type: "trigger" }, { id: "no-match", label: "No Match", type: "trigger" }], configSchema: { fields: [{ key: "keywords", label: "Keywords", type: "textarea", required: true }, { key: "matchType", label: "Match Type", type: "select", options: [{ value: "exact", label: "Exact" }, { value: "contains", label: "Contains" }, { value: "starts_with", label: "Starts With" }] }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  button_click: { type: "button_click", category: "triggers", label: "Button Click", description: "Trigger on button click", icon: "MousePointer", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger", multiple: true }], configSchema: { fields: [{ key: "buttonId", label: "Button ID", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "facebook"] },
  list_selection: { type: "list_selection", category: "triggers", label: "List Selection", description: "Trigger on list selection", icon: "List", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger", multiple: true }], configSchema: { fields: [{ key: "listId", label: "List ID", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram"] },
  webhook_trigger: { type: "webhook_trigger", category: "triggers", label: "Webhook", description: "Trigger from external webhook", icon: "Zap", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger", multiple: true }], configSchema: { fields: [{ key: "webhookUrl", label: "Webhook URL", type: "url", required: true }, { key: "secret", label: "Secret", type: "text" }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  conversation_started: { type: "conversation_started", category: "triggers", label: "Conversation Started", description: "Trigger on new conversation", icon: "Play", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  contact_created: { type: "contact_created", category: "triggers", label: "Contact Created", description: "Trigger on new contact", icon: "UserPlus", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  scheduled: { type: "scheduled", category: "triggers", label: "Scheduled", description: "Trigger on schedule", icon: "Clock", color: "bg-emerald-500", inputs: [], outputs: [{ id: "out", label: "", type: "trigger" }], configSchema: { fields: [{ key: "cron", label: "Cron Expression", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },

  text_message: { type: "text_message", category: "messages", label: "Text Message", description: "Send formatted text response", icon: "MessageSquare", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "text", label: "Message Content", type: "textarea", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  image: { type: "image", category: "messages", label: "Image", description: "Send image attachment", icon: "Image", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "url", label: "Image URL", type: "url", required: true }, { key: "caption", label: "Caption", type: "text" }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  video: { type: "video", category: "messages", label: "Video", description: "Send video message", icon: "Video", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "url", label: "Video URL", type: "url", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  audio: { type: "audio", category: "messages", label: "Audio", description: "Send audio note", icon: "FileAudio", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "url", label: "Audio URL", type: "url", required: true }] }, supportedChannels: ["whatsapp", "instagram"] },
  document: { type: "document", category: "messages", label: "Document", description: "Send PDF or file", icon: "FileText", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "url", label: "Document URL", type: "url", required: true }, { key: "filename", label: "File Name", type: "text" }] }, supportedChannels: ["whatsapp", "instagram"] },
  template_message: { type: "template_message", category: "messages", label: "Template Message", description: "Send Meta approved WhatsApp template", icon: "LayoutTemplate", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [{ key: "templateName", label: "Template Name", type: "text", required: true }] }, supportedChannels: ["whatsapp"] },
  button_message: { type: "button_message", category: "messages", label: "Button Message", description: "Send message with action buttons", icon: "SquareMenu", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "btn1", label: "Button 1", type: "action" }, { id: "btn2", label: "Button 2", type: "action" }], configSchema: { fields: [{ key: "text", label: "Body", type: "textarea", required: true }] }, supportedChannels: ["whatsapp", "instagram", "facebook"] },
  list_message: { type: "list_message", category: "messages", label: "List Message", description: "Send interactive selection menu", icon: "List", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "opt1", label: "Option 1", type: "action" }, { id: "opt2", label: "Option 2", type: "action" }], configSchema: { fields: [{ key: "title", label: "Menu Title", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram"] },
  carousel: { type: "carousel", category: "messages", label: "Carousel", description: "Send swipeable card deck", icon: "LayoutTemplate", color: "bg-blue-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action", multiple: true }], configSchema: { fields: [] }, supportedChannels: ["instagram", "facebook"] },

  condition: { type: "condition", category: "logic", label: "Condition", description: "Branch flow based on variables", icon: "GitCompare", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "true", label: "True (Yes)", type: "condition" }, { id: "false", label: "False (No)", type: "condition" }], configSchema: { fields: [{ key: "conditions", label: "Rules", type: "condition_builder", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  switch: { type: "switch", category: "logic", label: "Switch", description: "Multi-branch based on value", icon: "ToggleLeft", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "case1", label: "Case 1", type: "condition" }, { id: "default", label: "Default", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  random_split: { type: "random_split", category: "logic", label: "Random Split", description: "Randomly split traffic", icon: "Shuffle", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "a", label: "50%", type: "condition" }, { id: "b", label: "50%", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  ab_test: { type: "ab_test", category: "logic", label: "A/B Test", description: "Run variant split test", icon: "GitBranch", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "varA", label: "Variant A", type: "condition" }, { id: "varB", label: "Variant B", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  user_attribute: { type: "user_attribute", category: "logic", label: "User Attribute", description: "Branch by contact field", icon: "UserCheck", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "matched", label: "Matched", type: "condition" }, { id: "unmatched", label: "Unmatched", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  contact_tag: { type: "contact_tag", category: "logic", label: "Contact Tag", description: "Check if tag exists", icon: "TagIcon", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "has_tag", label: "Has Tag", type: "condition" }, { id: "no_tag", label: "No Tag", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  variable_check: { type: "variable_check", category: "logic", label: "Variable Check", description: "Check runtime variable", icon: "Search", color: "bg-amber-500", inputs: [{ id: "in", label: "", type: "condition" }], outputs: [{ id: "valid", label: "Valid", type: "condition" }, { id: "invalid", label: "Invalid", type: "condition" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },

  ask_question: { type: "ask_question", category: "input", label: "Ask Question", description: "Prompt question & wait for reply", icon: "HelpCircle", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "answered", label: "Answered", type: "action" }, { id: "timeout", label: "Timeout", type: "action" }], configSchema: { fields: [{ key: "question", label: "Question", type: "textarea", required: true }, { key: "variable", label: "Save into Variable", type: "variable_picker", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  wait_for_reply: { type: "wait_for_reply", category: "input", label: "Wait for Reply", description: "Halt flow until customer sends message", icon: "Loader2", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "received", label: "Received", type: "action" }, { id: "timeout", label: "Timeout", type: "action" }], configSchema: { fields: [{ key: "timeoutHours", label: "Timeout (Hours)", type: "number" }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  capture_text: { type: "capture_text", category: "input", label: "Capture Text", description: "Capture plain text string", icon: "FileText", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "variable", label: "Target Variable", type: "variable_picker", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  capture_number: { type: "capture_number", category: "input", label: "Capture Number", description: "Capture validated number", icon: "Search", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "valid", label: "Valid", type: "action" }, { id: "invalid", label: "Invalid", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  capture_email: { type: "capture_email", category: "input", label: "Capture Email", description: "Capture validated email address", icon: "Mail", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "valid", label: "Valid Email", type: "action" }, { id: "invalid", label: "Invalid", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  capture_date: { type: "capture_date", category: "input", label: "Capture Date", description: "Capture date string", icon: "Clock", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  capture_option: { type: "capture_option", category: "input", label: "Capture Option", description: "Capture choice selection", icon: "List", color: "bg-orange-500", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },

  ai_reply: { type: "ai_reply", category: "ai", label: "AI Reply", description: "Generate dynamic OpenAI GPT response", icon: "Brain", color: "bg-purple-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "success", label: "Responded", type: "action" }, { id: "fallback", label: "Low Confidence", type: "action" }], configSchema: { fields: [{ key: "prompt", label: "Custom AI Prompt", type: "ai_instructions", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAI: true },
  ai_intent_detection: { type: "ai_intent_detection", category: "ai", label: "AI Intent Detection", description: "Classify intent (Sales, Support, Refund)", icon: "Brain", color: "bg-purple-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "sales", label: "Sales", type: "action" }, { id: "support", label: "Support", type: "action" }, { id: "refund", label: "Refund", type: "action" }, { id: "other", label: "Other", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAI: true },
  ai_classification: { type: "ai_classification", category: "ai", label: "AI Classification", description: "Tag or bucket customer query", icon: "Brain", color: "bg-purple-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAI: true },
  ai_summarization: { type: "ai_summarization", category: "ai", label: "AI Summarization", description: "Summarize chat history into notes", icon: "Brain", color: "bg-purple-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAI: true },
  ai_agent: { type: "ai_agent", category: "ai", label: "Autonomous AI Agent", description: "Autonomous multi-turn agent with tools", icon: "Brain", color: "bg-purple-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "resolved", label: "Resolved", type: "action" }, { id: "escalated", label: "Escalated", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAI: true },

  http_request: { type: "http_request", category: "actions", label: "HTTP Request", description: "Call external REST API (GET, POST, PUT)", icon: "Zap", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "success", label: "200 OK", type: "action" }, { id: "error", label: "Error (4xx/5xx)", type: "action" }], configSchema: { fields: [{ key: "url", label: "Endpoint URL", type: "url", required: true }, { key: "method", label: "Method", type: "select", options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }, { value: "PUT", label: "PUT" }, { value: "DELETE", label: "DELETE" }] }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"], requiresAPI: true },
  webhook: { type: "webhook", category: "actions", label: "Trigger Webhook", description: "Send data payload to external URL", icon: "Zap", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "url", label: "Webhook URL", type: "url", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  update_contact: { type: "update_contact", category: "actions", label: "Update Contact", description: "Update CRM contact attributes", icon: "UserCheck2", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  add_tag: { type: "add_tag", category: "actions", label: "Add Tag", description: "Attach tag to contact (e.g. VIP, Hot Lead)", icon: "TagIcon", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "tag", label: "Tag Name", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  remove_tag: { type: "remove_tag", category: "actions", label: "Remove Tag", description: "Remove tag from contact", icon: "TagIcon", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "tag", label: "Tag Name", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  set_variable: { type: "set_variable", category: "actions", label: "Set Variable", description: "Assign runtime variable value", icon: "Zap", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "variable", label: "Variable", type: "variable_picker", required: true }, { key: "value", label: "Value", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  send_email: { type: "send_email", category: "actions", label: "Send Email", description: "Send automated email notification", icon: "Mail", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "to", label: "To Email", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  create_ticket: { type: "create_ticket", category: "actions", label: "Create Ticket", description: "Open customer support desk ticket", icon: "Ticket", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "subject", label: "Ticket Subject", type: "text", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  assign_agent: { type: "assign_agent", category: "actions", label: "Assign Agent", description: "Route chat to specific team member", icon: "UserCheck2", color: "bg-indigo-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  human_handoff: { type: "human_handoff", category: "actions", label: "Human Handoff", description: "Halt bot & escalate to Live Chat agent", icon: "ArrowRightFromLine", color: "bg-rose-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "transferred", label: "Transferred", type: "action" }], configSchema: { fields: [{ key: "reason", label: "Escalation Reason", type: "text" }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },

  delay: { type: "delay", category: "flow", label: "Delay", description: "Pause workflow execution", icon: "Clock", color: "bg-slate-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [{ key: "seconds", label: "Delay in Seconds", type: "number", required: true }] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  wait_until: { type: "wait_until", category: "flow", label: "Wait Until", description: "Wait until specific datetime", icon: "Clock", color: "bg-slate-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  go_to: { type: "go_to", category: "flow", label: "Go To", description: "Jump to target node", icon: "ArrowRight", color: "bg-slate-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [{ id: "out", label: "", type: "action" }], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
  end_flow: { type: "end_flow", category: "flow", label: "End Flow", description: "Terminate conversation session", icon: "Minus", color: "bg-slate-600", inputs: [{ id: "in", label: "", type: "action" }], outputs: [], configSchema: { fields: [] }, supportedChannels: ["whatsapp", "instagram", "rcs", "facebook"] },
};

// Shared style for every connection handle: a filled circle big enough to
// comfortably hold a centered plus icon and to grab/click on, instead of the
// default tiny xyflow dot.
const HANDLE_CIRCLE_CLASS =
  "!w-5 !h-5 !rounded-full !bg-primary !border-2 !border-background !shadow-sm flex items-center justify-center transition-transform hover:!scale-110";

function CustomNode({
  data,
  selected,
}: {
  data: BotNode["data"] & { id: string; type: NodeType; category?: NodeCategory };
  selected: boolean;
}) {
  const definition = NODE_DEFINITIONS[data.type] || {
    label: data.label || "Node",
    description: data.description || "",
    category: "messages",
    color: "bg-primary",
    icon: "MessageSquare",
    inputs: [{ id: "in", label: "", type: "action" }],
    outputs: [{ id: "out", label: "", type: "action" }],
  };

  const isTrigger = definition.category === "triggers";
  const hasError = data.validationStatus === "error";
  const hasWarning = data.validationStatus === "warning";
  const isDisabled = !data.enabled;

  return (
    <div
      className={cn(
        "min-w-[220px] max-w-[280px] rounded-xl border p-3.5 transition-all duration-200 bg-card shadow-md relative",
        hasError
          ? "border-destructive ring-1 ring-destructive"
          : hasWarning
          ? "border-amber-500 ring-1 ring-amber-500"
          : selected
          ? "border-primary ring-2 ring-primary/40 shadow-lg"
          : "border-border hover:border-border/80",
        isDisabled && "opacity-60"
      )}
    >
      {/* Target Input Handle (Left) — plus-circle instead of a plain dot */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className={cn(HANDLE_CIRCLE_CLASS, "!-left-2.5")}
          id="in"
        >
          <Plus className="h-3 w-3 text-primary-foreground pointer-events-none" />
        </Handle>
      )}

      {/* Header */}
      <div className="flex items-start gap-2.5 mb-2">
        <div className={cn("p-2 rounded-lg shrink-0 text-white shadow-xs", definition.color)}>
          {definition.category === "triggers" && <Zap className="h-4 w-4" />}
          {definition.category === "messages" && <MessageSquare className="h-4 w-4" />}
          {definition.category === "logic" && <GitBranch className="h-4 w-4" />}
          {definition.category === "input" && <HelpCircle className="h-4 w-4" />}
          {definition.category === "ai" && <Brain className="h-4 w-4" />}
          {definition.category === "actions" && <Sparkles className="h-4 w-4" />}
          {definition.category === "flow" && <Clock className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className="font-bold text-xs text-foreground truncate">{data.label || definition.label}</p>
            {hasError && <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
            {data.validationStatus === "valid" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            {data.description || definition.description}
          </p>
        </div>
      </div>

      {/* Configuration Preview Snippet */}
      {data.config && Object.keys(data.config).length > 0 && (
        <div className="text-[10px] text-muted-foreground my-1.5 p-1.5 bg-muted/40 rounded border border-border/40 font-mono truncate">
          {String(data.config.text || data.config.url || data.config.prompt || data.config.keywords || "Configured")}
        </div>
      )}

      {/* Category Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
        <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 px-1 font-semibold">
          {definition.category}
        </Badge>
        <span className="text-muted-foreground">{data.enabled ? "Active" : "Disabled"}</span>
      </div>

      {/* Output Handles (Right) — plus-circles instead of plain dots */}
      {definition.outputs && definition.outputs.length > 0 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {definition.outputs.map((out, idx) => (
            <Handle
              key={out.id}
              type="source"
              position={Position.Right}
              className={cn(HANDLE_CIRCLE_CLASS, "!-right-2.5")}
              id={out.id}
              style={{
                top: `${((idx + 1) / (definition.outputs.length + 1)) * 100}%`,
              }}
            >
              <Plus className="h-3 w-3 text-primary-foreground pointer-events-none" />
            </Handle>
          ))}
        </div>
      )}
    </div>
  );
}

interface BotBuilderProps {
  workflow: BotWorkflow;
  onWorkflowChange: (workflow: BotWorkflow) => void;
  selectedNode: BotNode | null;
  onSelectNode: (node: BotNode | null) => void;
  variables: BotVariable[];
  channels: BotChannel[];
  isTestMode?: boolean;
  testResult?: { success: boolean; message: string } | null;
  onTest?: () => void;
  onSave?: () => Promise<void>;
  onPublish?: () => void;
  onValidate?: () => Promise<{ valid: boolean; errors: string[] }>;
  isSaving?: boolean;
  isPublishing?: boolean;
  validationResult?: { valid: boolean; errors: string[] };
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function BotBuilder({
  workflow,
  onWorkflowChange,
  selectedNode,
  onSelectNode,
  variables,
  channels,
  isTestMode = false,
  testResult,
  onTest,
  onSave,
  onPublish,
  onValidate,
  isSaving,
  isPublishing,
  validationResult,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: BotBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Sync incoming workflow prop to ReactFlow internal state
  useEffect(() => {
    if (workflow?.nodes) {
      const rfNodes: Node[] = workflow.nodes.map((n) => ({
        id: n.id,
        type: "custom",
        position: n.position || { x: 200, y: 200 },
        data: {
          id: n.id,
          type: n.type,
          category: n.category,
          ...n.data,
        },
      }));
      setNodes(rfNodes);
    }

    if (workflow?.connections) {
      const rfEdges: Edge[] = workflow.connections.map((c) => ({
        id: c.id,
        source: c.source,
        target: c.target,
        sourceHandle: c.sourceHandle,
        targetHandle: c.targetHandle,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      }));
      setEdges(rfEdges);
    }
  }, [workflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const next = addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        );

        const connections: BotConnection[] = next.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || undefined,
          targetHandle: e.targetHandle || undefined,
          type: "smoothstep",
          animated: true,
        }));

        onWorkflowChange({ ...workflow, connections });
        return next;
      });
    },
    [setEdges, onWorkflowChange, workflow]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = workflow.nodes.find((n) => n.id === node.id);
      if (found) {
        onSelectNode(found);
      }
    },
    [workflow.nodes, onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  const onNodesChangeHandler = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      setNodes((currentNodes) => {
        const updatedBotNodes: BotNode[] = currentNodes.map((n) => {
          const existing = workflow.nodes.find((bn) => bn.id === n.id);
          return {
            id: n.id,
            type: (n.data?.type as NodeType) || existing?.type || "text_message",
            category: (n.data?.category as NodeCategory) || existing?.category || "messages",
            position: n.position,
            data: {
              label: (n.data?.label as string) || existing?.data?.label || "Node",
              description: n.data?.description as string | undefined,
              config: (n.data?.config as Record<string, unknown>) || {},
              enabled: n.data?.enabled !== false,
              validationStatus: (n.data?.validationStatus as any) || "valid",
            },
          };
        });

        onWorkflowChange({ ...workflow, nodes: updatedBotNodes });
        return currentNodes;
      });
    },
    [onNodesChange, onWorkflowChange, setNodes, workflow]
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background w-full h-full">
      <div className="flex-1 relative w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          connectionMode={ConnectionMode.Loose}
          minZoom={0.2}
          maxZoom={2}
        >
          {showGrid && (
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-25" />
          )}
          <Controls showZoom showFitView className="bottom-4 left-4" />
          {showMinimap && (
            <MiniMap
              nodeColor={(node) => {
                const def = NODE_DEFINITIONS[node.data?.type as NodeType];
                return def?.color || "#3b82f6";
              }}
              maskColor="rgba(0,0,0,0.15)"
              className="bottom-4 right-4 rounded-xl border shadow-md"
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}