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
} from "lucide-react";

interface HeroProps {
  onOpenDemoModal: () => void;
}

export function Hero({ onOpenDemoModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"sarah" | "ankit">("sarah");

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

        {/* Hero Product Visual & Unified Dashboard Preview */}
        <div className="relative mt-12 lg:mt-16 mx-auto max-w-5xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 via-emerald-500/20 to-indigo-500/30 blur-xl opacity-60 pointer-events-none" />

          {/* Main Dashboard Window Container */}
          <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
            {/* Top Window Header Chrome */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block" />
                </div>
                <span className="ml-2 text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Appnix Unified Inbox • Live Workspace
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  4 Channels Live
                </Badge>
                <span className="text-xs text-muted-foreground font-mono hidden sm:inline-block">
                  app.appnix.com/crm/live-chat
                </span>
              </div>
            </div>

            {/* Dashboard Inner Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-background">
              {/* Left Channel & Conversation List */}
              <div className="md:col-span-4 border-r border-border/70 p-3 bg-card flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Conversations
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      8 Unread
                    </span>
                  </div>

                  {/* Channel filter pills */}
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center">
                    <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 py-1 rounded border border-emerald-500/30">
                      WhatsApp
                    </span>
                    <span className="bg-pink-500/15 text-pink-700 dark:text-pink-400 py-1 rounded border border-pink-500/30">
                      Instagram
                    </span>
                    <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 py-1 rounded border border-blue-500/30">
                      RCS
                    </span>
                    <span className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 py-1 rounded border border-indigo-500/30">
                      Facebook
                    </span>
                  </div>

                  {/* Conversation items */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => setActiveTab("sarah")}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                        activeTab === "sarah"
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/60 border border-transparent"
                      }`}
                    >
                      <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          SJ
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground truncate">
                            Sarah Jenkins
                          </span>
                          <span className="text-[10px] text-muted-foreground">Just now</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Can we book the Enterprise Demo for our team?
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                            WhatsApp API
                          </span>
                          <span className="bg-primary/10 text-primary text-[9px] font-semibold px-1.5 py-0.2 rounded">
                            VIP Lead
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("ankit")}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                        activeTab === "ankit"
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/60 border border-transparent"
                      }`}
                    >
                      <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          AB
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground truncate">
                            Ankit Bansal
                          </span>
                          <span className="text-[10px] text-muted-foreground">3m ago</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Interested in RCS Business Messaging templates
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="bg-blue-500/15 text-blue-700 dark:text-blue-400 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                            RCS Verified
                          </span>
                          <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                            High Intent
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bottom Quick Metric in Sidebar */}
                <div className="mt-3 p-2.5 rounded-lg bg-muted/50 border border-border/60 text-xs flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Zap className="h-3 w-3 text-amber-500" /> Auto-Bot Active
                  </span>
                  <span className="font-bold text-foreground text-[11px]">99.8% Uptime</span>
                </div>
              </div>

              {/* Right Chat Thread & Smart Composer */}
              <div className="md:col-span-8 p-4 flex flex-col justify-between bg-muted/10">
                {/* Active Chat Header */}
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                      {activeTab === "sarah" ? "SJ" : "AB"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-foreground">
                          {activeTab === "sarah" ? "Sarah Jenkins (Acme Corp)" : "Ankit Bansal (FinScale)"}
                        </h4>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          {activeTab === "sarah" ? "WhatsApp Cloud API" : "RCS Business API"}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {activeTab === "sarah" ? "+1 (555) 304-9210 • Assigned to Alex (Sales)" : "+91 93286 12083 • Assigned to Maya (Support)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] bg-background">
                      Deal Stage: Qualified
                    </Badge>
                  </div>
                </div>

                {/* Message Bubble Thread */}
                <div className="space-y-3 py-3">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="rounded-2xl rounded-tl-xs bg-card border border-border p-3 text-xs shadow-2xs space-y-1">
                      <p className="text-foreground">
                        {activeTab === "sarah"
                          ? "Hi Appnix! We manage 40,000 WhatsApp inquiries monthly across 8 agents. Can your unified inbox and CRM handle automated routing?"
                          : "Hello! We are looking to replace standard SMS with RCS interactive rich cards for our banking transaction alerts."}
                      </p>
                      <span className="text-[9px] text-muted-foreground block text-right">
                        10:24 AM
                      </span>
                    </div>
                  </div>

                  {/* AI Bot Auto-response preview */}
                  <div className="flex items-start gap-2 max-w-[85%] ml-auto justify-end">
                    <div className="rounded-2xl rounded-tr-xs bg-primary text-primary-foreground p-3 text-xs shadow-xs space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                        <Sparkles className="h-3 w-3" />
                        AI Co-Pilot Auto Qualification
                      </div>
                      <p className="leading-relaxed">
                        {activeTab === "sarah"
                          ? "Yes, absolutely Sarah! Appnix handles over 1 Billion messages with multi-agent SLA routing, live tagging, and instant webhook sync with your CRM."
                          : "Appnix provides full Google RCS Business Messaging verified senders with carousel cards, verified checkmarks, and 85%+ open rates."}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[9px] opacity-80">
                        <span>10:25 AM</span>
                        <CheckCheck className="h-3 w-3 text-emerald-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Composer Bar */}
                <div className="rounded-xl border border-border/80 bg-background p-2 shadow-2xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md cursor-pointer hover:bg-primary/20">
                      ⚡ Quick Template: Schedule Demo
                    </span>
                    <span className="bg-muted text-foreground font-medium px-2 py-0.5 rounded-md cursor-pointer hover:bg-accent">
                      📎 Attach Catalog
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={
                        activeTab === "sarah"
                          ? "I have reserved a 14-day Enterprise sandbox for your team. Click below to confirm."
                          : "Here is the documentation on setting up RCS verified sender profile."
                      }
                      className="flex-1 bg-transparent text-xs text-foreground outline-none border-none cursor-default"
                    />
                    <Button size="sm" className="h-7 px-3 text-xs bg-primary text-primary-foreground gap-1">
                      <Send className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Status Cards around Hero Dashboard (Desktop & Tablet) */}
          <div className="hidden sm:flex absolute -bottom-6 -left-6 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3.5 shadow-xl items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
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
              <Smartphone className="h-5 w-5" />
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
