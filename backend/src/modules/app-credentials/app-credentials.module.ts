import { Module } from '@nestjs/common';
import { AppCredentialsController } from './app-credentials.controller';
import { AppCredentialsService } from './app-credentials.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppCredentialsController],
  providers: [AppCredentialsService],
  exports: [AppCredentialsService],
})
export class AppCredentialsModule {}
