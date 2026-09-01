"use client";

import Link from "next/link";
import { 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  FileCheck,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { LegalPageLayout, TOCItem } from "@/components/legal/LegalPageLayout";

const DATA_DELETION_TOC: TOCItem[] = [
  { id: "overview", title: "Overview & Commitment to User Control" },
  { id: "scope-of-deletion", title: "What Data Can Be Deleted" },
  { id: "self-service-steps", title: "Self-Service Channel Disconnection & Purge" },
  { id: "email-request", title: "Submitting a Formal Deletion Request" },
  { id: "meta-instructions", title: "Meta / Facebook App Removal Instructions" },
  { id: "deletion-lifecycle", title: "What Happens After a Deletion Request" },
  { id: "processing-timeline", title: "Expected Processing Timeline" },
  { id: "retention-exceptions", title: "Statutory & Security Retention Exceptions" },
  { id: "third-party-boundary", title: "Meta & Third-Party System Boundaries" },
  { id: "support-desk", title: "Support Desk & Assistance" },
];

export function DataDeletionView() {
  return (
    <LegalPageLayout
      title="Appnix Technologies Data Deletion Instructions"
      subtitle="Step-by-step guidance on disconnecting channels, requesting data erasure, and understanding our data deletion and retention lifecycle."
      badge="User Data Control & Deletion"
      effectiveDate="January 1, 2026"
      lastUpdated="September 1, 2026"
      activePath="/data-deletion"
      tocItems={DATA_DELETION_TOC}
    >
      {/* 1. Overview */}
      <section id="overview" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Overview & Commitment to User Control
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          At <strong>Appnix Technologies</strong>, we firmly uphold our clients&apos; and users&apos; rights to data sovereignty, privacy, and erasure. This page provides clear, actionable instructions on how our business clients and associated users can request or execute the deletion of their accounts, CRM records, and connected WhatsApp / Meta channel data from the Appnix SaaS platform.
        </p>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs sm:text-sm space-y-1.5 text-muted-foreground">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
            Core Principle: No Unwanted Data Retention
          </p>
          <p>
            When a client chooses to disconnect a communication channel or close their workspace, Appnix purges stored credentials, cached message logs, and customer attributes from our application database in accordance with our deletion lifecycle.
          </p>
        </div>
      </section>

      {/* 2. Scope of Deletion */}
      <section id="scope-of-deletion" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            What Data Can Be Deleted
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upon receiving a verified deletion request or executing an in-app workspace purge, the following categories of data stored in Appnix databases are scheduled for permanent erasure:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Workspace & Account Profiles
            </p>
            <p className="text-muted-foreground">Tenant configuration, registered user profile, password hashes, email addresses, team membership records, and role assignments.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CRM Contacts & Customer Lists
            </p>
            <p className="text-muted-foreground">Customer contact phone numbers, names, email addresses, custom tags, custom field attributes (Super Fields), and saved audience segments.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Connected Channel Credentials
            </p>
            <p className="text-muted-foreground">Encrypted OAuth tokens, WhatsApp Phone Number IDs, WABA IDs, access tokens, and webhook subscription bindings stored for your workspace.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Automations & Messaging Logs
            </p>
            <p className="text-muted-foreground">Workflow diagrams, chatbot logic, transient DataStore key-value records, campaign broadcast logs, and message delivery receipts stored in Appnix.</p>
          </div>
        </div>
      </section>

      {/* 3. Self-Service Steps */}
      <section id="self-service-steps" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Self-Service Channel Disconnection & Purge
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Authorized workspace administrators can remove channels and delete specific datasets directly from the Appnix SaaS dashboard at any time without waiting for manual support assistance:
        </p>

        <div className="space-y-3 pt-1">
          {/* Step 1 */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                Step 1: Disconnect WhatsApp Business Channel
              </h4>
              <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                In-App
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Navigate to <strong>Dashboard &gt; Channels &gt; WhatsApp</strong> (or your respective channel). Click <strong>&ldquo;Manage / Disconnect Channel&rdquo;</strong> and confirm disconnection. This immediately halts webhook message reception, invalidates stored access tokens on Appnix, and disassociates the Phone Number ID from your tenant.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                Step 2: Bulk-Delete CRM Contacts & Audiences
              </h4>
              <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                In-App
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Navigate to <strong>Dashboard &gt; CRM &gt; Contacts</strong>. Select individual contacts or use &ldquo;Select All&rdquo;, then click <strong>&ldquo;Delete Selected Contacts&rdquo;</strong> to permanently remove customer records and associated tags from your tenant database.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                Step 3: Remove Workflows & Data Stores
              </h4>
              <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                In-App
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Navigate to <strong>Automations &gt; Workflows</strong> or <strong>Data Store</strong>, select the workflows or data collections you wish to remove, and click <strong>&ldquo;Delete&rdquo;</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Formal Email Request */}
      <section id="email-request" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Submitting a Formal Deletion Request
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you want a complete, full-workspace purge including all backups, user credentials, and historical logs, you can submit a formal written deletion request to our privacy desk:
        </p>
        
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
            <Mail className="h-4 w-4" />
            <span>Email Request Format & Instructions</span>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p><strong>To:</strong> <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline">privacy@appnix.co.in</a> or <a href="mailto:support@appnix.co.in" className="text-primary hover:underline">support@appnix.co.in</a></p>
            <p><strong>Subject:</strong> <code>Data Deletion Request - [Your Workspace Name / Registered Email]</code></p>
            <p><strong>Requirements:</strong> The request must be sent from the registered account owner&apos;s email address to verify authorization.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-[11px] font-mono text-muted-foreground">
            <p>Dear Appnix Compliance Team,</p>
            <p className="mt-1">I am writing to formally request the complete deletion of all data associated with my account and workspace on the Appnix SaaS platform:</p>
            <p className="mt-1">&bull; Workspace Name / Slug: [Your Workspace Name]</p>
            <p>&bull; Registered Email: [Your Email Address]</p>
            <p>&bull; Scope: Complete workspace purge &amp; channel token revocation.</p>
            <p className="mt-1">Please confirm when the deletion process has been initiated and completed.</p>
          </div>
        </div>
      </section>

      {/* 5. Meta / Facebook Instructions */}
      <section id="meta-instructions" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-600">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Meta / Facebook App Removal & User Data Deletion Callback Instructions
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          In compliance with Meta Platform Policies and User Data Deletion Callback requirements, users who connected via Facebook Login or granted permissions through Meta Business Suite can revoke access directly from Facebook settings:
        </p>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            How to remove Appnix from your Facebook / Meta Business Account:
          </h4>
          <ol className="space-y-2 text-xs text-muted-foreground list-decimal pl-5">
            <li>Log in to your Facebook or Meta Business Suite account (<a href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">Facebook Business Integrations <ExternalLink className="h-2.5 w-2.5" /></a>).</li>
            <li>Go to <strong>Settings &amp; Privacy &gt; Settings &gt; Business Integrations</strong> (or <strong>Apps and Websites</strong>).</li>
            <li>Locate the <strong>Appnix</strong> application in your active integrations list.</li>
            <li>Select the checkbox next to Appnix and click the <strong>&ldquo;Remove&rdquo;</strong> button.</li>
            <li>Confirm removal. If you check &ldquo;Delete posts, videos or events Appnix posted on your timeline&rdquo;, Meta will also remove authorized session history.</li>
            <li>When Meta notifies our User Data Deletion Callback endpoint, our platform automatically invalidates associated session tokens and generates a confirmation status code.</li>
          </ol>
        </div>
      </section>

      {/* 6. Deletion Lifecycle */}
      <section id="deletion-lifecycle" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            What Happens After a Deletion Request
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Once a valid deletion request is received and authenticated:
        </p>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary shrink-0">1</div>
            <div>
              <p className="font-semibold text-foreground">Identity & Authorization Verification</p>
              <p>Our security desk verifies the identity of the requestor to prevent unauthorized workspace tampering or malicious deletion attempts.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary shrink-0">2</div>
            <div>
              <p className="font-semibold text-foreground">Channel Disassociation & Token Revocation</p>
              <p>All active OAuth access tokens, API secrets, and webhook routing endpoints are disconnected and invalidated.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary shrink-0">3</div>
            <div>
              <p className="font-semibold text-foreground">Database Purge</p>
              <p>CRM contacts, custom tags, workflow logs, data store records, and user credentials mapped to that tenant ID are permanently deleted from production databases.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary shrink-0">4</div>
            <div>
              <p className="font-semibold text-foreground">Written Confirmation Notice</p>
              <p>A formal written confirmation is dispatched to the registered administrator email confirming the completion of the deletion process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Timeline */}
      <section id="processing-timeline" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Expected Processing Timeline
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We process deletion requests promptly in accordance with standard data governance timelines:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              <span>Initial Acknowledgment</span>
            </div>
            <p>Written acknowledgment of request receipt within <strong>48 business hours</strong>.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Complete Production Purge</span>
            </div>
            <p>Complete data purging across primary database tables and production environments within <strong>15 to 30 calendar days</strong>.</p>
          </div>
        </div>
      </section>

      {/* 8. Retention Exceptions */}
      <section id="retention-exceptions" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-600">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Statutory & Security Retention Exceptions
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          While customer communications, CRM data, and credentials are completely erased upon request, certain limited operational records must be retained in accordance with applicable statutory and legal frameworks:
        </p>
        <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-5">
          <li><strong>Financial & Invoicing Records:</strong> GST/tax invoices, payment transaction IDs, and corporate billing statements are retained for the statutory period required under Indian financial and taxation laws.</li>
          <li><strong>Security & Abuse Prevention Logs:</strong> Redacted, anonymized connection logs may be preserved for a limited duration solely to investigate abuse, spam complaints, or defend against legal claims.</li>
        </ul>
      </section>

      {/* 9. Meta & Third-Party Boundaries */}
      <section id="third-party-boundary" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Meta & Third-Party System Boundaries
          </h2>
        </div>
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm text-muted-foreground">
          <p className="font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            Important Technical & Jurisdictional Boundary Notice:
          </p>
          <p className="leading-relaxed">
            <strong>Appnix Technologies can only delete data controlled, cached, or processed directly within our own software infrastructure and databases.</strong>
          </p>
          <p className="leading-relaxed">
            Submitting a data deletion request to Appnix does <em>not</em> automatically delete data stored independently on Meta&apos;s WhatsApp servers, records managed directly within your Meta Business Manager, or messages stored locally on your end-customers&apos; personal devices. To delete data stored directly with Meta/WhatsApp, you must manage your Meta Business Manager account settings or contact Meta Platforms directly.
          </p>
        </div>
      </section>

      {/* 10. Support Desk */}
      <section id="support-desk" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            10
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Support Desk & Assistance
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Need assistance with channel disconnection or initiating an account deletion request? Our support team is here to assist you:
        </p>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Appnix Technologies — Data Governance Desk</p>
              <p className="text-muted-foreground">603–604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, Uttar Pradesh 201305, India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="text-muted-foreground">Email: </span>
              <a href="mailto:privacy@appnix.co.in" className="text-primary hover:underline font-medium">privacy@appnix.co.in</a>
              <span className="text-muted-foreground"> / </span>
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
