import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getConversations(
    @Query() query: GetConversationsDto,
    @CurrentUser() user?: AuthUser,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.chatService.getConversations(tenantId, query);
  }
}
