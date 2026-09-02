import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller(['billing', 'workspace/billing'])
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription tiers and feature list' })
  getPlans() {
    return this.billingService.getPlans();
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get active workspace subscription, cycle status, and quotas' })
  getSubscription(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.billingService.getSubscription(tenantId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get tax invoice receipts history' })
  getInvoices(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.billingService.getInvoices(tenantId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Upgrade or change subscription plan tier' })
  checkout(
    @CurrentUser() user: AuthUser,
    @Body('planId') planId: string,
  ) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.billingService.upgradePlan(tenantId, planId || 'pro');
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel current active subscription' })
  cancel(@CurrentUser() user: AuthUser) {
    const tenantId = user?.tenantId || 'tenant_default';
    return this.billingService.cancelSubscription(tenantId);
  }
}
