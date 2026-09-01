import { ContactTag, TagColorId, TagIconId } from './contact-tag';

export type TagActionType =
  | 'ASSIGN_AND_CREATE'
  | 'ASSIGN_EXISTING'
  | 'REMOVE_TAG';

export type TagIdentificationMode = 'NAME' | 'ID';

export interface TagNodeConfig {
  id: string;
  name: string;
  actionType: TagActionType;
  targetContactMapping: string; // e.g. "{{webhook.data.contact_id}}" or direct phone/ID
  identificationMode: TagIdentificationMode;
  tagValues: string[]; // parsed tags e.g. ["VIP", "Priority Support", "Q3 Deal"]
  rawTagString: string; // raw input e.g. "VIP, Priority Support, Q3 Deal"
  defaultFallbackColor?: TagColorId;
  defaultFallbackIcon?: TagIconId;
}

export interface TagNodeExecutionContext {
  nodeId: string;
  triggerEventId: string;
  samplePayload: Record<string, any>;
  resolvedContactId: string;
  resolvedContactName?: string;
  existingContactTags: ContactTag[];
  allWorkspaceTags: ContactTag[];
}

export interface TagNodeExecutionResult {
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  actionType: TagActionType;
  resolvedContactId: string;
  resolvedContactName?: string;
  affectedTags: ContactTag[];
  newTagsCreated: ContactTag[];
  removedTags: ContactTag[];
  resultingContactTags: ContactTag[];
  executionDurationMs: number;
  timestamp: string;
  logs: string[];
  error?: string;
}
