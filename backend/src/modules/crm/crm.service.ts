import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async findContacts(tenantId: string) {
    return this.prisma.crmContact.findMany({ where: { tenantId } });
  }

  async createContact(tenantId: string, data: { name: string; phone?: string; email?: string }) {
    return this.prisma.crmContact.create({
      data: { ...data, tenantId },
    });
  }
}
