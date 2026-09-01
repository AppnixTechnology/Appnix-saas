import { TagActionStrategy } from './types';
import { TagNodeConfig, TagNodeExecutionContext, TagNodeExecutionResult } from '@/types/workflow-tag-node';
import { ContactTag } from '@/types/contact-tag';

export class AssignExistingTagStrategy implements TagActionStrategy {
  readonly actionType = 'ASSIGN_EXISTING' as const;

  async execute(
    config: TagNodeConfig,
    context: TagNodeExecutionContext
  ): Promise<TagNodeExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[Strategy] Initializing AssignExistingTagStrategy for contact "${context.resolvedContactId}"`);
    logs.push(`[Input] Tag values to attach: ${JSON.stringify(config.tagValues)} (Mode: ${config.identificationMode})`);

    const affectedTags: ContactTag[] = [];
    const missingTags: string[] = [];

    for (const tagVal of config.tagValues) {
      const trimmed = tagVal.trim();
      if (!trimmed) continue;

      let matchedTag: ContactTag | undefined;
      if (config.identificationMode === 'ID') {
        matchedTag = context.allWorkspaceTags.find((t) => t.id === trimmed);
      } else {
        matchedTag = context.allWorkspaceTags.find(
          (t) => t.name.toLowerCase() === trimmed.toLowerCase() || t.slug === trimmed.toLowerCase()
        );
      }

      if (matchedTag) {
        affectedTags.push(matchedTag);
        logs.push(`[Matched] Found registered tag: "${matchedTag.name}" (${matchedTag.id})`);
      } else {
        missingTags.push(trimmed);
        logs.push(`[Warning] Tag "${trimmed}" does not exist in workspace taxonomy (Skipped)`);
      }
    }

    // Merge with existing contact tags without duplicates
    const existingIds = new Set(context.existingContactTags.map((t) => t.id));
    const newlyAdded = affectedTags.filter((t) => !existingIds.has(t.id));
    const resultingContactTags = [...context.existingContactTags, ...newlyAdded];

    logs.push(`[Success] Attached ${newlyAdded.length} new tags to contact (Total tags on contact: ${resultingContactTags.length})`);

    const duration = Math.round(performance.now() - startTime);

    return {
      status: missingTags.length > 0 && affectedTags.length === 0 ? 'WARNING' : 'SUCCESS',
      actionType: this.actionType,
      resolvedContactId: context.resolvedContactId,
      resolvedContactName: context.resolvedContactName,
      affectedTags,
      newTagsCreated: [],
      removedTags: [],
      resultingContactTags,
      executionDurationMs: duration,
      timestamp: new Date().toISOString(),
      logs,
      error: missingTags.length > 0 && affectedTags.length === 0 ? `Tags not found in workspace: ${missingTags.join(', ')}` : undefined,
    };
  }
}
