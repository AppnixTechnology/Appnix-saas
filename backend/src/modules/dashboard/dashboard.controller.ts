import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard, SubscriptionGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get workspace overview dashboard metrics, growth charts, active campaigns & usage' })
  async getStats(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dashboardService.getStats(tenantId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent workspace activity logs stream' })
  async getActivity(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dashboardService.getActivity(tenantId);
  }
}
