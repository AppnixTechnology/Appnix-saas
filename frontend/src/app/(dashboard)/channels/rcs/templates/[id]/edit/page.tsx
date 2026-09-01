"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RCSTemplate } from "@/types/rcs-template";
import { getStoredRCSTemplates } from "@/lib/rcs-templates";
import { RCSTemplateForm } from "@/components/rcs-templates/RCSTemplateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditRCSTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [template, setTemplate] = useState<RCSTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const stored = getStoredRCSTemplates();
    const found = stored.find((t) => t.id === id);
    setTemplate(found || null);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Template Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested RCS message template does not exist or has been deleted.
        </p>
        <Link href="/channels/rcs/templates">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to RCS Templates</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <RCSTemplateForm
      initialData={template}
      isEditMode={true}
      onSuccess={() => {
        router.push("/channels/rcs/templates");
      }}
    />
  );
}
