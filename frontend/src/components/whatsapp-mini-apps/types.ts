export type FlowStatus = "DRAFT" | "PENDING" | "PUBLISH";

export type FlowCategory =
  | "Appointment Booking"
  | "Lead Generation"
  | "Customer Support / Inquiry"
  | "Feedback & Survey"
  | "Product Catalog / Order";

export type StartingMethod = "blank" | "template" | "import";

export interface FlowScreenComponent {
  id: string;
  type:
    | "TextHeading"
    | "TextSubheading"
    | "TextBody"
    | "TextInput"
    | "TextArea"
    | "Dropdown"
    | "RadioGroup"
    | "CheckboxGroup"
    | "DatePicker"
    | "Footer";
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  options?: { id: string; title: string }[];
  helperText?: string;
}

export interface FlowScreen {
  id: string;
  title: string;
  terminal?: boolean;
  components: FlowScreenComponent[];
  nextScreenId?: string;
}

export interface FlowTemplate {
  id: string;
  title: string;
  category: FlowCategory;
  description: string;
  iconName: string;
  screensCount: number;
  badge?: string;
  previewFields: string[];
  screens: FlowScreen[];
  rawJson?: string;
}

export interface FlowChannel {
  id: string;
  name: string;
  phoneNumber: string;
  status: "CONNECTED" | "DISCONNECTED";
  wabaId: string;
}

export interface Flow {
  id: string;
  name: string;
  status: FlowStatus;
  channel: string;
  channelId?: string;
  category: FlowCategory;
  startingMethod?: StartingMethod;
  templateId?: string;
  screens?: FlowScreen[];
  rawJson?: string;
  version?: string;
  createdAt: string;
  updatedAt: string;
  responsesCount?: number;
}

export interface QuotaFeature {
  key: string;
  label: string;
  unlocked: boolean;
  description: string;
}

export interface WorkspaceFlowQuota {
  planTier: string;
  maxPublishedFlows: number;
  publishedFlowsUsed: number;
  availableSlots: number;
  percentageUsed: number;
  features: QuotaFeature[];
}

export interface UnlockResult {
  success: boolean;
  message: string;
  data: {
    planTier: string;
    newMaxPublishedFlows: number;
    publishedFlowsUsed: number;
    unlockedFeatures: string[];
  };
}
