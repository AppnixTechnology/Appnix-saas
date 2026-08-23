"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Plug,
  ArrowLeft,
  Copy,
  Plus,
  CheckCircle2,
  ChevronRight,
  Key,
  Webhook,
  MessageSquare,
  Camera,
  ScanLine,
  Smartphone,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  category: "Messaging Channel" | "Developer API" | "Authentication";
  description: string;
  icon: React.ElementType;
  status: "Connected" | "Configured" | "Available";
  lastSync?: string;
}

const integrations: IntegrationItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Official Cloud API",
    category: "Messaging Channel",
    description: "Enterprise direct BSP connection with Meta Graph API for template messages and chatbots.",
    icon: MessageSquare,
    status: "Connected",
    lastSync: "Synced 2 mins ago",
  },
  {
    id: "instagram",
    name: "Instagram Direct Graph API",
    category: "Messaging Channel",
    description: "Receive direct messages, story mentions, and automated DM campaign flows.",
    icon: Camera,
    status: "Connected",
    lastSync: "Synced 15 mins ago",
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    category: "Messaging Channel",
    description: "Connect Facebook brand pages for omnichannel live chat and automated triage.",
    icon: ScanLine,
    status: "Connected",
    lastSync: "Synced 1 hour ago",
  },
  {
    id: "rcs",
    name: "Google RCS Business Messaging",
    category: "Messaging Channel",
    description: "Verified agent with rich cards, suggestion chips, and OTP fallback routing.",
    icon: Smartphone,
    status: "Connected",
    lastSync: "Synced today",
  },
  {
    id: "webhooks",
    name: "Real-time Event Webhooks",
    category: "Developer API",
    description: "Trigger external HTTP endpoints on new inbound messages, campaign completions, and ticket updates.",
    icon: Webhook,
    status: "Configured",
    lastSync: "3 active subscriptions",
  },
  {
    id: "google-auth",
    name: "Google OAuth 2.0 / SSO",
    category: "Authentication",
    description: "Single sign-on for team members and workspace access delegation.",
    icon: Key,
    status: "Configured",
    lastSync: "Active",
  },
];

export default function IntegrationsSettingsPage() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const mockKey = "appnix_live_sk_894f29e18a209b4c810d2938";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Settings</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-primary">Integrations</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Plug className="h-6 w-6 text-primary" />
          Connected Integrations & API Keys
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage omnichannel messaging gateways, developer REST API tokens, and webhook endpoints.
        </p>
      </div>

      <div className="space-y-6">
        {/* API Credentials Card */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">REST API Secret Token</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("New API Token Generated")}
              className="text-xs"
            >
              Roll Secret Key
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Include this token in the <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">Authorization: Bearer &lt;TOKEN&gt;</code> header to invoke Appnix REST APIs.
          </p>

          <div className="flex items-center gap-2 max-w-xl">
            <Input
              type={apiKeyVisible ? "text" : "password"}
              value={mockKey}
              readOnly
              className="font-mono text-xs bg-muted/30"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="shrink-0"
            >
              {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

        {/* Channels & Integrations Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Supported Channel Integrations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                          <span className="text-[10px] text-muted-foreground">{item.category}</span>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-semibold",
                          item.status === "Connected" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                          item.status === "Configured" && "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 text-xs">
                    <span className="text-[11px] text-muted-foreground">{item.lastSync}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`Configuring ${item.name}`)}
                      className="text-xs text-primary font-semibold hover:bg-primary/10 gap-1 h-7"
                    >
                      Configure
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
