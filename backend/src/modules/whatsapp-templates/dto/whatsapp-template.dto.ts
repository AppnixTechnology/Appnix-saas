import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TemplateCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  MARKETING = 'MARKETING',
  UTILITY = 'UTILITY',
}

export enum TemplateContentType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
  CATALOG = 'CATALOG',
  CAROUSEL = 'CAROUSEL',
}

export enum HeaderType {
  NONE = 'NONE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export enum WhatsAppTemplateStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISABLED = 'DISABLED',
}

export enum ButtonType {
  URL = 'URL',
  PHONE_NUMBER = 'PHONE_NUMBER',
  QUICK_REPLY = 'QUICK_REPLY',
  COPY_CODE = 'COPY_CODE',
  CATALOG = 'CATALOG',
}

export class TemplateHeaderDto {
  @ApiProperty({ enum: HeaderType })
  @IsEnum(HeaderType)
  type: HeaderType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaFileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleValue?: string;
}

export class TemplateVariableDto {
  @ApiProperty()
  @IsNotEmpty()
  index: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  sampleValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dataSource?: string;
}

export class TemplateButtonDto {
  @ApiProperty({ enum: ButtonType })
  @IsEnum(ButtonType)
  type: ButtonType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  text: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['STATIC', 'DYNAMIC'])
  urlType?: 'STATIC' | 'DYNAMIC';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payload?: string;
}

export class CarouselCardDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  header?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ type: [TemplateButtonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateButtonDto)
  buttons?: TemplateButtonDto[];

  @ApiPropertyOptional({ type: [TemplateVariableDto] })
  @IsOptional()
  @IsArray()
  variables?: TemplateVariableDto[];
}

export class CatalogConfigDto {
  @ApiProperty()
  @IsString()
  catalogId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  catalogName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodyText?: string;

  @ApiProperty()
  @IsString()
  ctaText: string;
}

export class CreateWhatsAppTemplateDto {
  @ApiProperty({
    example: 'order_confirmation_v1',
    description: 'Unique template name (lowercase, numbers, underscores)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+$/, {
    message: 'Template name must contain only lowercase letters, numbers, and underscores',
  })
  @MaxLength(512)
  name: string;

  @ApiProperty({ enum: TemplateCategory })
  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @ApiProperty({ example: 'en_US' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ enum: TemplateContentType, default: TemplateContentType.TEXT })
  @IsEnum(TemplateContentType)
  contentType: TemplateContentType;

  @ApiPropertyOptional({ type: TemplateHeaderDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateHeaderDto)
  header?: TemplateHeaderDto;

  @ApiProperty({
    example: 'Hello {{1}}, your order {{2}} has been confirmed.',
    description: 'Message body with {{1}}, {{2}} positional variables',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  body: string;

  @ApiPropertyOptional({ type: [TemplateVariableDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateVariableDto)
  variables?: TemplateVariableDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  variableMappings?: Record<string, string>;

  @ApiPropertyOptional({ example: 'Appnix Technologies', maxLength: 60 })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  footer?: string;

  @ApiPropertyOptional({ type: [TemplateButtonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateButtonDto)
  buttons?: TemplateButtonDto[];

  @ApiPropertyOptional({ type: CatalogConfigDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CatalogConfigDto)
  catalog?: CatalogConfigDto;

  @ApiPropertyOptional({ type: [CarouselCardDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarouselCardDto)
  carouselCards?: CarouselCardDto[];

  @ApiPropertyOptional({ enum: WhatsAppTemplateStatus, default: WhatsAppTemplateStatus.DRAFT })
  @IsOptional()
  @IsEnum(WhatsAppTemplateStatus)
  status?: WhatsAppTemplateStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channelId?: string;
}

export class UpdateWhatsAppTemplateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9_]+$/)
  name?: string;

  @ApiPropertyOptional({ enum: TemplateCategory })
  @IsOptional()
  @IsEnum(TemplateCategory)
  category?: TemplateCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: TemplateContentType })
  @IsOptional()
  @IsEnum(TemplateContentType)
  contentType?: TemplateContentType;

  @ApiPropertyOptional({ type: TemplateHeaderDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateHeaderDto)
  header?: TemplateHeaderDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  body?: string;

  @ApiPropertyOptional({ type: [TemplateVariableDto] })
  @IsOptional()
  @IsArray()
  variables?: TemplateVariableDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  variableMappings?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  footer?: string;

  @ApiPropertyOptional({ type: [TemplateButtonDto] })
  @IsOptional()
  @IsArray()
  buttons?: TemplateButtonDto[];

  @ApiPropertyOptional({ type: CatalogConfigDto })
  @IsOptional()
  catalog?: CatalogConfigDto;

  @ApiPropertyOptional({ type: [CarouselCardDto] })
  @IsOptional()
  @IsArray()
  carouselCards?: CarouselCardDto[];

  @ApiPropertyOptional({ enum: WhatsAppTemplateStatus })
  @IsOptional()
  @IsEnum(WhatsAppTemplateStatus)
  status?: WhatsAppTemplateStatus;
}

export class TemplateQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TemplateCategory })
  @IsOptional()
  category?: TemplateCategory | 'ALL';

  @ApiPropertyOptional({ enum: WhatsAppTemplateStatus })
  @IsOptional()
  status?: WhatsAppTemplateStatus | 'ALL';

  @ApiPropertyOptional()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  channelId?: string;

  @ApiPropertyOptional({ enum: ['latest', 'oldest', 'status', 'name'] })
  @IsOptional()
  sortBy?: 'latest' | 'oldest' | 'status' | 'name';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number;
}

export class SimulateReviewDto {
  @ApiProperty({ enum: [WhatsAppTemplateStatus.APPROVED, WhatsAppTemplateStatus.REJECTED] })
  @IsEnum([WhatsAppTemplateStatus.APPROVED, WhatsAppTemplateStatus.REJECTED])
  status: WhatsAppTemplateStatus.APPROVED | WhatsAppTemplateStatus.REJECTED;

  @ApiPropertyOptional({ example: 'Category Mismatch: Contains promotional content but listed as Utility.' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ example: 'INVALID_CATEGORY_OR_POLICY_VIOLATION' })
  @IsOptional()
  @IsString()
  rejectionCode?: string;

  @ApiPropertyOptional({ example: 'Update category to Marketing or remove promotional phrasing.' })
  @IsOptional()
  @IsString()
  recommendation?: string;
}

export class UnlockFlowQuotaDto {
  @ApiProperty({ example: 'FLOW-PRO8-2026-UNLK', description: 'Activation or License Key' })
  @IsString()
  @IsNotEmpty()
  licenseKey: string;
}
