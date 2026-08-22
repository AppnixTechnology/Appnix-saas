"use client";

import {
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  Tag,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon, RCSIcon, InstagramIcon } from "@/components/landing/channel-icons";

const mockContacts = [
  {
    id: "1",
    name: "Ankit Bansal",
    company: "FinScale Technologies",
    channel: "WhatsApp",
    stage: "Negotiation",
    dealValue: "$12,000",
    assignedTo: "Alex Rivera",
    tags: ["VIP Lead", "High Intent"],
    lastContact: "10 mins ago",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    company: "Acme Logistics Group",
    channel: "RCS API",
    stage: "Proposal Sent",
    dealValue: "$8,500",
    assignedTo: "Maya Lin",
    tags: ["Enterprise", "RCS Verified"],
    lastContact: "1 hour ago",
  },
  {
    id: "3",
    name: "Carlos Mendez",
    company: "Retail Brands Global",
    channel: "Instagram",
    stage: "Demo Scheduled",
    dealValue: "$15,000",
    assignedTo: "Alex Rivera",
    tags: ["E-commerce", "Hot Lead"],
    lastContact: "3 hours ago",
  },
];

const crmHighlights = [
  "Contact & Account 360° Profile Management",
  "Automated Lead Capture from WhatsApp & RCS Chats",
  "Dynamic Tags, Custom Attributes & Smart Segments",
  "Team Assignment, Round-Robin & SLA Routing",
  "Full Conversation History & Internal Team Notes",
  "Revenue Pipeline Tracking & Conversion Funnels",
];

export function CRMShowcase({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  return (
    <section id="crm" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: CRM Dashboard Mockup */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
              {/* Window Bar */}
              <div className="border-b border-border/70 bg-muted/60 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Appnix CRM • Lead Pipeline & Contact Intelligence
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-background font-mono">
                  Active Deals: $35,500
                </Badge>
              </div>

              {/* CRM Top Controls */}
              <div className="p-4 border-b border-border/60 bg-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground w-full sm:w-56">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search 1,284 contacts...</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs border border-border rounded-lg px-2 py-1.5 text-muted-foreground cursor-pointer hover:bg-muted">
                    <Filter className="h-3 w-3" />
                    <span>Filter</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                    +18 New Leads Today
                  </span>
                </div>
              </div>

              {/* CRM Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 text-[10px] uppercase font-semibold tracking-wider">
                    <tr>
                      <th className="p-3 pl-4">Contact / Company</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Deal Value</th>
                      <th className="p-3">Stage</th>
                      <th className="p-3">Tags</th>
                      <th className="p-3 pr-4">Assigned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {mockContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 pl-4">
                          <div className="font-bold text-foreground">{contact.name}</div>
                          <div className="text-[10px] text-muted-foreground">{contact.company}</div>
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium px-1.5 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            {contact.channel === "WhatsApp" && <WhatsAppIcon className="h-3 w-3 shrink-0" />}
                            {contact.channel === "RCS API" && <RCSIcon className="h-3 w-3 shrink-0 text-blue-600" />}
                            {contact.channel === "Instagram" && <InstagramIcon className="h-3 w-3 shrink-0 text-pink-600" />}
                            {contact.channel}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-foreground">
                          {contact.dealValue}
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-[9px] font-semibold">
                            {contact.stage}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-primary/10 text-primary text-[9px] font-medium px-1.5 py-0.2 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 pr-4 text-muted-foreground font-medium text-[11px]">
                          {contact.assignedTo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Quick Contact Insight */}
              <div className="p-3.5 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Auto-sync with WhatsApp Business API & Webhooks</span>
                </div>
                <span className="font-medium text-foreground">100% Data Ownership</span>
              </div>
            </div>
          </div>

          {/* Right Column: CRM Features & Copy */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                <DollarSign className="h-3.5 w-3.5" />
                Revenue & Pipeline Acceleration
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Turn Conversations Into Customers.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Stop letting hot prospects disappear in unstructured chat threads. Appnix transforms incoming customer messages across WhatsApp, Instagram, and RCS into organized, actionable CRM records.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {crmHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Button
                onClick={onOpenDemoModal}
                size="lg"
                className="h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md"
              >
                See CRM in Action
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
