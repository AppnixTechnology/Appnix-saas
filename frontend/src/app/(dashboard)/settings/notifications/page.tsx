"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  ArrowLeft,
  Mail,
  MessageSquare,
  Send,
  Headset,
  Save,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function NotificationSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification States
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailSecurity, setEmailSecurity] = useState(true);
  const [emailCampaignSummary, setEmailCampaignSummary] = useState(true);

  const [inAppSound, setInAppSound] = useState(true);
  const [inAppNewChat, setInAppNewChat] = useState(true);
  const [inAppMentions, setInAppMentions] = useState(true);

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [whatsappHighPriority, setWhatsappHighPriority] = useState(true);

  const [campaignCompletion, setCampaignCompletion] = useState(true);
  const [campaignFailures, setCampaignFailures] = useState(true);

  const [ticketNewReply, setTicketNewReply] = useState(true);
  const [ticketStatusChange, setTicketStatusChange] = useState(true);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
        <span className="font-semibold text-primary">Notifications</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notification Preferences
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure how and when you receive communication, campaign, and security alerts.
          </p>
        </div>

        {savedSuccess && (
          <Badge className="bg-emerald-600 text-white gap-1 py-1.5 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Preferences Saved!
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Email Notifications</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Weekly Digest & Analytics</p>
                <p className="text-[11px] text-muted-foreground">
                  Summary of messaging reach, bot interactions, and resolution times.
                </p>
              </div>
              <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Security & Login Alerts</p>
                <p className="text-[11px] text-muted-foreground">
                  Immediate alerts when new devices sign in or API keys are created.
                </p>
              </div>
              <Switch checked={emailSecurity} onCheckedChange={setEmailSecurity} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Campaign Delivery Reports</p>
                <p className="text-[11px] text-muted-foreground">
                  Automated CSV reports upon broadcast campaign completion.
                </p>
              </div>
              <Switch checked={emailCampaignSummary} onCheckedChange={setEmailCampaignSummary} />
            </div>
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">In-App Alerts & Sound</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Audio Chime on Incoming Messages</p>
                <p className="text-[11px] text-muted-foreground">
                  Play subtle chime when customers send messages in Live Chat.
                </p>
              </div>
              <Switch checked={inAppSound} onCheckedChange={setInAppSound} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Real-time Desk Popups</p>
                <p className="text-[11px] text-muted-foreground">
                  Show floating desktop badge for unassigned customer inquiries.
                </p>
              </div>
              <Switch checked={inAppNewChat} onCheckedChange={setInAppNewChat} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Team Member Mentions</p>
                <p className="text-[11px] text-muted-foreground">
                  Notify when a teammate tags you in a ticket note or workflow.
                </p>
              </div>
              <Switch checked={inAppMentions} onCheckedChange={setInAppMentions} />
            </div>
          </div>
        </div>

        {/* WhatsApp & Urgent Notifications */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-foreground">WhatsApp Instant Alerts</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">WhatsApp Urgent Pager</p>
                <p className="text-[11px] text-muted-foreground">
                  Receive WhatsApp alert for urgent SLA escalations and quota exhaustion.
                </p>
              </div>
              <Switch checked={whatsappAlerts} onCheckedChange={setWhatsappAlerts} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Channel Disconnection Warning</p>
                <p className="text-[11px] text-muted-foreground">
                  Alert if Meta / WhatsApp access token requires re-authentication.
                </p>
              </div>
              <Switch checked={whatsappHighPriority} onCheckedChange={setWhatsappHighPriority} />
            </div>
          </div>
        </div>

        {/* Support & Campaign Notifications */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Headset className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">Support & Campaign Updates</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Support Ticket Replies</p>
                <p className="text-[11px] text-muted-foreground">
                  Notify when a support specialist responds to your ticket.
                </p>
              </div>
              <Switch checked={ticketNewReply} onCheckedChange={setTicketNewReply} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Campaign Dispatch Complete</p>
                <p className="text-[11px] text-muted-foreground">
                  Notify when bulk campaigns finish broadcasting.
                </p>
              </div>
              <Switch checked={campaignCompletion} onCheckedChange={setCampaignCompletion} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground gap-1.5 shadow-sm text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
