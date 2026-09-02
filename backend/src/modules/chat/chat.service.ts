import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetConversationsDto } from './dto/get-conversations.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(tenantId: string, dto: GetConversationsDto) {
    const { channel, search, sortOrder = 'desc' } = dto;

    const conversations = await this.prisma.conversation.findMany({
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
    const { conversationIds, action, targetDepartment } = payload;

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
