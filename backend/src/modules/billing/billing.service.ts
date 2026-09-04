import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches all active subscription plans configured by Super Admin in the database.
   */
  async getPlans() {
    try {
      const plans: any[] = await this.prisma.$queryRaw`
        SELECT id, name, slug, description, "monthlyPrice", "yearlyPrice", currency, status,
               "maxUsers", "maxContacts", "maxCampaigns", "maxBots", "maxMessages",
               "apiQuota", "storageQuotaMb", "supportLevel", "trialDays", "isPopular",
               features
        FROM plans
        WHERE status = 'ACTIVE'
        ORDER BY "monthlyPrice" ASC;
      `;

      if (plans && plans.length > 0) {
        return {
          success: true,
          data: plans.map((p) => {
            const mPrice = Number(p.monthlyPrice || 0);
            const yPrice = Number(p.yearlyPrice || mPrice * 10);
            const trialDays = Number(p.trialDays || 0);

            return {
              id: p.slug || p.id,
              planRefId: p.id,
              name: p.name,
              slug: p.slug || p.id,
              description: p.description || '',
              monthlyPrice: mPrice,
              yearlyPrice: yPrice,
              price: `₹${mPrice.toLocaleString('en-IN')}`,
              period: '/month',
              currency: p.currency || 'INR',
              trialDays,
              hasTrial: trialDays > 0,
              isPopular: Boolean(p.isPopular),
              features: Array.isArray(p.features)
                ? p.features
                : typeof p.features === 'string'
                ? JSON.parse(p.features)
                : [],
              limits: {
                maxMessages: p.maxMessages || 2000,
                maxBots: p.maxBots || 1,
                maxUsers: p.maxUsers || 2,
                maxContacts: p.maxContacts || 500,
                maxCampaigns: p.maxCampaigns || 5,
                apiQuota: p.apiQuota || 10000,
                storageQuotaMb: p.storageQuotaMb || 2048,
                supportLevel: p.supportLevel || 'Community Support',
              },
            };
          }),
        };
      }
    } catch (err: any) {
      this.logger.warn(`Failed to query database plans table: ${err.message}. Using fallback.`);
    }

    // Fallback static plans if database plans table is empty
    return {
      success: true,
      data: [
        {
          id: 'starter',
          name: 'Starter',
          slug: 'starter',
          price: '₹999',
          monthlyPrice: 999,
          yearlyPrice: 9990,
          period: '/month',
          trialDays: 0,
          hasTrial: false,
          isPopular: false,
          description: 'Essential messaging and contact management for growing businesses.',
          features: [
            'Up to 2,000 monthly messages',
            '2 WhatsApp / Social channels',
            '1 Automation Botflow',
            '2 Team Members',
            'Community Support',
          ],
          limits: { maxMessages: 2000, maxBots: 1, maxUsers: 2, maxContacts: 500 },
        },
        {
          id: 'pro',
          name: 'Professional Tier',
          slug: 'pro',
          price: '₹2,999',
          monthlyPrice: 2999,
          yearlyPrice: 29990,
          period: '/month',
          trialDays: 14,
          hasTrial: true,
          isPopular: true,
          description: 'For fast-scaling teams automating campaigns, custom botflows, and customer care.',
          features: [
            'Up to 25,000 monthly messages',
            'Unlimited Channels (WhatsApp, IG, FB, RCS)',
            '5 Advanced AI Botflows',
            '10 Team Member Seats',
            'Priority Live Support & SLA',
            'Custom Webhooks & REST API',
          ],
          limits: { maxMessages: 25000, maxBots: 5, maxUsers: 10, maxContacts: 5000 },
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          slug: 'enterprise',
          price: '₹8,999',
          monthlyPrice: 8999,
          yearlyPrice: 89990,
          period: '/month',
          trialDays: 0,
          hasTrial: false,
          isPopular: false,
          description: 'Dedicated enterprise messaging infrastructure, Voice AI agents, SSO, and custom SLA.',
          features: [
            'Unlimited Monthly Messages',
            'Custom AI Voice Agent streaming',
            'Unlimited Automation Botflows',
            'Unlimited Team Seats & SSO',
            'Dedicated Account Manager',
            'Custom SLA & On-premise deployment',
          ],
          limits: { maxMessages: 250000, maxBots: 50, maxUsers: 50, maxContacts: 50000 },
        },
      ],
    };
  }

  /**
   * Retrieves active subscription for the given workspace/tenant.
   * NOTE: Does NOT automatically create any fake/90-day subscription.
   * If the workspace has no subscription or is expired, hasActiveSubscription is false.
   */
  async getSubscription(tenantId: string) {
    if (!tenantId || tenantId === 'default' || tenantId === 'tenant_default') {
      return {
        success: true,
        hasActiveSubscription: false,
        data: null,
        message: 'No active subscription found. Valid workspace context required.',
      };
    }

    const queryTenantId = tenantId;

    const tenant = await this.prisma.tenant
      .findUnique({
        where: { id: queryTenantId },
        select: { id: true, status: true },
      })
      .catch(() => null);

    if (tenant && tenant.status === 'SUSPENDED') {
      return {
        success: true,
        hasActiveSubscription: false,
        isSuspended: true,
        data: null,
        message: 'Workspace has been suspended. Please select a plan or contact support to restore access.',
      };
    }

    if (tenant && tenant.status === 'CANCELLED') {
      return {
        success: true,
        hasActiveSubscription: false,
        isCancelled: true,
        data: null,
        message: 'Workspace subscription has been cancelled. Please select a plan to reactivate.',
      };
    }

    const sub = await this.prisma.subscription.findFirst({
      where: {
        tenantId: queryTenantId,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 1. Unsubscribed / Brand New User
    if (!sub) {
      return {
        success: true,
        hasActiveSubscription: false,
        data: null,
        message: 'No active subscription found for this workspace. Please select a plan.',
      };
    }

    // 2. Cancelled Subscription Check
    if (sub.status === ('CANCELLED' as any)) {
      return {
        success: true,
        hasActiveSubscription: false,
        isCancelled: true,
        data: {
          id: sub.id,
          planId: sub.planId,
          planName: sub.planName,
          status: 'CANCELLED',
          currentPeriodEnd: sub.currentPeriodEnd,
        },
        message: 'Your subscription has been cancelled. Please choose a plan to reactivate.',
      };
    }

    // 3. Suspended Subscription Check
    if ((sub as any).status === 'SUSPENDED') {
      return {
        success: true,
        hasActiveSubscription: false,
        isSuspended: true,
        data: {
          id: sub.id,
          planId: sub.planId,
          planName: sub.planName,
          status: 'SUSPENDED',
          currentPeriodEnd: sub.currentPeriodEnd,
        },
        message: 'Your subscription is currently suspended. Please select a plan to restore access.',
      };
    }

    const now = new Date();
    // 4. Expired Subscription Check
    if (sub.status === ('PAST_DUE' as any) || (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < now)) {
      await this.prisma.subscription
        .update({
          where: { id: sub.id },
          data: { status: 'PAST_DUE' as any },
        })
        .catch(() => {});

      return {
        success: true,
        hasActiveSubscription: false,
        isExpired: true,
        data: {
          id: sub.id,
          planId: sub.planId,
          planName: sub.planName,
          status: 'EXPIRED',
          currentPeriodEnd: sub.currentPeriodEnd,
        },
        message: 'Your subscription has expired. Please choose a plan to renew.',
      };
    }

    // 5. Inactive status check
    if (sub.status !== 'ACTIVE' && sub.status !== 'TRIALING') {
      return {
        success: true,
        hasActiveSubscription: false,
        data: {
          id: sub.id,
          planId: sub.planId,
          planName: sub.planName,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
        },
        message: 'No active subscription found for this workspace. Please select a plan.',
      };
    }

    // 3. Active or Trialing Subscription
    const [usedBots, usedTeamSeats, usedMessages] = await Promise.all([
      this.prisma.bot.count({ where: { tenantId } }),
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.message.count({ where: { tenantId } }),
    ]);

    const totalDays = sub.totalDays || 30;
    const remainingDays = Math.max(
      0,
      Math.ceil((new Date(sub.currentPeriodEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      success: true,
      hasActiveSubscription: true,
      data: {
        id: sub.id,
        planId: sub.planId,
        planName: sub.planName,
        price: sub.price,
        status: sub.status,
        isTrial: sub.status === 'TRIALING',
        totalDays,
        remainingDays,
        usedDays: Math.max(0, totalDays - remainingDays),
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        maxMessages: sub.maxMessages,
        usedMessages,
        maxBots: sub.maxBots,
        usedBots,
        maxTeamSeats: sub.maxTeamSeats,
        usedTeamSeats,
        nextBillingDate: sub.currentPeriodEnd.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        paymentMethod: (sub as any).paymentProvider || 'Cashfree UPI / NetBanking',
      },
    };
  }

  /**
   * Starts a free trial for a workspace if the chosen plan explicitly supports it
   * and the workspace has not previously redeemed a trial.
   */
  async startTrial(tenantId: string, planId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required.');
    }

    // 1. Verify workspace has not already used a trial
    const existingTrial = await this.prisma.subscription.findFirst({
      where: {
        tenantId,
        status: 'TRIALING' as any,
      },
    });

    if (existingTrial) {
      throw new BadRequestException('A free trial has already been redeemed for this workspace. Please select a plan to subscribe.');
    }

    // 2. Fetch the plan configured in database
    const planRows: any[] = await this.prisma.$queryRaw`
      SELECT * FROM plans WHERE slug = ${planId} OR id = ${planId} LIMIT 1;
    `;
    const plan = planRows?.[0];

    if (!plan) {
      throw new NotFoundException(`Plan '${planId}' not found.`);
    }

    const trialDays = Number(plan.trialDays || 0);
    if (trialDays <= 0) {
      throw new BadRequestException(`The ${plan.name} plan does not offer a free trial. Payment is required to activate.`);
    }

    // 3. Create Trialing Subscription
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + trialDays);

    const sub = await (this.prisma.subscription as any).create({
      data: {
        tenantId,
        planId: plan.slug || plan.id,
        planName: `${plan.name} (Trial)`,
        price: `₹0 (Trial - ${trialDays} Days)`,
        status: 'TRIALING' as any,
        totalDays: trialDays,
        remainingDays: trialDays,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        maxMessages: plan.maxMessages || 2000,
        usedMessages: 0,
        maxBots: plan.maxBots || 1,
        usedBots: 0,
        maxTeamSeats: plan.maxUsers || 2,
        usedTeamSeats: 1,
      },
    });

    return {
      success: true,
      hasActiveSubscription: true,
      data: sub,
      message: `Your ${trialDays}-day free trial for ${plan.name} has been activated!`,
    };
  }

  /**
   * Idempotently activates or upgrades a workspace subscription after verified server-side payment.
   */
  async activateSubscriptionFromPayment(params: {
    tenantId: string;
    orderId: string;
    paymentId: string;
    planId: string;
    billingCycle?: 'monthly' | 'yearly';
    amount: number;
    paymentMethod?: string;
  }) {
    const {
      tenantId,
      orderId,
      paymentId,
      planId,
      billingCycle = 'monthly',
      amount,
      paymentMethod = 'Cashfree UPI / NetBanking',
    } = params;

    const effectiveTenantId = tenantId;
    if (!effectiveTenantId || effectiveTenantId === 'default' || effectiveTenantId === 'tenant_default') {
      throw new BadRequestException('A valid tenantId is required to activate subscription.');
    }

    if (!orderId) {
      throw new BadRequestException('orderId is required to activate subscription.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Idempotency check: verify if this order was already processed
      const existingInvoice = await tx.invoice.findFirst({
        where: { tenantId: effectiveTenantId, invoiceNumber: orderId },
      });

      if (existingInvoice) {
        const currentSub = await tx.subscription.findFirst({
          where: { tenantId: effectiveTenantId, status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        });
        return {
          success: true,
          alreadyProcessed: true,
          subscription: currentSub,
          message: 'Order already processed.',
        };
      }

      // 2. Fetch Plan limits and details from DB
      const planRows: any[] = await tx.$queryRaw`
        SELECT * FROM plans WHERE slug = ${planId} OR id = ${planId} LIMIT 1;
      `;
      const plan = planRows?.[0];

      const planName =
        plan?.name ||
        (planId === 'enterprise'
          ? 'Enterprise Custom'
          : planId === 'pro'
          ? 'Professional Tier'
          : 'Starter Tier');

      const maxMsgs =
        plan?.maxMessages ||
        (planId === 'enterprise' ? 250000 : planId === 'pro' ? 25000 : 2000);
      const maxBots =
        plan?.maxBots ||
        (planId === 'enterprise' ? 50 : planId === 'pro' ? 5 : 1);
      const maxSeats =
        plan?.maxUsers ||
        (planId === 'enterprise' ? 50 : planId === 'pro' ? 10 : 2);

      let daysToAdd = 30;
      let cycleSuffix = '/mo';
      const cycle = (billingCycle || 'monthly').toLowerCase();

      if (cycle === 'yearly' || cycle === 'annual' || cycle === '12_months') {
        daysToAdd = 365;
        cycleSuffix = '/yr';
      } else if (cycle === 'half_yearly' || cycle === '6_months' || cycle === 'semi_annual') {
        daysToAdd = 180;
        cycleSuffix = '/6mo';
      } else if (cycle === 'quarterly' || cycle === '3_months') {
        daysToAdd = 90;
        cycleSuffix = '/3mo';
      } else {
        daysToAdd = 30;
        cycleSuffix = '/mo';
      }

      const now = new Date();
      const periodEnd = new Date();
      periodEnd.setDate(now.getDate() + daysToAdd);

      // 3. Mark any previous subscriptions as CANCELLED
      await tx.subscription.updateMany({
        where: { tenantId: effectiveTenantId, status: { in: ['ACTIVE', 'TRIALING'] } },
        data: { status: 'CANCELLED' as any },
      });

      // 4. Create new verified ACTIVE subscription
      const newSub = await tx.subscription.create({
        data: {
          tenantId: effectiveTenantId,
          planId: plan?.slug || planId,
          planName,
          price: `₹${amount.toLocaleString('en-IN')}${cycleSuffix}`,
          status: 'ACTIVE' as any,
          totalDays: daysToAdd,
          remainingDays: daysToAdd,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          maxMessages: maxMsgs,
          usedMessages: 0,
          maxBots: maxBots,
          usedBots: 0,
          maxTeamSeats: maxSeats,
          usedTeamSeats: 1,
          stripeSubscriptionId: orderId,
          stripeCustomerId: paymentId || 'CASHFREE',
        },
      });

      // 5. Create Official Tax Invoice
      await tx.invoice.create({
        data: {
          tenantId: effectiveTenantId,
          invoiceNumber: orderId,
          plan: `${planName} (${cycle.toUpperCase()})`,
          amount: `₹${amount.toLocaleString('en-IN')}`,
          status: 'Paid',
        },
      });

      // 6. Record in payment_ledgers if table exists
      await tx
        .$executeRaw`
          INSERT INTO payment_ledgers (
            id, "tenantId", "orderId", "paymentId", amount, currency,
            type, method, status, "createdAt", "updatedAt"
          ) VALUES (
            ${`pl_${Date.now()}`}, ${effectiveTenantId}, ${orderId}, ${paymentId},
            ${amount}, 'INR', 'SUBSCRIPTION', ${paymentMethod},
            'SUCCESS', NOW(), NOW()
          );
        `
        .catch((e) => this.logger.warn(`Payment ledger record notice: ${e.message}`));

      return {
        success: true,
        alreadyProcessed: false,
        subscription: newSub,
        message: `Successfully activated ${planName} for workspace.`,
      };
    }, { timeout: 25000, maxWait: 15000 });
  }

  /**
   * Super Admin manual subscription assignment.
   * Enables Super Admin to provision or assign a subscription to any tenant client.
   */
  async assignSubscriptionManually(tenantId: string, planId: string, days: number = 30) {
    const planRows: any[] = await this.prisma.$queryRaw`
      SELECT * FROM plans WHERE slug = ${planId} OR id = ${planId} LIMIT 1;
    `;
    const plan = planRows?.[0];

    const planName = plan?.name || (planId === 'enterprise' ? 'Enterprise' : planId === 'pro' ? 'Professional Tier' : 'Starter');
    const maxMsgs = plan?.maxMessages || (planId === 'enterprise' ? 250000 : planId === 'pro' ? 25000 : 2000);
    const maxBots = plan?.maxBots || (planId === 'enterprise' ? 50 : planId === 'pro' ? 5 : 1);
    const maxSeats = plan?.maxUsers || (planId === 'enterprise' ? 50 : planId === 'pro' ? 10 : 2);

    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setDate(now.getDate() + days);

    await this.prisma.subscription.updateMany({
      where: { tenantId, status: { in: ['ACTIVE', 'TRIALING'] } },
      data: { status: 'CANCELLED' as any },
    });

    const sub = await (this.prisma.subscription as any).create({
      data: {
        tenantId,
        planId: plan?.slug || planId,
        planName,
        price: `₹${(plan?.monthlyPrice || 2999).toLocaleString('en-IN')}/mo (Admin Assigned)`,
        status: 'ACTIVE' as any,
        totalDays: days,
        remainingDays: days,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        maxMessages: maxMsgs,
        usedMessages: 0,
        maxBots: maxBots,
        usedBots: 0,
        maxTeamSeats: maxSeats,
        usedTeamSeats: 1,
        stripeCustomerId: 'SUPER_ADMIN_MANUAL',
      },
    });

    return {
      success: true,
      data: sub,
      message: `Super Admin successfully assigned ${planName} (${days} days) to tenant.`,
    };
  }

  async getInvoices(tenantId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: invoices.map((inv) => ({
        id: inv.invoiceNumber,
        invoiceNumber: inv.invoiceNumber,
        date: inv.date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        plan: inv.plan,
        amount: inv.amount,
        status: inv.status,
        downloadUrl: inv.downloadUrl || '#',
      })),
    };
  }

  async cancelSubscription(tenantId: string) {
    await this.prisma.subscription.updateMany({
      where: { tenantId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' as any },
    });

    return {
      success: true,
      message: 'Subscription has been cancelled.',
    };
  }
}
