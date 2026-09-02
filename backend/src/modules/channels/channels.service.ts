import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConnectChannelDto, CreateRcsTemplateDto, UpdateRcsTemplateDto } from './dto/channels.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- CHANNELS OVERVIEW & CONNECTION -----------------

  async getAllChannels(tenantId: string) {
    const channelConfigs = await this.prisma.channelConfig.findMany({
      where: { tenantId },
    });

    const getChannelData = (type: 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK' | 'RCS') => {
      const found = channelConfigs.find((c) => c.channel === type);
      const conf = (found?.config as any) || {};

      let status = 'not_configured';
      if (found) {
        status = found.isConnected ? 'connected' : 'disconnected';
      }

      if (type === 'WHATSAPP') {
        return {
          id: 'whatsapp',
          name: 'WhatsApp Cloud API',
          type: 'WHATSAPP',
          status,
          phoneNumber: conf.phoneNumber || (status === 'connected' ? '+91 80627 65557' : 'Not Set'),
          wabaId: conf.wabaId || (status === 'connected' ? '896015703596388' : 'Not Set'),
          qualityRating: status === 'connected' ? 'High (Green)' : 'Not Connected',
          tierLimit: status === 'connected' ? '100,000 conversations / day' : '0',
          webhookUrl: `https://api.appnix.io/api/v1/webhooks/whatsapp`,
        };
      }

      if (type === 'INSTAGRAM') {
        return {
          id: 'instagram',
          name: 'Instagram Direct API',
          type: 'INSTAGRAM',
          status,
          accountHandle: conf.accountHandle || (status === 'connected' ? '@appnix_official' : 'Not Set'),
          pageId: conf.pageId || (status === 'connected' ? '1092837465928' : 'Not Set'),
          verified: status === 'connected',
          webhookUrl: `https://api.appnix.io/api/v1/webhooks/instagram`,
        };
      }

      if (type === 'FACEBOOK') {
        return {
          id: 'facebook',
          name: 'Facebook Messenger',
          type: 'FACEBOOK',
          status,
          pageName: conf.pageName || (status === 'connected' ? 'Appnix Technologies' : 'Not Set'),
          pageId: conf.pageId || (status === 'connected' ? '849201948201' : 'Not Set'),
          connectedSince: found?.connectedAt ? found.connectedAt.toLocaleDateString('en-GB') : null,
          webhookUrl: `https://api.appnix.io/api/v1/webhooks/facebook`,
        };
      }

      // RCS
      return {
        id: 'rcs',
        name: 'Google RCS Business Messaging',
        type: 'RCS',
        status,
        agentName: conf.agentName || (status === 'connected' ? 'Appnix RCS Verified' : 'Not Set'),
        agentId: conf.agentId || (status === 'connected' ? 'agent_appnix_rcs_prod' : 'Not Set'),
        carriers: status === 'connected' ? ['Jio', 'Airtel', 'Vodafone Idea'] : [],
        webhookUrl: `https://api.appnix.io/api/v1/webhooks/rcs`,
      };
    };

    return {
      success: true,
      data: [
        getChannelData('WHATSAPP'),
        getChannelData('INSTAGRAM'),
        getChannelData('FACEBOOK'),
        getChannelData('RCS'),
      ],
    };
  }

  async connectChannel(tenantId: string, dto: ConnectChannelDto) {
    const channelEnum = dto.channel as any;
    const config = await this.prisma.channelConfig.upsert({
      where: {
        tenantId_channel: { tenantId, channel: channelEnum },
      },
      create: {
        tenantId,
        channel: channelEnum,
        isConnected: true,
        config: dto.config || {},
        connectedAt: new Date(),
      },
      update: {
        isConnected: true,
        config: dto.config || {},
        connectedAt: new Date(),
      },
    });

    // Log Activity
    await this.prisma.activityLog.create({
      data: {
        tenantId,
        action: `Connected ${dto.channel} communication channel`,
        module: 'Channels',
        status: 'Success',
      },
    });

    return {
      success: true,
      data: config,
      message: `${dto.channel} connected successfully`,
    };
  }

  async disconnectChannel(tenantId: string, channel: string) {
    const channelEnum = channel as any;
    const config = await this.prisma.channelConfig.update({
      where: {
        tenantId_channel: { tenantId, channel: channelEnum },
      },
      data: {
        isConnected: false,
      },
    });

    // Log Activity
    await this.prisma.activityLog.create({
      data: {
        tenantId,
        action: `Disconnected ${channel} communication channel`,
        module: 'Channels',
        status: 'Warning',
      },
    });

    return {
      success: true,
      data: config,
      message: `${channel} disconnected`,
    };
  }

  // ----------------- CHANNEL BALANCE & TRANSACTIONS -----------------

  async getChannelBalance(tenantId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { tenantId } });
    const currentBalance = wallet?.balance || 0;

    const txns = await this.prisma.channelTransaction.findMany({
      where: { tenantId },
    });

    const totalSpend = txns.filter((t) => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
    const totalUnits = txns.reduce((sum, t) => sum + (t.unitCount || 1), 0);
    const averageCostPerUnit = totalUnits > 0 ? totalSpend / totalUnits : 0.78;
    const creditsAdded = txns.filter((t) => t.type === 'CREDIT' || t.type === 'TOPUP').reduce((sum, t) => sum + t.amount, 0);
    const refundsCount = txns.filter((t) => t.type === 'REFUND').length;

    return {
      success: true,
      data: {
        accountDetails: {
          id: 'waba-primary',
          name: 'Appnix Primary WABA',
          phoneNumber: '+91 80627 65557',
          channelType: 'WhatsApp Cloud API',
          wabaId: '896015703596388',
          status: 'connected',
          qualityScore: 'GREEN',
          currentBalance,
          currency: wallet?.currency || 'INR',
          lastSyncedAt: new Date().toISOString(),
          minThreshold: wallet?.minThreshold || 500,
          autoRechargeEnabled: wallet?.autoRechargeEnabled || false,
        },
        summaryMetrics: {
          totalSpend,
          totalUnits,
          averageCostPerUnit: parseFloat(averageCostPerUnit.toFixed(2)),
          creditsAdded,
          refundsCount,
        },
      },
    };
  }

  async getChannelTransactions(tenantId: string) {
    const txns = await this.prisma.channelTransaction.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: txns,
    };
  }

  async getChannelStatistics(tenantId: string) {
    const messages = await this.prisma.message.findMany({
      where: { tenantId },
      select: { status: true },
    });

    const total = messages.length;
    const delivered = messages.filter((m) => m.status === 'delivered' || m.status === 'read').length;
    const read = messages.filter((m) => m.status === 'read').length;

    const whatsapp = await this.prisma.conversation.count({ where: { tenantId, channel: 'whatsapp' } });
    const rcs = await this.prisma.conversation.count({ where: { tenantId, channel: 'rcs' } });
    const instagram = await this.prisma.conversation.count({ where: { tenantId, channel: 'instagram' } });
    const facebook = await this.prisma.conversation.count({ where: { tenantId, channel: 'facebook' } });
    const sum = whatsapp + rcs + instagram + facebook || 1;

    return {
      success: true,
      data: {
        totalDispatched: total,
        deliveryRate: total > 0 ? `${((delivered / total) * 100).toFixed(1)}%` : '0.0%',
        readRate: total > 0 ? `${((read / total) * 100).toFixed(1)}%` : '0.0%',
        avgLatencyMs: 340,
        channelShare: {
          whatsapp: `${Math.round((whatsapp / sum) * 100)}%`,
          rcs: `${Math.round((rcs / sum) * 100)}%`,
          instagram: `${Math.round((instagram / sum) * 100)}%`,
          facebook: `${Math.round((facebook / sum) * 100)}%`,
        },
      },
    };
  }

  // ----------------- RCS TEMPLATES -----------------

  async getRcsTemplates(tenantId: string) {
    const templates = await this.prisma.rcsTemplate.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: templates,
    };
  }

  async getRcsTemplateById(tenantId: string, id: string) {
    const template = await this.prisma.rcsTemplate.findFirst({
      where: { id, tenantId },
    });
    if (!template) throw new NotFoundException('RCS Template not found');
    return { success: true, data: template };
  }

  async createRcsTemplate(tenantId: string, dto: CreateRcsTemplateDto) {
    const template = await this.prisma.rcsTemplate.create({
      data: {
        tenantId,
        name: dto.name,
        category: dto.category || 'PROMOTIONAL',
        messageType: dto.messageType || 'RICH_CARD',
        textBody: dto.textBody,
        standaloneActions: dto.standaloneActions || [],
        card: dto.card || {},
        cards: dto.cards || [],
        variables: dto.variables || [],
        variableMappings: dto.variableMappings || {},
        status: 'DRAFT',
      },
    });

    return { success: true, data: template };
  }

  async updateRcsTemplate(tenantId: string, id: string, dto: UpdateRcsTemplateDto) {
    await this.getRcsTemplateById(tenantId, id);

    const template = await this.prisma.rcsTemplate.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.category && { category: dto.category }),
        ...(dto.messageType && { messageType: dto.messageType }),
        ...(dto.textBody !== undefined && { textBody: dto.textBody }),
        ...(dto.standaloneActions !== undefined && { standaloneActions: dto.standaloneActions }),
        ...(dto.card !== undefined && { card: dto.card }),
        ...(dto.cards !== undefined && { cards: dto.cards }),
        ...(dto.variables !== undefined && { variables: dto.variables }),
        ...(dto.variableMappings !== undefined && { variableMappings: dto.variableMappings }),
      },
    });

    return { success: true, data: template };
  }

  async submitRcsTemplateForApproval(tenantId: string, id: string) {
    await this.getRcsTemplateById(tenantId, id);

    const updated = await this.prisma.rcsTemplate.update({
      where: { id },
      data: {
        status: 'PENDING',
        submittedAt: new Date(),
        carrierApprovals: [
          { carrier: 'Jio', status: 'PENDING', submittedAt: new Date().toISOString() },
          { carrier: 'Airtel', status: 'PENDING', submittedAt: new Date().toISOString() },
          { carrier: 'Vodafone Idea', status: 'PENDING', submittedAt: new Date().toISOString() },
        ],
      },
    });

    return {
      success: true,
      data: updated,
      message: 'RCS Template submitted for telecom carrier compliance review',
    };
  }

  async deleteRcsTemplate(tenantId: string, id: string) {
    await this.getRcsTemplateById(tenantId, id);
    await this.prisma.rcsTemplate.delete({ where: { id } });
    return { success: true, message: 'RCS Template deleted successfully' };
  }
}
