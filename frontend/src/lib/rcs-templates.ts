import {
  RCSTemplate,
  RCSCategory,
  RCSValidationError,
  RCSTemplateVariable,
  RCSAction,
  RCSCard,
  RCSAgent,
  RCSMediaRatio,
} from '@/types/rcs-template';

export const VERIFIED_RCS_AGENTS: RCSAgent[] = [
  {
    id: 'agent-1',
    name: 'Appnix RCS Verified Agent',
    identifier: 'appnix-rcs-prod',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    verified: true,
    status: 'active',
  },
  {
    id: 'agent-2',
    name: 'Appnix Priority Alerts & Billing',
    identifier: 'appnix-alerts-bot',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verified: true,
    status: 'active',
  },
  {
    id: 'agent-3',
    name: 'Appnix Travel & Concierge',
    identifier: 'appnix-travel-prod',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    verified: true,
    status: 'active',
  },
];

export const RCS_CATEGORY_CONFIG: Record<
  RCSCategory,
  {
    title: string;
    subtitle: string;
    description: string;
    badgeStyle: string;
    example: string;
  }
> = {
  PROMOTIONAL: {
    title: 'Promotional / Marketing',
    subtitle: 'Drive sales, exclusive deals, product launches & offers',
    description: 'Rich messages designed for marketing campaigns, seasonal discounts, product announcements, and customer engagement.',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300',
    example: 'Exclusive 40% OFF on all SaaS automation suites. Tap to explore!',
  },
  TRANSACTIONAL: {
    title: 'Transactional',
    subtitle: 'Order updates, flight boarding, shipping & appointments',
    description: 'High-priority transactional alerts, shipping confirmations, event updates, and booking receipts.',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
    example: 'Your order #{{1}} has been shipped via Express delivery. ETA: {{2}}.',
  },
  OTP: {
    title: 'Authentication / OTP',
    subtitle: 'Single-use security codes and 2-step verification',
    description: 'Ultra-secure, high-priority verification codes with quick copy actions and strict carrier anti-phishing protection.',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300',
    example: 'Your Appnix login verification code is {{1}}. Valid for 10 minutes.',
  },
};

export const STANDARD_DATA_SOURCES = [
  { id: 'contact.first_name', label: 'Customer First Name', defaultSample: 'Jitendra' },
  { id: 'contact.full_name', label: 'Customer Full Name', defaultSample: 'Jitendra Kumar' },
  { id: 'contact.phone', label: 'Phone Number', defaultSample: '+91 98765 43210' },
  { id: 'order.id', label: 'Order ID / PNR', defaultSample: 'ORD-89421' },
  { id: 'order.amount', label: 'Order Amount', defaultSample: '₹4,999' },
  { id: 'order.delivery_date', label: 'Delivery / Event Date', defaultSample: 'Tomorrow, 6:00 PM' },
  { id: 'offer.discount', label: 'Discount Percentage', defaultSample: '35%' },
  { id: 'offer.code', label: 'Promo / Voucher Code', defaultSample: 'RCSDEAL35' },
  { id: 'auth.otp', label: '6-Digit OTP Code', defaultSample: '629104' },
  { id: 'event.venue', label: 'Venue / Store Location', defaultSample: 'Appnix HQ, Cyber City' },
  { id: 'custom', label: 'Custom Variable', defaultSample: 'Sample Value' },
];

export const INITIAL_RCS_TEMPLATES: RCSTemplate[] = [
  {
    id: 'rcs-tpl-1',
    agentId: 'agent-1',
    agentName: 'Appnix RCS Verified Agent',
    name: 'festive_season_carousel_offer',
    category: 'PROMOTIONAL',
    messageType: 'CAROUSEL',
    cards: [
      {
        id: 'card-1',
        title: '🌟 Mega Festive Electronics Sale',
        description: 'Hi {{1}}, get up to {{2}}% instant discount on premium smart displays and cloud automation gear! Free next-day shipping included.',
        media: {
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
          ratio: '16:9',
          height: 'MEDIUM',
          fileName: 'electronics_festive_deal.jpg',
        },
        actions: [
          {
            id: 'act-1-1',
            type: 'URL',
            text: 'Shop Electronics',
            url: 'https://appnix.io/shop/electronics',
            webviewMode: 'FULL',
          },
          {
            id: 'act-1-2',
            type: 'LOCATION',
            text: 'Find Near Store',
            latitude: 28.4595,
            longitude: 77.0266,
            locationLabel: 'Appnix Experience Center Gurgaon',
          },
          {
            id: 'act-1-3',
            type: 'REPLY',
            text: 'Send Coupon Code',
            postback: 'PAYLOAD_REQ_COUPON_ELEC',
          },
        ],
      },
      {
        id: 'card-2',
        title: '👗 Designer Lifestyle & Apparel',
        description: 'Upgrade your festive wardrobe with exclusive designer styles. Flat ₹1,500 cashback on orders above {{3}} with code {{4}}.',
        media: {
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
          ratio: '16:9',
          height: 'MEDIUM',
          fileName: 'festive_apparel.jpg',
        },
        actions: [
          {
            id: 'act-2-1',
            type: 'URL',
            text: 'View Collection',
            url: 'https://appnix.io/shop/fashion',
            webviewMode: 'FULL',
          },
          {
            id: 'act-2-2',
            type: 'DIAL',
            text: 'Call Fashion Stylist',
            phoneNumber: '+918062765557',
          },
          {
            id: 'act-2-3',
            type: 'REPLY',
            text: 'Talk to Human',
            postback: 'PAYLOAD_TALK_HUMAN',
          },
        ],
      },
      {
        id: 'card-3',
        title: '🎁 VIP Gifting & Hampers',
        description: 'Send gourmet handcrafted festive hampers with personalized video greetings. Pre-book your delivery slots now!',
        media: {
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
          ratio: '16:9',
          height: 'MEDIUM',
          fileName: 'gifting_hampers.jpg',
        },
        actions: [
          {
            id: 'act-3-1',
            type: 'URL',
            text: 'Order Hampers',
            url: 'https://appnix.io/shop/hampers',
            webviewMode: 'FULL',
          },
          {
            id: 'act-3-2',
            type: 'REPLY',
            text: 'Corporate Inquiry',
            postback: 'PAYLOAD_CORP_INQUIRY',
          },
        ],
      },
    ],
    variables: [
      { index: 1, name: 'Customer First Name', sampleValue: 'Jitendra', dataSource: 'contact.first_name' },
      { index: 2, name: 'Discount Percentage', sampleValue: '45', dataSource: 'offer.discount' },
      { index: 3, name: 'Minimum Cart Value', sampleValue: '₹4,999', dataSource: 'order.amount' },
      { index: 4, name: 'Promo Code', sampleValue: 'DIWALI2026', dataSource: 'offer.code' },
    ],
    variableMappings: {
      '1': 'Customer First Name',
      '2': 'Discount Percentage',
      '3': 'Minimum Cart Value',
      '4': 'Promo Code',
    },
    status: 'APPROVED',
    rcsTemplateId: 'rcs_tpl_948201',
    carrierApprovals: [
      { carrier: 'Jio', status: 'APPROVED', reviewedAt: '2026-08-25T11:20:00Z', carrierId: 'JIO-RCS-9021', notes: 'Approved for national commercial broadcast.' },
      { carrier: 'Airtel', status: 'APPROVED', reviewedAt: '2026-08-25T11:45:00Z', carrierId: 'AIRTEL-RCS-4412', notes: 'Whitelisted sender and rich action buttons verified.' },
      { carrier: 'Vodafone Idea', status: 'APPROVED', reviewedAt: '2026-08-25T12:10:00Z', carrierId: 'VI-RCS-7831', notes: 'Verified without compliance remarks.' },
      { carrier: 'Google Jibe', status: 'APPROVED', reviewedAt: '2026-08-25T10:55:00Z', carrierId: 'JIBE-RCS-8819', notes: 'Passed Google Universal Profile specs.' },
    ],
    createdAt: '2026-08-24T18:30:00Z',
    updatedAt: '2026-08-25T12:10:00Z',
    submittedAt: '2026-08-25T10:30:00Z',
    approvedAt: '2026-08-25T12:10:00Z',
  },
  {
    id: 'rcs-tpl-2',
    agentId: 'agent-3',
    agentName: 'Appnix Travel & Concierge',
    name: 'flight_boarding_pass_alert',
    category: 'TRANSACTIONAL',
    messageType: 'RICH_CARD',
    card: {
      id: 'card-flight-1',
      title: '✈️ Flight Confirmation: AI-804 to Mumbai',
      description: 'Hello {{1}}, your upcoming flight AI-804 departs on {{2}} at {{3}} from Terminal 3, Gate {{4}}. Web check-in is now active. Have your digital boarding pass ready at security.',
      media: {
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
        ratio: '16:9',
        height: 'MEDIUM',
        fileName: 'flight_boarding_banner.jpg',
      },
      actions: [
        {
          id: 'act-fl-1',
          type: 'URL',
          text: 'View Boarding Pass',
          url: 'https://appnix.io/travel/pass/{{1}}',
          webviewMode: 'FULL',
        },
        {
          id: 'act-fl-2',
          type: 'LOCATION',
          text: 'Navigate to T3 Gate',
          latitude: 28.5562,
          longitude: 77.1000,
          locationLabel: 'Indira Gandhi International Airport T3',
        },
        {
          id: 'act-fl-3',
          type: 'DIAL',
          text: 'Airline Helpline',
          phoneNumber: '+9118001801407',
        },
        {
          id: 'act-fl-4',
          type: 'CALENDAR',
          text: 'Add to Calendar',
          calendarTitle: 'Flight AI-804 (DEL -> BOM)',
          calendarDescription: 'Departure from T3 Gate 14B. PNR: AIR892',
          calendarStartTime: '2026-09-05T14:30:00Z',
          calendarEndTime: '2026-09-05T16:45:00Z',
        },
      ],
    },
    variables: [
      { index: 1, name: 'Passenger Name', sampleValue: 'Jitendra Kumar', dataSource: 'contact.full_name' },
      { index: 2, name: 'Departure Date', sampleValue: 'Friday, 5th Sep 2026', dataSource: 'order.delivery_date' },
      { index: 3, name: 'Departure Time', sampleValue: '14:30 IST', dataSource: 'custom' },
      { index: 4, name: 'Gate Number', sampleValue: '14B', dataSource: 'custom' },
    ],
    variableMappings: {
      '1': 'Passenger Name',
      '2': 'Departure Date',
      '3': 'Departure Time',
      '4': 'Gate Number',
    },
    status: 'APPROVED',
    rcsTemplateId: 'rcs_tpl_948202',
    carrierApprovals: [
      { carrier: 'Jio', status: 'APPROVED', reviewedAt: '2026-08-26T09:15:00Z', carrierId: 'JIO-RCS-9044' },
      { carrier: 'Airtel', status: 'APPROVED', reviewedAt: '2026-08-26T09:20:00Z', carrierId: 'AIRTEL-RCS-4455' },
      { carrier: 'Vodafone Idea', status: 'APPROVED', reviewedAt: '2026-08-26T09:30:00Z', carrierId: 'VI-RCS-7866' },
      { carrier: 'Google Jibe', status: 'APPROVED', reviewedAt: '2026-08-26T09:10:00Z', carrierId: 'JIBE-RCS-8833' },
    ],
    createdAt: '2026-08-26T08:30:00Z',
    updatedAt: '2026-08-26T09:30:00Z',
    submittedAt: '2026-08-26T09:00:00Z',
    approvedAt: '2026-08-26T09:30:00Z',
  },
  {
    id: 'rcs-tpl-3',
    agentId: 'agent-2',
    agentName: 'Appnix Priority Alerts & Billing',
    name: 'instant_login_security_otp',
    category: 'OTP',
    messageType: 'TEXT',
    textBody: '🔐 Appnix Security Alert: Your one-time login verification passcode is {{1}}.\n\nThis OTP is valid for {{2}} minutes. Do not share this code with anyone, including customer care representatives.',
    standaloneActions: [
      {
        id: 'act-otp-1',
        type: 'REPLY',
        text: 'Copy OTP: 629104',
        postback: 'PAYLOAD_COPY_OTP',
      },
      {
        id: 'act-otp-2',
        type: 'REPLY',
        text: 'Not Me? Report Fraud',
        postback: 'PAYLOAD_REPORT_FRAUD',
      },
    ],
    variables: [
      { index: 1, name: 'OTP Passcode', sampleValue: '629104', dataSource: 'auth.otp' },
      { index: 2, name: 'Validity Period', sampleValue: '10', dataSource: 'custom' },
    ],
    variableMappings: {
      '1': 'OTP Passcode',
      '2': 'Validity Period',
    },
    status: 'APPROVED',
    rcsTemplateId: 'rcs_tpl_948203',
    carrierApprovals: [
      { carrier: 'Jio', status: 'APPROVED', reviewedAt: '2026-08-27T06:00:00Z', carrierId: 'JIO-OTP-1102' },
      { carrier: 'Airtel', status: 'APPROVED', reviewedAt: '2026-08-27T06:05:00Z', carrierId: 'AIRTEL-OTP-2203' },
      { carrier: 'Vodafone Idea', status: 'APPROVED', reviewedAt: '2026-08-27T06:10:00Z', carrierId: 'VI-OTP-3304' },
      { carrier: 'Google Jibe', status: 'APPROVED', reviewedAt: '2026-08-27T05:50:00Z', carrierId: 'JIBE-OTP-4405' },
    ],
    createdAt: '2026-08-27T05:30:00Z',
    updatedAt: '2026-08-27T06:10:00Z',
    submittedAt: '2026-08-27T05:40:00Z',
    approvedAt: '2026-08-27T06:10:00Z',
  },
  {
    id: 'rcs-tpl-4',
    agentId: 'agent-1',
    agentName: 'Appnix RCS Verified Agent',
    name: 'exclusive_ai_summit_2026',
    category: 'PROMOTIONAL',
    messageType: 'RICH_CARD',
    card: {
      id: 'card-summit-1',
      title: '🚀 Global Enterprise AI Summit 2026',
      description: 'You are cordially invited, {{1}}! Join 2,500+ tech leaders at the annual flagship AI Innovation Convention in Bengaluru on {{2}}. Claim your early-bird delegate pass today.',
      media: {
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        ratio: '16:9',
        height: 'TALL',
        fileName: 'ai_summit_keynote.jpg',
      },
      actions: [
        {
          id: 'act-sm-1',
          type: 'URL',
          text: 'Register Pass (50% Off)',
          url: 'https://appnix.io/events/ai-summit-2026',
          webviewMode: 'FULL',
        },
        {
          id: 'act-sm-2',
          type: 'CALENDAR',
          text: 'Add to Calendar',
          calendarTitle: 'Global Enterprise AI Summit 2026',
          calendarDescription: 'Keynote by Appnix Research & Google Cloud AI Team.',
          calendarStartTime: '2026-09-18T09:00:00Z',
          calendarEndTime: '2026-09-19T18:00:00Z',
        },
        {
          id: 'act-sm-3',
          type: 'LOCATION',
          text: 'View Summit Venue',
          latitude: 12.9716,
          longitude: 77.5946,
          locationLabel: 'Bangalore International Exhibition Centre',
        },
      ],
    },
    variables: [
      { index: 1, name: 'Attendee Name', sampleValue: 'Jitendra Kumar', dataSource: 'contact.full_name' },
      { index: 2, name: 'Summit Date', sampleValue: 'September 18-19, 2026', dataSource: 'custom' },
    ],
    variableMappings: {
      '1': 'Attendee Name',
      '2': 'Summit Date',
    },
    status: 'PENDING',
    rcsTemplateId: 'rcs_tpl_948204_pending',
    carrierApprovals: [
      { carrier: 'Google Jibe', status: 'APPROVED', reviewedAt: '2026-08-29T14:00:00Z', notes: 'Syntax verified.' },
      { carrier: 'Jio', status: 'PENDING', notes: 'Under TRAI compliance review.' },
      { carrier: 'Airtel', status: 'PENDING', notes: 'Queue position #14 in commercial batch.' },
      { carrier: 'Vodafone Idea', status: 'PENDING', notes: 'Pending brand sender tag approval.' },
    ],
    createdAt: '2026-08-29T13:40:00Z',
    updatedAt: '2026-08-29T14:00:00Z',
    submittedAt: '2026-08-29T13:50:00Z',
  },
  {
    id: 'rcs-tpl-5',
    agentId: 'agent-2',
    agentName: 'Appnix Priority Alerts & Billing',
    name: 'credit_card_bill_statement',
    category: 'TRANSACTIONAL',
    messageType: 'RICH_CARD',
    card: {
      id: 'card-bill-1',
      title: '💳 Monthly Statement Generated',
      description: 'Your credit card statement ending in {{1}} for this billing cycle is {{2}}. Due date: {{3}}. Pay before due date to avoid interest charges.',
      media: {
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
        ratio: '16:9',
        height: 'SHORT',
        fileName: 'card_statement.jpg',
      },
      actions: [
        {
          id: 'act-bill-1',
          type: 'URL',
          text: 'Pay Total Due',
          url: 'http://insecure-payment-gateway.net/pay/{{1}}',
          webviewMode: 'FULL',
        },
        {
          id: 'act-bill-2',
          type: 'DIAL',
          text: 'Card Concierge',
          phoneNumber: '18000',
        },
      ],
    },
    variables: [
      { index: 1, name: 'Card Ending Digits', sampleValue: '9082', dataSource: 'custom' },
      { index: 2, name: 'Total Amount Due', sampleValue: '₹24,850', dataSource: 'order.amount' },
      { index: 3, name: 'Payment Due Date', sampleValue: '12th Sep 2026', dataSource: 'order.delivery_date' },
    ],
    variableMappings: {
      '1': 'Card Ending Digits',
      '2': 'Total Amount Due',
      '3': 'Payment Due Date',
    },
    status: 'REJECTED',
    rcsTemplateId: 'rcs_tpl_948205_rej',
    rejectionReason: 'Carrier Policy Violation: Unsecured HTTP link in financial action button and short invalid phone number.',
    rejectionDetails: {
      code: 'CARRIER_SEC_HTTPS_AND_DIALER_REQUIRED',
      carrier: 'Airtel & Jio Telecom Compliance',
      reason: 'Payment destination URL uses insecure "http://" protocol instead of verified "https://", and the dial action specifies an incomplete phone number.',
      recommendation: 'Update URL to an authorized HTTPS domain registered with your DLT corporate account, and provide a full E.164 phone number format (e.g. +91 1800 123 4567).',
      date: '2026-08-28T16:20:00Z',
    },
    carrierApprovals: [
      { carrier: 'Airtel', status: 'REJECTED', reviewedAt: '2026-08-28T16:15:00Z', notes: 'Insecure URL rejected by automated carrier firewall.' },
      { carrier: 'Jio', status: 'REJECTED', reviewedAt: '2026-08-28T16:20:00Z', notes: 'Phone number did not match whitelisted telecom registry.' },
      { carrier: 'Vodafone Idea', status: 'PENDING' },
      { carrier: 'Google Jibe', status: 'APPROVED' },
    ],
    createdAt: '2026-08-28T15:00:00Z',
    updatedAt: '2026-08-28T16:20:00Z',
    submittedAt: '2026-08-28T15:30:00Z',
  },
  {
    id: 'rcs-tpl-6',
    agentId: 'agent-1',
    agentName: 'Appnix RCS Verified Agent',
    name: 'autumn_product_drop_draft',
    category: 'PROMOTIONAL',
    messageType: 'CAROUSEL',
    cards: [
      {
        id: 'card-draft-1',
        title: '🍂 Autumn Capsule Drop #1',
        description: 'Be the first to explore our upcoming autumn collection with early access privileges for {{1}}.',
        media: {
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
          ratio: '1:1',
          height: 'MEDIUM',
          fileName: 'autumn_preview.jpg',
        },
        actions: [
          {
            id: 'act-dr-1',
            type: 'REPLY',
            text: 'Notify Me First',
            postback: 'NOTIFY_ME_AUTUMN',
          },
        ],
      },
      {
        id: 'card-draft-2',
        title: '🧥 Wool Outerwear & Sweaters',
        description: 'Handcrafted luxury knitwear in natural earth tones. Pre-orders open this Friday.',
        media: {
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
          ratio: '1:1',
          height: 'MEDIUM',
          fileName: 'outerwear_drop.jpg',
        },
        actions: [
          {
            id: 'act-dr-2',
            type: 'URL',
            text: 'Preview Lookbook',
            url: 'https://appnix.io/lookbook',
            webviewMode: 'COMPACT',
          },
        ],
      },
    ],
    variables: [
      { index: 1, name: 'VIP Customer Name', sampleValue: 'Jitendra', dataSource: 'contact.first_name' },
    ],
    variableMappings: {
      '1': 'VIP Customer Name',
    },
    status: 'DRAFT',
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-30T11:15:00Z',
  },
];

const STORAGE_KEY = 'appnix_rcs_templates';

export function getStoredRCSTemplates(): RCSTemplate[] {
  if (typeof window === 'undefined') {
    return INITIAL_RCS_TEMPLATES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RCS_TEMPLATES));
      return INITIAL_RCS_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_RCS_TEMPLATES;
  } catch (e) {
    console.error('Failed to read RCS templates from localStorage:', e);
    return INITIAL_RCS_TEMPLATES;
  }
}

export function saveStoredRCSTemplates(templates: RCSTemplate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    window.dispatchEvent(new Event('rcs-templates-changed'));
  } catch (e) {
    console.error('Failed to save RCS templates to localStorage:', e);
  }
}

export function extractVariablesFromText(text: string): number[] {
  if (!text) return [];
  const regex = /\{\{(\d+)\}\}/g;
  const indices = new Set<number>();
  let match;
  while ((match = regex.exec(text)) !== null) {
    const index = parseInt(match[1], 10);
    if (!isNaN(index)) {
      indices.add(index);
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

export function interpolateRCSVariables(
  text: string,
  variables: RCSTemplateVariable[] = [],
  customOverrides: Record<string, string> = {}
): string {
  if (!text) return '';
  return text.replace(/\{\{(\d+)\}\}/g, (match, p1) => {
    const index = parseInt(p1, 10);
    if (customOverrides[p1] !== undefined && customOverrides[p1].trim() !== '') {
      return customOverrides[p1];
    }
    const foundVar = variables.find((v) => v.index === index);
    if (foundVar && foundVar.sampleValue) {
      return foundVar.sampleValue;
    }
    return `[Variable ${index}]`;
  });
}

export function validateRCSTemplate(template: Partial<RCSTemplate>): RCSValidationError[] {
  const errors: RCSValidationError[] = [];

  // Template Name validation
  if (!template.name || template.name.trim() === '') {
    errors.push({ field: 'name', message: 'Template name is required.' });
  } else {
    const namePattern = /^[a-z0-9_]{3,64}$/;
    if (!namePattern.test(template.name)) {
      errors.push({
        field: 'name',
        message: 'Template name must be lowercase alphanumeric with underscores only (3-64 chars). No spaces or special symbols.',
      });
    }
  }

  // Linked Agent check
  if (!template.agentId) {
    errors.push({ field: 'agentId', message: 'Please select a verified RCS Bot/Agent.' });
  }

  // Category check
  if (!template.category) {
    errors.push({ field: 'category', message: 'Please choose a message category.' });
  }

  // Message Type validation
  if (!template.messageType) {
    errors.push({ field: 'messageType', message: 'Please select an RCS Message Type.' });
    return errors;
  }

  if (template.messageType === 'TEXT') {
    if (!template.textBody || template.textBody.trim() === '') {
      errors.push({ field: 'textBody', message: 'Message text body is required.' });
    } else if (template.textBody.length > 2000) {
      errors.push({ field: 'textBody', message: `Text body cannot exceed 2000 characters (currently ${template.textBody.length}).` });
    }

    if (template.standaloneActions && template.standaloneActions.length > 4) {
      errors.push({ field: 'standaloneActions', message: 'Maximum 4 suggested action buttons allowed for text messages.' });
    }

    // Validate actions
    template.standaloneActions?.forEach((act, actIdx) => {
      validateSingleAction(act, `standaloneActions[${actIdx}]`, errors);
    });
  } else if (template.messageType === 'RICH_CARD') {
    if (!template.card) {
      errors.push({ field: 'card', message: 'Card configuration is missing.' });
    } else {
      validateCard(template.card, 0, errors);
    }
  } else if (template.messageType === 'CAROUSEL') {
    const cards = template.cards || [];
    if (cards.length < 2) {
      errors.push({ field: 'cards', message: 'Carousel requires at least 2 rich cards.' });
    } else if (cards.length > 10) {
      errors.push({ field: 'cards', message: 'Carousel cannot exceed 10 cards.' });
    }

    cards.forEach((c, idx) => {
      validateCard(c, idx, errors);
    });
  }

  return errors;
}

function validateCard(card: RCSCard, cardIndex: number, errors: RCSValidationError[]): void {
  const prefix = `Card ${cardIndex + 1}`;

  if (!card.description || card.description.trim() === '') {
    errors.push({
      field: `card-${cardIndex}-description`,
      cardIndex,
      message: `${prefix}: Description/Body is required.`,
    });
  } else if (card.description.length > 2000) {
    errors.push({
      field: `card-${cardIndex}-description`,
      cardIndex,
      message: `${prefix}: Description cannot exceed 2000 characters.`,
    });
  }

  if (card.title && card.title.length > 200) {
    errors.push({
      field: `card-${cardIndex}-title`,
      cardIndex,
      message: `${prefix}: Title cannot exceed 200 characters.`,
    });
  }

  if (card.actions && card.actions.length > 4) {
    errors.push({
      field: `card-${cardIndex}-actions`,
      cardIndex,
      message: `${prefix}: Maximum 4 action buttons allowed per card.`,
    });
  }

  card.actions?.forEach((act, actIdx) => {
    validateSingleAction(act, `${prefix} Action ${actIdx + 1}`, errors, cardIndex);
  });
}

function validateSingleAction(
  act: RCSAction,
  label: string,
  errors: RCSValidationError[],
  cardIndex?: number
): void {
  if (!act.text || act.text.trim() === '') {
    errors.push({
      field: `act-text-${act.id}`,
      cardIndex,
      message: `${label}: Button label text is required (max 25 characters).`,
    });
  } else if (act.text.length > 25) {
    errors.push({
      field: `act-text-${act.id}`,
      cardIndex,
      message: `${label}: Button label "${act.text}" exceeds 25 character limit.`,
    });
  }

  if (act.type === 'URL') {
    if (!act.url || act.url.trim() === '') {
      errors.push({
        field: `act-url-${act.id}`,
        cardIndex,
        message: `${label}: Target URL is required.`,
      });
    } else if (!act.url.startsWith('http://') && !act.url.startsWith('https://')) {
      errors.push({
        field: `act-url-${act.id}`,
        cardIndex,
        message: `${label}: Target URL must start with https:// (or http://).`,
      });
    }
  } else if (act.type === 'DIAL') {
    if (!act.phoneNumber || act.phoneNumber.trim() === '') {
      errors.push({
        field: `act-phone-${act.id}`,
        cardIndex,
        message: `${label}: Phone number is required for Dial action.`,
      });
    }
  } else if (act.type === 'LOCATION') {
    if (act.latitude === undefined || act.longitude === undefined) {
      if (!act.locationQuery && !act.locationLabel) {
        errors.push({
          field: `act-loc-${act.id}`,
          cardIndex,
          message: `${label}: Either coordinates (Lat/Lng) or location name/query is required.`,
        });
      }
    }
  } else if (act.type === 'CALENDAR') {
    if (!act.calendarTitle || act.calendarTitle.trim() === '') {
      errors.push({
        field: `act-cal-${act.id}`,
        cardIndex,
        message: `${label}: Calendar event title is required.`,
      });
    }
  }
}
