"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";
import { useTranslation } from "@/lib/i18n";

interface HeroProps {
  onOpenDemoModal?: () => void;
}

export function Hero({ onOpenDemoModal }: HeroProps) {
  const { t } = useTranslation();

  const handleScrollDown = () => {
    const nextSection =
      document.getElementById("trust-metrics") ||
      document.getElementById("channels");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center pt-8 pb-4 sm:pt-12 sm:pb-6 lg:pt-14 lg:pb-8 select-none">
      {/* ─── 1. TECHNICAL BACKGROUND: CLEAN GRID & SOFT AMBIENT GLOW ─── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Subtle technical grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] opacity-70" />

        {/* Soft atmospheric radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/3 w-[380px] h-[380px] bg-emerald-500/6 dark:bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      {/* ─── 2. MAIN CENTERED VIEWPORT HERO CONTENT ─── */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl my-auto w-full text-center flex flex-col items-center justify-center z-10">
        {/* Top Channel Support Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 dark:bg-secondary/50 border border-border text-foreground text-xs sm:text-sm font-medium shadow-2xs backdrop-blur-xs mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>Supported: WhatsApp, RCS &amp; Instagram Direct Integrations</span>
        </div>

        {/* Primary Headline (Single H1) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.85rem] font-extrabold tracking-tight text-foreground leading-[1.12] sm:leading-[1.1] max-w-4xl mx-auto text-balance">
          Turn Customer Conversations Into{" "}
          <span className="text-primary font-extrabold">
            Business Opportunities.
          </span>
        </h1>

        {/* Supporting Subheading */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal text-balance">
          Connect supported business communication channels in one platform. Manage WhatsApp, RCS, Instagram and Messenger conversations, organize customer interactions, and build automated workflows.
        </p>

        {/* Main CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          {/* Primary CTA: Book a Demo */}
          <button
            type="button"
            onClick={() => onOpenDemoModal?.()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-primary-foreground bg-primary hover:bg-primary/95 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Book a Demo</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: Get Started */}
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-foreground bg-background hover:bg-accent/60 border border-border shadow-2xs hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Supporting Trust Points (3 Pillars) */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/70 max-w-3xl w-full">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-foreground font-semibold">Independent SaaS Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-foreground font-semibold">Multi-Channel Messaging</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-foreground font-semibold">Tenant-Isolated Workspaces</span>
            </div>
          </div>
        </div>

        {/* Supported Channels Integration Bar (Subtle & Truthful) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-muted-foreground">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mr-1 hidden sm:inline-block">
            Connected Channels:
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-foreground text-xs shadow-2xs">
            <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">WhatsApp Cloud API</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-foreground text-xs shadow-2xs">
            <RCSIcon className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-medium">Google RCS</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-foreground text-xs shadow-2xs">
            <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
            <span className="font-medium">Instagram Direct</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-foreground text-xs shadow-2xs">
            <FacebookIcon className="h-3.5 w-3.5 text-indigo-600" />
            <span className="font-medium">Facebook Messenger</span>
          </div>
        </div>
      </div>

      {/* ─── 3. BOTTOM-CENTER EXPLORE PLATFORM BUTTON ─── */}
      <div className="w-full flex justify-center items-center pt-4 pb-2 z-20">
        <button
          type="button"
          onClick={handleScrollDown}
          className="group inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-4 py-1.5"
          aria-label="Scroll down to explore features and capabilities"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            Explore the Platform
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/80 border border-border group-hover:border-primary/40 shadow-2xs group-hover:shadow-xs group-hover:translate-y-0.5 transition-all">
            <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </button>
      </div>
    </section>
  );
}
