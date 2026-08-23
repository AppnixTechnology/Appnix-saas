"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What messaging channels does Appnix support?",
    answer:
      "Appnix natively supports official WhatsApp Business API (Cloud API), Google RCS Business Messaging, Instagram Direct (DMs and Story Replies), and Facebook Messenger. All channels connect directly using official Meta and Google APIs with zero workarounds.",
  },
  {
    question: "Can I connect WhatsApp, Instagram, RCS, and Facebook simultaneously?",
    answer:
      "Yes! All incoming messages from all connected channels land in the unified Appnix Inbox. Your agents can triage conversations, assign tags, trigger AI bot responses, and view complete customer history in one central interface.",
  },
  {
    question: "Does Appnix provide a built-in CRM for lead management?",
    answer:
      "Yes. Appnix includes an enterprise CRM with 360° contact profiles, custom tags, deal pipeline tracking, automated lead capture from chats, custom fields, and webhook synchronization with your existing tools like HubSpot, Salesforce, and Zoho.",
  },
  {
    question: "Can I build automated chatbots without writing code?",
    answer:
      "Absolutely. Our visual No-Code Bot & Automation Builder enables you to create conversational decision trees, keyword triggers, interactive quick-reply buttons, product catalogs, and smart conditional branches in minutes.",
  },
  {
    question: "Can multiple team members manage conversations collaboratively?",
    answer:
      "Yes. You can assign dedicated seats, configure round-robin lead distribution, create private internal team notes on chats, and establish SLA response time alerts for high-priority VIP accounts.",
  },
  {
    question: "Do you provide a free trial?",
    answer:
      "Yes, we provide a full-featured 14-day free trial on our platform with pre-loaded sandbox message credits. No credit card is required to sign up and start exploring.",
  },
  {
    question: "Can I book a personalized live product demo?",
    answer:
      "Yes! Our solutions engineering team conducts personalized 15-minute live walkthroughs to assess your channel requirements, show relevant industry workflows, and answer technical architecture questions.",
  },
  {
    question: "How does the White-Label Agency solution work?",
    answer:
      "Our white-label plan allows marketing agencies and SaaS providers to rebrand the entire platform with their own custom domain (e.g. app.youragency.com), custom logos, brand colors, and isolated multi-tenant client workspaces. You bill your clients directly and retain 100% of your margins.",
  },
];

export function FAQ({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            {t.faq.badge}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t.faq.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-balance">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200 border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Box */}
        <div className="mt-12 rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-7 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-foreground">
              {t.faq.stillQuestions}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our engineering solutions team is available 24/7 to help design your deployment.
            </p>
          </div>
          <Button
            onClick={onOpenDemoModal}
            className="h-10 px-5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shrink-0 cursor-pointer"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            {t.faq.talkToExpert}
          </Button>
        </div>
      </div>
    </section>
  );
}
