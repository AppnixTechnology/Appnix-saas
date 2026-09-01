import { TagActionStrategy } from './types';
import { AssignExistingTagStrategy } from './assign-existing-strategy';
import { AssignAndCreateIfMissingStrategy } from './assign-create-strategy';
import { RemoveTagStrategy } from './remove-tag-strategy';
import {
  TagNodeConfig,
  TagNodeExecutionContext,
  TagNodeExecutionResult,
} from '@/types/workflow-tag-node';
import { getStoredTags } from '../contact-tags';

const STRATEGY_REGISTRY: Record<string, TagActionStrategy> = {
  ASSIGN_EXISTING: new AssignExistingTagStrategy(),
  ASSIGN_AND_CREATE: new AssignAndCreateIfMissingStrategy(),
  REMOVE_TAG: new RemoveTagStrategy(),
};

export function resolveVariableToken(
  tokenPattern: string,
  samplePayload: Record<string, any>
): string {
  const trimmed = tokenPattern.trim();
  if (!trimmed) return 'contact-sample-1';

  // If token format is {{webhook.data.contact_id}}
  const match = trimmed.match(/\{\{([a-zA-Z0-9_.]+)\}\}/);
  if (match && match[1]) {
    const pathParts = match[1].split('.');
    let current: any = samplePayload;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    if (current !== null && current !== undefined) {
      return String(current);
    }
  }

  // If not a token, return literal string
  return trimmed;
}

export async function executeTagActionNode(
  config: TagNodeConfig,
  samplePayload: Record<string, any> = {},
  existingContactTags: any[] = []
): Promise<TagNodeExecutionResult> {
  const allWorkspaceTags = getStoredTags();
  const resolvedContactId = resolveVariableToken(
    config.targetContactMapping,
    samplePayload
  );

  const context: TagNodeExecutionContext = {
    nodeId: config.id,
    triggerEventId: `evt_${Date.now()}`,
    samplePayload,
    resolvedContactId,
    resolvedContactName: samplePayload?.contact?.name || 'Sample Contact',
    existingContactTags,
    allWorkspaceTags,
  };

  const strategy = STRATEGY_REGISTRY[config.actionType];
  if (!strategy) {
    throw new Error(`Unsupported tag action strategy: ${config.actionType}`);
  }

  return strategy.execute(config, context);
}
