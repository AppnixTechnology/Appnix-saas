import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { TenantContextStore } from './tenant-context.store';

export interface SessionContext {
  /** The authenticated human/operator. This never changes during impersonation. */
  userId: string;
  email: string;
  role: Role;
  /** The tenant bound to the login session. */
  workspaceId: string;
  /** The only tenant application queries may use for this request. */
  tenantId: string;
  impersonatedWorkspaceId?: string;
}

interface ImpersonationClaims {
  sub: string;
  role: Role;
  targetWorkspaceId: string;
  purpose: 'super_admin_impersonation';
}

/**
 * Converts an already verified access-token principal into the sole server-side
 * tenant context. Client supplied workspace/tenant values are intentionally not
 * read here. A support tenant can only come from a separately signed short-lived
 * impersonation token.
 */
@Injectable()
export class SessionContextResolver {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly tenantContextStore: TenantContextStore,
  ) {}

  resolve(request: Request): SessionContext {
    const principal = request.user as
      | { userId?: string; email?: string; tenantId?: string; role?: Role }
      | undefined;

    if (!principal?.userId || !principal.tenantId || !principal.role) {
      throw new UnauthorizedException('A verified authenticated session is required');
    }

    const context: SessionContext = {
      userId: principal.userId,
      email: principal.email || '',
      role: principal.role,
      workspaceId: principal.tenantId,
      tenantId: principal.tenantId,
    };

    const impersonationToken = request.header('x-impersonation-token');
    if (!impersonationToken) {
      this.tenantContextStore.enter(context);
      return context;
    }
    if (context.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins may use support impersonation');
    }

    try {
      const claims = this.jwt.verify<ImpersonationClaims>(impersonationToken, {
        secret:
          this.config.get<string>('IMPERSONATION_JWT_SECRET') ||
          this.config.get<string>('JWT_ACCESS_SECRET') ||
          this.config.get<string>('JWT_SECRET'),
      });
      if (
        claims.purpose !== 'super_admin_impersonation' ||
        claims.sub !== context.userId ||
        claims.role !== Role.SUPER_ADMIN ||
        !claims.targetWorkspaceId
      ) {
        throw new Error('Impersonation token claims do not match the active session');
      }
      context.impersonatedWorkspaceId = claims.targetWorkspaceId;
      context.tenantId = claims.targetWorkspaceId;
      this.tenantContextStore.enter(context);
      return context;
    } catch {
      throw new ForbiddenException('Invalid or expired support impersonation context');
    }
  }
}
