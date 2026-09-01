import { TagActionStrategy } from './types';
import { TagNodeConfig, TagNodeExecutionContext, TagNodeExecutionResult } from '@/types/workflow-tag-node';
import { ContactTag } from '@/types/contact-tag';
import { generateTagSlug, saveStoredTags } from '../contact-tags';

export class AssignAndCreateIfMissingStrategy implements TagActionStrategy {
  readonly actionType = 'ASSIGN_AND_CREATE' as const;

  async execute(
    config: TagNodeConfig,
    context: TagNodeExecutionContext
  ): Promise<TagNodeExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[Strategy] Initializing AssignAndCreateIfMissingStrategy for contact "${context.resolvedContactId}"`);
    logs.push(`[Input] Tag values to attach/create: ${JSON.stringify(config.tagValues)} (Mode: ${config.identificationMode})`);

    const affectedTags: ContactTag[] = [];
    const newTagsCreated: ContactTag[] = [];
    let workspaceTaxonomy = [...context.allWorkspaceTags];

    for (const tagVal of config.tagValues) {
      const trimmed = tagVal.trim();
      if (!trimmed) continue;

      let matchedTag: ContactTag | undefined;
      if (config.identificationMode === 'ID') {
        matchedTag = workspaceTaxonomy.find((t) => t.id === trimmed);
      } else {
        matchedTag = workspaceTaxonomy.find(
          (t) => t.name.toLowerCase() === trimmed.toLowerCase() || t.slug === trimmed.toLowerCase()
        );
      }

      if (matchedTag) {
        affectedTags.push(matchedTag);
        logs.push(`[Matched] Found existing tag: "${matchedTag.name}" (${matchedTag.id})`);
      } else {
        // Automatically create new tag in workspace taxonomy
        const newSlug = generateTagSlug(trimmed);
        const autoCreatedTag: ContactTag = {
          id: `tag-${newSlug}-${Date.now().toString().slice(-4)}`,
          slug: newSlug,
          name: trimmed,
          description: 'Auto-provisioned via Workflow Tag Action Node',
          color: config.defaultFallbackColor || 'slate',
          icon: config.defaultFallbackIcon || 'tag',
          usageCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        newTagsCreated.push(autoCreatedTag);
        affectedTags.push(autoCreatedTag);
        workspaceTaxonomy = [autoCreatedTag, ...workspaceTaxonomy];
        logs.push(`[Auto-Create] Created new taxonomy tag: "${autoCreatedTag.name}" (Color: ${autoCreatedTag.color})`);
      }
    }

    // Persist newly created tags to workspace storage
    if (newTagsCreated.length > 0) {
      saveStoredTags(workspaceTaxonomy);
      logs.push(`[Persistence] Registered ${newTagsCreated.length} new tags to workspace database`);
    }

    // Merge with existing contact tags
    const existingIds = new Set(context.existingContactTags.map((t) => t.id));
    const newlyAdded = affectedTags.filter((t) => !existingIds.has(t.id));
    const resultingContactTags = [...context.existingContactTags, ...newlyAdded];

    logs.push(`[Success] Attached ${newlyAdded.length} new tags to contact (Total tags on contact: ${resultingContactTags.length})`);

    const duration = Math.round(performance.now() - startTime);

    return {
      status: 'SUCCESS',
      actionType: this.actionType,
      resolvedContactId: context.resolvedContactId,
      resolvedContactName: context.resolvedContactName,
      affectedTags,
      newTagsCreated,
      removedTags: [],
      resultingContactTags,
      executionDurationMs: duration,
      timestamp: new Date().toISOString(),
      logs,
    };
  }
}
