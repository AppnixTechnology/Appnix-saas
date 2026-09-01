"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  KeyRound, 
  Users, 
  Database, 
  FileText, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityPracticesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECURITY_CONTROLS = [
  {
    icon: Lock,
    title: "HTTPS Data Transmission",
    description: "All communication between client browsers, platform API endpoints, and upstream messaging APIs is encrypted in transit over HTTPS.",
  },
  {
    icon: Server,
    title: "Cryptographic Password Hashing",
    description: "User account credentials are saved using salted cryptographic hashing (bcrypt) and are never stored in plaintext.",
  },
  {
    icon: KeyRound,
    title: "Protected API Authentication",
    description: "Session access is authenticated via JSON Web Tokens (JWT) and protected authorization guards across all API routes.",
  },
  {
    icon: Users,
    title: "Role-Based Access Control (RBAC)",
    description: "Workspace permissions manage access levels across team members, administrators, and organization roles.",
  },
  {
    icon: Database,
    title: "Tenant-Aware Access Controls",
    description: "Multi-tenant data partitioning enforces organization-level isolation on database queries via Prisma ORM.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled Access to Customer Data",
    description: "Customer records, message logs, and contact lists are accessible only to authenticated users within the assigned workspace.",
  },
];

export function SecurityPracticesModal({
  isOpen,
  onOpenChange,
}: SecurityPracticesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1E5B] to-slate-900 px-6 py-5 text-white shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Security &amp; Data Practices</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Security &amp; Data Practices
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Appnix uses standard security and access-control practices to help protect customer accounts and data processed through the platform.
          </DialogDescription>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Security Controls Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Implemented Technical &amp; Access Controls
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {SECURITY_CONTROLS.map((control) => {
                const Icon = control.icon;
                return (
                  <div
                    key={control.title}
                    className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-1 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span>{control.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {control.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Handling Notice */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-1 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
              Data Handling Principle:
            </p>
            <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
              Appnix processes customer and platform data only as necessary to provide the requested services and according to our Privacy Policy.
            </p>
          </div>

          {/* Policy Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Related Compliance Documents
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/privacy-policy"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Read Privacy Policy
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/data-deletion"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Read Data Deletion Policy
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border/80 bg-muted/20 px-5 py-3.5 flex items-center justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
