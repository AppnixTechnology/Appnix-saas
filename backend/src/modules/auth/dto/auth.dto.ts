import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  // signup = create a brand-new tenant + its first admin user
  @ApiProperty({
    description: 'Name of the tenant to create',
    example: 'Acme Inc',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  tenantName: string; // e.g. "Acme Inc"

  @ApiProperty({
    description: 'Admin email for the tenant',
    example: 'admin@acme.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Account password. Minimum 8 characters.',
    example: 'StrongPass123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Display name of the tenant admin',
    example: 'Alice',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email used to sign in',
    example: 'admin@acme.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPass123',
  })
  @IsString()
  password: string;
}