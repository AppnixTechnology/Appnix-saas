import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InviteMemberDto, UpdateMemberRoleDto } from './dto/team.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async getMembers(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        phone: true,
        departmentId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      data: users,
    };
  }

  async inviteMember(tenantId: string, dto: InviteMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const defaultPassword = 'TempPassword@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        name: dto.name,
        role: dto.role || 'MEMBER',
        departmentId: dto.departmentId,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        departmentId: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: user,
      message: `Invitation dispatched to ${dto.email}`,
    };
  }

  async updateMemberRole(tenantId: string, userId: string, dto: UpdateMemberRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });
    if (!user) throw new NotFoundException('Member not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Role updated successfully',
    };
  }

  async removeMember(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });
    if (!user) throw new NotFoundException('Member not found');

    await this.prisma.user.delete({ where: { id: userId } });

    return {
      success: true,
      message: 'Member removed from workspace',
    };
  }
}
