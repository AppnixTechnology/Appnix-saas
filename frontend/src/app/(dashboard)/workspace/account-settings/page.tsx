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
  ChevronRight,
  Key,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

// ---------- Tabs ----------
const TABS = ["Personal Details", "API Details", "Beta Access"] as const;
type Tab = (typeof TABS)[number];

// ---------- Page ----------
export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Personal Details");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const mockApiKey = "appnix_live_sk_948f29e18a209b4c810d";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Workspace</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">Account Settings</span>
      </nav>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex items-center gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors cursor-pointer",
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
            <div className="rounded-xl border bg-card p-6 text-center shadow-xs">
              <div className="relative mx-auto w-fit">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-4xl font-bold text-primary-foreground">
                  V
                </div>
                <button
                  type="button"
                  aria-label="Change photo"
                  onClick={() => alert("Upload new avatar")}
                  className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">Video Panel</h2>
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                WORKSPACE ADMIN
              </p>
            </div>

            {/* 2FA card */}
            <div className="space-y-3 rounded-xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Two Factor Authentication
                </h3>
                <Badge className="rounded-md bg-emerald-600 px-1.5 py-0 text-[10px] font-bold text-white hover:bg-emerald-600">
                  NEW
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Secure your workspace logins with an authenticator app.
              </p>
              <Button
                onClick={() => alert("2FA Setup Modal")}
                className="w-full justify-center gap-2 bg-primary text-primary-foreground"
              >
                <ShieldCheck className="h-4 w-4" />
                Enable 2FA
              </Button>
            </div>

            {/* Security card */}
            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-xs">
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

              <Button
                onClick={() => alert("Password updated successfully!")}
                className="w-full justify-center bg-primary text-primary-foreground font-semibold"
              >
                Update Password
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* General Details */}
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">
                  General Details
                </h3>
                <button
                  onClick={() => alert("Edit Info clicked")}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Info
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field label="First Name">
                  <Input defaultValue="Video" disabled />
                </Field>
                <Field label="Last Name">
                  <Input defaultValue="Panel" disabled />
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
                  <Input defaultValue="Mumbai" disabled />
                </Field>

                <Field label="State">
                  <Input defaultValue="Maharashtra" disabled />
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
                  <Input defaultValue="400001" disabled />
                </Field>
              </div>
            </div>

            {/* Communication Details */}
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <h3 className="text-base font-bold text-foreground">
                Communication Details
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field label="Secondary Email Address">
                  <Input
                    defaultValue="snehacombot@gmail.com"
                    disabled
                    className="text-foreground"
                  />
                </Field>

                <Field label="Primary Email Address">
                  <div className="relative">
                    <Input
                      defaultValue="videopanel@1automations.com"
                      disabled
                      className="pr-9 text-foreground"
                    />
                    <button
                      type="button"
                      aria-label="Copy email"
                      onClick={() => {
                        navigator.clipboard.writeText("videopanel@1automations.com");
                        alert("Email copied!");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </Field>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Joining Date
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      Mar 18th, 2026
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "API Details" && (
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">API Credentials & Webhooks</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Use your API secret keys to authenticate requests from your custom services and webhooks.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Production Secret API Key
            </label>
            <div className="flex items-center gap-2 max-w-lg">
              <Input
                type={showApiKey ? "text" : "password"}
                value={mockApiKey}
                readOnly
                className="font-mono text-xs bg-muted/30"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                className="shrink-0"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyKey}
                className="shrink-0 text-xs gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                {apiKeyCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/20 space-y-1 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Key className="h-4 w-4 text-primary" /> Webhook Endpoint
            </p>
            <p className="text-muted-foreground font-mono">
              https://api.appnix.io/v1/webhooks/workspace-production
            </p>
          </div>
        </div>
      )}

      {activeTab === "Beta Access" && (
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">Beta Feature Previews</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get early access to upcoming AI Voice Agents, Autonomous Multimodal Chatbots, and Advanced Workflow Datastores.
          </p>
          <div className="p-4 border rounded-lg bg-muted/20 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-foreground">Voice AI Agent Studio 2.0</p>
              <p className="text-xs text-muted-foreground">Ultra-low latency conversational voice streaming engine</p>
            </div>
            <Badge className="bg-emerald-600 text-white">Active in Beta</Badge>
          </div>
        </div>
      )}
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
