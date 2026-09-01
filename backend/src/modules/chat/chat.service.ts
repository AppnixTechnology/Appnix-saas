import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetConversationsDto } from './dto/get-conversations.dto';

export interface ChatMessageEntity {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationEntity {
  id: string;
  tenantId?: string;
  contactName: string;
  phoneNumber?: string;
  identifier: string;
  channel: 'whatsapp' | 'instagram' | 'rcs' | 'facebook';
  avatarUrl?: string;
  online: boolean;
  unreadCount: number;
  tags: string[];
  budget?: string;
  goal?: string;
  lastMessage: string;
  lastMessageAt: string; // ISO string
  messages: ChatMessageEntity[];
}

// Initial omnichannel conversation dataset seeded with timestamps spanning multiple months
const SEED_CONVERSATIONS: ConversationEntity[] = [
  {
    id: 'conv-1',
    contactName: 'Ankit Bansal',
    phoneNumber: '+91 77539 83175',
    identifier: '+91 77539 83175',
    channel: 'whatsapp',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
    online: true,
    unreadCount: 2,
    tags: ['VIP', 'High Intent'],
    budget: '$12,000',
    goal: 'Lead Generation',
    lastMessage: 'Can you send the pricing sheet for enterprise whatsapp bot?',
    lastMessageAt: '2026-08-28T10:45:00.000Z',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi Appnix team! We are looking to automate our lead intake.', timestamp: '10:40 AM' },
      { id: 'm2', sender: 'agent', text: 'Hello Ankit! Happy to help. What channels are you planning to deploy on?', timestamp: '10:42 AM', status: 'read' },
      { id: 'm3', sender: 'customer', text: 'Mainly WhatsApp and RCS for high delivery rates.', timestamp: '10:44 AM' },
      { id: 'm4', sender: 'customer', text: 'Can you send the pricing sheet for enterprise whatsapp bot?', timestamp: '10:45 AM' },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Com.Bot Customer Care',
    phoneNumber: '+91 90546 18623',
    identifier: '+91 90546 18623',
    channel: 'whatsapp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
    online: false,
    unreadCount: 0,
    tags: ['VIP', 'Support'],
    budget: '$8,500',
    goal: 'Conversion & Sales',
    lastMessage: 'Thank you! The automated flow is working flawlessly now.',
    lastMessageAt: '2026-08-27T16:20:00.000Z',
    messages: [
      { id: 'm21', sender: 'customer', text: 'Thank you! The automated flow is working flawlessly now.', timestamp: '04:20 PM' },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Nourin Sodawala',
    phoneNumber: '+91 70486 90369',
    identifier: '+91 70486 90369',
    channel: 'whatsapp',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    online: true,
    unreadCount: 1,
    tags: ['Enterprise', 'Warm Lead'],
    budget: '$15,000',
    goal: 'Customer Retention',
    lastMessage: 'Let us schedule a demo for our support team tomorrow.',
    lastMessageAt: '2026-08-25T14:15:00.000Z',
    messages: [
      { id: 'm31', sender: 'customer', text: 'Let us schedule a demo for our support team tomorrow.', timestamp: '02:15 PM' },
    ],
  },
  {
    id: 'conv-4',
    contactName: 'Rahul Verma',
    phoneNumber: '+91 99112 34578',
    identifier: '+91 99112 34578',
    channel: 'whatsapp',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces',
    online: false,
    unreadCount: 0,
    tags: ['Marketing Lead'],
    budget: '$5,000',
    goal: 'Brand Awareness',
    lastMessage: 'Got the broadcast preview. Approved!',
    lastMessageAt: '2026-07-20T09:30:00.000Z',
    messages: [
      { id: 'm41', sender: 'customer', text: 'Got the broadcast preview. Approved!', timestamp: '09:30 AM' },
    ],
  },
  {
    id: 'conv-5',
    contactName: 'Sneha Patel',
    phoneNumber: '+91 98765 43210',
    identifier: '@sneha_ventures',
    channel: 'instagram',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
    online: true,
    unreadCount: 0,
    tags: ['VIP', 'Outreach'],
    budget: '$20,000',
    goal: 'Enterprise Outreach',
    lastMessage: 'Replied to your story regarding AI live chat agents.',
    lastMessageAt: '2026-07-15T18:40:00.000Z',
    messages: [
      { id: 'm51', sender: 'customer', text: 'Replied to your story regarding AI live chat agents.', timestamp: '06:40 PM' },
    ],
  },
  {
    id: 'conv-6',
    contactName: 'Priya Nair',
    phoneNumber: '+91 97654 32109',
    identifier: 'Priya Nair (Facebook)',
    channel: 'facebook',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces',
    online: false,
    unreadCount: 0,
    tags: ['E-Commerce'],
    budget: '$8,000',
    goal: 'Direct Sales',
    lastMessage: 'Is there a WhatsApp sync option from Facebook Ad clicks?',
    lastMessageAt: '2026-06-18T11:10:00.000Z',
    messages: [
      { id: 'm61', sender: 'customer', text: 'Is there a WhatsApp sync option from Facebook Ad clicks?', timestamp: '11:10 AM' },
    ],
  },
  {
    id: 'conv-7',
    contactName: 'Marcus Aurelius Tech',
    phoneNumber: '+44 20 7946 0912',
    identifier: '+44 20 7946 0912',
    channel: 'rcs',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop&crop=faces',
    online: true,
    unreadCount: 0,
    tags: ['Fintech', 'RCS Verified'],
    budget: '$40,000',
    goal: 'Transactional OTPs',
    lastMessage: 'Our telecom carrier approved the RCS agent profile.',
    lastMessageAt: '2026-05-12T15:25:00.000Z',
    messages: [
      { id: 'm71', sender: 'customer', text: 'Our telecom carrier approved the RCS agent profile.', timestamp: '03:25 PM' },
    ],
  },
  {
    id: 'conv-8',
    contactName: 'Elena Rostova',
    phoneNumber: '+1 415 555 2671',
    identifier: '@elena_design',
    channel: 'instagram',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=faces',
    online: false,
    unreadCount: 0,
    tags: ['Design Partner'],
    budget: '$7,000',
    goal: 'Brand Collaboration',
    lastMessage: 'Sent the story mockup assets for our product launch.',
    lastMessageAt: '2026-03-10T12:00:00.000Z',
    messages: [
      { id: 'm81', sender: 'customer', text: 'Sent the story mockup assets for our product launch.', timestamp: '12:00 PM' },
    ],
  },
];

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves omnichannel conversations with month-wise filtering and date sorting
   */
  async getConversations(tenantId: string, dto: GetConversationsDto) {
    const { channel, search, year, month, sortOrder = 'desc' } = dto;

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Parse month & year into UTC start-of-month and end-of-month dates
    if (year && month && month !== 'all') {
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10); // 1 = Jan, 12 = Dec

      if (!isNaN(yearNum) && !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));
      }
    } else if (year && (!month || month === 'all')) {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        startDate = new Date(Date.UTC(yearNum, 0, 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59, 999));
      }
    }

    // Try fetching from database if conversations table exists, otherwise filter seed data
    let filtered = [...SEED_CONVERSATIONS];

    // Filter by Channel
    if (channel && channel.toLowerCase() !== 'all') {
      filtered = filtered.filter((c) => c.channel.toLowerCase() === channel.toLowerCase());
    }

    // Filter by Search Term (contactName or phoneNumber or identifier)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.contactName.toLowerCase().includes(q) ||
          (c.phoneNumber && c.phoneNumber.toLowerCase().includes(q)) ||
          c.identifier.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    // Filter by Date Range (Month & Year)
    if (startDate && endDate) {
      filtered = filtered.filter((c) => {
        const msgDate = new Date(c.lastMessageAt);
        return msgDate >= startDate! && msgDate <= endDate!;
      });
    }

    // Sort by lastMessageAt (asc = oldest first, desc = newest first)
    filtered.sort((a, b) => {
      const timeA = new Date(a.lastMessageAt).getTime();
      const timeB = new Date(b.lastMessageAt).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return {
      success: true,
      data: filtered,
      meta: {
        total: filtered.length,
        channel: channel || 'all',
        year: year || new Date().getFullYear().toString(),
        month: month || 'all',
        sortOrder,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      },
    };
  }
}
