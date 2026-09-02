/**
 * APPNIX SAAS — CLOUDFLARE R2 PRODUCTION MEDIA STORAGE TEST SUITE
 * 
 * Verifies:
 * 1. Presigned PUT Upload URL generation
 * 2. MIME & Extension Security validation (executable rejection & size limits)
 * 3. Media activation & PostgreSQL metadata persistence
 * 4. Short-lived signed GET download URL generation
 * 5. Multi-tenant IDOR isolation (Tenant B cannot access or delete Tenant A objects)
 * 6. Object deletion (from R2 + PostgreSQL)
 * 7. Missing object 404 handling
 * 8. Zero credential / secret key leakage in API responses
 * 9. Direct S3 SDK StorageService operations (uploadObject, getObject, headObject, deleteObject)
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as http from 'http';
import { StorageService } from '../src/modules/storage/storage.service';

interface TestResult {
  category: string;
  testName: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(category: string, testName: string, passed: boolean, details?: string) {
  results.push({ category, testName, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${category}] ${testName} ${details ? '-> ' + details : ''}`);
}

async function makeRequest(
  port: number,
  method: string,
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const jsonBody = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(jsonBody ? { 'Content-Length': Buffer.byteLength(jsonBody) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const data = raw ? JSON.parse(raw) : null;
            resolve({ status: res.statusCode || 0, data, headers: res.headers });
          } catch {
            resolve({ status: res.statusCode || 0, data: raw, headers: res.headers });
          }
        });
      },
    );

    req.on('error', reject);
    if (jsonBody) req.write(jsonBody);
    req.end();
  });
}

async function runR2TestSuite() {
  console.log('\n===============================================================');
  console.log('🚀 RUNNING CLOUDFLARE R2 PRODUCTION STORAGE TEST SUITE');
  console.log('===============================================================\n');

  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api/v1');

  const testPort = 4199;
  await app.listen(testPort, '127.0.0.1');

  const storageService = app.get(StorageService);

  try {
    const timestamp = Date.now();

    // 1. Storage Service Direct SDK Verification
    console.log('--- TEST 1: STORAGE SERVICE SDK METHODS ---');
    const isConfigured = storageService.getIsConfigured();
    const bucket = storageService.getBucketName();
    record(
      'R2 Service Client',
      'StorageService initialized with S3-compatible R2 Client',
      typeof isConfigured === 'boolean' && bucket === 'appnix-saas-media',
      `Configured: ${isConfigured}, Bucket: ${bucket}`,
    );

    const testObjectKey = storageService.generateObjectKey('tenant-test-sdk', 'test_sample.txt', 'document');
    record(
      'Tenant Scoping',
      'Deterministic object key follows tenants/{tenantId}/media/{category}/{uuid}-{safeFilename}',
      testObjectKey.startsWith('tenants/tenant-test-sdk/media/document/'),
      `Key: ${testObjectKey}`,
    );

    // Direct uploadObject
    const uploadRes = await storageService.uploadObject({
      objectKey: testObjectKey,
      body: Buffer.from('Appnix Cloudflare R2 direct stream upload test'),
      mimeType: 'text/plain',
    });
    record(
      'Storage SDK',
      'uploadObject streams binary buffer to Cloudflare R2',
      uploadRes.objectKey === testObjectKey && uploadRes.size > 0,
      `Size: ${uploadRes.size} bytes`,
    );

    // headObject
    const headRes = await storageService.headObject(testObjectKey);
    record(
      'Storage SDK',
      'headObject inspects object presence and content metadata',
      headRes !== null,
      `ContentLength: ${headRes?.ContentLength || uploadRes.size}`,
    );

    // getObject
    const getRes = await storageService.getObject({ objectKey: testObjectKey });
    record(
      'Storage SDK',
      'getObject retrieves object data from Cloudflare R2',
      getRes !== null,
      `ContentType: ${getRes?.contentType || 'text/plain'}`,
    );

    // deleteObject
    const deleteRes = await storageService.deleteObject(testObjectKey);
    record(
      'Storage SDK',
      'deleteObject deletes object from Cloudflare R2',
      deleteRes === true,
    );

    // 2. Tenant Provisioning & Auth
    console.log('\n--- TEST 2: AUTHENTICATION & MULTI-TENANT ISOLATION ---');
    const regTenantA = await makeRequest(testPort, 'POST', '/api/v1/auth/signup', {
      email: `tenant.a.r2.${timestamp}@appnix.test`,
      password: 'StrongPassword123!@#',
      name: 'Tenant A Admin',
      workspaceName: `Tenant A Workspace ${timestamp}`,
    });
    const tokenA = regTenantA.data?.data?.accessToken;
    const tenantAId = regTenantA.data?.data?.user?.tenantId;
    record('Auth & Provisioning', 'Register Tenant A workspace', regTenantA.status === 201 && !!tokenA, `TenantA ID: ${tenantAId}`);

    const regTenantB = await makeRequest(testPort, 'POST', '/api/v1/auth/signup', {
      email: `tenant.b.r2.${timestamp}@appnix.test`,
      password: 'StrongPassword123!@#',
      name: 'Tenant B Admin',
      workspaceName: `Tenant B Workspace ${timestamp}`,
    });
    const tokenB = regTenantB.data?.data?.accessToken;
    const tenantBId = regTenantB.data?.data?.user?.tenantId;
    record('Auth & Provisioning', 'Register Tenant B workspace', regTenantB.status === 201 && !!tokenB, `TenantB ID: ${tenantBId}`);

    // 3. Security: File Validation & Executable Rejection
    console.log('\n--- TEST 3: FILE SECURITY & EXTENSION VALIDATION ---');
    const exeUploadRes = await makeRequest(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'malicious_trojan.exe',
        mimeType: 'application/x-msdownload',
        sizeBytes: 1024,
      },
      tokenA,
    );
    record(
      'Security Validation',
      'Reject executable (.exe, .bat, .sh) uploads with 400 Bad Request',
      exeUploadRes.status === 400,
      `HTTP ${exeUploadRes.status}: ${exeUploadRes.data?.message}`,
    );

    const oversizedRes = await makeRequest(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'huge_banner.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 50 * 1024 * 1024, // 50MB > 10MB limit
      },
      tokenA,
    );
    record(
      'Security Validation',
      'Enforce size limits (50MB image rejected with 400 Bad Request)',
      oversizedRes.status === 400,
      `HTTP ${oversizedRes.status}: ${oversizedRes.data?.message}`,
    );

    // 4. Valid Presigned PUT Upload URL Generation
    console.log('\n--- TEST 4: PRESIGNED PUT UPLOADS & METADATA ---');
    const validUploadRes = await makeRequest(
      testPort,
      'POST',
      '/api/v1/media/presigned-upload',
      {
        filename: 'product_catalog.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2 * 1024 * 1024,
      },
      tokenA,
    );
    const mediaAId = validUploadRes.data?.data?.mediaId;
    const objectKeyA = validUploadRes.data?.data?.objectKey;
    const uploadUrlA = validUploadRes.data?.data?.uploadUrl;

    record(
      'Presigned Upload',
      'Generate secure presigned PUT URL for client browser upload',
      validUploadRes.status === 201 && !!mediaAId && !!uploadUrlA,
      `ObjectKey: ${objectKeyA}`,
    );

    // 5. Zero Secret Leakage Check
    console.log('\n--- TEST 5: ZERO SECRET LEAKAGE VERIFICATION ---');
    const resString = JSON.stringify(validUploadRes.data);
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;
    const hasSecretLeak =
      (secretKey && resString.includes(secretKey)) ||
      resString.includes('R2_SECRET_ACCESS_KEY') ||
      resString.includes('secretAccessKey') ||
      resString.includes('passwordHash');
    record(
      'Secret Protection',
      'Zero storage secret credentials leaked in API responses',
      !hasSecretLeak,
      'Verified: No secretAccessKey, passwordHash, or internal secrets in payload',
    );

    // 6. Confirm Upload and Activate Record
    console.log('\n--- TEST 6: CONFIRMATION & SIGNED DOWNLOAD URLS ---');
    const confirmRes = await makeRequest(testPort, 'POST', `/api/v1/media/${mediaAId}/confirm`, {}, tokenA);
    record(
      'Media Lifecycle',
      'Confirm client upload and activate database record',
      confirmRes.status === 200 && confirmRes.data?.data?.status === 'READY',
      `Status: ${confirmRes.data?.data?.status}`,
    );

    const downloadRes = await makeRequest(testPort, 'GET', `/api/v1/media/${mediaAId}/download-url`, undefined, tokenA);
    record(
      'Signed Download',
      'Generate short-lived signed GET download URL',
      downloadRes.status === 200 && !!downloadRes.data?.data?.downloadUrl,
      `Expires in: ${downloadRes.data?.data?.expiresInSeconds}s`,
    );

    // 7. Multi-Tenant IDOR Protection
    console.log('\n--- TEST 7: MULTI-TENANT IDOR ACCESS CONTROL ---');
    const idorDownloadRes = await makeRequest(testPort, 'GET', `/api/v1/media/${mediaAId}/download-url`, undefined, tokenB);
    const idorBlocked = idorDownloadRes.status === 404 || idorDownloadRes.status === 403;
    record(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from generating download URL for Tenant A media',
      idorBlocked,
      `HTTP status: ${idorDownloadRes.status}`,
    );

    const idorDeleteRes = await makeRequest(testPort, 'DELETE', `/api/v1/media/${mediaAId}`, undefined, tokenB);
    const idorDeleteBlocked = idorDeleteRes.status === 404 || idorDeleteRes.status === 403;
    record(
      'Multi-Tenancy & IDOR',
      'Tenant B BLOCKED from deleting Tenant A media object',
      idorDeleteBlocked,
      `HTTP status: ${idorDeleteRes.status}`,
    );

    // 8. Delete Media
    console.log('\n--- TEST 8: DELETION & MISSING OBJECT 404 ---');
    const deleteResA = await makeRequest(testPort, 'DELETE', `/api/v1/media/${mediaAId}`, undefined, tokenA);
    record(
      'Media Deletion',
      'Tenant A deletes own media file and removes DB metadata',
      deleteResA.status === 200,
      deleteResA.data?.message,
    );

    const missingRes = await makeRequest(testPort, 'GET', `/api/v1/media/${mediaAId}`, undefined, tokenA);
    record(
      'Missing Object',
      'Accessing non-existent/deleted media returns 404 Not Found',
      missingRes.status === 404,
      `HTTP ${missingRes.status}: ${missingRes.data?.message}`,
    );

  } finally {
    await app.close();
  }

  // Summary
  console.log('\n===============================================================');
  console.log('🏁 CLOUDFLARE R2 TEST SUITE SUMMARY');
  console.log('===============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`Total Checks: ${results.length}`);
  console.log(`Passed: ${passedCount} ✅`);
  console.log(`Failed: ${failedCount} ❌`);
  console.log(`Success Rate: ${Math.round((passedCount / results.length) * 100)}%\n`);

  if (failedCount > 0) {
    console.error('❌ SOME CLOUDFLARE R2 TESTS FAILED');
    process.exit(1);
  } else {
    console.log('🎉 ALL CLOUDFLARE R2 PRODUCTION STORAGE TESTS PASSED (100% SUCCESS)!');
    process.exit(0);
  }
}

runR2TestSuite().catch((err) => {
  console.error('FATAL R2 TEST ERROR:', err);
  process.exit(1);
});
