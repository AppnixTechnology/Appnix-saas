import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class CreateDataStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Store Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Store identifier slug is required' })
  @Matches(/^[a-z0-9_]{3,50}$/, {
    message: 'Slug must contain only lowercase letters, numbers, and underscores (3-50 chars)',
  })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keyType?: string = 'STRING';

  @IsOptional()
  @IsInt()
  @Min(0)
  ttlSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(500000)
  recordLimit?: number = 10000;
}
