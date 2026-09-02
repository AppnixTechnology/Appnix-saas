import { Module } from '@nestjs/common';
import { ContactTagsController } from './contact-tags.controller';
import { ContactTagsService } from './contact-tags.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContactTagsController],
  providers: [ContactTagsService],
  exports: [ContactTagsService],
})
export class ContactTagsModule {}
