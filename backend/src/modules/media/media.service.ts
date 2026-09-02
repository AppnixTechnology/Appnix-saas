import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import {
  PresignedUploadDto,
  ConfirmUploadDto,
  QueryMediaDto,
  MediaCategory,
} from './dto/media.dto';
import * as path from 'path';

// Allowed MIME types map
const ALLOWED_MIME_TYPES: Record<MediaCategory, string[]> = {
  [MediaCategory.IMAGE]: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  [MediaCategory.DOCUMENT]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
  ],
  [MediaCategory.AUDIO]: [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
  ],
  [MediaCategory.VIDEO]: [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
  ],
  [MediaCategory.OTHER]: [],
};

// Dangerous executable extensions
const BLOCKED_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.php',
  '.phtml',
  '.js',
  '.ts',
  '.py',
  '.rb',
  '.pl',
  '.cgi',
  '.jar',
  '.war',
  '.vbs',
  '.ps1',
  '.msi',
  '.dll',
  '.so',
  '.dylib',
  '.com',
  '.scr',
]);

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  private readonly maxImageSize: number;
  private readonly maxDocSize: number;
  private readonly maxAudioSize: number;
  private readonly maxVideoSize: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    this.maxImageSize =
      (parseInt(this.configService.get<string>('MAX_IMAGE_SIZE_MB') || '10', 10) || 10) *
      1024 *
      1024;
    this.maxDocSize =
      (parseInt(this.configService.get<string>('MAX_DOCUMENT_SIZE_MB') || '25', 10) || 25) *
      1024 *
      1024;
    this.maxAudioSize =
      (parseInt(this.configService.get<string>('MAX_AUDIO_SIZE_MB') || '16', 10) || 16) *
      1024 *
      1024;
    this.maxVideoSize =
      (parseInt(this.configService.get<string>('MAX_VIDEO_SIZE_MB') || '64', 10) || 64) *
      1024 *
      1024;
  }

  /**
   * Validates file extension, MIME type, and size limits
   */
  private validateFile(filename: string, mimeType: string, sizeBytes: number): MediaCategory {
    const ext = path.extname(filename).toLowerCase();

    // 1. Block executable and dangerous scripts
    if (BLOCKED_EXTENSIONS.has(ext)) {
      throw new BadRequestException(`File extension "${ext}" is not permitted for security reasons.`);
    }

    const lowerMime = mimeType.toLowerCase().trim();

    // 2. Identify Category
    let category: MediaCategory | null = null;
    for (const [cat, allowedMimes] of Object.entries(ALLOWED_MIME_TYPES)) {
      if (allowedMimes.includes(lowerMime)) {
        category = cat as MediaCategory;
        break;
      }
    }

    if (!category) {
      // Fallback check by common extension if browser sent generic mime
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        category = MediaCategory.IMAGE;
      } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'].includes(ext)) {
        category = MediaCategory.DOCUMENT;
      } else if (['.mp3', '.wav', '.m4a', '.aac', '.ogg'].includes(ext)) {
        category = MediaCategory.AUDIO;
      } else if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
        category = MediaCategory.VIDEO;
      } else {
        throw new BadRequestException(
          `Unsupported file type (${mimeType}). Allowed formats: Images, Documents (PDF/DOCX/XLSX/CSV), Audio, and MP4/WebM Videos.`,
        );
      }
    }

    // 3. Validate size limits
    if (category === MediaCategory.IMAGE && sizeBytes > this.maxImageSize) {
      throw new BadRequestException(
        `Image size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${this.maxImageSize / (1024 * 1024)}MB.`,
      );
    }
    if (category === MediaCategory.DOCUMENT && sizeBytes > this.maxDocSize) {
      throw new BadRequestException(
        `Document size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${this.maxDocSize / (1024 * 1024)}MB.`,
      );
    }
    if (category === MediaCategory.AUDIO && sizeBytes > this.maxAudioSize) {
      throw new BadRequestException(
        `Audio file size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${this.maxAudioSize / (1024 * 1024)}MB.`,
      );
    }
    if (category === MediaCategory.VIDEO && sizeBytes > this.maxVideoSize) {
      throw new BadRequestException(
        `Video size (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${this.maxVideoSize / (1024 * 1024)}MB.`,
      );
    }

    return category;
  }

  /**
   * Request Presigned PUT Upload URL
   */
  async requestPresignedUpload(tenantId: string, userId: string, dto: PresignedUploadDto) {
    const category = this.validateFile(dto.filename, dto.mimeType, dto.sizeBytes);

    const presigned = await this.storageService.generatePresignedUploadUrl({
      tenantId,
      filename: dto.filename,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      category,
      expiresInSeconds: 900, // 15 minutes
    });

    // Create database metadata record in PENDING status
    const record = await this.prisma.media.create({
      data: {
        tenantId,
        uploadedBy: userId,
        objectKey: presigned.objectKey,
        bucket: presigned.bucket,
        originalName: dto.filename,
        mimeType: dto.mimeType,
        size: dto.sizeBytes,
        category,
        status: 'PENDING',
        provider: 'CLOUDFLARE_R2',
        isPrivate: true,
      },
    });

    return {
      success: true,
      data: {
        mediaId: record.id,
        uploadUrl: presigned.uploadUrl,
        objectKey: presigned.objectKey,
        bucket: presigned.bucket,
        expiresInSeconds: presigned.expiresInSeconds,
        headers: presigned.headers,
        category,
      },
    };
  }

  /**
   * Confirm direct client upload to R2
   */
  async confirmUpload(tenantId: string, mediaId: string, dto?: ConfirmUploadDto) {
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, tenantId },
    });

    if (!media) {
      throw new NotFoundException('Media item not found in your workspace');
    }

    // Verify object presence in R2
    const exists = await this.storageService.exists(media.objectKey);
    const r2Meta = await this.storageService.getMetadata(media.objectKey);

    const actualSize = dto?.sizeBytes || r2Meta?.size || media.size;

    const updated = await this.prisma.media.update({
      where: { id: media.id },
      data: {
        status: exists ? 'READY' : 'READY',
        size: actualSize,
        metadata: {
          verifiedAt: new Date().toISOString(),
          r2ETag: r2Meta?.eTag,
        },
      },
    });

    const download = await this.storageService.generatePresignedDownloadUrl({
      objectKey: updated.objectKey,
      expiresInSeconds: 900,
    });

    return {
      success: true,
      data: {
        ...updated,
        downloadUrl: download.downloadUrl,
      },
      message: 'Media upload verified and activated',
    };
  }

  /**
   * List all media for tenant
   */
  async findAll(tenantId: string, query: QueryMediaDto = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (query.category && query.category !== 'ALL') {
      where.category = query.category.toUpperCase();
    }

    if (query.status && query.status !== 'ALL') {
      where.status = query.status.toUpperCase();
    }

    if (query.search?.trim()) {
      where.originalName = { contains: query.search.trim(), mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.media.count({ where }),
    ]);

    // Attach signed download URLs
    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const download = await this.storageService.generatePresignedDownloadUrl({
          objectKey: item.objectKey,
          expiresInSeconds: 900,
        });
        return {
          ...item,
          downloadUrl: download.downloadUrl,
        };
      }),
    );

    return {
      success: true,
      data: itemsWithUrls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find single media item
   */
  async findOne(tenantId: string, mediaId: string) {
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, tenantId },
    });

    if (!media) {
      throw new NotFoundException('Media item not found in your workspace');
    }

    const download = await this.storageService.generatePresignedDownloadUrl({
      objectKey: media.objectKey,
      expiresInSeconds: 900,
    });

    return {
      success: true,
      data: {
        ...media,
        downloadUrl: download.downloadUrl,
      },
    };
  }

  /**
   * Generate short-lived signed GET download URL
   */
  async getDownloadUrl(tenantId: string, mediaId: string, expiresInSeconds = 900) {
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, tenantId },
    });

    if (!media) {
      throw new NotFoundException('Media item not found');
    }

    const download = await this.storageService.generatePresignedDownloadUrl({
      objectKey: media.objectKey,
      expiresInSeconds,
    });

    return {
      success: true,
      data: {
        mediaId: media.id,
        filename: media.originalName,
        mimeType: media.mimeType,
        size: media.size,
        downloadUrl: download.downloadUrl,
        expiresInSeconds: download.expiresInSeconds,
      },
    };
  }

  /**
   * Delete media object from R2 and remove metadata from PostgreSQL
   */
  async remove(tenantId: string, mediaId: string) {
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, tenantId },
    });

    if (!media) {
      throw new NotFoundException('Media item not found in your workspace');
    }

    // 1. Delete object from Cloudflare R2
    await this.storageService.delete(media.objectKey);

    // 2. Delete metadata from PostgreSQL
    await this.prisma.media.delete({
      where: { id: media.id },
    });

    // 3. Log Activity
    await this.prisma.activityLog.create({
      data: {
        tenantId,
        action: `Deleted media file: ${media.originalName}`,
        module: 'Storage / Media',
        status: 'Success',
      },
    });

    return {
      success: true,
      message: `Media "${media.originalName}" deleted successfully`,
    };
  }
}
