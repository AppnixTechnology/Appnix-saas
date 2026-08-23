"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Plus,
  Search,
  AudioLines,
  Bot,
  Pencil,
  MessageSquareText,
  Copy,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Play,
} from "lucide-react";

// ---------- Types & data ----------
interface VoiceAgent {
  id: string;
  name: string;
  widgetId: string;
  pipeline: string;
  llmModel: string;
  createdAt: string;
  updatedAt: string;
}

const AGENTS: VoiceAgent[] = [
  {
    id: "1",
    name: "test",
    widgetId: "47696...2c84",
    pipeline: "STT-LLM-TTS",
    llmModel: "openai/gpt-4.1-nano",
    createdAt: "06:57 AM, 07 Feb 2026",
    updatedAt: "07:09 AM, 07 Feb 2026",
  },
];

// ---------- Page ----------
export default function VoiceAgentsPage() {
  const [query, setQuery] = useState("");

  const filteredAgents = AGENTS.filter((agent) =>
    agent.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb + primary action */}
      <div className="flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="font-semibold text-primary">Voice Agents</span>
        </nav>

        <Button>
          <Plus className="h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      {/* Card */}
      <div className="rounded-lg border bg-background">
        {/* Card header */}
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold tracking-wide text-foreground">
            VOICE AGENTS
          </h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Widget ID</TableHead>
                <TableHead>Pipeline</TableHead>
                <TableHead>LLM Model</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <AudioLines className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {agent.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-md bg-muted font-mono text-xs font-normal text-primary"
                    >
                      {agent.widgetId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-md bg-green-50 text-xs font-medium text-green-700"
                    >
                      {agent.pipeline}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-orange-600">
                      <Bot className="h-3.5 w-3.5" />
                      {agent.llmModel}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-orange-600">
                    {agent.createdAt}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-orange-600">
                    {agent.updatedAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquareText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredAgents.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No agents match “{query}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary">
            Showing 1 to {filteredAgents.length} of {AGENTS.length} agents
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Prev
            </Button>
            <Badge className="rounded-md bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-600">
              Page 1 of 1
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="gap-1 text-muted-foreground"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tutorial placeholder */}
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <button
          type="button"
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed",
            "border-muted-foreground/30 text-muted-foreground/40 transition-colors hover:border-muted-foreground/50 hover:text-muted-foreground/60"
          )}
          aria-label="Play tutorial video"
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
        <p className="text-sm font-medium text-muted-foreground/40">
          Tutorial: Setting up Voice Agents
        </p>
      </div>
    </div>
  );
}