import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UnlockWorkflowDto } from './dto/unlock-workflow.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Automations & Workflows')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['automations/workflows', 'api/automations/workflows', 'automations'])
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new visual workflow' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createWorkflow(
    @Body() dto: CreateWorkflowDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.createWorkflow(tenantId, dto);
  }

  @Post('unlock')
  @ApiOperation({ summary: 'Unlock premium workflow using license key' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async unlockWorkflow(
    @Body() dto: UnlockWorkflowDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.unlockWorkflow(tenantId, dto.licenseKey);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get workspace workflow allowance quota' })
  async getQuota(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getQuota(tenantId);
  }

  @Get('folders')
  @ApiOperation({ summary: 'Get folders' })
  async getFolders(@CurrentUser() user?: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getFolders(tenantId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get pre-built workflow templates' })
  async getTemplates(
    @Query('category') category?: string,
    @Query('channel') channel?: string,
  ) {
    return this.workflowsService.getTemplates(category, channel);
  }

  @Post('templates/:id/clone')
  @ApiOperation({ summary: 'Clone workflow template into active workspace' })
  async cloneTemplate(
    @Param('id') id: string,
    @Body('customTitle') customTitle?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.cloneTemplate(tenantId, id, customTitle);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single workflow canvas nodes & edges' })
  async getWorkflowById(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getWorkflowById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Save/update workflow canvas state' })
  async updateWorkflow(
    @Param('id') id: string,
    @Body() payload: any,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.updateWorkflow(tenantId, id, payload);
  }

  @Post(':id/toggle')
  @ApiOperation({ summary: 'Toggle workflow active state' })
  async toggleWorkflow(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.toggleWorkflow(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  async deleteWorkflow(
    @Param('id') id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.deleteWorkflow(tenantId, id);
  }

  @Get()
  @ApiOperation({ summary: 'List all workflows for workspace' })
  async getWorkflows(
    @Query('folderId') folderId?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.workflowsService.getWorkflows(tenantId, folderId);
  }
}
