import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import {
  UpdateAccountSettingsDto,
  TopUpWalletDto,
  UpdateAutoRechargeDto,
} from './dto/workspace.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['workspace', 'api/workspace'])
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('account-settings')
  @ApiOperation({ summary: 'Get workspace personal details, API keys, webhook URLs, and 2FA status' })
  async getAccountSettings(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    const userId = user?.userId || user?.id || '';
    return this.workspaceService.getAccountSettings(tenantId, userId);
  }

  @Put('account-settings')
  @ApiOperation({ summary: 'Update personal details and workspace settings' })
  async updateAccountSettings(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateAccountSettingsDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    const userId = user?.userId || user?.id || '';
    return this.workspaceService.updateAccountSettings(tenantId, userId, dto);
  }

  @Post('api-keys/regenerate')
  @ApiOperation({ summary: 'Regenerate workspace production API secret key' })
  async regenerateApiKey(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workspaceService.regenerateApiKey(tenantId);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet balance, spend metrics, and transaction history' })
  async getWallet(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workspaceService.getWallet(tenantId);
  }

  @Post('wallet/topup')
  @ApiOperation({ summary: 'Instant recharge wallet balance' })
  async topUpWallet(
    @CurrentUser() user: AuthUser,
    @Body() dto: TopUpWalletDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workspaceService.topUpWallet(tenantId, dto);
  }

  @Put('wallet/auto-recharge')
  @ApiOperation({ summary: 'Update auto-recharge settings and threshold' })
  async updateAutoRecharge(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateAutoRechargeDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workspaceService.updateAutoRecharge(tenantId, dto);
  }
}
