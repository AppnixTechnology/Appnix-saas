import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwtTenantId = request.user?.tenantId;
    const headerTenantId = request.headers['x-tenant-id'];

    if (!jwtTenantId) {
      throw new BadRequestException('Authenticated tenant context is required');
    }

    if (headerTenantId && String(headerTenantId) !== String(jwtTenantId)) {
      throw new ForbiddenException('Tenant mismatch');
    }

    request.tenantId = jwtTenantId;
    return true;
  }
}
