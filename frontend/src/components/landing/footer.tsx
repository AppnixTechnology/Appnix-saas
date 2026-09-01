"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    <footer className="border-t border-border/80 bg-card/60 pb-16 md:pb-10 pt-12 sm:pt-14 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-12 pb-8 sm:pb-10">
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

            {/* Operational Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-foreground">Multi-Channel SaaS Platform</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.instagram.com/appnixtechnologies/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/appnix-technologies/"
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
                href="https://www.facebook.com/profile.php?id=61587716594443"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Solutions (2 cols) */}
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
                <Link href="#white-label" className="hover:text-foreground transition-colors">
                  {t.nav.whiteLabel}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources (2 cols) */}
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
          <div className="space-y-0.5">
            <span className="font-bold text-foreground text-xs block">
              Multi-Channel Communication Platform
            </span>
            <span className="text-muted-foreground text-[11px] block">
              Business-focused • Multi-channel communication
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
        <div className="mb-6 p-3.5 rounded-lg border border-border/50 bg-muted/20 text-[11px] text-muted-foreground leading-relaxed">
          <p>
            WhatsApp, Facebook, Instagram and Meta are trademarks of Meta Platforms, Inc. Google and RCS are trademarks of Google LLC. Appnix Technologies is an independent software platform and is not affiliated with or endorsed by these companies unless explicitly stated.
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed for reliable business communication
          </p>
        </div>
      </div>
    </footer>
  );
}
