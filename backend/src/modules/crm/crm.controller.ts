import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { CrmContactsService } from './crm.service';
import { CreateCrmContactDto, UpdateCrmContactDto } from './dto/crm-contact.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('crm-contacts')
@UseGuards(JwtAccessGuard, RolesGuard) // applies to every route in this controller
export class CrmContactsController {
  constructor(private crmContactsService: CrmContactsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCrmContactDto) {
    return this.crmContactsService.create(user.tenantId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.crmContactsService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.crmContactsService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCrmContactDto,
  ) {
    return this.crmContactsService.update(user.tenantId, id, dto);
  }

  // only TENANT_ADMIN or SUPER_ADMIN can delete contacts — MEMBERs cannot
  @Delete(':id')
  @Roles(Role.TENANT_ADMIN, Role.SUPER_ADMIN)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.crmContactsService.remove(user.tenantId, id);
  }
}