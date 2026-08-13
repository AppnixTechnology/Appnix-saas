import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { TenantId } from '@/common/decorators/tenant.decorator';
import { TenantGuard } from '@/common/guards/tenant.guard';

@ApiTags('CRM')
@Controller('crm')
@UseGuards(TenantGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('contacts')
  @ApiOperation({ summary: 'Get CRM contacts for tenant' })
  findContacts(@TenantId() tenantId: string) {
    return this.crmService.findContacts(tenantId);
  }

  @Post('contacts')
  @ApiOperation({ summary: 'Create new CRM contact' })
  createContact(@TenantId() tenantId: string, @Body() body: { name: string; phone?: string; email?: string }) {
    return this.crmService.createContact(tenantId, body);
  }
}
