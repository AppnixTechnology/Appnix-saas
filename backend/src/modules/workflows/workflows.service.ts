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

// In-memory seed storage for instant responsiveness & mock fallback
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

  /**
   * Create a new workflow record
   */
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

    // Generate initial canvas nodes based on template or scratch trigger
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
      } else if (templateId === 'welcome_kyc') {
        initialNodes = [
          { id: 'node-1', type: 'trigger', data: { label: 'Inbound: Keyword "START"' }, position: { x: 250, y: 50 } },
          { id: 'node-2', type: 'action', data: { label: 'Action: Send Interactive KYC Menu' }, position: { x: 250, y: 180 } },
        ];
        initialEdges = [{ id: 'e1-2', source: 'node-1', target: 'node-2' }];
      } else {
        // Start from scratch: create single initial trigger node
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

    try {
      // Attempt database insertion via Prisma if available
      const created = await (this.prisma as any).workflow.create({
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
    } catch (err) {
      // Resilient fallback to in-memory store
      const newRecord: WorkflowRecord = {
        id: `wf_${Date.now()}`,
        tenantId,
        title,
        status: true,
        folderId: folderId || 'all',
        folderName: folderName || 'All',
        triggerType: triggerType.toString(),
        tags,
        nodes: initialNodes,
        edges: initialEdges,
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      IN_MEMORY_WORKFLOWS.unshift(newRecord);

      return {
        success: true,
        data: newRecord,
        message: 'Workflow created successfully',
      };
    }
  }

  /**
   * Get all workflows for tenant
   */
  async getWorkflows(tenantId: string, folderId?: string) {
    try {
      const where: any = { tenantId };
      if (folderId && folderId !== 'all') {
        where.folderId = folderId;
      }

      const list = await (this.prisma as any).workflow.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        data: list.length > 0 ? list : IN_MEMORY_WORKFLOWS,
      };
    } catch (err) {
      let filtered = [...IN_MEMORY_WORKFLOWS];
      if (folderId && folderId !== 'all') {
        filtered = filtered.filter((w) => w.folderId === folderId);
      }
      return {
        success: true,
        data: filtered,
      };
    }
  }

  /**
   * Get all folders
   */
  async getFolders(tenantId: string) {
    return {
      success: true,
      data: IN_MEMORY_FOLDERS,
    };
  }

  /**
   * Unlock a premium or locked workflow via license key
   */
  async unlockWorkflow(tenantId: string, licenseKey: string) {
    const formattedKey = licenseKey.trim().toUpperCase();

    // Check pre-defined mock licenses or database records
    const DEMO_LICENSES: Record<string, { title: string; trigger: string; tags: string[]; status: string }> = {
      'WFLW-VIP8-2026-PREM': {
        title: 'Enterprise AI Lead Qualifier & CRM Handover Bot',
        trigger: 'INBOUND_MESSAGE',
        tags: ['AI Agent', 'Enterprise', 'VIP'],
        status: 'active',
      },
      'WFLW-CART-REC9-9921': {
        title: 'Shopify High-Conversion WhatsApp Recovery Pro',
        trigger: 'WEBHOOK_EVENT',
        tags: ['E-Commerce', 'Shopify', 'High ROI'],
        status: 'active',
      },
      'WFLW-EXPD-2025-0001': {
        title: 'Expired Promotional Flow',
        trigger: 'SCHEDULED_CRON',
        tags: ['Expired'],
        status: 'expired',
      },
      'WFLW-CLAIM-9922-USED': {
        title: 'Already Claimed License',
        trigger: 'INBOUND_MESSAGE',
        tags: ['Claimed'],
        status: 'claimed',
      },
    };

    const license = DEMO_LICENSES[formattedKey];

    if (!license) {
      // If it looks like a valid pattern (WFLW-XXXX-XXXX-XXXX), unlock a generic custom workflow
      if (/^WFLW-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedKey)) {
        const unlockedCustom: WorkflowRecord = {
          id: `wf_unlocked_${Date.now()}`,
          tenantId,
          title: `Unlocked Premium Flow (${formattedKey.slice(-4)})`,
          status: true,
          folderId: 'all',
          folderName: 'All',
          triggerType: 'INBOUND_MESSAGE',
          tags: ['Unlocked', 'Premium'],
          nodes: [{ id: 'node-1', type: 'trigger', data: { label: 'Unlocked Premium Trigger' }, position: { x: 250, y: 50 } }],
          edges: [],
          isLocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        IN_MEMORY_WORKFLOWS.unshift(unlockedCustom);

        return {
          success: true,
          message: `Successfully unlocked "${unlockedCustom.title}"!`,
          unlockedWorkflow: unlockedCustom,
        };
      }

      return {
        success: false,
        message: 'Invalid license key. Please check the code format (e.g. WFLW-XXXX-XXXX-XXXX).',
      };
    }

    if (license.status === 'expired') {
      return {
        success: false,
        message: 'This workflow license key has expired on 31 Dec 2025.',
      };
    }

    if (license.status === 'claimed') {
      return {
        success: false,
        message: 'This license key has already been claimed by another workspace.',
      };
    }

    // Successfully redeem and unlock
    const newUnlockedWf: WorkflowRecord = {
      id: `wf_unlocked_${Date.now()}`,
      tenantId,
      title: license.title,
      status: true,
      folderId: 'all',
      folderName: 'All',
      triggerType: license.trigger,
      tags: license.tags,
      nodes: [
        { id: 'node-1', type: 'trigger', data: { label: `Trigger: ${license.title}` }, position: { x: 250, y: 50 } },
        { id: 'node-2', type: 'action', data: { label: 'Action: Automated Multi-Channel Dispatch' }, position: { x: 250, y: 180 } },
      ],
      edges: [{ id: 'e1-2', source: 'node-1', target: 'node-2' }],
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_WORKFLOWS.unshift(newUnlockedWf);

    return {
      success: true,
      message: `Successfully unlocked "${license.title}"!`,
      unlockedWorkflow: newUnlockedWf,
    };
  }

  /**
   * Get workspace plan workflow quota & limits
   */
  async getQuota(tenantId: string) {
    return {
      success: true,
      data: {
        used: 4,
        limit: 5,
        percentage: 80,
        planName: 'Starter Tier',
        isNearLimit: true,
        canCreateMore: true,
        features: [
          'Up to 5 active workflows',
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

  /**
   * Get all pre-built workflow templates
   */
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
      {
        id: "tmpl_4",
        title: "24/7 Support Auto-Reply & Knowledge Bot",
        slug: "support_auto_responder_faq",
        description: "Answers recurring customer FAQs (Hours, Return Policy, Shipping) and escalates complex queries to live human agents.",
        category: "Customer Support",
        channels: ["WhatsApp", "Instagram", "Facebook", "RCS"],
        apps: ["AI Agent", "Webhook"],
        badge: "Official",
        isPremium: false,
        installCount: 3120,
        stepsCount: 3,
        setupMinutes: 2,
        requiredConnections: ["WhatsApp Cloud API", "FAQ Knowledge Base"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "Incoming Message Outside Business Hours" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "action", data: { label: "AI Search: Match FAQ & Return Solution" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "action", data: { label: "If Unresolved: Create High-Priority Ticket" }, position: { x: 250, y: 290 } },
        ],
      },
      {
        id: "tmpl_5",
        title: "Post-Purchase Review & NPS Collector",
        slug: "review_nps_collector",
        description: "Waits 2 days after order delivery, sends WhatsApp interactive 5-star rating card, and logs feedback to Google Sheets.",
        category: "Marketing & Broadcasts",
        channels: ["WhatsApp"],
        apps: ["Google Sheets", "Webhook"],
        badge: "Community",
        isPremium: false,
        installCount: 940,
        stepsCount: 4,
        setupMinutes: 3,
        requiredConnections: ["WhatsApp Cloud API", "Google Sheets"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "Webhook: Order Delivered Event" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "condition", data: { label: "Delay: 48 Hours" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "action", data: { label: "WhatsApp: Interactive 5-Star Rating Card" }, position: { x: 250, y: 290 } },
          { id: "node-4", type: "action", data: { label: "Google Sheets: Append Customer NPS Rating" }, position: { x: 250, y: 410 } },
        ],
      },
      {
        id: "tmpl_6",
        title: "Instant OTP & Transient Verification Gateway",
        slug: "instant_otp_verification",
        description: "Generates high-speed 6-digit authentication OTP with 10-minute TTL in Appnix Data Store and dispatches via RCS / WhatsApp.",
        category: "Utility / OTP",
        channels: ["WhatsApp", "RCS"],
        apps: ["Webhook", "Data Store"],
        badge: "Official",
        isPremium: false,
        installCount: 1610,
        stepsCount: 3,
        setupMinutes: 2,
        requiredConnections: ["WhatsApp Cloud API", "Appnix Data Store"],
        nodes: [
          { id: "node-1", type: "trigger", data: { label: "API Webhook: Request OTP" }, position: { x: 250, y: 50 } },
          { id: "node-2", type: "action", data: { label: "Data Store: Cache 6-Digit Code (TTL: 10m)" }, position: { x: 250, y: 170 } },
          { id: "node-3", type: "action", data: { label: "WhatsApp / RCS: Dispatch Auth Template" }, position: { x: 250, y: 290 } },
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

  /**
   * Clone a pre-built template into active user workflows
   */
  async cloneTemplate(tenantId: string, templateId: string, customTitle?: string) {
    const templatesRes = await this.getTemplates();
    const template = templatesRes.data.find((t) => t.id === templateId || t.slug === templateId);

    if (!template) {
      throw new NotFoundException(`Template "${templateId}" not found`);
    }

    const clonedTitle = customTitle || `${template.title} (Clone)`;
    const newWorkflow: WorkflowRecord = {
      id: `wf_cloned_${Date.now()}`,
      tenantId,
      title: clonedTitle,
      status: true,
      folderId: 'all',
      folderName: 'All',
      triggerType: template.channels.includes('WhatsApp') ? 'INBOUND_MESSAGE' : 'WEBHOOK_EVENT',
      tags: [template.category, 'Template'],
      nodes: template.nodes || [],
      edges: [
        { id: 'e1-2', source: 'node-1', target: 'node-2' },
        { id: 'e2-3', source: 'node-2', target: 'node-3' },
      ],
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_WORKFLOWS.unshift(newWorkflow);

    return {
      success: true,
      data: newWorkflow,
      message: `Template "${template.title}" successfully cloned into your workflows!`,
    };
  }
}
