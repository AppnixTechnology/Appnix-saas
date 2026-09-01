"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tag as TagIcon,
  Search,
  Check,
  Plus,
  X,
  Sliders,
} from "lucide-react";
import { LiveChatConversation } from "@/types/live-chat";
import { useContactTags } from "@/hooks/useContactTags";
import { TagBadge } from "../tags/TagBadge";
import { cn } from "@/lib/utils";

interface LiveChatTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: LiveChatConversation | null;
  onSaveTags: (tags: LiveChatConversation["tags"]) => void;
}

export function LiveChatTagModal({
  isOpen,
  onClose,
  conversation,
  onSaveTags,
}: LiveChatTagModalProps) {
  const { tags: workspaceTags } = useContactTags();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    conversation?.tags.map((t) => t.id) || []
  );
  const [search, setSearch] = useState("");

  if (!isOpen || !conversation) return null;

  const filteredTags = workspaceTags.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
  });

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = () => {
    const nextTags = workspaceTags
      .filter((t) => selectedTagIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color,
        icon: t.icon,
      }));

    onSaveTags(nextTags);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <TagIcon className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Manage Conversation Tags
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Assign or remove CRM segmentation tags for {conversation.name}.
            </DialogDescription>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search available tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8.5 h-8 text-xs bg-background"
            />
          </div>

          {/* Tags List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <div
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <TagBadge tag={tag} size="sm" />
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Assigned Tags</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
