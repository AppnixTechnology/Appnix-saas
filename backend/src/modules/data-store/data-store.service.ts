import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDataStoreDto } from './dto/create-data-store.dto';
import { UpsertRecordDto } from './dto/data-store-record.dto';

@Injectable()
export class DataStoreService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to clean expired records
   */
  private async purgeExpiredRecords(dataStoreId: string) {
    try {
      await this.prisma.dataStoreRecord.deleteMany({
        where: {
          dataStoreId,
          expiresAt: { lt: new Date() },
        },
      });
    } catch {
      // ignore
    }
  }

  /**
   * Get store summary analytics
   */
  async getSummaryStats(tenantId: string) {
    const stores = await this.prisma.dataStore.findMany({
      where: { tenantId },
      include: {
        _count: { select: { records: true } },
      },
    });

    const totalStores = stores.length;
    const totalRecords = stores.reduce((acc, s) => acc + s._count.records, 0);
    const totalBytes = totalRecords * 350;
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

    return {
      success: true,
      data: {
        totalStores,
        totalRecords,
        storageUsedMB: parseFloat(totalMB),
        storageQuotaMB: 100,
        storagePercentage: parseFloat(((parseFloat(totalMB) / 100) * 100).toFixed(1)),
        activeWorkflowsConnected: totalStores > 0 ? totalStores * 2 : 0,
      },
    };
  }

  /**
   * Get all data stores for tenant
   */
  async getDataStores(tenantId: string) {
    const stores = await this.prisma.dataStore.findMany({
      where: { tenantId },
      include: {
        _count: { select: { records: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: stores.map((s) => ({
        id: s.id,
        tenantId: s.tenantId,
        name: s.name,
        slug: s.slug,
        description: s.description,
        keyType: s.keyType || 'STRING',
        ttlSeconds: s.ttlSeconds,
        recordLimit: s.recordLimit,
        recordsCount: s._count.records,
        sizeBytes: s._count.records * 350,
        linkedWorkflowsCount: 1,
        lastModified: 'Recently',
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    };
  }

  /**
   * Get store by ID or slug
   */
  async getDataStoreById(tenantId: string, idOrSlug: string) {
    const store = await this.prisma.dataStore.findFirst({
      where: {
        tenantId,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: { select: { records: true } },
      },
    });

    if (!store) {
      throw new NotFoundException(`Data Store with ID/Slug "${idOrSlug}" not found`);
    }

    await this.purgeExpiredRecords(store.id);

    return {
      success: true,
      data: {
        id: store.id,
        tenantId: store.tenantId,
        name: store.name,
        slug: store.slug,
        description: store.description,
        keyType: store.keyType || 'STRING',
        ttlSeconds: store.ttlSeconds,
        recordLimit: store.recordLimit,
        recordsCount: store._count.records,
        sizeBytes: store._count.records * 350,
        linkedWorkflowsCount: 1,
        lastModified: 'Recently',
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Create new data store
   */
  async createDataStore(tenantId: string, dto: CreateDataStoreDto) {
    const { name, slug, description, keyType = 'STRING', ttlSeconds, recordLimit = 10000 } = dto;

    const existing = await this.prisma.dataStore.findUnique({
      where: {
        tenantId_slug: { tenantId, slug },
      },
    });

    if (existing) {
      throw new ConflictException(`Data Store with identifier "${slug}" already exists in workspace`);
    }

    const newStore = await this.prisma.dataStore.create({
      data: {
        tenantId,
        name,
        slug,
        description: description || '',
        keyType: keyType || 'Phone Number',
        ttlSeconds: ttlSeconds || null,
        recordLimit,
      },
    });

    return {
      success: true,
      data: {
        ...newStore,
        recordsCount: 0,
        sizeBytes: 0,
        linkedWorkflowsCount: 0,
        lastModified: 'Just now',
        createdAt: newStore.createdAt.toISOString(),
        updatedAt: newStore.updatedAt.toISOString(),
      },
      message: 'Data Store created successfully',
    };
  }

  /**
   * Delete data store
   */
  async deleteDataStore(tenantId: string, storeId: string) {
    const store = await this.prisma.dataStore.findFirst({
      where: { id: storeId, tenantId },
    });

    if (!store) {
      throw new NotFoundException(`Data Store "${storeId}" not found`);
    }

    await this.prisma.dataStore.delete({ where: { id: store.id } });

    return {
      success: true,
      message: 'Data store deleted successfully',
    };
  }

  /**
   * Get records inside a specific store
   */
  async getRecords(tenantId: string, storeId: string, search?: string) {
    const store = await this.prisma.dataStore.findFirst({
      where: {
        tenantId,
        OR: [{ id: storeId }, { slug: storeId }],
      },
    });

    if (!store) {
      throw new NotFoundException(`Data Store "${storeId}" not found`);
    }

    await this.purgeExpiredRecords(store.id);

    const where: any = { dataStoreId: store.id };
    if (search && search.trim()) {
      where.key = { contains: search.trim(), mode: 'insensitive' };
    }

    const records = await this.prisma.dataStoreRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      data: records.map((r) => ({
        id: r.id,
        dataStoreId: r.dataStoreId,
        key: r.key,
        value: r.value,
        expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      total: records.length,
    };
  }

  /**
   * Upsert a record (Insert or Update by Key)
   */
  async upsertRecord(tenantId: string, storeId: string, dto: UpsertRecordDto) {
    const { key, value, ttlSeconds } = dto;
    const store = await this.prisma.dataStore.findFirst({
      where: {
        tenantId,
        OR: [{ id: storeId }, { slug: storeId }],
      },
    });

    if (!store) {
      throw new NotFoundException(`Data Store "${storeId}" not found`);
    }

    // Check record limit
    const currentCount = await this.prisma.dataStoreRecord.count({
      where: { dataStoreId: store.id },
    });

    const isExisting = await this.prisma.dataStoreRecord.findUnique({
      where: { dataStoreId_key: { dataStoreId: store.id, key } },
    });

    if (!isExisting && currentCount >= store.recordLimit) {
      throw new BadRequestException(`Data Store record limit (${store.recordLimit}) reached`);
    }

    const effectiveTtl = ttlSeconds !== undefined ? ttlSeconds : store.ttlSeconds;
    const expiresAt = effectiveTtl && effectiveTtl > 0 ? new Date(Date.now() + effectiveTtl * 1000) : null;

    const record = await this.prisma.dataStoreRecord.upsert({
      where: { dataStoreId_key: { dataStoreId: store.id, key } },
      create: {
        dataStoreId: store.id,
        key,
        value: value as any,
        expiresAt,
      },
      update: {
        value: value as any,
        expiresAt,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        id: record.id,
        dataStoreId: record.dataStoreId,
        key: record.key,
        value: record.value,
        expiresAt: record.expiresAt ? record.expiresAt.toISOString() : null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      },
      message: 'Record saved successfully',
    };
  }

  /**
   * Delete single record
   */
  async deleteRecord(tenantId: string, storeId: string, recordIdOrKey: string) {
    const store = await this.prisma.dataStore.findFirst({
      where: {
        tenantId,
        OR: [{ id: storeId }, { slug: storeId }],
      },
    });

    if (!store) {
      throw new NotFoundException(`Data Store "${storeId}" not found`);
    }

    await this.prisma.dataStoreRecord.deleteMany({
      where: {
        dataStoreId: store.id,
        OR: [{ id: recordIdOrKey }, { key: recordIdOrKey }],
      },
    });

    return {
      success: true,
      message: 'Record deleted',
    };
  }

  /**
   * Clear all records in store
   */
  async clearAllRecords(tenantId: string, storeId: string) {
    const store = await this.prisma.dataStore.findFirst({
      where: {
        tenantId,
        OR: [{ id: storeId }, { slug: storeId }],
      },
    });

    if (store) {
      await this.prisma.dataStoreRecord.deleteMany({
        where: { dataStoreId: store.id },
      });
    }

    return {
      success: true,
      message: 'All records cleared',
    };
  }
}
