import {
  ContactTag,
  CreateTagPayload,
  TagColorConfig,
  TagColorId,
  TagIconId,
  TagValidationError,
} from '@/types/contact-tag';

export const TAG_COLOR_PALETTE: Record<TagColorId, TagColorConfig> = {
  red: {
    id: 'red',
    name: 'Rose Red',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
    borderClass: 'border-rose-300 dark:border-rose-800',
    dotColor: '#E11D48',
    textClass: 'text-rose-700 dark:text-rose-300',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    borderClass: 'border-amber-300 dark:border-amber-800',
    dotColor: '#D97706',
    textClass: 'text-amber-700 dark:text-amber-300',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Vibrant Emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
    borderClass: 'border-emerald-300 dark:border-emerald-800',
    dotColor: '#059669',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  blue: {
    id: 'blue',
    name: 'Meta Blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900',
    borderClass: 'border-blue-300 dark:border-blue-800',
    dotColor: '#2563EB',
    textClass: 'text-blue-700 dark:text-blue-300',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900',
    borderClass: 'border-indigo-300 dark:border-indigo-800',
    dotColor: '#4F46E5',
    textClass: 'text-indigo-700 dark:text-indigo-300',
    iconClass: 'text-indigo-600 dark:text-indigo-400',
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
    borderClass: 'border-purple-300 dark:border-purple-800',
    dotColor: '#7C3AED',
    textClass: 'text-purple-700 dark:text-purple-300',
    iconClass: 'text-purple-600 dark:text-purple-400',
  },
  slate: {
    id: 'slate',
    name: 'Neutral Slate',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    borderClass: 'border-slate-300 dark:border-slate-700',
    dotColor: '#64748B',
    textClass: 'text-slate-700 dark:text-slate-300',
    iconClass: 'text-slate-600 dark:text-slate-400',
  },
};

export const TAG_ICONS_LIST: { id: TagIconId; label: string }[] = [
  { id: 'star', label: 'Star' },
  { id: 'flame', label: 'Flame (Hot)' },
  { id: 'check-circle', label: 'Check Circle' },
  { id: 'alert-triangle', label: 'Alert Triangle' },
  { id: 'shield', label: 'Shield (Protected)' },
  { id: 'bookmark', label: 'Bookmark' },
  { id: 'tag', label: 'Tag' },
  { id: 'heart', label: 'Heart (VIP)' },
  { id: 'zap', label: 'Lightning (Fast)' },
  { id: 'sparkles', label: 'Sparkles' },
];

export const INITIAL_CONTACT_TAGS: ContactTag[] = [
  {
    id: 'tag-hot-lead',
    slug: 'hot-lead',
    name: 'Hot Lead',
    description: 'High-intent buyer actively engaging in live chat conversations.',
    color: 'red',
    icon: 'flame',
    usageCount: 840,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
  },
  {
    id: 'tag-vip',
    slug: 'vip-customer',
    name: 'VIP Customer',
    description: 'High lifetime value account entitled to dedicated SLA windows.',
    color: 'purple',
    icon: 'star',
    usageCount: 1250,
    createdAt: '2026-08-02T11:00:00Z',
    updatedAt: '2026-08-29T14:30:00Z',
  },
  {
    id: 'tag-paid-user',
    slug: 'paid-user',
    name: 'Paid User',
    description: 'Active paid SaaS subscription with verified billing account.',
    color: 'emerald',
    icon: 'shield',
    usageCount: 3120,
    createdAt: '2026-08-03T09:30:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'tag-important',
    slug: 'important-lead',
    name: 'Important Lead',
    description: 'Executive decision maker identified during marketing inbound.',
    color: 'amber',
    icon: 'alert-triangle',
    usageCount: 620,
    createdAt: '2026-08-04T13:15:00Z',
    updatedAt: '2026-08-26T16:45:00Z',
  },
  {
    id: 'tag-priority-support',
    slug: 'priority-support',
    name: 'Priority Support',
    description: 'Tickets escalated directly to Level 2 technical account managers.',
    color: 'blue',
    icon: 'zap',
    usageCount: 480,
    createdAt: '2026-08-05T15:20:00Z',
    updatedAt: '2026-08-27T11:00:00Z',
  },
  {
    id: 'tag-q3-deal',
    slug: 'q3-deal',
    name: 'Q3 Deal',
    description: 'Pipeline opportunity targeted for closure in current quarter.',
    color: 'indigo',
    icon: 'bookmark',
    usageCount: 310,
    createdAt: '2026-08-06T16:00:00Z',
    updatedAt: '2026-08-25T09:30:00Z',
  },
  {
    id: 'tag-onboarding-done',
    slug: 'onboarding-complete',
    name: 'Onboarding Complete',
    description: 'Client finished product setup and verified their first channel.',
    color: 'emerald',
    icon: 'check-circle',
    usageCount: 2400,
    createdAt: '2026-08-07T10:45:00Z',
    updatedAt: '2026-08-29T18:00:00Z',
  },
  {
    id: 'tag-cold-lead',
    slug: 'cold-lead',
    name: 'Cold Lead',
    description: 'Unresponsive or low activity contact eligible for re-engagement drip.',
    color: 'slate',
    icon: 'bookmark',
    usageCount: 720,
    createdAt: '2026-08-08T12:00:00Z',
    updatedAt: '2026-08-24T15:00:00Z',
  },
];

const STORAGE_KEY = 'appnix_crm_tags_v2';

export function generateTagSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function getStoredTags(): ContactTag[] {
  if (typeof window === 'undefined') return INITIAL_CONTACT_TAGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTACT_TAGS));
      return INITIAL_CONTACT_TAGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_CONTACT_TAGS;
  } catch (e) {
    console.error('Failed to parse contact tags from localStorage:', e);
    return INITIAL_CONTACT_TAGS;
  }
}

export function saveStoredTags(tags: ContactTag[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    window.dispatchEvent(new Event('contact-tags-updated'));
  } catch (e) {
    console.error('Failed to save contact tags to localStorage:', e);
  }
}

export function validateTag(
  payload: CreateTagPayload & { id?: string },
  existingTags: ContactTag[] = []
): TagValidationError[] {
  const errors: TagValidationError[] = [];

  if (!payload.name || !payload.name.trim()) {
    errors.push({ field: 'name', message: 'Tag Name is required.' });
  } else if (payload.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Tag Name must be at least 2 characters.' });
  } else if (payload.name.trim().length > 40) {
    errors.push({ field: 'name', message: 'Tag Name cannot exceed 40 characters.' });
  } else {
    const slug = generateTagSlug(payload.name);
    const isDuplicate = existingTags.some(
      (t) => t.slug === slug && t.id !== payload.id
    );
    if (isDuplicate) {
      errors.push({
        field: 'name',
        message: `Tag "${payload.name.trim()}" already exists in your workspace taxonomy.`,
      });
    }
  }

  if (!payload.color) {
    errors.push({ field: 'color', message: 'Please select a tag color.' });
  }

  if (!payload.icon) {
    errors.push({ field: 'icon', message: 'Please select a tag icon.' });
  }

  return errors;
}
