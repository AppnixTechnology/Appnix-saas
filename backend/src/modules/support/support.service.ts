import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTicketDto, TicketPriority } from './dto/create-ticket.dto';
import { UpdateTicketDto, TicketStatus } from './dto/update-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

export interface TicketReplyEntity {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface SupportTicketEntity {
  id: string;
  ticketId: string;
  tenantId: string;
  userId: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  assignedTo?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  replies: TicketReplyEntity[];
}

@Injectable()
export class SupportService {
  // In-memory tenant-isolated store with persistent interface compatibility
  private tickets: SupportTicketEntity[] = [
    {
      id: '1',
      ticketId: 'SUP-10245',
      tenantId: 'default-tenant',
      userId: 'user-1',
      subject: 'WhatsApp Green Badge Official Verification Request',
      category: 'Channel Verification',
      priority: TicketPriority.HIGH,
      status: TicketStatus.IN_PROGRESS,
      description:
        'We have submitted our Meta Business Manager verification documents and need assistance syncing the official Green Checkmark badge to our active WhatsApp number (+91 80627 65557).',
      assignedTo: 'Sarah Jenkins (Tier 2 Specialist)',
      attachments: ['meta_business_cert.pdf'],
      createdAt: new Date(Date.now() - 3600000 * 4),
      updatedAt: new Date(Date.now() - 3600000 * 2),
      replies: [
        {
          id: 'r1',
          senderId: 'user-1',
          senderName: 'Workspace Admin',
          senderRole: 'CUSTOMER',
          message: 'Hi Appnix Support, please check our Meta verification documents.',
          attachments: ['meta_business_cert.pdf'],
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
        {
          id: 'r2',
          senderId: 'agent-1',
          senderName: 'Sarah Jenkins',
          senderRole: 'SUPPORT_AGENT',
          message: 'Documents received and escalated to WhatsApp Cloud API team.',
          attachments: [],
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
      ],
    },
  ];

  create(tenantId: string, userId: string, userName: string, dto: CreateTicketDto) {
    const generatedTicketId = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newTicket: SupportTicketEntity = {
      id: String(Date.now()),
      ticketId: generatedTicketId,
      tenantId,
      userId,
      subject: dto.subject,
      category: dto.category,
      priority: dto.priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      description: dto.description,
      attachments: dto.attachments || [],
      assignedTo: 'Support Routing Engine',
      createdAt: now,
      updatedAt: now,
      replies: [
        {
          id: `r-${Date.now()}`,
          senderId: userId,
          senderName: userName || 'Customer',
          senderRole: 'CUSTOMER',
          message: dto.description,
          attachments: dto.attachments || [],
          createdAt: now,
        },
      ],
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  findAll(tenantId: string) {
    return this.tickets.filter(
      (t) => t.tenantId === tenantId || tenantId === 'default-tenant'
    );
  }

  findOne(tenantId: string, id: string) {
    const ticket = this.tickets.find(
      (t) => t.id === id || t.ticketId === id
    );

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    if (ticket.tenantId !== tenantId && tenantId !== 'default-tenant') {
      throw new ForbiddenException('Access denied to this ticket');
    }

    return ticket;
  }

  reply(
    tenantId: string,
    id: string,
    userId: string,
    userName: string,
    userRole: string,
    dto: ReplyTicketDto
  ) {
    const ticket = this.findOne(tenantId, id);
    const now = new Date();

    const newReply: TicketReplyEntity = {
      id: `r-${Date.now()}`,
      senderId: userId,
      senderName: userName || 'User',
      senderRole: userRole || 'CUSTOMER',
      message: dto.message,
      attachments: dto.attachments || [],
      createdAt: now,
    };

    ticket.replies.push(newReply);
    ticket.updatedAt = now;
    if (ticket.status === TicketStatus.WAITING_FOR_CUSTOMER) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    return ticket;
  }

  updateStatus(tenantId: string, id: string, dto: UpdateTicketDto) {
    const ticket = this.findOne(tenantId, id);

    if (dto.status) ticket.status = dto.status;
    if (dto.priority) ticket.priority = dto.priority;
    if (dto.assignedTo) ticket.assignedTo = dto.assignedTo;
    ticket.updatedAt = new Date();

    return ticket;
  }
}
