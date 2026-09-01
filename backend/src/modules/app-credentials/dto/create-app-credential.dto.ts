import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';

export enum AuthType {
  API_KEY = 'API_KEY',
  BEARER_TOKEN = 'BEARER_TOKEN',
  OAUTH2 = 'OAUTH2',
  BASIC_AUTH = 'BASIC_AUTH',
}

export class CreateAppCredentialDto {
  @IsString()
  @IsNotEmpty()
  appName: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsEnum(AuthType)
  authType: AuthType;

  @IsObject()
  @IsNotEmpty()
  credentials: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
