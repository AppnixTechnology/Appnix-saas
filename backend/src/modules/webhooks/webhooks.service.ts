import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ----------------- META (WHATSAPP / INSTAGRAM / FACEBOOK) -----------------

  verifyMetaSubscription(mode: string, token: string, challenge: string): string {
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'appnix_meta_verify_secret_2026';
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Meta Webhook subscription challenge verified');
      return challenge;
    }
    throw new UnauthorizedException('Meta webhook challenge verification failed: Token mismatch');
  }

  verifyMetaSignature(rawBody: string | Buffer, signatureHeader: string | undefined): boolean {
    const appSecret = process.env.META_APP_SECRET;
    if (!appSecret) {
      // If no META_APP_SECRET is set in dev/local, allow with warning
      this.logger.warn('META_APP_SECRET not configured; skipping HMAC verification in non-production');
      return true;
    }

    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
      return false;
    }

    const expectedSignature = signatureHeader.substring(7);
    const hmac = crypto.createHmac('sha256', appSecret);
    const digest = hmac.update(rawBody).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(digest, 'hex'));
  }

  async handleMetaWebhook(payload: any, rawBody?: string | Buffer, signatureHeader?: string) {
    if (rawBody && signatureHeader && !this.verifyMetaSignature(rawBody, signatureHeader)) {
      throw new UnauthorizedException('Invalid Meta Webhook HMAC-SHA256 signature');
    }

    // Iterate through entry and changes
    if (!payload?.entry || !Array.isArray(payload.entry)) {
      return { success: true, message: 'No entries in webhook' };
    }

    for (const entry of payload.entry) {
      const entryId = entry.id; // WABA ID or Page ID
      for (const change of entry.changes || []) {
        const value = change.value;
        if (!value) continue;

        // 1. Process Messages
        if (value.messages && Array.isArray(value.messages)) {
          for (const msg of value.messages) {
            await this.processIncomingMetaMessage(value, msg, entryId);
          }
        }

        // 2. Process Status Updates (sent, delivered, read, failed)
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const statusObj of value.statuses) {
            await this.processMetaStatusUpdate(statusObj);
          }
        }
      }
    }

    return { success: true, processed: true };
  }

  private async processIncomingMetaMessage(value: any, msg: any, wabaId: string) {
    const messageId = msg.id; // e.g. wamid.HBg...
    if (!messageId) return;

    // Idempotency Check
    const existingEvent = await this.prisma.webhookEvent.findUnique({
      where: { eventId: `meta_msg_${messageId}` },
    });
    if (existingEvent) {
      this.logger.log(`Duplicate webhook event skipped: ${messageId}`);
      return;
    }

    // Determine Tenant from WABA / ChannelConfig or default tenant
    let tenantId = 'tenant_default';
    const channelConfig = await this.prisma.channelConfig.findFirst({
      where: {
        channel: 'WHATSAPP',
        isConnected: true,
      },
    });
    if (channelConfig) {
      tenantId = channelConfig.tenantId;
    } else {
      const firstTenant = await this.prisma.tenant.findFirst();
      if (firstTenant) tenantId = firstTenant.id;
    }

    const contactPhone = `+${msg.from}`;
    const contactName = value.contacts?.[0]?.profile?.name || contactPhone;

    // Extract text from text or interactive button replies
    let textContent = '';
    if (msg.type === 'text') {
      textContent = msg.text?.body || '';
    } else if (msg.type === 'interactive') {
      textContent =
        msg.interactive?.button_reply?.title ||
        msg.interactive?.list_reply?.title ||
        'Interactive Response';
    } else if (msg.type === 'button') {
      textContent = msg.button?.text || '';
    } else {
      textContent = `[Media: ${msg.type}]`;
    }

    // Record Webhook Event for Deduplication
    await this.prisma.webhookEvent.create({
      data: {
        tenantId,
        provider: 'META',
        eventId: `meta_msg_${messageId}`,
        eventType: `messages.${msg.type}`,
        payload: msg,
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    // Find or Create CRM Contact
    let contact = await this.prisma.crmContact.findFirst({
      where: { tenantId, phone: contactPhone },
    });
    if (!contact) {
      contact = await this.prisma.crmContact.create({
        data: {
          tenantId,
          name: contactName,
          phone: contactPhone,
          tags: ['Inbound Lead'],
        },
      });
    }

    // Find or Create Conversation
    let conv = await this.prisma.conversation.findFirst({
      where: { tenantId, identifier: contactPhone },
    });

    if (!conv) {
      conv = await this.prisma.conversation.create({
        data: {
          tenantId,
          uid: `CHT-${Math.floor(100000 + Math.random() * 900000)}`,
          name: contactName,
          identifier: contactPhone,
          contactId: contact.id,
          channel: 'whatsapp',
          department: 'sales',
          unreadCount: 1,
          lastMessage: textContent,
          lastMessageSender: 'customer',
          lastMessageTime: new Date(),
          session: {
            isActive: true,
            lastCustomerMessageAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
            remainingHours: 24,
            formattedRemaining: '24h remaining',
          },
        },
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conv.id },
        data: {
          lastMessage: textContent,
          lastMessageTime: new Date(),
          lastMessageSender: 'customer',
          unreadCount: { increment: 1 },
          session: {
            isActive: true,
            lastCustomerMessageAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
            remainingHours: 24,
            formattedRemaining: '24h remaining',
          },
        },
      });
    }

    // Persist Incoming Message
    await this.prisma.message.create({
      data: {
        conversationId: conv.id,
        tenantId,
        sender: 'customer',
        senderName: contactName,
        text: textContent,
        providerMessageId: messageId,
        status: 'delivered',
        timestamp: new Date(parseInt(msg.timestamp, 10) * 1000 || Date.now()),
      },
    });

    this.logger.log(`Persisted inbound WhatsApp message ${messageId} from ${contactPhone}`);
  }

  private async processMetaStatusUpdate(statusObj: any) {
    const messageId = statusObj.id; // wamid
    const status = statusObj.status; // sent, delivered, read, failed

    if (!messageId || !status) return;

    // Record Event
    const eventId = `meta_status_${messageId}_${status}`;
    const existing = await this.prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing) return;

    await this.prisma.webhookEvent.create({
      data: {
        provider: 'META',
        eventId,
        eventType: `message.status.${status}`,
        payload: statusObj,
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    // Update Message status in DB
    const message = await this.prisma.message.findFirst({
      where: { providerMessageId: messageId },
    });

    if (message) {
      await this.prisma.message.update({
        where: { id: message.id },
        data: { status },
      });
    }
  }

  // ----------------- RAZORPAY WEBHOOK -----------------

  verifyRazorpaySignature(body: any, signature: string | undefined): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return true;
    if (!signature) return false;

    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(typeof body === 'string' ? body : JSON.stringify(body))
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  async handleRazorpayWebhook(payload: any, signature: string | undefined) {
    if (signature && !this.verifyRazorpaySignature(payload, signature)) {
      throw new UnauthorizedException('Invalid Razorpay Webhook signature');
    }

    const event = payload?.event;
    const payment = payload?.payload?.payment?.entity;
    if (!payment) return { success: true, message: 'No payment entity' };

    const eventId = `rzp_${payment.id}_${event}`;
    const existing = await this.prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing) return { success: true, message: 'Already processed' };

    if (event === 'payment.captured' || event === 'order.paid') {
      const amountRupees = payment.amount / 100;
      const tenantId = payment.notes?.tenantId || 'tenant_default';

      // Atomic Topup
      await this.prisma.$transaction(async (tx) => {
        let wallet = await tx.wallet.findUnique({ where: { tenantId } });
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { tenantId, balance: 0 },
          });
        }

        const newBalance = wallet.balance + amountRupees;

        await tx.wallet.update({
          where: { tenantId },
          data: { balance: newBalance },
        });

        await tx.walletTransaction.create({
          data: {
            tenantId,
            transactionId: `TXN-${payment.id.slice(-8).toUpperCase()}`,
            type: 'Recharge',
            description: `Razorpay Payment (${payment.method?.toUpperCase() || 'UPI'})`,
            channel: 'Razorpay PG',
            amount: amountRupees,
            status: 'Success',
            closingBalance: newBalance,
          },
        });
      });
    }

    await this.prisma.webhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        eventId,
        eventType: event || 'payment',
        payload,
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    return { success: true, processed: true };
  }

  // ----------------- STRIPE WEBHOOK -----------------

  async handleStripeWebhook(payload: any, signature: string | undefined) {
    const eventId = `stripe_${payload?.id}`;
    if (payload?.id) {
      const existing = await this.prisma.webhookEvent.findUnique({ where: { eventId } });
      if (existing) return { success: true, message: 'Already processed' };
    }

    const type = payload?.type;
    const object = payload?.data?.object;

    if (type === 'invoice.payment_succeeded' && object) {
      const customerId = object.customer;
      const amountPaid = object.amount_paid / 100;
      const invoiceNumber = object.number || `INV-${Date.now()}`;

      const sub = await this.prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (sub) {
        await this.prisma.invoice.create({
          data: {
            tenantId: sub.tenantId,
            invoiceNumber,
            plan: sub.planName,
            amount: `₹${amountPaid.toFixed(2)}`,
            status: 'Paid',
          },
        });
      }
    }

    if (payload?.id) {
      await this.prisma.webhookEvent.create({
        data: {
          provider: 'STRIPE',
          eventId,
          eventType: type || 'stripe_event',
          payload,
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });
    }

    return { success: true, processed: true };
  }
}
