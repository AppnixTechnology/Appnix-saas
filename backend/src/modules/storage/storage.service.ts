import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

export interface PresignedUploadResult {
  uploadUrl: string;
  objectKey: string;
  bucket: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

export interface PresignedDownloadResult {
  downloadUrl: string;
  expiresInSeconds: number;
}

export interface StorageMetadata {
  size: number;
  contentType?: string;
  eTag?: string;
  lastModified?: Date;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'appnix-saas-media';

    let endpoint = this.configService.get<string>('R2_ENDPOINT');
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    if (!endpoint && accountId) {
      endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    }
    this.endpoint = endpoint || 'https://r2.cloudflarestorage.com';

    if (accessKeyId && secretAccessKey && accessKeyId !== 'your_r2_access_key_id') {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: this.endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isConfigured = true;
      this.logger.log(`Cloudflare R2 Storage initialized for private bucket: ${this.bucketName}`);
    } else {
      this.isConfigured = false;
      this.logger.warn('Cloudflare R2 credentials not configured; StorageService initialized in test/fallback mode');
    }
  }

  getIsConfigured(): boolean {
    return this.isConfigured;
  }

  getBucketName(): string {
    return this.bucketName;
  }

  /**
   * Generates a sanitized, deterministic tenant-scoped unique object key
   * Structure: tenants/{tenantId}/media/{category}/{uuid}-{safeFilename}
   */
  generateObjectKey(tenantId: string, filename: string, category = 'media'): string {
    if (!tenantId || typeof tenantId !== 'string') {
      throw new BadRequestException('Valid tenant ID is required for storage object generation');
    }

    // Sanitize tenantId (only alphanumeric, hyphens, underscores)
    const safeTenantId = tenantId.replace(/[^a-zA-Z0-9-_]/g, '');

    // Sanitize filename: strip path traversal, slashes, and illegal chars
    const baseName = filename.replace(/^.*[\\\/]/, ''); // strip any path separators
    const safeFilename = baseName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '_'); // prevent ..

    const fileUuid = crypto.randomUUID();
    const safeCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');

    return `tenants/${safeTenantId}/media/${safeCategory}/${fileUuid}-${safeFilename}`;
  }

  /**
   * Generates short-lived presigned PUT URL for direct frontend client uploads
   * Frontend receives temporary signed upload URL without exposing internal credentials
   */
  async generatePresignedUploadUrl(params: {
    tenantId: string;
    filename: string;
    mimeType: string;
    sizeBytes?: number;
    category?: string;
    expiresInSeconds?: number;
  }): Promise<PresignedUploadResult> {
    const { tenantId, filename, mimeType, category = 'media', expiresInSeconds = 900 } = params;
    const objectKey = this.generateObjectKey(tenantId, filename, category);

    if (!this.s3Client) {
      // Return simulated signed upload URL for testing environment
      const uploadUrl = `https://${this.bucketName}.r2.cloudflarestorage.com/${objectKey}?mock_signature=${crypto.randomBytes(16).toString('hex')}&expires=${Date.now() + expiresInSeconds * 1000}`;
      return {
        uploadUrl,
        objectKey,
        bucket: this.bucketName,
        expiresInSeconds,
        headers: {
          'Content-Type': mimeType,
        },
      };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ContentType: mimeType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      return {
        uploadUrl,
        objectKey,
        bucket: this.bucketName,
        expiresInSeconds,
        headers: {
          'Content-Type': mimeType,
        },
      };
    } catch (err: any) {
      this.logger.error(`Failed to generate presigned upload URL: ${err.message}`);
      throw new InternalServerErrorException('Failed to initialize secure upload session');
    }
  }

  /**
   * Generates short-lived signed GET URL for downloading private tenant media
   */
  async generatePresignedDownloadUrl(params: {
    objectKey: string;
    expiresInSeconds?: number;
  }): Promise<PresignedDownloadResult> {
    const { objectKey, expiresInSeconds = 900 } = params;

    if (!this.s3Client) {
      const downloadUrl = `https://${this.bucketName}.r2.cloudflarestorage.com/${objectKey}?mock_signature=${crypto.randomBytes(16).toString('hex')}&expires=${Date.now() + expiresInSeconds * 1000}`;
      return { downloadUrl, expiresInSeconds };
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      return { downloadUrl, expiresInSeconds };
    } catch (err: any) {
      this.logger.error(`Failed to generate presigned download URL: ${err.message}`);
      throw new InternalServerErrorException('Failed to generate media download authorization');
    }
  }

  /**
   * Server-side upload to Cloudflare R2
   */
  async uploadObject(params: {
    objectKey: string;
    body: Buffer | Uint8Array | string;
    mimeType: string;
  }): Promise<{ objectKey: string; bucket: string; size: number }> {
    const { objectKey, body, mimeType } = params;
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);

    if (!this.s3Client) {
      this.logger.warn(`Storage running in fallback mode; simulated upload for ${objectKey}`);
      return { objectKey, bucket: this.bucketName, size: buffer.length };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);
      return { objectKey, bucket: this.bucketName, size: buffer.length };
    } catch (err: any) {
      this.logger.error(`Direct R2 upload failed for ${objectKey}: ${err.message}`);
      throw new InternalServerErrorException('Failed to upload file to Cloudflare R2 storage');
    }
  }

  // Alias for backward compatibility
  async upload(params: {
    objectKey: string;
    body: Buffer | Uint8Array | string;
    mimeType: string;
  }) {
    return this.uploadObject(params);
  }

  /**
   * Fetch object stream/body from Cloudflare R2
   */
  async getObject(params: {
    objectKey: string;
  }): Promise<{ body: any; contentType?: string; contentLength?: number } | null> {
    const { objectKey } = params;

    if (!this.s3Client) {
      return {
        body: Buffer.from('mock object content'),
        contentType: 'application/octet-stream',
        contentLength: 19,
      };
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      const response = await this.s3Client.send(command);
      return {
        body: response.Body,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
    } catch (err: any) {
      if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(`Object "${objectKey}" not found in storage bucket`);
      }
      this.logger.error(`Failed to get object ${objectKey}: ${err.message}`);
      throw new InternalServerErrorException('Failed to retrieve object from storage');
    }
  }

  /**
   * Delete object from Cloudflare R2
   */
  async deleteObject(objectKey: string): Promise<boolean> {
    if (!this.s3Client) {
      return true;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      await this.s3Client.send(command);
      return true;
    } catch (err: any) {
      this.logger.warn(`R2 delete warning for key ${objectKey}: ${err.message}`);
      return false;
    }
  }

  // Alias for backward compatibility
  async delete(objectKey: string): Promise<boolean> {
    return this.deleteObject(objectKey);
  }

  /**
   * Inspect object metadata in Cloudflare R2 (HeadObject)
   */
  async headObject(objectKey: string): Promise<HeadObjectCommandOutput | null> {
    if (!this.s3Client) {
      return {
        $metadata: { httpStatusCode: 200 },
        ContentLength: 1024,
        ContentType: 'application/octet-stream',
        LastModified: new Date(),
      } as HeadObjectCommandOutput;
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      return await this.s3Client.send(command);
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return null;
      }
      this.logger.warn(`HeadObject warning for ${objectKey}: ${err.message}`);
      return null;
    }
  }

  /**
   * Check object existence in Cloudflare R2
   */
  async exists(objectKey: string): Promise<boolean> {
    const head = await this.headObject(objectKey);
    return head !== null;
  }

  /**
   * Get object metadata summary from Cloudflare R2
   */
  async getMetadata(objectKey: string): Promise<StorageMetadata | null> {
    const head = await this.headObject(objectKey);
    if (!head) return null;

    return {
      size: head.ContentLength || 0,
      contentType: head.ContentType,
      eTag: head.ETag,
      lastModified: head.LastModified,
    };
  }

  /**
   * Storage health check without exposing credentials
   */
  async checkHealth(): Promise<{ status: 'configured' | 'not_configured' | 'error'; bucket: string; endpoint: string }> {
    if (!this.isConfigured || !this.s3Client) {
      return {
        status: 'not_configured',
        bucket: this.bucketName,
        endpoint: this.endpoint,
      };
    }

    try {
      return {
        status: 'configured',
        bucket: this.bucketName,
        endpoint: this.endpoint,
      };
    } catch {
      return {
        status: 'error',
        bucket: this.bucketName,
        endpoint: this.endpoint,
      };
    }
  }
}
