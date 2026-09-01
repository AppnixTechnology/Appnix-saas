"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Smartphone,
  Layers,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RCSTemplate,
  RCSCategory,
  RCSMessageType,
  RCSMediaType,
  RCSMediaHeight,
  RCSMediaRatio,
  RCSActionType,
  RCSAction,
  RCSCard,
  RCSTemplateVariable,
  RCSValidationError,
} from "@/types/rcs-template";
import {
  VERIFIED_RCS_AGENTS,
  RCS_CATEGORY_CONFIG,
  STANDARD_DATA_SOURCES,
  getStoredRCSTemplates,
  saveStoredRCSTemplates,
  extractVariablesFromText,
  validateRCSTemplate,
} from "@/lib/rcs-templates";
import { RCSPhonePreview } from "./RCSPhonePreview";
import { RCSSubmitApprovalModal } from "./RCSSubmitApprovalModal";
import { cn } from "@/lib/utils";

interface RCSTemplateFormProps {
  initialData?: RCSTemplate;
  isEditMode?: boolean;
  onSuccess?: (savedTemplate: RCSTemplate) => void;
}

const SAMPLE_MEDIA_PRESETS = [
  {
    name: "Festive Sale Banner",
    url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    ratio: "16:9" as RCSMediaRatio,
  },
  {
    name: "Electronics Showcase",
    url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80",
    ratio: "16:9" as RCSMediaRatio,
  },
  {
    name: "Travel & Flight",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
    ratio: "16:9" as RCSMediaRatio,
  },
  {
    name: "Fashion Square Lookbook",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    ratio: "1:1" as RCSMediaRatio,
  },
];

export function RCSTemplateForm({
  initialData,
  isEditMode = false,
  onSuccess,
}: RCSTemplateFormProps) {
  const router = useRouter();

  // Basic Details State
  const [templateName, setTemplateName] = useState(initialData?.name || "");
  const [agentId, setAgentId] = useState(
    initialData?.agentId || VERIFIED_RCS_AGENTS[0].id
  );
  const [messageType, setMessageType] = useState<RCSMessageType>(
    initialData?.messageType || "RICH_CARD"
  );
  const [category, setCategory] = useState<RCSCategory>(
    initialData?.category || "PROMOTIONAL"
  );

  // TEXT Type State
  const [textBody, setTextBody] = useState(
    initialData?.textBody ||
      "Hello {{1}},\n\nYour order #{{2}} amounting to {{3}} has been confirmed and is now packed.\n\nThank you for choosing Appnix!"
  );
  const [standaloneActions, setStandaloneActions] = useState<RCSAction[]>(
    initialData?.standaloneActions || [
      {
        id: "act-init-1",
        type: "REPLY",
        text: "Track Order",
        postback: "TRACK_ORDER_REQ",
      },
      {
        id: "act-init-2",
        type: "REPLY",
        text: "Talk to Human",
        postback: "TALK_AGENT",
      },
    ]
  );

  // SINGLE RICH CARD State
  const [singleCard, setSingleCard] = useState<RCSCard>(
    initialData?.card || {
      id: "card-single",
      title: "🎉 Special Festive Promotion for {{1}}",
      description:
        "Get flat {{2}}% instant discount on all cloud automation packages with code {{3}}. Valid until {{4}}.",
      media: {
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
        ratio: "16:9",
        height: "MEDIUM",
        fileName: "promo_banner.jpg",
      },
      actions: [
        {
          id: "act-sc-1",
          type: "URL",
          text: "Claim Deal Now",
          url: "https://appnix.io/deals",
          webviewMode: "FULL",
        },
        {
          id: "act-sc-2",
          type: "DIAL",
          text: "Call Support",
          phoneNumber: "+918062765557",
        },
      ],
    }
  );

  // CAROUSEL State (up to 10 cards)
  const [carouselCards, setCarouselCards] = useState<RCSCard[]>(
    initialData?.cards && initialData.cards.length > 0
      ? initialData.cards
      : [
          {
            id: "card-c-1",
            title: "⚡ Smart SaaS Bots for {{1}}",
            description:
              "Deploy WhatsApp & RCS conversational bots in under 5 minutes. Flat {{2}}% discount.",
            media: {
              type: "IMAGE",
              url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80",
              ratio: "16:9",
              height: "MEDIUM",
              fileName: "smart_bots.jpg",
            },
            actions: [
              {
                id: "act-c-1-1",
                type: "URL",
                text: "Explore Bots",
                url: "https://appnix.io/bots",
                webviewMode: "FULL",
              },
              {
                id: "act-c-1-2",
                type: "REPLY",
                text: "Request Demo",
                postback: "REQ_DEMO",
              },
            ],
          },
          {
            id: "card-c-2",
            title: "📈 CRM & Omnichannel Broadcast",
            description:
              "Reach 100k+ users with rich card media and carrier verified badges. Code: {{3}}.",
            media: {
              type: "IMAGE",
              url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
              ratio: "16:9",
              height: "MEDIUM",
              fileName: "crm_broadcast.jpg",
            },
            actions: [
              {
                id: "act-c-2-1",
                type: "URL",
                text: "View Pricing",
                url: "https://appnix.io/pricing",
                webviewMode: "FULL",
              },
              {
                id: "act-c-2-2",
                type: "DIAL",
                text: "Call Sales",
                phoneNumber: "+918062765557",
              },
            ],
          },
        ]
  );

  const [activeCarouselTab, setActiveCarouselTab] = useState(0);

  // Variables and Samples State
  const [variableConfigs, setVariableConfigs] = useState<RCSTemplateVariable[]>(
    initialData?.variables || [
      { index: 1, name: "Customer Name", sampleValue: "Jitendra Kumar", dataSource: "contact.first_name" },
      { index: 2, name: "Discount Percent", sampleValue: "40", dataSource: "offer.discount" },
      { index: 3, name: "Promo Code", sampleValue: "RCSMEGA40", dataSource: "offer.code" },
      { index: 4, name: "Expiry Date", sampleValue: "31st August 2026", dataSource: "order.delivery_date" },
    ]
  );
  const [customSampleOverrides, setCustomSampleOverrides] = useState<Record<string, string>>({});

  // Submission / Modal State
  const [validationErrors, setValidationErrors] = useState<RCSValidationError[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const selectedAgent =
    VERIFIED_RCS_AGENTS.find((a) => a.id === agentId) || VERIFIED_RCS_AGENTS[0];

  // Auto-detect variable indices across current text/cards
  const detectedIndices = useMemo(() => {
    let combinedText = "";
    if (messageType === "TEXT") {
      combinedText = textBody;
    } else if (messageType === "RICH_CARD") {
      combinedText = `${singleCard.title || ""} ${singleCard.description || ""}`;
    } else if (messageType === "CAROUSEL") {
      combinedText = carouselCards
        .map((c) => `${c.title || ""} ${c.description || ""}`)
        .join(" ");
    }
    return extractVariablesFromText(combinedText);
  }, [messageType, textBody, singleCard, carouselCards]);

  // Sync variable configs when new indices are added
  useMemo(() => {
    setVariableConfigs((prev) => {
      const existingMap = new Map(prev.map((v) => [v.index, v]));
      return detectedIndices.map((idx) => {
        if (existingMap.has(idx)) {
          return existingMap.get(idx)!;
        }
        return {
          index: idx,
          name: `Variable ${idx}`,
          sampleValue: `Sample ${idx}`,
          dataSource: "custom",
        };
      });
    });
  }, [detectedIndices]);

  // Constructed live template object for preview & validation
  const currentTemplate: RCSTemplate = useMemo(() => {
    return {
      id: initialData?.id || `rcs-tpl-${Date.now()}`,
      agentId,
      agentName: selectedAgent.name,
      name: templateName,
      category,
      messageType,
      textBody: messageType === "TEXT" ? textBody : undefined,
      standaloneActions: messageType === "TEXT" ? standaloneActions : undefined,
      card: messageType === "RICH_CARD" ? singleCard : undefined,
      cards: messageType === "CAROUSEL" ? carouselCards : undefined,
      variables: variableConfigs,
      variableMappings: variableConfigs.reduce((acc, v) => {
        acc[String(v.index)] = v.name;
        return acc;
      }, {} as Record<string, string>),
      status: initialData?.status || "DRAFT",
      rcsTemplateId: initialData?.rcsTemplateId,
      carrierApprovals: initialData?.carrierApprovals,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [
    initialData,
    agentId,
    selectedAgent,
    templateName,
    category,
    messageType,
    textBody,
    standaloneActions,
    singleCard,
    carouselCards,
    variableConfigs,
  ]);

  // Handle Template Name typing (enforce lowercase & underscores)
  const handleNameChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    setTemplateName(sanitized);
  };

  // Variable Sample Overrides update
  const handleUpdateSample = (index: number, val: string) => {
    setCustomSampleOverrides((prev) => ({
      ...prev,
      [String(index)]: val,
    }));
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const draftTemplate: RCSTemplate = {
      ...currentTemplate,
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    };

    const existing = getStoredRCSTemplates();
    const isExisting = existing.some((t) => t.id === draftTemplate.id);
    const updated = isExisting
      ? existing.map((t) => (t.id === draftTemplate.id ? draftTemplate : t))
      : [draftTemplate, ...existing];

    saveStoredRCSTemplates(updated);
    if (onSuccess) {
      onSuccess(draftTemplate);
    } else {
      router.push("/channels/rcs/templates");
    }
  };

  // Trigger Carrier Submit Modal
  const handleOpenSubmitModal = () => {
    const errors = validateRCSTemplate(currentTemplate);
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setIsSubmitModalOpen(true);
  };

  // Confirm Submit to Carriers
  const handleConfirmSubmit = async () => {
    const generatedId = `rcs_tpl_${Math.floor(100000 + Math.random() * 900000)}`;
    const pendingTemplate: RCSTemplate = {
      ...currentTemplate,
      status: "PENDING",
      rcsTemplateId: generatedId,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      carrierApprovals: [
        { carrier: "Google Jibe", status: "APPROVED", reviewedAt: new Date().toISOString(), notes: "Universal Profile 2.4 compliant" },
        { carrier: "Jio", status: "PENDING", notes: "Queued for TRAI DLT verification" },
        { carrier: "Airtel", status: "PENDING", notes: "Commercial queue batch processing" },
        { carrier: "Vodafone Idea", status: "PENDING", notes: "Awaiting brand registry verification" },
      ],
    };

    const existing = getStoredRCSTemplates();
    const isExisting = existing.some((t) => t.id === pendingTemplate.id);
    const updated = isExisting
      ? existing.map((t) => (t.id === pendingTemplate.id ? pendingTemplate : t))
      : [pendingTemplate, ...existing];

    saveStoredRCSTemplates(updated);
  };

  // Action Helpers
  const addActionToCard = (cardType: "single" | "carousel", cardIdx = 0) => {
    const newAct: RCSAction = {
      id: `act-${Date.now()}`,
      type: "REPLY",
      text: "Quick Response",
      postback: "USER_RESPONSE_PAYLOAD",
    };

    if (cardType === "single") {
      if (singleCard.actions.length >= 4) return;
      setSingleCard((prev) => ({
        ...prev,
        actions: [...prev.actions, newAct],
      }));
    } else {
      setCarouselCards((prev) =>
        prev.map((c, i) =>
          i === cardIdx && c.actions.length < 4
            ? { ...c, actions: [...c.actions, newAct] }
            : c
        )
      );
    }
  };

  const updateCardAction = (
    cardType: "single" | "carousel",
    cardIdx: number,
    actionIdx: number,
    updated: Partial<RCSAction>
  ) => {
    if (cardType === "single") {
      setSingleCard((prev) => ({
        ...prev,
        actions: prev.actions.map((a, i) => (i === actionIdx ? { ...a, ...updated } : a)),
      }));
    } else {
      setCarouselCards((prev) =>
        prev.map((c, i) =>
          i === cardIdx
            ? {
                ...c,
                actions: c.actions.map((a, j) =>
                  j === actionIdx ? { ...a, ...updated } : a
                ),
              }
            : c
        )
      );
    }
  };

  const removeCardAction = (
    cardType: "single" | "carousel",
    cardIdx: number,
    actionIdx: number
  ) => {
    if (cardType === "single") {
      setSingleCard((prev) => ({
        ...prev,
        actions: prev.actions.filter((_, i) => i !== actionIdx),
      }));
    } else {
      setCarouselCards((prev) =>
        prev.map((c, i) =>
          i === cardIdx
            ? { ...c, actions: c.actions.filter((_, j) => j !== actionIdx) }
            : c
        )
      );
    }
  };

  // Carousel card addition / removal
  const handleAddCarouselCard = () => {
    if (carouselCards.length >= 10) return;
    const newCard: RCSCard = {
      id: `card-c-${Date.now()}`,
      title: `Card ${carouselCards.length + 1} Title`,
      description: `Description for card ${carouselCards.length + 1}. Add promotional copy here.`,
      media: {
        type: "IMAGE",
        url: SAMPLE_MEDIA_PRESETS[carouselCards.length % SAMPLE_MEDIA_PRESETS.length].url,
        ratio: "16:9",
        height: "MEDIUM",
        fileName: `card_${carouselCards.length + 1}.jpg`,
      },
      actions: [
        {
          id: `act-c-${Date.now()}-1`,
          type: "URL",
          text: "Explore",
          url: "https://appnix.io",
          webviewMode: "FULL",
        },
      ],
    };
    setCarouselCards([...carouselCards, newCard]);
    setActiveCarouselTab(carouselCards.length);
  };

  const handleRemoveCarouselCard = (index: number) => {
    if (carouselCards.length <= 2) {
      alert("Carousel message requires at least 2 rich cards.");
      return;
    }
    const updated = carouselCards.filter((_, i) => i !== index);
    setCarouselCards(updated);
    if (activeCarouselTab >= updated.length) {
      setActiveCarouselTab(updated.length - 1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link
            href="/channels"
            className="hover:text-foreground transition-colors"
          >
            Channels
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <Link
            href="/channels/rcs"
            className="hover:text-foreground transition-colors"
          >
            RCS
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <Link
            href="/channels/rcs/templates"
            className="hover:text-foreground transition-colors"
          >
            Templates
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-medium">
            {isEditMode ? "Edit Template" : "Create RCS Template"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-indigo-600" />
              <span>{isEditMode ? `Edit Template: ${templateName}` : "RCS Template Builder"}</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Design carrier-compliant rich messages, interactive cards, and carousels for Google RCS business messaging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenSubmitModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm"
            >
              <Radio className="h-4 w-4" />
              <span>Submit for Verification</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Errors Alert Box */}
      {validationErrors.length > 0 && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 p-4 space-y-2 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-semibold">
            <AlertCircle className="h-4 w-4" />
            <span>Please resolve the following {validationErrors.length} validation errors before submitting:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-600 dark:text-rose-400 pl-2">
            {validationErrors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 2-Column Layout: Left (Form Controls) | Right (Real-time Android RCS Phone Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Form Controls & Configuration Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Basic Details Card */}
          <div className="rounded-2xl border bg-card p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-foreground">
                  Basic Details & Bot Agent
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                Step 1 of 3
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              {/* Template Name */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Template Name *
                </label>
                <div className="relative">
                  <Input
                    value={templateName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. festival_offer_card"
                    className="font-mono text-xs h-9 bg-background"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Lowercase letters, numbers, and underscores only. Max 64 characters.
                </p>
              </div>

              {/* Linked RCS Bot Agent */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Linked RCS Verified Bot / Agent *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {VERIFIED_RCS_AGENTS.map((agent) => {
                    const isSelected = agentId === agent.id;
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setAgentId(agent.id)}
                        className={cn(
                          "flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all",
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                            : "border-border hover:bg-muted/40"
                        )}
                      >
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 overflow-hidden">
                          {agent.avatarUrl ? (
                            <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                          ) : (
                            agent.name.charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate flex items-center gap-1">
                            <span>{agent.name}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {agent.identifier}
                          </p>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium mt-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Carrier Verified
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Type Radio Cards */}
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  RCS Message Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "TEXT" as RCSMessageType,
                      title: "Text Only",
                      sub: "Rich text with optional standalone action chips",
                      icon: FileText,
                    },
                    {
                      id: "RICH_CARD" as RCSMessageType,
                      title: "Single Rich Card",
                      sub: "Cover media, title, body, and up to 4 CTA buttons",
                      icon: Smartphone,
                    },
                    {
                      id: "CAROUSEL" as RCSMessageType,
                      title: "Carousel Cards",
                      sub: "Horizontally scrollable rich cards (up to 10)",
                      icon: Layers,
                    },
                  ].map((item) => {
                    const isSelected = messageType === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMessageType(item.id)}
                        className={cn(
                          "flex flex-col items-start p-3 rounded-xl border text-left transition-all relative",
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                            : "border-border hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className={cn("p-1.5 rounded-lg", isSelected ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground")}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <span className="font-semibold text-xs text-foreground">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Message Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(["PROMOTIONAL", "TRANSACTIONAL", "OTP"] as RCSCategory[]).map(
                    (catKey) => {
                      const catInfo = RCS_CATEGORY_CONFIG[catKey];
                      const isSelected = category === catKey;
                      return (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => setCategory(catKey)}
                          className={cn(
                            "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                              : "border-border hover:bg-muted/40"
                          )}
                        >
                          <span className="font-semibold text-xs text-foreground">
                            {catInfo.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-1 leading-snug">
                            {catInfo.subtitle}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Content Configuration Card */}
          <div className="rounded-2xl border bg-card p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-base text-foreground">
                  Content & Media Configuration
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                Step 2 of 3
              </Badge>
            </div>

            {/* If TEXT Message Type */}
            {messageType === "TEXT" && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-foreground">
                      Message Body Text *
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {textBody.length}/2000 chars
                    </span>
                  </div>
                  <Textarea
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    rows={6}
                    placeholder="Enter message text. Use {{1}}, {{2}} for dynamic customer parameters..."
                    className="text-xs leading-relaxed bg-background"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-muted-foreground">
                      Tip: Type <span className="font-mono font-semibold text-primary">{`{{1}}`}</span>, <span className="font-mono font-semibold text-primary">{`{{2}}`}</span> to create dynamic variables.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] text-primary"
                      onClick={() => {
                        const nextIdx = detectedIndices.length + 1;
                        setTextBody((prev) => `${prev} {{${nextIdx}}}`);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Insert Variable
                    </Button>
                  </div>
                </div>

                {/* Standalone Action Chips */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-xs">
                        Suggested Reply Chips (Optional)
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Quick response chips shown beneath text bubble (Max 4).
                      </p>
                    </div>
                    {standaloneActions.length < 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          const newAct: RCSAction = {
                            id: `act-${Date.now()}`,
                            type: "REPLY",
                            text: `Action ${standaloneActions.length + 1}`,
                            postback: "POSTBACK_PAYLOAD",
                          };
                          setStandaloneActions([...standaloneActions, newAct]);
                        }}
                      >
                        <Plus className="h-3 w-3" /> Add Chip
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {standaloneActions.map((act, actIdx) => (
                      <div key={act.id} className="p-3 rounded-xl border bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[11px] text-foreground">
                            Chip {actIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setStandaloneActions(
                                standaloneActions.filter((_, i) => i !== actIdx)
                              )
                            }
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">
                              Button Label (max 25 chars)
                            </label>
                            <Input
                              value={act.text}
                              maxLength={25}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStandaloneActions(
                                  standaloneActions.map((a, i) =>
                                    i === actIdx ? { ...a, text: val } : a
                                  )
                                );
                              }}
                              className="h-8 text-xs bg-background"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">
                              Postback Payload
                            </label>
                            <Input
                              value={act.postback || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStandaloneActions(
                                  standaloneActions.map((a, i) =>
                                    i === actIdx ? { ...a, postback: val } : a
                                  )
                                );
                              }}
                              className="h-8 text-xs font-mono bg-background"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If SINGLE RICH CARD */}
            {messageType === "RICH_CARD" && (
              <div className="space-y-4 text-xs">
                {/* Media Header Settings */}
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-indigo-600" /> Card Media Header (Optional)
                    </h4>
                    {singleCard.media?.url && (
                      <button
                        type="button"
                        onClick={() =>
                          setSingleCard((prev) => ({
                            ...prev,
                            media: undefined,
                          }))
                        }
                        className="text-rose-500 hover:underline text-[11px]"
                      >
                        Remove Media
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">
                        Media Type
                      </label>
                      <select
                        value={singleCard.media?.type || "IMAGE"}
                        onChange={(e) =>
                          setSingleCard((prev) => ({
                            ...prev,
                            media: {
                              type: e.target.value as RCSMediaType,
                              url: prev.media?.url || SAMPLE_MEDIA_PRESETS[0].url,
                              ratio: prev.media?.ratio || "16:9",
                              height: prev.media?.height || "MEDIUM",
                            },
                          }))
                        }
                        className="w-full h-8 text-xs rounded-lg border bg-background px-2"
                      >
                        <option value="IMAGE">Image</option>
                        <option value="VIDEO">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">
                        Aspect Ratio
                      </label>
                      <select
                        value={singleCard.media?.ratio || "16:9"}
                        onChange={(e) =>
                          setSingleCard((prev) => ({
                            ...prev,
                            media: {
                              ...prev.media!,
                              ratio: e.target.value as RCSMediaRatio,
                            },
                          }))
                        }
                        className="w-full h-8 text-xs rounded-lg border bg-background px-2"
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="1:1">1:1 (Square)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">
                        Card Media Height
                      </label>
                      <select
                        value={singleCard.media?.height || "MEDIUM"}
                        onChange={(e) =>
                          setSingleCard((prev) => ({
                            ...prev,
                            media: {
                              ...prev.media!,
                              height: e.target.value as RCSMediaHeight,
                            },
                          }))
                        }
                        className="w-full h-8 text-xs rounded-lg border bg-background px-2"
                      >
                        <option value="SHORT">Short</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="TALL">Tall</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">
                        Presets
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full h-8 text-[11px] justify-between">
                            <span>Sample Images</span>
                            <ChevronDown className="h-3 w-3 opacity-60" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {SAMPLE_MEDIA_PRESETS.map((p, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              onClick={() =>
                                setSingleCard((prev) => ({
                                  ...prev,
                                  media: {
                                    type: "IMAGE",
                                    url: p.url,
                                    ratio: p.ratio,
                                    height: "MEDIUM",
                                    fileName: `${p.name.toLowerCase().replace(/\s+/g, "_")}.jpg`,
                                  },
                                }))
                              }
                            >
                              {p.name} ({p.ratio})
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      Media Public URL (HTTPS)
                    </label>
                    <Input
                      value={singleCard.media?.url || ""}
                      onChange={(e) =>
                        setSingleCard((prev) => ({
                          ...prev,
                          media: {
                            type: prev.media?.type || "IMAGE",
                            url: e.target.value,
                            ratio: prev.media?.ratio || "16:9",
                            height: prev.media?.height || "MEDIUM",
                          },
                        }))
                      }
                      placeholder="https://your-domain.com/image.jpg"
                      className="h-8 text-xs bg-background"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Guidelines: JPEG/PNG/MP4. Recommended min 300x168 px, max 10MB file size.
                    </p>
                  </div>
                </div>

                {/* Card Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-foreground">
                      Card Title (Optional)
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {(singleCard.title || "").length}/200 chars
                    </span>
                  </div>
                  <Input
                    value={singleCard.title || ""}
                    maxLength={200}
                    onChange={(e) =>
                      setSingleCard((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g. 🌟 Exclusive Diwali Festive Deal for {{1}}"
                    className="h-9 text-xs bg-background"
                  />
                </div>

                {/* Card Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-foreground">
                      Card Description / Body *
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {singleCard.description.length}/2000 chars
                    </span>
                  </div>
                  <Textarea
                    value={singleCard.description}
                    onChange={(e) =>
                      setSingleCard((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Enter card details. Supports {{1}}, {{2}} dynamic variables..."
                    className="text-xs leading-relaxed bg-background"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">
                      Use <span className="font-mono text-primary font-semibold">{"{{1}}"}</span> for dynamic placeholders.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px] text-primary"
                      onClick={() => {
                        const nextIdx = detectedIndices.length + 1;
                        setSingleCard((prev) => ({
                          ...prev,
                          description: `${prev.description} {{${nextIdx}}}`,
                        }));
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Insert Variable
                    </Button>
                  </div>
                </div>

                {/* Card Action Buttons Builder */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-xs">
                        Suggested Actions & Replies ({singleCard.actions.length}/4)
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Add up to 4 interactive buttons (URL, Dial, Location, Calendar, Reply).
                      </p>
                    </div>
                    {singleCard.actions.length < 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => addActionToCard("single")}
                      >
                        <Plus className="h-3 w-3" /> Add Action
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {singleCard.actions.map((act, actIdx) => (
                      <ActionEditorCard
                        key={act.id}
                        action={act}
                        index={actIdx}
                        onUpdate={(updated) =>
                          updateCardAction("single", 0, actIdx, updated)
                        }
                        onRemove={() => removeCardAction("single", 0, actIdx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If CAROUSEL Message Type */}
            {messageType === "CAROUSEL" && (
              <div className="space-y-4 text-xs">
                {/* Carousel Card Tabs & Management */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {carouselCards.map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCarouselTab(idx)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                          activeCarouselTab === idx
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Card {idx + 1}
                      </button>
                    ))}
                  </div>

                  {carouselCards.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCarouselCard}
                      className="h-7 text-xs gap-1 shrink-0 ml-2"
                    >
                      <Plus className="h-3 w-3" /> Add Card ({carouselCards.length}/10)
                    </Button>
                  )}
                </div>

                {/* Active Card Configuration */}
                {carouselCards[activeCarouselTab] && (
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">
                        Configuring Card #{activeCarouselTab + 1}
                      </span>
                      {carouselCards.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCarouselCard(activeCarouselTab)}
                          className="h-7 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Card
                        </Button>
                      )}
                    </div>

                    {/* Media Header Settings */}
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                          <ImageIcon className="h-4 w-4 text-indigo-600" /> Media Header
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 text-[11px]">
                              <span>Use Preset</span>
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {SAMPLE_MEDIA_PRESETS.map((p, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={() =>
                                  setCarouselCards((prev) =>
                                    prev.map((c, i) =>
                                      i === activeCarouselTab
                                        ? {
                                            ...c,
                                            media: {
                                              type: "IMAGE",
                                              url: p.url,
                                              ratio: p.ratio,
                                              height: "MEDIUM",
                                            },
                                          }
                                        : c
                                    )
                                  )
                                }
                              >
                                {p.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-1">
                            Media URL (HTTPS)
                          </label>
                          <Input
                            value={carouselCards[activeCarouselTab].media?.url || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCarouselCards((prev) =>
                                prev.map((c, i) =>
                                  i === activeCarouselTab
                                    ? {
                                        ...c,
                                        media: {
                                          type: c.media?.type || "IMAGE",
                                          url: val,
                                          ratio: c.media?.ratio || "16:9",
                                          height: "MEDIUM",
                                        },
                                      }
                                    : c
                                )
                              );
                            }}
                            placeholder="https://..."
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-1">
                            Aspect Ratio
                          </label>
                          <select
                            value={carouselCards[activeCarouselTab].media?.ratio || "16:9"}
                            onChange={(e) => {
                              const val = e.target.value as RCSMediaRatio;
                              setCarouselCards((prev) =>
                                prev.map((c, i) =>
                                  i === activeCarouselTab
                                    ? {
                                        ...c,
                                        media: {
                                          ...c.media!,
                                          ratio: val,
                                        },
                                      }
                                    : c
                                )
                              );
                            }}
                            className="w-full h-8 text-xs rounded-lg border bg-background px-2"
                          >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="1:1">1:1 (Square)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Card Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-foreground">
                          Card Title (Optional)
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {(carouselCards[activeCarouselTab].title || "").length}/200 chars
                        </span>
                      </div>
                      <Input
                        value={carouselCards[activeCarouselTab].title || ""}
                        maxLength={200}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCarouselCards((prev) =>
                            prev.map((c, i) =>
                              i === activeCarouselTab ? { ...c, title: val } : c
                            )
                          );
                        }}
                        placeholder="Card title..."
                        className="h-8 text-xs bg-background"
                      />
                    </div>

                    {/* Card Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-foreground">
                          Card Description *
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {carouselCards[activeCarouselTab].description.length}/2000 chars
                        </span>
                      </div>
                      <Textarea
                        value={carouselCards[activeCarouselTab].description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCarouselCards((prev) =>
                            prev.map((c, i) =>
                              i === activeCarouselTab ? { ...c, description: val } : c
                            )
                          );
                        }}
                        rows={3}
                        placeholder="Card description text..."
                        className="text-xs bg-background"
                      />
                    </div>

                    {/* Card Actions */}
                    <div className="border-t pt-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-xs">
                          Card Actions ({carouselCards[activeCarouselTab].actions.length}/4)
                        </h4>
                        {carouselCards[activeCarouselTab].actions.length < 4 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => addActionToCard("carousel", activeCarouselTab)}
                          >
                            <Plus className="h-3 w-3" /> Add Button
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {carouselCards[activeCarouselTab].actions.map((act, actIdx) => (
                          <ActionEditorCard
                            key={act.id}
                            action={act}
                            index={actIdx}
                            onUpdate={(updated) =>
                              updateCardAction(
                                "carousel",
                                activeCarouselTab,
                                actIdx,
                                updated
                              )
                            }
                            onRemove={() =>
                              removeCardAction(
                                "carousel",
                                activeCarouselTab,
                                actIdx
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Dynamic Variable Definitions Card */}
          {variableConfigs.length > 0 && (
            <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-base text-foreground">
                    Dynamic Variable Definitions ({variableConfigs.length})
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                  Step 3 of 3
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Map each placeholder token to a CRM attribute and provide realistic sample values for carrier verification.
              </p>

              <div className="space-y-2.5">
                {variableConfigs.map((v, i) => (
                  <div key={v.index} className="p-3 rounded-xl border bg-muted/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {`{{${v.index}}}`}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Token #{v.index}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">
                          Variable Label Name
                        </label>
                        <Input
                          value={v.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariableConfigs((prev) =>
                              prev.map((item, idx) =>
                                idx === i ? { ...item, name: val } : item
                              )
                            );
                          }}
                          placeholder="e.g. Customer Name"
                          className="h-8 text-xs bg-background"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">
                          CRM Data Source
                        </label>
                        <select
                          value={v.dataSource}
                          onChange={(e) => {
                            const val = e.target.value;
                            const standard = STANDARD_DATA_SOURCES.find(
                              (s) => s.id === val
                            );
                            setVariableConfigs((prev) =>
                              prev.map((item, idx) =>
                                idx === i
                                  ? {
                                      ...item,
                                      dataSource: val,
                                      sampleValue:
                                        standard?.defaultSample || item.sampleValue,
                                    }
                                  : item
                              )
                            );
                          }}
                          className="w-full h-8 text-xs rounded-lg border bg-background px-2"
                        >
                          {STANDARD_DATA_SOURCES.map((ds) => (
                            <option key={ds.id} value={ds.id}>
                              {ds.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">
                          Sample Verification Value
                        </label>
                        <Input
                          value={v.sampleValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariableConfigs((prev) =>
                              prev.map((item, idx) =>
                                idx === i ? { ...item, sampleValue: val } : item
                              )
                            );
                          }}
                          placeholder="e.g. Jitendra"
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Real-time Android RCS Phone Mockup (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-indigo-600" />
              Live Android RCS Preview
            </span>
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300">
              Google Messages Simulator
            </Badge>
          </div>

          <RCSPhonePreview
            template={currentTemplate}
            customSampleOverrides={customSampleOverrides}
            onUpdateSampleValue={handleUpdateSample}
          />
        </div>
      </div>

      {/* Carrier Submit Approval Modal */}
      <RCSSubmitApprovalModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          router.push("/channels/rcs/templates");
        }}
        onConfirmSubmit={handleConfirmSubmit}
        template={currentTemplate}
      />
    </div>
  );
}

// Subcomponent: Action Button Editor Card
function ActionEditorCard({
  action,
  index,
  onUpdate,
  onRemove,
}: {
  action: RCSAction;
  index: number;
  onUpdate: (updated: Partial<RCSAction>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-3.5 rounded-xl border bg-card space-y-2.5 text-xs shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono">
            Button {index + 1}
          </Badge>
          <span className="font-semibold text-foreground text-xs">
            {action.text || "New Action"}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-rose-500 hover:text-rose-700 p-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-0.5">
            Action Type *
          </label>
          <select
            value={action.type}
            onChange={(e) =>
              onUpdate({
                type: e.target.value as RCSActionType,
                text:
                  action.text ||
                  (e.target.value === "URL"
                    ? "Visit Website"
                    : e.target.value === "DIAL"
                    ? "Call Us"
                    : e.target.value === "LOCATION"
                    ? "View Map"
                    : e.target.value === "CALENDAR"
                    ? "Add Event"
                    : "Quick Reply"),
              })
            }
            className="w-full h-8 text-xs rounded-lg border bg-background px-2"
          >
            <option value="REPLY">Suggested Reply (Postback Chip)</option>
            <option value="URL">Open URL (In-App Browser)</option>
            <option value="DIAL">Dial Phone Number (Call)</option>
            <option value="LOCATION">View Location (Google Maps)</option>
            <option value="CALENDAR">Calendar Event (Add to Calendar)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground block mb-0.5">
            Button Label (Max 25 chars) *
          </label>
          <Input
            value={action.text}
            maxLength={25}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="e.g. View Offer"
            className="h-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Specific Fields per Action Type */}
      {action.type === "URL" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="sm:col-span-2">
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Target URL (https:// required) *
            </label>
            <Input
              value={action.url || ""}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://appnix.io/deal"
              className="h-8 text-xs bg-background"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Webview Mode
            </label>
            <select
              value={action.webviewMode || "FULL"}
              onChange={(e) =>
                onUpdate({
                  webviewMode: e.target.value as "COMPACT" | "TALL" | "FULL",
                })
              }
              className="w-full h-8 text-xs rounded-lg border bg-background px-2"
            >
              <option value="FULL">Full Screen</option>
              <option value="TALL">Tall (75%)</option>
              <option value="COMPACT">Compact (50%)</option>
            </select>
          </div>
        </div>
      )}

      {action.type === "DIAL" && (
        <div className="pt-1">
          <label className="text-[10px] text-muted-foreground block mb-0.5">
            Phone Number (E.164 with Country Code) *
          </label>
          <Input
            value={action.phoneNumber || ""}
            onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
            placeholder="+91 80627 65557"
            className="h-8 text-xs bg-background"
          />
        </div>
      )}

      {action.type === "LOCATION" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Latitude
            </label>
            <Input
              type="number"
              step="any"
              value={action.latitude ?? ""}
              onChange={(e) =>
                onUpdate({
                  latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="28.4595"
              className="h-8 text-xs bg-background"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Longitude
            </label>
            <Input
              type="number"
              step="any"
              value={action.longitude ?? ""}
              onChange={(e) =>
                onUpdate({
                  longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="77.0266"
              className="h-8 text-xs bg-background"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Location Label
            </label>
            <Input
              value={action.locationLabel || ""}
              onChange={(e) => onUpdate({ locationLabel: e.target.value })}
              placeholder="Appnix Store Gurgaon"
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>
      )}

      {action.type === "CALENDAR" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Event Title *
            </label>
            <Input
              value={action.calendarTitle || ""}
              onChange={(e) => onUpdate({ calendarTitle: e.target.value })}
              placeholder="Appnix AI Keynote"
              className="h-8 text-xs bg-background"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">
              Event Description
            </label>
            <Input
              value={action.calendarDescription || ""}
              onChange={(e) => onUpdate({ calendarDescription: e.target.value })}
              placeholder="Live streaming link included"
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>
      )}

      {action.type === "REPLY" && (
        <div className="pt-1">
          <label className="text-[10px] text-muted-foreground block mb-0.5">
            Postback Payload (Sent to bot webhook when tapped)
          </label>
          <Input
            value={action.postback || ""}
            onChange={(e) => onUpdate({ postback: e.target.value })}
            placeholder="PAYLOAD_USER_CONFIRMATION"
            className="h-8 text-xs font-mono bg-background"
          />
        </div>
      )}
    </div>
  );
}
