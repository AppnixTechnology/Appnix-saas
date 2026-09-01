export type ConversationCategory =
  | 'MARKETING'
  | 'UTILITY'
  | 'AUTHENTICATION'
  | 'SERVICE'
  | 'TOPUP'
  | 'REFUND';

export type TransactionType = 'DEBIT' | 'CREDIT' | 'REFUND';

export type DeliveryStatus =
  | 'DELIVERED'
  | 'SENT'
  | 'READ'
  | 'FAILED'
  | 'COMPLETED';

export type DateFilterPreset =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'THIS_MONTH'
  | 'CUSTOM';

export interface ChannelTransaction {
  id: string;
  timestamp: string;
  description: string;
  campaignName?: string;
  templateName?: string;
  recipientPhone?: string;
  recipientName?: string;
  channel: 'whatsapp' | 'rcs' | 'instagram' | 'facebook' | 'wallet';
  category: ConversationCategory;
  type: TransactionType;
  unitCount: number; // e.g. 1 session or 3 messages
  unitRate: number; // e.g. 0.7800
  baseRate?: number; // e.g. 0.7200
  platformFee?: number; // e.g. 0.0400
  taxAmount?: number; // e.g. 0.0200
  amount: number; // e.g. 0.7800 or 5000.0000
  closingBalance: number; // e.g. 39.1918
  deliveryStatus: DeliveryStatus;
  isAutoRefunded?: boolean;
  refundTxnId?: string;
  failedReason?: string;
  metaBillingId?: string; // e.g. wamid.HBgLMjE2...
  wabaId?: string;
  messagePayloadSnippet?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface ChannelAccountDetails {
  id: string;
  name: string;
  phoneNumber: string;
  channelType: string;
  wabaId: string;
  status: 'connected' | 'disconnected';
  qualityScore: string;
  currentBalance: number;
  currency: string;
  lastSyncedAt: string;
  minThreshold: number;
  autoRechargeEnabled: boolean;
}

export interface ChannelFilterOptions {
  dateRange: DateFilterPreset;
  startDate?: string;
  endDate?: string;
  campaign: string;
  transactionType: 'ALL' | 'DEBIT' | 'CREDIT' | 'REFUND';
  category: 'ALL' | ConversationCategory;
  searchQuery: string;
}

export interface ChannelSummaryMetrics {
  totalSpend: number;
  totalUnits: number;
  averageCostPerUnit: number;
  creditsAdded: number;
  refundsCount: number;
}
