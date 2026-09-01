export type TagColorId =
  | 'red'
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'slate';

export type TagIconId =
  | 'star'
  | 'flame'
  | 'check-circle'
  | 'alert-triangle'
  | 'shield'
  | 'bookmark'
  | 'tag'
  | 'heart'
  | 'zap'
  | 'sparkles';

export interface TagColorConfig {
  id: TagColorId;
  name: string;
  badgeClass: string;
  borderClass: string;
  dotColor: string;
  textClass: string;
  iconClass: string;
}

export interface ContactTag {
  id: string;
  slug: string; // e.g. "hot-lead", "vip-customer"
  name: string; // e.g. "Hot Lead", "VIP Customer"
  description?: string;
  color: TagColorId;
  icon: TagIconId;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagPayload {
  name: string;
  description?: string;
  color: TagColorId;
  icon: TagIconId;
}

export interface UpdateTagPayload {
  id: string;
  name: string;
  description?: string;
  color: TagColorId;
  icon: TagIconId;
}

export interface TagValidationError {
  field: string;
  message: string;
}

export interface ContactTagAssignment {
  contactId: string;
  tagIds: string[];
}
