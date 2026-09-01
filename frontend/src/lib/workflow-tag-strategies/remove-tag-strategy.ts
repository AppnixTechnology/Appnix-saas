import { TagActionStrategy } from './types';
import { TagNodeConfig, TagNodeExecutionContext, TagNodeExecutionResult } from '@/types/workflow-tag-node';
import { ContactTag } from '@/types/contact-tag';

export class RemoveTagStrategy implements TagActionStrategy {
  readonly actionType = 'REMOVE_TAG' as const;

  async execute(
    config: TagNodeConfig,
    context: TagNodeExecutionContext
  ): Promise<TagNodeExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[Strategy] Initializing RemoveTagStrategy for contact "${context.resolvedContactId}"`);
    logs.push(`[Input] Tag values to detach: ${JSON.stringify(config.tagValues)} (Mode: ${config.identificationMode})`);

    const tagsToRemove = new Set<string>();
    const removedTags: ContactTag[] = [];

    for (const tagVal of config.tagValues) {
      const trimmed = tagVal.trim().toLowerCase();
      if (!trimmed) continue;

      const matchedContactTag = context.existingContactTags.find((t) => {
        if (config.identificationMode === 'ID') {
          return t.id.toLowerCase() === trimmed;
        }
        return t.name.toLowerCase() === trimmed || t.slug.toLowerCase() === trimmed;
      });

      if (matchedContactTag) {
        tagsToRemove.add(matchedContactTag.id);
        removedTags.push(matchedContactTag);
        logs.push(`[Detached] Identified tag to remove: "${matchedContactTag.name}" (${matchedContactTag.id})`);
      } else {
        logs.push(`[Info] Tag "${tagVal}" is not currently assigned to this contact`);
      }
    }

    const resultingContactTags = context.existingContactTags.filter(
      (t) => !tagsToRemove.has(t.id)
    );

    logs.push(`[Success] Detached ${removedTags.length} tags from contact (Remaining tags: ${resultingContactTags.length})`);

    const duration = Math.round(performance.now() - startTime);

    return {
      status: 'SUCCESS',
      actionType: this.actionType,
      resolvedContactId: context.resolvedContactId,
      resolvedContactName: context.resolvedContactName,
      affectedTags: removedTags,
      newTagsCreated: [],
      removedTags,
      resultingContactTags,
      executionDurationMs: duration,
      timestamp: new Date().toISOString(),
      logs,
    };
  }
}
