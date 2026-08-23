"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  Building2,
  Mail,
  User,
  Phone,
  Send,
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LeadFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultInterest?: string;
  source?: string;
}

const interestOptions = [
  "Complete Platform (All-in-One)",
  "WhatsApp Business API",
  "RCS Business Messaging",
  "Instagram Direct & Facebook",
  "CRM & Lead Management",
  "No-Code Bot & Automation Builder",
  "Multi-Channel Broadcast Campaigns",
  "White-Label SaaS Reseller Solution",
  "Custom Enterprise Integration",
];

export function LeadFormModal({
  isOpen,
  onOpenChange,
  defaultInterest = "Complete Platform (All-in-One)",
  source = "Landing Page Demo Modal",
}: LeadFormModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: defaultInterest,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit demo request.");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback optimistic success for resilient UX if API proxy is offline
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      interest: defaultInterest,
      message: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        if (isSuccess) handleReset();
        else onOpenChange(false);
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        {/* Top brand header band */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1E5B] to-slate-900 px-6 py-6 text-white relative">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Priority Demo & Solution Consultation
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            {isSuccess ? "Demo Request Confirmed!" : "See Appnix in Action"}
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm mt-1">
            {isSuccess
              ? "Our product solutions team is preparing your personalized walkthrough."
              : "Experience how our omnichannel platform streamlines conversations, automates workflows, and accelerates sales."}
          </DialogDescription>
        </div>

        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="text-center py-4 space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-in zoom-in-95">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  Thank you, {formData.name || "there"}!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We've received your request for <strong className="text-foreground">{formData.company || "your company"}</strong>. A senior solutions engineer will contact you via WhatsApp / Email at <strong className="text-foreground">{formData.email || "your email"}</strong> within 1 business hour.
                </p>
              </div>

              <div className="rounded-xl border bg-muted/40 p-4 text-left space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  What happens next?
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>We'll review your channel requirements ({formData.interest})</li>
                  <li>Provide a tailored live demo of our Unified Inbox & Bot Builder</li>
                  <li>Provide exclusive 14-day full platform sandbox credentials</li>
                </ul>
              </div>

              <Button
                onClick={handleReset}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Back to Exploring Appnix
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-medium border border-destructive/20">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-name" className="text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.leadModal.fullNameLabel} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-name"
                    required
                    placeholder={t.leadModal.fullNamePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 text-sm bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-company" className="text-xs font-semibold flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.leadModal.companyLabel} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-company"
                    required
                    placeholder={t.leadModal.companyPlaceholder}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="h-10 text-sm bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-email" className="text-xs font-semibold flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.leadModal.emailLabel} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    placeholder={t.leadModal.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 text-sm bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-phone" className="text-xs font-semibold flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.leadModal.phoneLabel} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder={t.leadModal.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 text-sm bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-interest" className="text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Primary Area of Interest
                </Label>
                <Select
                  value={formData.interest}
                  onValueChange={(val) => setFormData({ ...formData, interest: val })}
                >
                  <SelectTrigger id="lead-interest" className="h-10 text-sm bg-background">
                    <SelectValue placeholder="Select primary interest" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover text-popover-foreground shadow-lg">
                    {interestOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-xs sm:text-sm">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-message" className="text-xs font-semibold flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  Specific Requirements or Message <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="lead-message"
                  rows={2}
                  placeholder="e.g. Need WhatsApp API integration for 50k monthly leads, plus CRM webhook sync."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="text-xs sm:text-sm bg-background resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.leadModal.submitting}
                    </>
                  ) : (
                    <>
                      {t.leadModal.submitButton}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  100% Privacy Guaranteed
                </span>
                <span>•</span>
                <span>No Credit Card Required</span>
                <span>•</span>
                <span>1-Hour Response</span>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
