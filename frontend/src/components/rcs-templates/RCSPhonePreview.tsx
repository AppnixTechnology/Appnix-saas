"use client";

import { useState } from "react";
import {
  ExternalLink,
  Phone,
  CornerDownLeft,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MoreVertical,
  Play,
  CheckCheck,
  Sparkles,
  RefreshCw,
  Eye,
  Layers,
  Lock,
  Smartphone,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RCSTemplate,
  RCSTemplateVariable,
  RCSCard,
  RCSAction,
  RCSMediaType,
} from "@/types/rcs-template";
import {
  interpolateRCSVariables,
  VERIFIED_RCS_AGENTS,
} from "@/lib/rcs-templates";
import { cn } from "@/lib/utils";

interface RCSPhonePreviewProps {
  template: Partial<RCSTemplate>;
  customSampleOverrides?: Record<string, string>;
  onUpdateSampleValue?: (index: number, value: string) => void;
  className?: string;
}

interface SimulatedUserMessage {
  id: string;
  text: string;
  timestamp: string;
}

export function RCSPhonePreview({
  template,
  customSampleOverrides = {},
  onUpdateSampleValue,
  className,
}: RCSPhonePreviewProps) {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [showSampleDrawer, setShowSampleDrawer] = useState(false);
  const [previewMode, setPreviewMode] = useState<"sample" | "raw">("sample");
  const [simulatedUserMessages, setSimulatedUserMessages] = useState<SimulatedUserMessage[]>([]);
  const [simulatedActionToast, setSimulatedActionToast] = useState<string | null>(null);

  const selectedAgent =
    VERIFIED_RCS_AGENTS.find((a) => a.id === template.agentId) ||
    VERIFIED_RCS_AGENTS[0];

  const agentName = template.agentName || selectedAgent.name;
  const messageType = template.messageType || "RICH_CARD";
  const variables = template.variables || [];

  const currentTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date());

  // Carousel Cards
  const carouselCards: RCSCard[] = template.cards && template.cards.length > 0
    ? template.cards
    : [
        {
          id: "preview-card-1",
          title: "Card 1 Title",
          description: "Card description text with {{1}} variable placeholders.",
          actions: [],
        },
      ];

  // Single Card
  const singleCard: RCSCard = template.card || {
    id: "preview-single-card",
    title: "Card Title",
    description: "Card description goes here...",
    actions: [],
  };

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

  const handleActionClick = (action: RCSAction) => {
    if (action.type === "REPLY") {
      const newMsg: SimulatedUserMessage = {
        id: String(Date.now()),
        text: action.text,
        timestamp: new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(new Date()),
      };
      setSimulatedUserMessages((prev) => [...prev, newMsg]);
      showToast(`⚡ Postback Payload sent: ${action.postback || action.text}`);
    } else if (action.type === "URL") {
      showToast(`🌐 Opening Web Link: ${action.url || "https://..."}`);
    } else if (action.type === "DIAL") {
      showToast(`📞 Opening Dialer: ${action.phoneNumber || "+91..."}`);
    } else if (action.type === "LOCATION") {
      showToast(`🗺️ Opening Maps: ${action.locationLabel || "Pin Location"}`);
    } else if (action.type === "CALENDAR") {
      showToast(`📅 Creating Calendar Event: ${action.calendarTitle || "Event"}`);
    }
  };

  const showToast = (text: string) => {
    setSimulatedActionToast(text);
    setTimeout(() => {
      setSimulatedActionToast(null);
    }, 3200);
  };

  const renderTextContent = (rawText: string) => {
    if (!rawText) return "";
    if (previewMode === "raw") return rawText;
    return interpolateRCSVariables(rawText, variables, customSampleOverrides);
  };

  const renderMedia = (media?: RCSCard["media"]) => {
    if (!media || !media.url) return null;

    const ratioClass =
      media.ratio === "1:1" ? "aspect-square" : "aspect-video";

    return (
      <div className={cn("relative w-full overflow-hidden bg-slate-950/80 shrink-0", ratioClass)}>
        <img
          src={media.url}
          alt={media.fileName || "RCS Media"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";
          }}
        />
        {media.type === "VIDEO" && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg backdrop-blur-xs">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/60 backdrop-blur-md text-white text-[9px] px-1.5 py-0 border-0">
            {media.ratio || "16:9"} • {media.type}
          </Badge>
        </div>
      </div>
    );
  };

  const renderActionButtons = (actions: RCSAction[] = []) => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {actions.map((act) => {
          let IconComponent = CornerDownLeft;
          if (act.type === "URL") IconComponent = ExternalLink;
          if (act.type === "DIAL") IconComponent = Phone;
          if (act.type === "LOCATION") IconComponent = MapPin;
          if (act.type === "CALENDAR") IconComponent = Calendar;

          return (
            <button
              key={act.id}
              onClick={() => handleActionClick(act)}
              type="button"
              className="w-full px-3.5 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 active:scale-[0.99] transition-all cursor-pointer select-none"
            >
              <IconComponent className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{act.text || "Action Button"}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center select-none", className)}>
      {/* Top Toggle Controls */}
      <div className="w-full max-w-[340px] mb-3 flex items-center justify-between gap-2 bg-muted/40 p-1.5 rounded-xl border">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreviewMode("sample")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all",
              previewMode === "sample"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-3 w-3 inline mr-1 text-primary" />
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("raw")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all",
              previewMode === "raw"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Raw {"{{1}}"}
          </button>
        </div>

        {variables.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowSampleDrawer(!showSampleDrawer)}
          >
            <SlidersHorizontal className="h-3 w-3 mr-1" />
            Samples ({variables.length})
          </Button>
        )}
      </div>

      {/* Expandable Variable Sample Drawer */}
      {showSampleDrawer && variables.length > 0 && (
        <div className="w-full max-w-[340px] mb-3 p-3 bg-card border rounded-xl shadow-xs space-y-2 text-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-1 border-b">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Test Sample Data
            </span>
            <button
              onClick={() => setShowSampleDrawer(false)}
              className="text-muted-foreground hover:text-foreground text-[11px]"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {variables.map((v) => (
              <div key={v.index} className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                  {`{{${v.index}}}`}
                </span>
                <Input
                  value={customSampleOverrides[String(v.index)] ?? v.sampleValue ?? ""}
                  onChange={(e) =>
                    onUpdateSampleValue &&
                    onUpdateSampleValue(v.index, e.target.value)
                  }
                  placeholder={`Value for ${v.name || `Var ${v.index}`}`}
                  className="h-7 text-xs bg-background"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern Android Phone Mockup Frame */}
      <div className="w-[320px] sm:w-[350px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative transition-all">
        {/* Android Punch Hole Camera */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-950 rounded-full z-30 flex items-center justify-center border border-slate-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/90" />
        </div>

        {/* Screen Area */}
        <div className="rounded-[34px] overflow-hidden bg-[#111827] flex flex-col h-[580px] border border-slate-800 text-slate-100 relative">
          {/* Android Status Bar */}
          <div className="h-7 bg-[#1e293b] text-[10px] text-slate-400 flex items-center justify-between px-5 pt-1 shrink-0 font-medium select-none z-10">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-slate-300">5G</span>
              {/* Battery Icon */}
              <div className="w-4 h-2 border border-slate-400 rounded-xs relative">
                <div className="h-full w-4/5 bg-slate-300" />
              </div>
            </div>
          </div>

          {/* Google Messages RCS Header */}
          <div className="bg-[#1e293b] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700/60 shrink-0 z-10 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <ChevronLeft className="h-5 w-5 text-slate-300 -ml-1 cursor-pointer hover:text-white" />
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs ring-2 ring-indigo-400/40 overflow-hidden">
                  {selectedAgent.avatarUrl ? (
                    <img
                      src={selectedAgent.avatarUrl}
                      alt={agentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    agentName.charAt(0).toUpperCase()
                  )}
                </div>
                {/* Verified Shield Checkmark */}
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-[#1e293b]">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-xs text-slate-100 truncate">
                    {agentName}
                  </p>
                </div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 truncate font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RCS Business Message
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4 cursor-pointer hover:text-slate-200" />
              <MoreVertical className="h-4 w-4 cursor-pointer hover:text-slate-200" />
            </div>
          </div>

          {/* RCS Chat Canvas */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative flex flex-col justify-end bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b0f19]">
            {/* Encryption & Verified Banner */}
            <div className="mx-auto my-1 flex items-center gap-1.5 px-3 py-1 bg-slate-800/70 backdrop-blur-xs rounded-full border border-slate-700/50 text-[10px] text-slate-300">
              <Lock className="h-2.5 w-2.5 text-emerald-400" />
              <span>Verified Carrier Connection • Jio/Airtel</span>
            </div>

            {/* Date Pill */}
            <div className="text-center">
              <span className="text-[10px] bg-slate-800/80 px-2.5 py-0.5 rounded-md text-slate-400">
                Today
              </span>
            </div>

            {/* Content Display based on Message Type */}
            {messageType === "TEXT" && (
              <div className="space-y-2 max-w-[90%]">
                {/* Incoming Text Bubble */}
                <div className="bg-[#1e293b] rounded-2xl rounded-tl-xs p-3.5 border border-slate-700/60 shadow-md text-slate-100 text-xs leading-relaxed space-y-2">
                  <p className="whitespace-pre-wrap break-words">
                    {renderTextContent(template.textBody || "Message text placeholder...")}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                    <span>{currentTime}</span>
                    <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                </div>

                {/* Standalone Action Chips */}
                {template.standaloneActions && template.standaloneActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {template.standaloneActions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleActionClick(act)}
                        type="button"
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                      >
                        {act.type === "URL" && <ExternalLink className="h-3 w-3" />}
                        {act.type === "DIAL" && <Phone className="h-3 w-3" />}
                        {act.type === "LOCATION" && <MapPin className="h-3 w-3" />}
                        {act.type === "CALENDAR" && <Calendar className="h-3 w-3" />}
                        {act.type === "REPLY" && <CornerDownLeft className="h-3 w-3" />}
                        <span>{act.text || "Action"}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messageType === "RICH_CARD" && (
              <div className="w-full max-w-[285px] self-start rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-xl text-slate-100 text-xs">
                {/* Card Media Cover */}
                {renderMedia(singleCard.media)}

                {/* Card Body */}
                <div className="p-3.5 space-y-1.5 bg-slate-900">
                  {singleCard.title && (
                    <h4 className="font-bold text-sm text-white tracking-tight leading-snug">
                      {renderTextContent(singleCard.title)}
                    </h4>
                  )}
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {renderTextContent(singleCard.description || "Card description text...")}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                    <span>{currentTime}</span>
                    <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                </div>

                {/* Card Action Buttons */}
                {renderActionButtons(singleCard.actions)}
              </div>
            )}

            {messageType === "CAROUSEL" && (
              <div className="w-full space-y-2">
                {/* Carousel Card Deck */}
                <div className="relative">
                  <div className="w-full max-w-[285px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-xl text-slate-100 text-xs">
                    {/* Media */}
                    {renderMedia(carouselCards[activeCarouselIndex]?.media)}

                    {/* Card Content */}
                    <div className="p-3.5 space-y-1.5 bg-slate-900">
                      {carouselCards[activeCarouselIndex]?.title && (
                        <h4 className="font-bold text-sm text-white tracking-tight leading-snug">
                          {renderTextContent(carouselCards[activeCarouselIndex]?.title || "")}
                        </h4>
                      )}
                      <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {renderTextContent(carouselCards[activeCarouselIndex]?.description || "")}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="font-semibold text-indigo-400">
                          Card {activeCarouselIndex + 1} of {carouselCards.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <span>{currentTime}</span>
                          <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {renderActionButtons(carouselCards[activeCarouselIndex]?.actions)}
                  </div>

                  {/* Prev / Next controls */}
                  {carouselCards.length > 1 && (
                    <div className="flex items-center justify-between mt-2 px-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                        onClick={handlePrevCard}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {carouselCards.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveCarouselIndex(idx)}
                            className={cn(
                              "h-1.5 rounded-full transition-all",
                              activeCarouselIndex === idx
                                ? "w-5 bg-indigo-500"
                                : "w-1.5 bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                        onClick={handleNextCard}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Simulated User Replies */}
            {simulatedUserMessages.map((msg) => (
              <div key={msg.id} className="self-end max-w-[80%] space-y-1">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2 text-xs shadow-md">
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  <CheckCheck className="h-3 w-3 text-blue-400" />
                </div>
              </div>
            ))}

            {/* In-Simulator Toast Notification */}
            {simulatedActionToast && (
              <div className="absolute top-14 left-4 right-4 bg-slate-900/95 border border-indigo-500/60 text-slate-100 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-[11px] flex items-center gap-2 animate-in slide-in-from-top-2 z-30">
                <Smartphone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="truncate">{simulatedActionToast}</span>
              </div>
            )}
          </div>

          {/* Android Google Messages Input Bar Simulator */}
          <div className="bg-[#1e293b] p-2.5 border-t border-slate-700/60 flex items-center gap-2 shrink-0">
            <div className="flex-1 bg-slate-900/80 rounded-full px-3.5 py-2 text-xs text-slate-400 border border-slate-700 flex items-center justify-between">
              <span className="truncate">RCS message with {agentName}...</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <CornerDownLeft className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
