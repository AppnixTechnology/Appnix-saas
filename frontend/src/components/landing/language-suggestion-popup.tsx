"use client";

import React from "react";
import { Globe, X, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSuggestionPopupProps {
  className?: string;
  variant?: "floating" | "mobile-banner";
}

export function LanguageSuggestionPopup({
  className,
  variant = "floating",
}: LanguageSuggestionPopupProps) {
  const {
    isSuggestionVisible,
    suggestedLanguageInfo,
    translations,
    acceptSuggestion,
    dismissSuggestion,
  } = useLanguage();

  if (!isSuggestionVisible || !suggestedLanguageInfo) {
    return null;
  }

  const nativeName = suggestedLanguageInfo.nativeName;

  // Variant for mobile header / navbar drawer
  if (variant === "mobile-banner") {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-primary/20 bg-background/95 p-3 shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2",
          className
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              Appnix is available in <span className="text-primary font-bold">{nativeName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={dismissSuggestion}
            aria-label="Dismiss language suggestion"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={acceptSuggestion}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
          >
            <span>Switch to {nativeName}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={dismissSuggestion}
            className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Keep English
          </button>
        </div>
      </div>
    );
  }

  // Default Desktop Floating Card (attached near navbar language selector)
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "absolute right-0 top-full mt-2.5 w-80 rounded-xl border border-border/90 bg-popover/98 p-3.5 text-popover-foreground shadow-2xl ring-1 ring-black/5 backdrop-blur-md z-50",
        "transition-all duration-250 animate-in fade-in-0 slide-in-from-top-1",
        className
      )}
    >
      {/* Header with globe & close */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground leading-tight">
              Appnix is available in {nativeName}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              Prefer browsing in {nativeName}?
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissSuggestion}
          aria-label="Dismiss suggestion"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={acceptSuggestion}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
        >
          <span>Switch to {nativeName}</span>
          <ArrowRight className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={dismissSuggestion}
          className="inline-flex items-center justify-center rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Keep English
        </button>
      </div>
    </div>
  );
}
