"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "../../types";
import { X, Building2 } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: (
    client: Omit<Client, "id" | "mrr" | "totalUsers" | "lastActive">,
  ) => void;
}

export function AddClientModal({
  isOpen,
  onClose,
  onClientAdded,
}: AddClientModalProps) {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<Client["plan"]>("Pro");
  const [status, setStatus] = useState<Client["status"]>("Active");
  const [whatsappStatus, setWhatsappStatus] =
    useState<Client["whatsappStatus"]>("Connected");
  const [walletBalance, setWalletBalance] = useState("1000.00");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onClientAdded({
      name: name.trim(),
      ownerName: ownerName.trim() || "Account Admin",
      email: email.trim(),
      phone: phone.trim() || "+1 (555) 000-0000",
      plan,
      status,
      whatsappStatus,
      walletBalance: parseFloat(walletBalance) || 0,
      signupDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl animate-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Add New Client Organization
              </h2>
              <p className="text-xs text-muted-foreground">
                Provision a new tenant workspace and subscription.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Organization Name *
              </label>
              <Input
                required
                placeholder="e.g. Apex Global Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Owner / Contact Name *
              </label>
              <Input
                required
                placeholder="e.g. Robert Smith"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Work Email Address *
              </label>
              <Input
                required
                type="email"
                placeholder="admin@apexcorp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Plan Tier
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as Client["plan"])}
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Starter">Starter ($29/mo)</option>
                <option value="Growth">Growth ($99/mo)</option>
                <option value="Pro">Pro ($199/mo)</option>
                <option value="Enterprise">Enterprise ($299+/mo)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Client["status"])}
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                WhatsApp BSP
              </label>
              <select
                value={whatsappStatus}
                onChange={(e) =>
                  setWhatsappStatus(e.target.value as Client["whatsappStatus"])
                }
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Connected">Connected</option>
                <option value="Pending">Pending</option>
                <option value="Disconnected">Disconnected</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Initial Wallet Credit ($ USD)
            </label>
            <Input
              type="number"
              step="10"
              value={walletBalance}
              onChange={(e) => setWalletBalance(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Create Client
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
