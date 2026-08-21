import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTicketDto {
  @ApiProperty({ example: 'Need assistance with WhatsApp Webhook 504 error' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Technical Support' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ enum: TicketPriority, default: TicketPriority.MEDIUM })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({ example: 'During high volume broadcast we experienced timeout errors.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ type: [String], example: ['error_logs.txt'] })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}
