"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  MessageSquare,
  Send,
  Users,
  Activity,
  Globe,
  Lock,
  Layers,
  ChevronRight,
  TrendingUp,
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

const liveChannels = [
  {
    name: "WhatsApp API",
    icon: WhatsAppIcon,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "Official Meta Tier",
  },
  {
    name: "Google RCS",
    icon: RCSIcon,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "Verified Sender",
  },
  {
    name: "Instagram DM",
    icon: InstagramIcon,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    badge: "Story & DMs",
  },
  {
    name: "Facebook Messenger",
    icon: FacebookIcon,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    badge: "Omnichannel",
  },
];

const mockToasts = [
  {
    id: 1,
    channel: "WhatsApp",
    icon: WhatsAppIcon,
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/10",
    sender: "Ankit Bansal (Acme Corp)",
    time: "Just now",
    message: "Need 50,000 monthly WhatsApp API credits for CRM",
    status: "⚡ Auto-routed to Sales • SLA: 2s",
  },
  {
    id: 2,
    channel: "Google RCS",
    icon: RCSIcon,
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/10",
    sender: "Verified RCS Campaign",
    time: "1m ago",
    message: "Festive Flash Sale • 12,450 Rich Cards Delivered",
    status: "📈 94.8% Open Rate • 3.2x ROI",
  },
  {
    id: 3,
    channel: "Instagram DM",
    icon: InstagramIcon,
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    glowColor: "shadow-pink-500/10",
    sender: "Chloe Vance (Story Lead)",
    time: "2m ago",
    message: "Replied to story: 'Can we white-label this platform?'",
    status: "🤖 AI Bot Qualified • Stage: Opportunity",
  },
];

export function Hero({ onOpenDemoModal }: HeroProps) {
  const [activeToastIndex, setActiveToastIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveToastIndex((prev) => (prev + 1) % mockToasts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Ensure video plays smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#070b14] text-white min-h-[92vh] flex items-center pt-24 pb-16 sm:pb-24 lg:pt-32 lg:pb-28">
      {/* ─── 1. ATMOSPHERIC AMBIENT GLOWS & GRID ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing emerald primary beacon */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-emerald-500/12 rounded-full blur-[140px] animate-pulse-glow" />
        {/* Glowing cyan secondary beacon */}
        <div className="absolute top-1/3 -right-20 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px]" />
        {/* Deep blue bottom fill */}
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />

        {/* High-tech precision grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_65%,transparent_100%)] opacity-80" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
          
          {/* ─── 2. LEFT COLUMN: HIGH-CONVERTING HERO COPY ─── */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left z-10">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/25 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.12)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-300">
                AI-Powered Customer Conversation Platform
              </span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Connect Every Customer Conversation{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent inline-block">
                in One Powerful Platform
              </span>
            </h1>

            {/* Subheadline: 1 concise sentence, max 20 words */}
            <p className="text-base sm:text-lg text-slate-300/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Unify WhatsApp, Instagram, Facebook, and RCS into an enterprise AI inbox that closes deals 3x faster.
            </p>

            {/* Channel Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {liveChannels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.name}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 ${ch.bg} ${ch.color}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{ch.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Two Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary solid brand green button */}
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary outline/ghost personalized demo button */}
              <button
                type="button"
                onClick={() => onOpenDemoModal?.()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/40 backdrop-blur-md transition-all duration-200 hover:scale-[1.01]"
              >
                <Play className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                <span>Book a Personalized Demo</span>
              </button>
            </div>

            {/* Micro Trust Row */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                {/* 5-Star rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-200">4.9/5</span>
                  <span>(500+ reviews)</span>
                </div>

                <span className="hidden sm:inline text-slate-600">•</span>

                {/* Key reassurance */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Meta Verified API & Google RCS Partner</span>
                </div>
              </div>

              {/* Enterprise Guarantee */}
              <p className="text-[11px] text-slate-400/90 text-center lg:text-left">
                ✓ No credit card required • Instant 14-day dedicated sandbox • White-label ready
              </p>
            </div>
          </div>

          {/* ─── 3. RIGHT COLUMN: SOFT-GLASSMORPHISM PRODUCT VIDEO & FLOATING TOASTS ─── */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Ambient halo glow behind the frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-3xl blur-2xl transform scale-95 pointer-events-none" />

            {/* Main Glassmorphism Browser Device Frame */}
            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/85 shadow-[0_25px_70px_-15px_rgba(16,185,129,0.22),0_0_40px_rgba(255,255,255,0.06)] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
              
              {/* Browser Window Header Chrome */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/10 select-none">
                {/* Window control dots */}
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80 ring-1 ring-rose-600/30" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80 ring-1 ring-amber-600/30" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 ring-1 ring-emerald-600/30" />
                </div>

                {/* URL Bar */}
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-md bg-slate-900/90 border border-white/5 text-[11px] text-slate-300 font-mono tracking-tight max-w-[260px] truncate shadow-inner">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span className="text-slate-400">appnix.io/</span>
                  <span className="text-emerald-300 font-medium">unified-inbox-live</span>
                </div>

                {/* Live Stream Pill */}
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live CRM Stream</span>
                </div>
              </div>

              {/* Product Video Container */}
              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/logo-favicon.png"
                  className="w-full h-full object-cover object-center"
                >
                  <source src="/video/A_clean_modern_SaaS_product_d.mp4" type="video/mp4" />
                  <source src="/videos/A_clean_modern_SaaS_product_d.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video streaming.
                </video>

                {/* Subtle bottom vignette gradient for depth */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Live Channel Quick Indicators in bottom-left of video */}
                <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950/85 border border-white/10 backdrop-blur-md text-[11px] text-slate-300">
                  <span className="text-slate-400 font-medium pl-1">Streams:</span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    <WhatsAppIcon className="h-3 w-3" /> WhatsApp
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    <RCSIcon className="h-3 w-3" /> RCS
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-semibold">
                    <InstagramIcon className="h-3 w-3" /> IG
                  </span>
                </div>

                {/* Live KPI Metric in bottom-right of video */}
                <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/30 backdrop-blur-md text-[11px] font-semibold text-emerald-300 shadow-lg">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  <span>SLA: 1.2s • 99.8% Resolution</span>
                </div>
              </div>
            </div>

            {/* ─── FLOATING LIVE NOTIFICATION CARD 1 (Top Left Overlapping) ─── */}
            <div className="absolute -top-6 -left-4 sm:-left-8 z-20 animate-float-slow max-w-[270px] sm:max-w-[310px] pointer-events-none sm:pointer-events-auto">
              <div className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl space-y-1.5 transition-all hover:scale-105">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white">WhatsApp Cloud API</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Live Deal
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium line-clamp-2">
                  &ldquo;Need 50,000 WhatsApp API credits &amp; automated lead routing for 10 agents.&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1">
                    <CheckCheck className="h-3 w-3 text-emerald-400" /> Auto-assigned to Sales
                  </span>
                  <span>2s ago</span>
                </div>
              </div>
            </div>

            {/* ─── FLOATING LIVE NOTIFICATION CARD 2 (Bottom Right Overlapping) ─── */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 z-20 animate-float-reverse max-w-[260px] sm:max-w-[290px] pointer-events-none sm:pointer-events-auto">
              <div className="rounded-xl border border-blue-500/40 bg-slate-900/95 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_25px_rgba(59,130,246,0.15)] backdrop-blur-xl space-y-1.5 transition-all hover:scale-105">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20 text-blue-400">
                      <RCSIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white">Google RCS Verified</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded">
                    Campaign
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  12,450 Verified Rich Cards Broadcasted
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span className="font-semibold text-blue-300 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-blue-400" /> 94.8% Open Rate
                  </span>
                  <span>1m ago</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
