"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WhatsAppTemplate } from "@/types/whatsapp-template";
import { getStoredTemplates } from "@/lib/whatsapp-templates";
import { TemplateForm } from "@/components/whatsapp-templates/TemplateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditWhatsAppTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [template, setTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const stored = getStoredTemplates();
    const found = stored.find((t) => t.id === id);
    setTemplate(found || null);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Template Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested message template does not exist or has been deleted.
        </p>
        <Link href="/channels/whatsapp/templates">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Templates</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <TemplateForm
      initialData={template}
      isEditMode={true}
      onSuccess={() => {
        router.push("/channels/whatsapp/templates");
      }}
    />
  );
}
