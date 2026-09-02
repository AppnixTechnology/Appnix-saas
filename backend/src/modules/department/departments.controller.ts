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
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['department/departments', 'departments'])
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments for tenant' })
  async findAll(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.findAllDepartments(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single department by ID' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.findOneDepartment(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new department' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateDepartmentDto) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.createDepartment(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update department' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.updateDepartment(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.departmentService.deleteDepartment(tenantId, id);
  }
}
