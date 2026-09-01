export type AuthType = 'API_KEY' | 'BEARER_TOKEN' | 'OAUTH2' | 'BASIC_AUTH';

export type AppCategory =
  | 'All'
  | 'CRM'
  | 'Payment Gateways'
  | 'AI'
  | 'Database'
  | 'E-Commerce'
  | 'Communication';

export interface CatalogField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select';
  placeholder: string;
  required: boolean;
  helpText?: string;
  options?: { label: string; value: string }[];
}

export interface CatalogApp {
  id: string;
  name: string;
  category: 'CRM' | 'Payment Gateways' | 'AI' | 'Database' | 'E-Commerce' | 'Communication';
  authTypes: AuthType[];
  description: string;
  icon: string;
  oauthSupported: boolean;
  popular?: boolean;
  badge?: string;
  fields: CatalogField[];
  docsUrl?: string;
}

export interface LinkedWorkflow {
  id: string;
  title: string;
  status: boolean;
  trigger: string;
  updatedAt: string;
}

export interface ConnectedApp {
  id: string;
  tenantId?: string;
  appName: string;
  accountName: string;
  authType: AuthType;
  credentials?: Record<string, any>;
  maskedCredentials?: Record<string, any>;
  isActive: boolean;
  lastTestedAt: string | null;
  isHealthy: boolean;
  linkedWorkflowsCount: number;
  linkedWorkflows?: LinkedWorkflow[];
  appTitle?: string;
  appCategory?: string;
  appIcon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiSummary {
  totalConnected: number;
  healthyCount: number;
  needsReauthCount: number;
  totalWorkflowsLinked: number;
  healthLabel: string;
}

export interface TestResult {
  success: boolean;
  latencyMs: number;
  message: string;
  testedAt?: string;
  scopes?: string[];
  credentialId?: string;
}
