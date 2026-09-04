import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { SessionContext } from '../../lib/auth/session-context';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { SuperAdminService } from './super-admin.service';

@ApiTags('Super Admin')
@ApiBearerAuth()
@Controller('super-admin')
@UseGuards(JwtAccessGuard, SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  @Post('impersonation')
  beginWorkspaceInspection(@CurrentUser() actor: AuthUser, @Body('workspaceId') workspaceId: string) {
    return this.service.beginWorkspaceInspection(actor as SessionContext, workspaceId);
  }
}
