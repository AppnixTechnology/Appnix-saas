import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';

export enum TriggerTypeDto {
  INBOUND_MESSAGE = 'INBOUND_MESSAGE',
  WEBHOOK_EVENT = 'WEBHOOK_EVENT',
  SCHEDULED_CRON = 'SCHEDULED_CRON',
  FORM_SUBMISSION = 'FORM_SUBMISSION',
}

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  folderId?: string;

  @IsOptional()
  @IsString()
  folderName?: string;

  @IsOptional()
  @IsEnum(TriggerTypeDto)
  triggerType?: TriggerTypeDto = TriggerTypeDto.INBOUND_MESSAGE;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  nodes?: any = [];

  @IsOptional()
  edges?: any = [];

  @IsOptional()
  @IsBoolean()
  status?: boolean = true;
}
