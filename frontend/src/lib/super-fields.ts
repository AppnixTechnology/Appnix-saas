import {
  SuperField,
  SuperFieldDataType,
  SuperFieldFormPayload,
  SuperFieldValidationError,
} from '@/types/super-field';

export interface DataTypeConfig {
  type: SuperFieldDataType;
  label: string;
  category: 'Text & Strings' | 'Choice & Enums' | 'Numbers & Finance' | 'Contact & Web' | 'Date & Time';
  description: string;
  badgeStyle: string;
  example: string;
  supportsOptions: boolean;
  supportsMinMax: boolean;
  supportsCurrency?: boolean;
}

export const DATA_TYPE_METADATA: Record<SuperFieldDataType, DataTypeConfig> = {
  TEXT: {
    type: 'TEXT',
    label: 'Single-line Text',
    category: 'Text & Strings',
    description: 'Short strings like names, company titles, or unique tags',
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    example: 'John Doe / Senior Developer',
    supportsOptions: false,
    supportsMinMax: false,
  },
  TEXTAREA: {
    type: 'TEXTAREA',
    label: 'Multi-line Text',
    category: 'Text & Strings',
    description: 'Longer descriptions, agent notes, and rich commentary',
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    example: 'Special packaging instructions required for fragile delivery...',
    supportsOptions: false,
    supportsMinMax: false,
  },
  DROPDOWN: {
    type: 'DROPDOWN',
    label: 'Dropdown / Single Select',
    category: 'Choice & Enums',
    description: 'Strict single choice from a predefined list of options',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    example: 'Delhi, Mumbai, Dubai, Singapore',
    supportsOptions: true,
    supportsMinMax: false,
  },
  MULTI_SELECT: {
    type: 'MULTI_SELECT',
    label: 'Multi-Select',
    category: 'Choice & Enums',
    description: 'Allows picking one or more choices from predefined options',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300',
    example: 'SaaS, E-Commerce, FinTech',
    supportsOptions: true,
    supportsMinMax: false,
  },
  NUMERIC: {
    type: 'NUMERIC',
    label: 'Numeric / Integer',
    category: 'Numbers & Finance',
    description: 'Whole numbers without decimal places (e.g. counts, PINs)',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
    example: '42, 9840, 100',
    supportsOptions: false,
    supportsMinMax: true,
  },
  DECIMAL: {
    type: 'DECIMAL',
    label: 'Decimal Number',
    category: 'Numbers & Finance',
    description: 'Precise floating numbers with decimal precision',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
    example: '98.6, 3.1415',
    supportsOptions: false,
    supportsMinMax: true,
  },
  AMOUNT: {
    type: 'AMOUNT',
    label: 'Amount / Currency',
    category: 'Numbers & Finance',
    description: 'Monetary values with currency symbols and formatted display',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
    example: '₹4,999.00 / $250.00',
    supportsOptions: false,
    supportsMinMax: true,
    supportsCurrency: true,
  },
  EMAIL: {
    type: 'EMAIL',
    label: 'Email Address',
    category: 'Contact & Web',
    description: 'Strict RFC-compliant email address format with validation',
    badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300',
    example: 'user@company.com',
    supportsOptions: false,
    supportsMinMax: false,
  },
  PHONE: {
    type: 'PHONE',
    label: 'Phone Number',
    category: 'Contact & Web',
    description: 'International E.164 phone numbers with country dialing code',
    badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300',
    example: '+91 98765 43210',
    supportsOptions: false,
    supportsMinMax: false,
  },
  URL: {
    type: 'URL',
    label: 'Website URL',
    category: 'Contact & Web',
    description: 'Clickable HTTP / HTTPS web links with domain validation',
    badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300',
    example: 'https://appnix.com',
    supportsOptions: false,
    supportsMinMax: false,
  },
  ADDRESS: {
    type: 'ADDRESS',
    label: 'Physical Address',
    category: 'Contact & Web',
    description: 'Complete physical street address, building, and postal code',
    badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
    example: 'DLF Cyber City, Tower 8B, Gurugram, India',
    supportsOptions: false,
    supportsMinMax: false,
  },
  DATE: {
    type: 'DATE',
    label: 'Date (ISO)',
    category: 'Date & Time',
    description: 'Calendar date selection (Day, Month, Year)',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    example: '24 Aug 2026',
    supportsOptions: false,
    supportsMinMax: false,
  },
  DATETIME: {
    type: 'DATETIME',
    label: 'Date & Time (ISO)',
    category: 'Date & Time',
    description: 'Precise timestamp with 12h/24h time picker',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    example: '24 Aug 2026, 03:45 PM',
    supportsOptions: false,
    supportsMinMax: false,
  },
  PERIODIC_TIME: {
    type: 'PERIODIC_TIME',
    label: 'Periodic Time / Duration',
    category: 'Date & Time',
    description: 'Relative durations and SLA intervals (e.g. 30 mins, 14 days)',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    example: '14 Days / 2 Hours',
    supportsOptions: false,
    supportsMinMax: false,
  },
};

export const INITIAL_SUPER_FIELDS: SuperField[] = [
  {
    id: 'sf-city',
    key: 'city',
    label: 'City',
    description: 'Primary customer resident location for regional broadcasts and logistics delivery.',
    dataType: 'DROPDOWN',
    options: [
      { id: 'opt-1', label: 'Delhi NCR', value: 'Delhi NCR', color: '#2563EB', isDefault: true },
      { id: 'opt-2', label: 'Mumbai', value: 'Mumbai', color: '#059669' },
      { id: 'opt-3', label: 'Bengaluru', value: 'Bengaluru', color: '#7C3AED' },
      { id: 'opt-4', label: 'Hyderabad', value: 'Hyderabad', color: '#D97706' },
      { id: 'opt-5', label: 'Dubai', value: 'Dubai', color: '#E11D48' },
      { id: 'opt-6', label: 'Singapore', value: 'Singapore', color: '#0891B2' },
      { id: 'opt-7', label: 'New York', value: 'New York', color: '#4F46E5' },
    ],
    defaultValue: 'Delhi NCR',
    helperText: 'Select the metropolitan jurisdiction for this account.',
    placeholder: 'Select a city...',
    validation: {
      isRequired: true,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: true,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 4280,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-28T14:30:00Z',
  },
  {
    id: 'sf-customer-tier',
    key: 'customer_tier',
    label: 'Customer Tier',
    description: 'VIP tier ranking that prioritizes support ticket routing and SLA windows.',
    dataType: 'DROPDOWN',
    options: [
      { id: 'tier-1', label: 'Enterprise VIP', value: 'Enterprise VIP', color: '#7C3AED', isDefault: false },
      { id: 'tier-2', label: 'Platinum Partner', value: 'Platinum Partner', color: '#2563EB', isDefault: false },
      { id: 'tier-3', label: 'Gold Pro', value: 'Gold Pro', color: '#D97706', isDefault: true },
      { id: 'tier-4', label: 'Standard Free', value: 'Standard Free', color: '#64748B', isDefault: false },
    ],
    defaultValue: 'Gold Pro',
    helperText: 'Assigned automatically via billing spend or manager override.',
    placeholder: 'Select VIP tier...',
    validation: {
      isRequired: true,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: true,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 5120,
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-29T09:15:00Z',
  },
  {
    id: 'sf-annual-budget',
    key: 'annual_budget',
    label: 'Annual Budget',
    description: 'Declared fiscal spending allocation for omnichannel campaigns.',
    dataType: 'AMOUNT',
    defaultValue: 500000,
    currencySymbol: '₹',
    helperText: 'Enter amount in INR or USD.',
    placeholder: 'e.g. ₹5,00,000',
    validation: {
      isRequired: false,
      minValue: 10000,
      maxValue: 100000000,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: false,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 1840,
    createdAt: '2026-08-12T15:30:00Z',
    updatedAt: '2026-08-27T11:45:00Z',
  },
  {
    id: 'sf-gender',
    key: 'gender',
    label: 'Gender',
    description: 'Demographic attribute for personalized greeting syntax and custom promotions.',
    dataType: 'DROPDOWN',
    options: [
      { id: 'g-1', label: 'Female', value: 'Female', color: '#E11D48' },
      { id: 'g-2', label: 'Male', value: 'Male', color: '#2563EB' },
      { id: 'g-3', label: 'Non-Binary', value: 'Non-Binary', color: '#7C3AED' },
      { id: 'g-4', label: 'Prefer not to say', value: 'Prefer not to say', color: '#64748B' },
    ],
    helperText: 'Used to calibrate automated AI greeting pronoun preferences.',
    placeholder: 'Select gender...',
    validation: {
      isRequired: false,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: false,
      chatInboxSidebar: false,
    },
    status: 'ACTIVE',
    usageCount: 3890,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-20T16:00:00Z',
  },
  {
    id: 'sf-industry-tags',
    key: 'industry_tags',
    label: 'Industry Tags',
    description: 'Multi-tag taxonomy classifying the lead corporate domain.',
    dataType: 'MULTI_SELECT',
    options: [
      { id: 'ind-1', label: 'SaaS & Cloud', value: 'SaaS & Cloud', color: '#2563EB' },
      { id: 'ind-2', label: 'E-Commerce / D2C', value: 'E-Commerce / D2C', color: '#059669' },
      { id: 'ind-3', label: 'FinTech & Banking', value: 'FinTech & Banking', color: '#D97706' },
      { id: 'ind-4', label: 'Healthcare & Pharma', value: 'Healthcare & Pharma', color: '#E11D48' },
      { id: 'ind-5', label: 'Logistics & Supply', value: 'Logistics & Supply', color: '#0891B2' },
      { id: 'ind-6', label: 'EdTech', value: 'EdTech', color: '#7C3AED' },
    ],
    helperText: 'Select all industries that apply to this business account.',
    placeholder: 'Select tags...',
    validation: {
      isRequired: false,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: true,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 2950,
    createdAt: '2026-08-05T14:20:00Z',
    updatedAt: '2026-08-28T18:00:00Z',
  },
  {
    id: 'sf-onboarding-date',
    key: 'onboarding_date',
    label: 'Onboarding Date',
    description: 'Timestamp when the client completed account setup and verification.',
    dataType: 'DATE',
    helperText: 'Calendar date of verified account go-live.',
    placeholder: 'Select onboarding date...',
    validation: {
      isRequired: true,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: false,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 4120,
    createdAt: '2026-08-08T11:10:00Z',
    updatedAt: '2026-08-25T13:40:00Z',
  },
  {
    id: 'sf-billing-email',
    key: 'billing_email',
    label: 'Finance / Invoicing Email',
    description: 'Dedicated email address for tax invoices and payment receipt copies.',
    dataType: 'EMAIL',
    helperText: 'Invoices will be automatically copied to this email address.',
    placeholder: 'accounts@company.com',
    validation: {
      isRequired: false,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: false,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 2210,
    createdAt: '2026-08-02T10:30:00Z',
    updatedAt: '2026-08-22T08:15:00Z',
  },
  {
    id: 'sf-account-notes',
    key: 'account_notes',
    label: 'Account Manager Notes',
    description: 'Freeform internal agent commentary and historical account context.',
    dataType: 'TEXTAREA',
    helperText: 'Internal notes visible only to logged-in team members.',
    placeholder: 'Add key account context...',
    validation: {
      isRequired: false,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: false,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 1740,
    createdAt: '2026-08-03T14:15:00Z',
    updatedAt: '2026-08-24T16:20:00Z',
  },
  {
    id: 'sf-kyc-status',
    key: 'kyc_verification_status',
    label: 'KYC Verification Status',
    description: 'Telecom DLT & Government ID document verification checkpoint.',
    dataType: 'DROPDOWN',
    options: [
      { id: 'kyc-1', label: 'Verified & Approved', value: 'Verified & Approved', color: '#059669', isDefault: false },
      { id: 'kyc-2', label: 'Under Review', value: 'Under Review', color: '#D97706', isDefault: true },
      { id: 'kyc-3', label: 'Documents Pending', value: 'Documents Pending', color: '#64748B', isDefault: false },
      { id: 'kyc-4', label: 'Rejected / Resubmit', value: 'Rejected / Resubmit', color: '#E11D48', isDefault: false },
    ],
    defaultValue: 'Under Review',
    helperText: 'Reflects the verified enterprise telecom KYC status.',
    placeholder: 'Select verification status...',
    validation: {
      isRequired: true,
    },
    placement: {
      contactProfile: true,
      chatInboxLabel: true,
      chatInboxSidebar: true,
    },
    status: 'ACTIVE',
    usageCount: 4890,
    createdAt: '2026-08-04T16:00:00Z',
    updatedAt: '2026-08-30T11:00:00Z',
  },
];

const STORAGE_KEY = 'appnix_super_fields_v2';

export function generateFieldKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
}

export function getStoredSuperFields(): SuperField[] {
  if (typeof window === 'undefined') return INITIAL_SUPER_FIELDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUPER_FIELDS));
      return INITIAL_SUPER_FIELDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_SUPER_FIELDS;
  } catch (e) {
    console.error('Failed to parse super fields from localStorage:', e);
    return INITIAL_SUPER_FIELDS;
  }
}

export function saveStoredSuperFields(fields: SuperField[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    window.dispatchEvent(new Event('super-fields-updated'));
  } catch (e) {
    console.error('Failed to save super fields to localStorage:', e);
  }
}

export function validateSuperField(
  payload: SuperFieldFormPayload,
  existingFields: SuperField[] = []
): SuperFieldValidationError[] {
  const errors: SuperFieldValidationError[] = [];

  // 1. Label validation
  if (!payload.label || !payload.label.trim()) {
    errors.push({ field: 'label', message: 'Field Display Label is required.' });
  } else if (payload.label.trim().length < 2) {
    errors.push({ field: 'label', message: 'Label must be at least 2 characters.' });
  } else if (payload.label.trim().length > 80) {
    errors.push({ field: 'label', message: 'Label cannot exceed 80 characters.' });
  }

  // 2. Key / Slug validation
  const keyRegex = /^[a-z0-9_]{2,48}$/;
  if (!payload.key || !payload.key.trim()) {
    errors.push({ field: 'key', message: 'System Field Key (slug) is required.' });
  } else if (!keyRegex.test(payload.key.trim())) {
    errors.push({
      field: 'key',
      message: 'Key must only contain lowercase letters, numbers, and underscores (2-48 chars).',
    });
  } else {
    // Check for duplicate keys
    const isDuplicate = existingFields.some(
      (f) => f.key === payload.key.trim() && f.id !== payload.id
    );
    if (isDuplicate) {
      errors.push({
        field: 'key',
        message: `Field key "${payload.key.trim()}" is already registered. Please enter a unique key.`,
      });
    }
  }

  // 3. Dropdown / Multi-Select options validation
  if (payload.dataType === 'DROPDOWN' || payload.dataType === 'MULTI_SELECT') {
    if (!payload.options || payload.options.length < 2) {
      errors.push({
        field: 'options',
        message: 'At least 2 predefined options are required for choice-based fields.',
      });
    } else {
      const values = payload.options.map((o) => o.value.trim().toLowerCase());
      const hasEmpty = payload.options.some((o) => !o.value || !o.value.trim());
      if (hasEmpty) {
        errors.push({ field: 'options', message: 'Option values cannot be blank.' });
      }
      const uniqueValues = new Set(values);
      if (uniqueValues.size !== values.length) {
        errors.push({ field: 'options', message: 'Option values must be unique.' });
      }
    }
  }

  // 4. Numerical / Amount validation
  if (payload.dataType === 'NUMERIC' || payload.dataType === 'DECIMAL' || payload.dataType === 'AMOUNT') {
    if (
      payload.validation.minValue !== undefined &&
      payload.validation.maxValue !== undefined &&
      payload.validation.minValue > payload.validation.maxValue
    ) {
      errors.push({
        field: 'validation',
        message: 'Minimum value bound cannot exceed Maximum value bound.',
      });
    }
  }

  return errors;
}
