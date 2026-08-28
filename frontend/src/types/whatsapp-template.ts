export type TemplateCategory = 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';

export type TemplateContentType = 'TEXT' | 'MEDIA' | 'CATALOG' | 'CAROUSEL';

export type HeaderType = 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export type WhatsAppTemplateStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISABLED';

export type ButtonType = 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'COPY_CODE';

export interface TemplateHeader {
  type: HeaderType;
  text?: string;
  mediaUrl?: string;
  mediaFileName?: string;
  sampleValue?: string;
}

export interface TemplateVariable {
  index: number;
  name: string;
  sampleValue: string;
  dataSource: string;
}

export interface CTAButton {
  id: string;
  type: ButtonType;
  text: string;
  url?: string;
  urlType?: 'STATIC' | 'DYNAMIC';
  phoneNumber?: string;
  countryCode?: string;
  payload?: string;
}

export interface CarouselCard {
  id: string;
  mediaUrl?: string;
  header?: string;
  body: string;
  buttons: CTAButton[];
  variables?: TemplateVariable[];
}

export interface CatalogConfig {
  catalogId: string;
  catalogName?: string;
  productId?: string;
  productName?: string;
  bodyText?: string;
  ctaText: string;
}

export interface RejectionDetails {
  code: string;
  reason: string;
  recommendation: string;
  date: string;
}

export interface WhatsAppTemplate {
  id: string;
  tenantId?: string;
  channelId?: string;
  name: string;
  category: TemplateCategory;
  language: string;
  contentType: TemplateContentType;
  header: TemplateHeader;
  body: string;
  variables: TemplateVariable[];
  variableMappings: Record<string, string>;
  footer?: string;
  buttons: CTAButton[];
  catalog?: CatalogConfig;
  carouselCards?: CarouselCard[];
  status: WhatsAppTemplateStatus;
  metaTemplateId?: string;
  rejectionReason?: string;
  rejectionDetails?: RejectionDetails;
  preview?: string;
  qualityScore?: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
