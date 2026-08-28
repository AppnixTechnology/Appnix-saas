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
} from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { CreateDataStoreDto } from './dto/create-data-store.dto';
import { UpsertRecordDto } from './dto/data-store-record.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('automations/data-stores')
export class DataStoreController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get('summary')
  async getSummaryStats(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getSummaryStats(tenantId);
  }

  @Get()
  async getDataStores(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getDataStores(tenantId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createDataStore(
    @Body() dto: CreateDataStoreDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.createDataStore(tenantId, dto);
  }

  @Get(':id')
  async getDataStoreById(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getDataStoreById(tenantId, id);
  }

  @Delete(':id')
  async deleteDataStore(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.deleteDataStore(tenantId, id);
  }

  @Get(':id/records')
  async getRecords(
    @Param('id') id: string,
    @Query('search') search?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.getRecords(tenantId, id, search);
  }

  @Post(':id/records')
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
  async deleteRecord(
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.deleteRecord(tenantId, id, recordId);
  }

  @Post(':id/clear')
  async clearAllRecords(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.dataStoreService.clearAllRecords(tenantId, id);
  }
}
