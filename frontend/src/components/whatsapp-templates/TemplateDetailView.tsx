"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Edit,
  Copy,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  CornerDownLeft,
  ShoppingBag,
  Layers,
  Sparkles,
  Calendar,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppTemplate } from "@/types/whatsapp-template";
import {
  CATEGORY_DETAILS,
  getStoredTemplates,
  saveStoredTemplates,
} from "@/lib/whatsapp-templates";
import { WhatsAppPhonePreview } from "./WhatsAppPhonePreview";
import { RejectionReasonModal } from "./RejectionReasonModal";
import { SubmitApprovalModal } from "./SubmitApprovalModal";
import { cn } from "@/lib/utils";

interface TemplateDetailViewProps {
  template: WhatsAppTemplate;
}

export function TemplateDetailView({ template: initialTemplate }: TemplateDetailViewProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<WhatsAppTemplate>(initialTemplate);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const categoryInfo = CATEGORY_DETAILS[template.category];

  const handleDuplicate = () => {
    const copy: WhatsAppTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      name: `${template.name}_copy`,
      status: "DRAFT",
      metaTemplateId: undefined,
      rejectionReason: undefined,
      rejectionDetails: undefined,
      submittedAt: undefined,
      approvedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = getStoredTemplates();
    const updated = [copy, ...existing];
    saveStoredTemplates(updated);
    router.push(`/channels/whatsapp/templates/${copy.id}`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this template?")) {
      const existing = getStoredTemplates();
      const updated = existing.filter((t) => t.id !== template.id);
      saveStoredTemplates(updated);
      router.push("/channels/whatsapp/templates");
    }
  };

  const handleConfirmSubmit = async () => {
    const metaId = `meta_tpl_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const updated: WhatsAppTemplate = {
      ...template,
      status: "PENDING",
      metaTemplateId: metaId,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = getStoredTemplates();
    const updatedList = existing.map((t) => (t.id === template.id ? updated : t));
    saveStoredTemplates(updatedList);
    setTemplate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link
            href="/channels/whatsapp"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>WhatsApp Channels</span>
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <Link
            href="/channels/whatsapp/templates"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Message Templates
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-mono font-medium">
            {template.name}
          </span>
        </div>

        {/* Header with Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {template.name}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2.5 py-0.5 font-semibold uppercase",
                  template.status === "APPROVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  template.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                  template.status === "REJECTED" && "bg-rose-50 text-rose-700 border-rose-200",
                  template.status === "DRAFT" && "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                {template.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              WhatsApp Cloud API Official Template • Language: {template.language}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(template.status === "DRAFT" || template.status === "REJECTED") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/channels/whatsapp/templates/${template.id}/edit`)
                }
                className="text-xs gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>{template.status === "REJECTED" ? "Edit & Resubmit" : "Edit Template"}</span>
              </Button>
            )}

            {template.status === "DRAFT" && (
              <Button
                size="sm"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit to Meta</span>
              </Button>
            )}

            {template.status === "APPROVED" && (
              <Button
                size="sm"
                onClick={() =>
                  router.push(`/campaigns/new?templateId=${template.id}&channel=WHATSAPP`)
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Use in Campaign</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="text-xs gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Duplicate</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Prominent Rejection Alert Box */}
      {template.status === "REJECTED" && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/80 dark:bg-rose-950/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-sm">
              <XCircle className="h-5 w-5 text-rose-600" />
              <span>Meta Rejection Notice</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRejectionModalOpen(true)}
              className="h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-100"
            >
              View Full Policy Breakdown
            </Button>
          </div>
          <p className="text-xs text-rose-900 dark:text-rose-100 leading-relaxed">
            {template.rejectionReason || "This template was rejected by Meta."}
          </p>
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Template Information (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border bg-card p-4 space-y-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2">
              Template Info
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Template Name</span>
                <span className="font-mono font-semibold text-foreground break-all">
                  {template.name}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Category</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] mt-0.5", categoryInfo?.badgeColor)}
                >
                  {template.category}
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Language</span>
                <span className="font-semibold text-foreground">{template.language}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Content Type</span>
                <span className="font-semibold text-foreground capitalize">
                  {template.contentType.toLowerCase()}
                </span>
              </div>

              {template.metaTemplateId && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">Meta Template ID</span>
                  <span className="font-mono text-emerald-600 font-semibold break-all">
                    {template.metaTemplateId}
                  </span>
                </div>
              )}

              <div>
                <span className="text-muted-foreground block text-[11px]">Created At</span>
                <span className="text-foreground">
                  {new Date(template.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Last Updated</span>
                <span className="text-foreground">
                  {new Date(template.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Template Content & Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border bg-card p-4 space-y-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2">
              Template Content
            </h3>

            {/* Header Content */}
            {template.header && template.header.type !== "NONE" && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Header ({template.header.type})
                </span>
                {template.header.type === "TEXT" && (
                  <p className="font-semibold text-foreground p-2 rounded bg-muted/30 border">
                    {template.header.text}
                  </p>
                )}
                {template.header.type === "IMAGE" && (
                  <div className="p-2 rounded bg-muted/30 border text-[11px] text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-foreground">Media URL:</span>
                    <span className="font-mono truncate">{template.header.mediaUrl}</span>
                  </div>
                )}
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                Message Body
              </span>
              <div className="rounded-lg border bg-muted/20 p-3 whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">
                {template.body}
              </div>
            </div>

            {/* Variables Mappings */}
            {template.variables && template.variables.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Variable Mappings ({template.variables.length})
                </span>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/30 text-muted-foreground border-b">
                        <th className="p-2 text-left">Variable</th>
                        <th className="p-2 text-left">Data Source</th>
                        <th className="p-2 text-left">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {template.variables.map((v) => (
                        <tr key={v.index}>
                          <td className="p-2 font-mono font-bold text-emerald-600">
                            {`{{${v.index}}}`}
                          </td>
                          <td className="p-2 text-foreground font-medium">{v.name}</td>
                          <td className="p-2 text-muted-foreground">{v.sampleValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Footer */}
            {template.footer && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Footer
                </span>
                <p className="text-muted-foreground p-2 rounded bg-muted/30 border text-[11px]">
                  {template.footer}
                </p>
              </div>
            )}

            {/* Buttons */}
            {template.buttons && template.buttons.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Buttons ({template.buttons.length})
                </span>
                <div className="space-y-1.5">
                  {template.buttons.map((btn, idx) => (
                    <div
                      key={btn.id || idx}
                      className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {btn.type === "URL" && <ExternalLink className="h-3.5 w-3.5 text-blue-600" />}
                        {btn.type === "PHONE_NUMBER" && <Phone className="h-3.5 w-3.5 text-emerald-600" />}
                        {btn.type === "QUICK_REPLY" && <CornerDownLeft className="h-3.5 w-3.5 text-purple-600" />}
                        <span>{btn.text}</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                        {btn.url || btn.phoneNumber || btn.payload}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Live Phone Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-6 self-start space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              WhatsApp Live Preview
            </h3>
          </div>
          <WhatsAppPhonePreview template={template} />
        </div>
      </div>

      {/* Modals */}
      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        template={template}
      />

      <SubmitApprovalModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        template={template}
      />
    </div>
  );
}
