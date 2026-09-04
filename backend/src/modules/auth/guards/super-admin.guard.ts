import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Super Admin access is required');
    }
    return true;
  }
}
