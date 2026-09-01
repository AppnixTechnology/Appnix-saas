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
      "Appnix supports WhatsApp Business Cloud API integration, RCS Business Messaging, Instagram Direct (DMs and Story Replies), and Facebook Messenger. Channels connect using standard API credentials and webhook configurations.",
  },
  {
    question: "Can I connect WhatsApp, Instagram, RCS, and Facebook simultaneously?",
    answer:
      "Yes. Incoming messages from connected channels are received in the unified Appnix Inbox. Your team can triage conversations, assign tags, trigger automated bot responses, and view customer interaction history in one interface.",
  },
  {
    question: "Does Appnix provide a built-in CRM for lead management?",
    answer:
      "Yes. Appnix includes a CRM with contact profiles, custom tags, deal pipeline tracking, lead capture from chats, custom fields, and HTTP webhook integration with external platforms.",
  },
  {
    question: "Can I build automated chatbots without writing code?",
    answer:
      "Yes. Our visual No-Code Bot & Automation Builder enables you to create conversational decision trees, keyword triggers, interactive quick-reply buttons, product catalogs, and conditional branches.",
  },
  {
    question: "Can multiple team members manage conversations collaboratively?",
    answer:
      "Yes. You can assign dedicated seats, configure lead distribution, create private internal team notes on chats, and establish response routing for priority accounts.",
  },
  {
    question: "How can I explore the platform?",
    answer:
      "You can request a live product walkthrough or explore the platform directly by creating an account. Our team is available to demonstrate platform capabilities and assist with setup.",
  },
  {
    question: "Can I book a personalized live product demo?",
    answer:
      "Yes! Our team conducts personalized live walkthroughs to assess your channel requirements, show relevant workflows, and answer technical architecture questions.",
  },
  {
    question: "How does Multi-Tenant and White-Label support work?",
    answer:
      "Appnix provides multi-tenant database isolation, allowing organizations to manage segregated client workspaces with independent API credentials and team roles today. Advanced white-label capabilities such as custom domain mapping (CNAME), custom branded portals, and reseller sub-account consoles are on our planned development roadmap.",
  },
];

export function FAQ({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
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
        <div className="mt-8 sm:mt-10 rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-7 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-foreground">
              {t.faq.stillQuestions}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our solutions team is available to help answer questions and guide your setup.
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
