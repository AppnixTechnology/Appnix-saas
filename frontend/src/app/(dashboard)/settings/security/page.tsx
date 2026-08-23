"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const initialSessions: Session[] = [
  {
    id: "s1",
    device: "Windows PC",
    browser: "Chrome 122.0",
    location: "Mumbai, India",
    ip: "103.21.124.89",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "s2",
    device: "iPhone 15 Pro",
    browser: "Mobile Safari 17.2",
    location: "Mumbai, India",
    ip: "103.21.124.91",
    lastActive: "3 hours ago",
    isCurrent: false,
  },
  {
    id: "s3",
    device: "MacBook Pro",
    browser: "Brave Browser 1.63",
    location: "Bengaluru, India",
    ip: "49.207.210.15",
    lastActive: "2 days ago",
    isCurrent: false,
  },
];

const loginHistory = [
  {
    id: "lh-1",
    date: "24 Feb 2026, 09:12 AM",
    device: "Chrome / Windows",
    ip: "103.21.124.89",
    location: "Mumbai, India",
    status: "Success",
  },
  {
    id: "lh-2",
    date: "23 Feb 2026, 08:30 PM",
    device: "Mobile Safari / iOS",
    ip: "103.21.124.91",
    location: "Mumbai, India",
    status: "Success",
  },
  {
    id: "lh-3",
    date: "22 Feb 2026, 11:45 AM",
    device: "Brave / macOS",
    ip: "49.207.210.15",
    location: "Bengaluru, India",
    status: "Success",
  },
  {
    id: "lh-4",
    date: "20 Feb 2026, 04:15 AM",
    device: "Firefox / Linux",
    ip: "185.220.101.5",
    location: "Frankfurt, Germany",
    status: "Blocked (Suspicious)",
  },
];

export default function SecuritySettingsPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setPwSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const handleLogoutOtherDevices = () => {
    if (confirm("Are you sure you want to log out all other devices?")) {
      setSessions(sessions.filter((s) => s.isCurrent));
      alert("All other sessions terminated successfully.");
    }
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
        <span className="font-semibold text-primary">Security</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Security & Authentication
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage password credentials, two-factor authentication, active login sessions, and audit logs.
        </p>
      </div>

      <div className="space-y-6">
        {/* Two Factor Authentication Card */}
        <div className="rounded-xl border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-foreground">Two-Factor Authentication (2FA)</h2>
              <Badge className={twoFactorEnabled ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}>
                {twoFactorEnabled ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Protect your workspace by requiring an authenticator app (Google Authenticator, Authy, or 1Password) at sign-in.
            </p>
          </div>

          <Button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            variant={twoFactorEnabled ? "outline" : "default"}
            className="text-xs shrink-0"
          >
            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA Protection"}
          </Button>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Change Password</h2>
            </div>
            {pwSuccess && (
              <Badge className="bg-emerald-600 text-white gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" /> Password Updated!
              </Badge>
            )}
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Current Password *
              </label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 text-xs"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                New Password *
              </label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 text-xs"
                placeholder="Enter new password (min. 8 characters)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Confirm New Password *
              </label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 text-xs"
                placeholder="Confirm new password"
              />
            </div>

            <Button type="submit" className="bg-primary text-primary-foreground text-xs font-semibold">
              Update Password
            </Button>
          </form>
        </div>

        {/* Active Sessions */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Sessions</h2>
              <p className="text-xs text-muted-foreground">
                Devices currently logged into this workspace account.
              </p>
            </div>

            {sessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogoutOtherDevices}
                className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout Other Devices
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {sess.device.includes("Phone") ? (
                      <Smartphone className="h-4.5 w-4.5" />
                    ) : (
                      <Laptop className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {sess.device} — {sess.browser}
                      </span>
                      {sess.isCurrent && (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          THIS DEVICE
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {sess.location} • IP: {sess.ip}
                    </p>
                  </div>
                </div>

                <span className="text-muted-foreground font-medium text-[11px]">
                  {sess.lastActive}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-foreground">Recent Login History</h2>
            <p className="text-xs text-muted-foreground">
              Recent authentication events for security auditing.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="p-3 text-left">Date & Time</th>
                  <th className="p-3 text-left">Device / Browser</th>
                  <th className="p-3 text-left">IP Address</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 text-xs">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{item.date}</td>
                    <td className="p-3 font-medium text-foreground">{item.device}</td>
                    <td className="p-3 font-mono text-muted-foreground">{item.ip}</td>
                    <td className="p-3 text-muted-foreground">{item.location}</td>
                    <td className="p-3 text-right">
                      <Badge
                        variant="secondary"
                        className={
                          item.status === "Success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
