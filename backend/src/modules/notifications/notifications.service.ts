import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, userId?: string) {
    let notifications = await this.prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (notifications.length === 0) {
      const initial = [
        {
          title: 'Meta WhatsApp Verification Synced',
          description: 'Your business phone number (+91 80627 65557) official green badge request is currently being verified.',
          type: 'success',
          link: '/channels/whatsapp',
        },
        {
          title: 'Broadcast Dispatch Complete',
          description: "Campaign 'Spring Outreach 2026' successfully sent 1,240 messages with a 98.4% delivery rate.",
          type: 'info',
          link: '/crm/bulk-campaign',
        },
        {
          title: 'Low Wallet Balance Alert',
          description: 'Your available messaging wallet balance is ₹14,850.50. Auto-recharge is active.',
          type: 'warning',
          link: '/workspace/wallet',
        },
      ];

      for (const item of initial) {
        await this.prisma.notification.create({
          data: {
            ...item,
            tenantId,
            userId,
          },
        });
      }

      notifications = await this.prisma.notification.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return {
      success: true,
      data: notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    };
  }

  async markAsRead(tenantId: string, id: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });
    if (!notif) throw new NotFoundException('Notification not found');

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return { success: true, data: updated };
  }

  async markAllAsRead(tenantId: string) {
    await this.prisma.notification.updateMany({
      where: { tenantId, isRead: false },
      data: { isRead: true },
    });

    return { success: true, message: 'All notifications marked as read' };
  }

  async create(tenantId: string, userId: string | undefined, dto: CreateNotificationDto) {
    const notif = await this.prisma.notification.create({
      data: {
        tenantId,
        userId,
        title: dto.title,
        description: dto.description,
        type: dto.type || 'info',
        link: dto.link,
      },
    });

    return { success: true, data: notif };
  }
}
