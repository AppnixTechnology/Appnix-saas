"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Plus,
  Zap,
  Sparkles,
  Crown,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Webhook,
  ShoppingBag,
  Bot,
  UserCheck,
  Star,
  FileText,
  ShieldCheck,
  Download,
  Filter,
  Check,
  X,
  Loader2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/axios";

// Icons mapping for channels and apps
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  RCSIcon,
} from "@/components/landing/channel-icons";

export interface TemplateItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "E-Commerce" | "Customer Support" | "Lead Generation" | "Marketing & Broadcasts" | "Utility / OTP";
  channels: string[];
  apps: string[];
  badge: "Official" | "Community" | "Premium";
  isPremium: boolean;
  installCount: number;
  stepsCount: number;
  setupMinutes: number;
  requiredConnections: string[];
  pipelineSteps: {
    number: number;
    type: "trigger" | "condition" | "action" | "crm";
    title: string;
    description: string;
  }[];
}

const TEMPLATES_DATA: TemplateItem[] = [
  {
    id: "tmpl_1",
    title: "Shopify Abandoned Cart Auto-Recovery",
    slug: "shopify_abandoned_cart_recovery",
    description: "Recovers dropped checkouts via dynamic WhatsApp template with 1-click checkout URL and exclusive discount coupon.",
    category: "E-Commerce",
    channels: ["WhatsApp", "RCS"],
    apps: ["Shopify", "Webhook", "WhatsApp"],
    badge: "Official",
    isPremium: false,
    installCount: 1840,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["Shopify Webhook", "WhatsApp Cloud API"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Shopify: Checkout Abandoned Webhook", description: "Fires when user abandons cart with email/phone" },
      { number: 2, type: "condition", title: "Filter: Cart Total > ₹1,000 & 1 Hr Delay", description: "Ensures high-value carts and prevents spam" },
      { number: 3, type: "action", title: "WhatsApp: Send Dynamic Recovery Promo", description: "Dispatches personalized coupon code and link" },
    ],
  },
  {
    id: "tmpl_2",
    title: "AI Lead Qualification & CRM Handover",
    slug: "ai_lead_qualification_crm_handover",
    description: "Engages incoming queries using AI intent classification, collects budget/timeline, and routes VIP leads to sales agents.",
    category: "Lead Generation",
    channels: ["WhatsApp", "Instagram", "Facebook"],
    apps: ["AI Agent", "Google Sheets", "CRM"],
    badge: "Official",
    isPremium: true,
    installCount: 2420,
    stepsCount: 4,
    setupMinutes: 3,
    requiredConnections: ["AI Agent Desk", "Google Sheets API", "WhatsApp Cloud API"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Inbound Message: Keyword or Ad Query", description: "Triggers on user initial chat message" },
      { number: 2, type: "action", title: "AI Classifier: Determine Lead Intent & Budget", description: "Scores customer readiness and interest" },
      { number: 3, type: "condition", title: "Condition: Score >= 80 (VIP Lead)", description: "High-value lead branch filter" },
      { number: 4, type: "crm", title: "Appnix CRM: Assign Sales Rep & Handover", description: "Notifies team and transfers live chat" },
    ],
  },
  {
    id: "tmpl_3",
    title: "Order Confirmation & Real-Time Tracking",
    slug: "order_confirmation_tracking",
    description: "Sends instant order receipt on WhatsApp with interactive quick reply buttons for live delivery tracking and support.",
    category: "E-Commerce",
    channels: ["WhatsApp", "RCS"],
    apps: ["Shopify", "Webhook"],
    badge: "Official",
    isPremium: false,
    installCount: 1250,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["Shopify Store", "WhatsApp Cloud API"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Webhook: Order Placed (Shopify/WooCommerce)", description: "Captures checkout payload with order ID" },
      { number: 2, type: "action", title: "WhatsApp: Send Order Receipt with Track URL", description: "Dispatches interactive delivery status card" },
      { number: 3, type: "crm", title: "Appnix CRM: Save Order ID to Customer Profile", description: "Updates contact history and total spend" },
    ],
  },
  {
    id: "tmpl_4",
    title: "24/7 Support Auto-Reply & Knowledge Bot",
    slug: "support_auto_responder_faq",
    description: "Answers recurring customer FAQs (Hours, Return Policy, Shipping) and escalates complex queries to live human agents.",
    category: "Customer Support",
    channels: ["WhatsApp", "Instagram", "Facebook", "RCS"],
    apps: ["AI Agent", "Webhook"],
    badge: "Official",
    isPremium: false,
    installCount: 3120,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["WhatsApp Cloud API", "FAQ Knowledge Base"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Incoming Message Outside Business Hours", description: "Listens for customer inquiries" },
      { number: 2, type: "action", title: "AI Search: Match FAQ & Return Instant Solution", description: "Searches verified knowledgebase articles" },
      { number: 3, type: "action", title: "If Unresolved: Create High-Priority Ticket", description: "Creates desk ticket and pings on-call agent" },
    ],
  },
  {
    id: "tmpl_5",
    title: "Post-Purchase Review & NPS Collector",
    slug: "review_nps_collector",
    description: "Waits 2 days after order delivery, sends WhatsApp interactive 5-star rating card, and logs feedback to Google Sheets.",
    category: "Marketing & Broadcasts",
    channels: ["WhatsApp"],
    apps: ["Google Sheets", "Webhook"],
    badge: "Community",
    isPremium: false,
    installCount: 940,
    stepsCount: 4,
    setupMinutes: 3,
    requiredConnections: ["WhatsApp Cloud API", "Google Sheets"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Webhook: Order Delivered Event", description: "Logistics carrier webhook trigger" },
      { number: 2, type: "condition", title: "Delay: 48 Hours", description: "Allows customer to unbox and experience product" },
      { number: 3, type: "action", title: "WhatsApp: Interactive 5-Star Rating Card", description: "Collects NPS feedback with 1-tap rating" },
      { number: 4, type: "action", title: "Google Sheets: Append Customer NPS Rating", description: "Stores survey responses in central sheet" },
    ],
  },
  {
    id: "tmpl_6",
    title: "Instant OTP & Transient Verification Gateway",
    slug: "instant_otp_verification",
    description: "Generates high-speed 6-digit authentication OTP with 10-minute TTL in Appnix Data Store and dispatches via RCS / WhatsApp.",
    category: "Utility / OTP",
    channels: ["WhatsApp", "RCS"],
    apps: ["Webhook", "Data Store"],
    badge: "Official",
    isPremium: false,
    installCount: 1610,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["WhatsApp Cloud API", "Appnix Data Store"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "API Webhook: Request OTP", description: "Web/mobile app calls OTP dispatch endpoint" },
      { number: 2, type: "action", title: "Data Store: Cache 6-Digit Code (TTL: 10m)", description: "Stores transient token with rate limiter" },
      { number: 3, type: "action", title: "WhatsApp / RCS: Dispatch Auth Template", description: "Sends secure OTP code with 1-tap copy button" },
    ],
  },
  {
    id: "tmpl_7",
    title: "VIP Customer Birthday & Anniversary Wishes",
    slug: "birthday_anniversary_wishes",
    description: "Automated daily cron check that scans CRM contacts for birthdays and sends personalized WhatsApp video greeting & gift voucher.",
    category: "Marketing & Broadcasts",
    channels: ["WhatsApp", "RCS"],
    apps: ["CRM", "Webhook"],
    badge: "Community",
    isPremium: false,
    installCount: 780,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["Appnix CRM Contacts", "WhatsApp Cloud API"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Scheduled Cron: Daily at 09:00 AM", description: "Runs daily morning contact query" },
      { number: 2, type: "condition", title: "Filter: Contact DOB matches Today", description: "Filters active celebration contacts" },
      { number: 3, type: "action", title: "WhatsApp: Send Greeting Card + Gift Coupon", description: "Delivers celebratory multimedia message" },
    ],
  },
  {
    id: "tmpl_8",
    title: "Webinar / Event Reminder Sequence",
    slug: "event_reminder_sequence",
    description: "Sends multi-step WhatsApp reminders: 24 hours before, 1 hour before, and 10 minutes before live webinar with direct join link.",
    category: "Marketing & Broadcasts",
    channels: ["WhatsApp", "RCS", "Facebook"],
    apps: ["Webhook", "Google Sheets"],
    badge: "Official",
    isPremium: false,
    installCount: 1190,
    stepsCount: 4,
    setupMinutes: 3,
    requiredConnections: ["WhatsApp Cloud API", "Event Registration Webhook"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Webhook: User Registered for Event", description: "Captures attendee name and phone number" },
      { number: 2, type: "action", title: "WhatsApp: Send 24-Hour Calendar Reminder", description: "Provides date & calendar invite link" },
      { number: 3, type: "action", title: "WhatsApp: 1-Hour Urgent Countdown", description: "Reminds attendee to prepare questions" },
      { number: 4, type: "action", title: "WhatsApp: 10-Min Final Call with Join URL", description: "Delivers direct webinar launch URL" },
    ],
  },
  {
    id: "tmpl_9",
    title: "Instagram Story Reply & Keyword DM Automation",
    slug: "instagram_story_reply_dm",
    description: "Auto-replies to Instagram Story mentions and specific DM keywords (e.g. 'PRICE', 'LINK') with instant catalog link.",
    category: "Lead Generation",
    channels: ["Instagram", "Facebook"],
    apps: ["Instagram", "AI Agent"],
    badge: "Official",
    isPremium: true,
    installCount: 1980,
    stepsCount: 3,
    setupMinutes: 2,
    requiredConnections: ["Instagram Graph API", "Appnix Catalog"],
    pipelineSteps: [
      { number: 1, type: "trigger", title: "Instagram: Story Mention / DM Keyword", description: "Triggers when user comments on story" },
      { number: 2, type: "condition", title: "Filter: Keyword match ('PRICE', 'BUY')", description: "Evaluates matching trigger phrase" },
      { number: 3, type: "action", title: "Instagram DM: Send Interactive Product Card", description: "Dispatches photo carousel with buy button" },
    ],
  },
];

const CATEGORIES = [
  "All",
  "E-Commerce",
  "Customer Support",
  "Lead Generation",
  "Marketing & Broadcasts",
  "Utility / OTP",
];

const CHANNELS = ["All Channels", "WhatsApp", "Instagram", "Facebook", "RCS"];

export default function WorkflowTemplatesPage() {
  const router = useRouter();

  // State
  const [templates, setTemplates] = useState<TemplateItem[]>(TEMPLATES_DATA);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>("All");

  // Modal States
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom Template State
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState<TemplateItem["category"]>("E-Commerce");
  const [customDesc, setCustomDesc] = useState("");

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      // Category filter
      if (selectedCategory !== "All" && tmpl.category !== selectedCategory) {
        return false;
      }
      // Channel filter
      if (
        selectedChannel !== "All Channels" &&
        !tmpl.channels.includes(selectedChannel)
      ) {
        return false;
      }
      // Badge filter
      if (selectedBadgeFilter !== "All" && tmpl.badge !== selectedBadgeFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tmpl.title.toLowerCase().includes(q);
        const matchDesc = tmpl.description.toLowerCase().includes(q);
        const matchApps = tmpl.apps.some((a) => a.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchApps) return false;
      }
      return true;
    });
  }, [templates, selectedCategory, selectedChannel, selectedBadgeFilter, searchQuery]);

  // Clone Template Action
  const handleUseTemplate = async (template: TemplateItem) => {
    setIsCloning(true);
    try {
      let newId = `wf_${Date.now()}`;
      try {
        const res = await api.post(`/api/automations/workflows/templates/${template.id}/clone`, {
          customTitle: template.title,
        });
        if (res.data?.data?.id) {
          newId = res.data.data.id;
        }
      } catch (err) {
        // Continue locally
      }

      setPreviewTemplate(null);
      router.push(`/automations/workflow/${newId}/builder`);
    } finally {
      setIsCloning(false);
    }
  };

  // Create Custom Template Action
  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newTmpl: TemplateItem = {
      id: `tmpl_${Date.now()}`,
      title: customTitle.trim(),
      slug: customTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      description: customDesc.trim() || "Custom organization automation template.",
      category: customCategory,
      channels: ["WhatsApp", "RCS"],
      apps: ["Webhook", "WhatsApp"],
      badge: "Community",
      isPremium: false,
      installCount: 1,
      stepsCount: 3,
      setupMinutes: 2,
      requiredConnections: ["WhatsApp Cloud API"],
      pipelineSteps: [
        { number: 1, type: "trigger", title: "Custom Webhook Trigger", description: "Listens for incoming custom payload" },
        { number: 2, type: "condition", title: "Condition: Validate Input Data", description: "Filters matching rules" },
        { number: 3, type: "action", title: "Action: Automated Message Dispatch", description: "Delivers message to recipient" },
      ],
    };

    setTemplates([newTmpl, ...templates]);
    setCustomTitle("");
    setCustomDesc("");
    setIsCustomModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
          <Link
            href="/automations/workflow"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Automations</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-primary font-semibold">Templates</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Workflow Templates
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
                Library ({templates.length})
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Browse and install ready-to-use automation workflows across WhatsApp, RCS, and social channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/automations/workflow">
              <Button variant="outline" size="sm" className="text-xs h-9 font-medium gap-1.5 shadow-xs">
                <Layers className="h-3.5 w-3.5" />
                <span>My Workflows</span>
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => setIsCustomModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create Custom Template</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Filters & Categories Section */}
      <div className="rounded-2xl border bg-card p-4 space-y-3.5 shadow-xs">
        {/* Search & Channel Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, app..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-9 text-xs bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            {/* Channel Filter Selector */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground cursor-pointer shadow-2xs focus:ring-1 focus:ring-primary"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>

            {/* Badge Type Selector */}
            <div className="flex items-center bg-muted/40 p-0.5 rounded-lg text-xs font-medium">
              {["All", "Official", "Premium"].map((badgeType) => (
                <button
                  key={badgeType}
                  type="button"
                  onClick={() => setSelectedBadgeFilter(badgeType)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all",
                    selectedBadgeFilter === badgeType
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {badgeType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs whitespace-nowrap scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? templates.length
                : templates.filter((t) => t.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isSelected ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Template Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground space-y-2">
            <Layers className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">No Templates Found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query or channel filter to discover more templates.
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border bg-card p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-primary/40 relative overflow-hidden"
            >
              {/* Top Row: Category & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="outline" className="text-[10px] font-semibold bg-muted/20 text-muted-foreground">
                    {template.category}
                  </Badge>

                  <div className="flex items-center gap-1">
                    {template.isPremium ? (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-bold gap-1">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                        {template.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {template.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {template.description}
                </p>

                {/* Channel / App Icons Stack */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Apps:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {template.apps.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/40 text-foreground border border-border"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Proof & Steps */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>{template.stepsCount} Steps</span>
                  </span>
                  <span>Used by {template.installCount.toLocaleString("en-IN")} teams</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(template)}
                  className="text-xs h-8.5 font-medium"
                >
                  Preview Flow
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8.5 font-semibold gap-1 shadow-xs"
                >
                  <span>Use Template</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: TEMPLATE PREVIEW MODAL                           */}
      {/* ========================================================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card text-card-foreground shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 pb-4 border-b flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    {previewTemplate.title}
                  </h2>
                  {previewTemplate.isPremium && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold gap-1">
                      <Crown className="h-3 w-3" />
                      <span>Premium</span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {previewTemplate.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewTemplate(null)}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 space-y-5">
              {/* Visual Pipeline Steps */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Flow Architecture & Step Sequence ({previewTemplate.stepsCount} Nodes):
                </span>
                <div className="space-y-2.5">
                  {previewTemplate.pipelineSteps.map((step, idx) => (
                    <div
                      key={step.number}
                      className="p-3 rounded-xl border bg-muted/20 flex items-start gap-3 relative"
                    >
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {step.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                          <Badge variant="outline" className="text-[9px] uppercase font-mono py-0">
                            {step.type}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Connections Checklist */}
              <div className="rounded-xl border bg-muted/10 p-4 space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Required Channel & API Integrations:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewTemplate.requiredConnections.map((conn) => (
                    <div key={conn} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{conn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-muted/20 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Avg. setup time: <strong>~{previewTemplate.setupMinutes} minutes</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isCloning}
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 gap-1.5 shadow-sm"
                >
                  {isCloning ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Cloning Workflow...</span>
                    </>
                  ) : (
                    <>
                      <span>Clone & Customize Workflow</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE CUSTOM TEMPLATE MODAL                      */}
      {/* ========================================================= */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Create Custom Template</h3>
                  <p className="text-xs text-muted-foreground">Save an automation pattern as a reusable blueprint</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCustomModalOpen(false)}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="custom-title" className="text-xs font-bold text-foreground">
                  Template Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="custom-title"
                  placeholder="e.g. VIP Concierge & Payment Dispatch"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="h-9 text-xs bg-background"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Category</Label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs text-foreground cursor-pointer"
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Marketing & Broadcasts">Marketing & Broadcasts</option>
                  <option value="Utility / OTP">Utility / OTP</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="custom-desc" className="text-xs font-bold text-foreground">
                  Description
                </Label>
                <Input
                  id="custom-desc"
                  placeholder="Brief summary of the flow and triggers"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="h-9 text-xs bg-background"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!customTitle.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 font-semibold shadow-sm"
                >
                  Save Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}