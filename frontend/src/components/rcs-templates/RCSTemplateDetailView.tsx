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
  Calendar,
  MapPin,
  Layers,
  Sparkles,
  ShieldCheck,
  Eye,
  Radio,
  Smartphone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RCSTemplate } from "@/types/rcs-template";
import {
  RCS_CATEGORY_CONFIG,
  getStoredRCSTemplates,
  saveStoredRCSTemplates,
} from "@/lib/rcs-templates";
import { RCSPhonePreview } from "./RCSPhonePreview";
import { RCSRejectionModal } from "./RCSRejectionModal";
import { RCSSubmitApprovalModal } from "./RCSSubmitApprovalModal";
import { RCSApprovedModal } from "./RCSApprovedModal";
import { cn } from "@/lib/utils";

interface RCSTemplateDetailViewProps {
  template: RCSTemplate;
}

export function RCSTemplateDetailView({ template: initialTemplate }: RCSTemplateDetailViewProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<RCSTemplate>(initialTemplate);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);

  const categoryInfo = RCS_CATEGORY_CONFIG[template.category];

  const handleDuplicate = () => {
    const copy: RCSTemplate = {
      ...template,
      id: `rcs-tpl-${Date.now()}`,
      name: `${template.name}_copy`,
      status: "DRAFT",
      rcsTemplateId: undefined,
      carrierApprovals: undefined,
      rejectionReason: undefined,
      rejectionDetails: undefined,
      submittedAt: undefined,
      approvedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = getStoredRCSTemplates();
    const updated = [copy, ...existing];
    saveStoredRCSTemplates(updated);
    router.push(`/channels/rcs/templates/${copy.id}`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this RCS template?")) {
      const existing = getStoredRCSTemplates();
      const updated = existing.filter((t) => t.id !== template.id);
      saveStoredRCSTemplates(updated);
      router.push("/channels/rcs/templates");
    }
  };

  const handleConfirmSubmit = async () => {
    const rcsId = `rcs_tpl_${Math.floor(100000 + Math.random() * 900000)}`;
    const updated: RCSTemplate = {
      ...template,
      status: "PENDING",
      rcsTemplateId: rcsId,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      carrierApprovals: [
        { carrier: "Google Jibe", status: "APPROVED", reviewedAt: new Date().toISOString() },
        { carrier: "Jio", status: "PENDING" },
        { carrier: "Airtel", status: "PENDING" },
        { carrier: "Vodafone Idea", status: "PENDING" },
      ],
    };

    const existing = getStoredRCSTemplates();
    const updatedList = existing.map((t) => (t.id === template.id ? updated : t));
    saveStoredRCSTemplates(updatedList);
    setTemplate(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/channels" className="hover:text-foreground transition-colors">
          Channels
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <Link href="/channels/rcs" className="hover:text-foreground transition-colors">
          RCS
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <Link href="/channels/rcs/templates" className="hover:text-foreground transition-colors">
          Templates
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="text-foreground font-mono font-medium">{template.name}</span>
      </div>

      {/* Header & Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {template.name}
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold px-2.5 py-0.5",
                template.status === "APPROVED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                  : template.status === "PENDING"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                  : template.status === "REJECTED"
                  ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {template.status === "APPROVED" ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 inline" />
              ) : template.status === "PENDING" ? (
                <Clock className="h-3.5 w-3.5 mr-1 inline" />
              ) : template.status === "REJECTED" ? (
                <XCircle className="h-3.5 w-3.5 mr-1 inline" />
              ) : (
                <FileText className="h-3.5 w-3.5 mr-1 inline" />
              )}
              {template.status}
            </Badge>

            <Badge variant="secondary" className="text-xs">
              {template.messageType}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", categoryInfo.badgeStyle)}>
              {template.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Linked Agent: <span className="font-semibold text-foreground">{template.agentName}</span>
            {template.rcsTemplateId && (
              <> • Carrier Reference ID: <span className="font-mono text-foreground font-semibold">{template.rcsTemplateId}</span></>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {template.status === "APPROVED" && (
            <Button
              size="sm"
              onClick={() => setIsApprovedModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Launch Campaign</span>
            </Button>
          )}

          {template.status === "REJECTED" && (
            <Button
              size="sm"
              onClick={() => setIsRejectionModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
            >
              <AlertCircle className="h-4 w-4" />
              <span>View Rejection Reason</span>
            </Button>
          )}

          {template.status === "DRAFT" && (
            <Button
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <Radio className="h-4 w-4" />
              <span>Submit for Verification</span>
            </Button>
          )}

          {(template.status === "DRAFT" || template.status === "REJECTED") && (
            <Link href={`/channels/rcs/templates/${template.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </Link>
          )}

          <Button variant="outline" size="sm" onClick={handleDuplicate} className="gap-1.5">
            <Copy className="h-4 w-4" />
            <span>Duplicate</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Details & Specifications (Left) | Live Phone Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Carrier Verification Status Breakdown */}
          <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Radio className="h-5 w-5 text-indigo-600" /> Carrier Registry Verification
              </h3>
              <Badge variant="outline" className="text-xs">
                TRAI & GSMA Universal Profile
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(template.carrierApprovals || [
                { carrier: "Google Jibe", status: template.status === "APPROVED" ? "APPROVED" : "PENDING", notes: "GSMA Universal Profile verified", reviewedAt: template.updatedAt },
                { carrier: "Jio", status: template.status === "APPROVED" ? "APPROVED" : "PENDING", notes: "DLT Sender registered", reviewedAt: template.updatedAt },
                { carrier: "Airtel", status: template.status === "APPROVED" ? "APPROVED" : "PENDING", notes: "Commercial route whitelisted", reviewedAt: template.updatedAt },
                { carrier: "Vodafone Idea", status: template.status === "APPROVED" ? "APPROVED" : "PENDING", notes: "Brand tag verified", reviewedAt: template.updatedAt },
              ] as import("@/types/rcs-template").CarrierApproval[]).map((ca, idx) => (
                <div key={idx} className="p-3 rounded-xl border bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{ca.carrier}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        ca.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ca.status === "REJECTED"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {ca.status}
                    </Badge>
                  </div>
                  {ca.notes && (
                    <p className="text-[11px] text-muted-foreground">{ca.notes}</p>
                  )}
                  {ca.reviewedAt && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Timestamp: {new Date(ca.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Variables Table */}
          <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Dynamic CRM Variables ({template.variables.length})
              </h3>
            </div>

            {template.variables.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No dynamic placeholders configured. This is a static message template.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Token</th>
                      <th className="px-3 py-2">Variable Name</th>
                      <th className="px-3 py-2">CRM Data Source</th>
                      <th className="px-3 py-2">Sample Verification Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {template.variables.map((v) => (
                      <tr key={v.index}>
                        <td className="px-3 py-2.5 font-mono font-bold text-indigo-600">
                          {`{{${v.index}}}`}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-foreground">{v.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground font-mono text-[11px]">
                          {v.dataSource}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-foreground">{v.sampleValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Content Breakdown Details */}
          <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 border-b pb-3">
              <Smartphone className="h-5 w-5 text-indigo-600" /> Structure & Action Buttons
            </h3>

            {template.messageType === "TEXT" && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">Message Text Body</span>
                  <div className="p-3.5 rounded-xl bg-muted/30 border font-mono whitespace-pre-wrap leading-relaxed text-foreground">
                    {template.textBody}
                  </div>
                </div>

                {template.standaloneActions && template.standaloneActions.length > 0 && (
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1.5">
                      Suggested Action Chips ({template.standaloneActions.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {template.standaloneActions.map((act, i) => (
                        <div key={i} className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                          <p className="font-semibold text-foreground">{act.text}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            Type: {act.type} • Postback: {act.postback || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {template.messageType === "RICH_CARD" && template.card && (
              <div className="space-y-3 text-xs">
                {template.card.title && (
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Card Title</span>
                    <p className="font-bold text-foreground text-sm">{template.card.title}</p>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">Card Description</span>
                  <div className="p-3.5 rounded-xl bg-muted/30 border whitespace-pre-wrap leading-relaxed text-foreground">
                    {template.card.description}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-muted-foreground block mb-1.5">
                    Card Action Buttons ({template.card.actions.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {template.card.actions.map((act, i) => (
                      <div key={i} className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{act.text}</span>
                          <Badge variant="outline" className="text-[9px]">{act.type}</Badge>
                        </p>
                        {act.url && <p className="text-[10px] text-muted-foreground truncate">{act.url}</p>}
                        {act.phoneNumber && <p className="text-[10px] text-muted-foreground">{act.phoneNumber}</p>}
                        {act.calendarTitle && <p className="text-[10px] text-muted-foreground">{act.calendarTitle}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {template.messageType === "CAROUSEL" && template.cards && (
              <div className="space-y-4 text-xs">
                <span className="font-semibold text-muted-foreground block">
                  Carousel Cards Deck ({template.cards.length} cards)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {template.cards.map((card, cIdx) => (
                    <div key={card.id} className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          Card {cIdx + 1} of {template.cards?.length}
                        </Badge>
                        {card.media?.ratio && (
                          <span className="text-[10px] text-muted-foreground font-mono">{card.media.ratio}</span>
                        )}
                      </div>
                      {card.title && <p className="font-bold text-foreground">{card.title}</p>}
                      <p className="text-muted-foreground line-clamp-2">{card.description}</p>
                      <div className="pt-1 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{card.actions.length} action buttons</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Simulator Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-indigo-600" />
              Live Android Device Simulator
            </span>
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
              Interactive
            </Badge>
          </div>

          <RCSPhonePreview template={template} />
        </div>
      </div>

      {/* Rejection Modal */}
      <RCSRejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        template={template}
      />

      {/* Approved Modal */}
      <RCSApprovedModal
        isOpen={isApprovedModalOpen}
        onClose={() => setIsApprovedModalOpen(false)}
        template={template}
        onDuplicate={handleDuplicate}
      />

      {/* Carrier Submit Modal */}
      <RCSSubmitApprovalModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        template={template}
      />
    </div>
  );
}
