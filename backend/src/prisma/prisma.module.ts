import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContextStore } from '../lib/auth/tenant-context.store';

@Global()
@Module({
  providers: [PrismaService, TenantContextStore],
  exports: [PrismaService, TenantContextStore],
})
export class PrismaModule {}
