"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Code2, Plus, Trash2, Search, X, User, MessageSquare, Send, Bot, Layers } from "lucide-react";
import { BotVariable, BotChannel } from "@/components/bots/types";

interface VariablePickerProps {
  variables: BotVariable[];
  channels: BotChannel[];
  onSelectVariable: (variable: string) => void;
  onAddVariable: (variable: Omit<BotVariable, "id">) => void;
  onDeleteVariable: (variableId: string) => void;
}

const SYSTEM_VARIABLES = [
  { name: "contact.name", label: "Customer Full Name", type: "text", category: "contact" },
  { name: "contact.phone", label: "Phone Number", type: "text", category: "contact" },
  { name: "contact.email", label: "Email Address", type: "text", category: "contact" },
  { name: "contact.country", label: "Country", type: "text", category: "contact" },
  { name: "message.text", label: "Latest Inbound Message", type: "text", category: "message" },
  { name: "message.id", label: "WhatsApp Message ID", type: "text", category: "message" },
  { name: "conversation.channel", label: "Channel (WhatsApp/Instagram/RCS)", type: "text", category: "conversation" },
  { name: "ai.response", label: "Generated AI Response", type: "text", category: "flow" },
];

export function VariablePicker({
  variables,
  onSelectVariable,
  onAddVariable,
  onDeleteVariable,
}: VariablePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const [newVarType, setNewVarType] = useState<any>("text");

  const handleAdd = () => {
    if (!newVarName.trim()) return;
    onAddVariable({
      name: newVarName.trim(),
      type: newVarType,
      scope: "flow",
      description: "Custom flow variable",
    });
    setNewVarName("");
    setShowAddCustom(false);
  };

  const allVars = [
    ...SYSTEM_VARIABLES,
    ...variables.map((v) => ({
      name: v.name,
      label: v.description || v.name,
      type: v.type,
      category: "custom",
      id: v.id,
    })),
  ];

  const filtered = allVars.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-card p-3 shadow-md w-72 space-y-2.5">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
          <Code2 className="h-4 w-4 text-primary" />
          <span>Variable Manager</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="h-6 text-[11px] px-2 text-primary"
        >
          <Plus className="h-3 w-3 mr-1" /> New
        </Button>
      </div>

      {showAddCustom && (
        <div className="p-2 border rounded-lg bg-muted/20 space-y-2 text-xs">
          <Input
            placeholder="variableName (e.g. orderId)"
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            className="h-7 text-xs"
          />
          <div className="flex items-center gap-2">
            <Select value={newVarType} onValueChange={setNewVarType}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search variables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-7 text-xs bg-background"
        />
      </div>

      <ScrollArea className="max-h-56">
        <div className="space-y-1">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectVariable(item.name)}
              className="w-full px-2 py-1.5 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold text-primary truncate">{`{{${item.name}}}`}</p>
                <p className="text-[10px] text-muted-foreground truncate">{item.label}</p>
              </div>
              <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                {item.type}
              </Badge>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}