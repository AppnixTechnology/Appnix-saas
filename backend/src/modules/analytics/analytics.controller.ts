import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overview analytics for channels and messaging' })
  async getOverview(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.analyticsService.getOverview(tenantId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get conversation volume trends and sentiment breakdown' })
  async getConversations(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.analyticsService.getConversations(tenantId);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get campaign reach, read rate, and delivery analytics' })
  async getCampaigns(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.analyticsService.getCampaigns(tenantId);
  }

  @Get('bots')
  @ApiOperation({ summary: 'Get bot interaction stats and handoff metrics' })
  async getBots(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.analyticsService.getBots(tenantId);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get financial and ROI metrics' })
  async getRevenue(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.analyticsService.getRevenue(tenantId);
  }
}
