"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";

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
  const { t } = useTranslation();

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
              {t.footer.tagline}
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-foreground">Multi-Channel SaaS Platform</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Cloud Infrastructure</span>
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
              {t.footer.solutionsCol}
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
              {t.footer.productCol}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  {t.nav.unifiedInbox}
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  {t.nav.campaignManager}
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  {t.nav.botBuilder}
                </Link>
              </li>
              <li>
                <Link href="#crm" className="hover:text-foreground transition-colors">
                  {t.nav.crmContact}
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  {t.nav.automationBuilder}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & Portals (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t.footer.resourcesCol}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#white-label" className="hover:text-foreground transition-colors">
                  {t.nav.whiteLabel}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  {t.nav.bookDemo}
                </button>
              </li>
              <li>
                <Link href="/signin" className="hover:text-foreground transition-colors">
                  {t.nav.signIn}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground transition-colors">
                  {t.nav.startFreeTrial}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t.footer.legalCol || "Legal"}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                  {t.footer.privacyPolicy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">
                  {t.footer.termsAndConditions || t.footer.termsOfService || "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-foreground transition-colors">
                  {t.footer.dataDeletion || "Data Deletion"}
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  {t.nav.faq}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Neutral Capability Section */}
        <div className="rounded-xl border border-border/70 bg-background/60 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <span className="font-bold text-foreground text-xs block">
              Built for modern business communication
            </span>
            <span className="text-muted-foreground text-[11px] block">
              Securely designed • Business-focused • Multi-channel communication
            </span>
          </div>

          <button
            onClick={onOpenDemoModal}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer self-start md:self-auto"
          >
            Explore Platform Solutions
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Mandatory Platform & Trademark Disclaimer */}
        <div className="mb-6 p-3 rounded-lg border border-border/50 bg-muted/20 text-[11px] text-muted-foreground leading-relaxed">
          <p>
            WhatsApp, Facebook, Instagram and Meta are trademarks of Meta Platforms, Inc. Google and RCS are trademarks of Google LLC. Appnix Technologies is an independent software platform and is not affiliated with or endorsed by these companies unless explicitly stated.
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed for high-scale enterprise communication
          </p>
        </div>
      </div>
    </footer>
  );
}
