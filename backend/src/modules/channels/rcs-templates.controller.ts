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
import { ChannelsService } from './channels.service';
import { CreateRcsTemplateDto, UpdateRcsTemplateDto } from './dto/channels.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('RCS Templates')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['channels/rcs/templates', 'rcs-templates'])
export class RcsTemplatesController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all RCS templates with carrier approvals' })
  async getTemplates(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getRcsTemplates(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single RCS template by ID' })
  async getTemplateById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.getRcsTemplateById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new RCS template' })
  async createTemplate(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateRcsTemplateDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.createRcsTemplate(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update RCS template' })
  async updateTemplate(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateRcsTemplateDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.updateRcsTemplate(tenantId, id, dto);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit RCS template to telecom carriers for approval' })
  async submitForApproval(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.submitRcsTemplateForApproval(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete RCS template' })
  async deleteTemplate(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.channelsService.deleteRcsTemplate(tenantId, id);
  }
}
