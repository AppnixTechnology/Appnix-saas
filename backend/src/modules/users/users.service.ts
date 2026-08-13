import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.user.findMany({ where: { tenantId } });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
