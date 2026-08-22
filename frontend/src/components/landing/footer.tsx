"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  WhatsAppIcon,
  InstagramIcon,
  RCSIcon,
  FacebookIcon,
} from "@/components/landing/channel-icons";

interface FooterProps {
  onOpenDemoModal: () => void;
}

export function Footer({ onOpenDemoModal }: FooterProps) {
  return (
    <footer className="border-t border-border/80 bg-card/60 pb-20 md:pb-12 pt-16 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12">
          {/* Brand & Mission Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-xs bg-white border border-border/60 p-1.5">
                <Image
                  src="/logo-favicon.png"
                  alt="Appnix Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-foreground leading-none">
                  Appnix
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider mt-0.5">
                  Appnix Technologies
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enterprise omnichannel communication platform. Connect WhatsApp, RCS, Instagram, and Facebook with no-code bots and contact CRM.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-foreground">All Systems Operational</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">99.9% Uptime</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://twitter.com/appnixtech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/appnix"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://github.com/AppnixTechnology"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Official Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Channels
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#channels" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  WhatsApp API
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <RCSIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  Google RCS
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <InstagramIcon className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                  Instagram Direct
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <FacebookIcon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  Messenger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Features (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Unified Inbox
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Broadcast Campaigns
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  No-Code Chatbots
                </Link>
              </li>
              <li>
                <Link href="#crm" className="hover:text-foreground transition-colors">
                  Contact CRM
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Visual Workflows
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & Portals (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#white-label" className="hover:text-foreground transition-colors">
                  White-Label Portal
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Book a Demo
                </button>
              </li>
              <li>
                <Link href="/signin" className="hover:text-foreground transition-colors">
                  Client Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground transition-colors">
                  Free 14-Day Trial
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Compliance (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Security
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Meta Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Trust Strip */}
        <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Meta Cloud API Partner
            </span>
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Google RCS Verified
            </span>
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              ISO 27001 Ready
            </span>
          </div>

          <button
            onClick={onOpenDemoModal}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Request Enterprise Security Whitepaper
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Appnix Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed for high-scale enterprise communication
          </p>
        </div>
      </div>
    </footer>
  );
}
