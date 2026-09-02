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
import { DepartmentService } from './department.service';
import { CreateRoleDto, UpdateRolePermissionsDto } from './dto/department.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['department/roles', 'roles'])
export class RolesController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all defined roles and permission matrix' })
  async findAll(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.findAllRoles(tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new custom role' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateRoleDto) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.createRole(tenantId, dto);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update module permission matrix for specific role' })
  async updatePermissions(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.updateRolePermissions(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete custom role' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.deleteRole(tenantId, id);
  }
}
