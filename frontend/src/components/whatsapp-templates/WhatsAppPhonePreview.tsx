"use client";

import { useState } from "react";
import {
  ExternalLink,
  Phone,
  CornerDownLeft,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  FileText,
  Play,
  CheckCheck,
  MoreVertical,
  Video,
  Info,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  WhatsAppTemplate,
  TemplateVariable,
  CarouselCard,
  CTAButton,
} from "@/types/whatsapp-template";
import {
  interpolateVariables,
  parseWhatsAppFormatting,
} from "@/lib/whatsapp-templates";
import { cn } from "@/lib/utils";

interface WhatsAppPhonePreviewProps {
  template: Partial<WhatsAppTemplate>;
  customSampleOverrides?: Record<string, string>;
  onUpdateSampleValue?: (index: number, value: string) => void;
  brandName?: string;
  className?: string;
}

export function WhatsAppPhonePreview({
  template,
  customSampleOverrides = {},
  onUpdateSampleValue,
  brandName = "Appnix Technologies",
  className,
}: WhatsAppPhonePreviewProps) {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [showSampleDrawer, setShowSampleDrawer] = useState(false);

  const variables: TemplateVariable[] = template.variables || [];
  const header = template.header || { type: "NONE" };
  const contentType = template.contentType || "TEXT";
  const body = template.body || "";
  const footer = template.footer || "";
  const buttons: CTAButton[] = template.buttons || [];
  const carouselCards: CarouselCard[] = template.carouselCards || [];
  const catalog = template.catalog;

  // Process header text with variables
  const processedHeaderText =
    header.type === "TEXT" && header.text
      ? interpolateVariables(header.text, variables, customSampleOverrides)
      : "";

  // Process body text with variables & formatting
  const interpolatedBody = interpolateVariables(
    body,
    variables,
    customSampleOverrides
  );
  const formattedBodyHtml = parseWhatsAppFormatting(interpolatedBody);

  const currentTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date());

  const handleNextCard = () => {
    if (carouselCards.length > 0) {
      setActiveCarouselIndex((prev) => (prev + 1) % carouselCards.length);
    }
  };

  const handlePrevCard = () => {
    if (carouselCards.length > 0) {
      setActiveCarouselIndex((prev) =>
        prev === 0 ? carouselCards.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Phone Mockup Frame */}
      <div className="w-[320px] sm:w-[350px] bg-slate-900 dark:bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 dark:border-slate-700 select-none relative transition-all">
        {/* Phone Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
        </div>

        {/* Screen Area */}
        <div className="rounded-[34px] overflow-hidden bg-[#0c1317] dark:bg-[#0c1317] flex flex-col h-[580px] border border-slate-800 text-slate-100 relative">
          {/* Status Bar */}
          <div className="h-7 bg-[#1f2c34] text-[11px] text-slate-300 flex items-center justify-between px-6 pt-1 shrink-0 font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 border border-slate-300 rounded-xs relative">
                <div className="h-full w-3/4 bg-slate-200" />
              </div>
            </div>
          </div>

          {/* WhatsApp Header Bar */}
          <div className="bg-[#1f2c34] px-3 py-2 flex items-center justify-between border-b border-[#2a3942] shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ChevronLeft className="h-5 w-5 text-slate-300 -ml-1 cursor-pointer" />
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs ring-1 ring-emerald-500">
                  {brandName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#1f2c34]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-xs text-slate-100 truncate">
                    {brandName}
                  </p>
                  {/* WhatsApp Official Green Check */}
                  <svg
                    className="h-3.5 w-3.5 text-emerald-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <p className="text-[10px] text-emerald-400 leading-none">
                  Official Business Account
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <Video className="h-4 w-4 opacity-70" />
              <Phone className="h-3.5 w-3.5 opacity-70" />
              <MoreVertical className="h-4 w-4 opacity-70" />
            </div>
          </div>

          {/* WhatsApp Chat Background Wallpaper */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3 relative flex flex-col justify-end"
            style={{
              backgroundColor: "#0b141a",
              backgroundImage: `radial-gradient(#1f2c34 0.75px, transparent 0.75px)`,
              backgroundSize: "12px 12px",
            }}
          >
            {/* Timestamp Badge */}
            <div className="flex justify-center my-1">
              <span className="bg-[#182229]/90 text-[10px] text-slate-400 px-2.5 py-0.5 rounded-md font-medium tracking-wide shadow-xs uppercase">
                Today
              </span>
            </div>

            {/* Security Notice */}
            <div className="bg-[#182229]/80 border border-[#2a3942]/60 rounded-lg p-2 text-center text-[10px] text-[#ffd279] max-w-[90%] mx-auto leading-tight shadow-xs">
              🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </div>

            {/* Main Message Bubble or Carousel */}
            {contentType === "CAROUSEL" && carouselCards.length > 0 ? (
              /* WhatsApp Carousel View */
              <div className="space-y-2 max-w-full">
                {/* Intro bubble if body text present */}
                {body && (
                  <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs p-3 shadow-md max-w-[92%] ml-auto text-xs leading-relaxed">
                    <div
                      dangerouslySetInnerHTML={{ __html: formattedBodyHtml }}
                    />
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200/70">
                      <span>{currentTime}</span>
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                  </div>
                )}

                {/* Carousel Horizontal Scroll Cards */}
                <div className="relative">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Card {activeCarouselIndex + 1} of {carouselCards.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handlePrevCard}
                        className="h-5 w-5 rounded-full bg-[#1f2c34] text-slate-200 hover:bg-[#2a3942] p-0"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleNextCard}
                        className="h-5 w-5 rounded-full bg-[#1f2c34] text-slate-200 hover:bg-[#2a3942] p-0"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Active Card Container */}
                  {(() => {
                    const card = carouselCards[activeCarouselIndex] || carouselCards[0];
                    if (!card) return null;
                    const cardBodyInterpolated = interpolateVariables(
                      card.body,
                      variables,
                      customSampleOverrides
                    );
                    const cardBodyFormatted = parseWhatsAppFormatting(
                      cardBodyInterpolated
                    );

                    return (
                      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-xl overflow-hidden shadow-lg transition-all">
                        {card.mediaUrl ? (
                          <div className="h-28 w-full relative bg-slate-800 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={card.mediaUrl}
                              alt="Card Media"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-full bg-gradient-to-r from-emerald-900/50 to-teal-900/50 flex items-center justify-center border-b border-[#2a3942]">
                            <ShoppingBag className="h-7 w-7 text-emerald-400/60" />
                          </div>
                        )}

                        <div className="p-3 space-y-1.5">
                          {card.header && (
                            <p className="font-semibold text-xs text-slate-100">
                              {card.header}
                            </p>
                          )}
                          <div
                            className="text-xs text-slate-300 leading-snug line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: cardBodyFormatted || card.body,
                            }}
                          />
                        </div>

                        {/* Card Buttons */}
                        {card.buttons && card.buttons.length > 0 && (
                          <div className="border-t border-[#2a3942] divide-y divide-[#2a3942]">
                            {card.buttons.map((btn, bidx) => (
                              <button
                                key={bidx}
                                type="button"
                                className="w-full py-2 px-3 text-center text-xs font-semibold text-cyan-400 hover:bg-[#2a3942]/60 flex items-center justify-center gap-1.5 transition-colors"
                              >
                                {btn.type === "URL" && (
                                  <ExternalLink className="h-3 w-3" />
                                )}
                                {btn.type === "PHONE_NUMBER" && (
                                  <Phone className="h-3 w-3" />
                                )}
                                {btn.type === "QUICK_REPLY" && (
                                  <CornerDownLeft className="h-3 w-3" />
                                )}
                                <span>{btn.text || "CTA Action"}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : contentType === "CATALOG" ? (
              /* WhatsApp Catalog Preview */
              <div className="space-y-1 max-w-[92%] ml-auto">
                <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs overflow-hidden shadow-md">
                  {/* Catalog Header Card */}
                  <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-3 text-white flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs truncate">
                        {catalog?.catalogName || "Official WhatsApp Catalog"}
                      </p>
                      <p className="text-[10px] text-emerald-200 truncate">
                        {catalog?.productName || "Featured Products & Services"}
                      </p>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-3 space-y-1.5">
                    <div
                      className="text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          formattedBodyHtml ||
                          catalog?.bodyText ||
                          "Browse our catalog and place orders directly on WhatsApp.",
                      }}
                    />
                    {footer && (
                      <p className="text-[10px] text-emerald-200/70 pt-1 border-t border-emerald-600/40">
                        {footer}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200/70">
                      <span>{currentTime}</span>
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                  </div>

                  {/* Catalog CTA */}
                  <div className="border-t border-emerald-600/50 bg-[#004f40]">
                    <button
                      type="button"
                      className="w-full py-2.5 px-3 text-center text-xs font-semibold text-cyan-300 hover:bg-emerald-800/40 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{catalog?.ctaText || "View Catalog"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard WhatsApp Message Bubble (Text or Media) */
              <div className="space-y-1 max-w-[92%] ml-auto">
                <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-xs overflow-hidden shadow-md">
                  {/* Media Header (Image / Video / Document) */}
                  {header.type === "IMAGE" && (
                    <div className="h-36 w-full relative bg-slate-900 overflow-hidden">
                      {header.mediaUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={header.mediaUrl}
                          alt="Template Header Media"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 gap-1">
                          <FileText className="h-8 w-8 text-emerald-400/70" />
                          <span className="text-[11px]">Header Image Preview</span>
                        </div>
                      )}
                    </div>
                  )}

                  {header.type === "VIDEO" && (
                    <div className="h-36 w-full relative bg-slate-900 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      <div className="h-11 w-11 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-white ring-2 ring-white/60 z-10">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                      <div className="absolute bottom-2 left-2 z-10 text-[10px] text-white/90 font-mono bg-black/60 px-1.5 py-0.5 rounded">
                        0:30 • Video
                      </div>
                    </div>
                  )}

                  {header.type === "DOCUMENT" && (
                    <div className="p-3 bg-[#004d3f] border-b border-emerald-600/40 flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-rose-600/90 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {header.mediaFileName || "Document_Attachment.pdf"}
                        </p>
                        <p className="text-[10px] text-emerald-200/80">
                          PDF • 1.2 MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Text Header */}
                  {header.type === "TEXT" && processedHeaderText && (
                    <div className="p-3 pb-0">
                      <h4 className="font-bold text-sm text-white leading-tight">
                        {processedHeaderText}
                      </h4>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-3 space-y-1.5">
                    <div
                      className="text-xs leading-relaxed whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{
                        __html:
                          formattedBodyHtml ||
                          '<span class="italic text-emerald-200/60">Message body will render here...</span>',
                      }}
                    />

                    {/* Footer text */}
                    {footer && (
                      <p className="text-[10px] text-emerald-200/70 pt-1 border-t border-emerald-600/30">
                        {footer}
                      </p>
                    )}

                    {/* Message Time and Blue Checkmarks */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200/70">
                      <span>{currentTime}</span>
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                  </div>

                  {/* CTA Buttons attached to message bubble */}
                  {buttons.length > 0 && (
                    <div className="border-t border-emerald-600/40 divide-y divide-emerald-600/40 bg-[#004f40]">
                      {buttons.map((btn, idx) => (
                        <button
                          key={btn.id || idx}
                          type="button"
                          className="w-full py-2.5 px-3 text-center text-xs font-semibold text-cyan-300 hover:bg-emerald-800/40 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {btn.type === "URL" && (
                            <ExternalLink className="h-3 w-3" />
                          )}
                          {btn.type === "PHONE_NUMBER" && (
                            <Phone className="h-3 w-3" />
                          )}
                          {btn.type === "QUICK_REPLY" && (
                            <CornerDownLeft className="h-3 w-3" />
                          )}
                          {btn.type === "COPY_CODE" && (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{btn.text || `Button ${idx + 1}`}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Bar Mockup */}
          <div className="bg-[#1f2c34] p-2 flex items-center gap-2 border-t border-[#2a3942] shrink-0 text-slate-400 text-xs">
            <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-400 truncate">
              Type a message
            </div>
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sample Value Drawer Toggle */}
      {variables.length > 0 && (
        <div className="w-full max-w-[350px] mt-3">
          <div className="rounded-xl border bg-card p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Live Variable Tester ({variables.length})
              </span>
              <button
                type="button"
                onClick={() => setShowSampleDrawer((prev) => !prev)}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                {showSampleDrawer ? "Hide" : "Customize"}
              </button>
            </div>

            {showSampleDrawer && (
              <div className="space-y-2 pt-2 border-t text-xs">
                {variables.map((v) => (
                  <div key={v.index} className="space-y-0.5">
                    <label className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                      <span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 mr-1 font-mono">
                          {`{{${v.index}}}`}
                        </Badge>
                        {v.name || `Variable ${v.index}`}
                      </span>
                    </label>
                    <Input
                      className="h-7 text-xs"
                      value={customSampleOverrides[v.index] ?? v.sampleValue ?? ""}
                      onChange={(e) =>
                        onUpdateSampleValue?.(v.index, e.target.value)
                      }
                      placeholder={`Sample value for {{${v.index}}}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
