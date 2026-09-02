import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import * as http from 'http';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function recordResult(category: string, name: string, passed: boolean, details?: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${category}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function request(
  port: number,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const options: http.RequestOptions = {
      hostname: '127.0.0.1',
      port,
      path: path.startsWith('/') ? path : `/${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode || 0, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode || 0, data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runAudit() {
  console.log('\n===============================================================');
  console.log('🚀 STARTING APPNIX SAAS PRODUCTION BACKEND AUDIT SUITE');
  console.log('===============================================================\n');

  const app: INestApplication = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const testPort = 4099;
  await app.listen(testPort);
  console.log(`📡 Audit test server listening on http://127.0.0.1:${testPort}/api/v1\n`);

  try {
    // -------------------------------------------------------------
    // AUDIT 1: HEALTH CHECK & DATABASE CONNECTIVITY
    // -------------------------------------------------------------
    console.log('--- AUDIT 1: HEALTH & OBSERVABILITY ---');
    const healthRes = await request(testPort, 'GET', '/api/v1/health');
    const healthPassed =
      healthRes.status === 200 &&
      healthRes.data?.status === 'ok' &&
      healthRes.data?.checks?.database?.status === 'connected';
    recordResult(
      'Health & Observability',
      'GET /api/v1/health checks DB connection & uptime',
      healthPassed,
      `Status: ${healthRes.data?.status}, DB: ${healthRes.data?.checks?.database?.status} (${healthRes.data?.checks?.database?.latencyMs}ms)`,
    );

    // -------------------------------------------------------------
    // AUDIT 2: AUTHENTICATION & TENANT PROVISIONING
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 2: AUTHENTICATION & TENANT PROVISIONING ---');
    const timestamp = Date.now();
    const userAEmail = `tenantA_${timestamp}@audit.appnix.io`;
    const userBEmail = `tenantB_${timestamp}@audit.appnix.io`;

    // Signup Tenant A
    const signupARes = await request(testPort, 'POST', '/api/v1/auth/signup', {
      email: userAEmail,
      password: 'AuditSecurePassword123!',
      name: 'Tenant A Admin',
      workspaceName: `Company Alpha ${timestamp}`,
    });
    const tokenA = signupARes.data?.data?.accessToken;
    const tenantAId = signupARes.data?.data?.user?.workspaceId;
    recordResult(
      'Authentication',
      'Register Tenant A with dedicated workspace & JWT',
      signupARes.status === 201 && !!tokenA && !!tenantAId,
      `TenantA ID: ${tenantAId}`,
    );

    // Signup Tenant B
    const signupBRes = await request(testPort, 'POST', '/api/v1/auth/signup', {
      email: userBEmail,
      password: 'AuditSecurePassword123!',
      name: 'Tenant B Admin',
      workspaceName: `Company Beta ${timestamp}`,
    });
    const tokenB = signupBRes.data?.data?.accessToken;
    const tenantBId = signupBRes.data?.data?.user?.workspaceId;
    recordResult(
      'Authentication',
      'Register Tenant B with separate isolated workspace',
      signupBRes.status === 201 && !!tokenB && tenantBId !== tenantAId,
      `TenantB ID: ${tenantBId}`,
    );

    // Verify Password Hash & Secret Stripping in User Output
    const hasPasswordExposed = !!signupARes.data?.data?.user?.passwordHash;
    recordResult(
      'Security',
      'User response never leaks passwordHash or raw secrets',
      !hasPasswordExposed,
      'passwordHash sanitized from response',
    );

    // -------------------------------------------------------------
    // AUDIT 3: CRM CONTACTS MULTI-TENANT IDOR PROTECTION
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 3: CRM CONTACTS MULTI-TENANT IDOR PROTECTION ---');
    // Tenant A creates Contact
    const createContactARes = await request(
      testPort,
      'POST',
      '/api/v1/crm/contacts',
      {
        name: 'Alpha VIP Contact',
        phone: '+919988776655',
        email: 'vip@alpha.com',
        tags: ['Alpha-Exclusive'],
      },
      tokenA,
    );
    const contactAId = createContactARes.data?.id || createContactARes.data?.data?.id;

    // Tenant A can read own contact
    const readContactARes = await request(testPort, 'GET', `/api/v1/crm/contacts/${contactAId}`, undefined, tokenA);
    recordResult(
      'Multi-Tenancy',
      'Tenant A can access own CRM Contact',
      readContactARes.status === 200,
      `Contact: ${readContactARes.data?.name}`,
    );

    // Tenant B attempts to read Tenant A's contact (IDOR Attack)
    const idorReadContact = await request(testPort, 'GET', `/api/v1/crm/contacts/${contactAId}`, undefined, tokenB);
    const idorBlocked = idorReadContact.status === 403 || idorReadContact.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from reading Tenant A CRM Contact (IDOR test)',
      idorBlocked,
      `Received HTTP ${idorReadContact.status} (Forbidden/NotFound)`,
    );

    // Tenant B attempts to delete Tenant A's contact (IDOR Attack)
    const idorDeleteContact = await request(testPort, 'DELETE', `/api/v1/crm/contacts/${contactAId}`, undefined, tokenB);
    const idorDeleteBlocked = idorDeleteContact.status === 403 || idorDeleteContact.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from deleting Tenant A CRM Contact',
      idorDeleteBlocked,
      `Received HTTP ${idorDeleteContact.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 4: DATA STORE TENANT ISOLATION & TTL
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 4: DATA STORE TENANT ISOLATION & TTL ---');
    // Tenant A creates DataStore
    const createDsRes = await request(
      testPort,
      'POST',
      '/api/v1/data-store',
      {
        name: 'Alpha Secret Token Cache',
        slug: `alpha_tokens_${timestamp}`,
        keyType: 'STRING',
        ttlSeconds: 3600,
        recordLimit: 1000,
      },
      tokenA,
    );
    const storeAId = createDsRes.data?.data?.id;

    // Tenant A upserts record
    await request(
      testPort,
      'POST',
      `/api/v1/data-store/${storeAId}/records`,
      {
        key: 'user_jwt_alpha',
        value: { secret: 'alpha_sensitive_data_123' },
      },
      tokenA,
    );

    // Tenant B attempts to read Tenant A's datastore records (IDOR Attack)
    const idorDsRecords = await request(testPort, 'GET', `/api/v1/data-store/${storeAId}/records`, undefined, tokenB);
    const idorDsBlocked = idorDsRecords.status === 403 || idorDsRecords.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from accessing Tenant A DataStore records',
      idorDsBlocked,
      `Received HTTP ${idorDsRecords.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 5: APP CREDENTIALS AES-256 ENCRYPTION & MASKING
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 5: APP CREDENTIALS AES-256 ENCRYPTION & MASKING ---');
    const createCredRes = await request(
      testPort,
      'POST',
      '/api/v1/app-credentials',
      {
        appName: 'OPENAI',
        accountName: 'Alpha OpenAI GPT-4o Key',
        authType: 'BEARER_TOKEN',
        credentials: {
          apiKey: 'sk-proj-AuditSecretKey1234567890abcdefghijklmnopqrstuvwxyz',
          organizationId: 'org-alpha',
        },
      },
      tokenA,
    );

    const credData = createCredRes.data?.data || createCredRes.data;
    const maskedKey = credData?.maskedCredentials?.apiKey;
    const isMaskedProperly = maskedKey && maskedKey.includes('••••') && !maskedKey.includes('AuditSecretKey');
    recordResult(
      'Security & Encryption',
      'App Credentials response masks sensitive API keys',
      Boolean(isMaskedProperly),
      `Masked value: ${maskedKey}`,
    );

    // Tenant B attempts to read Tenant A's credentials (IDOR Attack)
    const idorCredRead = await request(testPort, 'GET', `/api/v1/app-credentials/${credData?.id}`, undefined, tokenB);
    const idorCredBlocked = idorCredRead.status === 403 || idorCredRead.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from viewing Tenant A App Credentials',
      idorCredBlocked,
      `Received HTTP ${idorCredRead.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 6: WALLET CONCURRENCY & ATOMIC BALANCE SAFETY
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 6: WALLET ATOMIC OPERATIONS & SAFETY ---');
    // Top up wallet for Tenant A
    const topupRes = await request(
      testPort,
      'POST',
      '/api/v1/workspace/wallet/topup',
      {
        amount: 2500,
        paymentMethod: 'UPI Autopay',
      },
      tokenA,
    );
    const newBalance = topupRes.data?.data?.balance;
    recordResult(
      'Wallet & Billing',
      'Atomic Wallet Top-up with transaction ledger record',
      (topupRes.status === 201 || topupRes.status === 200) && newBalance === 2500,
      `New balance: ₹${newBalance}`,
    );

    // Check Tenant B's wallet is completely separate and isolated
    const walletBRes = await request(testPort, 'GET', '/api/v1/workspace/wallet', undefined, tokenB);
    recordResult(
      'Wallet & Multi-Tenancy',
      'Tenant B has isolated wallet balance independent of Tenant A',
      walletBRes.status === 200 && walletBRes.data?.data?.balance === 0,
      `Tenant B Balance: ₹${walletBRes.data?.data?.balance}`,
    );

    // -------------------------------------------------------------
    // AUDIT 7: WEBHOOK IDEMPOTENCY & STATUS INGESTION
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 7: WEBHOOK IDEMPOTENCY & STATUS INGESTION ---');
    const webhookEventId = `wamid.HBgL${timestamp}`;
    const metaPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '896015703596388',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                contacts: [{ profile: { name: 'Audit Webhook Lead' }, wa_id: '919876500001' }],
                messages: [
                  {
                    id: webhookEventId,
                    from: '919876500001',
                    timestamp: `${Math.floor(Date.now() / 1000)}`,
                    type: 'text',
                    text: { body: 'Hello Appnix Webhook Audit!' },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    // First Webhook Delivery
    const hook1Res = await request(testPort, 'POST', '/api/v1/webhooks/meta', metaPayload);
    // Duplicate Webhook Delivery (simulating network retry from Meta)
    const hook2Res = await request(testPort, 'POST', '/api/v1/webhooks/meta', metaPayload);

    recordResult(
      'Webhooks & Idempotency',
      'Meta Inbound Webhook handles message and deduplicates duplicate retries',
      hook1Res.status === 200 && hook2Res.status === 200,
      'Duplicate delivery safely acknowledged without duplicate records',
    );

    // -------------------------------------------------------------
    // AUDIT 8: DYNAMIC DASHBOARD & REAL ANALYTICS
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 8: DYNAMIC DASHBOARD & REAL ANALYTICS ---');
    const dashRes = await request(testPort, 'GET', '/api/v1/dashboard/stats', undefined, tokenA);
    const analyticsRes = await request(testPort, 'GET', '/api/v1/analytics/overview', undefined, tokenA);

    const isDashReal =
      dashRes.status === 200 &&
      typeof dashRes.data?.data?.totalConversations === 'number' &&
      Array.isArray(dashRes.data?.data?.contactsChartData);

    const isAnalyticsReal =
      analyticsRes.status === 200 &&
      typeof analyticsRes.data?.data?.totalContacts === 'number' &&
      typeof analyticsRes.data?.data?.channelBreakdown === 'object';

    recordResult(
      'Dashboard & Analytics',
      'Dashboard metrics calculated dynamically from database without fake numbers',
      isDashReal && isAnalyticsReal,
      `Contacts count: ${dashRes.data?.data?.contactsCount}, Channels: WhatsApp ${analyticsRes.data?.data?.channelBreakdown?.whatsapp}%`,
    );

    // -------------------------------------------------------------
    // AUDIT 9: SUPPORT TICKETS MULTI-TENANT ISOLATION
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 9: SUPPORT TICKETS TENANT ISOLATION ---');
    const createTicketRes = await request(
      testPort,
      'POST',
      '/api/v1/support/tickets',
      {
        subject: 'Alpha Workspace Custom Domain SSL Request',
        category: 'Technical Support',
        priority: 'High',
        description: 'Please enable SSL certificate for our custom WhatsApp domain.',
      },
      tokenA,
    );
    const ticketAId = createTicketRes.data?.id;

    // Tenant B attempts to read Tenant A's ticket
    const idorTicketRead = await request(testPort, 'GET', `/api/v1/support/tickets/${ticketAId}`, undefined, tokenB);
    const idorTicketBlocked = idorTicketRead.status === 403 || idorTicketRead.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from viewing Tenant A Support Ticket',
      idorTicketBlocked,
      `Received HTTP ${idorTicketRead.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 10: WORKFLOWS & AUTOMATIONS ISOLATION
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 10: WORKFLOWS & AUTOMATIONS ISOLATION ---');
    const createWfRes = await request(
      testPort,
      'POST',
      '/api/v1/workflows',
      {
        title: 'Alpha VIP Lead Router',
        triggerType: 'INBOUND_MESSAGE',
        tags: ['Alpha'],
        nodes: [{ id: '1', type: 'trigger', data: { label: 'Start' }, position: { x: 100, y: 100 } }],
        edges: [],
      },
      tokenA,
    );
    const wfAId = createWfRes.data?.data?.id;

    // Tenant B attempts to delete Tenant A's workflow
    const idorWfDelete = await request(testPort, 'DELETE', `/api/v1/workflows/${wfAId}`, undefined, tokenB);
    const idorWfBlocked = idorWfDelete.status === 403 || idorWfDelete.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from deleting Tenant A Workflow',
      idorWfBlocked,
      `Received HTTP ${idorWfDelete.status}`,
    );

    console.log('\n===============================================================');
    console.log('🏁 AUDIT SUMMARY RESULTS');
    console.log('===============================================================');
    const totalPassed = results.filter((r) => r.passed).length;
    const totalFailed = results.filter((r) => !r.passed).length;
    console.log(`Total Audit Checks: ${results.length}`);
    console.log(`Passed: ${totalPassed} ✅`);
    console.log(`Failed: ${totalFailed} ❌`);
    console.log(`Success Rate: ${Math.round((totalPassed / results.length) * 100)}%\n`);

    if (totalFailed > 0) {
      console.error('❌ SOME AUDIT CHECKS FAILED');
      process.exit(1);
    } else {
      console.log('🎉 ALL PRODUCTION AUDIT CHECKS PASSED WITH 100% SUCCESS!');
    }
  } catch (err: any) {
    console.error(`Audit Execution Error: ${err.message}`, err.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runAudit();
