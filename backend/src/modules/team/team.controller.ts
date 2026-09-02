import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { InviteMemberDto, UpdateMemberRoleDto } from './dto/team.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Team')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('members')
  @ApiOperation({ summary: 'Get all workspace team members' })
  async getMembers(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.teamService.getMembers(tenantId);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite a new team member' })
  async inviteMember(
    @CurrentUser() user: AuthUser,
    @Body() dto: InviteMemberDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.teamService.inviteMember(tenantId, dto);
  }

  @Put('members/:id/role')
  @ApiOperation({ summary: 'Update member role (SUPER_ADMIN, TENANT_ADMIN, MEMBER)' })
  async updateMemberRole(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.teamService.updateMemberRole(tenantId, id, dto);
  }

  @Delete('members/:id')
  @ApiOperation({ summary: 'Remove a team member' })
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.teamService.removeMember(tenantId, id);
  }
}
