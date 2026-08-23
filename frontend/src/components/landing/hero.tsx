"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Search,
  MessageSquare,
  Bot,
  Zap,
  UserCheck,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Send,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";

interface HeroProps {
  onOpenDemoModal?: () => void;
}

type StoryStep = 1 | 2 | 3 | 4;

export function Hero({ onOpenDemoModal }: HeroProps) {
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "instagram" | "rcs" | "facebook">("whatsapp");
  const [storyStep, setStoryStep] = useState<StoryStep>(1);

  // 5–7 Second Visual Story Cycle
  useEffect(() => {
    const stepTimers = [
      setTimeout(() => setStoryStep(1), 0),      // Step 1: New message arrives
      setTimeout(() => setStoryStep(2), 1600),   // Step 2: Lead Captured
      setTimeout(() => setStoryStep(3), 3200),   // Step 3: Assigned to Sales Team
      setTimeout(() => setStoryStep(4), 4800),   // Step 4: Follow-up Scheduled
    ];

    const cycleInterval = setInterval(() => {
      setStoryStep(1);
      setTimeout(() => setStoryStep(2), 1600);
      setTimeout(() => setStoryStep(3), 3200);
      setTimeout(() => setStoryStep(4), 4800);
    }, 6400);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(cycleInterval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      {/* ─── 1. TECHNICAL BACKGROUND: CLEAN WITH 3–6% OPACITY GRID & SOFT ATMOSPHERIC GLOW ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Subtle technical grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] opacity-70" />
        
        {/* Soft atmospheric radial glow behind the product UI */}
        <div className="absolute top-1/4 right-[5%] w-[580px] h-[580px] bg-primary/6 dark:bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-[15%] w-[460px] h-[460px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
          
          {/* ─── 2. LEFT COLUMN: LEAD-GENERATION HERO CONTENT ─── */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-secondary/80 dark:bg-secondary/40 border border-border text-foreground text-xs sm:text-sm font-medium shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>New: RCS + Instagram Direct Support</span>
            </div>

            {/* Main Primary Headline (Single H1) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl font-extrabold tracking-tight text-foreground leading-[1.14]">
              Turn Every Customer Conversation Into a{" "}
              <span className="text-primary dark:text-primary-foreground font-extrabold">
                Business Opportunity.
              </span>
            </h1>

            {/* Subheading (Concise, Benefit-Oriented, Max-Width 580px) */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-[580px] mx-auto lg:mx-0 font-normal leading-relaxed">
              Connect WhatsApp, Instagram, RCS and Facebook with CRM, automation and campaigns — all in one powerful platform.
            </p>

            {/* CTA Group: Primary (Book a Demo) + Secondary (Start Free Trial) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Primary CTA: Book a Free Demo */}
              <button
                type="button"
                onClick={() => onOpenDemoModal?.()}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-primary-foreground bg-primary hover:bg-primary/95 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Book a Free Demo</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA: Start Free Trial */}
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-foreground bg-background hover:bg-accent/60 border border-border shadow-xs hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Start Free Trial</span>
              </Link>
            </div>

            {/* Supporting Trust & Verified Claims */}
            <div className="pt-3 border-t border-border/80 space-y-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Quick setup
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Multi-channel messaging
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  CRM &amp; automation
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80 text-center lg:text-left">
                See how Appnix can help your business capture, manage and convert more leads.
              </p>
            </div>
          </div>

          {/* ─── 3. RIGHT COLUMN: REALISTIC APPNIX PRODUCT UI & LIVE VISUAL STORY ─── */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Subtle Channel Connection Flow Lines (Decorative behind UI) */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 opacity-25 pointer-events-none select-none" aria-hidden="true">
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span>──────┐</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
                <span>──────┤</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <RCSIcon className="h-3.5 w-3.5 text-blue-600" />
                <span>──────┼──→</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <FacebookIcon className="h-3.5 w-3.5 text-indigo-600" />
                <span>──────┘</span>
              </div>
            </div>

            {/* Main Appnix Unified Inbox Interface Frame */}
            <div className="relative w-full max-w-[560px] rounded-2xl border border-border bg-card shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden text-card-foreground text-left">
              
              {/* Product UI Top Chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40 select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <span className="ml-2 text-xs font-bold text-foreground tracking-tight flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                    Appnix Unified Inbox
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Sync</span>
                </div>
              </div>

              {/* Product UI Inner Layout */}
              <div className="grid grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-border">
                
                {/* Channel Sidebar (4 cols on desktop) */}
                <div className="col-span-12 sm:col-span-4 p-3 bg-secondary/15 space-y-2">
                  <div className="relative mb-2">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <div className="w-full bg-background border border-border rounded-md pl-8 pr-2 py-1 text-[11px] text-muted-foreground truncate">
                      Search chats...
                    </div>
                  </div>

                  <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Channels
                  </p>

                  <div className="space-y-1">
                    {/* WhatsApp */}
                    <div
                      onClick={() => setActiveChannel("whatsapp")}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeChannel === "whatsapp"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">WhatsApp</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600">
                        12
                      </span>
                    </div>

                    {/* Instagram */}
                    <div
                      onClick={() => setActiveChannel("instagram")}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeChannel === "instagram"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <InstagramIcon className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                        <span className="truncate">Instagram</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
                        7
                      </span>
                    </div>

                    {/* RCS */}
                    <div
                      onClick={() => setActiveChannel("rcs")}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeChannel === "rcs"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <RCSIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">RCS Business</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
                        4
                      </span>
                    </div>

                    {/* Facebook */}
                    <div
                      onClick={() => setActiveChannel("facebook")}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeChannel === "facebook"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FacebookIcon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">Facebook</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-muted-foreground">
                        3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversation & Lead Stage Panel (8 cols on desktop) */}
                <div className="col-span-12 sm:col-span-8 p-3.5 flex flex-col justify-between space-y-3 bg-card min-h-[310px]">
                  
                  {/* Chat Contact Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-1 ring-primary/20">
                        SJ
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground leading-none">
                          Sarah Jenkins
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          via WhatsApp API • +1 (555) 304-9210
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      10:42 AM
                    </span>
                  </div>

                  {/* Message Thread (Visual Story Step 1) */}
                  <div className="space-y-2.5 flex-1 py-1">
                    {/* Customer Message */}
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <div className="bg-secondary p-2.5 rounded-2xl rounded-tl-xs text-xs text-foreground leading-relaxed shadow-2xs">
                        Hi, I&apos;m interested in your enterprise messaging and CRM automation. Can we schedule a demo?
                      </div>
                    </div>

                    {/* Agent / AI Response */}
                    <div className="flex items-end justify-end gap-1.5 max-w-[90%] ml-auto">
                      <div className="bg-primary text-primary-foreground p-2.5 rounded-2xl rounded-tr-xs text-xs leading-relaxed shadow-2xs">
                        Hello Sarah! Thanks for reaching out. We&apos;d love to give you a personalized walkthrough.
                      </div>
                    </div>
                  </div>

                  {/* ─── LIVE CRM & AUTOMATION STATUS STAGES (Steps 2, 3, 4) ─── */}
                  <div className="pt-2.5 border-t border-border/80 grid grid-cols-3 gap-1.5 text-[10px] bg-secondary/30 -mx-3.5 -mb-3.5 p-3">
                    
                    {/* Stage 1: Lead Status */}
                    <div className="p-1.5 rounded-md bg-background border border-border space-y-0.5">
                      <p className="text-muted-foreground text-[9px] font-medium uppercase">
                        Lead Status
                      </p>
                      <p className={`font-bold flex items-center gap-1 transition-all duration-300 ${
                        storyStep >= 2 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      }`}>
                        <Check className="h-3 w-3 shrink-0" />
                        {storyStep >= 2 ? "Captured" : "Pending"}
                      </p>
                    </div>

                    {/* Stage 2: Assignment */}
                    <div className="p-1.5 rounded-md bg-background border border-border space-y-0.5">
                      <p className="text-muted-foreground text-[9px] font-medium uppercase">
                        Assigned To
                      </p>
                      <p className={`font-bold flex items-center gap-1 transition-all duration-300 ${
                        storyStep >= 3 ? "text-primary dark:text-primary-foreground" : "text-muted-foreground"
                      }`}>
                        <UserCheck className="h-3 w-3 shrink-0" />
                        {storyStep >= 3 ? "Sales Team" : "Routing..."}
                      </p>
                    </div>

                    {/* Stage 3: Automation */}
                    <div className="p-1.5 rounded-md bg-background border border-border space-y-0.5">
                      <p className="text-muted-foreground text-[9px] font-medium uppercase">
                        Automation
                      </p>
                      <p className={`font-bold flex items-center gap-1 transition-all duration-300 ${
                        storyStep >= 4 ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                      }`}>
                        <Zap className="h-3 w-3 shrink-0" />
                        {storyStep >= 4 ? "Scheduled" : "Waiting"}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ─── 4. ONLY 2–3 GENTLY FLOATING STATUS CARDS ─── */}

            {/* Card 1: New Lead Notification (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-left-6 z-20 pointer-events-none hidden sm:block animate-float-slow">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-lg shadow-slate-900/10 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight text-[11px]">
                    + New Lead Captured
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Sarah • WhatsApp Cloud API
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Automation Active (Bottom Right) */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 z-20 pointer-events-none hidden sm:block animate-float-reverse">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-lg shadow-slate-900/10 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight text-[11px]">
                    Automation Active ✓
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Follow-up scheduled in CRM
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: WhatsApp Connected (Bottom Left Subtle) */}
            <div className="absolute -bottom-5 left-8 z-20 pointer-events-none hidden md:block">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/90 border border-border shadow-md text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold backdrop-blur-xs">
                <WhatsAppIcon className="h-3 w-3" />
                <span>WhatsApp Official API Connected ✓</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
