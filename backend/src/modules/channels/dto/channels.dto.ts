import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConnectChannelDto {
  @ApiProperty({ example: 'WHATSAPP' })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  config?: any;
}

export class CreateRcsTemplateDto {
  @ApiProperty({ example: 'Summer Offer RCS' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'PROMOTIONAL' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'RICH_CARD' })
  @IsString()
  @IsOptional()
  messageType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  textBody?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  standaloneActions?: any[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  card?: any;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  cards?: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  variables?: any[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  variableMappings?: any;
}

export class UpdateRcsTemplateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  messageType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  textBody?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  standaloneActions?: any[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  card?: any;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  cards?: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  variables?: any[];

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  variableMappings?: any;
}
