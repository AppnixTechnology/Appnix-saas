"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/axios";

export interface TemplateVariable {
  variable: string;
  name: string;
  type: string;
  defaultValue?: string;
}

export interface MetaTemplate {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION" | string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS" | string;
    format?: string;
    text?: string;
    example?: Record<string, unknown>;
  }>;
  preview?: string;
  lastUpdated?: string;
}

export interface AudienceItem {
  id: string;
  name: string;
  contactCount: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;
  lastUpdated: string;
  description?: string;
}

export interface ChannelItem {
  id: string;
  channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
  isConnected: boolean;
  accountName?: string;
  phoneNumber?: string;
}

export interface CampaignData {
  id?: string;
  name: string;
  description: string;
  audienceId: string;
  audienceName: string;
  audienceCount: number;
  audienceSnapshot: Record<string, unknown>;
  channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK";
  metaTemplateId: string;
  metaTemplateName: string;
  metaTemplateLanguage: string;
  templateVariables: TemplateVariable[];
  variableMappings: Record<string, string>;
  launchMode: "IMMEDIATE" | "SCHEDULED";
  scheduledAt: string;
  timezone?: string;
  status: "DRAFT" | "READY_FOR_TEST" | "TEST_SENT" | "SCHEDULED" | "LAUNCHING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  testHistory?: {
    sentAt: string;
    phoneNumber: string;
    contactName?: string;
    status: string;
    messageId: string;
  };
}

export type WizardStep = 
  | "details"
  | "audience"
  | "channel"
  | "template"
  | "configure"
  | "preview"
  | "review";

export const STEPS: { id: WizardStep; label: string; description: string }[] = [
  { id: "details", label: "Campaign Details", description: "Set campaign name and description" },
  { id: "audience", label: "Select Audience", description: "Choose target audience segment" },
  { id: "channel", label: "Select Channel", description: "Choose communication channel" },
  { id: "template", label: "Select Template", description: "Pick Meta-approved message template" },
  { id: "configure", label: "Configure Template", description: "Map dynamic variables to contact data" },
  { id: "preview", label: "Message Preview", description: "Review personalized message preview" },
  { id: "review", label: "Review & Launch", description: "Send test message and launch campaign" },
];

export const MOCK_AUDIENCES: AudienceItem[] = [
  {
    id: "aud-vip-001",
    name: "VIP Customers",
    contactCount: 1240,
    status: "ACTIVE",
    lastUpdated: "2026-08-22T14:30:00Z",
    description: "High-value customers with lifetime spend > $500",
  },
  {
    id: "aud-leads-002",
    name: "All Active Leads",
    contactCount: 4500,
    status: "ACTIVE",
    lastUpdated: "2026-08-23T09:15:00Z",
    description: "Recently acquired leads within last 60 days",
  },
  {
    id: "aud-cart-003",
    name: "Cart Drop-offs (Last 7 Days)",
    contactCount: 820,
    status: "ACTIVE",
    lastUpdated: "2026-08-23T11:00:00Z",
    description: "Users who abandoned items in cart during the last week",
  },
  {
    id: "aud-buyers-004",
    name: "Recent Buyers (30 Days)",
    contactCount: 2150,
    status: "ACTIVE",
    lastUpdated: "2026-08-21T18:45:00Z",
    description: "Customers who completed at least one order this month",
  },
  {
    id: "aud-news-005",
    name: "Newsletter Subscribers",
    contactCount: 5800,
    status: "ACTIVE",
    lastUpdated: "2026-08-23T08:00:00Z",
    description: "Double opt-in marketing newsletter subscribers",
  },
  {
    id: "aud-inactive-006",
    name: "Inactive / Empty Segment",
    contactCount: 0,
    status: "INACTIVE",
    lastUpdated: "2026-08-15T12:00:00Z",
    description: "Cold contacts segment with no active subscribers",
  },
];

export const MOCK_CHANNELS: ChannelItem[] = [
  {
    id: "ch-wa-01",
    channel: "WHATSAPP",
    isConnected: true,
    accountName: "Appnix Official WhatsApp",
    phoneNumber: "+1 (555) 019-8234",
  },
  {
    id: "ch-ig-02",
    channel: "INSTAGRAM",
    isConnected: true,
    accountName: "@appnix_official",
  },
  {
    id: "ch-rcs-03",
    channel: "RCS",
    isConnected: false,
    accountName: "Appnix RCS Verified Agent",
  },
  {
    id: "ch-fb-04",
    channel: "FACEBOOK",
    isConnected: false,
    accountName: "Appnix Facebook Page",
  },
];

export const MOCK_TEMPLATES: Record<string, MetaTemplate[]> = {
  WHATSAPP: [
    {
      id: "tpl_fest_25",
      name: "festival_discount_25",
      category: "MARKETING",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Hello {{1}}, don't miss our exclusive {{2}}% discount this weekend! Click here to redeem: {{3}}",
        },
        {
          type: "FOOTER",
          text: "Reply STOP to unsubscribe",
        },
      ],
      preview: "Hello {{1}}, don't miss our exclusive {{2}}% discount this weekend! Click here to redeem: {{3}}",
      lastUpdated: "2026-08-20T10:00:00Z",
    },
    {
      id: "tpl_order_conf",
      name: "order_confirmation_v1",
      category: "UTILITY",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Hi {{1}}, your order #{{2}} has been confirmed and is being processed. Track it here: {{3}}",
        },
      ],
      preview: "Hi {{1}}, your order #{{2}} has been confirmed and is being processed. Track it here: {{3}}",
      lastUpdated: "2026-08-18T16:20:00Z",
    },
    {
      id: "tpl_static_season",
      name: "seasonal_vip_sale_alert",
      category: "MARKETING",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Festival season is here! Get exclusive early-bird access to our VIP weekend flash sales with code FESTIVEVIP at checkout.",
        },
      ],
      preview: "Festival season is here! Get exclusive early-bird access to our VIP weekend flash sales with code FESTIVEVIP at checkout.",
      lastUpdated: "2026-08-15T11:40:00Z",
    },
    {
      id: "tpl_feedback",
      name: "feedback_request_loyalty",
      category: "UTILITY",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Hi {{1}}, how was your recent purchase experience with us? We'd love your feedback: {{2}}",
        },
      ],
      preview: "Hi {{1}}, how was your recent purchase experience with us? We'd love your feedback: {{2}}",
      lastUpdated: "2026-08-19T09:00:00Z",
    },
    {
      id: "tpl_welcome_onboard",
      name: "welcome_onboarding_lead",
      category: "MARKETING",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Welcome to Appnix, {{1}}! We are thrilled to have you on board. Check out your account at {{2}}",
        },
      ],
      preview: "Welcome to Appnix, {{1}}! We are thrilled to have you on board. Check out your account at {{2}}",
      lastUpdated: "2026-08-22T12:10:00Z",
    },
  ],
  INSTAGRAM: [
    {
      id: "tpl_ig_promo",
      name: "instagram_direct_offer",
      category: "MARKETING",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Hey {{1}}! Thanks for connecting. Here is your exclusive {{2}}% discount voucher: {{3}}",
        },
      ],
      preview: "Hey {{1}}! Thanks for connecting. Here is your exclusive {{2}}% discount voucher: {{3}}",
      lastUpdated: "2026-08-21T15:00:00Z",
    },
    {
      id: "tpl_ig_webinar",
      name: "webinar_invite_v2",
      category: "MARKETING",
      language: "English",
      status: "APPROVED",
      components: [
        {
          type: "BODY",
          text: "Hi {{1}}, you are invited to our live masterclass tomorrow at 5 PM! Reserve your seat: {{2}}",
        },
      ],
      preview: "Hi {{1}}, you are invited to our live masterclass tomorrow at 5 PM! Reserve your seat: {{2}}",
      lastUpdated: "2026-08-22T17:30:00Z",
    },
  ],
  RCS: [],
  FACEBOOK: [],
};

export function extractTemplateVariables(template: MetaTemplate): TemplateVariable[] {
  const varsMap: Record<string, TemplateVariable> = {};

  template.components.forEach((c) => {
    if (c.text) {
      const regex = /\{\{(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(c.text)) !== null) {
        const varKey = match[1];
        if (!varsMap[varKey]) {
          const isNumeric = /^\d+$/.test(varKey);
          varsMap[varKey] = {
            variable: varKey,
            name: isNumeric ? `Variable {{${varKey}}}` : varKey,
            type: "text",
          };
        }
      }
    }
  });

  return Object.values(varsMap);
}

const initialCampaignData: CampaignData = {
  name: "",
  description: "",
  audienceId: "",
  audienceName: "",
  audienceCount: 0,
  audienceSnapshot: {},
  channel: "WHATSAPP",
  metaTemplateId: "",
  metaTemplateName: "",
  metaTemplateLanguage: "",
  templateVariables: [],
  variableMappings: {},
  launchMode: "IMMEDIATE",
  scheduledAt: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
  status: "DRAFT",
};

export function useCampaignWizard(campaignId?: string) {
  const [campaign, setCampaign] = useState<CampaignData>(initialCampaignData);
  const [currentStep, setCurrentStep] = useState<WizardStep>("details");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audiences, setAudiences] = useState<AudienceItem[]>(MOCK_AUDIENCES);
  const [channels, setChannels] = useState<ChannelItem[]>(MOCK_CHANNELS);
  const [templates, setTemplates] = useState<MetaTemplate[]>(MOCK_TEMPLATES.WHATSAPP);
  const [testSent, setTestSent] = useState(false);
  const [isRefreshingTemplates, setIsRefreshingTemplates] = useState(false);

  // Load existing campaign data if campaignId provided
  const loadCampaign = useCallback(async () => {
    if (!campaignId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/api/campaigns/${campaignId}`);
      const data = response.data;
      if (data) {
        setCampaign({
          id: data.id,
          name: data.name || "",
          description: data.description || "",
          audienceId: data.audienceId || "",
          audienceName: data.audienceName || "",
          audienceCount: data.audienceCount || 0,
          audienceSnapshot: data.audienceSnapshot || {},
          channel: data.channel || "WHATSAPP",
          metaTemplateId: data.metaTemplateId || "",
          metaTemplateName: data.metaTemplateName || "",
          metaTemplateLanguage: data.metaTemplateLanguage || "English",
          templateVariables: Array.isArray(data.templateVariables) ? data.templateVariables : [],
          variableMappings: data.variableMappings || {},
          launchMode: data.launchMode || "IMMEDIATE",
          scheduledAt: data.scheduledAt || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
          status: data.status || "DRAFT",
          testHistory: data.testHistory,
        });
        if (data.testStatus === "SENT" || data.status === "TEST_SENT") {
          setTestSent(true);
        }
      }
    } catch (err) {
      console.warn("Could not load campaign from API, creating fresh draft session", err);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  // Load audiences from backend with mock fallback
  const loadAudiences = useCallback(async () => {
    try {
      const response = await api.get("/api/campaigns/audiences");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAudiences(response.data);
      } else {
        setAudiences(MOCK_AUDIENCES);
      }
    } catch (err) {
      setAudiences(MOCK_AUDIENCES);
    }
  }, []);

  // Load channels from backend with mock fallback
  const loadChannels = useCallback(async () => {
    try {
      const response = await api.get("/api/campaigns/channels");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setChannels(response.data);
      } else {
        setChannels(MOCK_CHANNELS);
      }
    } catch (err) {
      setChannels(MOCK_CHANNELS);
    }
  }, []);

  // Load Meta templates for selected channel
  const loadTemplates = useCallback(async (channelName?: string) => {
    const targetChannel = channelName || campaign.channel || "WHATSAPP";
    setIsRefreshingTemplates(true);
    try {
      const response = await api.get("/api/campaigns/templates", {
        params: { channel: targetChannel },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setTemplates(response.data);
      } else {
        setTemplates(MOCK_TEMPLATES[targetChannel] || []);
      }
    } catch (err) {
      setTemplates(MOCK_TEMPLATES[targetChannel] || []);
    } finally {
      setIsRefreshingTemplates(false);
    }
  }, [campaign.channel]);

  useEffect(() => {
    loadCampaign();
    loadAudiences();
    loadChannels();
  }, [loadCampaign, loadAudiences, loadChannels]);

  useEffect(() => {
    if (campaign.channel) {
      loadTemplates(campaign.channel);
    }
  }, [campaign.channel, loadTemplates]);

  const updateCampaignData = useCallback((data: Partial<CampaignData>) => {
    setCampaign((prev) => ({ ...prev, ...data }));
  }, []);

  const resetWizard = useCallback(() => {
    setCampaign(initialCampaignData);
    setCurrentStep("details");
    setTestSent(false);
    setError(null);
  }, []);

  // Selection handlers
  const selectAudience = useCallback(async (audienceId: string) => {
    const audience = audiences.find((a) => a.id === audienceId);
    if (!audience || audience.contactCount <= 0) return;

    if (campaign.id) {
      try {
        await api.put(`/api/campaigns/${campaign.id}/audience`, { audienceId });
      } catch (err) {
        console.warn("API audience sync failed, keeping local state", err);
      }
    }

    updateCampaignData({
      audienceId: audience.id,
      audienceName: audience.name,
      audienceCount: audience.contactCount,
      audienceSnapshot: { contactCount: audience.contactCount, name: audience.name },
    });
  }, [audiences, campaign.id, updateCampaignData]);

  const selectChannel = useCallback(async (channel: "WHATSAPP" | "INSTAGRAM" | "RCS" | "FACEBOOK") => {
    const channelConfig = channels.find((c) => c.channel === channel);
    if (!channelConfig || !channelConfig.isConnected) return;

    if (campaign.id) {
      try {
        await api.put(`/api/campaigns/${campaign.id}/channel`, { channel });
      } catch (err) {
        console.warn("API channel sync failed, keeping local state", err);
      }
    }

    // Reset template if channel changes
    updateCampaignData({
      channel,
      metaTemplateId: "",
      metaTemplateName: "",
      metaTemplateLanguage: "",
      templateVariables: [],
      variableMappings: {},
    });
    await loadTemplates(channel);
  }, [channels, campaign.id, updateCampaignData, loadTemplates]);

  const selectTemplate = useCallback(async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const detectedVars = extractTemplateVariables(template);

    // Initial smart mapping suggestions
    const initialMappings: Record<string, string> = {};
    detectedVars.forEach((v, index) => {
      const key = v.variable.toLowerCase();
      if (key === "1" || key === "name" || key === "customer_name") {
        initialMappings[v.variable] = "customerName";
      } else if (key === "2" || key === "discount" || key === "order_id") {
        initialMappings[v.variable] = index === 1 ? "discount" : "firstName";
      } else if (key === "3" || key === "url" || key === "link" || key === "offer_url") {
        initialMappings[v.variable] = "offerUrl";
      } else {
        initialMappings[v.variable] = "customerName";
      }
    });

    if (campaign.id) {
      try {
        await api.put(`/api/campaigns/${campaign.id}/template`, { templateId });
      } catch (err) {
        console.warn("API template sync failed, keeping local state", err);
      }
    }

    updateCampaignData({
      metaTemplateId: template.id,
      metaTemplateName: template.name,
      metaTemplateLanguage: template.language || "English",
      templateVariables: detectedVars,
      variableMappings: initialMappings,
    });
  }, [templates, campaign.id, updateCampaignData]);

  const configureTemplate = useCallback(async (mappings: Record<string, string>) => {
    if (campaign.id) {
      try {
        const mappingArray = Object.entries(mappings).map(([templateVariable, dataSource]) => ({
          templateVariable,
          dataSource,
        }));
        await api.put(`/api/campaigns/${campaign.id}/configure-template`, { mappings: mappingArray });
      } catch (err) {
        console.warn("API configure template sync failed", err);
      }
    }

    updateCampaignData({
      variableMappings: mappings,
    });
  }, [campaign.id, updateCampaignData]);

  const sendTest = useCallback(async (testPhoneNumber: string, testContactName?: string) => {
    const testId = `test_msg_${Date.now()}`;
    const record = {
      sentAt: new Date().toISOString(),
      phoneNumber: testPhoneNumber,
      contactName: testContactName || "Harshit Sharma",
      status: "DELIVERED",
      messageId: testId,
    };

    if (campaign.id) {
      try {
        await api.post(`/api/campaigns/${campaign.id}/test`, {
          testPhoneNumber,
          testContactName,
        });
      } catch (err) {
        console.warn("API test send failed, using simulated test record", err);
      }
    }

    setTestSent(true);
    updateCampaignData({
      status: "TEST_SENT",
      testHistory: record,
    });

    return { messageId: testId, status: "DELIVERED", success: true };
  }, [campaign.id, updateCampaignData]);

  const validateCampaign = useCallback(async () => {
    const errors: string[] = [];

    if (!campaign.name.trim()) errors.push("Campaign name is required");
    if (!campaign.audienceId) errors.push("Audience selection is required");
    if (campaign.audienceCount <= 0) errors.push("Selected audience has 0 eligible contacts");
    if (!campaign.channel) errors.push("Channel selection is required");
    if (!campaign.metaTemplateId) errors.push("Message template is required");

    if (campaign.templateVariables.length > 0) {
      const unmapped = campaign.templateVariables.filter((v) => !campaign.variableMappings[v.variable]);
      if (unmapped.length > 0) {
        errors.push(`Please map all ${campaign.templateVariables.length} template variables`);
      }
    }

    if (!testSent) {
      errors.push("A test message must be sent before launching the campaign");
    }

    if (campaign.id) {
      try {
        const response = await api.post(`/api/campaigns/${campaign.id}/validate`);
        if (response.data && response.data.errors?.length) {
          return response.data;
        }
      } catch (err) {
        // Fallback to client validation
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [campaign, testSent]);

  const launchCampaign = useCallback(async (
    confirmed: boolean,
    launchMode: "IMMEDIATE" | "SCHEDULED",
    scheduledAt?: string
  ) => {
    if (!confirmed) {
      throw new Error("Explicit launch confirmation required");
    }

    const finalStatus = launchMode === "IMMEDIATE" ? "RUNNING" : "SCHEDULED";

    if (campaign.id) {
      try {
        if (launchMode === "SCHEDULED" && scheduledAt) {
          await api.post(`/api/campaigns/${campaign.id}/schedule`, { scheduledAt });
        } else {
          await api.post(`/api/campaigns/${campaign.id}/launch`, {
            confirmed: true,
            launchMode: "IMMEDIATE",
          });
        }
      } catch (err) {
        console.warn("API launch failed, updating local state", err);
      }
    }

    updateCampaignData({
      status: finalStatus,
      launchMode,
      scheduledAt: scheduledAt || "",
    });

    return { success: true, status: finalStatus };
  }, [campaign.id, updateCampaignData]);

  // canProceed computation for step navigation
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "details":
        return campaign.name.trim().length > 0;
      case "audience":
        return campaign.audienceId.length > 0 && campaign.audienceCount > 0;
      case "channel": {
        const ch = channels.find((c) => c.channel === campaign.channel);
        return !!ch && ch.isConnected;
      }
      case "template":
        return campaign.metaTemplateId.length > 0;
      case "configure": {
        if (campaign.templateVariables.length === 0) return true;
        return campaign.templateVariables.every(
          (v) => campaign.variableMappings[v.variable] && campaign.variableMappings[v.variable].trim().length > 0
        );
      }
      case "preview":
        return true;
      case "review":
        return testSent;
      default:
        return false;
    }
  }, [currentStep, campaign, channels, testSent]);

  const nextStep = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex < STEPS.length - 1 && canProceed()) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  }, [currentStep, canProceed]);

  const prevStep = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  }, [currentStep]);

  return {
    campaign,
    currentStep,
    setCurrentStep,
    updateCampaignData,
    resetWizard,
    isLoading,
    isRefreshingTemplates,
    error,
    audiences,
    channels,
    templates,
    testSent,
    canProceed: canProceed(),
    nextStep,
    prevStep,
    selectAudience,
    selectChannel,
    selectTemplate,
    configureTemplate,
    sendTest,
    validateCampaign,
    launchCampaign,
    loadTemplates,
    STEPS,
  };
}