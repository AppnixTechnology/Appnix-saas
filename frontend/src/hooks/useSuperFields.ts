"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  SuperField,
  SuperFieldDataType,
  SuperFieldFilterOptions,
  SuperFieldFormPayload,
  SuperFieldMetrics,
} from "@/types/super-field";
import {
  getStoredSuperFields,
  saveStoredSuperFields,
} from "@/lib/super-fields";

export function useSuperFields() {
  const [fields, setFields] = useState<SuperField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Filter state
  const [filterOptions, setFilterOptions] = useState<SuperFieldFilterOptions>({
    searchQuery: "",
    dataType: "ALL",
    placementFilter: "ALL",
    requiredFilter: "ALL",
    statusFilter: "ALL",
  });

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filterOptions.searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [filterOptions.searchQuery]);

  // Initial load
  useEffect(() => {
    const loaded = getStoredSuperFields();
    setFields(loaded);
    setIsLoading(false);
  }, []);

  // Multi-window / storage sync
  useEffect(() => {
    const handleStorageUpdate = () => {
      setFields(getStoredSuperFields());
    };
    window.addEventListener("super-fields-updated", handleStorageUpdate);
    return () => window.removeEventListener("super-fields-updated", handleStorageUpdate);
  }, []);

  // Filtered & memoized records
  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      // Data type filter
      if (filterOptions.dataType !== "ALL" && field.dataType !== filterOptions.dataType) {
        return false;
      }

      // Placement filter
      if (filterOptions.placementFilter === "PROFILE" && !field.placement.contactProfile) return false;
      if (filterOptions.placementFilter === "INBOX_LABEL" && !field.placement.chatInboxLabel) return false;
      if (filterOptions.placementFilter === "INBOX_SIDEBAR" && !field.placement.chatInboxSidebar) return false;

      // Required filter
      if (filterOptions.requiredFilter === "REQUIRED" && !field.validation.isRequired) return false;
      if (filterOptions.requiredFilter === "OPTIONAL" && field.validation.isRequired) return false;

      // Status filter
      if (filterOptions.statusFilter !== "ALL" && field.status !== filterOptions.statusFilter) return false;

      // Debounced search query
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchLabel = field.label.toLowerCase().includes(q);
        const matchKey = field.key.toLowerCase().includes(q);
        const matchDesc = field.description?.toLowerCase().includes(q);
        if (!matchLabel && !matchKey && !matchDesc) return false;
      }

      return true;
    });
  }, [fields, filterOptions.dataType, filterOptions.placementFilter, filterOptions.requiredFilter, filterOptions.statusFilter, debouncedSearch]);

  // Metrics computation
  const metrics: SuperFieldMetrics = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((f) => f.status === "ACTIVE").length;
    const required = fields.filter((f) => f.validation.isRequired).length;
    const inboxLabels = fields.filter((f) => f.placement.chatInboxLabel).length;
    return { total, active, required, inboxLabels };
  }, [fields]);

  // Create Field
  const createField = useCallback(
    async (payload: SuperFieldFormPayload): Promise<SuperField> => {
      setIsMutating(true);
      await new Promise((res) => setTimeout(res, 250)); // simulated latency

      const newField: SuperField = {
        id: `sf-${payload.key}-${Date.now().toString().slice(-6)}`,
        key: payload.key,
        label: payload.label,
        description: payload.description,
        dataType: payload.dataType,
        options: payload.options,
        defaultValue: payload.defaultValue,
        helperText: payload.helperText,
        placeholder: payload.placeholder,
        currencySymbol: payload.currencySymbol,
        validation: payload.validation,
        placement: payload.placement,
        status: "ACTIVE",
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newField, ...fields];
      setFields(updated);
      saveStoredSuperFields(updated);
      setIsMutating(false);
      return newField;
    },
    [fields]
  );

  // Update Field
  const updateField = useCallback(
    async (payload: SuperFieldFormPayload): Promise<SuperField> => {
      setIsMutating(true);
      await new Promise((res) => setTimeout(res, 250));

      let updatedTarget: SuperField | null = null;
      const updated = fields.map((f) => {
        if (f.id === payload.id) {
          const merged: SuperField = {
            ...f,
            key: payload.key,
            label: payload.label,
            description: payload.description,
            dataType: payload.dataType,
            options: payload.options,
            defaultValue: payload.defaultValue,
            helperText: payload.helperText,
            placeholder: payload.placeholder,
            currencySymbol: payload.currencySymbol,
            validation: payload.validation,
            placement: payload.placement,
            updatedAt: new Date().toISOString(),
          };
          updatedTarget = merged;
          return merged;
        }
        return f;
      });

      setFields(updated);
      saveStoredSuperFields(updated);
      setIsMutating(false);
      return updatedTarget || (payload as SuperField);
    },
    [fields]
  );

  // Duplicate Field
  const duplicateField = useCallback(
    async (field: SuperField): Promise<SuperField> => {
      setIsMutating(true);
      await new Promise((res) => setTimeout(res, 150));

      const newKey = `${field.key}_copy_${Math.floor(10 + Math.random() * 90)}`;
      const duplicated: SuperField = {
        ...field,
        id: `sf-${newKey}-${Date.now().toString().slice(-4)}`,
        key: newKey,
        label: `${field.label} (Copy)`,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [duplicated, ...fields];
      setFields(updated);
      saveStoredSuperFields(updated);
      setIsMutating(false);
      return duplicated;
    },
    [fields]
  );

  // Archive Field
  const archiveField = useCallback(
    async (fieldId: string): Promise<void> => {
      setIsMutating(true);
      await new Promise((res) => setTimeout(res, 150));

      const updated = fields.map((f) =>
        f.id === fieldId ? { ...f, status: "ARCHIVED" as const } : f
      );
      setFields(updated);
      saveStoredSuperFields(updated);
      setIsMutating(false);
    },
    [fields]
  );

  // Delete Field
  const deleteField = useCallback(
    async (fieldId: string): Promise<void> => {
      setIsMutating(true);
      await new Promise((res) => setTimeout(res, 150));

      const updated = fields.filter((f) => f.id !== fieldId);
      setFields(updated);
      saveStoredSuperFields(updated);
      setIsMutating(false);
    },
    [fields]
  );

  return {
    fields,
    filteredFields,
    metrics,
    isLoading,
    isMutating,
    filterOptions,
    setFilterOptions,
    createField,
    updateField,
    duplicateField,
    archiveField,
    deleteField,
  };
}
