import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateWhatsAppTemplateDto,
  UpdateWhatsAppTemplateDto,
  TemplateQueryDto,
  WhatsAppTemplateStatus,
  TemplateCategory,
  TemplateContentType,
  SimulateReviewDto,
} from './dto/whatsapp-template.dto';

export interface WhatsAppTemplateEntity {
  id: string;
  tenantId: string;
  channelId?: string;
  name: string;
  category: TemplateCategory;
  language: string;
  contentType: TemplateContentType;
  header?: any;
  body: string;
  variables: any[];
  variableMappings?: Record<string, string>;
  footer?: string;
  buttons?: any[];
  catalog?: any;
  carouselCards?: any[];
  status: WhatsAppTemplateStatus;
  metaTemplateId?: string;
  rejectionReason?: string;
  rejectionDetails?: {
    code: string;
    reason: string;
    recommendation: string;
    date: string;
  };
  preview?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
}

@Injectable()
export class WhatsAppTemplatesService {
  // In-memory cache & fallback store for resilient operation
  private memoryStore = new Map<string, WhatsAppTemplateEntity[]>();

  constructor(private prisma: PrismaService) {
    this.seedDefaultTemplates('demo-tenant');
  }

  private seedDefaultTemplates(tenantId: string) {
    if (this.memoryStore.has(tenantId)) return;

    const initialTemplates: WhatsAppTemplateEntity[] = [
      {
        id: 'tpl-101',
        tenantId,
        channelId: '1',
        name: 'order_confirmation_v2',
        category: TemplateCategory.UTILITY,
        language: 'en_US',
        contentType: TemplateContentType.TEXT,
        header: {
          type: 'TEXT',
          text: 'Order Confirmation - {{1}}',
          sampleValue: 'Appnix Store',
        },
        body: 'Hello {{1}},\n\nThank you for your order! Your order #{{2}} for {{3}} has been confirmed and is now being packed.\n\nEstimated delivery by {{4}}.',
        variables: [
          { index: 1, name: 'Customer Name', sampleValue: 'Jitendra Kumar', dataSource: 'contact.name' },
          { index: 2, name: 'Order ID', sampleValue: 'ORD-98421', dataSource: 'order.id' },
          { index: 3, name: 'Order Amount', sampleValue: '₹7,499', dataSource: 'order.total' },
          { index: 4, name: 'Delivery Date', sampleValue: 'Tomorrow, 5:00 PM', dataSource: 'order.delivery_date' },
        ],
        variableMappings: {
          '1': 'Customer Name',
          '2': 'Order ID',
          '3': 'Order Amount',
          '4': 'Delivery Date',
        },
        footer: 'Appnix Technologies • 24x7 Support',
        buttons: [
          {
            type: 'URL' as any,
            text: 'Track Order',
            url: 'https://appnix.io/track/{{1}}',
            urlType: 'DYNAMIC',
          },
          {
            type: 'PHONE_NUMBER' as any,
            text: 'Call Support',
            phoneNumber: '+918062765557',
            countryCode: '+91',
          },
        ],
        status: WhatsAppTemplateStatus.APPROVED,
        metaTemplateId: 'meta_tpl_90182410',
        preview: 'Hello Jitendra Kumar, Thank you for your order! Your order #ORD-98421 for ₹7,499 has been confirmed...',
        createdAt: new Date('2026-08-10T10:00:00Z'),
        updatedAt: new Date('2026-08-10T10:05:00Z'),
        submittedAt: new Date('2026-08-10T10:01:00Z'),
        approvedAt: new Date('2026-08-10T10:05:00Z'),
      },
      {
        id: 'tpl-102',
        tenantId,
        channelId: '1',
        name: 'festive_diwali_special',
        category: TemplateCategory.MARKETING,
        language: 'en_US',
        contentType: TemplateContentType.MEDIA,
        header: {
          type: 'IMAGE',
          mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
          mediaFileName: 'diwali_banner.jpg',
        },
        body: '✨ Exclusive Festive Offer for {{1}}! ✨\n\nEnjoy FLAT {{2}}% OFF on all SaaS subscriptions and automations this week.\n\nUse Coupon Code: *{{3}}*\nValid till {{4}}.',
        variables: [
          { index: 1, name: 'Customer Name', sampleValue: 'Priya Sharma', dataSource: 'contact.name' },
          { index: 2, name: 'Discount Percentage', sampleValue: '40', dataSource: 'offer.discount' },
          { index: 3, name: 'Promo Code', sampleValue: 'DIWALI40', dataSource: 'offer.code' },
          { index: 4, name: 'Expiry Date', sampleValue: 'Sunday Midnight', dataSource: 'offer.expiry' },
        ],
        variableMappings: {
          '1': 'Customer Name',
          '2': 'Discount Percentage',
          '3': 'Promo Code',
          '4': 'Expiry Date',
        },
        footer: 'Reply STOP to opt out of promotional messages',
        buttons: [
          {
            type: 'URL' as any,
            text: 'Claim Offer',
            url: 'https://appnix.io/offers/diwali',
            urlType: 'STATIC',
          },
          {
            type: 'QUICK_REPLY' as any,
            text: 'Talk to Sales',
            payload: 'INTERESTED_SALES_PROMO',
          },
        ],
        status: WhatsAppTemplateStatus.APPROVED,
        metaTemplateId: 'meta_tpl_88192031',
        preview: 'Exclusive Festive Offer for Priya Sharma! Enjoy FLAT 40% OFF...',
        createdAt: new Date('2026-08-15T14:30:00Z'),
        updatedAt: new Date('2026-08-15T14:40:00Z'),
        submittedAt: new Date('2026-08-15T14:32:00Z'),
        approvedAt: new Date('2026-08-15T14:40:00Z'),
      },
      {
        id: 'tpl-103',
        tenantId,
        channelId: '1',
        name: 'account_login_otp',
        category: TemplateCategory.AUTHENTICATION,
        language: 'en_US',
        contentType: TemplateContentType.TEXT,
        header: {
          type: 'NONE',
        },
        body: '{{1}} is your Appnix verification code. For security reasons, do NOT share this code with anyone. Valid for 10 minutes.',
        variables: [
          { index: 1, name: 'OTP Code', sampleValue: '582910', dataSource: 'auth.otp' },
        ],
        variableMappings: {
          '1': 'OTP Code',
        },
        footer: 'Appnix Security Team',
        buttons: [
          {
            type: 'COPY_CODE' as any,
            text: 'Copy Code',
            payload: '{{1}}',
          },
        ],
        status: WhatsAppTemplateStatus.APPROVED,
        metaTemplateId: 'meta_tpl_71290311',
        preview: '582910 is your Appnix verification code...',
        createdAt: new Date('2026-08-18T09:15:00Z'),
        updatedAt: new Date('2026-08-18T09:20:00Z'),
        submittedAt: new Date('2026-08-18T09:16:00Z'),
        approvedAt: new Date('2026-08-18T09:20:00Z'),
      },
      {
        id: 'tpl-104',
        tenantId,
        channelId: '1',
        name: 'shipping_dispatch_alert',
        category: TemplateCategory.UTILITY,
        language: 'en_US',
        contentType: TemplateContentType.TEXT,
        header: {
          type: 'TEXT',
          text: 'Shipment Out for Delivery 🚚',
        },
        body: 'Great news {{1}}! Your package from order {{2}} is out for delivery with delivery executive {{3}} (Ph: {{4}}).',
        variables: [
          { index: 1, name: 'Customer Name', sampleValue: 'Rahul Verma', dataSource: 'contact.name' },
          { index: 2, name: 'Order ID', sampleValue: 'ORD-77120', dataSource: 'order.id' },
          { index: 3, name: 'Driver Name', sampleValue: 'Ramesh Singh', dataSource: 'courier.driver' },
          { index: 4, name: 'Driver Phone', sampleValue: '+919811122233', dataSource: 'courier.phone' },
        ],
        variableMappings: {
          '1': 'Customer Name',
          '2': 'Order ID',
          '3': 'Driver Name',
          '4': 'Driver Phone',
        },
        footer: 'Live tracking available',
        buttons: [
          {
            type: 'URL' as any,
            text: 'Live Map Track',
            url: 'https://appnix.io/delivery/{{2}}',
            urlType: 'DYNAMIC',
          },
        ],
        status: WhatsAppTemplateStatus.PENDING,
        metaTemplateId: 'meta_tpl_66190244',
        preview: 'Great news Rahul Verma! Your package from order ORD-77120 is out for delivery...',
        createdAt: new Date('2026-08-28T16:00:00Z'),
        updatedAt: new Date('2026-08-28T16:00:00Z'),
        submittedAt: new Date('2026-08-28T16:00:00Z'),
      },
      {
        id: 'tpl-105',
        tenantId,
        channelId: '1',
        name: 'flash_sale_promo_rejected',
        category: TemplateCategory.UTILITY,
        language: 'en_US',
        contentType: TemplateContentType.TEXT,
        header: {
          type: 'TEXT',
          text: '50% DISCOUNT TODAY ONLY!',
        },
        body: 'Hey {{1}}, buy now and get 50% discount on all items! Click the link below to purchase immediately.',
        variables: [
          { index: 1, name: 'Customer Name', sampleValue: 'Customer', dataSource: 'contact.name' },
        ],
        variableMappings: {
          '1': 'Customer Name',
        },
        buttons: [
          {
            type: 'URL' as any,
            text: 'Buy Now',
            url: 'https://example.com/flash-sale',
            urlType: 'STATIC',
          },
        ],
        status: WhatsAppTemplateStatus.REJECTED,
        metaTemplateId: 'meta_tpl_55190012',
        rejectionReason: 'Category Mismatch: The template contains promotional discounts and marketing calls to action, but was submitted under UTILITY category.',
        rejectionDetails: {
          code: 'INVALID_CATEGORY_OR_POLICY_VIOLATION',
          reason: 'Meta requires promotional/discount templates to be classified as MARKETING category rather than UTILITY.',
          recommendation: 'Change category from UTILITY to MARKETING and resubmit for approval.',
          date: '2026-08-25T11:20:00Z',
        },
        preview: 'Hey Customer, buy now and get 50% discount on all items...',
        createdAt: new Date('2026-08-25T11:00:00Z'),
        updatedAt: new Date('2026-08-25T11:20:00Z'),
        submittedAt: new Date('2026-08-25T11:02:00Z'),
      },
      {
        id: 'tpl-106',
        tenantId,
        channelId: '1',
        name: 'product_carousel_showcase',
        category: TemplateCategory.MARKETING,
        language: 'en_US',
        contentType: TemplateContentType.CAROUSEL,
        header: {
          type: 'NONE',
        },
        body: 'Check out our top-selling automation packages customized for {{1}}:',
        variables: [
          { index: 1, name: 'Company Name', sampleValue: 'Acme Corp', dataSource: 'company.name' },
        ],
        carouselCards: [
          {
            id: 'card-1',
            mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
            header: 'WhatsApp Bot Pro',
            body: 'Full AI automated WhatsApp bot with GPT integration and 24/7 lead capture.',
            buttons: [
              { type: 'URL' as any, text: 'View Bot Demo', url: 'https://appnix.io/bot-demo', urlType: 'STATIC' },
              { type: 'QUICK_REPLY' as any, text: 'Buy Now', payload: 'BUY_BOT_PRO' },
            ],
          },
          {
            id: 'card-2',
            mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
            header: 'CRM & Broadcast',
            body: 'Broadcast up to 100k messages/day with smart audience segmentation & analytics.',
            buttons: [
              { type: 'URL' as any, text: 'Explore CRM', url: 'https://appnix.io/crm-suite', urlType: 'STATIC' },
              { type: 'QUICK_REPLY' as any, text: 'Contact Us', payload: 'CONTACT_CRM' },
            ],
          },
        ],
        footer: 'Powered by Appnix Cloud Platform',
        status: WhatsAppTemplateStatus.APPROVED,
        metaTemplateId: 'meta_tpl_44901239',
        preview: 'Check out our top-selling automation packages customized for Acme Corp...',
        createdAt: new Date('2026-08-20T12:00:00Z'),
        updatedAt: new Date('2026-08-20T12:15:00Z'),
        submittedAt: new Date('2026-08-20T12:05:00Z'),
        approvedAt: new Date('2026-08-20T12:15:00Z'),
      },
      {
        id: 'tpl-107',
        tenantId,
        channelId: '1',
        name: 'draft_new_user_welcome',
        category: TemplateCategory.MARKETING,
        language: 'en_US',
        contentType: TemplateContentType.TEXT,
        header: {
          type: 'TEXT',
          text: 'Welcome to Appnix Family!',
        },
        body: 'Hi {{1}}, welcome aboard! We are thrilled to have you with us. Get started by setting up your first WhatsApp channel.',
        variables: [
          { index: 1, name: 'User Name', sampleValue: 'Alex', dataSource: 'contact.name' },
        ],
        footer: 'Need help? Reply HELP anytime',
        status: WhatsAppTemplateStatus.DRAFT,
        preview: 'Hi Alex, welcome aboard! We are thrilled to have you with us...',
        createdAt: new Date('2026-08-29T00:30:00Z'),
        updatedAt: new Date('2026-08-29T00:30:00Z'),
      },
    ];

    this.memoryStore.set(tenantId, initialTemplates);
  }

  private getStore(tenantId: string): WhatsAppTemplateEntity[] {
    const resolvedTenant = tenantId || 'demo-tenant';
    if (!this.memoryStore.has(resolvedTenant)) {
      this.seedDefaultTemplates(resolvedTenant);
    }
    return this.memoryStore.get(resolvedTenant)!;
  }

  async findAll(tenantId: string, query: TemplateQueryDto = {}) {
    const resolvedTenant = tenantId || 'demo-tenant';
    let templates = this.getStore(resolvedTenant);

    // Filter by search
    if (query.search?.trim()) {
      const q = query.search.toLowerCase().trim();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          (t.metaTemplateId && t.metaTemplateId.toLowerCase().includes(q)),
      );
    }

    // Filter by category
    if (query.category && query.category !== 'ALL') {
      templates = templates.filter((t) => t.category === query.category);
    }

    // Filter by status
    if (query.status && query.status !== 'ALL') {
      templates = templates.filter((t) => t.status === query.status);
    }

    // Filter by language
    if (query.language && query.language !== 'ALL') {
      templates = templates.filter((t) => t.language === query.language);
    }

    // Sort
    const sortBy = query.sortBy || 'latest';
    templates.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const total = templates.length;
    const paginated = templates.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        total,
        approved: templates.filter((t) => t.status === WhatsAppTemplateStatus.APPROVED).length,
        pending: templates.filter((t) => t.status === WhatsAppTemplateStatus.PENDING).length,
        draft: templates.filter((t) => t.status === WhatsAppTemplateStatus.DRAFT).length,
        rejected: templates.filter((t) => t.status === WhatsAppTemplateStatus.REJECTED).length,
        disabled: templates.filter((t) => t.status === WhatsAppTemplateStatus.DISABLED).length,
      },
    };
  }

  async findById(tenantId: string, id: string): Promise<WhatsAppTemplateEntity> {
    const store = this.getStore(tenantId);
    const template = store.find((t) => t.id === id);
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async create(tenantId: string, dto: CreateWhatsAppTemplateDto): Promise<WhatsAppTemplateEntity> {
    const store = this.getStore(tenantId);

    // Check unique name
    const existing = store.find(
      (t) => t.name.toLowerCase() === dto.name.toLowerCase() && t.language === dto.language,
    );
    if (existing) {
      throw new ConflictException(
        `A template with name "${dto.name}" and language "${dto.language}" already exists.`,
      );
    }

    const newId = `tpl-${Date.now()}`;
    const preview = this.generatePreview(dto.body, dto.variables || []);

    const newTemplate: WhatsAppTemplateEntity = {
      id: newId,
      tenantId: tenantId || 'demo-tenant',
      channelId: dto.channelId || '1',
      name: dto.name.toLowerCase().trim(),
      category: dto.category,
      language: dto.language,
      contentType: dto.contentType,
      header: dto.header,
      body: dto.body,
      variables: dto.variables || [],
      variableMappings: dto.variableMappings || {},
      footer: dto.footer,
      buttons: dto.buttons || [],
      catalog: dto.catalog,
      carouselCards: dto.carouselCards || [],
      status: dto.status || WhatsAppTemplateStatus.DRAFT,
      metaTemplateId:
        dto.status === WhatsAppTemplateStatus.PENDING || dto.status === WhatsAppTemplateStatus.APPROVED
          ? `meta_tpl_${Math.floor(10000000 + Math.random() * 90000000)}`
          : undefined,
      preview,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: dto.status === WhatsAppTemplateStatus.PENDING ? new Date() : undefined,
      approvedAt: dto.status === WhatsAppTemplateStatus.APPROVED ? new Date() : undefined,
    };

    store.unshift(newTemplate);
    return newTemplate;
  }

  async update(tenantId: string, id: string, dto: UpdateWhatsAppTemplateDto): Promise<WhatsAppTemplateEntity> {
    const store = this.getStore(tenantId);
    const index = store.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    const current = store[index];

    if (dto.name && dto.name !== current.name) {
      const duplicate = store.find(
        (t) =>
          t.id !== id &&
          t.name.toLowerCase() === dto.name!.toLowerCase() &&
          t.language === (dto.language || current.language),
      );
      if (duplicate) {
        throw new ConflictException(`A template with name "${dto.name}" already exists.`);
      }
    }

    const updatedBody = dto.body !== undefined ? dto.body : current.body;
    const updatedVariables = dto.variables !== undefined ? dto.variables : current.variables;
    const preview = this.generatePreview(updatedBody, updatedVariables);

    const updatedTemplate: WhatsAppTemplateEntity = {
      ...current,
      ...dto,
      name: dto.name ? dto.name.toLowerCase().trim() : current.name,
      body: updatedBody,
      variables: updatedVariables,
      preview,
      updatedAt: new Date(),
    };

    // If re-editing a rejected template and changing status to DRAFT
    if (current.status === WhatsAppTemplateStatus.REJECTED && dto.status === WhatsAppTemplateStatus.DRAFT) {
      updatedTemplate.rejectionReason = undefined;
      updatedTemplate.rejectionDetails = undefined;
    }

    store[index] = updatedTemplate;
    return updatedTemplate;
  }

  async submitForApproval(tenantId: string, id: string): Promise<WhatsAppTemplateEntity> {
    const template = await this.findById(tenantId, id);

    // Validate requirements before submission
    if (!template.body || template.body.trim().length === 0) {
      throw new BadRequestException('Cannot submit template with empty message body');
    }

    const metaTemplateId = template.metaTemplateId || `meta_tpl_${Math.floor(10000000 + Math.random() * 90000000)}`;

    const updated: WhatsAppTemplateEntity = {
      ...template,
      status: WhatsAppTemplateStatus.PENDING,
      metaTemplateId,
      submittedAt: new Date(),
      updatedAt: new Date(),
      rejectionReason: undefined,
      rejectionDetails: undefined,
    };

    const store = this.getStore(tenantId);
    const index = store.findIndex((t) => t.id === id);
    store[index] = updated;

    return updated;
  }

  async duplicate(tenantId: string, id: string): Promise<WhatsAppTemplateEntity> {
    const original = await this.findById(tenantId, id);
    const newId = `tpl-${Date.now()}`;
    const newName = `${original.name}_copy_${Math.floor(Math.random() * 1000)}`;

    const copy: WhatsAppTemplateEntity = {
      ...original,
      id: newId,
      name: newName,
      status: WhatsAppTemplateStatus.DRAFT,
      metaTemplateId: undefined,
      rejectionReason: undefined,
      rejectionDetails: undefined,
      submittedAt: undefined,
      approvedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = this.getStore(tenantId);
    store.unshift(copy);
    return copy;
  }

  async delete(tenantId: string, id: string): Promise<{ success: boolean; message: string }> {
    const store = this.getStore(tenantId);
    const index = store.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    store.splice(index, 1);
    return { success: true, message: 'Template removed successfully' };
  }

  async simulateReview(tenantId: string, id: string, dto: SimulateReviewDto): Promise<WhatsAppTemplateEntity> {
    const template = await this.findById(tenantId, id);
    const store = this.getStore(tenantId);
    const index = store.findIndex((t) => t.id === id);

    if (dto.status === WhatsAppTemplateStatus.APPROVED) {
      template.status = WhatsAppTemplateStatus.APPROVED;
      template.approvedAt = new Date();
      template.rejectionReason = undefined;
      template.rejectionDetails = undefined;
    } else if (dto.status === WhatsAppTemplateStatus.REJECTED) {
      template.status = WhatsAppTemplateStatus.REJECTED;
      template.rejectionReason = dto.rejectionReason || 'Policy violation detected in template content.';
      template.rejectionDetails = {
        code: dto.rejectionCode || 'INVALID_FORMAT_OR_POLICY_VIOLATION',
        reason: dto.rejectionReason || 'Policy violation detected in template content.',
        recommendation: dto.recommendation || 'Review Meta template guidelines and update variables or category.',
        date: new Date().toISOString(),
      };
    }

    template.updatedAt = new Date();
    store[index] = template;
    return template;
  }

  private generatePreview(body: string, variables: any[]): string {
    if (!body) return '';
    let text = body;
    if (Array.isArray(variables)) {
      variables.forEach((v) => {
        const placeholder = `{{${v.index}}}`;
        const sample = v.sampleValue || `[${v.name || 'Sample'}]`;
        text = text.replaceAll(placeholder, sample);
      });
    }
    return text;
  }

  // In-memory workspace quotas for WhatsApp Flows
  private flowQuotas = new Map<
    string,
    {
      planTier: string;
      maxPublishedFlows: number;
      publishedFlowsUsed: number;
      dynamicEndpointsUnlocked: boolean;
      dataEncryptionUnlocked: boolean;
      webhookRoutingUnlocked: boolean;
      advancedAnalyticsUnlocked: boolean;
      multiWabaUnlocked: boolean;
      redeemedKeys: string[];
    }
  >();

  private getTenantQuota(tenantId: string) {
    if (!this.flowQuotas.has(tenantId)) {
      this.flowQuotas.set(tenantId, {
        planTier: 'Starter Plan',
        maxPublishedFlows: 5,
        publishedFlowsUsed: 2,
        dynamicEndpointsUnlocked: false,
        dataEncryptionUnlocked: true,
        webhookRoutingUnlocked: true,
        advancedAnalyticsUnlocked: false,
        multiWabaUnlocked: false,
        redeemedKeys: [],
      });
    }
    return this.flowQuotas.get(tenantId)!;
  }

  async getFlowQuota(tenantId: string) {
    const q = this.getTenantQuota(tenantId);
    return {
      success: true,
      data: {
        planTier: q.planTier,
        maxPublishedFlows: q.maxPublishedFlows,
        publishedFlowsUsed: q.publishedFlowsUsed,
        availableSlots: Math.max(0, q.maxPublishedFlows - q.publishedFlowsUsed),
        percentageUsed: Math.min(100, Math.round((q.publishedFlowsUsed / q.maxPublishedFlows) * 100)),
        features: [
          {
            key: 'published_flows',
            label: `Up to ${q.maxPublishedFlows} Published Flows`,
            unlocked: true,
            description: 'Simultaneously active customer-facing mini-apps',
          },
          {
            key: 'dynamic_endpoints',
            label: 'Dynamic Data API Endpoints',
            unlocked: q.dynamicEndpointsUnlocked,
            description: 'Fetch real-time products, pricing, and slots from external backends',
          },
          {
            key: 'data_encryption',
            label: 'AES-256 Client-Side Form Encryption',
            unlocked: q.dataEncryptionUnlocked,
            description: 'End-to-end tokenized payload transit inside WhatsApp',
          },
          {
            key: 'webhook_routing',
            label: 'Automation Webhook Triggers',
            unlocked: q.webhookRoutingUnlocked,
            description: 'Trigger workflow nodes automatically upon form completion',
          },
          {
            key: 'advanced_analytics',
            label: 'Screen Drop-off & Funnel Analytics',
            unlocked: q.advancedAnalyticsUnlocked,
            description: 'Detailed per-screen drop-off metrics & conversion rates',
          },
          {
            key: 'multi_waba',
            label: 'Multi-WABA Number Routing',
            unlocked: q.multiWabaUnlocked,
            description: 'Deploy the same flow across multiple phone numbers',
          },
        ],
      },
    };
  }

  async unlockFlowQuota(tenantId: string, licenseKey: string) {
    const formattedKey = (licenseKey || '').trim().toUpperCase();

    if (!formattedKey) {
      throw new BadRequestException('License key is required.');
    }

    const q = this.getTenantQuota(tenantId);

    // Check if key was already redeemed by this tenant
    if (q.redeemedKeys.includes(formattedKey)) {
      throw new ConflictException('This license key has already been redeemed for this workspace.');
    }

    // Demo Keys Dictionary
    const KNOWN_KEYS: Record<
      string,
      {
        planTier: string;
        bonusFlows: number;
        dynamicEndpoints: boolean;
        analytics: boolean;
        multiWaba: boolean;
        status: 'active' | 'expired' | 'claimed';
      }
    > = {
      'FLOW-PRO8-2026-UNLK': {
        planTier: 'Professional Growth Plan',
        bonusFlows: 10,
        dynamicEndpoints: true,
        analytics: true,
        multiWaba: true,
        status: 'active',
      },
      'FLOW-ENT9-9921-MAX': {
        planTier: 'Enterprise Unlimited Suite',
        bonusFlows: 95,
        dynamicEndpoints: true,
        analytics: true,
        multiWaba: true,
        status: 'active',
      },
      'FLOW-EXPD-2025-0001': {
        planTier: 'Expired Promotional Key',
        bonusFlows: 5,
        dynamicEndpoints: false,
        analytics: false,
        multiWaba: false,
        status: 'expired',
      },
      'FLOW-USED-8812-CLAIM': {
        planTier: 'Claimed Single-Use Voucher',
        bonusFlows: 5,
        dynamicEndpoints: false,
        analytics: false,
        multiWaba: false,
        status: 'claimed',
      },
    };

    const keyConfig = KNOWN_KEYS[formattedKey];

    // Check pre-configured demo keys
    if (keyConfig) {
      if (keyConfig.status === 'expired') {
        throw new BadRequestException('This activation key expired on Dec 31, 2025.');
      }
      if (keyConfig.status === 'claimed') {
        throw new ConflictException('This voucher key has already been claimed by another organization.');
      }

      q.planTier = keyConfig.planTier;
      q.maxPublishedFlows += keyConfig.bonusFlows;
      q.dynamicEndpointsUnlocked = keyConfig.dynamicEndpoints || q.dynamicEndpointsUnlocked;
      q.advancedAnalyticsUnlocked = keyConfig.analytics || q.advancedAnalyticsUnlocked;
      q.multiWabaUnlocked = keyConfig.multiWaba || q.multiWabaUnlocked;
      q.redeemedKeys.push(formattedKey);

      return {
        success: true,
        message: `Successfully unlocked ${keyConfig.planTier}! +${keyConfig.bonusFlows} published flows added.`,
        data: {
          planTier: q.planTier,
          newMaxPublishedFlows: q.maxPublishedFlows,
          publishedFlowsUsed: q.publishedFlowsUsed,
          unlockedFeatures: [
            `+${keyConfig.bonusFlows} Active Published Flows`,
            'Dynamic Data API Endpoints',
            'Screen Drop-off & Funnel Analytics',
            'Multi-WABA Number Routing',
          ],
        },
      };
    }

    // Pattern validator for dynamic keys (FLOW-XXXX-XXXX-XXXX or APNX-FLOW-XXXX-XXXX)
    const validPattern = /^(FLOW|APNX-FLOW)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedKey);
    if (!validPattern) {
      throw new BadRequestException(
        'Invalid license key format. Expected format: FLOW-XXXX-XXXX-XXXX (e.g. FLOW-PRO8-2026-UNLK).',
      );
    }

    // Redeem valid custom key
    q.planTier = 'Pro Plan (Custom License)';
    q.maxPublishedFlows += 10;
    q.dynamicEndpointsUnlocked = true;
    q.advancedAnalyticsUnlocked = true;
    q.multiWabaUnlocked = true;
    q.redeemedKeys.push(formattedKey);

    return {
      success: true,
      message: `Successfully activated license key ${formattedKey}! Your workspace limit has been upgraded to ${q.maxPublishedFlows} published flows.`,
      data: {
        planTier: q.planTier,
        newMaxPublishedFlows: q.maxPublishedFlows,
        publishedFlowsUsed: q.publishedFlowsUsed,
        unlockedFeatures: [
          '+10 Active Published Flows',
          'Dynamic Data API Endpoints',
          'Screen Drop-off & Funnel Analytics',
          'Multi-WABA Channel Routing',
        ],
      },
    };
  }
}
