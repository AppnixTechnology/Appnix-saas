"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Server,
  Layers
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
  { id: "multi-tenant-isolation", title: "Multi-Tenant Architecture & Data Separation" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "policy-updates", title: "Updates to this Privacy Policy" },
  { id: "contact-us", title: "Contact Information & Inquiries" },
];

export function PrivacyPolicyView() {
  return (
    <LegalPageLayout
      title="Appnix Technologies Privacy Policy"
      subtitle="Notice explaining our data collection, processing, customer ownership, and WhatsApp Business Platform integration practices."
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
            Overview &amp; Identity of Appnix Technologies
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Welcome to the Privacy Policy of <strong>Appnix Technologies</strong> (&ldquo;Appnix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). This policy explains how we collect, use, process, safeguard, and disclose information when you interact with our website (<a href="https://www.appnix.co.in" className="text-primary hover:underline font-medium">https://www.appnix.co.in</a>) and our multi-tenant Software-as-a-Service (&ldquo;SaaS&rdquo;) platform.
        </p>
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs sm:text-sm space-y-2">
          <p className="font-semibold text-foreground">Corporate &amp; Contact Information:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Legal Entity:</strong> Appnix Technologies</li>
            <li><strong>Registered Address:</strong> 603–604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, Uttar Pradesh 201305, India</li>
            <li><strong>Platform Website:</strong> <a href="https://www.appnix.co.in" className="text-primary hover:underline">https://www.appnix.co.in</a></li>
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
            SaaS Platform Scope &amp; WhatsApp Business Model
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          <strong>Appnix Technologies provides a software platform that helps businesses manage customer communication through WhatsApp. Clients connect their own WhatsApp Business accounts to the platform and use it to communicate with their customers, manage conversations, and organize customer interactions. Platform Data is used only to provide these communication and management features to the respective client.</strong>
        </p>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-2xs">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            Roles and Responsibilities
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Depending on the service and applicable law, Appnix may process customer information on behalf of its business clients to provide the platform. Business clients act as the controller for customer communication and contact information they manage through their account.
          </p>
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
          We collect and process the following categories of information to provide, secure, and administer our SaaS platform:
        </p>
        
        <div className="space-y-3 pt-1">
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              1. Account &amp; Registration Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a client business registers for an Appnix workspace, we collect the account owner&apos;s name, business email address, company name, workspace identifier, phone number, and cryptographically hashed passwords. If Google sign-in is used, we collect the authenticated email, name, avatar, and Google account identifier.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              2. Channel Credentials &amp; Authentication Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When clients link their WhatsApp Business Account, Instagram, RCS, or webhook endpoints, we store configuration parameters, Phone Number IDs, WhatsApp Business Account IDs (WABA ID), and API access tokens required to communicate with upstream messaging APIs.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              3. CRM Contacts &amp; Customer Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data uploaded, imported, or received from messaging channels by the client, including customer contact phone numbers, names, email addresses, custom CRM tags, custom field attributes, and audience segments.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              4. Messaging &amp; Channel Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Message transmission timestamps, template names, delivery statuses (such as sent, delivered, read, failed), error codes returned by upstream providers, and workflow responses processed on behalf of the client.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              5. Technical, Log &amp; Authentication Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              IP addresses, browser type, operating system, sign-in timestamps, API request logs, and error diagnostic traces collected to ensure system stability, prevent unauthorized access, and troubleshoot technical issues.
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
            WhatsApp Business Platform &amp; Meta-Related Data Processing
          </h2>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>WhatsApp Business Platform Data Clause</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Appnix Technologies integrates with the WhatsApp Business Platform / Meta APIs. When you connect your WhatsApp Business Account to the Appnix platform, our software facilitates the transmission of messages and webhook events between your Meta account and our platform workspace.
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Purpose-Limited Processing:</strong> Meta and WhatsApp data (including message text, recipient phone numbers, media attachments, template IDs, and webhook notifications) are processed to provide the communication, inbox, workflow, and campaign features requested by the respective client.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Data Ownership:</strong> Appnix does not claim ownership of customer content or Meta account assets.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Sale of WhatsApp Data:</strong> Appnix does not sell customer contact lists or WhatsApp/Meta-related customer content for advertising or data-broker purposes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Advertising Profiling:</strong> We do not build advertising profiles or conduct cross-platform tracking based on client messaging metadata or contact lists.</span>
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
          We process data for the following operational purposes:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Service Delivery &amp; Messaging</p>
            <p>Provisioning workspace accounts, routing outbound and inbound messages, executing automated workflows, and synchronizing message templates.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">CRM &amp; Contact Organization</p>
            <p>Enabling clients to organize contact records, manage tag attributes, segment subscriber audiences, and view customer conversation histories.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Security &amp; Abuse Prevention</p>
            <p>Monitoring for unauthorized login attempts, safeguarding API credentials, preventing message spamming or rate-limit abuse, and maintaining audit logs.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Account Administration</p>
            <p>Managing account settings, user permissions, invoices, and transaction records where applicable.</p>
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
            Data Ownership &amp; No Sale of Data
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At Appnix Technologies, our business model is focused on providing business software. <strong>We do not sell personal data.</strong>
        </p>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs sm:text-sm">
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
            <li><strong>Customer Content Ownership:</strong> Customers retain ownership of Customer Content to the extent they own it.</li>
            <li><strong>No Sale of Data:</strong> Appnix does not sell customer contact lists or WhatsApp/Meta-related customer content for advertising or data-broker purposes.</li>
            <li><strong>No Advertising Targeting:</strong> Customer data is not used to train generalized advertising models or served to ad networks.</li>
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
            Disclosures &amp; Essential Service Providers
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We disclose information to essential service providers required to operate the platform:
        </p>
        <div className="space-y-2.5 text-xs">
          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Meta Platforms, Inc. (WhatsApp Cloud API)</p>
              <p className="text-muted-foreground">Upstream communications infrastructure for WhatsApp template submission, message delivery, and webhook events.</p>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
              Messaging Platform
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Cloud Database &amp; Application Hosting</p>
              <p className="text-muted-foreground">PostgreSQL managed database storage and application infrastructure for hosting platform services.</p>
            </div>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full shrink-0">
              Infrastructure
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Brevo (Sendinblue) Transactional Email Service</p>
              <p className="text-muted-foreground">Delivery of transactional authentication codes (OTPs), password reset verification, and system notifications.</p>
            </div>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full shrink-0">
              Email Delivery
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Legal &amp; Regulatory Compliance</p>
              <p className="text-muted-foreground">We may disclose information if required by applicable law, valid court order, or enforceable governmental request.</p>
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
              Legal Requirement
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
            Data Retention &amp; Storage Lifecycle
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Data is retained only for as long as reasonably necessary to provide the service, meet contractual requirements, address security needs, and comply with applicable legal obligations.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Deletion requests are processed within a reasonable period based on the request, applicable obligations, and the systems involved. Financial and invoicing records are retained as required by applicable tax laws.
        </p>
      </section>

      {/* 9. Security Safeguards */}
      <section id="security-safeguards" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Security Measures &amp; Technical Safeguards
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Appnix Technologies implements standard security practices to protect data against unauthorized access, loss, or alteration:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              HTTPS Data Transmission
            </p>
            <p>Data transmission between browsers, our API endpoints, and external messaging APIs is conducted over HTTPS.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-primary" />
              Password Hashing
            </p>
            <p>User account passwords are stored using salted cryptographic hashing (bcrypt) and are never stored in plaintext.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Role-Based Access Control (RBAC)
            </p>
            <p>Access controls manage permissions across team members within an organization workspace.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Parameterized Database Access
            </p>
            <p>Database queries are executed via Prisma ORM using parameterized statements to safeguard against SQL injection.</p>
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
            Cookies, Sessions &amp; Authentication Storage
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use browser storage mechanisms necessary to authenticate users and remember workspace settings:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li><strong>Authentication Tokens (JWT):</strong> Stored in browser localStorage to maintain authenticated user sessions across dashboard navigations.</li>
          <li><strong>UI State &amp; Preferences:</strong> Browser localStorage stores UI theme preferences (light/dark mode) and language selections.</li>
          <li><strong>No Advertising Cookies:</strong> We do not deploy third-party advertising cookies or cross-site tracking pixels on our SaaS application dashboard.</li>
        </ul>
      </section>

      {/* 11. User Rights */}
      <section id="user-rights" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            11
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Your Rights &amp; Data Choices
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Depending on your jurisdiction and applicable data protection regulations, you have rights regarding your personal information:
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right of Access:</strong> You can request information about the personal data processed in your account.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right of Rectification:</strong> You can update or correct your profile details via the Dashboard.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right to Data Portability:</strong> You can export CRM contact lists and campaign reports in CSV or JSON format.
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <strong className="text-foreground">Right to Erasure:</strong> You can request the deletion of your account and associated data.
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
          We provide clear mechanisms for clients and authorized individuals to request the deletion of their information:
        </p>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            For step-by-step instructions on requesting data deletion or disconnecting connected accounts, please review our dedicated Data Deletion page:
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
            Multi-Tenant Architecture &amp; Data Separation
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The platform uses tenant-aware access controls and data partitioning to help keep each organization&apos;s data separated.
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
          Our SaaS platform is designed for businesses and commercial communication. We do not knowingly collect personal data from children under the age of 18. If you believe a minor has provided us with personal information, please notify us at <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline">privacy@appnix.co.in</a>.
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
          We may update this Privacy Policy from time to time to reflect modifications in our services, API updates, or regulatory requirements. When revisions occur, we will update the &ldquo;Last Updated&rdquo; date at the top of this page.
        </p>
      </section>

      {/* 16. Contact Information */}
      <section id="contact-us" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            16
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Contact Information &amp; Privacy Inquiries
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions regarding this Privacy Policy or our data handling practices, please contact our team:
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
