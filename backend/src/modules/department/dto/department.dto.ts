import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Marketing & Growth' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  status?: { label: string; tone: string };

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  tag?: { label: string; icon?: string; tone: string };

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  status?: { label: string; tone: string };

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  tag?: { label: string; tone: string };
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Campaign Specialist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeTone?: string;
}

export class UpdateRolePermissionsDto {
  @ApiProperty({ type: [Object] })
  @IsArray()
  permissions: any[];
}
