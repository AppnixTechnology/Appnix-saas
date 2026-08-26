"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  Headset,
  Plus,
  Search,
  Filter,
  Ticket,
  MessageSquare,
  Clock,
  CircleDot,
  RefreshCw,
  CheckCircle2,
  Archive,
  AlertCircle,
  Paperclip,
  Send,
  X,
  User,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Sparkles,
  Download,
} from "lucide-react";

// ---------- Types ----------
export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Waiting for Customer"
  | "Resolved"
  | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export interface TicketReply {
  id: string;
  sender: "customer" | "agent";
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string; // e.g. SUP-10245
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  assignedAgent?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

// ---------- Initial Mock Tickets ----------
const initialTickets: SupportTicket[] = [
  {
    id: "SUP-10245",
    subject: "WhatsApp Green Badge Official Verification Request",
    category: "Channel Verification",
    priority: "High",
    status: "In Progress",
    description:
      "We have submitted our Meta Business Manager verification documents and need assistance syncing the official Green Checkmark badge to our active WhatsApp number (+91 80627 65557).",
    assignedAgent: {
      name: "Sarah Jenkins",
      role: "Tier 2 Channel Specialist",
      avatarUrl: "https://i.pravatar.cc/56?img=47",
    },
    attachments: ["meta_business_cert.pdf", "number_utility_bill.png"],
    createdAt: "24 Feb 2026, 10:15 AM",
    updatedAt: "24 Feb 2026, 11:30 AM",
    replies: [
      {
        id: "r1",
        sender: "customer",
        senderName: "Video Panel (You)",
        senderRole: "Workspace Admin",
        message:
          "Hi Appnix Support, we submitted all KYC documents on Meta Business Suite yesterday. Could you review our tier limit and badge status?",
        timestamp: "24 Feb 2026, 10:15 AM",
        attachments: ["meta_business_cert.pdf"],
      },
      {
        id: "r2",
        sender: "agent",
        senderName: "Sarah Jenkins",
        senderRole: "Tier 2 Channel Specialist",
        message:
          "Hello! Thanks for reaching out. I have reviewed your Meta Business ID (896015703596388). The documents look valid. We have forwarded the direct verification request to WhatsApp Cloud API telecom escalations. Expect approval within 24-48 hours.",
        timestamp: "24 Feb 2026, 11:30 AM",
      },
    ],
  },
  {
    id: "SUP-10246",
    subject: "Webhook timeout on high volume broadcast automation",
    category: "Technical Support",
    priority: "Urgent",
    status: "Open",
    description:
      "During our 50k broadcast dispatch, the external CRM webhook trigger experienced intermittent 504 Gateway Timeouts. Need advice on setting up queue concurrency.",
    assignedAgent: {
      name: "David K.",
      role: "Senior Infrastructure Engineer",
      avatarUrl: "https://i.pravatar.cc/56?img=12",
    },
    attachments: ["error_logs_dump.txt"],
    createdAt: "24 Feb 2026, 09:00 AM",
    updatedAt: "24 Feb 2026, 09:00 AM",
    replies: [
      {
        id: "r21",
        sender: "customer",
        senderName: "Video Panel (You)",
        senderRole: "Workspace Admin",
        message:
          "Hi team, attached are the logs from our server endpoint during the peak load.",
        timestamp: "24 Feb 2026, 09:00 AM",
        attachments: ["error_logs_dump.txt"],
      },
    ],
  },
  {
    id: "SUP-10247",
    subject: "Clarification on RCS Rich Card template pricing tiers",
    category: "Billing & Invoices",
    priority: "Medium",
    status: "Waiting for Customer",
    description:
      "Need detailed breakdown on whether interactive carousel cards in RCS incur standard single SMS rates or rich media conversational pricing.",
    assignedAgent: {
      name: "Elena Rostova",
      role: "Billing Support Representative",
    },
    attachments: [],
    createdAt: "22 Feb 2026, 03:30 PM",
    updatedAt: "23 Feb 2026, 10:00 AM",
    replies: [
      {
        id: "r31",
        sender: "customer",
        senderName: "Video Panel (You)",
        senderRole: "Workspace Admin",
        message:
          "Hello, can you send the rate card for RCS interactive carousels for Indian telecom operators (Jio & Airtel)?",
        timestamp: "22 Feb 2026, 03:30 PM",
      },
      {
        id: "r32",
        sender: "agent",
        senderName: "Elena Rostova",
        senderRole: "Billing Representative",
        message:
          "Hi there! RCS Single messages and Rich Carousels are billed at a flat ₹0.22 per delivered session. Let us know if you need our enterprise high-volume discount sheet!",
        timestamp: "23 Feb 2026, 10:00 AM",
      },
    ],
  },
  {
    id: "SUP-10248",
    subject: "Tax Invoice GSTIN update on monthly Professional subscription",
    category: "Billing & Invoices",
    priority: "Low",
    status: "Resolved",
    description:
      "Updated our company GST number in billing settings. Need the previous invoice regenerated with GST credit details.",
    assignedAgent: {
      name: "Elena Rostova",
      role: "Billing Support Representative",
    },
    attachments: ["gstin_certificate.pdf"],
    createdAt: "18 Feb 2026, 02:00 PM",
    updatedAt: "19 Feb 2026, 11:20 AM",
    replies: [
      {
        id: "r41",
        sender: "customer",
        senderName: "Video Panel (You)",
        senderRole: "Workspace Admin",
        message: "Invoice INV-2026-003 needs to reflect GSTIN: 27AABCU9603R1ZM.",
        timestamp: "18 Feb 2026, 02:00 PM",
      },
      {
        id: "r42",
        sender: "agent",
        senderName: "Elena Rostova",
        senderRole: "Billing Representative",
        message:
          "Done! The updated invoice is now available in your Workspace -> Billing -> Invoices table.",
        timestamp: "19 Feb 2026, 11:20 AM",
      },
    ],
  },
];

const priorityStyles: Record<TicketPriority, { badge: string; dot: string }> = {
  Low: {
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
    dot: "bg-slate-500",
  },
  Medium: {
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    dot: "bg-blue-500",
  },
  High: {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    dot: "bg-amber-500",
  },
  Urgent: {
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    dot: "bg-rose-500 animate-pulse",
  },
};

const statusStyles: Record<TicketStatus, { badge: string; icon: React.ElementType }> = {
  Open: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    icon: CircleDot,
  },
  "In Progress": {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    icon: RefreshCw,
  },
  "Waiting for Customer": {
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200",
    icon: Clock,
  },
  Resolved: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    icon: CheckCircle2,
  },
  Closed: {
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
    icon: Archive,
  },
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Technical Support");
  const [newPriority, setNewPriority] = useState<TicketPriority>("Medium");
  const [newDescription, setNewDescription] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus =
      selectedStatus === "All" || t.status === selectedStatus;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const generatedId = `SUP-${Math.floor(10200 + Math.random() * 89000)}`;

    const created: SupportTicket = {
      id: generatedId,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: "Open",
      description: newDescription.trim(),
      assignedAgent: {
        name: "Support Assignment Bot",
        role: "Auto-Routing to Available Specialist",
      },
      attachments: newAttachmentName.trim() ? [newAttachmentName.trim()] : [],
      createdAt: "Just now",
      updatedAt: "Just now",
      replies: [
        {
          id: `r-${Date.now()}`,
          sender: "customer",
          senderName: "Video Panel (You)",
          senderRole: "Workspace Admin",
          message: newDescription.trim(),
          timestamp: "Just now",
          attachments: newAttachmentName.trim() ? [newAttachmentName.trim()] : [],
        },
      ],
    };

    setTickets([created, ...tickets]);
    setIsRaiseModalOpen(false);
    setNewSubject("");
    setNewDescription("");
    setNewAttachmentName("");
    setActiveTicket(created);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeTicket) return;

    const newReply: TicketReply = {
      id: `r-${Date.now()}`,
      sender: "customer",
      senderName: "Video Panel (You)",
      senderRole: "Workspace Admin",
      message: replyInput.trim(),
      timestamp: "Just now",
    };

    const updated = {
      ...activeTicket,
      updatedAt: "Just now",
      status: "In Progress" as TicketStatus,
      replies: [...activeTicket.replies, newReply],
    };

    setActiveTicket(updated);
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? updated : t))
    );
    setReplyInput("");
  };

  const handleUpdateStatus = (newStatus: TicketStatus) => {
    if (!activeTicket) return;
    const updated = {
      ...activeTicket,
      status: newStatus,
      updatedAt: "Just now",
    };
    setActiveTicket(updated);
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? updated : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Workspace</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Support</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Headset className="h-6 w-6 text-primary" />
            Support Helpdesk & Tickets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Raise new technical support inquiries, track resolution tickets, and communicate directly with engineering support.
          </p>
        </div>

        <Button
          onClick={() => setIsRaiseModalOpen(true)}
          className="bg-primary text-primary-foreground gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Raise New Ticket
        </Button>
      </div>

      {/* Ticket Metric Cards */}
   {/* Ticket Metric Cards */}
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <div className="rounded-xl border bg-card p-4 shadow-xs">
    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
      <Ticket className="h-4.5 w-4.5 text-primary" />
    </div>
    <p className="text-xs text-muted-foreground">Total Tickets Raised</p>
    <p className="text-2xl font-bold mt-0.5 text-foreground">{tickets.length}</p>
    <p className="text-xs text-muted-foreground mt-1">All time history</p>
  </div>

  <div className="rounded-xl border bg-card p-4 shadow-xs">
    <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-3">
      <RefreshCw className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
    </div>
    <p className="text-xs text-muted-foreground">In Progress & Open</p>
    <p className="text-2xl font-bold mt-0.5 text-foreground">
      {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
    </p>
    <p className="text-xs text-amber-600 font-medium mt-1">Active priority queue</p>
  </div>

  <div className="rounded-xl border bg-card p-4 shadow-xs">
    <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-3">
      <Clock className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
    </div>
    <p className="text-xs text-muted-foreground">Waiting for You</p>
    <p className="text-2xl font-bold mt-0.5 text-foreground">
      {tickets.filter((t) => t.status === "Waiting for Customer").length}
    </p>
    <p className="text-xs text-purple-600 font-medium mt-1">Response requested</p>
  </div>

  <div className="rounded-xl border bg-card p-4 shadow-xs">
    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-3">
      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
    </div>
    <p className="text-xs text-muted-foreground">Resolved Tickets</p>
    <p className="text-2xl font-bold mt-0.5 text-foreground">
      {tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length}
    </p>
    <p className="text-xs text-emerald-600 font-medium mt-1">100% SLA compliance</p>
  </div>
</div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-xl bg-card p-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["All", "Open", "In Progress", "Waiting for Customer", "Resolved", "Closed"].map(
            (st) => {
              const isSelected = selectedStatus === st;
              const count =
                st === "All"
                  ? tickets.length
                  : tickets.filter((t) => t.status === st).length;

              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{st}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="relative w-64 max-w-full">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tickets by ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* My Support Tickets Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left">Ticket ID</th>
                <th className="p-3.5 text-left min-w-56">Subject</th>
                <th className="p-3.5 text-left">Category</th>
                <th className="p-3.5 text-left">Priority</th>
                <th className="p-3.5 text-left">Status</th>
                <th className="p-3.5 text-left">Created Date</th>
                <th className="p-3.5 text-left">Last Updated</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const pStyle = priorityStyles[ticket.priority];
                  const sStyle = statusStyles[ticket.status];
                  const StatusIcon = sStyle.icon;

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => setActiveTicket(ticket)}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono text-xs font-bold text-primary whitespace-nowrap">
                        #{ticket.id}
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-foreground text-xs line-clamp-1 hover:text-primary">
                          {ticket.subject}
                        </p>
                      </td>
                      <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {ticket.category}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            pStyle.badge
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", pStyle.dot)} />
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn("gap-1 text-[11px] font-medium", sStyle.badge)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {ticket.createdAt}
                      </td>
                      <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {ticket.updatedAt}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTicket(ticket);
                          }}
                          className="h-7 text-xs text-primary font-semibold hover:bg-primary/10"
                        >
                          View & Reply
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Conversation Modal / Drawer */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-2xl animate-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-primary">
                    #{activeTicket.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold",
                      statusStyles[activeTicket.status].badge
                    )}
                  >
                    {activeTicket.status}
                  </Badge>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
                      priorityStyles[activeTicket.priority].badge
                    )}
                  >
                    {activeTicket.priority} Priority
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground">
                  {activeTicket.subject}
                </h2>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ticket Info & Status Tracker Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b bg-muted/20 text-xs shrink-0 px-2 rounded-md my-2">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-semibold">
                  Category
                </p>
                <p className="font-medium text-foreground">{activeTicket.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-semibold">
                  Assigned Agent
                </p>
                <p className="font-medium text-foreground">
                  {activeTicket.assignedAgent?.name || "Tier 1 Specialist"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-semibold">
                  Created Date
                </p>
                <p className="font-medium text-foreground">{activeTicket.createdAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-semibold">
                  Status Tracking
                </p>
                <select
                  value={activeTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value as TicketStatus)}
                  className="mt-0.5 rounded border border-input bg-background px-2 py-0.5 text-xs font-semibold text-primary"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Attachments Section if present */}
            {activeTicket.attachments.length > 0 && (
              <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground shrink-0 border-b">
                <Paperclip className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Attached files:</span>
                {activeTicket.attachments.map((file, idx) => (
                  <span
                    key={idx}
                    className="bg-muted px-2 py-0.5 rounded font-mono text-[11px] text-foreground flex items-center gap-1"
                  >
                    {file}
                  </span>
                ))}
              </div>
            )}

            {/* Conversation Replies Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conversation Thread ({activeTicket.replies.length})
              </p>

              {activeTicket.replies.map((reply) => {
                const isCustomer = reply.sender === "customer";
                return (
                  <div
                    key={reply.id}
                    className={cn(
                      "p-3.5 rounded-xl border space-y-1.5",
                      isCustomer ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                            isCustomer
                              ? "bg-primary text-primary-foreground"
                              : "bg-emerald-600 text-white"
                          )}
                        >
                          {reply.senderName.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">
                          {reply.senderName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({reply.senderRole})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {reply.timestamp}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap pl-7.5">
                      {reply.message}
                    </p>

                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="flex items-center gap-1.5 pl-7.5 pt-1 text-[11px] text-primary">
                        <Paperclip className="h-3 w-3" />
                        <span>{reply.attachments.join(", ")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="pt-3 border-t shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your response to the support team..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="text-xs h-9"
                />
                <Button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="bg-primary text-primary-foreground text-xs gap-1.5 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise New Ticket Modal */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl animate-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Headset className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Raise Support Ticket</h2>
              </div>
              <button
                onClick={() => setIsRaiseModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Subject / Summary *
                </label>
                <Input
                  required
                  placeholder="e.g. Need assistance with WhatsApp Webhook 504 error"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Channel Verification">Channel Verification</option>
                    <option value="Billing & Invoices">Billing & Invoices</option>
                    <option value="Bot Automation">Bot Automation</option>
                    <option value="Account & 2FA">Account & 2FA</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Priority Level *
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                  >
                    <option value="Low">Low (General guidance)</option>
                    <option value="Medium">Medium (Standard request)</option>
                    <option value="High">High (Production issue)</option>
                    <option value="Urgent">Urgent (Service outage)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what happened, steps to reproduce, or details of your request..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Attachment Name / Log Reference (Optional)
                </label>
                <div className="relative">
                  <Paperclip className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. error_screenshot.png or payload_dump.json"
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    className="pl-8.5 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Tier-Based SLA Protection
                </p>
                <p>
                  Your ticket will automatically be assigned a unique Ticket ID and routed to our dedicated engineering on-call support.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRaiseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
