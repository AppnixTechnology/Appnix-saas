"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AdminTicket, AdminTicketStatus, TicketPriority } from "@/super-admin/types";
import { supportService } from "@/super-admin/services";
import {
  LifeBuoy,
  ArrowLeft,
  ChevronRight,
  Search,
  Paperclip,
  Send,
} from "lucide-react";

export default function SuperAdminSupportPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("TKT-8902");
  const [activeTabFilter, setActiveTabFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  const fetchTickets = () => {
    supportService.getAllTickets().then((tList) => {
      setTickets(tList);
      if (tList.length > 0 && !selectedTicketId) {
        setSelectedTicketId(tList[0].id);
      }
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    supportService.addReply(activeTicket.id, replyText.trim(), isInternalNote).then(() => {
      setReplyText("");
      fetchTickets();
    });
  };

  const handleStatusChange = (newStatus: AdminTicketStatus) => {
    if (!activeTicket) return;
    supportService.updateTicketStatus(activeTicket.id, newStatus).then(() => {
      fetchTickets();
    });
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    if (!activeTicket) return;
    supportService.updateTicketPriority(activeTicket.id, newPriority).then(() => {
      fetchTickets();
    });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !activeTicket) return;
    if (!activeTicket.tags.includes(newTagInput.trim())) {
      activeTicket.tags.push(newTagInput.trim());
      setNewTagInput("");
      setIsAddingTag(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTabFilter === "Urgent") return t.priority === "Urgent";
    if (activeTabFilter === "Open") return t.status === "Open" || t.status === "In Progress";
    if (activeTabFilter === "Resolved") return t.status === "Resolved" || t.status === "Closed";

    return true;
  });

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-6.5rem)]">
      {/* Breadcrumb Back Navigation */}
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Support Triage</span>
      </div>

      {/* Top Title Bar */}
      <div className="flex shrink-0 flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            <LifeBuoy className="h-5 w-5 text-primary" />
            Support Tickets Triage
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage, triage, and resolve mission-critical tenant escalations.
          </p>
        </div>
      </div>

      {/* 3-Column Support Console Layout */}
      <div className="grid min-h-0 grid-cols-1 gap-4 lg:flex-1 lg:grid-cols-12 lg:overflow-hidden">
        {/* ================= COLUMN 1: TICKET LIST (4 cols) ================= */}
        <div className="flex max-h-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-xs lg:col-span-4 lg:max-h-none">
          {/* List Header & Search */}
          <div className="space-y-2.5 border-b bg-muted/20 p-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs no-scrollbar">
              {["All", "Urgent", "Open", "Resolved"].map((tab) => {
                const isSelected = activeTabFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTabFilter(tab)}
                    className={cn(
                      "shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search ticket # or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 bg-background pl-8 text-xs"
              />
            </div>
          </div>

          {/* Ticket List Stream */}
          <div className="flex-1 divide-y divide-border/60 overflow-y-auto">
            {filteredTickets.map((t) => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={cn(
                    "cursor-pointer space-y-1.5 p-3.5 transition-all",
                    isSelected
                      ? "border-l-4 border-primary bg-primary/5 pl-3 dark:bg-primary/10"
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      #{t.id}
                    </span>
                    <Badge
                      className={cn(
                        "px-1.5 py-0 text-[9px] font-extrabold uppercase",
                        t.priority === "Urgent" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                        t.priority === "High" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                        t.priority === "Medium" && "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                        t.priority === "Low" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      )}
                    >
                      {t.priority}
                    </Badge>
                  </div>

                  <p className="line-clamp-1 text-xs font-bold text-foreground">
                    {t.subject}
                  </p>

                  <div className="flex items-center justify-between pt-0.5 text-[11px] text-muted-foreground">
                    <span className="max-w-[140px] truncate font-semibold text-foreground">
                      {t.clientName}
                    </span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= COLUMN 2: CONVERSATION PANEL (5 cols) ================= */}
        <div className="flex max-h-[560px] flex-col overflow-hidden rounded-2xl border bg-card shadow-xs lg:col-span-5 lg:max-h-none">
          {activeTicket ? (
            <>
              {/* Conversation Header */}
              <div className="space-y-1 border-b bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    Ticket #{activeTicket.id}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-background text-[10px] font-semibold"
                  >
                    {activeTicket.status}
                  </Badge>
                </div>
                <h2 className="text-sm font-extrabold leading-snug text-foreground">
                  {activeTicket.subject}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Opened by <span className="font-semibold text-foreground">{activeTicket.openedBy}</span> ({activeTicket.clientName})
                </p>
              </div>

              {/* Message Thread Stream */}
              <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
                {activeTicket.messages.map((msg) => {
                  const isCustomer = msg.sender === "customer";
                  const isNote = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "space-y-1.5 rounded-xl border p-3.5 text-xs",
                        isNote
                          ? "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/40"
                          : isCustomer
                          ? "border-border bg-muted/30"
                          : "border-primary/20 bg-primary/5 dark:bg-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                              isNote ? "bg-amber-600" : isCustomer ? "bg-muted-foreground" : "bg-primary"
                            )}
                          >
                            {msg.senderName.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">{msg.senderName}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            ({msg.senderRole})
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                      </div>

                      <p className="whitespace-pre-wrap pl-8 text-xs leading-relaxed text-foreground">
                        {msg.message}
                      </p>

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex items-center gap-1.5 pl-8 pt-1 font-mono text-[11px] text-primary">
                          <Paperclip className="h-3 w-3" />
                          <span>{msg.attachments.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form onSubmit={handleSendReply} className="space-y-2 border-t bg-muted/20 p-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(false)}
                    className={cn(
                      "cursor-pointer rounded px-2 py-0.5 text-[11px] font-semibold transition-colors",
                      !isInternalNote ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Public Reply to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(true)}
                    className={cn(
                      "cursor-pointer rounded px-2 py-0.5 text-[11px] font-semibold transition-colors",
                      isInternalNote ? "bg-amber-600 text-white" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    🔒 Internal Staff Note
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    placeholder={
                      isInternalNote
                        ? "Add private note for support engineering team..."
                        : "Type reply to client..."
                    }
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="h-9 bg-background text-xs"
                  />
                  <Button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={cn(
                      "shrink-0 gap-1.5 text-xs font-semibold text-white",
                      isInternalNote ? "bg-amber-600 hover:bg-amber-700" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isInternalNote ? "Post Note" : "Send Reply"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-xs text-muted-foreground">
              Select a ticket from the left list to view conversation.
            </div>
          )}
        </div>

        {/* ================= COLUMN 3: PROPERTIES & CLIENT INFO (3 cols) ================= */}
        <div className="flex flex-col gap-4 overflow-y-auto rounded-2xl border bg-card p-4 shadow-xs lg:col-span-3">
          {activeTicket ? (
            <>
              {/* Properties Section */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ticket Properties
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Status</label>
                    <select
                      value={activeTicket.status}
                      onChange={(e) => handleStatusChange(e.target.value as AdminTicketStatus)}
                      className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs font-semibold text-foreground"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Customer">Waiting for Customer</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                    <select
                      value={activeTicket.priority}
                      onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                      className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs font-semibold text-foreground"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Assignee</label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {activeTicket.assigneeName?.charAt(0) || "D"}
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {activeTicket.assigneeName || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Tags</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(!isAddingTag)}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Add Tag
                      </button>
                    </label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {activeTicket.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-2 py-0 font-mono text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {isAddingTag && (
                      <form onSubmit={handleAddTag} className="mt-2 flex items-center gap-1.5">
                        <Input
                          placeholder="tag name"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          className="h-7 text-[11px]"
                        />
                        <Button type="submit" size="sm" className="h-7 bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90">
                          Add
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Information Card */}
              <div className="space-y-3 border-t pt-4 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Client Information
                </h3>

                <div className="space-y-2.5 rounded-xl border bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-foreground">{activeTicket.clientName}</p>
                      <p className="text-[11px] text-muted-foreground">{activeTicket.clientTier}</p>
                    </div>
                    <Badge className="bg-primary/10 text-[10px] font-bold text-primary">
                      Enterprise
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t pt-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">Account MRR</span>
                      <p className="font-bold text-foreground">${activeTicket.clientMrr.toLocaleString()}/mo</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Score</span>
                      <p className="font-bold text-primary">{activeTicket.clientSuccessScore}/100</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Tickets</span>
                      <p className="font-bold text-foreground">
                        {activeTicket.clientTotalTickets} ({activeTicket.clientOpenTickets} open)
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tenant Health</span>
                      <p className="font-bold text-primary">Optimal</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}