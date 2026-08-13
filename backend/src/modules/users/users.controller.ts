import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { TenantId } from '@/common/decorators/tenant.decorator';
import { TenantGuard } from '@/common/guards/tenant.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users for tenant' })
  findByTenant(@TenantId() tenantId: string) {
    return this.usersService.findByTenant(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
