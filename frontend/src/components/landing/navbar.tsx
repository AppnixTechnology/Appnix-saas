"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  PhoneCall,
  ChevronDown,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  Smartphone,
  Layers,
  ShieldCheck,
  Star,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenDemoModal: () => void;
}

type ActiveDropdown = "features" | "channels" | "crm-bots" | null;

const featureItems = [
  {
    name: "Unified Inbox",
    description: "Manage WhatsApp, Instagram, RCS & Facebook in one place",
    href: "#features",
    icon: MessageSquare,
  },
  {
    name: "Campaign & Broadcast Manager",
    description: "Multi-channel broadcast scheduler & delivery tracking",
    href: "#features",
    icon: Send,
  },
  {
    name: "Automation Builder",
    description: "Event-driven workflows with triggers, delays & conditions",
    href: "#features",
    icon: Zap,
  },
  {
    name: "Analytics Dashboard",
    description: "Real-time metrics on deliverability, reply speed & CSAT",
    href: "#features",
    icon: BarChart3,
  },
  {
    name: "How It Works",
    description: "Simple 3-step setup from first message to loyal customer",
    href: "#how-it-works",
    icon: Layers,
  },
  {
    name: "White-Label Solution",
    description: "Rebrand with your custom domain, logo & multi-tenancy",
    href: "#white-label",
    icon: ShieldCheck,
  },
  {
    name: "Customer Testimonials",
    description: "Real results and reviews from high-growth businesses",
    href: "#testimonials",
    icon: Star,
  },
  {
    name: "FAQ & Help",
    description: "Answers to common channel, API, and platform questions",
    href: "#faq",
    icon: HelpCircle,
  },
];

import { WhatsAppIcon, InstagramIcon, RCSIcon, FacebookIcon } from "@/components/landing/channel-icons";

const channelItems = [
  {
    name: "WhatsApp Business API",
    description: "Official Meta Cloud API with green badge & templates",
    href: "#channels",
    icon: WhatsAppIcon,
    badge: "Official API",
  },
  {
    name: "RCS Business Messaging",
    description: "Rich cards, action chips & Google verified senders",
    href: "#channels",
    icon: RCSIcon,
    badge: "Google Verified",
  },
  {
    name: "Instagram Direct",
    description: "Automate DMs, story mentions & comment responses",
    href: "#channels",
    icon: InstagramIcon,
    badge: "Meta Direct",
  },
  {
    name: "Facebook Messenger",
    description: "Connect Facebook Pages and Click-to-Messenger ads",
    href: "#channels",
    icon: FacebookIcon,
    badge: "Meta API",
  },
];

const crmBotItems = [
  {
    name: "CRM & Contact Management",
    description: "Turn conversations into customers with 360° lead tracking",
    href: "#crm",
    icon: Users,
  },
  {
    name: "No-Code Bot Builder",
    description: "24/7 intelligent automated triage and instant qualification",
    href: "#features",
    icon: Bot,
  },
];

export function Navbar({ onOpenDemoModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [mobileAccordion, setMobileAccordion] = useState<{ [key: string]: boolean }>({
    features: false,
    channels: false,
    crmBots: false,
  });

  const navRef = useRef<HTMLElement>(null);

  // Scroll detection for sticky header background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close any open dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility: Escape closes dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDropdown = (name: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileAccordion = (section: string) => {
    setMobileAccordion((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <header
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs py-3"
          : "bg-background/90 backdrop-blur-xs border-b border-transparent py-3.5 sm:py-4"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 group transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg shrink-0"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-xs transition-transform group-hover:scale-105 bg-white border border-border/40 p-1">
            <Image
              src="/logo-favicon.png"
              alt="Appnix Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground leading-none">
              Appnix
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">
              Appnix Technologies
            </span>
          </div>
        </Link>

        {/* Center: EXACT 4 Top-Level Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* 1. Features ▾ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("features")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeDropdown === "features"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              aria-expanded={activeDropdown === "features"}
              aria-haspopup="true"
            >
              <span>Features</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  activeDropdown === "features" ? "rotate-180 text-foreground" : "text-muted-foreground"
                )}
              />
            </button>

            {/* Features Dropdown Menu */}
            {activeDropdown === "features" && (
              <div className="absolute left-0 top-full mt-2 w-[420px] rounded-2xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 slide-in-from-top-2 duration-150 z-50">
                <div className="grid grid-cols-1 gap-1">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Channels ▾ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("channels")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeDropdown === "channels"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              aria-expanded={activeDropdown === "channels"}
              aria-haspopup="true"
            >
              <span>Channels</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  activeDropdown === "channels" ? "rotate-180 text-foreground" : "text-muted-foreground"
                )}
              />
            </button>

            {/* Channels Dropdown Menu */}
            {activeDropdown === "channels" && (
              <div className="absolute left-0 top-full mt-2 w-84 rounded-2xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 slide-in-from-top-2 duration-150 z-50">
                <div className="space-y-1">
                  {channelItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. CRM & Bots ▾ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("crm-bots")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeDropdown === "crm-bots"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              aria-expanded={activeDropdown === "crm-bots"}
              aria-haspopup="true"
            >
              <span>CRM & Bots</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  activeDropdown === "crm-bots" ? "rotate-180 text-foreground" : "text-muted-foreground"
                )}
              />
            </button>

            {/* CRM & Bots Dropdown Menu */}
            {activeDropdown === "crm-bots" && (
              <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 slide-in-from-top-2 duration-150 z-50">
                <div className="space-y-1">
                  {crmBotItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Pricing (Direct Link) */}
          <Link
            href="#pricing"
            onClick={handleLinkClick}
            className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 rounded-lg"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: EXACT 3 CTA / Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Action 1: Book a Demo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDemoModal}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 h-9"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            Book a Demo
          </Button>

          {/* Action 2: Sign In */}
          <Link
            href="/signin"
            className="hidden sm:inline-block text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-2 py-1"
          >
            Sign In
          </Link>

          {/* Action 3: Start Free Trial */}
          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-xs sm:text-sm font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/signup" className="flex items-center gap-1.5">
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Clean Accordions) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/80 bg-background/98 backdrop-blur-lg px-4 pt-3 pb-6 sm:px-6 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-1 pb-4">
            {/* Features Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileAccordion("features")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <span>Features</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    mobileAccordion.features ? "rotate-180 text-foreground" : ""
                  )}
                />
              </button>

              {mobileAccordion.features && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-primary/30 ml-3 mt-1">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Channels Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileAccordion("channels")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <span>Channels</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    mobileAccordion.channels ? "rotate-180 text-foreground" : ""
                  )}
                />
              </button>

              {mobileAccordion.channels && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-emerald-500/30 ml-3 mt-1">
                  {channelItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CRM & Bots Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileAccordion("crmBots")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <span>CRM & Bots</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    mobileAccordion.crmBots ? "rotate-180 text-foreground" : ""
                  )}
                />
              </button>

              {mobileAccordion.crmBots && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-primary/30 ml-3 mt-1">
                  {crmBotItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing (Direct Link) */}
            <Link
              href="#pricing"
              onClick={handleLinkClick}
              className="px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Mobile Bottom Action Section */}
          <div className="border-t border-border/60 pt-4 flex flex-col gap-2.5">
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full justify-center text-sm font-semibold h-10"
            >
              <PhoneCall className="mr-2 h-4 w-4 text-primary" />
              Book a Live Demo
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="ghost" className="w-full text-sm font-medium h-10">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full text-sm font-semibold bg-primary text-primary-foreground h-10">
                <Link href="/signup">Start Free Trial →</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
