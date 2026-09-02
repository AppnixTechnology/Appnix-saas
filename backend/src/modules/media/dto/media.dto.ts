import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MediaCategory {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER',
}

export class PresignedUploadDto {
  @ApiProperty({ description: 'Original filename', example: 'product_catalog.pdf' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'MIME type of the file', example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes', example: 1048576 })
  @IsNumber()
  @Min(1)
  sizeBytes: number;

  @ApiPropertyOptional({ enum: MediaCategory, description: 'Media category' })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;
}

export class ConfirmUploadDto {
  @ApiPropertyOptional({ description: 'Verified size in bytes if different from initial request' })
  @IsOptional()
  @IsNumber()
  sizeBytes?: number;
}

export class QueryMediaDto {
  @ApiPropertyOptional({ description: 'Filter by category (IMAGE, DOCUMENT, AUDIO, VIDEO)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by status (READY, PENDING)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search by filename' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number;
}
