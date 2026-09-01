import { TagColorId, TagIconId } from './contact-tag';

export type ChannelType = 'whatsapp' | 'instagram' | 'rcs' | 'facebook';

export type DepartmentId = 'all' | 'sales' | 'support' | 'billing' | 'onboarding';

export type MessageSenderType = 'customer' | 'agent' | 'system' | 'bot';

export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageCarrierAudit {
  messageId: string;
  channel: ChannelType;
  carrierNetwork?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  errorCode?: string; // e.g. "#131047: Re-engagement window closed"
  errorReason?: string;
  costInr?: number;
  templateName?: string;
}

export interface LiveChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSenderType;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string; // ISO string or human-readable
  createdAt: string; // ISO string
  status: MessageDeliveryStatus;
  isTemplate?: boolean;
  templateName?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'audio';
  carrierAudit?: MessageCarrierAudit;
}

export interface ConversationSessionState {
  isActive: boolean; // true if within 24 hours of customer's last inbound message
  lastCustomerMessageAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (lastCustomerMessageAt + 24 hours)
  remainingHours: number;
  remainingMinutes: number;
  formattedRemaining: string; // e.g. "18h 42m remaining" or "Session Expired"
}

export interface ChatAgent {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  department: DepartmentId;
  isOnline: boolean;
}

export interface InternalNote {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CustomerSentimentRemark {
  sentiment: 'positive' | 'neutral' | 'urgent' | 'at_risk';
  leadStage: 'Discovery' | 'Demo' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  notes: string;
  lastUpdated: string;
}

export interface ScheduledMessage {
  id: string;
  templateName: string;
  scheduledFor: string;
  status: 'PENDING' | 'DISPATCHED' | 'CANCELLED';
  channel: ChannelType;
}

export interface LiveChatConversation {
  id: string;
  uid: string; // e.g. "CHT-948210"
  contactId: string;
  name: string;
  identifier: string; // e.g. "+91 77539 83175" or "@nourin_s"
  avatarUrl?: string;
  channel: ChannelType;
  department: DepartmentId;
  assignedAgent?: ChatAgent;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: MessageSenderType;
  tags: {
    id: string;
    name: string;
    color: TagColorId;
    icon: TagIconId;
  }[];
  session: ConversationSessionState;
  isBotActive: boolean;
  status: 'open' | 'closed' | 'snoozed' | 'archived';
  superFields: Record<string, any>;
  internalNotes: InternalNote[];
  remarks: CustomerSentimentRemark;
  scheduledMessages: ScheduledMessage[];
  messages: LiveChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterSegment {
  id: string;
  name: string;
  isPermanent: boolean;
  department?: DepartmentId;
  channel?: ChannelType | 'all';
  sessionStatus?: 'all' | 'active_24h' | 'expired_24h';
  assignedTo?: 'all' | 'me' | 'unassigned';
  tagIds?: string[];
  unreadOnly?: boolean;
}

export interface BulkChatActionPayload {
  conversationIds: string[];
  action: 'TRANSFER_AGENT' | 'TRANSFER_DEPT' | 'MARK_READ' | 'MARK_UNREAD' | 'MARK_CLOSED' | 'ASSIGN_TAG';
  targetAgentId?: string;
  targetDepartment?: DepartmentId;
  tagToAdd?: {
    id: string;
    name: string;
    color: TagColorId;
    icon: TagIconId;
  };
}
