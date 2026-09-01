import {
  ChatAgent,
  ConversationSessionState,
  LiveChatConversation,
  LiveChatMessage,
} from '@/types/live-chat';

export const MOCK_AGENTS: ChatAgent[] = [
  {
    id: 'agent-1',
    name: 'Jitendra Kumar',
    email: 'jitendra@appnix.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
    role: 'Lead Solutions Architect',
    department: 'sales',
    isOnline: true,
  },
  {
    id: 'agent-2',
    name: 'Aarav Sharma',
    email: 'aarav@appnix.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
    role: 'Customer Support Lead',
    department: 'support',
    isOnline: true,
  },
  {
    id: 'agent-3',
    name: 'Pooja Iyer',
    email: 'pooja@appnix.io',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    role: 'Billing & Subscriptions Manager',
    department: 'billing',
    isOnline: false,
  },
  {
    id: 'agent-4',
    name: 'Rohan Mehta',
    email: 'rohan@appnix.io',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces',
    role: 'Enterprise Onboarding Specialist',
    department: 'onboarding',
    isOnline: true,
  },
];

export const MOCK_APPROVED_TEMPLATES = [
  {
    id: 'tpl-reengage-1',
    name: 'reengage_support_ticket',
    displayName: 'Support Ticket Follow-Up',
    category: 'UTILITY',
    channel: 'whatsapp' as const,
    language: 'en_US',
    bodyText: 'Hello {{1}}, we noticed your inquiry regarding {{2}} is still open. Are you still experiencing issues or may we close this ticket?',
    header: 'Ticket Update (#{{3}})',
    buttons: ['Yes, resolve ticket', 'Need more help'],
  },
  {
    id: 'tpl-reengage-2',
    name: 'enterprise_quote_reminder',
    displayName: 'Enterprise Quotation Review',
    category: 'MARKETING',
    channel: 'whatsapp' as const,
    language: 'en_US',
    bodyText: 'Hi {{1}}! Your customized enterprise quota for {{2}} channels has been prepared. Would you like to schedule a quick 10-minute walkthrough with our architect?',
    header: 'Appnix Enterprise Proposal',
    buttons: ['Schedule Demo', 'View PDF Quote'],
  },
  {
    id: 'tpl-reengage-3',
    name: 'rcs_product_showcase',
    displayName: 'RCS Product Catalog Showcase',
    category: 'MARKETING',
    channel: 'rcs' as const,
    language: 'en',
    bodyText: 'Explore our latest verified RCS business messaging features with dynamic carousel cards and 1-tap OTP verification.',
    header: 'RCS Business Suite',
    buttons: ['Explore Catalog', 'Contact Specialist'],
  },
];

export function computeSessionState(lastCustomerIso: string): ConversationSessionState {
  const now = Date.now();
  const lastTime = new Date(lastCustomerIso).getTime();
  const expiresTime = lastTime + 24 * 60 * 60 * 1000;
  const remainingMs = expiresTime - now;

  if (remainingMs <= 0) {
    return {
      isActive: false,
      lastCustomerMessageAt: lastCustomerIso,
      expiresAt: new Date(expiresTime).toISOString(),
      remainingHours: 0,
      remainingMinutes: 0,
      formattedRemaining: '24h Window Expired',
    };
  }

  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isActive: true,
    lastCustomerMessageAt: lastCustomerIso,
    expiresAt: new Date(expiresTime).toISOString(),
    remainingHours,
    remainingMinutes,
    formattedRemaining: `${remainingHours}h ${remainingMinutes}m remaining`,
  };
}

export const INITIAL_CONVERSATIONS: LiveChatConversation[] = [
  {
    id: 'conv-1',
    uid: 'CHT-948210',
    contactId: 'cnt-1',
    name: 'Ankit Bansal',
    identifier: '+91 77539 83175',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
    channel: 'whatsapp',
    department: 'sales',
    assignedAgent: MOCK_AGENTS[0],
    online: true,
    unreadCount: 2,
    lastMessage: 'Can you send the pricing sheet for enterprise whatsapp bot?',
    lastMessageTime: '10:45 AM',
    lastMessageSender: 'customer',
    tags: [
      { id: 'tag-hot-lead', name: 'Hot Lead', color: 'red', icon: 'flame' },
      { id: 'tag-vip', name: 'VIP Customer', color: 'purple', icon: 'star' },
    ],
    session: computeSessionState(new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()), // 21 hrs remaining
    isBotActive: false,
    status: 'open',
    superFields: {
      city: 'Mumbai, India',
      marketingBudget: '$12,000 / month',
      customerTier: 'Enterprise Prospect',
      kycStatus: 'Verified',
      companyName: 'TechCorp Logistics Ltd',
    },
    internalNotes: [
      {
        id: 'note-1',
        authorId: 'agent-1',
        authorName: 'Jitendra Kumar',
        content: 'Ankit is evaluating high-throughput WhatsApp Cloud API + RCS failover for OTP delivery.',
        createdAt: '2026-08-30T14:30:00Z',
      },
    ],
    remarks: {
      sentiment: 'positive',
      leadStage: 'Negotiation',
      notes: 'High intent enterprise buyer. Ready to close upon contract SLA sign-off.',
      lastUpdated: '2026-08-30T18:00:00Z',
    },
    scheduledMessages: [
      {
        id: 'sch-1',
        templateName: 'enterprise_quote_reminder',
        scheduledFor: '2026-08-31T15:00:00Z',
        status: 'PENDING',
        channel: 'whatsapp',
      },
    ],
    messages: [
      {
        id: 'm1',
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Ankit Bansal',
        text: 'Hi Appnix team! We are looking to automate our lead intake across WhatsApp and RCS.',
        timestamp: '10:40 AM',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        carrierAudit: {
          messageId: 'm1',
          channel: 'whatsapp',
          sentAt: '10:40:02 AM',
          deliveredAt: '10:40:03 AM',
          readAt: '10:41:00 AM',
          carrierNetwork: 'Airtel India (WhatsApp Cloud API)',
        },
      },
      {
        id: 'm2',
        conversationId: 'conv-1',
        sender: 'agent',
        senderName: 'Jitendra Kumar',
        text: 'Hello Ankit! Happy to help. What monthly message volume are you estimating for your initial rollout?',
        timestamp: '10:42 AM',
        createdAt: new Date(Date.now() - 2.8 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        carrierAudit: {
          messageId: 'm2',
          channel: 'whatsapp',
          sentAt: '10:42:01 AM',
          deliveredAt: '10:42:02 AM',
          readAt: '10:43:15 AM',
          carrierNetwork: 'Meta Cloud API v20.0',
          costInr: 0.82,
        },
      },
      {
        id: 'm3',
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Ankit Bansal',
        text: 'Around 250,000 messages/month, including transactional OTPs and marketing broadcasts.',
        timestamp: '10:44 AM',
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm4',
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Ankit Bansal',
        text: 'Can you send the pricing sheet for enterprise whatsapp bot?',
        timestamp: '10:45 AM',
        createdAt: new Date(Date.now() - 2.4 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-30T10:45:00Z',
  },
  {
    id: 'conv-2',
    uid: 'CHT-884102',
    contactId: 'cnt-2',
    name: 'Nourin Sodawala',
    identifier: '@nourin_s',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    channel: 'instagram',
    department: 'sales',
    assignedAgent: MOCK_AGENTS[0],
    online: true,
    unreadCount: 0,
    lastMessage: 'The automation workflow looks great! Thank you.',
    lastMessageTime: '09:30 AM',
    lastMessageSender: 'customer',
    tags: [
      { id: 'tag-paid-user', name: 'Paid User', color: 'emerald', icon: 'shield' },
    ],
    session: computeSessionState(new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()),
    isBotActive: true,
    status: 'open',
    superFields: {
      city: 'Dubai, UAE',
      marketingBudget: '$15,000 / month',
      customerTier: 'Influencer Agency',
    },
    internalNotes: [],
    remarks: {
      sentiment: 'positive',
      leadStage: 'Closed Won',
      notes: 'Successfully deployed Instagram DM keyword trigger automation.',
      lastUpdated: '2026-08-30T09:40:00Z',
    },
    scheduledMessages: [],
    messages: [
      {
        id: 'm21',
        conversationId: 'conv-2',
        sender: 'customer',
        senderName: 'Nourin Sodawala',
        text: 'Hey! Saw your story about the new AI bot builder for Instagram DMs.',
        timestamp: '09:15 AM',
        createdAt: new Date(Date.now() - 5.2 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm22',
        conversationId: 'conv-2',
        sender: 'agent',
        senderName: 'Jitendra Kumar',
        text: 'Hey Nourin! Yes, it supports auto-responding to story mentions, post comments, and direct inquiries seamlessly.',
        timestamp: '09:20 AM',
        createdAt: new Date(Date.now() - 5.1 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm23',
        conversationId: 'conv-2',
        sender: 'customer',
        senderName: 'Nourin Sodawala',
        text: 'The automation workflow looks great! Thank you.',
        timestamp: '09:30 AM',
        createdAt: new Date(Date.now() - 5.0 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    createdAt: '2026-08-25T09:00:00Z',
    updatedAt: '2026-08-30T09:30:00Z',
  },
  {
    id: 'conv-3',
    uid: 'CHT-773918',
    contactId: 'cnt-3',
    name: 'Rahul Verma',
    identifier: '+91 99112 34578',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
    channel: 'rcs',
    department: 'support',
    assignedAgent: MOCK_AGENTS[1],
    online: false,
    unreadCount: 1,
    lastMessage: 'Is Rich Card carousel supported in RCS messaging?',
    lastMessageTime: 'Yesterday',
    lastMessageSender: 'customer',
    tags: [
      { id: 'tag-important', name: 'Important Lead', color: 'amber', icon: 'alert-triangle' },
    ],
    // 24-hr session expired 6 hours ago!
    session: computeSessionState(new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()),
    isBotActive: false,
    status: 'open',
    superFields: {
      city: 'Bengaluru, India',
      marketingBudget: '$5,000 / month',
      customerTier: 'E-commerce Brand',
    },
    internalNotes: [
      {
        id: 'note-3',
        authorId: 'agent-2',
        authorName: 'Aarav Sharma',
        content: 'Customer session expired. Needs an approved RCS template dispatch to re-engage.',
        createdAt: '2026-08-30T16:00:00Z',
      },
    ],
    remarks: {
      sentiment: 'neutral',
      leadStage: 'Discovery',
      notes: 'Testing RCS rich card carousels vs WhatsApp catalogs.',
      lastUpdated: '2026-08-30T17:00:00Z',
    },
    scheduledMessages: [],
    messages: [
      {
        id: 'm31',
        conversationId: 'conv-3',
        sender: 'customer',
        senderName: 'Rahul Verma',
        text: 'Hello, we want to launch an interactive product catalog over RCS with 10 carousel cards.',
        timestamp: 'Yesterday 04:12 PM',
        createdAt: new Date(Date.now() - 30.5 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm32',
        conversationId: 'conv-3',
        sender: 'customer',
        senderName: 'Rahul Verma',
        text: 'Is Rich Card carousel supported in RCS messaging?',
        timestamp: 'Yesterday 04:14 PM',
        createdAt: new Date(Date.now() - 30.0 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    createdAt: '2026-08-28T16:00:00Z',
    updatedAt: '2026-08-29T16:14:00Z',
  },
  {
    id: 'conv-4',
    uid: 'CHT-612940',
    contactId: 'cnt-4',
    name: 'Sneha Patel',
    identifier: 'Sneha Patel (Messenger)',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
    channel: 'facebook',
    department: 'support',
    assignedAgent: MOCK_AGENTS[1],
    online: true,
    unreadCount: 0,
    lastMessage: 'We have activated the Messenger webhook integration.',
    lastMessageTime: 'Yesterday',
    lastMessageSender: 'agent',
    tags: [
      { id: 'tag-priority-support', name: 'Priority Support', color: 'blue', icon: 'zap' },
    ],
    session: computeSessionState(new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()),
    isBotActive: false,
    status: 'open',
    superFields: {
      city: 'Ahmedabad, India',
      marketingBudget: '$20,000 / month',
      customerTier: 'Enterprise Support',
    },
    internalNotes: [],
    remarks: {
      sentiment: 'positive',
      leadStage: 'Demo',
      notes: 'Facebook page webhook successfully linked and verified.',
      lastUpdated: '2026-08-30T11:00:00Z',
    },
    scheduledMessages: [],
    messages: [
      {
        id: 'm41',
        conversationId: 'conv-4',
        sender: 'customer',
        senderName: 'Sneha Patel',
        text: 'Hi support team, checking status of our Facebook Page connection.',
        timestamp: 'Yesterday 02:00 PM',
        createdAt: new Date(Date.now() - 12.5 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm42',
        conversationId: 'conv-4',
        sender: 'agent',
        senderName: 'Aarav Sharma',
        text: 'Everything is synced! We have activated the Messenger webhook integration.',
        timestamp: 'Yesterday 02:05 PM',
        createdAt: new Date(Date.now() - 12.0 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
    ],
    createdAt: '2026-08-27T14:00:00Z',
    updatedAt: '2026-08-29T14:05:00Z',
  },
  {
    id: 'conv-5',
    uid: 'CHT-529014',
    contactId: 'cnt-5',
    name: 'Vikram Malhotra',
    identifier: '+91 98765 43210',
    channel: 'whatsapp',
    department: 'billing',
    assignedAgent: MOCK_AGENTS[2],
    online: true,
    unreadCount: 0,
    lastMessage: 'Invoice payment for Q3 prepaid credits is confirmed.',
    lastMessageTime: '17 Feb',
    lastMessageSender: 'agent',
    tags: [
      { id: 'tag-q3-deal', name: 'Q3 Deal', color: 'indigo', icon: 'bookmark' },
      { id: 'tag-vip', name: 'VIP Customer', color: 'purple', icon: 'star' },
    ],
    session: computeSessionState(new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()), // Expired
    isBotActive: false,
    status: 'open',
    superFields: {
      city: 'Delhi, India',
      marketingBudget: '$25,000 / month',
      customerTier: 'Enterprise Annual',
    },
    internalNotes: [],
    remarks: {
      sentiment: 'positive',
      leadStage: 'Closed Won',
      notes: 'Prepaid 1M WhatsApp conversation balance.',
      lastUpdated: '2026-08-25T10:00:00Z',
    },
    scheduledMessages: [],
    messages: [
      {
        id: 'm51',
        conversationId: 'conv-5',
        sender: 'customer',
        senderName: 'Vikram Malhotra',
        text: 'Can you please share our updated GST invoice for the ₹50,000 wallet top-up?',
        timestamp: '17 Feb 03:00 PM',
        createdAt: new Date(Date.now() - 48.5 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm52',
        conversationId: 'conv-5',
        sender: 'agent',
        senderName: 'Pooja Iyer',
        text: 'Invoice payment for Q3 prepaid credits is confirmed. PDF sent to your registered billing email.',
        timestamp: '17 Feb 03:15 PM',
        createdAt: new Date(Date.now() - 48.0 * 60 * 60 * 1000).toISOString(),
        status: 'read',
      },
      {
        id: 'm53',
        conversationId: 'conv-5',
        sender: 'agent',
        senderName: 'System Bot',
        text: 'Automated notification: Payment receipt #INV-98231 generated.',
        timestamp: '17 Feb 03:16 PM',
        createdAt: new Date(Date.now() - 47.9 * 60 * 60 * 1000).toISOString(),
        status: 'failed',
        carrierAudit: {
          messageId: 'm53',
          channel: 'whatsapp',
          failedAt: '17 Feb 03:16:12 PM',
          errorCode: '#131047',
          errorReason: 'Message failed: Re-engagement outside 24-hour customer care window.',
        },
      },
    ],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-17T15:16:00Z',
  },
];

const STORAGE_KEY = 'appnix_crm_live_chat_v2';

export function getStoredConversations(): LiveChatConversation[] {
  if (typeof window === 'undefined') return INITIAL_CONVERSATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_CONVERSATIONS;
  } catch (e) {
    console.error('Failed to parse conversations from localStorage:', e);
    return INITIAL_CONVERSATIONS;
  }
}

export function saveStoredConversations(conversations: LiveChatConversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    window.dispatchEvent(new Event('live-chat-updated'));
  } catch (e) {
    console.error('Failed to save conversations to localStorage:', e);
  }
}
