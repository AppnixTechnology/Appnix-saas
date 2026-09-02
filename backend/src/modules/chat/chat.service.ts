import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetConversationsDto } from './dto/get-conversations.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(tenantId: string, dto: GetConversationsDto) {
    const { channel, search, sortOrder = 'desc' } = dto;

    let conversations = await this.prisma.conversation.findMany({
      where: {
        tenantId,
        ...(channel && channel.toLowerCase() !== 'all' ? { channel: channel.toLowerCase() } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { identifier: { contains: search, mode: 'insensitive' } },
                { lastMessage: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { lastMessageTime: sortOrder === 'asc' ? 'asc' : 'desc' },
    });

    if (conversations.length === 0) {
      // Seed default conversations for active tenant
      const sample = [
        {
          uid: 'CHT-948210',
          name: 'Ankit Bansal',
          identifier: '+91 77539 83175',
          channel: 'whatsapp',
          department: 'sales',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
          online: true,
          unreadCount: 2,
          lastMessage: 'Can you send the pricing sheet for enterprise whatsapp bot?',
          lastMessageSender: 'customer',
          tags: [
            { id: 't1', name: 'Hot Lead', color: 'emerald', icon: 'star' },
            { id: 't2', name: 'VIP Customer', color: 'purple', icon: 'sparkles' },
          ],
          session: {
            isActive: true,
            lastCustomerMessageAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
            remainingHours: 20,
            remainingMinutes: 15,
            formattedRemaining: '20h 15m remaining',
          },
          remarks: {
            sentiment: 'positive',
            leadStage: 'Proposal',
            notes: 'High intent prospect evaluating 50k monthly broadcast quota.',
            lastUpdated: new Date().toISOString(),
          },
          superFields: {
            customer_tier: 'Enterprise Platinum',
            city: 'Mumbai',
            annual_budget: '₹12,00,000',
          },
          internalNotes: [
            {
              id: 'note-1',
              authorId: 'agent-1',
              authorName: 'Sarah Jenkins',
              content: 'Follow up tomorrow at 2:00 PM with the custom rate proposal.',
              createdAt: new Date().toISOString(),
            },
          ],
          messages: [
            {
              sender: 'customer',
              senderName: 'Ankit Bansal',
              text: 'Hi Appnix team! We are looking to automate our lead intake.',
              status: 'delivered',
            },
            {
              sender: 'agent',
              senderName: 'Sarah Jenkins',
              text: 'Hello Ankit! Happy to help. What channels are you planning to deploy on?',
              status: 'read',
            },
            {
              sender: 'customer',
              senderName: 'Ankit Bansal',
              text: 'Mainly WhatsApp and RCS for high delivery rates.',
              status: 'delivered',
            },
            {
              sender: 'customer',
              senderName: 'Ankit Bansal',
              text: 'Can you send the pricing sheet for enterprise whatsapp bot?',
              status: 'delivered',
            },
          ],
        },
        {
          uid: 'CHT-948211',
          name: 'Com.Bot Customer Care',
          identifier: '+91 90546 18623',
          channel: 'whatsapp',
          department: 'support',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
          online: false,
          unreadCount: 0,
          lastMessage: 'Thank you! The automated flow is working flawlessly now.',
          lastMessageSender: 'customer',
          tags: [{ id: 't3', name: 'Demo Booked', color: 'blue', icon: 'check-circle' }],
          session: {
            isActive: true,
            lastCustomerMessageAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(),
            remainingHours: 18,
            remainingMinutes: 40,
            formattedRemaining: '18h 40m remaining',
          },
          remarks: {
            sentiment: 'positive',
            leadStage: 'Closed Won',
            notes: 'Successfully onboarded to WhatsApp Cloud API.',
            lastUpdated: new Date().toISOString(),
          },
          messages: [
            {
              sender: 'customer',
              senderName: 'Com.Bot Care',
              text: 'Thank you! The automated flow is working flawlessly now.',
              status: 'delivered',
            },
          ],
        },
        {
          uid: 'CHT-948212',
          name: 'Sneha Patel',
          identifier: '@sneha_ventures',
          channel: 'instagram',
          department: 'sales',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
          online: true,
          unreadCount: 0,
          lastMessage: 'Replied to your story regarding AI live chat agents.',
          lastMessageSender: 'customer',
          tags: [{ id: 't1', name: 'Hot Lead', color: 'emerald', icon: 'star' }],
          session: {
            isActive: true,
            lastCustomerMessageAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 22 * 3600000).toISOString(),
            remainingHours: 22,
            remainingMinutes: 0,
            formattedRemaining: '22h remaining',
          },
          remarks: {
            sentiment: 'positive',
            leadStage: 'Demo',
            notes: 'Interested in Instagram automated DM lead qualifying flow.',
            lastUpdated: new Date().toISOString(),
          },
          messages: [
            {
              sender: 'customer',
              senderName: 'Sneha Patel',
              text: 'Replied to your story regarding AI live chat agents.',
              status: 'delivered',
            },
          ],
        },
      ];

      for (const conv of sample) {
        const { messages, ...convData } = conv;
        const createdConv = await this.prisma.conversation.create({
          data: {
            ...convData,
            tenantId,
          },
        });

        for (const msg of messages) {
          await this.prisma.message.create({
            data: {
              conversationId: createdConv.id,
              tenantId,
              sender: msg.sender,
              senderName: msg.senderName,
              text: msg.text,
              status: msg.status,
            },
          });
        }
      }

      conversations = await this.prisma.conversation.findMany({
        where: { tenantId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
        orderBy: { lastMessageTime: 'desc' },
      });
    }

    return {
      success: true,
      data: conversations.map((c) => ({
        id: c.id,
        uid: c.uid,
        contactId: c.contactId || c.id,
        name: c.name,
        contactName: c.name,
        phoneNumber: c.identifier,
        identifier: c.identifier,
        avatarUrl: c.avatarUrl,
        channel: c.channel,
        department: c.department,
        online: c.online,
        unreadCount: c.unreadCount,
        lastMessage: c.lastMessage,
        lastMessageTime: c.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastMessageAt: c.lastMessageTime.toISOString(),
        tags: (c.tags as any) || [],
        session: c.session || { isActive: true, formattedRemaining: '24h remaining' },
        superFields: c.superFields || {},
        internalNotes: c.internalNotes || [],
        remarks: c.remarks || {},
        scheduledMessages: c.scheduledMessages || [],
        messages: c.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          senderName: m.senderName,
          text: m.text,
          timestamp: m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status,
        })),
      })),
      meta: {
        total: conversations.length,
        channel: channel || 'all',
      },
    };
  }

  async getConversationById(tenantId: string, id: string) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        OR: [{ id }, { uid: id }],
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conv) throw new NotFoundException('Conversation not found');

    return {
      success: true,
      data: {
        ...conv,
        contactName: conv.name,
        phoneNumber: conv.identifier,
        messages: conv.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          senderName: m.senderName,
          text: m.text,
          timestamp: m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status,
        })),
      },
    };
  }

  async sendMessage(
    tenantId: string,
    conversationId: string,
    payload: {
      text: string;
      sender?: string;
      senderName?: string;
      isTemplate?: boolean;
      templateName?: string;
      mediaUrl?: string;
    },
  ) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        OR: [{ id: conversationId }, { uid: conversationId }],
      },
    });

    if (!conv) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.message.create({
      data: {
        conversationId: conv.id,
        tenantId,
        sender: payload.sender || 'agent',
        senderName: payload.senderName || 'Agent Support',
        text: payload.text,
        isTemplate: payload.isTemplate || false,
        templateName: payload.templateName,
        mediaUrl: payload.mediaUrl,
        status: 'delivered',
      },
    });

    await this.prisma.conversation.update({
      where: { id: conv.id },
      data: {
        lastMessage: payload.text,
        lastMessageTime: new Date(),
        lastMessageSender: (payload.sender || 'agent') as any,
        unreadCount: 0,
      },
    });

    return {
      success: true,
      data: {
        id: message.id,
        sender: message.sender,
        senderName: message.senderName,
        text: message.text,
        timestamp: message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: message.status,
      },
    };
  }

  async addInternalNote(tenantId: string, conversationId: string, authorName: string, content: string) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        OR: [{ id: conversationId }, { uid: conversationId }],
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const existingNotes = (conv.internalNotes as any[]) || [];
    const newNote = {
      id: `note-${Date.now()}`,
      authorName: authorName || 'Agent',
      content,
      createdAt: new Date().toISOString(),
    };

    const updated = await this.prisma.conversation.update({
      where: { id: conv.id },
      data: { internalNotes: [newNote, ...existingNotes] },
    });

    return { success: true, data: updated.internalNotes };
  }

  async updateRemarks(tenantId: string, conversationId: string, remarks: any) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        OR: [{ id: conversationId }, { uid: conversationId }],
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const updated = await this.prisma.conversation.update({
      where: { id: conv.id },
      data: {
        remarks: {
          ...remarks,
          lastUpdated: new Date().toISOString(),
        },
      },
    });

    return { success: true, data: updated.remarks };
  }

  async updateTags(tenantId: string, conversationId: string, tags: any[]) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        OR: [{ id: conversationId }, { uid: conversationId }],
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const updated = await this.prisma.conversation.update({
      where: { id: conv.id },
      data: { tags },
    });

    return { success: true, data: updated.tags };
  }

  async executeBulkAction(tenantId: string, payload: any) {
    const { conversationIds, action, targetDepartment, targetAgentId, tagToAdd } = payload;

    if (action === 'MARK_READ') {
      await this.prisma.conversation.updateMany({
        where: { id: { in: conversationIds }, tenantId },
        data: { unreadCount: 0 },
      });
    } else if (action === 'MARK_CLOSED') {
      await this.prisma.conversation.updateMany({
        where: { id: { in: conversationIds }, tenantId },
        data: { status: 'closed' },
      });
    } else if (action === 'TRANSFER_DEPT' && targetDepartment) {
      await this.prisma.conversation.updateMany({
        where: { id: { in: conversationIds }, tenantId },
        data: { department: targetDepartment },
      });
    }

    return {
      success: true,
      message: `Bulk action "${action}" executed across ${conversationIds.length} conversations`,
    };
  }
}
