"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  Server,
  Layers,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { LegalPageLayout, TOCItem } from "@/components/legal/LegalPageLayout";

const PRIVACY_TOC: TOCItem[] = [
  { id: "overview", title: "Overview & Identity of Appnix" },
  { id: "saas-scope", title: "SaaS Platform Scope & Business Model" },
  { id: "categories-collected", title: "Categories of Information Collected" },
  { id: "whatsapp-processing", title: "WhatsApp Business & Meta Data Processing" },
  { id: "processing-purposes", title: "Purposes of Data Processing" },
  { id: "ownership-no-sale", title: "Data Ownership & No Sale of Data" },
  { id: "data-sharing", title: "Disclosures & Essential Service Providers" },
  { id: "data-retention", title: "Data Retention & Storage Lifecycle" },
  { id: "security-safeguards", title: "Security Measures & Safeguards" },
  { id: "cookies-sessions", title: "Cookies, Sessions & Storage" },
  { id: "user-rights", title: "Your Rights & Data Choices" },
  { id: "data-deletion-requests", title: "How to Request Data Deletion" },
  { id: "multi-tenant-isolation", title: "Multi-Tenant Data Isolation" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "policy-updates", title: "Updates to this Privacy Policy" },
  { id: "contact-us", title: "Contact Information & Inquiries" },
];

export function PrivacyPolicyView() {
  return (
    <LegalPageLayout
      title="Appnix Technologies Privacy Policy"
      subtitle="Comprehensive notice explaining our data collection, processing, customer ownership, and WhatsApp Business Platform integration practices."
      badge="Data Privacy & Compliance"
      effectiveDate="January 1, 2026"
      lastUpdated="September 1, 2026"
      activePath="/privacy-policy"
      tocItems={PRIVACY_TOC}
    >
      {/* 1. Overview & Identity */}
      <section id="overview" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Overview & Identity of Appnix Technologies
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Welcome to the Privacy Policy of <strong>Appnix Technologies</strong> (&ldquo;Appnix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). This policy transparently explains how we collect, use, process, safeguard, and disclose information when you interact with our website (<a href="https://appnix.co.in" className="text-primary hover:underline font-medium">https://appnix.co.in</a>) and our multi-tenant Software-as-a-Service (&ldquo;SaaS&rdquo;) platform.
        </p>
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs sm:text-sm space-y-2">
          <p className="font-semibold text-foreground">Official Corporate & Contact Information:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Legal Entity:</strong> Appnix Technologies</li>
            <li><strong>Registered Address:</strong> 603–604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, Uttar Pradesh 201305, India</li>
            <li><strong>Official Platform Domain:</strong> <a href="https://appnix.co.in" className="text-primary hover:underline">https://appnix.co.in</a></li>
            <li><strong>Privacy Desk Email:</strong> <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline">privacy@appnix.co.in</a></li>
            <li><strong>Support Email:</strong> <a href="mailto:support@appnix.co.in" className="text-primary hover:underline">support@appnix.co.in</a></li>
            <li><strong>Telephone:</strong> <a href="tel:+917753983175" className="text-primary hover:underline">+91 77539 83175</a></li>
          </ul>
        </div>
      </section>

      {/* 2. SaaS Platform Scope */}
      <section id="saas-scope" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            SaaS Platform Scope & WhatsApp Business Model
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          <strong>Appnix Technologies provides a software platform that helps businesses manage customer communication through WhatsApp. Clients connect their own WhatsApp Business accounts to the platform and use it to communicate with their customers, manage conversations, and organize customer interactions. Platform Data is used only to provide these communication and management features to the respective client.</strong>
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          In operating the platform:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 pt-1">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5 shadow-2xs">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              Client as Data Controller
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our business client acts as the data controller regarding the end-customer phone numbers, names, and communication content they upload or route through the platform.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5 shadow-2xs">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              Appnix as Data Processor
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Appnix Technologies acts strictly as a data processor / technology intermediary, executing message routing, campaign broadcasts, and workflow automations solely on instructions from the client.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Categories Collected */}
      <section id="categories-collected" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Categories of Information We Collect and Process
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We collect and process only the categories of information necessary to deliver, secure, and administer our B2B SaaS platform:
        </p>
        
        <div className="space-y-3 pt-1">
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              1. Account & Registration Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a client business registers for an Appnix workspace, we collect the account owner&apos;s name, business email address, company name, workspace slug, contact phone number, and cryptographically hashed passwords. If Google OAuth is chosen for sign-in, we collect the authenticated email, name, avatar, and Google account identifier.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              2. Channel Credentials & Authentication Tokens
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When clients link their WhatsApp Business Account (WABA), Meta Business Suite, Instagram Professional, RCS, or third-party webhooks (e.g., Shopify, CRM endpoints), we store configuration parameters, Phone Number IDs, WhatsApp Business Account IDs (WABA ID), and encrypted OAuth/API access tokens required to communicate with upstream APIs.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              3. Client CRM Contacts & Customer Data
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data uploaded, imported via CSV, or received from messaging channels by the client, including customer contact names, phone numbers, email addresses, custom CRM tags, custom field attributes (Super Fields), and audience segment lists.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              4. Communication Metadata & Message Logs
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Message transmission timestamps, template names, delivery statuses (e.g., sent, delivered, read, failed), error codes returned by upstream telecom/Meta providers, and interactive chatbot workflow responses processed on behalf of the client.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              5. Technical, Log & Security Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              IP addresses, browser type, operating system, sign-in timestamps, API request logs, and error diagnostic traces collected automatically to ensure system stability, prevent unauthorized access, and troubleshoot operational incidents.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WhatsApp Business Platform Section */}
      <section id="whatsapp-processing" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-600">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            WhatsApp Business Platform & Meta-Related Data Processing
          </h2>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Dedicated WhatsApp Business Platform Data Clause</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Appnix Technologies integrates with the official <strong>Meta Cloud API / WhatsApp Business Platform</strong>. When you connect your WhatsApp Business Account to the Appnix SaaS platform, our software facilitates the transmission of messages and webhook events between your Meta WABA and our platform dashboard.
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Purpose-Limited Processing:</strong> Meta and WhatsApp data (including message text, recipient phone numbers, media attachments, template IDs, and webhook notifications) are processed exclusively to provide the communication, inbox, chatbot, and campaign features requested by the respective client.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Data Ownership:</strong> Appnix Technologies does not claim ownership of any client WhatsApp message content, recipient contact records, or Meta account assets.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Sale of WhatsApp Data:</strong> Appnix Technologies strictly does not sell, license, rent, monetize, or disclose WhatsApp or Meta-related user data to any third-party advertisers, data brokers, or commercial marketers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Advertising Profiling:</strong> We do not build advertising profiles or conduct cross-platform surveillance based on your WhatsApp communication metadata or client contacts.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Purposes of Data Processing */}
      <section id="processing-purposes" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Purposes of Data Processing
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We process data strictly on lawful grounds (performance of a contract, legitimate business interest in platform security, and compliance with statutory obligations) for the following purposes:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Service Delivery & Automation</p>
            <p>Provisioning workspace accounts, routing outbound and inbound messages, executing automated chatbot flows, and synchronizing approved message templates.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">CRM & Contact Organization</p>
            <p>Enabling clients to organize contact records, manage tag attributes, segment subscriber audiences, and view customer conversation histories.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Security, Fraud & Abuse Prevention</p>
            <p>Monitoring for unauthorized login attempts, safeguarding API credentials, preventing message spamming or rate-limit abuse, and maintaining audit logs.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Billing & Transaction Management</p>
            <p>Processing subscription renewals, workspace balance top-ups, invoicing, and generating transaction statements for tax accounting.</p>
          </div>
        </div>
      </section>

      {/* 6. Data Ownership & No Sale */}
      <section id="ownership-no-sale" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Data Ownership, Customer Control & Strict Prohibition on Selling Data
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At Appnix Technologies, our business model is straightforward: we offer subscription software to businesses. <strong>We are not an advertising company and we do not monetize personal data.</strong>
        </p>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs sm:text-sm">
          <p className="font-bold text-foreground">Explicit Guarantees:</p>
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
            <li><strong>You Own Your Data:</strong> All CRM contacts, message copy, and subscriber information imported into your tenant workspace remain your exclusive property.</li>
            <li><strong>No Sale to Third Parties:</strong> We do not sell, rent, trade, or distribute your customer lists, phone numbers, or conversation content to any third parties under any circumstances.</li>
            <li><strong>No Ad Targeting:</strong> Your customer data is never used to train generalized advertising models or served to ad networks.</li>
          </ul>
        </div>
      </section>

      {/* 7. Disclosures & Service Providers */}
      <section id="data-sharing" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Disclosures & Essential Service Providers
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We disclose information only to vetted, essential sub-processors and third-party infrastructure providers strictly required to operate the SaaS platform:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Meta Platforms, Inc. (WhatsApp Cloud API)</p>
              <p className="text-muted-foreground">Upstream communications infrastructure for WhatsApp template submission, message delivery, and webhook events.</p>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
              Direct Channel API
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Cloud Database & Server Hosting</p>
              <p className="text-muted-foreground">PostgreSQL managed database storage and compute infrastructure for hosting application logic and isolated tenant databases.</p>
            </div>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full shrink-0">
              Secure Infrastructure
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Brevo (Sendinblue) Transactional Email Service</p>
              <p className="text-muted-foreground">Delivery of transactional authentication codes (OTPs), password reset verification, and critical system notifications.</p>
            </div>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full shrink-0">
              Email Dispatch
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Legal & Regulatory Compliance</p>
              <p className="text-muted-foreground">We may disclose information if required by applicable Indian law, valid court order, or enforceable government request.</p>
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
              Statutory Requirement
            </span>
          </div>
        </div>
      </section>

      {/* 8. Data Retention */}
      <section id="data-retention" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Data Retention & Storage Lifecycle
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We retain client data only for as long as necessary to fulfill the operational purposes described in this Privacy Policy:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li><strong>Active Subscription Period:</strong> Account data, CRM contacts, and workflow automations remain active and available throughout your subscription.</li>
          <li><strong>Workflow Data Stores & Transient Records:</strong> Temporary key-value cache records are governed by configurable Time-To-Live (TTL) parameters and are automatically purged upon expiry.</li>
          <li><strong>Workspace Deletion:</strong> Upon account cancellation and completed data deletion request, workspace records, CRM contacts, and channel credentials are permanently removed within 30 calendar days.</li>
          <li><strong>Financial & Invoicing Records:</strong> Tax invoices, billing logs, and transaction receipts are retained for the statutory period mandated by Indian tax legislation.</li>
        </ul>
      </section>

      {/* 9. Security Safeguards */}
      <section id="security-safeguards" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Security Safeguards & Technical Measures
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Appnix Technologies implements standard, industry-accepted security practices to protect data against unauthorized access, loss, or alteration:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Encryption in Transit & at Rest
            </p>
            <p>All communication between your browser, our API endpoints, and Meta Cloud API is encrypted using Transport Layer Security (TLS 1.2 / TLS 1.3 HTTPS). Sensitive credentials and API tokens are encrypted in our database.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-primary" />
              Cryptographic Password Hashing
            </p>
            <p>User passwords are never stored in plaintext; they are hashed using salted cryptographic algorithms (bcrypt/Argon2).</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Role-Based Access Control (RBAC)
            </p>
            <p>Strict access controls prevent unauthorized access across team members and maintain separation between Super Admin, Tenant Admin, and standard Members.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Parameterized Database Queries
            </p>
            <p>Database interactions are conducted via Prisma ORM with parameterized queries to prevent SQL injection vulnerabilities.</p>
          </div>
        </div>
      </section>

      {/* 10. Cookies & Sessions */}
      <section id="cookies-sessions" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            10
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Cookies, Sessions & Authentication Storage
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use strictly functional and essential browser storage mechanisms necessary to authenticate users and remember workspace settings:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li><strong>Authentication Tokens (JWT):</strong> Stored securely to maintain authenticated user sessions across dashboard navigations.</li>
          <li><strong>UI State & Preferences:</strong> Browser local storage stores UI theme preferences (light/dark mode) and selected language locales.</li>
          <li><strong>No Third-Party Advertising Cookies:</strong> We do not deploy third-party advertising cookies or cross-site tracking pixels on our SaaS application dashboard.</li>
        </ul>
      </section>

      {/* 11. User Rights */}
      <section id="user-rights" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            11
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Your Rights & Data Choices
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Depending on your jurisdiction and applicable data protection regulations, you have the following rights regarding your data processed by Appnix Technologies:
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right of Access:</strong> You can request a summary of the personal information stored in your account.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right of Rectification:</strong> You can update or correct your personal profile and business details anytime via the Dashboard.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right to Data Portability:</strong> You can export your CRM contact lists, templates, and campaign reports in CSV/JSON format.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right to Erasure / Deletion:</strong> You can request the permanent deletion of your workspace, contacts, and connected channels.
          </div>
        </div>
      </section>

      {/* 12. Data Deletion Requests */}
      <section id="data-deletion-requests" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            12
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            How to Request Data Deletion
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We provide clear, accessible mechanisms for clients and authorized individuals to request the complete deletion of their information from our systems:
        </p>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            For detailed, step-by-step instructions, self-service channel removal steps, and Meta callback details, please review our dedicated Data Deletion page:
          </p>
          <Link
            href="/data-deletion"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <span>View Data Deletion Instructions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 13. Multi-Tenant Architecture */}
      <section id="multi-tenant-isolation" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            13
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Multi-Tenant Architecture & Data Isolation
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Appnix Technologies is architected as an isolated multi-tenant SaaS. Every database query enforces strict <code>tenantId</code> constraints. Data belonging to Client A is logically partitioned and completely inaccessible to Client B. No cross-tenant data leakage is permitted at any application tier.
        </p>
      </section>

      {/* 14. Children's Privacy */}
      <section id="children-privacy" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            14
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Children&apos;s Privacy
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our SaaS platform is exclusively designed for businesses and professional commercial communication. We do not knowingly collect, market to, or solicit personal data from children under the age of 18. If you believe a minor has provided us with personal information, please notify us at <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline">privacy@appnix.co.in</a> to effect immediate deletion.
        </p>
      </section>

      {/* 15. Policy Updates */}
      <section id="policy-updates" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            15
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Updates to this Privacy Policy
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time to reflect modifications in our software, Meta API updates, or applicable regulatory requirements. When significant revisions occur, we will update the &ldquo;Last Updated&rdquo; date at the top of this page and, where appropriate, notify active tenant administrators via email or in-app dashboard alert.
        </p>
      </section>

      {/* 16. Contact Information */}
      <section id="contact-us" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            16
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Contact Information & Privacy Inquiries
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions, feedback, or concerns regarding this Privacy Policy or our WhatsApp Business Platform data handling practices, please contact our team:
        </p>
        <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Appnix Technologies</p>
              <p className="text-muted-foreground">603–604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, Uttar Pradesh 201305, India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="text-muted-foreground">Privacy Desk: </span>
              <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline font-medium">privacy@appnix.co.in</a>
              <span className="text-muted-foreground"> | Support: </span>
              <a href="mailto:support@appnix.co.in" className="text-primary hover:underline font-medium">support@appnix.co.in</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="text-muted-foreground">Telephone: </span>
              <a href="tel:+917753983175" className="text-primary hover:underline font-medium">+91 77539 83175</a>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
