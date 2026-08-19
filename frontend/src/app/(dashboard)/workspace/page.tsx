"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Camera,
  ShieldCheck,
  Pencil,
  Copy,
  Calendar,
  CheckCircle2,
  Plus,
  MessageSquare,
} from "lucide-react";

// ---------- Tabs ----------
const TABS = ["Personal Details", "API Details", "Beta Access"] as const;
type Tab = (typeof TABS)[number];

// ---------- Page ----------
export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Personal Details");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex items-center gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Personal Details" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Avatar card */}
            <div className="rounded-xl border bg-background p-6 text-center">
              <div className="relative mx-auto w-fit">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-4xl font-bold text-primary-foreground">
                  V
                </div>
                <button
                  type="button"
                  aria-label="Change photo"
                  className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">Video</h2>
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                USER
              </p>
            </div>

            {/* 2FA card */}
            <div className="space-y-3 rounded-xl border bg-background p-5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Two Factor Authentication
                </h3>
                <Badge className="rounded-md bg-green-600 px-1.5 py-0 text-[10px] font-bold hover:bg-green-600">
                  NEW
                </Badge>
              </div>
              <Button className="w-full justify-center gap-2 bg-primary">
                <ShieldCheck className="h-4 w-4" />
                Enable 2FA
              </Button>
            </div>

            {/* Security card */}
            <div className="space-y-4 rounded-xl border bg-background p-5">
              <h3 className="text-sm font-bold text-foreground">Security</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Old Password<span className="text-destructive">*</span>
                </label>
                <Input type="password" placeholder="Enter current password" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  New Password<span className="text-destructive">*</span>
                </label>
                <Input type="password" placeholder="Enter new password" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Confirm Password<span className="text-destructive">*</span>
                </label>
                <Input type="password" placeholder="Confirm new password" />
              </div>

              <Button className="w-full justify-center bg-primary font-semibold">
                Update Password
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* General Details */}
            <div className="rounded-xl border bg-background p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">
                  General Details
                </h3>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Info
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field label="First Name">
                  <Input defaultValue="Video" disabled />
                </Field>
                <Field label="Last Name">
                  <Input defaultValue="panel" disabled />
                </Field>

                <Field label="Language">
                  <Select defaultValue="english">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="City">
                  <Input placeholder="City" disabled />
                </Field>

                <Field label="State">
                  <Input placeholder="State" disabled />
                </Field>
                <Field label="Country">
                  <Select defaultValue="india">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Zip Code">
                  <Input placeholder="Enter zipcode" disabled />
                </Field>
              </div>
            </div>

            {/* Communication Details */}
            <div className="rounded-xl border bg-background p-6">
              <h3 className="text-base font-bold text-primary">
                Communication Details
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field label="Secondary Email Address">
                  <Input
                    defaultValue="snehacombot@gmail.com"
                    disabled
                    className="text-primary"
                  />
                </Field>

                <Field label="Primary Email Address">
                  <div className="relative">
                    <Input
                      defaultValue="videopanel@1automations.com"
                      disabled
                      className="pr-9 text-primary"
                    />
                    <button
                      type="button"
                      aria-label="Copy email"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </Field>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Joining Date
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      Mar 18th, 2026
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Personal Details" && (
        <div className="flex items-center justify-center rounded-xl border bg-background py-24 text-sm text-muted-foreground">
          {activeTab} content goes here.
        </div>
      )}

      {/* Floating actions */}
      <div className="fixed bottom-7 right-7 flex flex-col gap-3">
        <Button
          size="icon"
          className="h-11 w-11 rounded-full bg-green-600 shadow-lg hover:bg-green-700"
          aria-label="Add"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 rounded-full shadow-lg"
          aria-label="Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// ---------- Small helper ----------
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}