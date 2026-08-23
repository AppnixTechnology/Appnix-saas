"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  X,
  Send,
  MessageSquare,
  Zap,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import {
  BotWorkflow,
  TestMessage,
  TestExecutionStep,
  BotVariable,
  BotChannel,
} from "@/components/bots/types";

interface TestSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: BotWorkflow;
  variables: BotVariable[];
  channels: BotChannel[];
  onRunTest: (input: { message?: string; variables?: Record<string, unknown> }) => Promise<unknown>;
}

export function TestSimulator({
  isOpen,
  onClose,
  workflow,
  variables,
  channels,
  onRunTest,
}: TestSimulatorProps) {
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: "msg-welcome",
      direction: "outbound",
      type: "text",
      content: "👋 Interactive Flow Simulation session started. Send an inbound customer message to trigger the botflow.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [executionPath, setExecutionPath] = useState<TestExecutionStep[]>([
    {
      nodeId: "trigger",
      nodeType: "incoming_message",
      status: "success",
      duration: 12,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [testVariables, setTestVariables] = useState<Record<string, string>>({
    "contact.name": "Harshit Admin",
    "contact.phone": "+919876543210",
    "contact.country": "India",
  });
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    // Add Inbound Customer Message
    const userMsg: TestMessage = {
      id: "in-" + Date.now(),
      direction: "inbound",
      type: "text",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      await onRunTest({ message: userText, variables: testVariables });

      // Simulate bot flow processing
      setTimeout(() => {
        // Find if workflow has text messages or AI reply nodes
        const hasAI = workflow.nodes.some((n) => n.category === "ai");
        const replyText = hasAI
          ? `🤖 [AI Response]: Hello ${testVariables["contact.name"] || "there"}! I processed your query: "${userText}". Based on our knowledge base, here is the answer.`
          : `Hello ${testVariables["contact.name"] || "Customer"}! Thank you for your message: "${userText}". We are here to help.`;

        const botMsg: TestMessage = {
          id: "bot-" + Date.now(),
          direction: "outbound",
          type: "text",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
        setExecutionPath((prev) => [
          ...prev,
          {
            nodeId: "eval-" + Date.now(),
            nodeType: hasAI ? "ai_reply" : "text_message",
            status: "success",
            duration: 85,
          },
        ]);
        setIsProcessing(false);
      }, 700);
    } catch {
      setIsProcessing(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome",
        direction: "outbound",
        type: "text",
        content: "👋 Interactive Flow Simulation reset. Send a message to test your logic.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-2xl h-[650px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="p-3.5 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Interactive Bot Simulator</h3>
              <p className="text-[11px] text-muted-foreground">
                Simulating {channels.join(", ")} • Multi-turn conversation tester
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleResetChat}
              title="Reset Test Session"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs: Live Chat, Variables, Execution */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 border-b bg-muted/20 px-3">
            <TabsTrigger value="chat" className="text-xs py-1.5">
              Live Simulator
            </TabsTrigger>
            <TabsTrigger value="variables" className="text-xs py-1.5">
              Runtime Variables
            </TabsTrigger>
            <TabsTrigger value="execution" className="text-xs py-1.5">
              Execution Trace
            </TabsTrigger>
          </TabsList>

          {/* Tab: Chat */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden p-0 mt-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-muted/10 space-y-3">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-start gap-2 max-w-[85%]",
                      m.direction === "inbound" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs text-xs",
                        m.direction === "inbound" ? "bg-blue-600" : "bg-emerald-600"
                      )}
                    >
                      {m.direction === "inbound" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl p-3 text-xs leading-relaxed shadow-xs",
                        m.direction === "inbound"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-card border text-card-foreground rounded-tl-none"
                      )}
                    >
                      <p>{m.content}</p>
                      <span
                        className={cn(
                          "text-[9px] mt-1 block",
                          m.direction === "inbound" ? "text-primary-foreground/75" : "text-muted-foreground"
                        )}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
                    <span>Bot is evaluating nodes & generating reply...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-card flex items-center gap-2">
              <Input
                placeholder="Type customer message to test..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="submit" size="sm" className="h-9 px-4 text-xs font-semibold gap-1">
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </form>
          </TabsContent>

          {/* Tab: Variables */}
          <TabsContent value="variables" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3 mt-0">
            <p className="text-xs text-muted-foreground">
              Configure mock contact attributes and runtime variables for evaluation in condition nodes:
            </p>
            <div className="space-y-2">
              {Object.entries(testVariables).map(([k, val]) => (
                <div key={k} className="flex items-center gap-2">
                  <Label className="text-xs font-mono text-muted-foreground w-40 truncate">{`{{${k}}}`}</Label>
                  <Input
                    value={val}
                    onChange={(e) => setTestVariables({ ...testVariables, [k]: e.target.value })}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Execution Trace */}
          <TabsContent value="execution" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3 mt-0">
            <h4 className="font-bold text-xs text-foreground">Step Execution Path</h4>
            <div className="space-y-2">
              {executionPath.map((step, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border bg-muted/20 flex items-center justify-between text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-bold">{step.nodeType}</span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      Node #{step.nodeId}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{step.duration}ms</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}