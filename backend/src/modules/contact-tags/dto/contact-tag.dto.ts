import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactTagDto {
  @ApiProperty({ example: 'Hot Lead' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'emerald' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 'star' })
  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class UpdateContactTagDto {
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
  color?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;
}

export class AssignTagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}
