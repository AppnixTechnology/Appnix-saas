import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Database connected successfully.');
        break;
      } catch (err: any) {
        retries -= 1;
        this.logger.warn(`Prisma connection attempt failed (${err?.message || err}). Retries remaining: ${retries}`);
        if (retries === 0) {
          this.logger.error('Could not connect to database after multiple attempts.', err);
          throw err;
        }
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
