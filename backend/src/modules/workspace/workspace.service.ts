import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UpdateAccountSettingsDto,
  TopUpWalletDto,
  UpdateAutoRechargeDto,
} from './dto/workspace.dto';
import * as crypto from 'crypto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------- ACCOUNT SETTINGS & API KEYS -----------------

  async getAccountSettings(tenantId: string, userId: string) {
    let [tenant, user] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!tenant?.apiKey) {
      const generatedKey = `appnix_live_sk_${crypto.randomBytes(12).toString('hex')}`;
      tenant = await this.prisma.tenant.update({
        where: { id: tenantId },
        data: {
          apiKey: generatedKey,
          webhookUrl: `https://api.appnix.io/api/v1/webhooks/workspace-production`,
        },
      });
    }

    return {
      success: true,
      data: {
        personalDetails: {
          firstName: user?.name?.split(' ')[0] || 'Workspace',
          lastName: user?.name?.split(' ').slice(1).join(' ') || 'Admin',
          name: user?.name || 'Workspace Admin',
          primaryEmail: user?.email || '',
          secondaryEmail: user?.secondaryEmail || 'admin@appnix.info',
          phone: user?.phone || '+91 98765 43210',
          city: user?.city || 'Mumbai',
          state: user?.state || 'Maharashtra',
          country: user?.country || 'india',
          zipCode: user?.zipCode || '400001',
          language: user?.language || 'en',
          avatar: user?.avatar,
          role: user?.role || 'TENANT_ADMIN',
          joiningDate: user?.createdAt ? user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Mar 18th, 2026',
        },
        apiDetails: {
          apiKey: tenant?.apiKey || 'appnix_live_sk_948f29e18a209b4c810d',
          webhookUrl: tenant?.webhookUrl || 'https://api.appnix.io/api/v1/webhooks/workspace-production',
        },
        security: {
          twoFactorEnabled: user?.twoFactorEnabled || tenant?.twoFactorEnabled || false,
        },
        betaAccess: [
          {
            feature: 'Voice AI Agent Studio 2.0',
            description: 'Ultra-low latency conversational voice streaming engine',
            status: 'Active in Beta',
          },
        ],
      },
    };
  }

  async updateAccountSettings(
    tenantId: string,
    userId: string,
    dto: UpdateAccountSettingsDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.secondaryEmail && { secondaryEmail: dto.secondaryEmail }),
        ...(dto.city && { city: dto.city }),
        ...(dto.state && { state: dto.state }),
        ...(dto.country && { country: dto.country }),
        ...(dto.zipCode && { zipCode: dto.zipCode }),
        ...(dto.language && { language: dto.language }),
        ...(dto.twoFactorEnabled !== undefined && { twoFactorEnabled: dto.twoFactorEnabled }),
      },
    });

    if (dto.twoFactorEnabled !== undefined) {
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { twoFactorEnabled: dto.twoFactorEnabled },
      });
    }

    // Log in activity logs
    await this.prisma.activityLog.create({
      data: {
        tenantId,
        userId,
        user: user.name || user.email,
        action: 'Updated workspace account settings and profile',
        module: 'Workspace > Account Settings',
        status: 'Success',
      },
    });

    return {
      success: true,
      data: user,
      message: 'Account settings updated successfully',
    };
  }

  async regenerateApiKey(tenantId: string) {
    const newKey = `appnix_live_sk_${crypto.randomBytes(12).toString('hex')}`;
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { apiKey: newKey },
    });

    await this.prisma.activityLog.create({
      data: {
        tenantId,
        action: 'Regenerated production workspace API secret key',
        module: 'Workspace > API Keys',
        status: 'Warning',
      },
    });

    return {
      success: true,
      apiKey: tenant.apiKey,
      message: 'API Key regenerated successfully',
    };
  }

  // ----------------- WALLET & TRANSACTIONS -----------------

  async getWallet(tenantId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { tenantId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          tenantId,
          balance: 0.0,
          currency: 'INR',
          minThreshold: 500,
          autoRechargeEnabled: false,
          autoRechargeAmount: 5000,
          defaultPaymentMethod: 'UPI / NetBanking',
        },
      });
    }

    // Calculate real monthly spend from current month transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsageTxns = await this.prisma.walletTransaction.findMany({
      where: {
        tenantId,
        type: 'Usage',
        date: { gte: startOfMonth },
      },
    });

    const monthlySpend = monthlyUsageTxns.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const recentTransactions = await this.prisma.walletTransaction.findMany({
      where: { tenantId },
      take: 20,
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        monthlySpend: parseFloat(monthlySpend.toFixed(2)),
        autoRechargeEnabled: wallet.autoRechargeEnabled,
        minThreshold: wallet.minThreshold,
        autoRechargeAmount: wallet.autoRechargeAmount,
        defaultPaymentMethod: wallet.defaultPaymentMethod,
        transactions: recentTransactions.map((t) => ({
          id: t.transactionId,
          date: t.date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: t.type,
          description: t.description,
          channel: t.channel,
          amount: t.amount,
          status: t.status,
          closingBalance: t.closingBalance,
        })),
      },
    };
  }

  async topUpWallet(tenantId: string, dto: TopUpWalletDto) {
    if (dto.amount <= 0) {
      throw new BadRequestException('Top up amount must be greater than zero');
    }

    const transactionId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

    const result = await this.prisma.$transaction(async (tx) => {
      let wallet = await tx.wallet.findUnique({ where: { tenantId } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { tenantId, balance: 0 },
        });
      }

      const newBalance = wallet.balance + dto.amount;

      const updatedWallet = await tx.wallet.update({
        where: { tenantId },
        data: { balance: newBalance },
      });

      const txn = await tx.walletTransaction.create({
        data: {
          tenantId,
          transactionId,
          type: 'Recharge',
          description: 'Instant Wallet Top-up',
          channel: dto.paymentMethod || 'UPI / NetBanking',
          amount: dto.amount,
          status: 'Success',
          closingBalance: newBalance,
        },
      });

      return { wallet: updatedWallet, transaction: txn };
    });

    await this.prisma.activityLog.create({
      data: {
        tenantId,
        action: `Topped up wallet with ₹${dto.amount.toLocaleString()}`,
        module: 'Workspace > Wallet',
        status: 'Success',
      },
    });

    return {
      success: true,
      data: {
        balance: result.wallet.balance,
        transaction: result.transaction,
      },
      message: `Successfully topped up ₹${dto.amount.toLocaleString()} to wallet`,
    };
  }

  async debitWallet(tenantId: string, amount: number, description: string, channel = 'WhatsApp API') {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { tenantId } });
      if (!wallet || wallet.balance < amount) {
        throw new BadRequestException('Insufficient wallet balance for messaging operation');
      }

      const newBalance = wallet.balance - amount;

      await tx.wallet.update({
        where: { tenantId },
        data: { balance: newBalance },
      });

      const transactionId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
      const txn = await tx.walletTransaction.create({
        data: {
          tenantId,
          transactionId,
          type: 'Usage',
          description,
          channel,
          amount: -amount,
          status: 'Success',
          closingBalance: newBalance,
        },
      });

      return { newBalance, transaction: txn };
    });
  }

  async updateAutoRecharge(tenantId: string, dto: UpdateAutoRechargeDto) {
    const updated = await this.prisma.wallet.update({
      where: { tenantId },
      data: {
        autoRechargeEnabled: dto.autoRechargeEnabled,
        ...(dto.minThreshold && { minThreshold: dto.minThreshold }),
        ...(dto.autoRechargeAmount && { autoRechargeAmount: dto.autoRechargeAmount }),
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Auto-recharge settings updated',
    };
  }
}
