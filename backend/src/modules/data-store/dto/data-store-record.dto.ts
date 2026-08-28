import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class UpsertRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Record key is required' })
  key: string;

  @IsNotEmpty({ message: 'Record JSON payload value is required' })
  value: any;

  @IsOptional()
  @IsInt()
  @Min(0)
  ttlSeconds?: number;
}
