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
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  Tag as TagIcon,
  Flame,
  Star,
  Users,
  Sliders,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { ContactTag, CreateTagPayload, UpdateTagPayload } from "@/types/contact-tag";
import { useContactTags } from "@/hooks/useContactTags";
import { TagBadge } from "./TagBadge";
import { CreateTagDrawer } from "./CreateTagDrawer";

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageTagsModal({ isOpen, onClose }: ManageTagsModalProps) {
  const {
    tags,
    filteredTags,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    createTag,
    updateTag,
    deleteTag,
  } = useContactTags();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTagForEdit, setSelectedTagForEdit] = useState<ContactTag | null>(null);

  if (!isOpen) return null;

  const handleSaveTag = async (payload: CreateTagPayload & { id?: string }) => {
    if (payload.id) {
      await updateTag(payload as UpdateTagPayload);
    } else {
      await createTag(payload);
    }
    setIsDrawerOpen(false);
    setSelectedTagForEdit(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <TagIcon className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                CRM Tag Taxonomy & Classification
              </DialogTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {tags.length} active tags
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Manage custom contact tags, color taxonomy, and automation assignment rules.
            </DialogDescription>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setSelectedTagForEdit(null);
              setIsDrawerOpen(true);
            }}
            className="bg-primary text-primary-foreground font-semibold text-xs h-8 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Create New Tag</span>
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b flex items-center justify-between gap-3 bg-card">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tags by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="usage">Usage Frequency (High to Low)</option>
              <option value="name">Alphabetical (A - Z)</option>
              <option value="recent">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Tag Directory Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTags.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
              <TagIcon className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="font-bold text-foreground">No Tags Found</p>
              <p className="text-[11px]">
                {searchQuery ? "No tags match your search query." : "No tags created yet in this workspace."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTagForEdit(null);
                  setIsDrawerOpen(true);
                }}
                className="mt-2 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Create Your First Tag
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Tag Badge</th>
                    <th className="px-4 py-3">System Slug</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-center">Contacts Using Tag</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-muted/30 transition-colors">
                      {/* 1. Tag Badge */}
                      <td className="px-4 py-3">
                        <TagBadge tag={tag} size="sm" />
                      </td>

                      {/* 2. Slug */}
                      <td className="px-4 py-3">
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded border text-muted-foreground font-mono">
                          {tag.slug}
                        </code>
                      </td>

                      {/* 3. Description */}
                      <td className="px-4 py-3 max-w-xs text-muted-foreground truncate">
                        {tag.description || "—"}
                      </td>

                      {/* 4. Usage Count */}
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-foreground flex items-center justify-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{tag.usageCount.toLocaleString("en-IN")}</span>
                        </span>
                      </td>

                      {/* 5. Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTagForEdit(tag);
                              setIsDrawerOpen(true);
                            }}
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            title="Edit Tag"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteTag(tag.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                            title="Delete Tag"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredTags.length} of {tags.length} workspace tags</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Embedded Tag Creation / Edit Drawer */}
      <CreateTagDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTagForEdit(null);
        }}
        onSave={handleSaveTag}
        initialData={selectedTagForEdit}
        existingTags={tags}
      />
    </Dialog>
  );
}
