import { IsString, IsOptional, IsEnum, IsObject, IsBoolean } from 'class-validator';
import { AuthType } from './create-app-credential.dto';

export class UpdateAppCredentialDto {
  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsEnum(AuthType)
  authType?: AuthType;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
