import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SuperFieldsService } from './super-fields.service';
import { CreateSuperFieldDto, UpdateSuperFieldDto } from './dto/super-field.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('SuperFields')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['super-fields', 'crm/super-fields', 'contacts/super-fields'])
export class SuperFieldsController {
  constructor(private readonly superFieldsService: SuperFieldsService) {}

  @Get()
  @ApiOperation({ summary: 'List all custom SuperFields for current tenant' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('dataType') dataType?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.findAll(tenantId, { search, dataType, status });
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get SuperFields summary metrics' })
  async getMetrics(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.getMetrics(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single SuperField by ID' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new SuperField' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateSuperFieldDto) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.create(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing SuperField' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSuperFieldDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.update(tenantId, id, dto);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a SuperField' })
  async duplicate(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.duplicate(tenantId, id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a SuperField' })
  async archive(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.archive(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SuperField' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.superFieldsService.remove(tenantId, id);
  }
}
