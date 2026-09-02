"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffMember } from "../../types";
import { X, ShieldCheck } from "lucide-react";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffAdded: (
    staff: Omit<StaffMember, "id" | "lastActive" | "createdAt">,
  ) => void;
}

export function AddStaffModal({
  isOpen,
  onClose,
  onStaffAdded,
}: AddStaffModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffMember["role"]>("Support Agent");
  const [status, setStatus] = useState<StaffMember["status"]>("Active");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onStaffAdded({
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      avatarUrl: `https://i.pravatar.cc/56?img=${Math.floor(1 + Math.random() * 65)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl animate-in">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Add Internal Staff Member
              </h2>
              <p className="text-xs text-muted-foreground">
                Grant platform administrator or operator access.
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
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Full Name *
            </label>
            <Input
              required
              placeholder="e.g. Jonathan Lee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Appnix Work Email *
            </label>
            <Input
              required
              type="email"
              placeholder="jonathan.lee@appnix.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffMember["role"])}
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Super Admin">Super Admin (Root)</option>
                <option value="Admin">Admin</option>
                <option value="Support Agent">Support Agent</option>
                <option value="Billing Manager">Billing Manager</option>
                <option value="Developer">Developer</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as StaffMember["status"])
                }
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
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
              Provision Staff Access
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
