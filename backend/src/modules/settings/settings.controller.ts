import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateProfileDto, ChangePasswordDto, Toggle2FaDto } from './dto/settings.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Settings & User Profile')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['settings', 'user'])
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile and preferences' })
  async getProfile(@CurrentUser() user: AuthUser) {
    const userId = user?.userId || user?.id || '';
    return this.settingsService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile and appearance' })
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.updateProfile(userId, tenantId, dto);
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Update user profile avatar' })
  async updateAvatar(
    @CurrentUser() user: AuthUser,
    @Body('avatar') avatar: string,
  ) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.updateProfile(userId, tenantId, { avatar });
  }

  @Post('security/change-password')
  @ApiOperation({ summary: 'Change user account password' })
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.changePassword(userId, tenantId, dto);
  }

  @Post('security/2fa')
  @ApiOperation({ summary: 'Enable or disable Two-Factor Authentication' })
  async toggle2Fa(
    @CurrentUser() user: AuthUser,
    @Body() dto: Toggle2FaDto,
  ) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.toggle2Fa(userId, tenantId, dto);
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get audit and activity logs with search filtering' })
  async getActivityLogs(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.getActivityLogs(tenantId, search);
  }

  @Get('integrations')
  @ApiOperation({ summary: 'Get status of active workspace integrations' })
  async getIntegrations(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.getIntegrations(tenantId);
  }

  @Post('account-data/export')
  @ApiOperation({ summary: 'Export complete account & workspace data' })
  async exportAccountData(@CurrentUser() user: AuthUser) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.exportAccountData(tenantId, userId);
  }

  @Post('account-data/delete')
  @ApiOperation({ summary: 'Request account & data deletion' })
  async requestDataDeletion(@CurrentUser() user: AuthUser) {
    const userId = user?.userId || user?.id || '';
    const tenantId = user?.tenantId || 'tenant_default';
    return this.settingsService.requestDataDeletion(tenantId, userId);
  }
}
