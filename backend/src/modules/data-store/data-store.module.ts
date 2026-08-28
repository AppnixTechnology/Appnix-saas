import { Module } from '@nestjs/common';
import { DataStoreController } from './data-store.controller';
import { DataStoreService } from './data-store.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataStoreController],
  providers: [DataStoreService],
  exports: [DataStoreService],
})
export class DataStoreModule {}
