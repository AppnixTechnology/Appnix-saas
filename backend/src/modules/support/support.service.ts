import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, TicketPriority } from './dto/create-ticket.dto';
import { UpdateTicketDto, TicketStatus } from './dto/update-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, userName: string, dto: CreateTicketDto) {
    const generatedTicketId = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialReplies = [
      {
        id: `r-${Date.now()}`,
        senderId: userId,
        senderName: userName || 'Customer',
        senderRole: 'CUSTOMER',
        message: dto.description,
        attachments: dto.attachments || [],
        createdAt: new Date().toISOString(),
      },
    ];

    const ticket = await this.prisma.supportTicket.create({
      data: {
        tenantId,
        ticketNumber: generatedTicketId,
        subject: dto.subject,
        category: dto.category || 'Technical Support',
        priority: dto.priority || 'Medium',
        status: 'Open',
        description: dto.description,
        assignedAgent: { name: 'Support Routing Engine', email: 'support@appnix.io' },
        attachments: dto.attachments || [],
        replies: initialReplies as any,
      },
    });

    return {
      id: ticket.id,
      ticketId: ticket.ticketNumber,
      tenantId: ticket.tenantId,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      attachments: ticket.attachments,
      replies: ticket.replies,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async findAll(tenantId: string) {
    const tickets = await this.prisma.supportTicket.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return tickets.map((t) => ({
      id: t.id,
      ticketId: t.ticketNumber,
      tenantId: t.tenantId,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      description: t.description,
      attachments: t.attachments,
      replies: t.replies,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async findOne(tenantId: string, id: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: {
        tenantId,
        OR: [{ id }, { ticketNumber: id }],
      },
    });

    if (!ticket) throw new NotFoundException('Support Ticket not found');

    return {
      id: ticket.id,
      ticketId: ticket.ticketNumber,
      tenantId: ticket.tenantId,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      attachments: ticket.attachments,
      replies: ticket.replies,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async reply(
    tenantId: string,
    id: string,
    userId: string,
    userName: string,
    role: string,
    dto: ReplyTicketDto,
  ) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: {
        tenantId,
        OR: [{ id }, { ticketNumber: id }],
      },
    });

    if (!ticket) throw new NotFoundException('Support Ticket not found');

    const existingReplies = (Array.isArray(ticket.replies) ? ticket.replies : []) as any[];

    const newReply = {
      id: `r-${Date.now()}`,
      senderId: userId,
      senderName: userName || 'Support Team',
      senderRole: role === 'TENANT_ADMIN' || role === 'SUPER_ADMIN' ? 'SUPPORT_AGENT' : 'CUSTOMER',
      message: dto.message,
      attachments: dto.attachments || [],
      createdAt: new Date().toISOString(),
    };

    const updated = await this.prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        replies: [...existingReplies, newReply] as any,
        status: role === 'TENANT_ADMIN' || role === 'SUPER_ADMIN' ? 'Waiting for Customer' : 'In Progress',
        updatedAt: new Date(),
      },
    });

    return {
      id: updated.id,
      ticketId: updated.ticketNumber,
      replies: updated.replies,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: {
        tenantId,
        OR: [{ id }, { ticketNumber: id }],
      },
    });

    if (!ticket) throw new NotFoundException('Support Ticket not found');

    const updated = await this.prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
      },
    });

    return {
      id: updated.id,
      ticketId: updated.ticketNumber,
      status: updated.status,
      priority: updated.priority,
    };
  }
}
