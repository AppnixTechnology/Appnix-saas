"use client";

import { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bot,
  Zap,
  CheckCheck,
  Image as ImageIcon,
  ShoppingBag,
  Bell,
  Star,
  ShieldCheck,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";

type ChannelId = "whatsapp" | "instagram" | "rcs" | "facebook";

interface ChannelConfig {
  id: ChannelId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  themeColor: string;
  verifiedHeader: string;
  senderName: string;
  senderHandle: string;
  customerName: string;
  customerAvatar: string;
  customerAvatarBg: string;
  messages: {
    sender: "customer" | "agent" | "bot";
    text: string;
    time: string;
    quickButtons?: string[];
    richCard?: {
      title: string;
      description: string;
      ctaText: string;
      badge?: string;
    };
  }[];
}

const channelsData: ChannelConfig[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    badge: "Official Meta Partner",
    tagline: "Verified Cloud API with 98% Read Rates",
    description:
      "Send verified WhatsApp notifications, launch automated catalog ordering, and resolve support queries with official Meta Cloud API infrastructure.",
    features: [
      "Official Green Badge Verification & Security",
      "Interactive Template Messages with Quick-Reply Buttons",
      "Automated Product Catalog & Checkout Flows",
      "24/7 AI Bot Resolution with Human Agent Handover",
    ],
    themeColor: "emerald",
    verifiedHeader: "Meta Verified WhatsApp Cloud API • End-to-End Encrypted",
    senderName: "Appnix Official Solutions",
    senderHandle: "+1 (800) 555-0199",
    customerName: "Vikram Malhotra",
    customerAvatar: "VM",
    customerAvatarBg: "from-emerald-600 to-teal-600",
    messages: [
      {
        sender: "customer",
        text: "Hi Appnix team! Can you share the WhatsApp Cloud API documentation and sandbox details for our CRM integration?",
        time: "11:15 AM",
      },
      {
        sender: "bot",
        text: "Hello Vikram! Welcome to Appnix. Here is our official developer portal and instant sandbox access pre-loaded with 10,000 test messages:",
        time: "11:15 AM",
        richCard: {
          title: "Appnix WhatsApp Cloud API Sandbox",
          description: "Full webhook event listener, interactive template manager, and CRM contact auto-sync.",
          ctaText: "Open Sandbox Console →",
          badge: "Instant Activation",
        },
        quickButtons: ["📦 View API Specs", "📅 Book Live Demo", "💬 Chat with Engineer"],
      },
      {
        sender: "agent",
        text: "I've assigned Maya (Senior Solutions Engineer) to assist your team with custom webhooks setup.",
        time: "11:16 AM",
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram Direct",
    badge: "Meta Direct API",
    tagline: "Turn Story Replies & DMs into Revenue",
    description:
      "Never miss a comment, mention, or direct message. Trigger instant responses to keyword triggers and convert followers into paying customers.",
    features: [
      "Automated Story Mention & DM Replies",
      "Keyword-Triggered Sales Funnels (e.g. 'Comment PRICE')",
      "Unified DM Inbox for Multiple Instagram Accounts",
      "Direct E-commerce Product Link Sharing",
    ],
    themeColor: "pink",
    verifiedHeader: "Instagram Direct Business Messaging • Meta Official",
    senderName: "Appnix Growth Studio",
    senderHandle: "@appnix_official",
    customerName: "Chloe Davenport",
    customerAvatar: "CD",
    customerAvatarBg: "from-pink-600 to-rose-600",
    messages: [
      {
        sender: "customer",
        text: "Loved your latest reel on automating omnichannel live chat! Can we integrate our Shopify store inventory?",
        time: "02:30 PM",
      },
      {
        sender: "bot",
        text: "Hey Chloe! Yes, Appnix syncs 1-click with Shopify and WooCommerce to automatically send order alerts and product cards 🎉",
        time: "02:30 PM",
        richCard: {
          title: "Shopify Omnichannel Live Connector",
          description: "Sync orders, track abandoned carts, and send real-time dispatch updates.",
          ctaText: "Explore Shopify Integration",
          badge: "1-Click Sync",
        },
        quickButtons: ["🛍️ View Demo Store", "⚡ Start Free Trial"],
      },
      {
        sender: "customer",
        text: "Ordered our trial account! The automated response speed is incredible 🙌",
        time: "02:32 PM",
      },
    ],
  },
  {
    id: "rcs",
    name: "RCS Business Messaging",
    badge: "Google Verified",
    tagline: "Next-Gen Interactive Rich SMS",
    description:
      "Upgrade outdated SMS into high-engagement rich media experiences featuring carousels, action chips, verified branding, and zero spam friction.",
    features: [
      "Verified Google Sender Logo & Trust Shield",
      "High-Resolution Carousel Cards & Video Previews",
      "Native Suggested Action Chips & Date Pickers",
      "Full Delivery & Read Receipts Tracking",
    ],
    themeColor: "blue",
    verifiedHeader: "Google Verified RCS Agent • 100% Brand Authenticity",
    senderName: "Apex Airline Alerts",
    senderHandle: "Verified RCS Sender",
    customerName: "David Miller",
    customerAvatar: "DM",
    customerAvatarBg: "from-blue-600 to-indigo-600",
    messages: [
      {
        sender: "bot",
        text: "Your flight AP-402 to San Francisco is on schedule. Terminal 3 Gate B12 boarding starts at 04:15 PM.",
        time: "03:45 PM",
        richCard: {
          title: "Flight AP-402 • Mobile Boarding Pass Ready",
          description: "Seat 14A • Priority Boarding Group 2 • Gate B12",
          ctaText: "View Mobile Boarding Pass",
          badge: "On Time",
        },
        quickButtons: ["💺 Upgrade Seat", "🍔 Pre-order Meal", "🔔 Alert Flight Changes"],
      },
      {
        sender: "customer",
        text: "Can I upgrade to Extra Legroom seat 12C?",
        time: "03:48 PM",
      },
      {
        sender: "agent",
        text: "Seat 12C is confirmed for you David! Your updated mobile pass has been generated.",
        time: "03:49 PM",
      },
    ],
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    badge: "Official Meta API",
    tagline: "Scale Lead Generation & Page Inquiries",
    description:
      "Seamlessly connect your Facebook business pages and Click-to-Messenger ads directly into Appnix for real-time lead qualification.",
    features: [
      "Connect Multiple Facebook Pages to 1 Team Inbox",
      "Instant Click-to-Messenger Ad Lead Capture",
      "Custom Automated Menu & FAQ Navigation",
      "Seamless CRM Contact Record Creation",
    ],
    themeColor: "indigo",
    verifiedHeader: "Facebook Messenger Verified Business • Meta Official",
    senderName: "Appnix Enterprise Desk",
    senderHandle: "fb.me/appnixtech",
    customerName: "Jessica Lee",
    customerAvatar: "JL",
    customerAvatarBg: "from-indigo-600 to-purple-600",
    messages: [
      {
        sender: "customer",
        text: "Hi support team, checking status of our Click-to-Messenger campaign leads routing.",
        time: "09:10 AM",
      },
      {
        sender: "agent",
        text: "Hi Jessica! All 450 inbound leads from your Facebook campaign have been automatically qualified and assigned in CRM.",
        time: "09:12 AM",
        richCard: {
          title: "Campaign Conversion Report",
          description: "450 Leads Captured • 89 Qualified Opportunities • 0 Missed Chats",
          ctaText: "View Full CRM Pipeline",
          badge: "Real-time Sync",
        },
        quickButtons: ["📊 Download CSV", "👥 Reassign Team Leads"],
      },
      {
        sender: "customer",
        text: "Outstanding results, thank you team!",
        time: "09:14 AM",
      },
    ],
  },
];

export function ChannelDemo({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const [selectedChannelId, setSelectedChannelId] = useState<ChannelId>("whatsapp");
  const [activeInputText, setActiveInputText] = useState("");

  const currentChannel =
    channelsData.find((c) => c.id === selectedChannelId) || channelsData[0];

  return (
    <section id="channels" className="py-20 sm:py-28 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Unified Channel Architecture
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            One Inbox. Every Conversation.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Manage your business conversations across all major messaging channels from one place with official APIs and zero workarounds.
          </p>
        </div>

        {/* Interactive Channel Tabs Grid (Hover & Click Switch) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {channelsData.map((channel) => {
            const isSelected = channel.id === selectedChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                onMouseEnter={() => setSelectedChannelId(channel.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-card border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
                    : "bg-card/60 hover:bg-card border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {channel.id === "whatsapp" && (
                      <WhatsAppIcon className="h-5 w-5 text-emerald-600" />
                    )}
                    {channel.id === "instagram" && (
                      <InstagramIcon className="h-5 w-5 text-pink-600" />
                    )}
                    {channel.id === "rcs" && (
                      <RCSIcon className="h-5 w-5 text-blue-600" />
                    )}
                    {channel.id === "facebook" && (
                      <FacebookIcon className="h-5 w-5 text-indigo-600" />
                    )}
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      {channel.id.toUpperCase()}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] line-clamp-1 font-medium">
                  {channel.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Demo Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl">
          {/* Left Column: Channel Details & Capabilities */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary font-semibold text-xs border-primary/20">
                {currentChannel.badge}
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {currentChannel.name}
              </h3>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {currentChannel.tagline}
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentChannel.description}
            </p>

            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Key Channel Capabilities
              </span>
              {currentChannel.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Button
                onClick={onOpenDemoModal}
                className="h-10 px-5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm"
              >
                Connect {currentChannel.name.split(" ")[0]} Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Right Column: REAL AUTHENTIC CHANNEL CHAT UI */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col min-h-[460px]">
              {/* Channel Security / Partner Banner */}
              <div className="bg-muted/70 border-b border-border px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {currentChannel.verifiedHeader}
                </span>
                <span className="font-mono text-[10px]">appnix-cloud-gateway</span>
              </div>

              {/* Channel Header */}
              <div className="border-b border-border bg-card p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${currentChannel.customerAvatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                    {currentChannel.customerAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-foreground">
                        {currentChannel.customerName}
                      </h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentChannel.senderHandle} • Active Client Thread
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-background">
                    Auto-Routing: Active
                  </Badge>
                </div>
              </div>

              {/* Chat Thread Container */}
              <div className="flex-1 p-4 sm:p-5 space-y-3.5 bg-muted/10 overflow-y-auto max-h-[310px]">
                {currentChannel.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === "customer" ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2.5 ${
                        msg.sender === "customer"
                          ? "bg-card border border-border text-foreground rounded-tl-xs"
                          : "bg-primary text-primary-foreground rounded-tr-xs"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {/* Rich Media Card */}
                      {msg.richCard && (
                        <div className="rounded-xl border border-white/20 bg-black/20 p-3 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-white">
                              {msg.richCard.title}
                            </h5>
                            {msg.richCard.badge && (
                              <span className="bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                {msg.richCard.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/90 leading-tight">
                            {msg.richCard.description}
                          </p>
                          <div className="pt-0.5">
                            <span className="inline-block text-[10px] font-bold text-emerald-300 underline cursor-pointer">
                              {msg.richCard.ctaText}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Interactive Quick Reply Buttons */}
                      {msg.quickButtons && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
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

              {/* Real Input Composer */}
              <div className="p-3 border-t border-border bg-card space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20">
                    ⚡ /template: Quick Reply
                  </span>
                  <span className="bg-muted text-foreground font-medium px-2 py-0.5 rounded cursor-pointer hover:bg-accent">
                    📎 Attach Media
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={activeInputText}
                    onChange={(e) => setActiveInputText(e.target.value)}
                    placeholder={`Reply via ${currentChannel.name}...`}
                    className="flex-1 text-xs bg-muted/40 rounded-lg px-3 py-2 text-foreground border-none outline-none placeholder:text-muted-foreground"
                  />
                  <Button size="sm" className="h-8 px-3 text-xs bg-primary text-primary-foreground gap-1">
                    <Send className="h-3 w-3" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
