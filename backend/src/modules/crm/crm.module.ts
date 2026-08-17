import { Module } from '@nestjs/common';
import { CrmContactsService } from './crm.service';
import { CrmContactsController } from './crm.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CrmContactsService],
  controllers: [CrmContactsController],
})
export class CrmContactsModule {}
