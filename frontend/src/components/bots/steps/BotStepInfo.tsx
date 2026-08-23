"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FolderOpen, Tag, ChevronDown, X, Plus } from "lucide-react";
import { useBotWizard, CreateBotData } from "@/hooks/useBotWizard";

interface BotStepInfoProps {
  bot: CreateBotData;
  updateBotData: (data: Partial<CreateBotData>) => void;
  canProceed: boolean;
  onNext: () => void;
  onSaveDraft: () => Promise<void>;
  isSaving: boolean;
}

export function BotStepInfo({
  bot,
  updateBotData,
  canProceed,
  onNext,
  onSaveDraft,
  isSaving,
}: BotStepInfoProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !bot.tags.includes(newTag.trim())) {
      updateBotData({ tags: [...bot.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    updateBotData({ tags: bot.tags.filter((t) => t !== tag) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="bot-name" className="text-sm font-medium text-foreground">
            Bot Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bot-name"
            placeholder="Enter bot name (e.g., Customer Support Bot)"
            value={bot.name}
            onChange={(e) => updateBotData({ name: e.target.value })}
            className="mt-1.5"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-1">
            A descriptive name to identify this bot in your workspace
          </p>
        </div>

        <div>
          <Label htmlFor="bot-description" className="text-sm font-medium text-foreground">
            Description
          </Label>
          <Textarea
            id="bot-description"
            placeholder="Describe what this bot does..."
            value={bot.description}
            onChange={(e) => updateBotData({ description: e.target.value })}
            className="mt-1.5"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional description to help team members understand the bot's purpose
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Folder
          </Label>
          <div className="relative mt-1.5">
            <select
              value={bot.folderId || "all"}
              onChange={(e) => updateBotData({ folderId: e.target.value || undefined })}
              className="w-full appearance-none bg-background border border-input text-foreground px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {bot.folderId === undefined ? (
                <option value="">Select a folder (optional)</option>
              ) : null}
              <option value="all">All Bots</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
            </select>
            <FolderOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Tags
          </Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {bot.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 px-2 py-1"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag}
                <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }} />
              </Badge>
            ))}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-48"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim() || bot.tags.includes(newTag.trim())}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Press Enter to add tags. Click to remove.
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Channels <span className="text-destructive">*</span>
          </Label>
          <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["whatsapp", "instagram", "rcs", "facebook"].map((channel) => {
              const isSelected = bot.channels.includes(channel as any);
              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() =>
                    updateBotData({
                      channels: isSelected
                        ? bot.channels.filter((c) => c !== channel)
                        : [...bot.channels, channel as any],
                    })
                  }
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{channel.charAt(0).toUpperCase() + channel.slice(1)}</span>
                  {isSelected && <span className="text-xs text-primary font-semibold">Selected</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select one or more channels. Multiple channels allow a single flow across platforms.
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Initial Status
          </Label>
          <div className="mt-1.5 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="DRAFT"
                checked={bot.status === "DRAFT"}
                onChange={(e) => updateBotData({ status: e.target.value as any })}
                className="h-4 w-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="DISABLED"
                checked={bot.status === "DISABLED"}
                onChange={(e) => updateBotData({ status: e.target.value as any })}
                className="h-4 w-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm">Disabled</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Draft bots are not active. Publish from the builder when ready.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSaving || !bot.name.trim()}
        >
          Save Draft
        </Button>
        <Button onClick={onNext} disabled={!canProceed || isSaving}>
          Continue
        </Button>
      </div>
    </div>
  );
}