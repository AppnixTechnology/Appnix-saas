"use client";

import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Wallet,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Clock,
  Plus,
  Trash2,
  Tag as TagIcon,
  Sliders,
  Flag,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CustomerSentimentRemark,
  LiveChatConversation,
} from "@/types/live-chat";
import { TagBadge } from "../tags/TagBadge";
import { cn } from "@/lib/utils";

interface LiveChatRightInspectionPanelProps {
  conversation: LiveChatConversation;
  onClose: () => void;
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateRemarks: (remarks: CustomerSentimentRemark) => void;
  onUpdateSuperField: (key: string, value: any) => void;
}

export function LiveChatRightInspectionPanel({
  conversation,
  onClose,
  onAddNote,
  onDeleteNote,
  onUpdateRemarks,
  onUpdateSuperField,
}: LiveChatRightInspectionPanelProps) {
  const [activeTab, setActiveTab] = useState<"crm" | "notes" | "remarks" | "scheduled">("crm");
  const [newNoteContent, setNewNoteContent] = useState("");

  // Remarks state
  const [sentiment, setSentiment] = useState<CustomerSentimentRemark["sentiment"]>(
    conversation.remarks.sentiment || "positive"
  );
  const [leadStage, setLeadStage] = useState<CustomerSentimentRemark["leadStage"]>(
    conversation.remarks.leadStage || "Negotiation"
  );
  const [remarksNotes, setRemarksNotes] = useState(conversation.remarks.notes || "");
  const [isSavedRemarks, setIsSavedRemarks] = useState(false);

  const handleSaveRemarks = () => {
    onUpdateRemarks({
      sentiment,
      leadStage,
      notes: remarksNotes.trim(),
      lastUpdated: new Date().toISOString(),
    });
    setIsSavedRemarks(true);
    setTimeout(() => setIsSavedRemarks(false), 2000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote(newNoteContent.trim());
    setNewNoteContent("");
  };

  return (
    <div className="w-80 lg:w-88 flex flex-col border-l bg-card shrink-0 h-full overflow-hidden text-xs shadow-xs animate-in slide-in-from-right-2 duration-200">
      {/* Header */}
      <div className="p-3.5 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <User className="h-4 w-4 text-primary" />
          <span>Customer CRM Profile</span>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sub Tabs: CRM Super Fields | Notes | Remarks | Scheduled */}
      <div className="grid grid-cols-4 gap-0.5 p-1 bg-muted/30 border-b text-[11px]">
        {[
          { id: "crm", label: "Fields" },
          { id: "notes", label: `Notes (${conversation.internalNotes.length})` },
          { id: "remarks", label: "Remarks" },
          { id: "scheduled", label: `Schedule (${conversation.scheduledMessages.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "py-1 rounded font-semibold text-center transition-colors truncate px-1",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ========================================================================= */}
        {/* TAB 1: CRM & SUPER FIELDS                                                 */}
        {/* ========================================================================= */}
        {activeTab === "crm" && (
          <div className="space-y-4">
            {/* Contact Avatar Header */}
            <div className="flex flex-col items-center text-center space-y-1.5 p-3 rounded-xl bg-muted/20 border">
              {conversation.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={conversation.avatarUrl}
                  alt={conversation.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20 shadow-xs"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {conversation.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm text-foreground">{conversation.name}</h3>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {conversation.identifier}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 flex-wrap justify-center pt-1">
                {conversation.tags.map((t) => (
                  <TagBadge key={t.id} name={t.name} color={t.color} icon={t.icon} size="xs" />
                ))}
              </div>
            </div>

            {/* Super Fields (CRM V2 Typed Attributes) */}
            <div className="rounded-xl border p-3.5 space-y-3 bg-card shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-primary" />
                  CRM V2 Super Fields
                </span>
                <Badge variant="outline" className="text-[9px] font-mono">
                  Typed
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    City Preset:
                  </label>
                  <Input
                    value={conversation.superFields?.city || ""}
                    onChange={(e) => onUpdateSuperField("city", e.target.value)}
                    className="h-7 text-xs bg-background"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Monthly Marketing Budget:
                  </label>
                  <Input
                    value={conversation.superFields?.marketingBudget || ""}
                    onChange={(e) => onUpdateSuperField("marketingBudget", e.target.value)}
                    className="h-7 text-xs bg-background"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Customer Tier:
                  </label>
                  <Input
                    value={conversation.superFields?.customerTier || ""}
                    onChange={(e) => onUpdateSuperField("customerTier", e.target.value)}
                    className="h-7 text-xs bg-background"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    KYC Verification Status:
                  </label>
                  <Input
                    value={conversation.superFields?.kycStatus || "Verified"}
                    onChange={(e) => onUpdateSuperField("kycStatus", e.target.value)}
                    className="h-7 text-xs bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERNAL AGENT NOTES                                               */}
        {/* ========================================================================= */}
        {activeTab === "notes" && (
          <div className="space-y-3">
            <div className="rounded-xl border p-3 bg-muted/20 space-y-2">
              <p className="text-[11px] font-bold text-foreground">
                Private Agent Comments
              </p>
              <p className="text-[10px] text-muted-foreground">
                Internal notes are private to your workspace and never visible to the customer.
              </p>

              <form onSubmit={handleAddNoteSubmit} className="space-y-2 pt-1">
                <textarea
                  rows={3}
                  required
                  placeholder="Type internal note (e.g. customer requested callback tomorrow at 3pm)..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newNoteContent.trim()}
                  className="w-full text-xs h-7 font-semibold gap-1 bg-primary"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Internal Note</span>
                </Button>
              </form>
            </div>

            {/* Notes Feed */}
            <div className="space-y-2">
              {conversation.internalNotes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-xs italic">
                  No internal notes yet. Add your first note above.
                </p>
              ) : (
                conversation.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl border bg-card shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-[11px]">
                        {note.authorName}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        className="text-muted-foreground hover:text-rose-600"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OUTCOME REMARKS & SENTIMENT                                       */}
        {/* ========================================================================= */}
        {activeTab === "remarks" && (
          <div className="space-y-4">
            <div className="rounded-xl border p-3.5 space-y-3 bg-card shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                Conversation Outcome & Sentiment:
              </span>

              {/* Sentiment Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">
                  Customer Sentiment:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "positive", label: "🟢 Positive" },
                    { id: "neutral", label: "⚪ Neutral" },
                    { id: "urgent", label: "🟠 Urgent" },
                    { id: "at_risk", label: "🔴 At Risk" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSentiment(s.id as any)}
                      className={cn(
                        "p-1.5 rounded-lg border text-[11px] font-semibold text-center transition-all",
                        sentiment === s.id
                          ? "border-primary bg-primary/10 ring-1 ring-primary shadow-2xs text-foreground"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Stage Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">
                  Pipeline Stage:
                </label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value as any)}
                  className="w-full h-8 rounded-lg border bg-background px-2 text-xs font-semibold"
                >
                  <option value="Discovery">Discovery</option>
                  <option value="Demo">Demo Scheduled</option>
                  <option value="Proposal">Proposal Submitted</option>
                  <option value="Negotiation">Negotiation / Review</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              {/* Remarks Text */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">
                  Outcome Remarks:
                </label>
                <textarea
                  rows={3}
                  value={remarksNotes}
                  onChange={(e) => setRemarksNotes(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Record customer objections, deal blockers, or next steps..."
                />
              </div>

              <Button
                size="sm"
                onClick={handleSaveRemarks}
                className="w-full h-8 text-xs font-semibold bg-primary gap-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSavedRemarks ? "Saved!" : "Save Outcome Remarks"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SCHEDULED MESSAGES                                                 */}
        {/* ========================================================================= */}
        {activeTab === "scheduled" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Upcoming Automations:
              </span>
              <Badge variant="outline" className="text-[10px]">
                {conversation.scheduledMessages.length} Queued
              </Badge>
            </div>

            {conversation.scheduledMessages.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground rounded-xl border bg-muted/10 space-y-1">
                <Calendar className="h-6 w-6 mx-auto text-muted-foreground/40" />
                <p className="font-bold text-foreground text-xs">No Scheduled Messages</p>
                <p className="text-[10px]">
                  Automated drip follow-ups will appear here when scheduled.
                </p>
              </div>
            ) : (
              conversation.scheduledMessages.map((sch) => (
                <div
                  key={sch.id}
                  className="p-3 rounded-xl border bg-card shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">
                      {sch.templateName}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase font-mono">
                      {sch.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{new Date(sch.scheduledFor).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
