import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowDto, TriggerTypeDto } from './dto/create-workflow.dto';

export interface WorkflowRecord {
  id: string;
  tenantId?: string;
  title: string;
  status: boolean;
  folderId?: string | null;
  folderName?: string;
  triggerType: string;
  tags: string[];
  nodes: any;
  edges: any;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IN_MEMORY_WORKFLOWS: WorkflowRecord[] = [
  {
    id: 'wf_seed_1',
    title: 'Abandoned Cart Recovery Flow',
    status: true,
    folderId: 'all',
    folderName: 'All',
    triggerType: 'WEBHOOK_EVENT',
    tags: ['Marketing', 'E-Commerce', 'Shopify'],
    nodes: [
      { id: 'node-1', type: 'trigger', data: { label: 'Webhook: Cart Abandoned', source: 'Shopify' }, position: { x: 250, y: 50 } },
      { id: 'node-2', type: 'condition', data: { label: 'Condition: Cart Value > ₹1,000' }, position: { x: 250, y: 180 } },
      { id: 'node-3', type: 'action', data: { label: 'WhatsApp: Send Discount Template', template: 'cart_recovery_v2' }, position: { x: 250, y: 310 } },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
    ],
    isLocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const IN_MEMORY_FOLDERS = [
  { id: 'all', name: 'All', count: 12 },
  { id: 'nourin', name: 'Nourin', count: 4 },
  { id: 'sales', name: 'Sales Pipeline', count: 6 },
  { id: 'support', name: 'Customer Support', count: 8 },
];

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async createWorkflow(tenantId: string, dto: CreateWorkflowDto) {
    const {
      title,
      folderId,
      folderName,
      triggerType = TriggerTypeDto.INBOUND_MESSAGE,
      tags = [],
      templateId,
      nodes,
      edges,
    } = dto;

    let initialNodes = nodes && nodes.length > 0 ? nodes : [];
    let initialEdges = edges && edges.length > 0 ? edges : [];

    if (initialNodes.length === 0) {
      if (templateId === 'abandoned_cart') {
        initialNodes = [
          { id: 'node-1', type: 'trigger', data: { label: 'Webhook: Cart Abandoned' }, position: { x: 250, y: 50 } },
          { id: 'node-2', type: 'condition', data: { label: 'Cart Value > ₹1,000' }, position: { x: 250, y: 170 } },
          { id: 'node-3', type: 'action', data: { label: 'Action: Send WhatsApp Recovery Offer' }, position: { x: 250, y: 290 } },
        ];
        initialEdges = [
          { id: 'e1-2', source: 'node-1', target: 'node-2' },
          { id: 'e2-3', source: 'node-2', target: 'node-3' },
        ];
      } else {
        const triggerLabel =
          triggerType === TriggerTypeDto.WEBHOOK_EVENT
            ? 'Webhook / API Trigger Node'
            : triggerType === TriggerTypeDto.SCHEDULED_CRON
            ? 'Scheduled Cron Trigger Node'
            : triggerType === TriggerTypeDto.FORM_SUBMISSION
            ? 'Form Submission Trigger Node'
            : 'Inbound Message / Keyword Trigger';

        initialNodes = [
          {
            id: 'node-trigger-1',
            type: 'trigger',
            data: { label: triggerLabel, triggerType },
            position: { x: 300, y: 80 },
          },
        ];
      }
    }

    const created = await this.prisma.workflow.create({
      data: {
        tenantId,
        title,
        status: true,
        folderId: folderId && folderId !== 'all' ? folderId : null,
        triggerType: triggerType as any,
        tags,
        nodes: initialNodes,
        edges: initialEdges,
        isLocked: false,
      },
    });

    return {
      success: true,
      data: created,
      message: 'Workflow created successfully',
    };
  }

  async getWorkflows(tenantId: string, folderId?: string) {
    const where: any = { tenantId };
    if (folderId && folderId !== 'all') {
      where.folderId = folderId;
    }

    let list = await this.prisma.workflow.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (list.length === 0) {
      for (const w of IN_MEMORY_WORKFLOWS) {
        await this.prisma.workflow.create({
          data: {
            tenantId,
            title: w.title,
            status: w.status,
            triggerType: w.triggerType as any,
            tags: w.tags,
            nodes: w.nodes,
            edges: w.edges,
            isLocked: w.isLocked,
          },
        });
      }

      list = await this.prisma.workflow.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return {
      success: true,
      data: list,
    };
  }

  async getWorkflowById(tenantId: string, id: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, tenantId },
    });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return { success: true, data: workflow };
  }

  async updateWorkflow(tenantId: string, id: string, payload: any) {
    await this.getWorkflowById(tenantId, id);

    const updated = await this.prisma.workflow.update({
      where: { id },
      data: {
        ...(payload.title && { title: payload.title }),
        ...(payload.status !== undefined && { status: payload.status }),
        ...(payload.folderId !== undefined && { folderId: payload.folderId }),
        ...(payload.triggerType && { triggerType: payload.triggerType }),
        ...(payload.tags && { tags: payload.tags }),
        ...(payload.nodes && { nodes: payload.nodes }),
        ...(payload.edges && { edges: payload.edges }),
      },
    });

    return { success: true, data: updated };
  }

  async toggleWorkflow(tenantId: string, id: string) {
    const workflow = await this.getWorkflowById(tenantId, id);
    const updated = await this.prisma.workflow.update({
      where: { id },
      data: { status: !workflow.data.status },
    });
    return { success: true, data: updated };
  }

  async deleteWorkflow(tenantId: string, id: string) {
    await this.getWorkflowById(tenantId, id);
    await this.prisma.workflow.delete({ where: { id } });
    return { success: true, message: 'Workflow deleted successfully' };
  }

  async getFolders(tenantId: string) {
    return {
      success: true,
      data: IN_MEMORY_FOLDERS,
    };
  }

  async unlockWorkflow(tenantId: string, licenseKey: string) {
    const formattedKey = licenseKey.trim().toUpperCase();

    const unlockedCustom = await this.prisma.workflow.create({
      data: {
        tenantId,
        title: `Unlocked Premium Flow (${formattedKey.slice(-4)})`,
        status: true,
        triggerType: 'INBOUND_MESSAGE',
        tags: ['Unlocked', 'Premium'],
        nodes: [{ id: 'node-1', type: 'trigger', data: { label: 'Unlocked Premium Trigger' }, position: { x: 250, y: 50 } }],
        edges: [],
        isLocked: false,
      },
    });

    return {
      success: true,
      message: `Successfully unlocked "${unlockedCustom.title}"!`,
      unlockedWorkflow: unlockedCustom,
    };
  }

  async getQuota(tenantId: string) {
    const count = await this.prisma.workflow.count({ where: { tenantId } });
    return {
      success: true,
      data: {
        used: count || 4,
        limit: 10,
        percentage: ((count || 4) / 10) * 100,
        planName: 'Professional Tier',
        isNearLimit: false,
        canCreateMore: true,
        features: [
          'Up to 10 active workflows',
          'Standard Webhook Triggers',
          'Single Inbound Keyword Router',
          'Community Template Access',
        ],
        proFeatures: [
          'Unlimited Active Workflows',
          'Multi-channel AI Agent Handover',
          'Real-time WhatsApp & RCS Webhooks',
          'Dedicated SLA & Execution Logs',
        ],
      },
    };
  }

  async getTemplates(category?: string, channel?: string) {
    const TEMPLATES = [
      {
        id: "tmpl_1",
        title: "Shopify Abandoned Cart Auto-Recovery",
        slug: "shopify_abandoned_cart_recovery",
        description: "Recovers dropped checkouts via dynamic WhatsApp template with 1-click checkout URL and exclusive discount coupon.",
        category: "E-Commerce",
        channels: ["WhatsApp", "RCS"],
        apps: ["Shopify", "Webhook", "WhatsApp"],
        badge: "Official",
        isPremium: false,
        installCount: 1840,
        stepsCount: 3,
        setupMinutes: 2,
        requiredConnections: ["Shopify Webhook", "WhatsApp Cloud API"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "Shopify: Checkout Abandoned Webhook" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "condition", data: { label: "Filter: Cart Total > ₹1,000 & 1 Hr Delay" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "action", data: { label: "WhatsApp: Send Dynamic Recovery Promo" }, position: { x: 250, y: 290 } },
        ],
      },
      {
        id: "tmpl_2",
        title: "AI Lead Qualification & CRM Handover",
        slug: "ai_lead_qualification_crm_handover",
        description: "Engages incoming queries using AI intent classification, collects budget/timeline, and routes VIP leads to sales agents.",
        category: "Lead Generation",
        channels: ["WhatsApp", "Instagram", "Facebook"],
        apps: ["AI Agent", "Google Sheets", "CRM"],
        badge: "Official",
        isPremium: true,
        installCount: 2420,
        stepsCount: 4,
        setupMinutes: 3,
        requiredConnections: ["AI Agent Desk", "Google Sheets API", "WhatsApp Cloud API"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "Inbound Message: Keyword / Query" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "action", data: { label: "AI Classifier: Determine Lead Intent & Budget" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "condition", data: { label: "Condition: Score >= 80 (VIP Lead)" }, position: { x: 250, y: 290 } },
          { id: "node-4", type: "action", data: { label: "CRM: Assign Sales Rep & Handover Chat" }, position: { x: 250, y: 410 } },
        ],
      },
      {
        id: "tmpl_3",
        title: "Order Confirmation & Real-Time Tracking",
        slug: "order_confirmation_tracking",
        description: "Sends instant order receipt on WhatsApp with interactive quick reply buttons for order tracking and support.",
        category: "E-Commerce",
        channels: ["WhatsApp", "RCS"],
        apps: ["Shopify", "Webhook"],
        badge: "Official",
        isPremium: false,
        installCount: 1250,
        stepsCount: 3,
        setupMinutes: 2,
        requiredConnections: ["Shopify Store", "WhatsApp Cloud API"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "Webhook: Order Placed (Shopify/WooCommerce)" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "action", data: { label: "WhatsApp: Send Order Receipt with Track URL" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "action", data: { label: "Appnix CRM: Save Order ID to Customer Profile" }, position: { x: 250, y: 290 } },
        ],
      },
    ];

    let result = [...TEMPLATES];
    if (category && category !== "All") {
      result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    if (channel && channel !== "All") {
      result = result.filter((t) => t.channels.some((c) => c.toLowerCase() === channel.toLowerCase()));
    }

    return {
      success: true,
      data: result,
      total: result.length,
    };
  }

  async cloneTemplate(tenantId: string, templateId: string, customTitle?: string) {
    const templatesRes = await this.getTemplates();
    const template = templatesRes.data.find((t) => t.id === templateId || t.slug === templateId);

    if (!template) {
      throw new NotFoundException(`Template "${templateId}" not found`);
    }

    const clonedTitle = customTitle || `${template.title} (Clone)`;
    const created = await this.prisma.workflow.create({
      data: {
        tenantId,
        title: clonedTitle,
        status: true,
        triggerType: template.channels.includes('WhatsApp') ? 'INBOUND_MESSAGE' : 'WEBHOOK_EVENT',
        tags: [template.category, 'Template'],
        nodes: template.nodes || [],
        edges: [
          { id: 'e1-2', source: 'node-1', target: 'node-2' },
          { id: 'e2-3', source: 'node-2', target: 'node-3' },
        ],
        isLocked: false,
      },
    });

    return {
      success: true,
      data: created,
      message: `Template "${template.title}" successfully cloned into your workflows!`,
    };
  }
}
