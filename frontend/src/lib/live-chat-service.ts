import {
  BulkChatActionPayload,
  ChatAgent,
  CustomerSentimentRemark,
  DepartmentId,
  InternalNote,
  LiveChatConversation,
  LiveChatMessage,
} from '@/types/live-chat';
import {
  MOCK_AGENTS,
  computeSessionState,
  getStoredConversations,
  saveStoredConversations,
} from './live-chat-mock';

export function getConversationsList(): LiveChatConversation[] {
  return getStoredConversations();
}

export function sendOutboundTextMessage(
  conversationId: string,
  text: string,
  agent: ChatAgent
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const nowIso = new Date().toISOString();
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  const newMessage: LiveChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    sender: 'agent',
    senderName: agent.name,
    senderAvatar: agent.avatarUrl,
    text: text.trim(),
    timestamp: timeStr,
    createdAt: nowIso,
    status: 'delivered',
    carrierAudit: {
      messageId: `msg-${Date.now()}`,
      channel: 'whatsapp',
      sentAt: timeStr,
      deliveredAt: timeStr,
      carrierNetwork: 'Meta Cloud API v20.0',
      costInr: 0.82,
    },
  };

  const updated = currentList.map((conv) => {
    if (conv.id === conversationId) {
      return {
        ...conv,
        lastMessage: `You: ${text.trim()}`,
        lastMessageTime: timeStr,
        lastMessageSender: 'agent' as const,
        unreadCount: 0,
        messages: [...conv.messages, newMessage],
        updatedAt: nowIso,
      };
    }
    return conv;
  });

  saveStoredConversations(updated);
  return updated;
}

export function sendOutboundTemplateMessage(
  conversationId: string,
  templateName: string,
  templateHeader: string,
  templateBody: string,
  agent: ChatAgent
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const nowIso = new Date().toISOString();
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  const newMessage: LiveChatMessage = {
    id: `msg-tpl-${Date.now()}`,
    conversationId,
    sender: 'agent',
    senderName: agent.name,
    senderAvatar: agent.avatarUrl,
    text: `[${templateHeader}]\n${templateBody}`,
    timestamp: timeStr,
    createdAt: nowIso,
    status: 'delivered',
    isTemplate: true,
    templateName,
    carrierAudit: {
      messageId: `msg-tpl-${Date.now()}`,
      channel: 'whatsapp',
      sentAt: timeStr,
      deliveredAt: timeStr,
      carrierNetwork: 'WhatsApp Cloud API (Verified Carrier Template)',
      costInr: 0.82,
      templateName,
    },
  };

  const updated = currentList.map((conv) => {
    if (conv.id === conversationId) {
      return {
        ...conv,
        lastMessage: `[Template] ${templateHeader}`,
        lastMessageTime: timeStr,
        lastMessageSender: 'agent' as const,
        unreadCount: 0,
        messages: [...conv.messages, newMessage],
        updatedAt: nowIso,
      };
    }
    return conv;
  });

  saveStoredConversations(updated);
  return updated;
}

export function updateConversationTags(
  conversationId: string,
  tags: LiveChatConversation['tags']
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const updated = currentList.map((c) => (c.id === conversationId ? { ...c, tags } : c));
  saveStoredConversations(updated);
  return updated;
}

export function transferConversation(
  conversationIds: string[],
  targetAgentId?: string,
  targetDepartment?: DepartmentId
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const matchedAgent = MOCK_AGENTS.find((a) => a.id === targetAgentId);

  const updated = currentList.map((c) => {
    if (conversationIds.includes(c.id)) {
      return {
        ...c,
        assignedAgent: matchedAgent || c.assignedAgent,
        department: targetDepartment || (matchedAgent?.department as DepartmentId) || c.department,
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}

export function bulkExecuteChatActions(
  payload: BulkChatActionPayload
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const targetIds = new Set(payload.conversationIds);
  const matchedAgent = MOCK_AGENTS.find((a) => a.id === payload.targetAgentId);

  const updated = currentList.map((c) => {
    if (!targetIds.has(c.id)) return c;

    switch (payload.action) {
      case 'TRANSFER_AGENT':
        return {
          ...c,
          assignedAgent: matchedAgent || c.assignedAgent,
          department: (matchedAgent?.department as DepartmentId) || c.department,
        };
      case 'TRANSFER_DEPT':
        return {
          ...c,
          department: payload.targetDepartment || c.department,
        };
      case 'MARK_READ':
        return { ...c, unreadCount: 0 };
      case 'MARK_UNREAD':
        return { ...c, unreadCount: 1 };
      case 'MARK_CLOSED':
        return { ...c, status: 'closed' as const };
      case 'ASSIGN_TAG':
        if (payload.tagToAdd && !c.tags.some((t) => t.id === payload.tagToAdd!.id)) {
          return { ...c, tags: [...c.tags, payload.tagToAdd] };
        }
        return c;
      default:
        return c;
    }
  });

  saveStoredConversations(updated);
  return updated;
}

export function addInternalNote(
  conversationId: string,
  content: string,
  agent: ChatAgent
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const newNote: InternalNote = {
    id: `note-${Date.now()}`,
    authorId: agent.id,
    authorName: agent.name,
    authorAvatar: agent.avatarUrl,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const updated = currentList.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        internalNotes: [newNote, ...c.internalNotes],
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}

export function deleteInternalNote(
  conversationId: string,
  noteId: string
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const updated = currentList.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        internalNotes: c.internalNotes.filter((n) => n.id !== noteId),
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}

export function updateCustomerRemarks(
  conversationId: string,
  remarks: CustomerSentimentRemark
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const updated = currentList.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        remarks: {
          ...remarks,
          lastUpdated: new Date().toISOString(),
        },
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}

export function toggleBotAutomation(
  conversationId: string,
  isBotActive: boolean
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const updated = currentList.map((c) => (c.id === conversationId ? { ...c, isBotActive } : c));
  saveStoredConversations(updated);
  return updated;
}

export function updateSuperFieldValue(
  conversationId: string,
  fieldKey: string,
  val: any
): LiveChatConversation[] {
  const currentList = getStoredConversations();
  const updated = currentList.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        superFields: {
          ...c.superFields,
          [fieldKey]: val,
        },
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}
