import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Support')
@ApiBearerAuth()
@Controller('support/tickets')
@UseGuards(JwtAccessGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a new support ticket' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateTicketDto) {
    return this.supportService.create(
      user.tenantId,
      user.userId,
      user.email,
      dto
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all tickets for current tenant/user" })
  findAll(@CurrentUser() user: AuthUser) {
    return this.supportService.findAll(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get support ticket details and conversation thread' })
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.supportService.findOne(user.tenantId, id);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: 'Reply to a support ticket' })
  reply(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ReplyTicketDto
  ) {
    return this.supportService.reply(
      user.tenantId,
      id,
      user.userId,
      user.email,
      user.role,
      dto
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ticket status or priority' })
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto
  ) {
    return this.supportService.updateStatus(user.tenantId, id, dto);
  }
}
