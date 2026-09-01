import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { BillingModule } from './modules/billing/billing.module';
import { CrmContactsModule } from './modules/crm/crm.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { MailModule } from './modules/mail/mail.module';
import { SupportModule } from './modules/support/support.module';
import { WhatsAppTemplatesModule } from './modules/whatsapp-templates/whatsapp-templates.module';
import { ChatModule } from './modules/chat/chat.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { DataStoreModule } from './modules/data-store/data-store.module';
import { AppCredentialsModule } from './modules/app-credentials/app-credentials.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    BillingModule,
    CrmContactsModule,
    CampaignsModule,
    WhatsAppTemplatesModule,
    ChatModule,
    WorkflowsModule,
    DataStoreModule,
    AppCredentialsModule,
    SupportModule,
  ],
})
export class AppModule {}
