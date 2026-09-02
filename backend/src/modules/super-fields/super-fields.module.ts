import { Module } from '@nestjs/common';
import { SuperFieldsController } from './super-fields.controller';
import { SuperFieldsService } from './super-fields.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuperFieldsController],
  providers: [SuperFieldsService],
  exports: [SuperFieldsService],
})
export class SuperFieldsModule {}
