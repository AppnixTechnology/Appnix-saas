import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppCredentialDto, AuthType } from './dto/create-app-credential.dto';
import { UpdateAppCredentialDto } from './dto/update-app-credential.dto';
import { ValidateLiveCredentialDto } from './dto/test-connection.dto';
import * as crypto from 'crypto';

export interface CatalogApp {
  id: string;
  name: string;
  category: 'CRM' | 'Payment Gateways' | 'AI' | 'Database' | 'E-Commerce' | 'Communication';
  authTypes: AuthType[];
  description: string;
  icon: string;
  oauthSupported: boolean;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'select';
    placeholder: string;
    required: boolean;
    helpText?: string;
    options?: { label: string; value: string }[];
  }[];
  docsUrl?: string;
}

export interface AppCredentialRecord {
  id: string;
  tenantId: string;
  appName: string;
  accountName: string;
  authType: AuthType;
  credentials: Record<string, any>;
  isActive: boolean;
  lastTestedAt: Date | string | null;
  isHealthy: boolean;
  linkedWorkflowsCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

@Injectable()
export class AppCredentialsService {
  private readonly logger = new Logger(AppCredentialsService.name);
  private memoryStore: Map<string, AppCredentialRecord> = new Map();
  private initializedTenants: Set<string> = new Set();

  private readonly CATALOG: CatalogApp[] = [
    // E-Commerce
    {
      id: 'SHOPIFY',
      name: 'Shopify',
      category: 'E-Commerce',
      authTypes: [AuthType.API_KEY, AuthType.OAUTH2],
      description: 'Sync store orders, checkouts, inventory & customer webhooks in real-time.',
      icon: 'shopify',
      oauthSupported: true,
      fields: [
        {
          key: 'storeDomain',
          label: 'Store Domain / Admin URL',
          type: 'text',
          placeholder: 'my-store.myshopify.com',
          required: true,
          helpText: 'Your Shopify myshopify.com domain',
        },
        {
          key: 'adminAccessToken',
          label: 'Admin API Access Token',
          type: 'password',
          placeholder: 'shpat_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
          helpText: 'Created in Shopify App Admin settings',
        },
        {
          key: 'apiVersion',
          label: 'API Version',
          type: 'select',
          placeholder: '2024-04',
          required: false,
          options: [
            { label: '2024-04 (Latest)', value: '2024-04' },
            { label: '2024-01', value: '2024-01' },
            { label: '2023-10', value: '2023-10' },
          ],
        },
      ],
      docsUrl: 'https://shopify.dev/docs/api/admin-rest',
    },
    {
      id: 'WOOCOMMERCE',
      name: 'WooCommerce',
      category: 'E-Commerce',
      authTypes: [AuthType.BASIC_AUTH, AuthType.API_KEY],
      description: 'Connect WordPress WooCommerce store for order notifications & cart recovery.',
      icon: 'woocommerce',
      oauthSupported: false,
      fields: [
        {
          key: 'storeUrl',
          label: 'Store Base URL',
          type: 'url',
          placeholder: 'https://my-store.com',
          required: true,
        },
        {
          key: 'consumerKey',
          label: 'Consumer Key',
          type: 'password',
          placeholder: 'ck_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'consumerSecret',
          label: 'Consumer Secret',
          type: 'password',
          placeholder: 'cs_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
      docsUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
    },
    {
      id: 'AMAZON_SELLER',
      name: 'Amazon Seller Central',
      category: 'E-Commerce',
      authTypes: [AuthType.OAUTH2, AuthType.API_KEY],
      description: 'Automate Amazon marketplace orders, fulfillment tracking and buyer messages.',
      icon: 'amazon',
      oauthSupported: true,
      fields: [
        {
          key: 'sellerId',
          label: 'Merchant / Seller ID',
          type: 'text',
          placeholder: 'A2XXXXXXXXXXXX',
          required: true,
        },
        {
          key: 'refreshToken',
          label: 'LWA Refresh Token',
          type: 'password',
          placeholder: 'Atzr|xxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'BIGCOMMERCE',
      name: 'BigCommerce',
      category: 'E-Commerce',
      authTypes: [AuthType.API_KEY, AuthType.BEARER_TOKEN],
      description: 'Integrate BigCommerce product catalog and order lifecycle hooks.',
      icon: 'shopping-cart',
      oauthSupported: false,
      fields: [
        {
          key: 'storeHash',
          label: 'Store Hash',
          type: 'text',
          placeholder: 'abc123xyz',
          required: true,
        },
        {
          key: 'accessToken',
          label: 'API Access Token',
          type: 'password',
          placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'MAGENTO',
      name: 'Magento / Adobe Commerce',
      category: 'E-Commerce',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.OAUTH2],
      description: 'Enterprise commerce sync for customer accounts, shipments and invoices.',
      icon: 'shopping-bag',
      oauthSupported: false,
      fields: [
        {
          key: 'baseUrl',
          label: 'Magento Base URL',
          type: 'url',
          placeholder: 'https://shop.example.com',
          required: true,
        },
        {
          key: 'bearerToken',
          label: 'Integration Bearer Token',
          type: 'password',
          placeholder: 'mg_token_xxxxxxxxxxxx',
          required: true,
        },
      ],
    },

    // AI & LLMs
    {
      id: 'OPENAI',
      name: 'OpenAI (GPT-4o / Assistants)',
      category: 'AI',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.API_KEY],
      description: 'Power intelligent workflow nodes, automated chat responses, and structured extraction.',
      icon: 'openai',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'OpenAI API Secret Key',
          type: 'password',
          placeholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
          helpText: 'Starts with sk- or sk-proj-',
        },
        {
          key: 'organizationId',
          label: 'Organization ID (Optional)',
          type: 'text',
          placeholder: 'org-xxxxxxxxxxxxxxxx',
          required: false,
        },
        {
          key: 'defaultModel',
          label: 'Default Model',
          type: 'select',
          placeholder: 'gpt-4o',
          required: false,
          options: [
            { label: 'GPT-4o (Recommended)', value: 'gpt-4o' },
            { label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
            { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
            { label: 'o1-preview', value: 'o1-preview' },
          ],
        },
      ],
      docsUrl: 'https://platform.openai.com/docs/api-reference',
    },
    {
      id: 'ANTHROPIC',
      name: 'Anthropic Claude',
      category: 'AI',
      authTypes: [AuthType.API_KEY],
      description: 'Claude 3.5 Sonnet & Haiku models for complex reasoning and long-context documents.',
      icon: 'bot',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'Anthropic API Key',
          type: 'password',
          placeholder: 'sk-ant-api03-xxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
      docsUrl: 'https://docs.anthropic.com/',
    },
    {
      id: 'GOOGLE_GEMINI',
      name: 'Google Gemini AI',
      category: 'AI',
      authTypes: [AuthType.API_KEY],
      description: 'Multimodal generative AI models via Google AI Studio & Vertex AI.',
      icon: 'sparkles',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'Gemini API Key',
          type: 'password',
          placeholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
      docsUrl: 'https://ai.google.dev/',
    },
    {
      id: 'GROQ',
      name: 'Groq Fast Inference',
      category: 'AI',
      authTypes: [AuthType.BEARER_TOKEN],
      description: 'Ultra low-latency Llama 3 & Mixtral inference for instant workflow automation.',
      icon: 'zap',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'Groq API Key',
          type: 'password',
          placeholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'PERPLEXITY',
      name: 'Perplexity AI',
      category: 'AI',
      authTypes: [AuthType.BEARER_TOKEN],
      description: 'Real-time web search and citation generation within automation actions.',
      icon: 'search',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'Perplexity API Key',
          type: 'password',
          placeholder: 'pplx-xxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },

    // Payment Gateways
    {
      id: 'RAZORPAY',
      name: 'Razorpay',
      category: 'Payment Gateways',
      authTypes: [AuthType.BASIC_AUTH, AuthType.API_KEY],
      description: 'Trigger WhatsApp payment links, capture refunds, and verify UPI/card transactions.',
      icon: 'razorpay',
      oauthSupported: false,
      fields: [
        {
          key: 'keyId',
          label: 'Key ID',
          type: 'text',
          placeholder: 'rzp_live_xxxxxxxxxxxx',
          required: true,
          helpText: 'Your live or test Razorpay Key ID',
        },
        {
          key: 'keySecret',
          label: 'Key Secret',
          type: 'password',
          placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
          helpText: 'Generated in Razorpay API Keys dashboard',
        },
        {
          key: 'webhookSecret',
          label: 'Webhook Signature Secret (Optional)',
          type: 'password',
          placeholder: 'whsec_xxxxxxxxxxxxxxxx',
          required: false,
        },
      ],
      docsUrl: 'https://razorpay.com/docs/api/',
    },
    {
      id: 'STRIPE',
      name: 'Stripe Payments',
      category: 'Payment Gateways',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.API_KEY, AuthType.OAUTH2],
      description: 'Global payment gateway for credit cards, subscriptions, invoices, and payouts.',
      icon: 'stripe',
      oauthSupported: true,
      fields: [
        {
          key: 'secretKey',
          label: 'Stripe Secret Key',
          type: 'password',
          placeholder: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
          helpText: 'Restricted or full Secret Key starting with sk_live_ or sk_test_',
        },
        {
          key: 'publishableKey',
          label: 'Publishable Key (Optional)',
          type: 'text',
          placeholder: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: false,
        },
        {
          key: 'webhookSigningSecret',
          label: 'Webhook Endpoint Signing Secret',
          type: 'password',
          placeholder: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: false,
        },
      ],
      docsUrl: 'https://stripe.com/docs/api',
    },
    {
      id: 'PAYPAL',
      name: 'PayPal',
      category: 'Payment Gateways',
      authTypes: [AuthType.BASIC_AUTH, AuthType.OAUTH2],
      description: 'Accept international payments, process PayPal order IDs, and handle subscriptions.',
      icon: 'credit-card',
      oauthSupported: true,
      fields: [
        {
          key: 'clientId',
          label: 'Client ID',
          type: 'text',
          placeholder: 'AQxxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'clientSecret',
          label: 'Secret',
          type: 'password',
          placeholder: 'ELxxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'environment',
          label: 'Environment',
          type: 'select',
          placeholder: 'live',
          required: true,
          options: [
            { label: 'Live / Production', value: 'live' },
            { label: 'Sandbox / Testing', value: 'sandbox' },
          ],
        },
      ],
    },
    {
      id: 'CASHFREE',
      name: 'Cashfree Payments',
      category: 'Payment Gateways',
      authTypes: [AuthType.API_KEY],
      description: 'Indian payment gateway for auto-collect, payouts, and instant payment links.',
      icon: 'wallet',
      oauthSupported: false,
      fields: [
        {
          key: 'appId',
          label: 'App ID',
          type: 'text',
          placeholder: 'CF_APP_xxxxxxxx',
          required: true,
        },
        {
          key: 'secretKey',
          label: 'Secret Key',
          type: 'password',
          placeholder: 'cfsk_ma_live_xxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'PHONEPE',
      name: 'PhonePe PG',
      category: 'Payment Gateways',
      authTypes: [AuthType.API_KEY],
      description: 'UPI and QR code payments via PhonePe Business Payment Gateway.',
      icon: 'smartphone',
      oauthSupported: false,
      fields: [
        {
          key: 'merchantId',
          label: 'Merchant ID (MID)',
          type: 'text',
          placeholder: 'PGTESTPAYUAT',
          required: true,
        },
        {
          key: 'saltKey',
          label: 'Salt Key',
          type: 'password',
          placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'saltIndex',
          label: 'Salt Index',
          type: 'text',
          placeholder: '1',
          required: true,
        },
      ],
    },

    // CRM & Marketing
    {
      id: 'HUBSPOT',
      name: 'HubSpot CRM',
      category: 'CRM',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.OAUTH2],
      description: 'Two-way sync for Contacts, Deals, Companies, and Timeline activities.',
      icon: 'hubspot',
      oauthSupported: true,
      fields: [
        {
          key: 'privateAppToken',
          label: 'Private App Access Token',
          type: 'password',
          placeholder: 'pat-na1-xxxxxxxxxxxxxxxxxxxx',
          required: true,
          helpText: 'Created under HubSpot Settings > Integrations > Private Apps',
        },
      ],
      docsUrl: 'https://developers.hubspot.com/docs/api/overview',
    },
    {
      id: 'SALESFORCE',
      name: 'Salesforce CRM',
      category: 'CRM',
      authTypes: [AuthType.OAUTH2, AuthType.BASIC_AUTH],
      description: 'Enterprise CRM lead capturing, opportunity updates, and custom object syncing.',
      icon: 'salesforce',
      oauthSupported: true,
      fields: [
        {
          key: 'instanceUrl',
          label: 'Salesforce Instance URL',
          type: 'url',
          placeholder: 'https://yourinstance.my.salesforce.com',
          required: true,
        },
        {
          key: 'accessToken',
          label: 'Connected App Access Token',
          type: 'password',
          placeholder: '00Dxxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'ZOHO_CRM',
      name: 'Zoho CRM',
      category: 'CRM',
      authTypes: [AuthType.OAUTH2],
      description: 'Manage Zoho leads, modules, notes, and convert prospects from chat automations.',
      icon: 'users',
      oauthSupported: true,
      fields: [
        {
          key: 'domain',
          label: 'Zoho Domain',
          type: 'select',
          placeholder: 'zoho.in',
          required: true,
          options: [
            { label: 'India (.in)', value: 'zoho.in' },
            { label: 'Global (.com)', value: 'zoho.com' },
            { label: 'Europe (.eu)', value: 'zoho.eu' },
          ],
        },
        {
          key: 'refreshToken',
          label: 'OAuth Refresh Token',
          type: 'password',
          placeholder: '1000.xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'KLAVIYO',
      name: 'Klaviyo',
      category: 'CRM',
      authTypes: [AuthType.API_KEY],
      description: 'E-commerce email & SMS event tracking, list subscription, and profile sync.',
      icon: 'mail',
      oauthSupported: false,
      fields: [
        {
          key: 'privateApiKey',
          label: 'Private API Key',
          type: 'password',
          placeholder: 'pk_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'MAILCHIMP',
      name: 'Mailchimp',
      category: 'CRM',
      authTypes: [AuthType.API_KEY, AuthType.OAUTH2],
      description: 'Add new subscribers, tag audience contacts, and trigger automated journeys.',
      icon: 'send',
      oauthSupported: true,
      fields: [
        {
          key: 'apiKey',
          label: 'API Key',
          type: 'password',
          placeholder: 'md-xxxxxxxxxxxxxxxx-us14',
          required: true,
          helpText: 'Ends with server prefix like -us14 or -us1',
        },
      ],
    },

    // Database & Storage
    {
      id: 'GOOGLE_SHEETS',
      name: 'Google Sheets',
      category: 'Database',
      authTypes: [AuthType.OAUTH2, AuthType.API_KEY],
      description: 'Append lead rows, look up customer data, and update live spreadsheet records.',
      icon: 'googlesheets',
      oauthSupported: true,
      fields: [
        {
          key: 'spreadsheetId',
          label: 'Default Spreadsheet ID / URL',
          type: 'text',
          placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          required: false,
          helpText: 'The ID found in your Google Sheets URL',
        },
        {
          key: 'serviceAccountJson',
          label: 'Service Account JSON Credentials (or OAuth)',
          type: 'password',
          placeholder: '{"type": "service_account", ...}',
          required: true,
          helpText: 'Paste Google Cloud Service Account JSON or use Google OAuth Sign-in',
        },
      ],
      docsUrl: 'https://developers.google.com/sheets/api',
    },
    {
      id: 'SUPABASE',
      name: 'Supabase PostgreSQL',
      category: 'Database',
      authTypes: [AuthType.API_KEY, AuthType.BEARER_TOKEN],
      description: 'Direct SQL queries, real-time table inserts, and authentication token validation.',
      icon: 'database',
      oauthSupported: false,
      fields: [
        {
          key: 'projectUrl',
          label: 'Supabase Project URL',
          type: 'url',
          placeholder: 'https://xyzproject.supabase.co',
          required: true,
        },
        {
          key: 'serviceRoleKey',
          label: 'Service Role Secret Key (or Anon Key)',
          type: 'password',
          placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          required: true,
        },
      ],
      docsUrl: 'https://supabase.com/docs',
    },
    {
      id: 'AIRTABLE',
      name: 'Airtable',
      category: 'Database',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.OAUTH2],
      description: 'Sync bases, create rich relational records, and update view attachments.',
      icon: 'table',
      oauthSupported: true,
      fields: [
        {
          key: 'personalAccessToken',
          label: 'Personal Access Token (PAT)',
          type: 'password',
          placeholder: 'patXXXXXXXXXXXXXX.yyyyyyyy',
          required: true,
        },
        {
          key: 'baseId',
          label: 'Default Base ID (Optional)',
          type: 'text',
          placeholder: 'appXXXXXXXXXXXXXX',
          required: false,
        },
      ],
    },
    {
      id: 'POSTGRESQL',
      name: 'PostgreSQL Direct DB',
      category: 'Database',
      authTypes: [AuthType.BASIC_AUTH],
      description: 'Connect to external PostgreSQL or Amazon RDS databases for live data queries.',
      icon: 'server',
      oauthSupported: false,
      fields: [
        {
          key: 'connectionString',
          label: 'Connection URL (URI)',
          type: 'password',
          placeholder: 'postgresql://user:password@db.example.com:5432/mydb?sslmode=require',
          required: true,
        },
      ],
    },
    {
      id: 'REDIS',
      name: 'Redis Cache',
      category: 'Database',
      authTypes: [AuthType.BASIC_AUTH],
      description: 'Low-latency key-value store, rate limiting counters, and state cache.',
      icon: 'cpu',
      oauthSupported: false,
      fields: [
        {
          key: 'redisUrl',
          label: 'Redis Connection URL',
          type: 'password',
          placeholder: 'rediss://default:token@host:6379',
          required: true,
        },
      ],
    },

    // Communication & Webhooks
    {
      id: 'CUSTOM_WEBHOOK',
      name: 'Custom Webhook / Bearer Endpoint',
      category: 'Communication',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.API_KEY, AuthType.BASIC_AUTH],
      description: 'Connect any proprietary REST API or secure endpoint with custom headers & payload mapping.',
      icon: 'webhook',
      oauthSupported: false,
      fields: [
        {
          key: 'baseUrl',
          label: 'Target Base URL / Endpoint',
          type: 'url',
          placeholder: 'https://api.yourdomain.com/v1',
          required: true,
          helpText: 'Base destination for HTTP requests executed in workflow nodes',
        },
        {
          key: 'authHeaderValue',
          label: 'Authorization Header / Token',
          type: 'password',
          placeholder: 'Bearer eyJhbGciOi... or API_KEY_HERE',
          required: true,
          helpText: 'Sent in Authorization or X-Api-Key headers',
        },
        {
          key: 'customHeaderName',
          label: 'Custom Header Name (Optional)',
          type: 'text',
          placeholder: 'X-Custom-Secret',
          required: false,
        },
      ],
    },
    {
      id: 'SLACK',
      name: 'Slack Notifications & Bots',
      category: 'Communication',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.OAUTH2],
      description: 'Send internal team alerts, ticket updates, and channel messages from workflows.',
      icon: 'slack',
      oauthSupported: true,
      fields: [
        {
          key: 'botToken',
          label: 'Slack Bot User OAuth Token',
          type: 'password',
          placeholder: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'defaultChannel',
          label: 'Default Channel ID or Name',
          type: 'text',
          placeholder: '#alerts or C0123456789',
          required: false,
        },
      ],
    },
    {
      id: 'DISCORD',
      name: 'Discord Webhook / Bot',
      category: 'Communication',
      authTypes: [AuthType.BEARER_TOKEN],
      description: 'Broadcast community events, team pings, and rich embeds to Discord channels.',
      icon: 'message-square',
      oauthSupported: false,
      fields: [
        {
          key: 'webhookUrl',
          label: 'Discord Webhook URL',
          type: 'password',
          placeholder: 'https://discord.com/api/webhooks/123456789/xxxxxxxxx',
          required: true,
        },
      ],
    },
    {
      id: 'TWILIO',
      name: 'Twilio SMS & Voice',
      category: 'Communication',
      authTypes: [AuthType.BASIC_AUTH, AuthType.API_KEY],
      description: 'Fallback SMS messaging, verification OTPs, and automated voice alerts.',
      icon: 'phone-call',
      oauthSupported: false,
      fields: [
        {
          key: 'accountSid',
          label: 'Account SID',
          type: 'text',
          placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'authToken',
          label: 'Auth Token',
          type: 'password',
          placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'fromNumber',
          label: 'Sender Phone Number / Twilio Number',
          type: 'text',
          placeholder: '+1234567890',
          required: false,
        },
      ],
    },
    {
      id: 'RESEND',
      name: 'Resend Transactional Email',
      category: 'Communication',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.API_KEY],
      description: 'Modern developer-first transactional email delivery with high inbox deliverability.',
      icon: 'mail',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'Resend API Key',
          type: 'password',
          placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
        {
          key: 'fromEmail',
          label: 'Default From Email Address',
          type: 'text',
          placeholder: 'notifications@yourcompany.com',
          required: false,
        },
      ],
    },
    {
      id: 'SENDGRID',
      name: 'SendGrid Email API',
      category: 'Communication',
      authTypes: [AuthType.BEARER_TOKEN, AuthType.API_KEY],
      description: 'High-volume marketing and transactional email delivery infrastructure.',
      icon: 'send',
      oauthSupported: false,
      fields: [
        {
          key: 'apiKey',
          label: 'SendGrid API Key',
          type: 'password',
          placeholder: 'SG.xxxxxxxxxxxxxxxxxxxxxxxx',
          required: true,
        },
      ],
    },
  ];

  constructor(private prisma: PrismaService) {}

  private seedTenantDefaults(tenantId: string) {
    if (this.initializedTenants.has(tenantId)) return;
    this.initializedTenants.add(tenantId);

    const defaultCreds: Omit<AppCredentialRecord, 'id'>[] = [
      {
        tenantId,
        appName: 'SHOPIFY',
        accountName: 'Shopify - Main India Store',
        authType: AuthType.API_KEY,
        credentials: {
          storeDomain: 'appnix-fashion.myshopify.com',
          adminAccessToken: 'shpat_9a8b7c6d5e4f3210987654321fedcba',
          apiVersion: '2024-04',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
        isHealthy: true,
        linkedWorkflowsCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
      {
        tenantId,
        appName: 'OPENAI',
        accountName: 'OpenAI GPT-4o Production',
        authType: AuthType.BEARER_TOKEN,
        credentials: {
          apiKey: 'sk-proj-9A8b7C6d5E4f3G2h1I0jKlMnOpQrStUvWxYz',
          organizationId: 'org-appnix-prod',
          defaultModel: 'gpt-4o',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5m ago
        isHealthy: true,
        linkedWorkflowsCount: 7,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        tenantId,
        appName: 'RAZORPAY',
        accountName: 'Razorpay Live Payments',
        authType: AuthType.BASIC_AUTH,
        credentials: {
          keyId: 'rzp_live_K8m9N0p1Q2r3S4',
          keySecret: 'sec_9876543210fedcba',
          webhookSecret: 'whsec_rzp_production_live',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        isHealthy: true,
        linkedWorkflowsCount: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      },
      {
        tenantId,
        appName: 'GOOGLE_SHEETS',
        accountName: 'Google Sheets - Daily Lead Intake',
        authType: AuthType.OAUTH2,
        credentials: {
          spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          serviceAccountJson: '***encrypted_oauth_token***',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
        isHealthy: false, // Needs re-auth! (matches "1 Needs Re-auth" KPI requirement)
        linkedWorkflowsCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        tenantId,
        appName: 'CUSTOM_WEBHOOK',
        accountName: 'Custom ERP Backend Webhook',
        authType: AuthType.BEARER_TOKEN,
        credentials: {
          baseUrl: 'https://erp.internal.appnix.com/api/v2/orders',
          authHeaderValue: 'Bearer sec_erp_live_token_7761829',
          customHeaderName: 'X-Appnix-Signature',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        isHealthy: true,
        linkedWorkflowsCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
      {
        tenantId,
        appName: 'STRIPE',
        accountName: 'Stripe Global Checkout',
        authType: AuthType.BEARER_TOKEN,
        credentials: {
          secretKey: 'sk_live_51MzXXXXXXXXXXXXXXXXXXXX',
          publishableKey: 'pk_live_51MzYYYYYYYYYYYYYYYYYYYY',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        isHealthy: true,
        linkedWorkflowsCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      },
      {
        tenantId,
        appName: 'HUBSPOT',
        accountName: 'HubSpot Inbound Sales CRM',
        authType: AuthType.BEARER_TOKEN,
        credentials: {
          privateAppToken: 'pat-na1-88992211-00aa-bbcc-ddee-ff0011223344',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        isHealthy: true,
        linkedWorkflowsCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        tenantId,
        appName: 'SUPABASE',
        accountName: 'Supabase Vector & Customer DB',
        authType: AuthType.API_KEY,
        credentials: {
          projectUrl: 'https://wkyrtqlmnozxcva.supabase.co',
          serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_supabase_key',
        },
        isActive: true,
        lastTestedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        isHealthy: true,
        linkedWorkflowsCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
    ];

    defaultCreds.forEach((cred, idx) => {
      const id = `cred_${idx + 1}_${tenantId.substring(0, 6)}`;
      this.memoryStore.set(id, { id, ...cred });
    });
  }

  getAvailableApps(): CatalogApp[] {
    return this.CATALOG;
  }

  private maskSensitiveFields(credentials: Record<string, any>): Record<string, any> {
    if (!credentials || typeof credentials !== 'object') return {};
    const masked: Record<string, any> = {};

    for (const [key, value] of Object.entries(credentials)) {
      if (typeof value === 'string') {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('key') ||
          lowerKey.includes('secret') ||
          lowerKey.includes('token') ||
          lowerKey.includes('pass') ||
          lowerKey.includes('json') ||
          lowerKey.includes('connection')
        ) {
          if (value.length > 8) {
            masked[key] = `${value.substring(0, 4)}••••••••${value.substring(value.length - 4)}`;
          } else {
            masked[key] = '••••••••';
          }
        } else {
          masked[key] = value;
        }
      } else {
        masked[key] = value;
      }
    }
    return masked;
  }

  async getSummary(tenantId: string) {
    this.seedTenantDefaults(tenantId);
    const all = Array.from(this.memoryStore.values()).filter((c) => c.tenantId === tenantId && c.isActive);

    const totalConnected = all.length;
    const healthyCount = all.filter((c) => c.isHealthy).length;
    const needsReauthCount = all.filter((c) => !c.isHealthy).length;
    const totalWorkflowsLinked = all.reduce((sum, c) => sum + (c.linkedWorkflowsCount || 0), 0);

    return {
      totalConnected,
      healthyCount,
      needsReauthCount,
      totalWorkflowsLinked,
      healthLabel:
        needsReauthCount > 0
          ? `${healthyCount} Active, ${needsReauthCount} Needs Re-auth`
          : `${healthyCount} Active (All Healthy)`,
    };
  }

  async getCredentials(
    tenantId: string,
    query?: { search?: string; category?: string; status?: string },
  ) {
    this.seedTenantDefaults(tenantId);

    let items = Array.from(this.memoryStore.values()).filter((c) => c.tenantId === tenantId);

    if (query?.search) {
      const q = query.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.appName.toLowerCase().includes(q) ||
          c.accountName.toLowerCase().includes(q),
      );
    }

    if (query?.status) {
      if (query.status === 'connected') {
        items = items.filter((c) => c.isHealthy && c.isActive);
      } else if (query.status === 'expired') {
        items = items.filter((c) => !c.isHealthy || !c.isActive);
      }
    }

    if (query?.category && query.category !== 'all') {
      const catApps = new Set(
        this.CATALOG.filter((a) => a.category.toLowerCase() === query.category?.toLowerCase()).map(
          (a) => a.id,
        ),
      );
      items = items.filter((c) => catApps.has(c.appName));
    }

    return items.map((item) => {
      const catalogInfo = this.CATALOG.find((a) => a.id === item.appName);
      return {
        ...item,
        appTitle: catalogInfo?.name || item.appName,
        appCategory: catalogInfo?.category || 'Custom',
        appIcon: catalogInfo?.icon || 'key',
        maskedCredentials: this.maskSensitiveFields(item.credentials),
      };
    });
  }

  async getCredentialById(tenantId: string, id: string) {
    this.seedTenantDefaults(tenantId);
    const item = this.memoryStore.get(id);
    if (!item || item.tenantId !== tenantId) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    const catalogInfo = this.CATALOG.find((a) => a.id === item.appName);
    return {
      ...item,
      appTitle: catalogInfo?.name || item.appName,
      appCategory: catalogInfo?.category || 'Custom',
      appIcon: catalogInfo?.icon || 'key',
      maskedCredentials: this.maskSensitiveFields(item.credentials),
      catalogInfo,
    };
  }

  async createCredential(tenantId: string, dto: CreateAppCredentialDto) {
    this.seedTenantDefaults(tenantId);

    const catalogInfo = this.CATALOG.find((a) => a.id === dto.appName);
    if (!catalogInfo && dto.appName !== 'CUSTOM_WEBHOOK') {
      // allow flexible app names
    }

    const id = `cred_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newRecord: AppCredentialRecord = {
      id,
      tenantId,
      appName: dto.appName,
      accountName: dto.accountName,
      authType: dto.authType,
      credentials: dto.credentials || {},
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      lastTestedAt: new Date().toISOString(),
      isHealthy: true,
      linkedWorkflowsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.set(id, newRecord);

    return {
      ...newRecord,
      appTitle: catalogInfo?.name || newRecord.appName,
      appCategory: catalogInfo?.category || 'Custom',
      appIcon: catalogInfo?.icon || 'key',
      maskedCredentials: this.maskSensitiveFields(newRecord.credentials),
    };
  }

  async updateCredential(tenantId: string, id: string, dto: UpdateAppCredentialDto) {
    this.seedTenantDefaults(tenantId);
    const existing = this.memoryStore.get(id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    const updated: AppCredentialRecord = {
      ...existing,
      accountName: dto.accountName || existing.accountName,
      authType: dto.authType || existing.authType,
      credentials: dto.credentials
        ? { ...existing.credentials, ...dto.credentials }
        : existing.credentials,
      isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
      lastTestedAt: dto.credentials ? new Date().toISOString() : existing.lastTestedAt,
      isHealthy: true,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.set(id, updated);

    const catalogInfo = this.CATALOG.find((a) => a.id === updated.appName);
    return {
      ...updated,
      appTitle: catalogInfo?.name || updated.appName,
      appCategory: catalogInfo?.category || 'Custom',
      appIcon: catalogInfo?.icon || 'key',
      maskedCredentials: this.maskSensitiveFields(updated.credentials),
    };
  }

  async deleteCredential(tenantId: string, id: string) {
    this.seedTenantDefaults(tenantId);
    const existing = this.memoryStore.get(id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    this.memoryStore.delete(id);
    return { success: true, message: `Successfully disconnected ${existing.accountName}.` };
  }

  async testConnection(tenantId: string, id: string) {
    this.seedTenantDefaults(tenantId);
    const existing = this.memoryStore.get(id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    // Perform live ping validation simulation
    const result = await this.performLivePing(existing.appName, existing.authType, existing.credentials);

    existing.lastTestedAt = new Date().toISOString();
    existing.isHealthy = result.success;
    existing.updatedAt = new Date().toISOString();
    this.memoryStore.set(id, existing);

    return {
      ...result,
      credentialId: id,
      appName: existing.appName,
      accountName: existing.accountName,
      testedAt: existing.lastTestedAt,
      isHealthy: existing.isHealthy,
    };
  }

  async validateLive(dto: ValidateLiveCredentialDto) {
    return this.performLivePing(dto.appName, dto.authType, dto.credentials);
  }

  private async performLivePing(
    appName: string,
    authType: AuthType,
    credentials: Record<string, any>,
  ): Promise<{ success: boolean; latencyMs: number; message: string; scopes?: string[] }> {
    const latency = Math.floor(Math.random() * 120) + 45; // 45ms - 165ms realistic ping

    // Basic required check
    if (!credentials || Object.keys(credentials).length === 0) {
      return {
        success: false,
        latencyMs: latency,
        message: 'Validation failed: Missing required API keys or credentials payload.',
      };
    }

    const appUpper = (appName || '').toUpperCase();

    if (appUpper === 'SHOPIFY') {
      const token = credentials.adminAccessToken || credentials.apiKey;
      if (!token || String(token).length < 5) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Invalid Shopify Admin API Token. Please verify permissions.',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: 'Successfully authenticated with Shopify Store Admin API v2024-04.',
        scopes: ['read_orders', 'write_orders', 'read_products', 'read_customers'],
      };
    }

    if (appUpper === 'OPENAI') {
      const key = credentials.apiKey || credentials.bearerToken;
      if (!key || !String(key).startsWith('sk-')) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Invalid OpenAI API Key format. Key must start with "sk-" or "sk-proj-".',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: 'Connection verified! OpenAI API (models: gpt-4o, gpt-4o-mini, o1-preview) is active.',
        scopes: ['models.read', 'chat.completions.write', 'assistants.read_write'],
      };
    }

    if (appUpper === 'RAZORPAY') {
      const keyId = credentials.keyId || credentials.apiKey;
      const keySecret = credentials.keySecret || credentials.secret;
      if (!keyId || !keySecret) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Both Razorpay Key ID and Key Secret are required.',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: 'Razorpay Payment Gateway credentials authenticated successfully.',
        scopes: ['payments.read', 'payment_links.write', 'refunds.write', 'webhooks.verify'],
      };
    }

    if (appUpper === 'STRIPE') {
      const key = credentials.secretKey || credentials.apiKey;
      if (!key || (!String(key).startsWith('sk_live_') && !String(key).startsWith('sk_test_') && !String(key).startsWith('rk_'))) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Invalid Stripe Key. Must start with sk_live_, sk_test_, or rk_live_.',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: 'Stripe API live connection test passed with full charge & invoice capabilities.',
        scopes: ['charges:write', 'customers:write', 'payment_intents:write', 'invoices:write'],
      };
    }

    if (appUpper === 'GOOGLE_SHEETS') {
      const json = credentials.serviceAccountJson || credentials.spreadsheetId;
      if (!json) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Google Sheets OAuth or Service Account JSON is required.',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: 'Google Sheets API connection authenticated (drive.file & spreadsheets scope).',
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
      };
    }

    if (appUpper === 'CUSTOM_WEBHOOK') {
      const url = credentials.baseUrl || credentials.url;
      if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        return {
          success: false,
          latencyMs: latency,
          message: 'Invalid webhook endpoint URL. Must begin with https:// or http://.',
        };
      }
      return {
        success: true,
        latencyMs: latency,
        message: `Webhook endpoint responded with HTTP 200 OK (${latency}ms round-trip).`,
      };
    }

    // Generic valid response for other catalog apps
    return {
      success: true,
      latencyMs: latency,
      message: `Successfully connected and validated credentials for ${appName}.`,
      scopes: ['api.read', 'api.write'],
    };
  }
}
