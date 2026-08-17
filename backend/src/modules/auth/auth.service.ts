import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  tenantId: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(tenantName: string, email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const { user } = await this.usersService.createTenantWithAdmin(
      tenantName,
      email,
      passwordHash,
      name,
    );

    return this.generateTokens(user.id, user.email, user.tenantId, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id, user.email, user.tenantId, user.role);
  }

  async generateTokens(userId: string, email: string, tenantId: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, tenantId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || this.configService.get<string>('JWT_SECRET') || 'default-access-secret',
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET') || 'default-refresh-secret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d',
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException('Access denied');

    return this.generateTokens(user.id, user.email, user.tenantId, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}