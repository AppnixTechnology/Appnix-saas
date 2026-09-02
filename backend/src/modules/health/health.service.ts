import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async checkHealth() {
    let dbStatus = 'disconnected';
    let dbLatencyMs = -1;

    const start = Date.now();
    try {
      await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);
      dbLatencyMs = Date.now() - start;
      dbStatus = 'connected';
    } catch (err: any) {
      this.logger.error(`Database health check failed: ${err.message}`);
      dbStatus = 'error';
    }

    const storageHealth = await this.storageService.checkHealth();
    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0',
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        storage: {
          status: storageHealth.status,
          provider: 'Cloudflare R2',
          bucket: storageHealth.bucket,
        },
        memory: {
          rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
        },
      },
    };
  }
}
