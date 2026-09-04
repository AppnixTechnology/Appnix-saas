import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { ConnectChannelDto, MetaEmbeddedSignupDto } from './dto/channels.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard, SubscriptionGuard)
@Controller(['channels', 'api/channels'])
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get status and details of all communication channels' })
  async getAllChannels(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getAllChannels(tenantId);
  }

  @Get('whatsapp/config-public')
  @ApiOperation({ summary: 'Get public Meta App configuration for Embedded Signup SDK popup' })
  getPublicMetaConfig() {
    return this.channelsService.getPublicMetaConfig();
  }

  @Get('whatsapp/status')
  @ApiOperation({ summary: 'Get WhatsApp Cloud API connection status and verified WABA details' })
  async getWhatsAppStatus(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getWhatsAppStatus(tenantId);
  }

  @Post('whatsapp/embedded-signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete Meta Embedded Signup onboarding callback, exchange access token, and verify WABA' })
  @ApiResponse({ status: 200, description: 'WhatsApp Business Account verified and connected successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid Meta onboarding payload or verification failure.' })
  async handleMetaEmbeddedSignup(
    @CurrentUser() user: AuthUser,
    @Body() dto: MetaEmbeddedSignupDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.handleMetaEmbeddedSignup(tenantId, dto);
  }

  @Post('whatsapp/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Re-sync live WhatsApp channel status and limits with Meta Graph API' })
  async syncWhatsAppChannel(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getWhatsAppStatus(tenantId);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect a channel (WhatsApp, Instagram, Facebook, RCS)' })
  async connectChannel(
    @CurrentUser() user: AuthUser,
    @Body() dto: ConnectChannelDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.connectChannel(tenantId, dto);
  }

  @Post('disconnect/:channel')
  @ApiOperation({ summary: 'Disconnect a channel' })
  async disconnectChannel(
    @CurrentUser() user: AuthUser,
    @Param('channel') channel: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.disconnectChannel(tenantId, channel);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get channel balance and summary metrics' })
  async getChannelBalance(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getChannelBalance(tenantId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get channel debit/credit transaction ledger' })
  async getChannelTransactions(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getChannelTransactions(tenantId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get channel delivery statistics and volume breakdown' })
  async getChannelStatistics(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getChannelStatistics(tenantId);
  }
}
