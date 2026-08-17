import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneInTenant(id: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id, tenantId },
    });
  }

  // creates the tenant AND the first admin user together, atomically
  async createTenantWithAdmin(
    tenantName: string,
    email: string,
    passwordHash: string,
    name?: string,
  ) {
    const slug = this.generateSlug(tenantName);

    // transaction: if user creation fails, the tenant creation rolls back too
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug },
      });

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: Role.TENANT_ADMIN,
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });
  }

  updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  private generateSlug(name: string): string {
    const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const suffix = Math.random().toString(36).substring(2, 7); // avoid slug collisions
    return `${base}-${suffix}`;
  }
}