"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  ArrowUpRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Users,
  Bot,
  MessageSquare,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isCurrent?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter Tier",
    price: "₹999",
    period: "/month",
    description: "For small businesses starting with omnichannel messaging.",
    features: [
      "Up to 2,000 monthly messages",
      "2 WhatsApp / Social channels",
      "1 Automation Botflow",
      "2 Team Members",
      "Community Support",
    ],
  },
  {
    id: "pro",
    name: "Professional Tier",
    price: "₹2,999",
    period: "/month",
    isCurrent: true,
    description: "For fast-scaling teams automating campaigns and customer care.",
    features: [
      "Up to 25,000 monthly messages",
      "Unlimited Channels (WhatsApp, IG, FB, RCS)",
      "5 Advanced AI Botflows",
      "10 Team Member Seats",
      "Priority Live Support & SLA",
      "Custom Webhooks & REST API",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Custom",
    price: "₹8,999",
    period: "/month",
    description: "Dedicated high-volume messaging infrastructure and SLA.",
    features: [
      "Unlimited Monthly Messages",
      "Custom AI Voice Agent streaming",
      "Unlimited Automation Botflows",
      "Unlimited Team Seats & SSO",
      "Dedicated Account Manager",
      "Custom SLA & On-premise deployment",
    ],
  },
];

const invoices = [
  {
    id: "INV-2026-003",
    date: "18 Feb 2026",
    plan: "Professional Tier (Monthly)",
    amount: "₹2,999.00",
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    date: "18 Jan 2026",
    plan: "Professional Tier (Monthly)",
    amount: "₹2,999.00",
    status: "Paid",
  },
  {
    id: "INV-2025-001",
    date: "18 Dec 2025",
    plan: "Professional Tier (Monthly)",
    amount: "₹2,999.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  const [currentPlan] = useState("pro");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Workspace</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Billing</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Subscription & Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace subscription tier, invoices, and quota allowances.
        </p>
      </div>

      {/* Active Subscription Banner */}
      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold">
                CURRENT PLAN
              </Badge>
              <h2 className="text-xl font-bold text-foreground">Professional Tier Plan</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Renews automatically on <span className="font-semibold text-foreground">Mar 18, 2026</span> via Visa •••• 4018.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-2xl font-extrabold text-foreground">₹2,999<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <p className="text-xs text-emerald-600 font-medium">77 Days remaining in billing cycle</p>
            </div>
            <Button
              onClick={() => alert("Manage payment method")}
              variant="outline"
              className="text-xs"
            >
              Update Payment Method
            </Button>
          </div>
        </div>

        {/* Quota Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> Messages Dispatched
              </span>
              <span className="font-semibold text-foreground">4,120 / 25,000</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "16.48%" }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Bot className="h-3.5 w-3.5" /> Botflows Active
              </span>
              <span className="font-semibold text-foreground">3 / 5</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Team Seats Used
              </span>
              <span className="font-semibold text-foreground">5 / 10</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Tiers */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Available Workspace Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isSelected = p.isCurrent;
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border p-6 flex flex-col justify-between shadow-xs transition-all",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "bg-card hover:shadow-md"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-foreground">{p.name}</h3>
                    {isSelected && (
                      <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 min-h-8">{p.description}</p>
                  <p className="text-3xl font-extrabold text-foreground mb-6">
                    {p.price}
                    <span className="text-xs font-normal text-muted-foreground">{p.period}</span>
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  disabled={isSelected}
                  onClick={() => alert(`Upgrading to ${p.name}`)}
                  className={cn(
                    "w-full text-xs font-semibold",
                    isSelected ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  {isSelected ? "Current Active Plan" : "Upgrade to this Plan"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b">
          <h2 className="font-bold text-sm text-foreground">Billing Invoices</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download your tax invoices and payment receipts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left">Invoice ID</th>
                <th className="p-3.5 text-left">Billing Date</th>
                <th className="p-3.5 text-left">Plan / Description</th>
                <th className="p-3.5 text-left">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-mono text-xs font-semibold text-foreground">
                    {inv.id}
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">
                    {inv.date}
                  </td>
                  <td className="p-3.5 text-xs text-foreground">
                    {inv.plan}
                  </td>
                  <td className="p-3.5 text-xs font-bold text-foreground">
                    {inv.amount}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => alert(`Downloading ${inv.id}`)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
