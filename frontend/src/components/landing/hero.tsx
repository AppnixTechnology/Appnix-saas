"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  PhoneCall,
  CheckCheck,
  Search,
  Filter,
  User,
  MoreVertical,
  Paperclip,
  Smile,
  Activity,
  BarChart2,
  Users,
  Phone,
  Video,
  Info,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";

interface HeroProps {
  onOpenDemoModal: () => void;
}

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  channel: "whatsapp" | "instagram" | "rcs" | "facebook";
  channelLabel: string;
  identifier: string;
  unreadCount: number;
  tags: string[];
  dealValue: string;
  stage: string;
  assignedAgent: string;
  lastMessageTime: string;
  messages: {
    sender: "customer" | "agent" | "bot";
    text: string;
    time: string;
    isAi?: boolean;
    quickButtons?: string[];
  }[];
}

const mockConversations: ChatConversation[] = [
  {
    id: "ankit",
    name: "Ankit Bansal",
    avatar: "AB",
    avatarBg: "from-emerald-600 to-teal-500",
    channel: "whatsapp",
    channelLabel: "WhatsApp Cloud API",
    identifier: "+91 93286 12083",
    unreadCount: 2,
    tags: ["VIP Lead", "High Intent"],
    dealValue: "$12,000",
    stage: "Qualified Lead",
    assignedAgent: "Alex Rivera",
    lastMessageTime: "Just now",
    messages: [
      {
        sender: "customer",
        text: "Hi Appnix team! We process 50,000 monthly customer inquiries. Can we automate triage and route chats to our 10 sales agents?",
        time: "10:42 AM",
      },
      {
        sender: "bot",
        text: "Hello Ankit! Yes, Appnix natively routes high-volume WhatsApp conversations with round-robin SLA assignment and instant CRM contact sync.",
        time: "10:43 AM",
        isAi: true,
        quickButtons: ["📅 Book 1-on-1 Walkthrough", "📦 View Enterprise Catalog", "⚡ Test Sandbox API"],
      },
      {
        sender: "agent",
        text: "I've also reserved a 14-day dedicated sandbox with 10,000 test credits for your team. Would you like to test today?",
        time: "10:44 AM",
      },
    ],
  },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "from-blue-600 to-indigo-500",
    channel: "rcs",
    channelLabel: "Google RCS Verified",
    identifier: "+1 (555) 304-9210",
    unreadCount: 0,
    tags: ["Enterprise", "RCS Verified"],
    dealValue: "$18,500",
    stage: "Contract Review",
    assignedAgent: "Maya Lin",
    lastMessageTime: "5m ago",
    messages: [
      {
        sender: "customer",
        text: "We want to replace standard SMS OTP and promotional blasts with Google RCS Rich Cards with verified checkmarks.",
        time: "10:30 AM",
      },
      {
        sender: "agent",
        text: "RCS gives you 85%+ open rates with interactive carousels and verified sender trust badges. Here is our live RCS interactive sandbox:",
        time: "10:32 AM",
        quickButtons: ["📱 View Sample RCS Card", "📊 View Deliverability Metrics"],
      },
    ],
  },
  {
    id: "chloe",
    name: "Chloe Davenport",
    avatar: "CD",
    avatarBg: "from-pink-600 to-rose-500",
    channel: "instagram",
    channelLabel: "Instagram Direct",
    identifier: "@chloe_style",
    unreadCount: 1,
    tags: ["E-commerce", "Influencer"],
    dealValue: "$6,200",
    stage: "Active Inbound",
    assignedAgent: "Sarah Chen",
    lastMessageTime: "12m ago",
    messages: [
      {
        sender: "customer",
        text: "Loved the summer collection reels! Do you have size M available for the linen shirt?",
        time: "10:15 AM",
      },
      {
        sender: "bot",
        text: "Hey Chloe! Linen Shirt (Size M) is in stock with 2-day express shipping! Use promo code APPNIX15 for 15% off at checkout.",
        time: "10:16 AM",
        isAi: true,
        quickButtons: ["🛍️ Buy with 15% Discount", "💬 Chat with Stylist"],
      },
    ],
  },
];

export function Hero({ onOpenDemoModal }: HeroProps) {
  const [activeConvId, setActiveConvId] = useState<string>("ankit");
  const [composerText, setComposerText] = useState("");

  const activeConv =
    mockConversations.find((c) => c.id === activeConvId) || mockConversations[0];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-32 bg-radial-[at_50%_0%] from-primary/8 via-background to-background">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Badge */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-xs transition-all hover:bg-primary/10 mb-6 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>New: RCS Business Messaging + Instagram Direct Support</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Live Now →</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.12]">
            Connect Every Customer Conversation.
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              From One Powerful Platform.
            </span>
          </h1>

          {/* Hero Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Connect with customers across <strong className="font-semibold text-foreground">WhatsApp, Instagram, RCS, and Facebook</strong>. Manage conversations, broadcast targeted campaigns, automate replies, and track leads from one enterprise-grade CRM.
          </p>

          {/* Hero CTA Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-7 text-sm font-semibold shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/95 gap-2"
            >
              <Link href="/signup">
                Start 14-Day Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto h-12 px-7 text-sm font-semibold border-border hover:bg-accent gap-2"
            >
              <PhoneCall className="h-4 w-4 text-emerald-600" />
              Book a Personalized Demo
            </Button>
          </div>

          {/* Trust Guarantees Micro-copy */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Official Meta & Google APIs
            </span>
          </div>
        </div>

        {/* Hero Product Visual: REAL PRODUCTION APPNIX CHAT SCREEN */}
        <div className="relative mt-12 lg:mt-16 mx-auto max-w-6xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 via-emerald-500/20 to-indigo-500/30 blur-xl opacity-60 pointer-events-none" />

          {/* Main Dashboard Window Container */}
          <div className="relative rounded-2xl border border-border/90 bg-card shadow-2xl overflow-hidden">
            {/* Top Window Header Chrome */}
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/90 inline-block" />
                </div>
                <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Appnix Live Chat & CRM</span>
                  <span className="text-muted-foreground font-normal hidden sm:inline">• Omnichannel Desk</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-background border border-border px-2.5 py-1 rounded-full text-[11px] font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Official Cloud APIs: <strong className="text-emerald-600 font-bold">100% Operational</strong></span>
                </div>
              </div>
            </div>

            {/* Main 3-Column Real Chat Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] bg-background">
              {/* Column 1: Left Inbox Channel & Conversation Feed (4 cols) */}
              <div className="md:col-span-4 lg:col-span-3 border-r border-border/80 bg-card/60 flex flex-col justify-between">
                <div>
                  {/* Top Search & Filter */}
                  <div className="p-3 border-b border-border/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Inbox Conversations
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        8 Active
                      </span>
                    </div>

                    {/* Real Channel Filter Tabs */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center">
                      <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 py-1 rounded border border-emerald-500/30 flex items-center justify-center gap-1">
                        <WhatsAppIcon className="h-3 w-3 shrink-0" />
                        <span className="hidden xl:inline">WhatsApp</span>
                        <span className="xl:hidden">WA</span>
                      </span>
                      <span className="bg-pink-500/15 text-pink-700 dark:text-pink-400 py-1 rounded border border-pink-500/30 flex items-center justify-center gap-1">
                        <InstagramIcon className="h-3 w-3 shrink-0" />
                        <span className="hidden xl:inline">Instagram</span>
                        <span className="xl:hidden">IG</span>
                      </span>
                      <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 py-1 rounded border border-blue-500/30 flex items-center justify-center gap-1">
                        <RCSIcon className="h-3 w-3 shrink-0" />
                        <span>RCS</span>
                      </span>
                      <span className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 py-1 rounded border border-indigo-500/30 flex items-center justify-center gap-1">
                        <FacebookIcon className="h-3 w-3 shrink-0" />
                        <span className="hidden xl:inline">Facebook</span>
                        <span className="xl:hidden">FB</span>
                      </span>
                    </div>
                  </div>

                  {/* Conversation List Items */}
                  <div className="p-2 space-y-1">
                    {mockConversations.map((conv) => {
                      const isSelected = conv.id === activeConvId;
                      return (
                        <button
                          key={conv.id}
                          onClick={() => setActiveConvId(conv.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border border-primary/40 shadow-xs"
                              : "hover:bg-muted/70 border border-transparent"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${conv.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                              {conv.avatar}
                            </div>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground truncate">
                                {conv.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {conv.lastMessageTime}
                              </span>
                            </div>

                            <p className="text-[11px] text-muted-foreground truncate leading-snug">
                              {conv.messages[conv.messages.length - 1]?.text}
                            </p>

                            <div className="flex items-center gap-1 mt-1">
                              <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-semibold px-1.5 py-0.2 rounded inline-flex items-center gap-1">
                                {conv.channel === "whatsapp" && <WhatsAppIcon className="h-2.5 w-2.5" />}
                                {conv.channel === "rcs" && <RCSIcon className="h-2.5 w-2.5 text-blue-600" />}
                                {conv.channel === "instagram" && <InstagramIcon className="h-2.5 w-2.5 text-pink-600" />}
                                {conv.channel === "facebook" && <FacebookIcon className="h-2.5 w-2.5 text-indigo-600" />}
                                <span>{conv.channel.toUpperCase()}</span>
                              </span>
                              <span className="bg-primary/10 text-primary text-[9px] font-semibold px-1.5 py-0.2 rounded">
                                {conv.tags[0]}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Metric in Sidebar */}
                <div className="p-3 border-t border-border/70 bg-card/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Zap className="h-3 w-3 text-amber-500" /> Auto-Bot Active
                  </span>
                  <span className="font-bold text-foreground text-[11px]">99.8% Uptime</span>
                </div>
              </div>

              {/* Column 2: Center Live Conversation Thread (5 cols on lg, 8 cols on md) */}
              <div className="md:col-span-8 lg:col-span-6 p-4 flex flex-col justify-between bg-muted/10 border-r border-border/80">
                {/* Chat Top Header */}
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${activeConv.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                      {activeConv.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-foreground">
                          {activeConv.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 inline-flex items-center gap-1">
                          {activeConv.channel === "whatsapp" && <WhatsAppIcon className="h-2.5 w-2.5" />}
                          {activeConv.channel === "rcs" && <RCSIcon className="h-2.5 w-2.5 text-blue-600" />}
                          {activeConv.channel === "instagram" && <InstagramIcon className="h-2.5 w-2.5 text-pink-600" />}
                          {activeConv.channel === "facebook" && <FacebookIcon className="h-2.5 w-2.5 text-indigo-600" />}
                          <span>{activeConv.channelLabel}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {activeConv.identifier} • Assigned to <strong className="text-foreground">{activeConv.assignedAgent}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] bg-background">
                      {activeConv.stage}
                    </Badge>
                  </div>
                </div>

                {/* Message Bubble Thread */}
                <div className="space-y-3.5 py-4 overflow-y-auto max-h-[300px]">
                  {activeConv.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === "customer" ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                          msg.sender === "customer"
                            ? "bg-card border border-border text-foreground rounded-tl-xs"
                            : msg.isAi
                            ? "bg-primary text-primary-foreground rounded-tr-xs"
                            : "bg-slate-900 text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.isAi && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 border-b border-white/15 pb-1">
                            <Sparkles className="h-3 w-3" />
                            AI Co-Pilot Auto-Responder
                          </div>
                        )}

                        <p className="leading-relaxed">{msg.text}</p>

                        {/* Interactive Template Quick Buttons */}
                        {msg.quickButtons && (
                          <div className="pt-1.5 flex flex-wrap gap-1.5">
                            {msg.quickButtons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                className="bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 transition-colors cursor-pointer text-left"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        )}

                        <div
                          className={`flex items-center justify-end gap-1 text-[9px] ${
                            msg.sender === "customer"
                              ? "text-muted-foreground"
                              : "text-primary-foreground/75"
                          }`}
                        >
                          <span>{msg.time}</span>
                          {msg.sender !== "customer" && (
                            <CheckCheck className="h-3 w-3 text-emerald-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Real Composer Bar */}
                <div className="rounded-xl border border-border/90 bg-background p-2.5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20">
                      ⚡ /template: Schedule Demo
                    </span>
                    <span className="bg-muted text-foreground font-medium px-2 py-0.5 rounded cursor-pointer hover:bg-accent">
                      📎 Attach Catalog
                    </span>
                    <span className="bg-muted text-foreground font-medium px-2 py-0.5 rounded cursor-pointer hover:bg-accent hidden sm:inline">
                      💳 Payment Link
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder="Type a message or trigger an automated flow..."
                      className="flex-1 bg-transparent text-xs text-foreground outline-none border-none placeholder:text-muted-foreground"
                    />
                    <Button size="sm" className="h-8 px-3.5 text-xs bg-primary text-primary-foreground gap-1.5 shadow-xs">
                      <Send className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Column 3: Right Contact 360 CRM Intelligence Drawer (3 cols on lg, hidden on md) */}
              <div className="hidden lg:flex lg:col-span-3 p-4 bg-card flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/70 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" /> Contact 360°
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                      Lead Score: 94%
                    </Badge>
                  </div>

                  {/* Profile Summary Card */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Full Name</span>
                      <p className="font-bold text-foreground">{activeConv.name}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Phone / WhatsApp</span>
                      <p className="font-mono text-[11px] text-foreground">{activeConv.identifier}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Estimated Deal Pipeline</span>
                      <p className="font-bold text-emerald-600 text-sm">{activeConv.dealValue}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Assigned Sales Rep</span>
                      <p className="font-semibold text-foreground">{activeConv.assignedAgent}</p>
                    </div>
                  </div>

                  {/* Custom Tags */}
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      CRM Attributes & Tags
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeConv.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                      <span className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-md">
                        Auto-Synced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action */}
                <div className="pt-2 border-t border-border/60">
                  <Button
                    onClick={onOpenDemoModal}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold h-8 justify-between hover:bg-primary/10 hover:text-primary"
                  >
                    <span>View CRM Full Profile</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Status Cards around Hero Dashboard (Desktop & Tablet) */}
          <div className="hidden sm:flex absolute -bottom-6 -left-6 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3.5 shadow-xl items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <WhatsAppIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">WhatsApp Cloud API</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-muted-foreground">Meta Verified & Synced</p>
            </div>
          </div>

          <div className="hidden sm:flex absolute -top-5 -right-5 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3.5 shadow-xl items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <RCSIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">RCS Business Messaging</span>
                <span className="text-[10px] font-bold text-blue-600">Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground">99.4% Delivery Guarantee</p>
            </div>
          </div>

          <div className="hidden lg:flex absolute bottom-8 -right-8 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-lg items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground">+1,284 Leads</span>
              <p className="text-[10px] text-muted-foreground">Auto-assigned to CRM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
