import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Department Analytics')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('department/analytics')
export class DepartmentAnalyticsController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get department workload, active chats, SLA & resolution rates' })
  async getAnalytics(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.getDepartmentAnalytics(tenantId);
  }
}
