import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppCredentialsService } from './app-credentials.service';
import { CreateAppCredentialDto } from './dto/create-app-credential.dto';
import { UpdateAppCredentialDto } from './dto/update-app-credential.dto';
import { ValidateLiveCredentialDto } from './dto/test-connection.dto';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('automations/app-credentials')
export class AppCredentialsController {
  constructor(private readonly appCredentialsService: AppCredentialsService) {}

  @Get('catalog')
  getAvailableApps() {
    return this.appCredentialsService.getAvailableApps();
  }

  @Get('summary')
  async getSummary(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.getSummary(tenantId);
  }

  @Get()
  async getCredentials(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.getCredentials(tenantId, { search, category, status });
  }

  @Post('validate-live')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async validateLive(@Body() dto: ValidateLiveCredentialDto) {
    return this.appCredentialsService.validateLive(dto);
  }

  @Get(':id')
  async getCredentialById(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.getCredentialById(tenantId, id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createCredential(
    @Body() dto: CreateAppCredentialDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.createCredential(tenantId, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateCredential(
    @Param('id') id: string,
    @Body() dto: UpdateAppCredentialDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.updateCredential(tenantId, id, dto);
  }

  @Delete(':id')
  async deleteCredential(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.deleteCredential(tenantId, id);
  }

  @Post(':id/test')
  async testConnection(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.appCredentialsService.testConnection(tenantId, id);
  }
}
