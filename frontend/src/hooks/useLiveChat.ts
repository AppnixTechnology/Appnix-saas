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
  fetchConversationsFromApi,
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
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId>("all");
  const [assignedScope, setAssignedScope] = useState<"all" | "me">("all");
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | "all">("all");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sessionFilter, setSessionFilter] = useState<"all" | "active_24h" | "expired_24h">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentAgent: ChatAgent = MOCK_AGENTS[0]; // Active Support Agent

  // Load from backend API
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchConversationsFromApi({
        channel: selectedChannel !== "all" ? selectedChannel : undefined,
        search: searchQuery.trim() ? searchQuery : undefined,
      });
      setConversations(data);
      if (data.length > 0 && !activeConvId) {
        setActiveConvId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChannel, searchQuery, activeConvId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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
      if (selectedTagId && !conv.tags?.some((t) => t.id === selectedTagId)) {
        return false;
      }

      // 5. 24-hr Session filter
      if (sessionFilter === "active_24h" && !conv.session?.isActive) {
        return false;
      }
      if (sessionFilter === "expired_24h" && conv.session?.isActive) {
        return false;
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = conv.name?.toLowerCase().includes(q);
        const matchesIdent = conv.identifier?.toLowerCase().includes(q);
        const matchesMsg = conv.lastMessage?.toLowerCase().includes(q);
        const matchesUid = conv.uid?.toLowerCase().includes(q);
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

  // Active Conversation Object
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConvId || c.uid === activeConvId) ||
      filteredConversations[0] ||
      null
    );
  }, [conversations, activeConvId, filteredConversations]);

  // Counts for filter pills
  const departmentCounts = useMemo(() => {
    const counts: Record<DepartmentId, number> = {
      all: conversations.length,
      sales: 0,
      support: 0,
      billing: 0,
      onboarding: 0,
    };
    conversations.forEach((c) => {
      if (c.department && counts[c.department] !== undefined) {
        counts[c.department]++;
      }
    });
    return counts;
  }, [conversations]);

  const channelCounts = useMemo(() => {
    const counts: Record<ChannelType | "all", number> = {
      all: conversations.length,
      whatsapp: 0,
      instagram: 0,
      facebook: 0,
      rcs: 0,
    };
    conversations.forEach((c) => {
      if (c.channel && counts[c.channel] !== undefined) {
        counts[c.channel]++;
      }
    });
    return counts;
  }, [conversations]);

  // Actions
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeConversation) return;
      const updated = await sendOutboundTextMessage(activeConversation.id, text, currentAgent);
      setConversations(updated);
    },
    [activeConversation, currentAgent]
  );

  const handleSendTemplate = useCallback(
    async (templateName: string, templateHeader: string, templateBody: string) => {
      if (!activeConversation) return;
      const updated = await sendOutboundTemplateMessage(
        activeConversation.id,
        templateName,
        templateHeader,
        templateBody,
        currentAgent
      );
      setConversations(updated);
    },
    [activeConversation, currentAgent]
  );

  const handleUpdateTags = useCallback(
    async (tags: LiveChatConversation["tags"]) => {
      if (!activeConversation) return;
      const updated = await updateConversationTags(activeConversation.id, tags);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleTransfer = useCallback(
    async (targetAgentId?: string, targetDept?: DepartmentId) => {
      if (!activeConversation) return;
      const updated = await transferConversation([activeConversation.id], targetAgentId, targetDept);
      setConversations(updated);
    },
    [activeConversation]
  );

  const handleBulkAction = useCallback(
    async (payload: BulkChatActionPayload) => {
      const updated = await bulkExecuteChatActions(payload);
      setConversations(updated);
      setSelectedConvIds([]);
      setIsBulkMode(false);
    },
    []
  );

  const handleAddNote = useCallback(
    async (content: string) => {
      if (!activeConversation) return;
      const updated = await addInternalNote(activeConversation.id, content, currentAgent);
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
    async (remarks: CustomerSentimentRemark) => {
      if (!activeConversation) return;
      const updated = await updateCustomerRemarks(activeConversation.id, remarks);
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
    isLoading,
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
