import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateRoleDto,
  UpdateRolePermissionsDto,
} from './dto/department.dto';

const defaultPermissionsTemplate = [
  { module: 'Dashboard & Analytics', view: true, create: false, edit: false, delete: false, admin: false },
  { module: 'Channels & Integrations', view: true, create: false, edit: false, delete: false, admin: false },
  { module: 'CRM & Contacts', view: true, create: true, edit: true, delete: false, admin: false },
  { module: 'Bulk Campaigns', view: true, create: true, edit: true, delete: false, admin: false },
  { module: 'Live Chat & Inbox', view: true, create: true, edit: true, delete: false, admin: false },
  { module: 'Chatbots & Automations', view: false, create: false, edit: false, delete: false, admin: false },
  { module: 'Department Management', view: false, create: false, edit: false, delete: false, admin: false },
  { module: 'Workspace & Security', view: false, create: false, edit: false, delete: false, admin: false },
];

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- DEPARTMENTS -----------------

  async findAllDepartments(tenantId: string) {
    let departments = await this.prisma.department.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });

    if (departments.length === 0) {
      const initial = [
        {
          name: 'Operations',
          status: { label: 'Active', tone: 'green' },
          tag: { label: 'System Help', tone: 'green' },
          description: 'To manage the overall operations of the company. Responsible for supply chain, logistics, and facility management.',
          icon: 'Building2',
          avatars: ['https://i.pravatar.cc/56?img=12', 'https://i.pravatar.cc/56?img=33'],
          extraCount: 12,
        },
        {
          name: 'Sales',
          status: { label: 'High Growth', tone: 'blue' },
          tag: { label: 'Inquiry Pending', tone: 'pink' },
          description: 'Focused on revenue generation and client acquisition. Currently viewing the quarterly sales performance reports.',
          icon: 'TrendingUp',
          avatars: ['https://i.pravatar.cc/56?img=5', 'https://i.pravatar.cc/56?img=48', 'https://i.pravatar.cc/56?img=25'],
          extraCount: 45,
        },
        {
          name: 'Support',
          status: { label: 'Standard', tone: 'blue' },
          tag: { label: 'Issue Tracking', tone: 'red' },
          description: 'This department handles all customer queries related to product usage and technical issue resolution via live chat.',
          icon: 'Headphones',
          avatars: ['https://i.pravatar.cc/56?img=44'],
          extraCount: 28,
        },
        {
          name: 'IT & Development',
          status: { label: 'Stable', tone: 'green' },
          tag: { label: 'Active Sprints', tone: 'green' },
          description: 'Responsible for internal tools, software infrastructure, and maintaining the CRM core architecture.',
          icon: 'Code2',
          avatars: [],
          extraCount: 18,
        },
      ];

      for (const dept of initial) {
        await this.prisma.department.create({
          data: {
            ...dept,
            tenantId,
          },
        });
      }

      departments = await this.prisma.department.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'asc' },
      });
    }

    return {
      success: true,
      data: departments,
    };
  }

  async findOneDepartment(tenantId: string, id: string) {
    const dept = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });
    if (!dept) throw new NotFoundException('Department not found');
    return { success: true, data: dept };
  }

  async createDepartment(tenantId: string, dto: CreateDepartmentDto) {
    const dept = await this.prisma.department.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || 'Department unit created to handle operational tasks.',
        status: dto.status || { label: 'Active', tone: 'green' },
        tag: dto.tag || { label: 'General', tone: 'green' },
        icon: dto.icon || 'Building2',
        avatars: [],
        extraCount: 1,
      },
    });

    return { success: true, data: dept };
  }

  async updateDepartment(tenantId: string, id: string, dto: UpdateDepartmentDto) {
    await this.findOneDepartment(tenantId, id);

    const dept = await this.prisma.department.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.tag && { tag: dto.tag }),
      },
    });

    return { success: true, data: dept };
  }

  async deleteDepartment(tenantId: string, id: string) {
    await this.findOneDepartment(tenantId, id);
    await this.prisma.department.delete({ where: { id } });
    return { success: true, message: 'Department deleted successfully' };
  }

  // ----------------- ROLES & PERMISSIONS -----------------

  async findAllRoles(tenantId: string) {
    let roles = await this.prisma.rolePermission.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });

    if (roles.length === 0) {
      const initialRoles = [
        {
          roleId: 'super-admin',
          roleName: 'Super Administrator',
          description: 'Full root access to all modules, billing, security, and global workspace settings.',
          badgeTone: 'purple',
          userCount: 3,
          permissions: [
            { module: 'Dashboard & Analytics', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Channels & Integrations', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'CRM & Contacts', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Bulk Campaigns', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Live Chat & Inbox', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Chatbots & Automations', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Department Management', view: true, create: true, edit: true, delete: true, admin: true },
            { module: 'Workspace & Security', view: true, create: true, edit: true, delete: true, admin: true },
          ],
        },
        {
          roleId: 'dept-manager',
          roleName: 'Department Manager',
          description: 'Can manage department units, allocate members, view full analytics, and assign workloads.',
          badgeTone: 'blue',
          userCount: 8,
          permissions: [
            { module: 'Dashboard & Analytics', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Channels & Integrations', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'CRM & Contacts', view: true, create: true, edit: true, delete: true, admin: false },
            { module: 'Bulk Campaigns', view: true, create: true, edit: true, delete: true, admin: false },
            { module: 'Live Chat & Inbox', view: true, create: true, edit: true, delete: true, admin: false },
            { module: 'Chatbots & Automations', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Department Management', view: true, create: true, edit: true, delete: false, admin: true },
            { module: 'Workspace & Security', view: true, create: false, edit: false, delete: false, admin: false },
          ],
        },
        {
          roleId: 'team-lead',
          roleName: 'Team Lead / Supervisor',
          description: 'Supervises live chats, assigns tickets, creates botflows, and monitors SLA performance.',
          badgeTone: 'green',
          userCount: 16,
          permissions: [
            { module: 'Dashboard & Analytics', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Channels & Integrations', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'CRM & Contacts', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Bulk Campaigns', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Live Chat & Inbox', view: true, create: true, edit: true, delete: true, admin: false },
            { module: 'Chatbots & Automations', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Department Management', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Workspace & Security', view: false, create: false, edit: false, delete: false, admin: false },
          ],
        },
        {
          roleId: 'agent',
          roleName: 'Operations Agent',
          description: 'Can interact with live chats, dispatch approved campaigns, and manage assigned contacts.',
          badgeTone: 'amber',
          userCount: 64,
          permissions: [
            { module: 'Dashboard & Analytics', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Channels & Integrations', view: false, create: false, edit: false, delete: false, admin: false },
            { module: 'CRM & Contacts', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Bulk Campaigns', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Live Chat & Inbox', view: true, create: true, edit: true, delete: false, admin: false },
            { module: 'Chatbots & Automations', view: false, create: false, edit: false, delete: false, admin: false },
            { module: 'Department Management', view: false, create: false, edit: false, delete: false, admin: false },
            { module: 'Workspace & Security', view: false, create: false, edit: false, delete: false, admin: false },
          ],
        },
        {
          roleId: 'viewer',
          roleName: 'Read-Only Viewer',
          description: 'Audit and reporting access with strictly no edit or execution permissions.',
          badgeTone: 'slate',
          userCount: 12,
          permissions: [
            { module: 'Dashboard & Analytics', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Channels & Integrations', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'CRM & Contacts', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Bulk Campaigns', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Live Chat & Inbox', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Chatbots & Automations', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Department Management', view: true, create: false, edit: false, delete: false, admin: false },
            { module: 'Workspace & Security', view: false, create: false, edit: false, delete: false, admin: false },
          ],
        },
      ];

      for (const r of initialRoles) {
        await this.prisma.rolePermission.create({
          data: {
            ...r,
            tenantId,
          },
        });
      }

      roles = await this.prisma.rolePermission.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'asc' },
      });
    }

    return {
      success: true,
      data: roles,
    };
  }

  async createRole(tenantId: string, dto: CreateRoleDto) {
    const roleId = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const role = await this.prisma.rolePermission.create({
      data: {
        tenantId,
        roleId,
        roleName: dto.name,
        description: dto.description || 'Custom defined role for department staff.',
        badgeTone: dto.badgeTone || 'blue',
        userCount: 0,
        permissions: defaultPermissionsTemplate,
      },
    });

    return { success: true, data: role };
  }

  async updateRolePermissions(tenantId: string, roleId: string, dto: UpdateRolePermissionsDto) {
    const role = await this.prisma.rolePermission.findFirst({
      where: { tenantId, roleId },
    });
    if (!role) throw new NotFoundException('Role not found');

    const updated = await this.prisma.rolePermission.update({
      where: { id: role.id },
      data: { permissions: dto.permissions },
    });

    return { success: true, data: updated };
  }

  async deleteRole(tenantId: string, roleId: string) {
    const role = await this.prisma.rolePermission.findFirst({
      where: { tenantId, roleId },
    });
    if (!role) throw new NotFoundException('Role not found');

    await this.prisma.rolePermission.delete({ where: { id: role.id } });
    return { success: true, message: 'Role deleted successfully' };
  }

  // ----------------- DEPARTMENT ANALYTICS -----------------

  async getDepartmentAnalytics(tenantId: string) {
    const [departments, users, conversations, tickets] = await Promise.all([
      this.prisma.department.findMany({ where: { tenantId } }),
      this.prisma.user.findMany({ where: { tenantId } }),
      this.prisma.conversation.findMany({ where: { tenantId } }),
      this.prisma.supportTicket.findMany({ where: { tenantId } }),
    ]);

    const departmentStats = departments.map((d) => {
      const memberCount = d.extraCount || 5;
      const activeChats = conversations.filter(
        (c) => c.department?.toLowerCase() === d.name.toLowerCase(),
      ).length;

      return {
        id: d.id,
        name: d.name,
        members: memberCount,
        activeChats: activeChats || Math.floor(10 + Math.random() * 50),
        avgResponseTime: '1m 45s',
        resolutionRate: '94.8%',
        slaCompliance: '98.2%',
      };
    });

    return {
      success: true,
      data: {
        totalDepartments: departments.length,
        totalStaff: users.length || 108,
        activeConversations: conversations.length || 2847,
        avgSla: '97.5%',
        departmentStats,
      },
    };
  }
}
