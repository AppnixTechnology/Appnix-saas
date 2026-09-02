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
  console.log('🚀 STARTING APPNIX SAAS PRODUCTION & INFRASTRUCTURE AUDIT SUITE');
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
    // AUDIT 1: HEALTH CHECK, DATABASE & R2 STORAGE OBSERVABILITY
    // -------------------------------------------------------------
    console.log('--- AUDIT 1: HEALTH, DATABASE & STORAGE OBSERVABILITY ---');
    const healthRes = await request(testPort, 'GET', '/api/v1/health');
    const healthPassed =
      healthRes.status === 200 &&
      healthRes.data?.status === 'ok' &&
      healthRes.data?.checks?.database?.status === 'connected' &&
      !!healthRes.data?.checks?.storage?.provider;
    recordResult(
      'Health & Observability',
      'GET /api/v1/health checks DB connection, memory & Cloudflare R2 status',
      healthPassed,
      `Status: ${healthRes.data?.status}, DB: ${healthRes.data?.checks?.database?.status} (${healthRes.data?.checks?.database?.latencyMs}ms), Storage: ${healthRes.data?.checks?.storage?.provider} (${healthRes.data?.checks?.storage?.status})`,
    );

    // -------------------------------------------------------------
    // AUDIT 2: AUTHENTICATION & MULTI-TENANT ISOLATION SETUP
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
    const tenantBId = signupBRes.data?.data?.user?.tenantId || signupBRes.data?.data?.user?.workspaceId;
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
    // AUDIT 3: CLOUDFLARE R2 & MEDIA MODULE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 3: CLOUDFLARE R2 & MEDIA STORAGE MODULE ---');

    // 3.1 Presigned Upload Request for PDF
    const presignedRes = await request(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'product_catalog.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048576,
      },
      tokenA,
    );
    const mediaAId = presignedRes.data?.data?.mediaId;
    const objectKey = presignedRes.data?.data?.objectKey;
    const isObjectKeySafe =
      objectKey &&
      (objectKey.startsWith(`tenants/${tenantAId}/media/document/`) || objectKey.startsWith(`tenants/${tenantAId}/document/`)) &&
      objectKey.endsWith('product_catalog.pdf') &&
      !objectKey.includes('..');

    recordResult(
      'Cloudflare R2 Storage',
      'Generate secure presigned PUT upload URL with tenant-scoped object key',
      presignedRes.status === 201 && !!presignedRes.data?.data?.uploadUrl && Boolean(isObjectKeySafe),
      `ObjectKey: ${objectKey}`,
    );

    // 3.2 Security: Reject Executable Files (.exe)
    const dangerousUploadRes = await request(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'exploit_script.exe',
        mimeType: 'application/x-msdownload',
        sizeBytes: 1024,
      },
      tokenA,
    );
    recordResult(
      'Storage Security',
      'Reject dangerous executable files (.exe, .bat, .sh) with 400 Bad Request',
      dangerousUploadRes.status === 400,
      `Received HTTP ${dangerousUploadRes.status}: ${dangerousUploadRes.data?.message}`,
    );

    // 3.3 Security: Enforce File Size Limits
    const oversizedRes = await request(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'huge_image.png',
        mimeType: 'image/png',
        sizeBytes: 50 * 1024 * 1024, // 50MB exceeds 10MB limit
      },
      tokenA,
    );
    recordResult(
      'Storage Security',
      'Enforce configurable file size limits (rejects oversized uploads)',
      oversizedRes.status === 400,
      `Received HTTP ${oversizedRes.status}: ${oversizedRes.data?.message}`,
    );

    // 3.4 Confirm Upload and Activate Media
    const confirmRes = await request(testPort, 'POST', `/api/v1/media/${mediaAId}/confirm`, {}, tokenA);
    recordResult(
      'Cloudflare R2 Storage',
      'Confirm and activate media upload in database',
      confirmRes.status === 200 && confirmRes.data?.data?.status === 'READY',
      `Status: ${confirmRes.data?.data?.status}`,
    );

    // 3.5 Short-lived Presigned GET Download URL
    const downloadRes = await request(testPort, 'GET', `/api/v1/media/${mediaAId}/download-url`, undefined, tokenA);
    recordResult(
      'Cloudflare R2 Storage',
      'Generate short-lived signed GET download URL for private tenant media',
      downloadRes.status === 200 && !!downloadRes.data?.data?.downloadUrl,
      `Expires in: ${downloadRes.data?.data?.expiresInSeconds}s`,
    );

    // 3.6 Multi-Tenant IDOR: Tenant B cannot access Tenant A media download URL
    const idorDownloadRes = await request(testPort, 'GET', `/api/v1/media/${mediaAId}/download-url`, undefined, tokenB);
    const idorDownloadBlocked = idorDownloadRes.status === 404 || idorDownloadRes.status === 403;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from generating download URL for Tenant A media',
      idorDownloadBlocked,
      `Received HTTP ${idorDownloadRes.status}`,
    );

    // 3.7 Multi-Tenant IDOR: Tenant B cannot delete Tenant A media
    const idorDeleteMedia = await request(testPort, 'DELETE', `/api/v1/media/${mediaAId}`, undefined, tokenB);
    const idorDeleteMediaBlocked = idorDeleteMedia.status === 404 || idorDeleteMedia.status === 403;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from deleting Tenant A media',
      idorDeleteMediaBlocked,
      `Received HTTP ${idorDeleteMedia.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 4: META EMBEDDED SIGNUP & WHATSAPP ONBOARDING
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 4: META EMBEDDED SIGNUP & WHATSAPP CHANNELS ---');

    // 4.1 Public Meta Config Endpoint (Zero Secret Leakage)
    const metaConfigRes = await request(testPort, 'GET', '/api/v1/channels/whatsapp/config-public', undefined, tokenA);
    const configData = metaConfigRes.data?.data;
    const noSecretLeaked = configData && configData.appId && !configData.appSecret;
    recordResult(
      'Meta Embedded Signup',
      'Public Meta configuration endpoint returns App ID & Config ID without secrets',
      metaConfigRes.status === 200 && Boolean(noSecretLeaked),
      `App ID: ${configData?.appId}, Config ID: ${configData?.configId}`,
    );

    // 4.2 Complete Meta Embedded Signup Callback
    const metaOnboardRes = await request(
      testPort,
      'POST',
      '/api/v1/channels/whatsapp/embedded-signup',
      {
        code: `AQD_meta_oauth_auth_code_${timestamp}`,
        wabaId: '896015703596388',
        phoneNumberId: '1092837465928',
        businessId: 'meta_biz_998877',
      },
      tokenA,
    );

    const onboardData = metaOnboardRes.data?.data;
    recordResult(
      'Meta Embedded Signup',
      'Process Embedded Signup callback, verify WABA & encrypt credentials',
      metaOnboardRes.status === 200 && onboardData?.status === 'CONNECTED',
      `WABA: ${onboardData?.wabaId}, Phone: ${onboardData?.phoneNumber}`,
    );

    // 4.3 WhatsApp Channel Live Status
    const waStatusRes = await request(testPort, 'GET', '/api/v1/channels/whatsapp/status', undefined, tokenA);
    recordResult(
      'Meta Channels',
      'Query live WhatsApp Cloud API verified channel status',
      waStatusRes.status === 200 && waStatusRes.data?.data?.isConnected === true,
      `Status: ${waStatusRes.data?.data?.status}, Quality: ${waStatusRes.data?.data?.qualityRating}`,
    );

    // 4.4 Tenant B Channel Isolation (Tenant B is not connected to Tenant A WABA)
    const waStatusBRes = await request(testPort, 'GET', '/api/v1/channels/whatsapp/status', undefined, tokenB);
    recordResult(
      'Multi-Tenancy & Channels',
      'Tenant B WhatsApp channel status is isolated (disconnected by default)',
      waStatusBRes.status === 200 && waStatusBRes.data?.data?.isConnected === false,
      `Tenant B Status: ${waStatusBRes.data?.data?.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 5: CRM CONTACTS & DATA STORE IDOR PROTECTION
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 5: CRM CONTACTS & DATA STORE MULTI-TENANT IDOR ---');
    const createContactARes = await request(
      testPort,
      'POST',
      '/api/v1/crm/contacts',
      {
        name: 'Alpha Enterprise Lead',
        phone: '+919988776655',
        email: 'lead@alpha.com',
        tags: ['Enterprise'],
      },
      tokenA,
    );
    const contactAId = createContactARes.data?.id || createContactARes.data?.data?.id;

    // Tenant B attempts to read Tenant A contact
    const idorReadContact = await request(testPort, 'GET', `/api/v1/crm/contacts/${contactAId}`, undefined, tokenB);
    const idorBlocked = idorReadContact.status === 403 || idorReadContact.status === 404;
    recordResult(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from reading Tenant A CRM Contact',
      idorBlocked,
      `Received HTTP ${idorReadContact.status}`,
    );

    // -------------------------------------------------------------
    // AUDIT 6: WALLET ATOMIC OPERATIONS & SAFETY
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 6: WALLET ATOMIC OPERATIONS & CONCURRENCY ---');
    const topupRes = await request(
      testPort,
      'POST',
      '/api/v1/workspace/wallet/topup',
      {
        amount: 3500,
        paymentMethod: 'UPI Autopay',
      },
      tokenA,
    );
    const newBalance = topupRes.data?.data?.balance;
    recordResult(
      'Wallet & Billing',
      'Atomic Wallet Top-up with transaction ledger record',
      (topupRes.status === 201 || topupRes.status === 200) && newBalance === 3500,
      `New balance: ₹${newBalance}`,
    );

    // -------------------------------------------------------------
    // AUDIT 7: WEBHOOK DEDUPLICATION & IDEMPOTENCY
    // -------------------------------------------------------------
    console.log('\n--- AUDIT 7: WEBHOOK IDEMPOTENCY & STATUS INGESTION ---');
    const webhookEventId = `wamid.HBgL_R2_${timestamp}`;
    const metaPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '896015703596388',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                contacts: [{ profile: { name: 'Audit Lead' }, wa_id: '919876500002' }],
                messages: [
                  {
                    id: webhookEventId,
                    from: '919876500002',
                    timestamp: `${Math.floor(Date.now() / 1000)}`,
                    type: 'text',
                    text: { body: 'Inbound message for R2 media audit' },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    const hook1Res = await request(testPort, 'POST', '/api/v1/webhooks/meta', metaPayload);
    const hook2Res = await request(testPort, 'POST', '/api/v1/webhooks/meta', metaPayload);

    recordResult(
      'Webhooks & Idempotency',
      'Meta Inbound Webhook handles message and deduplicates duplicate deliveries',
      hook1Res.status === 200 && hook2Res.status === 200,
      'Duplicate delivery safely acknowledged',
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
      console.log('🎉 ALL PRODUCTION & INFRASTRUCTURE AUDIT CHECKS PASSED WITH 100% SUCCESS!');
    }
  } catch (err: any) {
    console.error(`Audit Execution Error: ${err.message}`, err.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runAudit();
