"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BulkChatActionPayload,
  ChatAgent,
  ChannelType,
  CustomerSentimentRemark,
  DepartmentId,
  LiveChatConversation,
} from "@/types/live-chat";
import {
  MOCK_AGENTS,
  getStoredConversations,
} from "@/lib/live-chat-mock";
import {
  sendOutboundTextMessage,
  sendOutboundTemplateMessage,
  updateConversationTags,
  transferConversation,
  bulkExecuteChatActions,
  addInternalNote,
  deleteInternalNote,
  updateCustomerRemarks,
  toggleBotAutomation,
  updateSuperFieldValue,
} from "@/lib/live-chat-service";

export function useLiveChat() {
  const [conversations, setConversations] = useState<LiveChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId>("all");
  const [assignedScope, setAssignedScope] = useState<"all" | "me">("all");
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | "all">("all");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sessionFilter, setSessionFilter] = useState<"all" | "active_24h" | "expired_24h">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const currentAgent: ChatAgent = MOCK_AGENTS[0]; // Jitendra Kumar

  // Initial load
  useEffect(() => {
    setConversations(getStoredConversations());
  }, []);

  // Sync on local events
  useEffect(() => {
    const handleUpdate = () => {
      setConversations(getStoredConversations());
    };
    window.addEventListener("live-chat-updated", handleUpdate);
    return () => window.removeEventListener("live-chat-updated", handleUpdate);
  }, []);

  // Filtered Conversations Selector
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // 1. Department filter
      if (selectedDepartment !== "all" && conv.department !== selectedDepartment) {
        return false;
      }

      // 2. Assigned to Me filter
      if (assignedScope === "me" && conv.assignedAgent?.id !== currentAgent.id) {
        return false;
      }

      // 3. Channel filter
      if (selectedChannel !== "all" && conv.channel !== selectedChannel) {
        return false;
      }

      // 4. Tag filter
      if (selectedTagId && !conv.tags.some((t) => t.id === selectedTagId)) {
        return false;
      }

      // 5. 24-hr Session filter
      if (sessionFilter === "active_24h" && !conv.session.isActive) {
        return false;
      }
      if (sessionFilter === "expired_24h" && conv.session.isActive) {
        return false;
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = conv.name.toLowerCase().includes(q);
        const matchesIdent = conv.identifier.toLowerCase().includes(q);
        const matchesMsg = conv.lastMessage.toLowerCase().includes(q);
        const matchesUid = conv.uid.toLowerCase().includes(q);
        if (!matchesName && !matchesIdent && !matchesMsg && !matchesUid) {
          return false;
        }
      }

      return true;
    });
  }, [
    conversations,
    selectedDepartment,
    assignedScope,
    selectedChannel,
    selectedTagId,
    sessionFilter,
    searchQuery,
    currentAgent.id,
  ]);

  // Active Conversation Selector
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConvId) ||
      filteredConversations[0] ||
      null
    );
  }, [conversations, activeConvId, filteredConversations]);

  // Department counts
  const departmentCounts = useMemo(() => {
    return {
      all: conversations.length,
      sales: conversations.filter((c) => c.department === "sales").length,
      support: conversations.filter((c) => c.department === "support").length,
      billing: conversations.filter((c) => c.department === "billing").length,
      onboarding: conversations.filter((c) => c.department === "onboarding").length,
    };
  }, [conversations]);

  // Channel counts
  const channelCounts = useMemo(() => {
    return {
      all: conversations.length,
      whatsapp: conversations.filter((c) => c.channel === "whatsapp").length,
      instagram: conversations.filter((c) => c.channel === "instagram").length,
      rcs: conversations.filter((c) => c.channel === "rcs").length,
      facebook: conversations.filter((c) => c.channel === "facebook").length,
    };
  }, [conversations]);

  // --- ACTIONS ---

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!activeConversation) return;
      const updated = sendOutboundTextMessage(activeConversation.id, text, currentAgent);
      setConversations(updated);
    },
    [activeConversation, currentAgent]
  );

  const handleSendTemplate = useCallback(
    (templateName: string, header: string, body: string) => {
      if (!activeConversation) return;
      const updated = sendOutboundTemplateMessage(
        activeConversation.id,
        templateName,
        header,
        body,
        currentAgent
      );
      setConversations(updated);
    },
    [activeConversation, currentAgent]
  );

  const handleUpdateTags = useCallback(
    (tags: LiveChatConversation["tags"]) => {
      if (!activeConversation) return;
      const updated = updateConversationTags(activeConversation.id, tags);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleTransfer = useCallback(
    (targetAgentId?: string, targetDept?: DepartmentId) => {
      if (!activeConversation) return;
      const updated = transferConversation([activeConversation.id], targetAgentId, targetDept);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleBulkAction = useCallback(
    (payload: BulkChatActionPayload) => {
      const updated = bulkExecuteChatActions(payload);
      setConversations(updated);
      setSelectedConvIds([]);
      setIsBulkMode(false);
    },
    []
  );

  const handleAddNote = useCallback(
    (content: string) => {
      if (!activeConversation) return;
      const updated = addInternalNote(activeConversation.id, content, currentAgent);
      setConversations(updated);
    },
    [activeConversation, currentAgent]
  );

  const handleDeleteNote = useCallback(
    (noteId: string) => {
      if (!activeConversation) return;
      const updated = deleteInternalNote(activeConversation.id, noteId);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleUpdateRemarks = useCallback(
    (remarks: CustomerSentimentRemark) => {
      if (!activeConversation) return;
      const updated = updateCustomerRemarks(activeConversation.id, remarks);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleToggleBot = useCallback(
    (isBotActive: boolean) => {
      if (!activeConversation) return;
      const updated = toggleBotAutomation(activeConversation.id, isBotActive);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleUpdateSuperField = useCallback(
    (key: string, value: any) => {
      if (!activeConversation) return;
      const updated = updateSuperFieldValue(activeConversation.id, key, value);
      setConversations(updated);
    },
    [activeConversation]
  );

  const toggleSelectConv = useCallback((id: string) => {
    setSelectedConvIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedConvIds.length === filteredConversations.length) {
      setSelectedConvIds([]);
    } else {
      setSelectedConvIds(filteredConversations.map((c) => c.id));
    }
  }, [selectedConvIds, filteredConversations]);

  return {
    conversations,
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
    setSelectedConvIds,
    isBulkMode,
    setIsBulkMode,
    toggleSelectConv,
    toggleSelectAll,
    departmentCounts,
    channelCounts,
    currentAgent,
    sendMessage: handleSendMessage,
    sendTemplate: handleSendTemplate,
    updateTags: handleUpdateTags,
    transfer: handleTransfer,
    executeBulkAction: handleBulkAction,
    addNote: handleAddNote,
    deleteNote: handleDeleteNote,
    updateRemarks: handleUpdateRemarks,
    toggleBot: handleToggleBot,
    updateSuperField: handleUpdateSuperField,
  };
}
