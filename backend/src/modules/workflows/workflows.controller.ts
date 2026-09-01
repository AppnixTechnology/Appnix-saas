import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UnlockWorkflowDto } from './dto/unlock-workflow.dto';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('automations/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createWorkflow(
    @Body() dto: CreateWorkflowDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.createWorkflow(tenantId, dto);
  }

  @Post('unlock')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async unlockWorkflow(
    @Body() dto: UnlockWorkflowDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.unlockWorkflow(tenantId, dto.licenseKey);
  }

  @Get('quota')
  async getQuota(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getQuota(tenantId);
  }

  @Get()
  async getWorkflows(
    @Query('folderId') folderId?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getWorkflows(tenantId, folderId);
  }

  @Get('folders')
  async getFolders(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getFolders(tenantId);
  }

  @Get('templates')
  async getTemplates(
    @Query('category') category?: string,
    @Query('channel') channel?: string,
  ) {
    return this.workflowsService.getTemplates(category, channel);
  }

  @Post('templates/:id/clone')
  async cloneTemplate(
    @Param('id') id: string,
    @Body('customTitle') customTitle?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.cloneTemplate(tenantId, id, customTitle);
  }
}
