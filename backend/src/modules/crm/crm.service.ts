import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrmContactDto, UpdateCrmContactDto } from './dto/crm-contact.dto';

@Injectable()
export class CrmContactsService {
  constructor(private prisma: PrismaService) {}

  create(tenantId: string, dto: CreateCrmContactDto) {
    return this.prisma.crmContact.create({
      data: { ...dto, tenantId }, // tenantId comes from the JWT, never from dto
    });
  }

  // ALWAYS filter by tenantId — this is the core multi-tenancy security rule
  findAll(tenantId: string) {
    return this.prisma.crmContact.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contact = await this.prisma.crmContact.findUnique({ where: { id } });

    if (!contact) throw new NotFoundException('Contact not found');

    // even though we found it by id, verify it belongs to the caller's tenant
    // this stops Tenant A from reading Tenant B's contact by guessing an ID
    if (contact.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return contact;
  }

  async update(tenantId: string, id: string, dto: UpdateCrmContactDto) {
    await this.findOne(tenantId, id); // reuses the tenant-ownership check above

    return this.prisma.crmContact.update({
      where: { id },
      data: dto,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return this.prisma.crmContact.delete({ where: { id } });
  }
}
