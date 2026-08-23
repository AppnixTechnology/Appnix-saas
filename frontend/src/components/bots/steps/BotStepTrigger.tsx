"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Search,
  MousePointer,
  List,
  Zap,
  Play,
  UserPlus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { BotTriggerType, BotTrigger } from "@/components/bots/types";

interface BotStepTriggerProps {
  trigger: BotTrigger;
  updateTrigger: (trigger: BotTrigger) => void;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSaveDraft: () => Promise<void>;
  isSaving: boolean;
}

const TRIGGER_ITEMS: Array<{
  type: BotTriggerType;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    type: "incoming_message",
    label: "Incoming Message",
    description: "Triggered whenever a customer sends any inbound message",
    icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
  },
  {
    type: "keyword",
    label: "Keyword Trigger",
    description: "Triggered when message matches specific keywords (e.g. price, refund, support)",
    icon: <Search className="h-4 w-4 text-blue-600" />,
  },
  {
    type: "button_click",
    label: "Button / Quick Reply Click",
    description: "Triggered when a customer clicks a button on an interactive message",
    icon: <MousePointer className="h-4 w-4 text-purple-600" />,
  },
  {
    type: "list_selection",
    label: "List Menu Selection",
    description: "Triggered when a customer selects an option from a WhatsApp list",
    icon: <List className="h-4 w-4 text-amber-600" />,
  },
  {
    type: "webhook",
    label: "External Webhook Event",
    description: "Triggered when your backend, CRM, or Shopify posts a webhook payload",
    icon: <Zap className="h-4 w-4 text-indigo-600" />,
  },
  {
    type: "conversation_started",
    label: "Conversation Started",
    description: "Triggered immediately when a new user opens a conversation session",
    icon: <Play className="h-4 w-4 text-rose-600" />,
  },
];

export function BotStepTrigger({
  trigger,
  updateTrigger,
  canProceed,
  onNext,
  onPrev,
  onSaveDraft,
  isSaving,
}: BotStepTriggerProps) {
  const [selectedType, setSelectedType] = useState<BotTriggerType>(
    trigger?.type || "incoming_message"
  );
  const [keywords, setKeywords] = useState<string>(
    (trigger?.config?.keywords as string) || "price, cost, plan, pricing"
  );
  const [matchType, setMatchType] = useState<string>(
    (trigger?.config?.matchType as string) || "contains"
  );

  const handleSelect = (type: BotTriggerType) => {
    setSelectedType(type);
    updateTrigger({
      type,
      config: type === "keyword" ? { keywords, matchType } : {},
    });
  };

  const handleKeywordChange = (text: string) => {
    setKeywords(text);
    updateTrigger({
      type: "keyword",
      config: { keywords: text, matchType },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-bold text-foreground">Select Primary Trigger Event</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Define how this botflow is initiated when customer traffic arrives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {TRIGGER_ITEMS.map((item) => {
            const isSelected = selectedType === item.type;

            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSelect(item.type)}
                className={cn(
                  "p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer bg-card",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-border/80"
                )}
              >
                <div className="p-2 rounded-xl bg-background border shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-foreground truncate">{item.label}</p>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trigger Specific Configuration Card */}
      {selectedType === "keyword" && (
        <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
          <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-primary" />
            Keyword Trigger Rules
          </h4>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Keywords (comma separated)</Label>
            <Input
              value={keywords}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="e.g. price, demo, support, refund, discount"
              className="text-xs h-9 bg-background font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Match Logic</Label>
            <Select value={matchType} onValueChange={setMatchType}>
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains (e.g. "What is your price?")</SelectItem>
                <SelectItem value="exact">Exact match only (e.g. "price")</SelectItem>
                <SelectItem value="starts_with">Starts with keyword</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onPrev} className="text-xs">
          ← Back to Channels
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="text-xs"
          >
            Save Draft
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Open Visual Flow Builder →
          </Button>
        </div>
      </div>
    </div>
  );
}