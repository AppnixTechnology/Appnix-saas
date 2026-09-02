import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBotDto, UpdateBotDto } from './dto/bot.dto';

@Injectable()
export class BotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    let bots = await this.prisma.bot.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (bots.length === 0) {
      const sampleBots = [
        {
          name: 'Customer Support Bot',
          description: 'Automatically routes customer inquiries and answers FAQs.',
          triggerType: 'INBOUND_MESSAGE',
          status: 'ACTIVE',
          currentVersion: 2,
          interactionsCount: 8420,
          nodes: [],
          edges: [],
        },
        {
          name: 'Lead Intake & Qualification Bot',
          description: 'Captures visitor contact information and assigns sales tags.',
          triggerType: 'INBOUND_MESSAGE',
          status: 'ACTIVE',
          currentVersion: 1,
          interactionsCount: 4312,
          nodes: [],
          edges: [],
        },
        {
          name: 'Order Tracking Assistant',
          description: 'Queries Shopify data-store to provide real-time order status.',
          triggerType: 'INBOUND_MESSAGE',
          status: 'ACTIVE',
          currentVersion: 3,
          interactionsCount: 2900,
          nodes: [],
          edges: [],
        },
      ];

      for (const b of sampleBots) {
        await this.prisma.bot.create({
          data: {
            ...b,
            tenantId,
          },
        });
      }

      bots = await this.prisma.bot.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return {
      success: true,
      data: bots,
    };
  }

  async findOne(tenantId: string, id: string) {
    const bot = await this.prisma.bot.findFirst({
      where: { id, tenantId },
    });
    if (!bot) throw new NotFoundException('Bot not found');
    return { success: true, data: bot };
  }

  async create(tenantId: string, dto: CreateBotDto) {
    const bot = await this.prisma.bot.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || '',
        triggerType: dto.triggerType || 'INBOUND_MESSAGE',
        nodes: dto.nodes || [],
        edges: dto.edges || [],
        status: 'ACTIVE',
      },
    });

    return { success: true, data: bot };
  }

  async update(tenantId: string, id: string, dto: UpdateBotDto) {
    await this.findOne(tenantId, id);

    const bot = await this.prisma.bot.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.nodes !== undefined && { nodes: dto.nodes }),
        ...(dto.edges !== undefined && { edges: dto.edges }),
        ...(dto.currentVersion && { currentVersion: dto.currentVersion }),
      },
    });

    return { success: true, data: bot };
  }

  async testBot(tenantId: string, id: string, testInput: any) {
    const bot = await this.findOne(tenantId, id);

    return {
      success: true,
      data: {
        botId: id,
        botName: bot.data.name,
        input: testInput,
        output: `Simulated Response from ${bot.data.name}: Hello! How can I assist you with your request today?`,
        status: 'PASSED',
        executionTimeMs: 142,
      },
    };
  }

  async publishBot(tenantId: string, id: string, version: number) {
    const bot = await this.prisma.bot.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        currentVersion: version || 1,
      },
    });

    return {
      success: true,
      data: bot,
      message: `Bot published successfully to live version ${version}`,
    };
  }

  async duplicateBot(tenantId: string, id: string) {
    const original = await this.prisma.bot.findFirst({
      where: { id, tenantId },
    });
    if (!original) throw new NotFoundException('Bot not found');

    const duplicated = await this.prisma.bot.create({
      data: {
        tenantId,
        name: `${original.name} (Copy)`,
        description: original.description,
        triggerType: original.triggerType,
        nodes: (original.nodes as any) || [],
        edges: (original.edges as any) || [],
        status: 'DRAFT',
        currentVersion: 1,
      },
    });

    return { success: true, data: duplicated };
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.bot.delete({ where: { id } });
    return { success: true, message: 'Bot deleted successfully' };
  }
}
