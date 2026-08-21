"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Filter,
  Tag,
  Plus,
  Users,
  MessageSquare,
  Wallet,
  Flag,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Download,
  Trash2,
  ChevronRight,
} from "lucide-react";

// ---------- Types ----------
interface Contact {
  id: string;
  createdOn: string;
  tags: { label: string; variant: "vip" | "star" | "check" | "none" }[];
  fullName: string;
  whatsappNumber: string;
  marketingBudget: string;
  marketingGoal: string;
}

// ---------- Mock data ----------
const statCards = [
  {
    label: "Total Contacts",
    value: "1,284",
    change: "+12% this month",
    icon: Users,
    trend: "up",
  },
  {
    label: "Active WhatsApp",
    value: "856",
    change: "+5% this month",
    icon: MessageSquare,
    trend: "up",
  },
  {
    label: "Marketing Budget",
    value: "$45.2k",
    change: "Active Campaigns",
    icon: Wallet,
    trend: "neutral",
  },
  {
    label: "Goals Met",
    value: "92%",
    change: "Above Target",
    icon: Flag,
    trend: "good",
  },
];

const contacts: Contact[] = [
  {
    id: "1",
    createdOn: "24 Feb 2026, 05:55 PM",
    tags: [],
    fullName: "Ankit Bansal",
    whatsappNumber: "919328612083",
    marketingBudget: "",
    marketingGoal: "",
  },
  {
    id: "2",
    createdOn: "21 Feb 2026, 10:34 AM",
    tags: [{ label: "VIP", variant: "vip" }],
    fullName: "Com.Bot",
    whatsappNumber: "919054618623",
    marketingBudget: "",
    marketingGoal: "",
  },
  {
    id: "3",
    createdOn: "20 Feb 2026, 12:26 PM",
    tags: [],
    fullName: "Nourin Sodawala",
    whatsappNumber: "917048690369",
    marketingBudget: "",
    marketingGoal: "",
  },
  {
    id: "4",
    createdOn: "18 Feb 2026, 03:10 PM",
    tags: [
      { label: "star", variant: "star" },
      { label: "check", variant: "check" },
    ],
    fullName: "919911234578",
    whatsappNumber: "919911234578",
    marketingBudget: "",
    marketingGoal: "",
  },
  {
    id: "5",
    createdOn: "17 Feb 2026, 04:14 PM",
    tags: [],
    fullName: "",
    whatsappNumber: "9876543210",
    marketingBudget: "",
    marketingGoal: "",
  },
];

// ---------- Editable-looking cell ----------
function EditableCell({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "text-sm",
        value ? "text-foreground" : "italic text-muted-foreground"
      )}
    >
      {value || "Double click to edit"}
    </span>
  );
}

export default function CrmContactsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState("20");

  const allSelected = selected.length === contacts.length;

  const toggleAll = () => {
    setSelected(allSelected ? [] : contacts.map((c) => c.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">CRM Contacts</h1>
          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
            <span>CRM</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary">Contacts List</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:justify-end">
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button variant="outline" className="shrink-0">
            <Tag className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Tags</span>
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-950 text-white shrink-0">
            <Plus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Add New Contact</span>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-background p-4">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center mb-3">
              <stat.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
            <p
              className={cn(
                "text-xs mt-1 flex items-center gap-1",
                stat.trend === "up" && "text-green-600",
                stat.trend === "good" && "text-green-600",
                stat.trend === "neutral" && "text-muted-foreground"
              )}
            >
              {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
              {stat.trend === "good" && <CheckCircle2 className="h-3 w-3" />}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background overflow-hidden">
        {/* Table toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-b">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>
              <Input
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="h-8 w-16 text-sm"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              Showing 1-{rows} of 1,284 results
            </span>
          </div>
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-3 w-10 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Action
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Created On
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Tags
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Full Name
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  WhatsApp Number
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Marketing Budget
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  Marketing Goal
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b last:border-0 hover:bg-accent/30">
                  <td className="p-3">
                    <Checkbox
                      checked={selected.includes(contact.id)}
                      onCheckedChange={() => toggleOne(contact.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-primary">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap text-muted-foreground">
                    {contact.createdOn}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {contact.tags.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">--No Tags--</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        {contact.tags.map((tag, i) =>
                          tag.variant === "vip" ? (
                            <Badge
                              key={i}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                            >
                              VIP
                            </Badge>
                          ) : (
                            <span
                              key={i}
                              className={cn(
                                "h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px]",
                                tag.variant === "star" ? "bg-red-500" : "bg-blue-600"
                              )}
                            >
                              {tag.variant === "star" ? "★" : "✓"}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {contact.fullName ? (
                      <span className="text-primary font-medium">{contact.fullName}</span>
                    ) : (
                      <EditableCell value="" />
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="text-primary">{contact.whatsappNumber}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <EditableCell value={contact.marketingBudget} />
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <EditableCell value={contact.marketingGoal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-t">
          <div className="flex items-center gap-1 overflow-x-auto">
            <Button variant="outline" size="sm" disabled className="shrink-0">
              Previous
            </Button>
            <Button size="sm" className="h-8 w-8 p-0 shrink-0 bg-blue-900 hover:bg-blue-950">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
              3
            </Button>
            <span className="text-muted-foreground px-1 shrink-0">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
              64
            </Button>
            <Button variant="outline" size="sm" className="shrink-0">
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground whitespace-nowrap">Jump to page:</span>
            <Input className="h-8 w-14 text-sm" defaultValue="1" />
          </div>
        </div>
      </div>
    </div>
  );
}