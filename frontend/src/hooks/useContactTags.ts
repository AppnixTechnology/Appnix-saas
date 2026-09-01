"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ContactTag, CreateTagPayload, UpdateTagPayload } from "@/types/contact-tag";
import {
  getStoredTags,
  saveStoredTags,
  generateTagSlug,
} from "@/lib/contact-tags";

export function useContactTags() {
  const [tags, setTags] = useState<ContactTag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"usage" | "name" | "recent">("usage");
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage
  useEffect(() => {
    setTags(getStoredTags());
    setIsLoading(false);
  }, []);

  // Synchronize across events
  useEffect(() => {
    const handleUpdate = () => {
      setTags(getStoredTags());
    };
    window.addEventListener("contact-tags-updated", handleUpdate);
    return () => window.removeEventListener("contact-tags-updated", handleUpdate);
  }, []);

  // Filtered and sorted tags
  const filteredTags = useMemo(() => {
    return tags
      .filter((tag) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          tag.name.toLowerCase().includes(q) ||
          tag.slug.toLowerCase().includes(q) ||
          (tag.description && tag.description.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "usage") return b.usageCount - a.usageCount;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tags, searchQuery, sortBy]);

  // Create Tag
  const createTag = useCallback(
    async (payload: CreateTagPayload): Promise<ContactTag> => {
      const slug = generateTagSlug(payload.name);
      const newTag: ContactTag = {
        id: `tag-${slug}-${Date.now().toString().slice(-4)}`,
        slug,
        name: payload.name.trim(),
        description: payload.description?.trim() || undefined,
        color: payload.color,
        icon: payload.icon,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newTag, ...tags];
      setTags(updated);
      saveStoredTags(updated);
      return newTag;
    },
    [tags]
  );

  // Update Tag
  const updateTag = useCallback(
    async (payload: UpdateTagPayload): Promise<ContactTag> => {
      const slug = generateTagSlug(payload.name);
      let updatedTag: ContactTag | null = null;

      const updated = tags.map((t) => {
        if (t.id === payload.id) {
          const merged: ContactTag = {
            ...t,
            name: payload.name.trim(),
            slug,
            description: payload.description?.trim() || undefined,
            color: payload.color,
            icon: payload.icon,
            updatedAt: new Date().toISOString(),
          };
          updatedTag = merged;
          return merged;
        }
        return t;
      });

      setTags(updated);
      saveStoredTags(updated);
      return updatedTag || (payload as ContactTag);
    },
    [tags]
  );

  // Delete Tag
  const deleteTag = useCallback(
    async (id: string): Promise<void> => {
      const updated = tags.filter((t) => t.id !== id);
      setTags(updated);
      saveStoredTags(updated);
    },
    [tags]
  );

  return {
    tags,
    filteredTags,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isLoading,
    createTag,
    updateTag,
    deleteTag,
  };
}
