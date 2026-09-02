import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactTagDto, UpdateContactTagDto, AssignTagDto } from './dto/contact-tag.dto';

@Injectable()
export class ContactTagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    let tags = await this.prisma.contactTag.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });

    // If tenant has no custom tags seeded, seed default system tags
    if (tags.length === 0) {
      const defaults = [
        { slug: 'hot-lead', name: 'Hot Lead', color: 'emerald', icon: 'star', description: 'High probability conversion prospect' },
        { slug: 'vip-customer', name: 'VIP Customer', color: 'purple', icon: 'sparkles', description: 'Premium subscription client' },
        { slug: 'churn-risk', name: 'Churn Risk', color: 'red', icon: 'alert-triangle', description: 'Unresponsive or dissatisfied client' },
        { slug: 'demo-booked', name: 'Demo Booked', color: 'blue', icon: 'check-circle', description: 'Scheduled product demonstration' },
        { slug: 'billing-issue', name: 'Billing Issue', color: 'amber', icon: 'zap', description: 'Payment declined or pending invoice' },
      ];

      for (const def of defaults) {
        await this.prisma.contactTag.upsert({
          where: { tenantId_slug: { tenantId, slug: def.slug } },
          create: { ...def, tenantId },
          update: {},
        });
      }

      tags = await this.prisma.contactTag.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' },
      });
    }

    return {
      success: true,
      data: tags,
    };
  }

  async findOne(tenantId: string, id: string) {
    const tag = await this.prisma.contactTag.findFirst({
      where: { id, tenantId },
    });
    if (!tag) throw new NotFoundException('Contact tag not found');
    return { success: true, data: tag };
  }

  async create(tenantId: string, dto: CreateContactTagDto) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await this.prisma.contactTag.findFirst({
      where: { tenantId, slug },
    });
    if (existing) {
      throw new ConflictException(`Contact tag "${dto.name}" already exists`);
    }

    const tag = await this.prisma.contactTag.create({
      data: {
        tenantId,
        slug,
        name: dto.name,
        description: dto.description || '',
        color: dto.color,
        icon: dto.icon,
      },
    });

    return { success: true, data: tag };
  }

  async update(tenantId: string, id: string, dto: UpdateContactTagDto) {
    await this.findOne(tenantId, id);

    const tag = await this.prisma.contactTag.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.color && { color: dto.color }),
        ...(dto.icon && { icon: dto.icon }),
      },
    });

    return { success: true, data: tag };
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.contactTag.delete({ where: { id } });
    return { success: true, message: 'Contact tag deleted successfully' };
  }

  async assignTags(tenantId: string, dto: AssignTagDto) {
    const contact = await this.prisma.crmContact.findFirst({
      where: { id: dto.contactId, tenantId },
    });
    if (!contact) throw new NotFoundException('Contact not found');

    const updated = await this.prisma.crmContact.update({
      where: { id: dto.contactId },
      data: { tags: dto.tagNames },
    });

    return { success: true, data: updated };
  }
}
