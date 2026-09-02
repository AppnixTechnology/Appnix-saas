"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Client } from "@/super-admin/types";
import { clientService } from "@/super-admin/services";
import { AddClientModal } from "@/super-admin/components/clients/AddClientModal";
import {
  Building2,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Trash2,
  PauseCircle,
  PlayCircle,
  Eye,
} from "lucide-react";

export default function SuperAdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState<string>("All");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = () => {
    clientService.getAll().then(setClients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: Client["status"]) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    clientService.updateStatus(id, newStatus).then(() => {
      fetchClients();
    });
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete organization ${name}? This cannot be undone.`)) {
      clientService.delete(id).then(() => {
        fetchClients();
      });
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.plan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilterTab === "All") return true;
    if (activeFilterTab === "Active") return client.status === "Active";
    if (activeFilterTab === "Trial") return client.status === "Trial";
    if (activeFilterTab === "Suspended") return client.status === "Suspended";
    if (activeFilterTab === "Negative Balance") return client.walletBalance < 0;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Clients</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            <Building2 className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Clients
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage organizations, provision new tenant workspaces, and monitor subscription plans.
          </p>
        </div>

        <Button
          onClick={() => setIsAddClientOpen(true)}
          className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {["All", "Active", "Trial", "Suspended", "Negative Balance"].map((tab) => {
            const isSelected = activeFilterTab === tab;
            const count =
              tab === "All"
                ? clients.length
                : tab === "Negative Balance"
                ? clients.filter((c) => c.walletBalance < 0).length
                : clients.filter((c) => c.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilterTab(tab)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors",
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    isSelected ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search clients, owner, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 bg-background pl-8.5 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8.5 gap-1 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 text-left">Org Name</th>
                <th className="p-4 text-left">Plan</th>
                <th className="p-4 text-left">Client Status</th>
                <th className="p-4 text-left">WhatsApp Status</th>
                <th className="p-4 text-right">Wallet Balance</th>
                <th className="p-4 text-left">Signup Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">
                    No client organizations found matching your search.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isNegative = client.walletBalance < 0;
                  return (
                    <tr
                      key={client.id}
                      className="border-b text-xs transition-colors last:border-0 hover:bg-muted/30"
                    >
                      {/* Org Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <p className="cursor-pointer font-bold text-foreground hover:text-primary">
                              {client.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {client.ownerName} • {client.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold",
                            client.plan === "Enterprise" && "border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
                            client.plan === "Pro" && "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                            client.plan === "Growth" && "border-primary/30 bg-primary/10 text-primary",
                            client.plan === "Starter" && "border-slate-200 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          {client.plan}
                        </Badge>
                      </td>

                      {/* Client Status */}
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-bold",
                            client.status === "Active" && "bg-primary/10 text-primary",
                            client.status === "Trial" && "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                            client.status === "Suspended" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                            client.status === "Inactive" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {client.status}
                        </Badge>
                      </td>

                      {/* WhatsApp Status */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              client.whatsappStatus === "Connected" && "bg-primary",
                              client.whatsappStatus === "Pending" && "bg-amber-500",
                              client.whatsappStatus === "Disconnected" && "bg-slate-400"
                            )}
                          />
                          <span className="font-medium text-foreground">{client.whatsappStatus}</span>
                        </span>
                      </td>

                      {/* Wallet Balance */}
                      <td className="p-4 text-right">
                        <span
                          className={cn(
                            "font-mono font-bold",
                            isNegative ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                          )}
                        >
                          {isNegative ? `-$${Math.abs(client.walletBalance).toFixed(2)}` : `$${client.walletBalance.toFixed(2)}`}
                        </span>
                      </td>

                      {/* Signup Date */}
                      <td className="whitespace-nowrap p-4 text-muted-foreground">
                        {client.signupDate}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedClient(client)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="View Client Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleStatus(client.id, client.status)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={client.status === "Active" ? "Suspend Client" : "Activate Client"}
                          >
                            {client.status === "Active" ? (
                              <PauseCircle className="h-4 w-4 text-amber-600" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Client"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onClientAdded={(newClient) => {
          clientService.create(newClient).then(() => {
            fetchClients();
            alert(`Organization ${newClient.name} successfully created!`);
          });
        }}
      />

      {/* View Client Details Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="animate-in w-full max-w-lg space-y-4 rounded-2xl border bg-card p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedClient.name}</h3>
                  <p className="text-xs text-muted-foreground">ID: {selectedClient.id}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedClient(null)}>
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs xs:grid-cols-2">
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Account Owner</p>
                <p className="mt-0.5 font-bold text-foreground">{selectedClient.ownerName}</p>
                <p className="text-muted-foreground">{selectedClient.email}</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Subscription Plan</p>
                <p className="mt-0.5 font-bold text-foreground">{selectedClient.plan} Tier</p>
                <p className="font-semibold text-primary">${selectedClient.mrr}/mo MRR</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Wallet Balance</p>
                <p className={cn("mt-0.5 font-mono text-sm font-bold", selectedClient.walletBalance < 0 ? "text-rose-600" : "text-foreground")}>
                  ${selectedClient.walletBalance.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">WhatsApp Connectivity</p>
                <p className="mt-0.5 font-bold text-foreground">{selectedClient.whatsappStatus}</p>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center justify-end gap-2 border-t pt-3 sm:flex-row">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedClient(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
                onClick={() => alert(`Impersonating tenant session for ${selectedClient.name}...`)}
              >
                Login as Tenant →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}