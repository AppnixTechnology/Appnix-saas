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
import { useAuth } from "@/lib/auth/auth-context";
import {
  User,
  Camera,
  Mail,
  Phone,
  Building,
  Globe,
  Save,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "Video Panel");
  const [email, setEmail] = useState(user?.email || "videopanel@1automations.com");
  const [phone, setPhone] = useState("+91 80627 65557");
  const [role] = useState("Workspace Owner");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [bio, setBio] = useState("Workspace Administrator and Lead Architect at Appnix.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Settings</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">Profile</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal profile information, contact details, and account preferences.
          </p>
        </div>

        {savedSuccess && (
          <Badge className="bg-emerald-600 text-white gap-1 py-1.5 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Changes Saved Successfully!
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Role Card */}
        <div className="rounded-xl border bg-card p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-extrabold text-primary-foreground shadow-sm">
              {fullName.charAt(0)}
            </div>
            <button
              type="button"
              onClick={() => alert("Select a new profile image")}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
              title="Upload new photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-foreground">{fullName}</h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs">
                {role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{email}</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center justify-center sm:justify-start gap-1 pt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Account Verified & Secure
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Full Name *
              </label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8.5 h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Phone Number (WhatsApp Verified)
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-8.5 h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Interface Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English (US)</SelectItem>
                  <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="spanish">Spanish (Español)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-muted-foreground">
              Bio / About
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground gap-1.5 shadow-sm text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
