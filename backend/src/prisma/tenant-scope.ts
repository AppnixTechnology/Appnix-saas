import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SessionContext } from '../lib/auth/session-context';

/** Models with a first-class tenant column. Keep this allow-list explicit so
 * global/platform models (plans, workflow templates, webhook dedupe records)
 * are never accidentally treated as tenant records. */
export const TENANT_SCOPED_MODELS = new Set([
  'user', 'subscription', 'invoice', 'wallet', 'walletTransaction',
  'channelTransaction', 'crmContact', 'superField', 'contactTag',
  'conversation', 'message', 'campaign', 'campaignAudience', 'channelConfig',
  'metaTemplate', 'rcsTemplate', 'folder', 'workflow', 'dataStore',
  'appCredential', 'department', 'rolePermission', 'supportTicket',
  'activityLog', 'notification', 'bot', 'media',
  'paymentOrder',
]);

export function tenantFieldForModel(model: string): 'tenantId' | 'workspaceId' {
  return model === 'paymentOrder' ? 'workspaceId' : 'tenantId';
}

/**
 * Use this in reusable data-access helpers when composing arbitrary filters.
 * It deliberately overwrites a caller-provided tenantId rather than merging it,
 * preventing request bodies and query strings from changing the data boundary.
 */
export function tenantWhere<T extends Record<string, unknown>>(
  context: SessionContext,
  where: T = {} as T,
): T & { tenantId: string } {
  const { tenantId: _untrustedTenantId, ...safeWhere } = where;
  return { ...safeWhere, tenantId: context.tenantId } as T & { tenantId: string };
}

/**
 * Enforces IDOR-safe single resource ownership before an update/delete that
 * uses Prisma's unique `id` selector. A missing or foreign ID has the same 404
 * result, so callers cannot enumerate another tenant's resources.
 */
export async function requireTenantRecord<T>(
  delegate: { findFirst(args: { where: Prisma.InputJsonValue | Record<string, unknown> }): Promise<T | null> },
  context: SessionContext,
  id: string,
  message = 'Resource not found',
): Promise<T> {
  const record = await delegate.findFirst({ where: { id, tenantId: context.tenantId } });
  if (!record) throw new NotFoundException(message);
  return record;
}

export function assertTenantWrite(context: SessionContext, requestedTenantId?: string): string {
  if (requestedTenantId && requestedTenantId !== context.tenantId) {
    throw new ForbiddenException('The tenant boundary is derived from the authenticated session');
  }
  return context.tenantId;
}
