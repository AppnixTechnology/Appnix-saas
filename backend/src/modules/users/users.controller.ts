import { Controller, Get, Param, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { TenantId } from '@/common/decorators/tenant.decorator';
import { TenantGuard } from '@/common/guards/tenant.guard';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAccessGuard, TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users for tenant' })
  findByTenant(@TenantId() tenantId: string) {
    return this.usersService.findByTenant(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const record = await this.usersService.findOneInTenant(id, user.tenantId);
    if (!record) {
      throw new NotFoundException('User not found in your tenant');
    }

    if (record.tenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return record;
  }
}
