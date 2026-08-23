"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Send,
  Image,
  Video,
  FileAudio,
  FileText,
  LayoutTemplate,
  SquareMenu,
  GitCompare,
  ToggleLeft,
  Shuffle,
  GitBranch,
  UserCheck,
  Tag as TagIcon,
  HelpCircle,
  Loader2,
  Brain,
  ArrowRight,
  ArrowRightFromLine,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  Ticket,
  UserCheck2,
} from "lucide-react";
import { NodeDefinition, NodeType, NodeCategory, BotChannel } from "@/components/bots/types";
import { NODE_DEFINITIONS } from "./BotBuilder";

const CATEGORY_ORDER: NodeCategory[] = [
  "triggers",
  "messages",
  "logic",
  "input",
  "ai",
  "actions",
  "flow",
];

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  triggers: "Triggers",
  messages: "Messages",
  logic: "Logic",
  input: "Input",
  ai: "AI",
  actions: "Actions",
  flow: "Flow",
};

const CATEGORY_ICONS: Record<NodeCategory, React.ReactNode> = {
  triggers: <Zap className="h-3.5 w-3.5" />,
  messages: <MessageSquare className="h-3.5 w-3.5" />,
  logic: <GitBranch className="h-3.5 w-3.5" />,
  input: <HelpCircle className="h-3.5 w-3.5" />,
  ai: <Brain className="h-3.5 w-3.5" />,
  actions: <Sparkles className="h-3.5 w-3.5" />,
  flow: <Clock className="h-3.5 w-3.5" />,
};

interface NodeLibraryProps {
  onAddNode: (type: NodeType) => void;
  activeChannels: BotChannel[];
  collapsed?: boolean;
  onToggleCollapse: () => void;
}

export function NodeLibrary({
  onAddNode,
  activeChannels,
  collapsed = false,
  onToggleCollapse,
}: NodeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<NodeCategory>("triggers");

  const filteredNodes = Object.values(NODE_DEFINITIONS).filter((node) => {
    const matchesSearch =
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel =
      node.supportedChannels.some((c) => activeChannels.includes(c)) || activeChannels.length === 0;
    return matchesSearch && matchesChannel;
  });

  const nodesByCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = filteredNodes.filter((n) => n.category === cat);
    return acc;
  }, {} as Record<NodeCategory, NodeDefinition[]>);

  if (collapsed) {
    return (
      <div className="w-12 border-r bg-card flex flex-col items-center py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleCollapse}
          title="Expand Node Library"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 sm:w-80 border-r bg-card flex flex-col h-full overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm text-foreground">Node Library</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onToggleCollapse}
          title="Collapse"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-2.5 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Categories Tab Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as NodeCategory)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-2 pt-2 border-b bg-muted/20">
          <div className="grid grid-cols-4 gap-1 pb-2">
            {CATEGORY_ORDER.slice(0, 4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors",
                  activeTab === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {CATEGORY_ICONS[cat]}
                <span className="truncate">{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 pb-2">
            {CATEGORY_ORDER.slice(4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors",
                  activeTab === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {CATEGORY_ICONS[cat]}
                <span className="truncate">{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-3">
          {CATEGORY_ORDER.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-2 mt-0">
              {nodesByCategory[cat]?.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No nodes found in this category
                </div>
              ) : (
                nodesByCategory[cat]?.map((node) => (
                  <button
                    key={node.type}
                    type="button"
                    onClick={() => onAddNode(node.type)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-left group flex items-start gap-2.5 cursor-pointer"
                  >
                    <div className={cn("p-2 rounded-lg shrink-0 text-white shadow-xs", node.color)}>
                      {node.category === "triggers" && <Zap className="h-3.5 w-3.5" />}
                      {node.category === "messages" && <MessageSquare className="h-3.5 w-3.5" />}
                      {node.category === "logic" && <GitBranch className="h-3.5 w-3.5" />}
                      {node.category === "input" && <HelpCircle className="h-3.5 w-3.5" />}
                      {node.category === "ai" && <Brain className="h-3.5 w-3.5" />}
                      {node.category === "actions" && <Sparkles className="h-3.5 w-3.5" />}
                      {node.category === "flow" && <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-foreground truncate">{node.label}</p>
                        <span className="text-[11px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          + Add
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {node.description}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
}