import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { SessionContext } from '../../lib/auth/session-context';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async beginWorkspaceInspection(actor: SessionContext, targetWorkspaceId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: targetWorkspaceId }, select: { id: true },
    });
    if (!tenant) throw new NotFoundException('Workspace not found');

    const token = await this.jwt.signAsync(
      { sub: actor.userId, role: Role.SUPER_ADMIN, targetWorkspaceId, purpose: 'super_admin_impersonation' },
      {
        secret: this.config.get<string>('IMPERSONATION_JWT_SECRET') || this.config.get<string>('JWT_ACCESS_SECRET') || this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('IMPERSONATION_JWT_EXPIRY') || '15m',
      },
    );
    await this.audit(actor.userId, targetWorkspaceId, 'IMPERSONATION_STARTED', 'POST /super-admin/impersonation');
    return { impersonationToken: token, expiresIn: this.config.get<string>('IMPERSONATION_JWT_EXPIRY') || '15m' };
  }

  async audit(superAdminId: string, targetWorkspaceId: string, action: string, endpoint: string) {
    // No update/delete method is exposed: audit rows are append-only at the app layer.
    return this.prisma.$executeRaw`
      INSERT INTO audit_logs (id, "superAdminId", "targetWorkspaceId", action, endpoint, "createdAt")
      VALUES (${randomUUID()}, ${superAdminId}, ${targetWorkspaceId}, ${action}, ${endpoint}, NOW())
    `;
  }
}
