import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountSettingsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  secondaryEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}

export class TopUpWalletDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiPropertyOptional({ example: 'UPI Instant' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class UpdateAutoRechargeDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  autoRechargeEnabled: boolean;

  @ApiPropertyOptional({ example: 500 })
  @IsNumber()
  @IsOptional()
  minThreshold?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @IsOptional()
  autoRechargeAmount?: number;
}
