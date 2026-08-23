"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Filter,
  ArrowLeft,
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
  Search,
  X,
  Phone,
  Edit2,
  Check,
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
const initialStatCards = [
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

const initialContacts: Contact[] = [
  {
    id: "1",
    createdOn: "24 Feb 2026, 05:55 PM",
    tags: [],
    fullName: "Ankit Bansal",
    whatsappNumber: "919328612083",
    marketingBudget: "$12,000",
    marketingGoal: "Lead Generation",
  },
  {
    id: "2",
    createdOn: "21 Feb 2026, 10:34 AM",
    tags: [{ label: "VIP", variant: "vip" }],
    fullName: "Com.Bot Customer",
    whatsappNumber: "919054618623",
    marketingBudget: "$8,500",
    marketingGoal: "Conversion & Sales",
  },
  {
    id: "3",
    createdOn: "20 Feb 2026, 12:26 PM",
    tags: [],
    fullName: "Nourin Sodawala",
    whatsappNumber: "917048690369",
    marketingBudget: "$15,000",
    marketingGoal: "Customer Retention",
  },
  {
    id: "4",
    createdOn: "18 Feb 2026, 03:10 PM",
    tags: [
      { label: "star", variant: "star" },
      { label: "check", variant: "check" },
    ],
    fullName: "Rahul Verma",
    whatsappNumber: "919911234578",
    marketingBudget: "$5,000",
    marketingGoal: "Brand Awareness",
  },
  {
    id: "5",
    createdOn: "17 Feb 2026, 04:14 PM",
    tags: [{ label: "VIP", variant: "vip" }],
    fullName: "Sneha Patel",
    whatsappNumber: "9876543210",
    marketingBudget: "$20,000",
    marketingGoal: "Enterprise Outreach",
  },
];

export default function CrmContactsPage() {
  const [contactsList, setContactsList] = useState<Contact[]>(initialContacts);
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState("20");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: "fullName" | "marketingBudget" | "marketingGoal";
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  // New Contact Form State
  const [newContact, setNewContact] = useState({
    fullName: "",
    whatsappNumber: "",
    marketingBudget: "",
    marketingGoal: "",
    isVip: false,
  });

  const filteredContacts = contactsList.filter((contact) => {
    const matchesSearch =
      contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.whatsappNumber.includes(searchQuery) ||
      contact.marketingGoal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      !filterTag ||
      (filterTag === "vip" && contact.tags.some((t) => t.variant === "vip")) ||
      (filterTag === "star" && contact.tags.some((t) => t.variant === "star"));

    return matchesSearch && matchesTag;
  });

  const allSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selected.includes(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filteredContacts.map((c) => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setContactsList((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    setContactsList((prev) => prev.filter((c) => !selected.includes(c.id)));
    setSelected([]);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.whatsappNumber.trim()) return;

    const contactToAdd: Contact = {
      id: String(Date.now()),
      createdOn: "Just now",
      tags: newContact.isVip ? [{ label: "VIP", variant: "vip" }] : [],
      fullName: newContact.fullName.trim() || "Unnamed Contact",
      whatsappNumber: newContact.whatsappNumber.trim(),
      marketingBudget: newContact.marketingBudget.trim() || "$0",
      marketingGoal: newContact.marketingGoal.trim() || "General Inquiries",
    };

    setContactsList([contactToAdd, ...contactsList]);
    setNewContact({
      fullName: "",
      whatsappNumber: "",
      marketingBudget: "",
      marketingGoal: "",
      isVip: false,
    });
    setIsAddModalOpen(false);
  };

  const startInlineEdit = (
    id: string,
    field: "fullName" | "marketingBudget" | "marketingGoal",
    currentVal: string
  ) => {
    setEditingCell({ id, field });
    setEditValue(currentVal);
  };

  const saveInlineEdit = () => {
    if (!editingCell) return;
    setContactsList((prev) =>
      prev.map((c) => {
        if (c.id === editingCell.id) {
          return { ...c, [editingCell.field]: editValue };
        }
        return c;
      })
    );
    setEditingCell(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
          <Link
            href="/crm"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>CRM</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-primary font-medium">Contacts</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              CRM Contacts
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage leads, WhatsApp contacts, marketing budgets, and customer profiles.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:justify-end">
            <Button
              variant={filterTag ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTag(filterTag ? null : "vip")}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 sm:mr-1.5" />
              <span>{filterTag ? `Filter: ${filterTag.toUpperCase()}` : "Filters"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                const csvData =
                  "data:text/csv;charset=utf-8," +
                  ["Full Name,WhatsApp Number,Budget,Goal"]
                    .concat(
                      contactsList.map(
                        (c) =>
                          `"${c.fullName}","${c.whatsappNumber}","${c.marketingBudget}","${c.marketingGoal}"`
                      )
                    )
                    .join("\n");
                const encodedUri = encodeURI(csvData);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "crm_contacts.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-sm"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span>Add New Contact</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {initialStatCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <stat.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-0.5 text-foreground">{stat.value}</p>
            <p
              className={cn(
                "text-xs mt-1 flex items-center gap-1",
                stat.trend === "up" && "text-emerald-600 dark:text-emerald-400",
                stat.trend === "good" && "text-emerald-600 dark:text-emerald-400",
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

      {/* Table Container */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        {/* Table toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 border-b bg-muted/20">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-9 text-sm bg-background"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rows:</span>
              <Input
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="h-8 w-14 text-xs bg-background text-center"
              />
            </div>

            <span className="text-xs text-muted-foreground">
              Showing {filteredContacts.length} of {contactsList.length} contacts
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {selected.length > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                className="h-8 text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Selected ({selected.length})
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setContactsList(initialContacts);
                setSearchQuery("");
                setFilterTag(null);
                setSelected([]);
              }}
              title="Reset contacts"
              className="h-8 w-8 text-muted-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-3 w-10 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Action
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Created On
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Tags
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Full Name
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  WhatsApp Number
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Marketing Budget
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Marketing Goal
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No contacts match your query.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selected.includes(contact.id)}
                        onCheckedChange={() => toggleOne(contact.id)}
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const data = `Contact: ${contact.fullName}\nWhatsApp: ${contact.whatsappNumber}\nBudget: ${contact.marketingBudget}\nGoal: ${contact.marketingGoal}`;
                            navigator.clipboard.writeText(data);
                          }}
                          title="Copy details"
                          className="h-7 w-7 text-primary hover:bg-primary/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(contact.id)}
                          title="Delete contact"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                      {contact.createdOn}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {contact.tags.length === 0 ? (
                        <span className="text-xs text-muted-foreground/60 italic">
                          --No Tags--
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {contact.tags.map((tag, i) =>
                            tag.variant === "vip" ? (
                              <Badge
                                key={i}
                                className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold text-[11px] px-2 py-0.5 border-amber-200"
                              >
                                VIP
                              </Badge>
                            ) : (
                              <span
                                key={i}
                                className={cn(
                                  "h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs",
                                  tag.variant === "star"
                                    ? "bg-rose-500"
                                    : "bg-blue-600"
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
                      {editingCell?.id === contact.id &&
                      editingCell.field === "fullName" ? (
                        <div className="flex items-center gap-1">
                          <Input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveInlineEdit()}
                            className="h-7 text-xs w-36"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-600"
                            onClick={saveInlineEdit}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="group flex items-center gap-1.5 cursor-pointer"
                          onDoubleClick={() =>
                            startInlineEdit(contact.id, "fullName", contact.fullName)
                          }
                        >
                          <span className="text-primary font-medium">
                            {contact.fullName || "Double click to set name"}
                          </span>
                          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono text-xs text-foreground bg-muted/60 px-2 py-1 rounded">
                        {contact.whatsappNumber}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {editingCell?.id === contact.id &&
                      editingCell.field === "marketingBudget" ? (
                        <div className="flex items-center gap-1">
                          <Input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveInlineEdit()}
                            className="h-7 text-xs w-28"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-600"
                            onClick={saveInlineEdit}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="group flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                          onDoubleClick={() =>
                            startInlineEdit(
                              contact.id,
                              "marketingBudget",
                              contact.marketingBudget
                            )
                          }
                        >
                          <span>{contact.marketingBudget || "Double click to edit"}</span>
                          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {editingCell?.id === contact.id &&
                      editingCell.field === "marketingGoal" ? (
                        <div className="flex items-center gap-1">
                          <Input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveInlineEdit()}
                            className="h-7 text-xs w-36"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-600"
                            onClick={saveInlineEdit}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="group flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                          onDoubleClick={() =>
                            startInlineEdit(
                              contact.id,
                              "marketingGoal",
                              contact.marketingGoal
                            )
                          }
                        >
                          <span>{contact.marketingGoal || "Double click to edit"}</span>
                          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 border-t bg-muted/10">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Button variant="outline" size="sm" disabled className="h-8 text-xs shrink-0">
              Previous
            </Button>
            <Button
              size="sm"
              className="h-8 w-8 p-0 shrink-0 bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0 text-xs">
              3
            </Button>
            <span className="text-muted-foreground px-1 text-xs shrink-0">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0 text-xs">
              64
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Jump to page:</span>
            <Input className="h-7 w-12 text-xs text-center" defaultValue="1" />
          </div>
        </div>
      </div>

      {/* Add New Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-foreground">Add New CRM Contact</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Ramesh Kumar"
                  value={newContact.fullName}
                  onChange={(e) =>
                    setNewContact({ ...newContact, fullName: e.target.value })
                  }
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    placeholder="e.g. +91 9876543210"
                    value={newContact.whatsappNumber}
                    onChange={(e) =>
                      setNewContact({ ...newContact, whatsappNumber: e.target.value })
                    }
                    className="pl-8.5 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Marketing Budget
                  </label>
                  <Input
                    placeholder="e.g. $10,000"
                    value={newContact.marketingBudget}
                    onChange={(e) =>
                      setNewContact({ ...newContact, marketingBudget: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Marketing Goal
                  </label>
                  <Input
                    placeholder="e.g. Conversions"
                    value={newContact.marketingGoal}
                    onChange={(e) =>
                      setNewContact({ ...newContact, marketingGoal: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="vip-checkbox"
                  checked={newContact.isVip}
                  onCheckedChange={(checked) =>
                    setNewContact({ ...newContact, isVip: Boolean(checked) })
                  }
                />
                <label
                  htmlFor="vip-checkbox"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Mark as VIP Contact
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
