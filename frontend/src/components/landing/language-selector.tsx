"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSelector({ className, compact = false }: LanguageSelectorProps) {
  const { currentLanguage, languageInfo, supportedLanguages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select language. Current language is ${languageInfo.name}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
          "text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/40 hover:border-border/80 bg-background/50 backdrop-blur-xs shadow-2xs",
          compact && "px-2 py-1 text-[11px]",
          isOpen && "bg-muted text-foreground border-border"
        )}
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
        <span className="font-medium tracking-tight">
          {languageInfo.nativeName}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-foreground"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported Languages"
          className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150 select-none"
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-1">
            Language / भाषा
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
