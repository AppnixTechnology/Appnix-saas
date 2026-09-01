"use client";

import Link from "next/link";
import { 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  Lock, 
  Server, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  CreditCard,
  Ban
} from "lucide-react";
import { LegalPageLayout, TOCItem } from "@/components/legal/LegalPageLayout";

const TERMS_TOC: TOCItem[] = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "saas-description", title: "Description of SaaS Platform & Services" },
  { id: "account-registration", title: "Account Registration & Responsibilities" },
  { id: "whatsapp-compliance", title: "WhatsApp & Meta Platform Compliance" },
  { id: "acceptable-use", title: "Acceptable Use & Anti-Spam Policy" },
  { id: "prohibited-activities", title: "Prohibited Activities" },
  { id: "customer-content", title: "Customer Content & Data Ownership" },
  { id: "intellectual-property", title: "Intellectual Property Rights" },
  { id: "third-party-services", title: "Third-Party Services & Upstream APIs" },
  { id: "service-availability", title: "Service Availability & Maintenance" },
  { id: "billing-subscriptions", title: "Fees, Subscriptions & Balance Top-ups" },
  { id: "refund-policy", title: "Cancellation & Refund Policy" },
  { id: "suspension-termination", title: "Suspension & Termination" },
  { id: "disclaimers", title: "Disclaimer of Warranties" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "governing-law", title: "Governing Law & Jurisdiction" },
  { id: "modifications", title: "Modifications to Terms" },
  { id: "contact-legal", title: "Contact Information & Legal Notices" },
];

export function TermsAndConditionsView() {
  return (
    <LegalPageLayout
      title="Appnix Technologies Terms & Conditions"
      subtitle="The binding legal agreement governing use of the Appnix Technologies SaaS messaging and customer engagement platform."
      badge="Legal Terms of Service"
      effectiveDate="January 1, 2026"
      lastUpdated="September 1, 2026"
      activePath="/terms-and-conditions"
      tocItems={TERMS_TOC}
    >
      {/* 1. Acceptance */}
      <section id="acceptance" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Acceptance of Terms
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between <strong>Appnix Technologies</strong> (&ldquo;Appnix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) and the business, entity, or individual (&ldquo;Client&rdquo;, &ldquo;Customer&rdquo;, or &ldquo;you&rdquo;) registering for or utilizing our software-as-a-service platform accessible via <a href="https://appnix.co.in" className="text-primary hover:underline font-medium">https://appnix.co.in</a> (the &ldquo;Platform&rdquo; or &ldquo;Services&rdquo;).
        </p>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Important Acceptance Notice:</p>
          <p className="mt-1 leading-relaxed">
            By creating an account, connecting a WhatsApp Business Account, or accessing the platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our <Link href="/privacy-policy" className="text-primary hover:underline font-semibold">Privacy Policy</Link> and <Link href="/data-deletion" className="text-primary hover:underline font-semibold">Data Deletion Instructions</Link>.
          </p>
        </div>
      </section>

      {/* 2. Description */}
      <section id="saas-description" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Description of SaaS Platform & Services
          </h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          <strong>Appnix Technologies provides a software platform that helps businesses manage customer communication through WhatsApp. Clients connect their own WhatsApp Business accounts to the platform and use it to communicate with their customers, manage conversations, and organize customer interactions. Platform Data is used only to provide these communication and management features to the respective client.</strong>
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Platform features include unified multi-agent inbox, campaign broadcasts, interactive visual chatbot and workflow builders, custom CRM contacts management (Super Fields and tags), template synchronization with Meta, and transactional notifications.
        </p>
      </section>

      {/* 3. Account Registration */}
      <section id="account-registration" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Account Registration & Responsibilities
          </h2>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li><strong>Business Representation:</strong> You represent and warrant that you are registering on behalf of a valid commercial entity or legitimate business, and have full authority to bind that entity to these Terms.</li>
          <li><strong>Accurate Information:</strong> You agree to provide accurate, current, and complete registration details and promptly maintain and update this information.</li>
          <li><strong>Credential Security:</strong> You are responsible for safeguarding your login credentials, API secrets, and workspace tokens. You must notify us immediately of any unauthorized account activity.</li>
          <li><strong>Account Activity:</strong> The Client assumes full liability for all actions, communications, and message broadcasts executed under its workspace credentials.</li>
        </ul>
      </section>

      {/* 4. WhatsApp & Meta Platform Compliance */}
      <section id="whatsapp-compliance" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-600">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            WhatsApp &amp; Meta Platform Compliance
          </h2>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Mandatory Meta &amp; WhatsApp Policy Compliance</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Because our platform interfaces with Meta Cloud API and WhatsApp Business Platform, all Clients must strictly comply with the following upstream policies:
          </p>
          <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
            <li><a href="https://www.whatsapp.com/legal/business-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp Business Messaging Policy <ExternalLink className="h-2.5 w-2.5 inline" /></a></li>
            <li><a href="https://www.whatsapp.com/legal/commerce-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp Commerce Policy <ExternalLink className="h-2.5 w-2.5 inline" /></a></li>
            <li><a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta Developer Platform Terms <ExternalLink className="h-2.5 w-2.5 inline" /></a></li>
          </ul>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Explicit Opt-in Requirement:</strong> Clients must obtain verifiable, explicit prior consent from end-users before transmitting proactive business or marketing template messages over WhatsApp.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Upstream Decisions:</strong> You acknowledge that Meta Platforms, Inc. independently determines template approvals, phone number verification tiering, and account quality limits. Appnix does not guarantee template approvals or immunity from Meta account restrictions if your business violates WhatsApp messaging guidelines.
          </p>
        </div>
      </section>

      {/* 5. Acceptable Use */}
      <section id="acceptable-use" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Acceptable Use & Anti-Spam Policy
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You agree to use our Services only for lawful business communication and customer support. Appnix maintains a <strong>Zero Tolerance Anti-Spam Policy</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Opt-Out Mechanisms</p>
            <p>You must honor all end-user unsubscribe or opt-out requests (e.g. &ldquo;STOP&rdquo;) promptly and refrain from messaging opted-out contacts.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <p className="font-semibold text-foreground">Truthful Sender Identity</p>
            <p>You must accurately identify your business in all communication and never impersonate third parties or mislead recipients.</p>
          </div>
        </div>
      </section>

      {/* 6. Prohibited Activities */}
      <section id="prohibited-activities" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Prohibited Activities
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Clients and users shall NOT under any circumstances:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li>Send unsolicited marketing broadcasts (spam) to scraped or bought contact lists.</li>
          <li>Distribute fraudulent schemes, deceptive financial offers, malicious URLs, phishing attempts, or illicit substances prohibited by WhatsApp Commerce Policy.</li>
          <li>Reverse engineer, decompile, disassemble, or derive the source code of the Appnix SaaS platform.</li>
          <li>Bypass security controls, execute denial-of-service (DoS) attacks, or overload API rate limits.</li>
          <li>Resell, sublicense, or rent the platform to unauthorized third parties without an active Agency White-Label Reseller agreement.</li>
        </ul>
      </section>

      {/* 7. Customer Content */}
      <section id="customer-content" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Customer Content & Data Ownership
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>You retain all ownership, intellectual property rights, and legal responsibility for all messages, media, customer contact lists, and assets uploaded to your workspace (&ldquo;Customer Content&rdquo;).</strong>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          You grant Appnix a limited, non-exclusive, royalty-free license solely to host, transmit, format, and display your Customer Content to the extent strictly necessary to operate the Services on your behalf.
        </p>
      </section>

      {/* 8. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Intellectual Property Rights
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Appnix platform, including its software code, UI designs, workflow engines, documentation, trademarks, logos, and features, is and remains the exclusive intellectual property of Appnix Technologies. Nothing in these Terms grants the Client any ownership in Appnix IP.
        </p>
      </section>

      {/* 9. Third-Party Services */}
      <section id="third-party-services" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Third-Party Services & Upstream APIs
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Platform integrates with third-party service providers (such as Meta Platforms, Google Cloud, Brevo, and telecom carriers). Appnix Technologies is not responsible for upstream outages, rate-limiting, policy modifications, or disruptions originating from these independent third-party platforms.
        </p>
      </section>

      {/* 10. Service Availability */}
      <section id="service-availability" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            10
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Service Availability & Maintenance
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We strive to maintain a 99.9% service uptime. However, the Platform is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. Routine maintenance, scheduled infrastructure updates, or unforeseen network disruptions may occasionally cause brief downtime. Where feasible, advance notice of scheduled maintenance will be communicated.
        </p>
      </section>

      {/* 11. Fees & Subscriptions */}
      <section id="billing-subscriptions" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            11
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Fees, Subscriptions & Balance Top-ups
          </h2>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
          <li><strong>Subscription Plans:</strong> Access to specific features, seat quotas, and workflow tiers is billed on a recurring monthly or annual subscription basis according to selected plan pricing.</li>
          <li><strong>Messaging Consumption:</strong> WhatsApp conversation fees and RCS message units may be billed directly by upstream providers (Meta) or charged against workspace prepaid wallet balances.</li>
          <li><strong>Taxes:</strong> All listed prices are exclusive of applicable taxes (such as GST), which will be added at checkout where legally required.</li>
        </ul>
      </section>

      {/* 12. Refund Policy */}
      <section id="refund-policy" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            12
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Cancellation & Refund Policy
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You may cancel your SaaS subscription at any time via <strong>Settings &gt; Billing</strong>. Upon cancellation, your workspace remains active through the end of the paid billing period. Because of the instant allocation of cloud infrastructure and API credentials, subscription payments are non-refundable except where required by applicable statutory consumer protection law.
        </p>
      </section>

      {/* 13. Suspension & Termination */}
      <section id="suspension-termination" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600">
            13
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Suspension & Termination
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Appnix Technologies reserves the right to immediately suspend or terminate your account or revoke channel connectivity if:
        </p>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-5">
          <li>You violate WhatsApp Business Messaging Policies or receive severe spam flags from Meta.</li>
          <li>You fail to settle outstanding subscription invoices.</li>
          <li>You engage in abusive, unlawful, or harmful activities that compromise the integrity of our multi-tenant infrastructure.</li>
        </ul>
      </section>

      {/* 14. Disclaimers */}
      <section id="disclaimers" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            14
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Disclaimer of Warranties
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed uppercase">
          To the maximum extent permitted by applicable law, the Platform and Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, whether express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
      </section>

      {/* 15. Limitation of Liability */}
      <section id="limitation-liability" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            15
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Limitation of Liability
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          In no event shall Appnix Technologies, its founders, officers, or employees be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, business reputation, or goodwill) arising out of or related to your use of the Services. Our total aggregate liability under these Terms shall not exceed the total fees paid by you to Appnix Technologies in the twelve (12) months preceding the claim.
        </p>
      </section>

      {/* 16. Indemnification */}
      <section id="indemnification" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            16
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Indemnification
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          You agree to defend, indemnify, and hold harmless Appnix Technologies from and against any third-party claims, damages, obligations, losses, liabilities, costs, or debt (including legal fees) arising from: (i) your Customer Content or messaging campaigns, (ii) your violation of these Terms or Meta Platform Policies, or (iii) any end-user complaint regarding lack of messaging opt-in consent.
        </p>
      </section>

      {/* 17. Governing Law */}
      <section id="governing-law" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            17
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Governing Law & Jurisdiction
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-primary" />
            Jurisdiction Clause:
          </p>
          <p className="leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gautam Buddha Nagar (Noida), Uttar Pradesh, India</strong>.
          </p>
        </div>
      </section>

      {/* 18. Modifications */}
      <section id="modifications" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            18
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Modifications to Terms
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We reserve the right to revise these Terms periodically. We will post the revised Terms on this page with an updated &ldquo;Last Updated&rdquo; date. Continued use of the platform after changes become effective constitutes your acceptance of the revised Terms.
        </p>
      </section>

      {/* 19. Contact Information */}
      <section id="contact-legal" className="scroll-mt-28 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/80 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            19
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
            Contact Information & Legal Notices
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For formal legal notices or inquiries concerning these Terms &amp; Conditions, please reach out to our legal and compliance desk:
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
              <span className="text-muted-foreground">Legal &amp; Compliance: </span>
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
