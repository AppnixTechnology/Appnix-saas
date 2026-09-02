import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'New Message' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'You have a new unread conversation in WhatsApp channel' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'info' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: '/crm/live-chat' })
  @IsString()
  @IsOptional()
  link?: string;
}
