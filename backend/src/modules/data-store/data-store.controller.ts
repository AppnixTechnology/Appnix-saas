import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DataStoreService } from './data-store.service';
import { CreateDataStoreDto } from './dto/create-data-store.dto';
import { UpsertRecordDto } from './dto/data-store-record.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Data Store')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['automations/data-stores', 'automations/data-store', 'automations/datastore', 'data-stores', 'data-store'])
export class DataStoreController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get data store metrics and table counts' })
  async getSummaryStats(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getSummaryStats(tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all data stores for workspace' })
  async getDataStores(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getDataStores(tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new key-value data store' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createDataStore(
    @Body() dto: CreateDataStoreDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.createDataStore(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single data store metadata' })
  async getDataStoreById(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getDataStoreById(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete data store and its records' })
  async deleteDataStore(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.deleteDataStore(tenantId, id);
  }

  @Get(':id/records')
  @ApiOperation({ summary: 'Query data store records' })
  async getRecords(
    @Param('id') id: string,
    @Query('search') search?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getRecords(tenantId, id, search);
  }

  @Post(':id/records')
  @ApiOperation({ summary: 'Upsert key-value JSON record with optional TTL' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async upsertRecord(
    @Param('id') id: string,
    @Body() dto: UpsertRecordDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.upsertRecord(tenantId, id, dto);
  }

  @Delete(':id/records/:recordId')
  @ApiOperation({ summary: 'Delete individual record from data store' })
  async deleteRecord(
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.deleteRecord(tenantId, id, recordId);
  }

  @Post(':id/clear')
  @ApiOperation({ summary: 'Clear all records in data store' })
  async clearAllRecords(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.clearAllRecords(tenantId, id);
  }
}
