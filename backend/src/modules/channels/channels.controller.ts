import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { ConnectChannelDto } from './dto/channels.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['channels', 'api/channels'])
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get status and details of all communication channels' })
  async getAllChannels(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getAllChannels(tenantId);
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
