export type BotChannel = "whatsapp" | "instagram" | "rcs" | "facebook";

export type BotStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DISABLED";

export type BotTriggerType = 
  | "incoming_message"
  | "keyword"
  | "button_click"
  | "list_selection"
  | "webhook"
  | "conversation_started"
  | "contact_created"
  | "scheduled";

export type NodeCategory = 
  | "triggers"
  | "messages"
  | "logic"
  | "input"
  | "ai"
  | "actions"
  | "flow";

export type NodeType = 
  | "incoming_message"
  | "keyword"
  | "button_click"
  | "list_selection"
  | "webhook_trigger"
  | "conversation_started"
  | "contact_created"
  | "scheduled"
  | "text_message"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "template_message"
  | "button_message"
  | "list_message"
  | "carousel"
  | "condition"
  | "switch"
  | "random_split"
  | "ab_test"
  | "user_attribute"
  | "contact_tag"
  | "variable_check"
  | "ask_question"
  | "wait_for_reply"
  | "capture_text"
  | "capture_number"
  | "capture_email"
  | "capture_date"
  | "capture_option"
  | "ai_reply"
  | "ai_intent_detection"
  | "ai_classification"
  | "ai_summarization"
  | "ai_agent"
  | "http_request"
  | "webhook"
  | "update_contact"
  | "add_tag"
  | "remove_tag"
  | "set_variable"
  | "send_email"
  | "create_ticket"
  | "assign_agent"
  | "human_handoff"
  | "delay"
  | "wait_until"
  | "go_to"
  | "end_flow";

export interface BotVariable {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "date" | "json" | "contact_attribute" | "conversation_attribute" | "flow";
  defaultValue?: string;
  description?: string;
  scope: "global" | "flow" | "conversation";
}

export interface BotNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config: Record<string, unknown>;
    enabled: boolean;
    validationStatus: "valid" | "warning" | "error" | "none";
    validationErrors?: string[];
  };
}

export interface BotConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: "default" | "smoothstep" | "step";
  animated?: boolean;
  label?: string;
}

export interface BotWorkflow {
  nodes: BotNode[];
  connections: BotConnection[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface BotTrigger {
  type: BotTriggerType;
  config: Record<string, unknown>;
}

export interface BotSettings {
  general: {
    name: string;
    description: string;
    folderId?: string;
    tags: string[];
  };
  channels: {
    selected: BotChannel[];
    whatsapp?: WhatsAppChannelConfig;
    instagram?: InstagramChannelConfig;
    rcs?: RCSChannelConfig;
    facebook?: FacebookChannelConfig;
  };
  ai: AIConfig;
  variables: BotVariable[];
  knowledge: KnowledgeConfig;
  fallback: FallbackConfig;
  humanHandoff: HumanHandoffConfig;
  notifications: NotificationConfig;
  security: SecurityConfig;
  versions: VersionConfig;
  webhooks: WebhookConfig;
  analytics: AnalyticsConfig;
}

export interface WhatsAppChannelConfig {
  businessAccountId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  webhookUrl?: string;
  verifyToken?: string;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";
  lastSynced?: string;
}

export interface InstagramChannelConfig {
  pageId?: string;
  instagramAccountId?: string;
  accessToken?: string;
  webhookUrl?: string;
  verifyToken?: string;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";
  lastSynced?: string;
}

export interface RCSChannelConfig {
  providerId?: string;
  senderId?: string;
  credentials?: Record<string, string>;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";
  lastSynced?: string;
}

export interface FacebookChannelConfig {
  pageId?: string;
  accessToken?: string;
  webhookUrl?: string;
  verifyToken?: string;
  connected: boolean;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";
  lastSynced?: string;
}

export interface AIConfig {
  provider: "openai" | "azure" | "anthropic";
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  instructions: string;
  businessInfo: string;
  tone: string;
  language: string;
  rules: string;
  restrictions: string;
  escalationRules: string;
  fallbackBehavior: string;
  enabled: boolean;
}

export interface KnowledgeConfig {
  enabled: boolean;
  sources: KnowledgeSource[];
  retrievalStrategy: "semantic" | "keyword" | "hybrid";
  maxResults: number;
  similarityThreshold: number;
}

export interface KnowledgeSource {
  id: string;
  type: "text" | "faq" | "document" | "url" | "product" | "business";
  title: string;
  content?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  metadata?: Record<string, unknown>;
  addedAt: string;
  status: "pending" | "indexed" | "error";
}

export interface FallbackConfig {
  enabled: boolean;
  message: string;
  action: "human_handoff" | "end_flow" | "repeat" | "custom";
  customFlowId?: string;
  maxRetries: number;
}

export interface HumanHandoffConfig {
  enabled: boolean;
  teamId?: string;
  agentId?: string;
  priority: "low" | "medium" | "high" | "urgent";
  reason: string;
  addTag?: string;
  internalNote?: string;
  notifyAgent: boolean;
  preserveContext: boolean;
}

export interface NotificationConfig {
  emailOnError: boolean;
  emailOnHandoff: boolean;
  webhookOnExecution?: string;
  slackWebhook?: string;
}

export interface SecurityConfig {
  encryptVariables: boolean;
  allowExternalWebhooks: boolean;
  allowedDomains: string[];
  rateLimit: number;
}

export interface VersionConfig {
  autoVersion: boolean;
  maxVersions: number;
  versionNotes?: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  method: "POST" | "PUT" | "PATCH";
  headers: Record<string, string>;
  events: string[];
  enabled: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackConversations: boolean;
  trackMessages: boolean;
  trackAI: boolean;
  trackHandoffs: boolean;
  retentionDays: number;
}

export interface Bot {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  folderId?: string;
  tags: string[];
  status: BotStatus;
  channels: BotChannel[];
  trigger: BotTrigger;
  workflow: BotWorkflow;
  settings: BotSettings;
  currentVersion: number;
  publishedVersion?: number;
  publishedWorkflow?: BotWorkflow;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BotVersion {
  id: string;
  botId: string;
  version: number;
  name: string;
  description: string;
  workflow: BotWorkflow;
  settings: BotSettings;
  createdBy: string;
  createdAt: string;
  isPublished: boolean;
  changelog?: string;
}

export interface BotExecution {
  id: string;
  botId: string;
  botVersion: number;
  conversationId: string;
  contactId: string;
  channel: BotChannel;
  status: "running" | "completed" | "failed" | "paused" | "handoff";
  currentNodeId?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  variables: Record<string, unknown>;
  error?: string;
}

export interface ExecutionLog {
  id: string;
  executionId: string;
  nodeId: string;
  nodeType: NodeType;
  status: "success" | "error" | "skipped" | "pending";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  duration: number;
  startedAt: string;
  completedAt?: string;
  apiCalls?: APICallLog[];
  aiCalls?: AICallLog[];
  channelResponses?: ChannelResponseLog[];
}

export interface APICallLog {
  url: string;
  method: string;
  statusCode: number;
  duration: number;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: string;
}

export interface AICallLog {
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  duration: number;
  systemPrompt?: string;
  userPrompt?: string;
  response?: string;
  error?: string;
}

export interface ChannelResponseLog {
  channel: BotChannel;
  messageId?: string;
  status: "sent" | "delivered" | "read" | "failed";
  error?: string;
  timestamp: string;
}

export interface BotAnalytics {
  botId: string;
  period: "day" | "week" | "month" | "all";
  totalConversations: number;
  activeConversations: number;
  completedConversations: number;
  humanHandoffs: number;
  botResolutionRate: number;
  messagesSent: number;
  messagesReceived: number;
  aiResponses: number;
  aiFailures: number;
  avgResponseTime: number;
  conversionRate: number;
  dropOffRate: number;
  topIntents: Array<{ intent: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  channelPerformance: Record<BotChannel, { conversations: number; messages: number; handoffs: number }>;
}

export interface Conversation {
  id: string;
  botId: string;
  contactId: string;
  channel: BotChannel;
  status: "active" | "completed" | "handoff" | "archived";
  currentFlowId?: string;
  currentNodeId?: string;
  startedAt: string;
  lastMessageAt: string;
  assignedAgentId?: string;
  tags: string[];
  variables: Record<string, unknown>;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  type: "text" | "image" | "video" | "audio" | "document" | "button" | "list" | "template" | "system";
  content: string;
  metadata?: Record<string, unknown>;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
  nodeId?: string;
  timestamp: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color?: string;
  botCount: number;
  createdAt: string;
}

export interface NodeDefinition {
  type: NodeType;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  inputs: NodePort[];
  outputs: NodePort[];
  configSchema: NodeConfigSchema;
  supportedChannels: BotChannel[];
  requiresAI?: boolean;
  requiresAPI?: boolean;
}

export interface NodePort {
  id: string;
  label: string;
  type: "trigger" | "action" | "condition" | "data";
  multiple?: boolean;
}

export interface NodeConfigSchema {
  fields: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "boolean" | "number" | "json" | "url" | "variable_picker" | "channel_picker" | "template_picker" | "condition_builder" | "message_editor" | "variable_editor" | "ai_instructions" | "knowledge_picker";
  required?: boolean;
  default?: unknown;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => string | null;
  };
  dependsOn?: string;
  showWhen?: Record<string, unknown>;
}

export interface TestSimulatorState {
  isOpen: boolean;
  conversationId?: string;
  messages: TestMessage[];
  currentNodeId?: string;
  variables: Record<string, unknown>;
  executionPath: TestExecutionStep[];
}

export interface TestMessage {
  id: string;
  direction: "inbound" | "outbound";
  type: "text" | "button" | "list" | "image" | "system";
  content: string;
  timestamp: string;
  nodeId?: string;
}

export interface TestExecutionStep {
  nodeId: string;
  nodeType: NodeType;
  status: "pending" | "running" | "success" | "error" | "skipped";
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  duration?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  nodeId: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationWarning {
  nodeId: string;
  field: string;
  message: string;
}

export interface PublishValidationResult {
  valid: boolean;
  checks: PublishCheck[];
}

export interface PublishCheck {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
  severity: "error" | "warning" | "info";
}

export interface CreateBotData {
  name: string;
  description: string;
  folderId?: string;
  tags: string[];
  channels: BotChannel[];
  status: BotStatus;
}

export interface UpdateBotData extends Partial<CreateBotData> {
  workflow?: BotWorkflow;
  settings?: Partial<BotSettings>;
}