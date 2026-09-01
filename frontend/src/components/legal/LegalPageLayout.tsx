"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Printer, 
  ChevronRight, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ArrowUpRight,
  Menu,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { LeadFormModal } from "@/components/landing/lead-form-modal";
import { ScrollToTop } from "@/components/landing/scroll-to-top";
import { cn } from "@/lib/utils";

export interface TOCItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  effectiveDate: string;
  lastUpdated: string;
  activePath: "/privacy-policy" | "/terms-and-conditions" | "/data-deletion";
  tocItems: TOCItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  badge,
  effectiveDate,
  lastUpdated,
  activePath,
  tocItems,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(tocItems[0]?.id || "");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoInterest, setDemoInterest] = useState("Enterprise Security & Compliance");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(tocItems[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(tocItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenDemo = (interest = "Enterprise Compliance") => {
    setDemoInterest(interest);
    setDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* 1. Main Navigation */}
      <Navbar onOpenDemoModal={() => handleOpenDemo("Compliance & Security Inquiries")} />

      {/* 2. Legal Header Hero */}
      <header className="relative border-b border-border/80 bg-gradient-to-b from-muted/50 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground/80">Legal</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Effective Date: <strong>{effectiveDate}</strong></span>
                </span>
                <span>•</span>
                <span>Last Updated: <strong>{lastUpdated}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Official SaaS Platform Notice
                </span>
              </div>
            </div>

            {/* Quick Actions & Legal Tabs */}
            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs cursor-pointer"
                title="Print this document"
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                Print / Save PDF
              </button>

              {/* Legal Cross-links */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs">
                <Link
                  href="/privacy-policy"
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    activePath === "/privacy-policy"
                      ? "bg-background text-primary shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Privacy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    activePath === "/terms-and-conditions"
                      ? "bg-background text-primary shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Terms
                </Link>
                <Link
                  href="/data-deletion"
                  className={cn(
                    "px-2.5 py-1 rounded-md font-medium transition-colors",
                    activePath === "/data-deletion"
                      ? "bg-background text-primary shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Data Deletion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Content Grid (Sidebar TOC + Legal Document Body) */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Mobile TOC Toggle Bar */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-card p-3.5 text-xs font-semibold text-foreground shadow-2xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Menu className="h-4 w-4 text-primary" />
              Table of Contents ({tocItems.length} sections)
            </span>
            <span className="text-primary text-[11px]">
              {mobileTocOpen ? "Hide" : "Show Outline"}
            </span>
          </button>

          {mobileTocOpen && (
            <div className="mt-2 rounded-xl border border-border bg-popover p-3 shadow-lg max-h-80 overflow-y-auto space-y-1 animate-in fade-in-0 slide-in-from-top-2">
              {tocItems.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className={cn(
                    "block px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="text-muted-foreground/60 mr-1.5">{index + 1}.</span>
                  {item.title}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Left Sidebar for Desktop */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents Box */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Table of Contents
                </h3>
                <nav className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 text-xs">
                  {tocItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block py-1.5 px-2.5 rounded-lg transition-all text-[12px] leading-snug",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs translate-x-1"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <span className={cn("mr-1.5 font-mono text-[11px]", isActive ? "text-primary-foreground/80" : "text-muted-foreground/50")}>
                          {index + 1}.
                        </span>
                        {item.title}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Legal Hub Box */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-3 text-xs">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Appnix Legal Hub
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href="/privacy-policy"
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-colors",
                      activePath === "/privacy-policy"
                        ? "bg-card border border-border text-primary font-semibold shadow-2xs"
                        : "hover:bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Privacy Policy</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-colors",
                      activePath === "/terms-and-conditions"
                        ? "bg-card border border-border text-primary font-semibold shadow-2xs"
                        : "hover:bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Terms & Conditions</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </Link>
                  <Link
                    href="/data-deletion"
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-colors",
                      activePath === "/data-deletion"
                        ? "bg-card border border-border text-primary font-semibold shadow-2xs"
                        : "hover:bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Data Deletion Instructions</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </Link>
                </div>
              </div>

              {/* Official Contact Box */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2.5 text-xs">
                <h4 className="font-bold text-foreground">Need Legal Clarification?</h4>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Our privacy, compliance, and developer support desk is available to assist you.
                </p>
                <div className="space-y-1.5 pt-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-primary shrink-0" />
                    <a href="mailto:privacy@appnix.co.in" className="hover:text-foreground hover:underline">
                      privacy@appnix.co.in
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-primary shrink-0" />
                    <a href="tel:+917753983175" className="hover:text-foreground hover:underline">
                      +91 77539 83175
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">Bhutani Alphathum, Sector 90, Noida, UP 201305, IN</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Legal Document Article */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            <article className="prose dark:prose-invert max-w-none space-y-10 text-foreground">
              {children}
            </article>

            {/* Bottom Contact & Sign-off Card */}
            <div className="mt-14 rounded-2xl border border-border/80 bg-gradient-to-r from-muted/60 via-card to-muted/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Appnix Technologies Legal & Compliance
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Have questions regarding our compliance practices?
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We maintain strict data isolation, verified Meta Cloud API connectivity, and client-controlled data handling. Reach out anytime with compliance, review, or data requests.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <a
                    href="mailto:support@appnix.co.in"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Support Desk
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenDemo("Legal & Security Compliance")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Request Security Brief
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 4. Scroll To Top Button */}
      <ScrollToTop />

      {/* 5. Reusable Lead & Demo Booking Modal */}
      <LeadFormModal
        isOpen={demoModalOpen}
        onOpenChange={setDemoModalOpen}
        defaultInterest={demoInterest}
        source="Legal Page Contact"
      />

      {/* 6. Footer */}
      <Footer onOpenDemoModal={() => handleOpenDemo("General Inquiries")} />
    </div>
  );
}
