"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useLiveChat } from "@/hooks/useLiveChat";
import { LiveChatTopBar } from "@/components/crm/live-chat/LiveChatTopBar";
import { LiveChatConversationList } from "@/components/crm/live-chat/LiveChatConversationList";
import { LiveChatMessageThread } from "@/components/crm/live-chat/LiveChatMessageThread";
import { LiveChatRightInspectionPanel } from "@/components/crm/live-chat/LiveChatRightInspectionPanel";
import { LiveChatTransferModal } from "@/components/crm/live-chat/LiveChatTransferModal";
import { DepartmentId } from "@/types/live-chat";

export default function LiveChatPage() {
  const {
    filteredConversations,
    activeConversation,
    activeConvId,
    setActiveConvId,
    selectedDepartment,
    setSelectedDepartment,
    assignedScope,
    setAssignedScope,
    selectedChannel,
    setSelectedChannel,
    selectedTagId,
    setSelectedTagId,
    sessionFilter,
    setSessionFilter,
    searchQuery,
    setSearchQuery,
    selectedConvIds,
    isBulkMode,
    setIsBulkMode,
    toggleSelectConv,
    toggleSelectAll,
    departmentCounts,
    sendMessage,
    sendTemplate,
    updateTags,
    transfer,
    executeBulkAction,
    addNote,
    deleteNote,
    updateRemarks,
    toggleBot,
    updateSuperField,
  } = useLiveChat();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isBulkTransferModalOpen, setIsBulkTransferModalOpen] = useState(false);

  return (
    <div className="space-y-2.5 flex flex-col h-[calc(100vh-5rem)] animate-in fade-in duration-200">
      {/* 1. Header Breadcrumbs & Multi-Channel Status */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
          <Link
            href="/crm"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>CRM</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-primary font-bold">Live Chat / Omnichannel Inbox</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Realtime Omnichannel Engine Active</span>
          </span>
        </div>
      </div>

      {/* 2. Top Bar: Department Tabs, Assigned Scope, Bulk Mode */}
      <div className="shrink-0">
        <LiveChatTopBar
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
          assignedScope={assignedScope}
          onSelectAssignedScope={setAssignedScope}
          departmentCounts={departmentCounts}
          isBulkMode={isBulkMode}
          onToggleBulkMode={() => setIsBulkMode(!isBulkMode)}
          selectedCount={selectedConvIds.length}
        />
      </div>

      {/* 3. Main 3-Column Omnichannel Inbox Layout */}
      <div className="flex-1 flex overflow-hidden rounded-2xl border bg-card shadow-sm min-h-0">
        {/* COLUMN 1: Conversation List (Left Panel) */}
        <LiveChatConversationList
          conversations={filteredConversations}
          activeConvId={activeConvId}
          onSelectConversation={setActiveConvId}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          selectedTagId={selectedTagId}
          onSelectTagId={setSelectedTagId}
          sessionFilter={sessionFilter}
          onSelectSessionFilter={setSessionFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedConvIds={selectedConvIds}
          isBulkMode={isBulkMode}
          onToggleBulkSelect={toggleSelectConv}
          onToggleSelectAll={toggleSelectAll}
          onExecuteBulkAction={executeBulkAction}
          onOpenBulkTransferModal={() => setIsBulkTransferModalOpen(true)}
        />

        {/* COLUMN 2: Active Message Thread & Smart Composer (Center Panel) */}
        <LiveChatMessageThread
          conversation={activeConversation}
          onSendMessage={sendMessage}
          onSendTemplate={sendTemplate}
          onUpdateTags={updateTags}
          onTransfer={transfer}
          onToggleBot={toggleBot}
          showRightPanel={showRightPanel}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
        />

        {/* COLUMN 3: Customer CRM Inspection (Right Panel) */}
        {activeConversation && showRightPanel && (
          <LiveChatRightInspectionPanel
            conversation={activeConversation}
            onClose={() => setShowRightPanel(false)}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onUpdateRemarks={updateRemarks}
            onUpdateSuperField={updateSuperField}
          />
        )}
      </div>

      {/* Bulk Transfer Modal */}
      <LiveChatTransferModal
        isOpen={isBulkTransferModalOpen}
        onClose={() => setIsBulkTransferModalOpen(false)}
        targetCount={selectedConvIds.length}
        onConfirmTransfer={(targetAgentId, targetDept) => {
          executeBulkAction({
            conversationIds: selectedConvIds,
            action: targetAgentId ? "TRANSFER_AGENT" : "TRANSFER_DEPT",
            targetAgentId,
            targetDepartment: targetDept as DepartmentId,
          });
        }}
      />
    </div>
  );
}