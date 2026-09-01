export type RCSCategory = 'PROMOTIONAL' | 'TRANSACTIONAL' | 'OTP';

export type RCSMessageType = 'TEXT' | 'RICH_CARD' | 'CAROUSEL';

export type RCSTemplateStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISABLED';

export type RCSMediaType = 'IMAGE' | 'VIDEO';

export type RCSMediaHeight = 'SHORT' | 'MEDIUM' | 'TALL';

export type RCSMediaRatio = '16:9' | '1:1';

export type RCSActionType =
  | 'REPLY'
  | 'URL'
  | 'DIAL'
  | 'LOCATION'
  | 'CALENDAR';

export interface RCSMedia {
  type: RCSMediaType;
  url?: string;
  fileName?: string;
  height?: RCSMediaHeight;
  ratio?: RCSMediaRatio;
  fileSize?: string;
  thumbnailUrl?: string;
}

export interface RCSTemplateVariable {
  index: number;
  name: string;
  sampleValue: string;
  dataSource: string;
}

export interface RCSAction {
  id: string;
  type: RCSActionType;
  text: string;
  postback?: string;
  url?: string;
  webviewMode?: 'COMPACT' | 'TALL' | 'FULL';
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  locationQuery?: string;
  locationLabel?: string;
  calendarTitle?: string;
  calendarDescription?: string;
  calendarStartTime?: string;
  calendarEndTime?: string;
}

export interface RCSCard {
  id: string;
  title?: string;
  description: string;
  media?: RCSMedia;
  actions: RCSAction[];
  variables?: RCSTemplateVariable[];
}

export interface CarrierApproval {
  carrier: 'Jio' | 'Airtel' | 'Vodafone Idea' | 'Google Jibe';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  reviewedAt?: string;
  notes?: string;
  carrierId?: string;
}

export interface RCSRejectionDetails {
  code: string;
  reason: string;
  carrier: string;
  recommendation: string;
  date: string;
}

export interface RCSAgent {
  id: string;
  name: string;
  identifier: string;
  avatarUrl?: string;
  verified: boolean;
  status: 'active' | 'inactive';
}

export interface RCSTemplate {
  id: string;
  tenantId?: string;
  channelId?: string;
  agentId: string;
  agentName: string;
  name: string;
  category: RCSCategory;
  messageType: RCSMessageType;
  
  // For TEXT message type
  textBody?: string;
  standaloneActions?: RCSAction[];

  // For SINGLE RICH CARD
  card?: RCSCard;

  // For CAROUSEL (up to 10 cards)
  cards?: RCSCard[];

  variables: RCSTemplateVariable[];
  variableMappings: Record<string, string>;

  status: RCSTemplateStatus;
  rcsTemplateId?: string;
  carrierApprovals?: CarrierApproval[];
  rejectionReason?: string;
  rejectionDetails?: RCSRejectionDetails;

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface RCSValidationError {
  field: string;
  cardIndex?: number;
  message: string;
}
