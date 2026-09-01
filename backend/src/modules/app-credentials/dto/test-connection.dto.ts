import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional } from 'class-validator';
import { AuthType } from './create-app-credential.dto';

export class ValidateLiveCredentialDto {
  @IsString()
  @IsNotEmpty()
  appName: string;

  @IsEnum(AuthType)
  authType: AuthType;

  @IsObject()
  @IsNotEmpty()
  credentials: Record<string, any>;

  @IsOptional()
  @IsString()
  accountName?: string;
}
