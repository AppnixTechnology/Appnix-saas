import { TagNodeConfig, TagNodeExecutionContext, TagNodeExecutionResult } from '@/types/workflow-tag-node';

export interface TagActionStrategy {
  readonly actionType: TagNodeConfig['actionType'];
  execute(
    config: TagNodeConfig,
    context: TagNodeExecutionContext
  ): Promise<TagNodeExecutionResult>;
}
