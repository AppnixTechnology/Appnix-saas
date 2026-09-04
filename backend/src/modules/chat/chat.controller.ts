import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Live Chat & Inbox')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard, SubscriptionGuard)
@Controller(['chat', 'api/chat', 'inbox'])
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all live chat conversations with channel and search filtering' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getConversations(
    @CurrentUser() user: AuthUser,
    @Query() query: GetConversationsDto,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.getConversations(tenantId, query);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation details and full message history' })
  async getConversationById(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.getConversationById(tenantId, id);
  }

  @Post(['conversations/:id/messages', 'messages', 'send'])
  @ApiOperation({ summary: 'Send message into live chat conversation' })
  async sendMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() payload: any,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    const conversationId = id || payload.conversationId;
    return this.chatService.sendMessage(tenantId, conversationId, {
      text: payload.text || payload.message,
      sender: payload.sender || 'agent',
      senderName: user?.email ? user.email.split('@')[0] : 'Support Agent',
      isTemplate: payload.isTemplate,
      templateName: payload.templateName,
      mediaUrl: payload.mediaUrl,
    });
  }

  @Post('conversations/:id/notes')
  @ApiOperation({ summary: 'Add internal team note to conversation' })
  async addInternalNote(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    const authorName = user?.email ? user.email.split('@')[0] : 'Agent';
    return this.chatService.addInternalNote(tenantId, id, authorName, content);
  }

  @Post('conversations/:id/remarks')
  @ApiOperation({ summary: 'Update customer sentiment and lead stage remarks' })
  async updateRemarks(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() remarks: any,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.updateRemarks(tenantId, id, remarks);
  }

  @Post('conversations/:id/tags')
  @ApiOperation({ summary: 'Update conversation tags' })
  async updateTags(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body('tags') tags: any[],
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.updateTags(tenantId, id, tags);
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Execute bulk conversation actions (transfer, mark read, close)' })
  async executeBulkAction(
    @CurrentUser() user: AuthUser,
    @Body() payload: any,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.executeBulkAction(tenantId, payload);
  }
}
