import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(tenantId: string) {
    // 1. Gather live counts and records from database
    const [
      totalConversations,
      activeCampaignsCount,
      automationsRunning,
      contactsCount,
      subscription,
      recentCampaigns,
      recentActivity,
      teamMembersCount,
      bots,
      contactsHistory,
    ] = await Promise.all([
      this.prisma.conversation.count({ where: { tenantId } }),
      this.prisma.campaign.count({
        where: {
          tenantId,
          status: { in: ['LAUNCHING', 'RUNNING', 'READY_FOR_TEST'] },
        },
      }),
      this.prisma.workflow.count({
        where: { tenantId, status: true },
      }),
      this.prisma.crmContact.count({ where: { tenantId } }),
      this.prisma.subscription.findFirst({
        where: { tenantId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.findMany({
        where: { tenantId },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.bot.findMany({ where: { tenantId } }),
      this.prisma.crmContact.findMany({
        where: { tenantId },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Calculate total bot interactions from real bot entities
    const totalBotInteractions = bots.reduce(
      (sum, b) => sum + (b.interactionsCount || 0),
      0,
    );

    // Calculate real contact growth interval distribution
    const now = new Date();
    const intervals = [28, 21, 14, 7, 0].map((daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      const count = contactsHistory.filter((c) => c.createdAt <= d).length;
      return {
        date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        contacts: count,
      };
    });

    return {
      success: true,
      data: {
        totalConversations,
        conversationsChange: totalConversations > 0 ? '+100%' : '0%',
        activeCampaigns: activeCampaignsCount,
        campaignsChange: activeCampaignsCount > 0 ? `+${activeCampaignsCount}` : '0',
        botInteractions: totalBotInteractions,
        botInteractionsChange: totalBotInteractions > 0 ? '+100%' : '0%',
        automationsRunning,
        automationsChange: automationsRunning > 0 ? `+${automationsRunning}` : '0',
        contactsCount,
        contactsChartData: intervals,
        recentCampaigns: recentCampaigns.map((c) => ({
          id: c.id,
          name: c.name,
          channel: c.channel,
          status: c.status === 'RUNNING' || c.status === 'LAUNCHING' ? 'Active' : c.status === 'SCHEDULED' ? 'Scheduled' : 'Draft',
          reach: c.audienceCount ? c.audienceCount.toLocaleString() : '0',
        })),
        recentActivity: recentActivity.map((a) => ({
          id: a.id,
          type: a.module?.toLowerCase().includes('chat')
            ? 'message'
            : a.module?.toLowerCase().includes('campaign')
            ? 'campaign'
            : a.module?.toLowerCase().includes('bot')
            ? 'bot'
            : a.module?.toLowerCase().includes('workflow')
            ? 'automation'
            : 'contact',
          title: a.action,
          time: a.createdAt ? a.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          status: a.status === 'Success' ? 'sent' : 'completed',
        })),
        subscription: {
          plan: subscription?.planName || 'Starter Tier',
          totalDays: subscription?.totalDays || 30,
          remainingDays: subscription?.remainingDays || 30,
          usedDays:
            (subscription?.totalDays || 30) -
            (subscription?.remainingDays || 30),
          maxMessages: subscription?.maxMessages || 2000,
          usedMessages: subscription?.usedMessages || 0,
          maxBots: subscription?.maxBots || 1,
          usedBots: bots.length,
          maxTeamSeats: subscription?.maxTeamSeats || 2,
          usedTeamSeats: teamMembersCount || 1,
        },
      },
    };
  }

  async getActivity(tenantId: string) {
    const logs = await this.prisma.activityLog.findMany({
      where: { tenantId },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: logs,
    };
  }
}
