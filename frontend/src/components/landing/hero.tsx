"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  CheckCheck,
  Zap,
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

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  channel: "whatsapp" | "rcs" | "instagram" | "facebook";
  channelLabel: string;
  phone: string;
  preview: string;
  time: string;
  messages: {
    sender: "customer" | "agent" | "bot";
    text: string;
    time: string;
    buttons?: string[];
  }[];
}

const mockThreads: ChatThread[] = [
  {
    id: "ankit",
    name: "Ankit Bansal",
    avatar: "AB",
    avatarBg: "from-emerald-600 to-teal-600",
    channel: "whatsapp",
    channelLabel: "WhatsApp Cloud API",
    phone: "+91 93286 12083",
    preview: "Can you send the WhatsApp API pricing?",
    time: "Just now",
    messages: [
      {
        sender: "customer",
        text: "Hi Appnix! We process 50,000 monthly customer inquiries. Can we automate triage and route chats to our 10 sales agents?",
        time: "10:42 AM",
      },
      {
        sender: "bot",
        text: "Hello Ankit! Welcome to Appnix. Yes, our platform automatically routes incoming WhatsApp chats with SLA assignment and instant CRM sync.",
        time: "10:43 AM",
        buttons: ["📅 Book a Demo", "📦 View Pricing"],
      },
      {
        sender: "agent",
        text: "I've also reserved a 14-day dedicated sandbox with 10,000 test credits for your team.",
        time: "10:44 AM",
      },
    ],
  },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "from-blue-600 to-indigo-600",
    channel: "rcs",
    channelLabel: "Google RCS Verified",
    phone: "+1 (555) 304-9210",
    preview: "RCS flight card looks great!",
    time: "5m ago",
    messages: [
      {
        sender: "customer",
        text: "We want to replace standard SMS with Google RCS Rich Cards with verified checkmarks.",
        time: "10:30 AM",
      },
      {
        sender: "bot",
        text: "RCS gives you 85%+ open rates with interactive carousels and verified sender branding. Here is our live sandbox:",
        time: "10:31 AM",
        buttons: ["📱 View Sample RCS Card"],
      },
    ],
  },
  {
    id: "chloe",
    name: "Chloe Davenport",
    avatar: "CD",
    avatarBg: "from-pink-600 to-rose-600",
    channel: "instagram",
    channelLabel: "Instagram Direct",
    phone: "@chloe_style",
    preview: "Order placed via Instagram DM!",
    time: "12m ago",
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
        buttons: ["🛍️ Buy with 15% Off"],
      },
    ],
  },
];

export function Hero({ onOpenDemoModal }: HeroProps) {
  const [activeId, setActiveId] = useState("ankit");

  const currentThread =
    mockThreads.find((t) => t.id === activeId) || mockThreads[0];

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

          {/* Trust Guarantees */}
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

        {/* Clean, Minimalist & Spacious SaaS Dashboard Preview */}
        <div className="relative mt-12 lg:mt-16 mx-auto max-w-4xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/25 via-emerald-500/15 to-indigo-500/25 blur-xl opacity-60 pointer-events-none" />

          {/* Main Dashboard Window Container */}
          <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/90 inline-block" />
                </div>
                <span className="ml-2 text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Appnix Unified Inbox
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  4 Channels Live
                </Badge>
              </div>
            </div>

            {/* 2-Column Clean Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-background">
              {/* Left Column: Clean Conversation Feed (5 cols) */}
              <div className="md:col-span-5 border-r border-border/70 p-3 bg-card/40 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="px-1 py-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Active Conversations
                    </span>
                  </div>

                  {/* Conversation List */}
                  <div className="space-y-1.5">
                    {mockThreads.map((thread) => {
                      const isSelected = thread.id === activeId;
                      return (
                        <button
                          key={thread.id}
                          onClick={() => setActiveId(thread.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border border-primary/30 shadow-xs"
                              : "hover:bg-muted/60 border border-transparent"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${thread.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                              {thread.avatar}
                            </div>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground truncate">
                                {thread.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {thread.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {thread.preview}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {thread.channel === "whatsapp" && (
                              <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
                            )}
                            {thread.channel === "rcs" && (
                              <RCSIcon className="h-4 w-4 text-blue-600" />
                            )}
                            {thread.channel === "instagram" && (
                              <InstagramIcon className="h-4 w-4 text-pink-600" />
                            )}
                            {thread.channel === "facebook" && (
                              <FacebookIcon className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Quick Indicator */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Zap className="h-3.5 w-3.5 text-amber-500" /> AI Bot Auto-Triage
                  </span>
                  <span className="font-semibold text-foreground text-[11px]">99.8% SLA</span>
                </div>
              </div>

              {/* Right Column: Spacious, Clean Chat View (7 cols) */}
              <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-muted/5">
                {/* Active Chat Header */}
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${currentThread.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
                      {currentThread.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        {currentThread.name}
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {currentThread.channelLabel} • {currentThread.phone}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Active Session
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="space-y-3 py-4">
                  {currentThread.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === "customer" ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs space-y-1.5 ${
                          msg.sender === "customer"
                            ? "bg-card border border-border text-foreground rounded-tl-xs"
                            : "bg-primary text-primary-foreground rounded-tr-xs"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>

                        {/* Action buttons */}
                        {msg.buttons && (
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {msg.buttons.map((btn, bIdx) => (
                              <span
                                key={bIdx}
                                className="bg-white/15 text-white text-[10px] font-semibold px-2 py-0.5 rounded border border-white/20"
                              >
                                {btn}
                              </span>
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

                {/* Clean Input Composer */}
                <div className="rounded-xl border border-border/80 bg-card p-2 flex items-center gap-2 shadow-xs">
                  <input
                    readOnly
                    value="Type a reply or select an automated template..."
                    className="flex-1 bg-transparent text-xs text-muted-foreground outline-none border-none cursor-default px-2"
                  />
                  <Button size="sm" className="h-7 px-3 text-xs bg-primary text-primary-foreground gap-1">
                    <Send className="h-3 w-3" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Clean Floating Badges */}
          <div className="hidden sm:flex absolute -bottom-5 -left-5 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-lg items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <WhatsAppIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground">WhatsApp Cloud API</span>
              <p className="text-[10px] text-muted-foreground">Meta Verified & Synced</p>
            </div>
          </div>

          <div className="hidden sm:flex absolute -top-4 -right-4 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-lg items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <RCSIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground">RCS Business Messaging</span>
              <p className="text-[10px] text-muted-foreground">Google Verified Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
