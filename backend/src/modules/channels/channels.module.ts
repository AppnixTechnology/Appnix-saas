import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { RcsTemplatesController } from './rcs-templates.controller';
import { ChannelsService } from './channels.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelsController, RcsTemplatesController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
