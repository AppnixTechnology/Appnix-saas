import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlans() {
    return {
      success: true,
      data: [
        {
          id: 'starter',
          name: 'Starter Tier',
          price: '₹999',
          period: '/month',
          description: 'For small businesses starting with omnichannel messaging.',
          features: [
            'Up to 2,000 monthly messages',
            '2 WhatsApp / Social channels',
            '1 Automation Botflow',
            '2 Team Members',
            'Community Support',
          ],
        },
        {
          id: 'pro',
          name: 'Professional Tier',
          price: '₹2,999',
          period: '/month',
          isCurrent: true,
          description: 'For fast-scaling teams automating campaigns and customer care.',
          features: [
            'Up to 25,000 monthly messages',
            'Unlimited Channels (WhatsApp, IG, FB, RCS)',
            '5 Advanced AI Botflows',
            '10 Team Member Seats',
            'Priority Live Support & SLA',
            'Custom Webhooks & REST API',
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise Custom',
          price: '₹8,999',
          period: '/month',
          description: 'Dedicated high-volume messaging infrastructure and SLA.',
          features: [
            'Unlimited Monthly Messages',
            'Custom AI Voice Agent streaming',
            'Unlimited Automation Botflows',
            'Unlimited Team Seats & SSO',
            'Dedicated Account Manager',
            'Custom SLA & On-premise deployment',
          ],
        },
      ],
    };
  }

  async getSubscription(tenantId: string) {
    let sub = await this.prisma.subscription.findFirst({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!sub) {
      const now = new Date();
      const nextQuarter = new Date();
      nextQuarter.setDate(now.getDate() + 90);

      sub = await this.prisma.subscription.create({
        data: {
          tenantId,
          planId: 'pro',
          planName: 'Professional Tier',
          price: '₹2,999/mo',
          status: 'ACTIVE',
          totalDays: 90,
          remainingDays: 77,
          currentPeriodStart: now,
          currentPeriodEnd: nextQuarter,
          maxMessages: 25000,
          usedMessages: 0,
          maxBots: 5,
          usedBots: 0,
          maxTeamSeats: 10,
          usedTeamSeats: 1,
        },
      });
    }

    const [usedBots, usedTeamSeats, usedMessages] = await Promise.all([
      this.prisma.bot.count({ where: { tenantId } }),
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.message.count({ where: { tenantId } }),
    ]);

    return {
      success: true,
      data: {
        id: sub.id,
        planId: sub.planId,
        planName: sub.planName,
        price: sub.price,
        status: sub.status,
        totalDays: sub.totalDays,
        remainingDays: sub.remainingDays,
        usedDays: Math.max(0, sub.totalDays - sub.remainingDays),
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        maxMessages: sub.maxMessages,
        usedMessages,
        maxBots: sub.maxBots,
        usedBots,
        maxTeamSeats: sub.maxTeamSeats,
        usedTeamSeats,
        nextBillingDate: sub.currentPeriodEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentMethod: 'UPI / NetBanking',
      },
    };
  }

  async getInvoices(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: invoices.map((inv) => ({
        id: inv.invoiceNumber,
        invoiceNumber: inv.invoiceNumber,
        date: inv.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        plan: inv.plan,
        amount: inv.amount,
        status: inv.status,
        downloadUrl: inv.downloadUrl || '#',
      })),
    };
  }

  async upgradePlan(tenantId: string, planId: string) {
    const planMap: Record<string, { name: string; price: string; maxMsgs: number; maxBots: number; maxSeats: number }> = {
      starter: { name: 'Starter Tier', price: '₹999/mo', maxMsgs: 2000, maxBots: 1, maxSeats: 2 },
      pro: { name: 'Professional Tier', price: '₹2,999/mo', maxMsgs: 25000, maxBots: 5, maxSeats: 10 },
      enterprise: { name: 'Enterprise Custom', price: '₹8,999/mo', maxMsgs: 1000000, maxBots: 100, maxSeats: 100 },
    };

    const target = planMap[planId] || planMap.pro;
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(now.getDate() + 30);

    const sub = await this.prisma.subscription.create({
      data: {
        tenantId,
        planId,
        planName: target.name,
        price: target.price,
        status: 'ACTIVE',
        totalDays: 30,
        remainingDays: 30,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        maxMessages: target.maxMsgs,
        usedMessages: 0,
        maxBots: target.maxBots,
        usedBots: 0,
        maxTeamSeats: target.maxSeats,
        usedTeamSeats: 1,
      },
    });

    // Create Invoice
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    await this.prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber,
        plan: `${target.name} (Monthly)`,
        amount: target.price.replace('/mo', '.00'),
        status: 'Paid',
      },
    });

    return {
      success: true,
      data: sub,
      message: `Successfully upgraded workspace to ${target.name}`,
    };
  }

  async cancelSubscription(tenantId: string) {
    await this.prisma.subscription.updateMany({
      where: { tenantId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    return {
      success: true,
      message: 'Subscription has been cancelled.',
    };
  }
}
