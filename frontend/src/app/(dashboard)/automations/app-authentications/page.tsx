import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
        <Link
          href="/automations"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Automations</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="text-foreground font-medium">App Authentications</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">App Authentications</h1>
        <p className="text-sm text-muted-foreground mt-0.5">View and manage connected app credentials and authentications.</p>
      </div>
    </div>
  );
}