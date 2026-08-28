import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsAppTemplatesService } from './whatsapp-templates.service';
import {
  CreateWhatsAppTemplateDto,
  UpdateWhatsAppTemplateDto,
  TemplateQueryDto,
  SimulateReviewDto,
} from './dto/whatsapp-template.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@ApiTags('WhatsApp Templates')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard, TenantGuard)
@Controller('api/whatsapp-templates')
export class WhatsAppTemplatesController {
  constructor(private readonly templatesService: WhatsAppTemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all WhatsApp templates with filtering & pagination' })
  async findAll(@Request() req: any, @Query() query: TemplateQueryDto) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.findAll(tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single WhatsApp template by ID' })
  async findById(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.findById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new WhatsApp template (Draft or direct Meta Submit)' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() dto: CreateWhatsAppTemplateDto) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.create(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update WhatsApp template' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateWhatsAppTemplateDto,
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.update(tenantId, id, dto);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit WhatsApp template to Meta for official review' })
  async submitForApproval(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.submitForApproval(tenantId, id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing WhatsApp template' })
  async duplicate(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.duplicate(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete WhatsApp template' })
  async delete(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.delete(tenantId, id);
  }

  @Post(':id/simulate-review')
  @ApiOperation({ summary: 'Simulate Meta approval or rejection for live testing' })
  async simulateReview(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: SimulateReviewDto,
  ) {
    const tenantId = req.user?.tenantId || 'demo-tenant';
    return this.templatesService.simulateReview(tenantId, id, dto);
  }
}
