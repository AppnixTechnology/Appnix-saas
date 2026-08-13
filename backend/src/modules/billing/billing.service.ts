import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({ where: { tenantId } });
  }
}
