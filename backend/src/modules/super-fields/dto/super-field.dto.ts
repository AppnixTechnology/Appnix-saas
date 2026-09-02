import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSuperFieldDto {
  @ApiProperty({ example: 'city' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'City' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'TEXT' })
  @IsString()
  @IsNotEmpty()
  dataType: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  options?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  defaultValue?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  helperText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currencySymbol?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  validation?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  placement?: any;
}

export class UpdateSuperFieldDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dataType?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  options?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  defaultValue?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  helperText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currencySymbol?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  validation?: any;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  placement?: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
}
