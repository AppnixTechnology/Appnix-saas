import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(JwtAccessGuard, SuperAdminGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tenant' })
  create(@Body() body: { name: string; slug: string }) {
    return this.tenantsService.create(body);
  }
}
