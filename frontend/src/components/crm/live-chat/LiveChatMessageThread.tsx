"use client";

import { useState, useRef, useEffect } from "react";
import {
  Info,
  MoreVertical,
  Clock,
  Check,
  Copy,
  Tag as TagIcon,
  ArrowRightLeft,
  Bot,
  Play,
  Pause,
  Trash2,
  Archive,
  Ban,
  CheckCircle2,
  Lock,
  MessageSquare,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DepartmentId,
  LiveChatConversation,
  LiveChatMessage,
} from "@/types/live-chat";
import { LiveChatMessageBubble } from "./LiveChatMessageBubble";
import { LiveChatMessageComposer } from "./LiveChatMessageComposer";
import { LiveChatMessageInfoDrawer } from "./LiveChatMessageInfoDrawer";
import { LiveChatTemplateModal } from "./LiveChatTemplateModal";
import { LiveChatTransferModal } from "./LiveChatTransferModal";
import { LiveChatTagModal } from "./LiveChatTagModal";
import { TagBadge } from "../tags/TagBadge";
import { cn } from "@/lib/utils";

interface LiveChatMessageThreadProps {
  conversation: LiveChatConversation | null;
  onSendMessage: (text: string) => void;
  onSendTemplate: (templateName: string, header: string, body: string) => void;
  onUpdateTags: (tags: LiveChatConversation["tags"]) => void;
  onTransfer: (targetAgentId?: string, targetDept?: DepartmentId) => void;
  onToggleBot: (isActive: boolean) => void;
  showRightPanel: boolean;
  onToggleRightPanel: () => void;
}

export function LiveChatMessageThread({
  conversation,
  onSendMessage,
  onSendTemplate,
  onUpdateTags,
  onTransfer,
  onToggleBot,
  showRightPanel,
  onToggleRightPanel,
}: LiveChatMessageThreadProps) {
  const [selectedAuditMessage, setSelectedAuditMessage] = useState<LiveChatMessage | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/5">
        <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-3">
          <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="font-bold text-foreground text-sm">No Conversation Selected</h3>
        <p className="text-xs max-w-sm mt-1">
          Select a conversation from the left to start live omnichannel messaging.
        </p>
      </div>
    );
  }

  const session = conversation.session;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(conversation.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-full overflow-hidden">
      {/* 1. Active Conversation Header */}
      <div className="p-3.5 border-b bg-card shrink-0 flex items-center justify-between gap-3 shadow-2xs">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {conversation.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={conversation.avatarUrl}
                alt={conversation.name}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-border shadow-2xs"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-2xs">
                {conversation.name.charAt(0).toUpperCase()}
              </div>
            )}
            {conversation.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-sm text-foreground truncate">
                {conversation.name}
              </h2>
              <Badge variant="outline" className="text-[10px] uppercase font-bold">
                {conversation.channel}
              </Badge>

              {/* Copy UID Button */}
              <button
                type="button"
                onClick={handleCopyUid}
                className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded border transition-colors"
                title="Copy Chat UID"
              >
                <span>{conversation.uid}</span>
                {copiedUid ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{conversation.identifier}</span>
              <span>•</span>
              <span className="capitalize">{conversation.department} Queue</span>
              {conversation.assignedAgent && (
                <>
                  <span>•</span>
                  <span>Agent: {conversation.assignedAgent.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: 24h Countdown Badge & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live 24-Hour Care Session Countdown Timer */}
          <div
            className={cn(
              "px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shadow-2xs",
              session.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900"
            )}
            title={
              session.isActive
                ? `Customer care session expires on ${new Date(session.expiresAt).toLocaleTimeString()}`
                : "24-Hour window expired. Direct text messaging disabled."
            }
          >
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">24h Session:</span>
            <span>{session.formattedRemaining}</span>
          </div>

          {/* Bot Automation Status Pill */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleBot(!conversation.isBotActive)}
            className={cn(
              "h-8 text-xs font-semibold gap-1 hidden md:inline-flex",
              conversation.isBotActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "text-muted-foreground"
            )}
            title={conversation.isBotActive ? "Bot active (Click to pause)" : "Bot paused (Click to resume)"}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{conversation.isBotActive ? "Bot Active" : "Bot Paused"}</span>
          </Button>

          {/* Action Menu (⋮) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">
                Chat Management
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsTagModalOpen(true)}>
                <TagIcon className="h-3.5 w-3.5 mr-2 text-primary" />
                <span>Update / Add Tags</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTransferModalOpen(true)}>
                <ArrowRightLeft className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                <span>Transfer Conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTemplateModalOpen(true)}>
                <MessageSquare className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                <span>Send Approved Template</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleBot(!conversation.isBotActive)}>
                {conversation.isBotActive ? (
                  <>
                    <Pause className="h-3.5 w-3.5 mr-2 text-amber-600" />
                    <span>Pause Bot Automation</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                    <span>Resume Bot Automation</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">
                <Archive className="h-3.5 w-3.5 mr-2" />
                <span>Archive / Close Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toggle Right Inspection Panel */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleRightPanel}
            className={cn(
              "h-8 w-8",
              showRightPanel ? "bg-accent text-foreground" : "text-muted-foreground"
            )}
            title="Toggle CRM Customer Details"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-muted/10">
        <div className="flex items-center justify-center my-2">
          <span className="text-[11px] bg-muted/70 text-muted-foreground px-3 py-1 rounded-full font-medium shadow-2xs">
            Inbound conversation verified via {conversation.channel.toUpperCase()} Cloud API
          </span>
        </div>

        {conversation.messages.map((msg) => (
          <LiveChatMessageBubble
            key={msg.id}
            message={msg}
            onOpenMessageInfo={(m) => setSelectedAuditMessage(m)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Smart Message Composer (Session Enforced) */}
      <LiveChatMessageComposer
        conversation={conversation}
        onSendMessage={onSendMessage}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
      />

      {/* 4. Message Info & Carrier Delivery Audit Drawer */}
      <LiveChatMessageInfoDrawer
        message={selectedAuditMessage}
        isOpen={Boolean(selectedAuditMessage)}
        onClose={() => setSelectedAuditMessage(null)}
      />

      {/* 5. Approved Template Selector Modal */}
      <LiveChatTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        conversation={conversation}
        onSendTemplate={onSendTemplate}
      />

      {/* 6. Transfer Modal */}
      <LiveChatTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        targetCount={1}
        onConfirmTransfer={onTransfer}
      />

      {/* 7. Tag Management Modal */}
      <LiveChatTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        conversation={conversation}
        onSaveTags={onUpdateTags}
      />
    </div>
  );
}
