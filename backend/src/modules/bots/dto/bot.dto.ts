import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBotDto {
  @ApiProperty({ example: 'Lead Qualification Bot' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'INBOUND_MESSAGE' })
  @IsString()
  @IsOptional()
  triggerType?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  nodes?: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  edges?: any[];
}

export class UpdateBotDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  nodes?: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  edges?: any[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  currentVersion?: number;
}
