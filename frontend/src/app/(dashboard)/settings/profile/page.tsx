"use client";

import { useState } from "react";
import Link from "next/link";
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
import { useLanguage, SupportedLanguageCode } from "@/lib/i18n";
import {
  User,
  ArrowLeft,
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
  Calendar,
  Key,
  Shield,
  Clock,
  Sparkles,
  Smartphone,
  MapPin,
  Briefcase,
  Layers,
  RotateCcw,
  Users,
  Copy,
  Check,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { currentLanguage, setLanguage: setGlobalLanguage, supportedLanguages } = useLanguage();
  const [fullName, setFullName] = useState(user?.name || "Harshit Admin");
  const [email, setEmail] = useState(user?.email || "harshit@appnix.io");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [title, setTitle] = useState("Lead Solutions Architect & Founder");
  const [department, setDepartment] = useState("Engineering & Product");
  const [company, setCompany] = useState("Appnix Technologies");
  const [location, setLocation] = useState("Mumbai, India");
  const [role] = useState("Workspace Owner");
  const [language, setLanguage] = useState<SupportedLanguageCode>(currentLanguage);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("INR");
  const [bio, setBio] = useState("Founder and Lead Architect at Appnix SaaS. Managing omnichannel bot flows, CRM pipelines, and multi-tenant cloud automation.");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalLanguage(language);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setFullName(user?.name || "Harshit Admin");
    setEmail(user?.email || "harshit@appnix.io");
    setPhone("+91 98765 43210");
    setTitle("Lead Solutions Architect & Founder");
    setDepartment("Engineering & Product");
    setCompany("Appnix Technologies");
    setLocation("Mumbai, India");
    setLanguage("en");
    setTimezone("Asia/Kolkata");
    setDateFormat("DD/MM/YYYY");
    setCurrency("INR");
    setBio("Founder and Lead Architect at Appnix SaaS. Managing omnichannel bot flows, CRM pipelines, and multi-tenant cloud automation.");
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
        <span className="font-semibold text-primary">Profile</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Profile & Account Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal profile, credentials, contact channels, and localization preferences across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white gap-1.5 py-1.5 px-3 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Changes Saved Successfully!
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Full-width 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          
          {/* ================= LEFT COLUMN: IDENTITY & STATS (4 cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="rounded-xl border bg-card p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-b" />
              
              <div className="relative pt-6 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-4xl font-extrabold text-primary-foreground shadow-md ring-4 ring-background">
                    {fullName.charAt(0)}
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Select a new profile avatar image")}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md hover:opacity-90 cursor-pointer ring-2 ring-background transition-transform active:scale-95"
                    title="Upload new avatar"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1 mt-1">
                  <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                  <p className="text-xs font-medium text-muted-foreground">{title}</p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-xs px-2.5 py-0.5">
                    {role}
                  </Badge>
                  <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-500/30 font-medium">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Active
                  </Badge>
                </div>

                <div className="w-full border-t mt-5 pt-4 space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground truncate max-w-[150px]">{email}</span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy email"
                      >
                        {emailCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </span>
                    <span className="font-semibold text-foreground">{phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" /> Company
                    </span>
                    <span className="font-semibold text-foreground">{company}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Location
                    </span>
                    <span className="font-semibold text-foreground">{location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Access Summary Card */}
            <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-foreground">Security Status</h3>
                </div>
                <Badge className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/10 text-[10px] font-bold">
                  HIGH PROTECTION
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-primary" /> Two-Factor Auth
                  </span>
                  <span className="font-semibold text-emerald-600">Enabled (TOTP)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Password Last Changed
                  </span>
                  <span className="font-medium text-foreground">14 days ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Member Since
                  </span>
                  <span className="font-medium text-foreground">15 Jan, 2026</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs gap-1.5 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                >
                  <Link href="/settings/security">
                    <Lock className="h-3.5 w-3.5" />
                    Configure Security & Password
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quick Shortcuts
              </h3>
              <div className="space-y-1.5">
                <Link
                  href="/department/roles"
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Manage Team Members
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                <Link
                  href="/workspace/billing"
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Subscription & Billing
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                <Link
                  href="/settings/notifications"
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Alerts & Notifications
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EDITABLE DETAILS & REGION (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Profile Information */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Personal & Professional Details
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your contact details, designation, and public team biography.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-xs"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
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
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Phone Number (WhatsApp Verified)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-8.5 h-9 text-xs"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Job Title / Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-8.5 h-9 text-xs"
                      placeholder="e.g. Senior Product Manager"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Department / Team
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="pl-8.5 h-9 text-xs"
                      placeholder="e.g. Engineering & Product"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="pl-8.5 h-9 text-xs"
                      placeholder="e.g. Appnix Technologies"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-foreground">
                  Public Bio / About
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio visible to your team and collaborators..."
                  className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Localization & Regional Preferences */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
              <div className="border-b pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Regional & Localization Preferences
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize your language, timezone, and calendar formats for automated reports.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Interface Language
                  </label>
                  <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguageCode)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                      <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                      <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                      <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                      <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Default Timezone
                  </label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST, UTC+05:30)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST, UTC+04:00)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT, UTC+00:00)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST, UTC-05:00)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles (PST, UTC-08:00)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (SGT, UTC+08:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Date Display Format
                  </label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (24/02/2026)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (02/24/2026)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-02-24)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Currency Display
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="AED">AED (د.إ) - UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Interface Language
              </label>
              <Select value={language} onValueChange={(val) => setLanguage(val as SupportedLanguageCode)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bottom Actions Bar */}
            <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Changes
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm text-xs font-semibold px-5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Profile Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
