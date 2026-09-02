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
import { ContactTagsService } from './contact-tags.service';
import { CreateContactTagDto, UpdateContactTagDto, AssignTagDto } from './dto/contact-tag.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('ContactTags')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['contact-tags', 'crm/contact-tags', 'tags'])
export class ContactTagsController {
  constructor(private readonly contactTagsService: ContactTagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact tags for tenant' })
  async findAll(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact tag by ID' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact tag' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateContactTagDto) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.create(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact tag' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateContactTagDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact tag' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.remove(tenantId, id);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign tags to a contact' })
  async assignTags(@CurrentUser() user: AuthUser, @Body() dto: AssignTagDto) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.contactTagsService.assignTags(tenantId, dto);
  }
}
