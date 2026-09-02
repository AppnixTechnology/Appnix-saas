"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureFlag } from "../../types";
import { X, Flag } from "lucide-react";

interface FlagModalProps {
  isOpen: boolean;
  flag?: FeatureFlag | null;
  onClose: () => void;
  onSaveFlag: (flag: FeatureFlag) => void;
}

export function FlagModal({
  isOpen,
  flag,
  onClose,
  onSaveFlag,
}: FlagModalProps) {
  const [name, setName] = useState(flag?.name || "");
  const [key, setKey] = useState(flag?.key || "");
  const [description, setDescription] = useState(flag?.description || "");
  const [environment, setEnvironment] = useState<FeatureFlag["environment"]>(
    flag?.environment || "Production",
  );
  const [impactLevel, setImpactLevel] = useState<FeatureFlag["impactLevel"]>(
    flag?.impactLevel || "Medium",
  );
  const [isEnabled, setIsEnabled] = useState(flag?.isEnabled ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    onSaveFlag({
      id: flag?.id || `ff-${Date.now()}`,
      key: key.trim().toLowerCase().replace(/\s+/g, "_"),
      name: name.trim(),
      description:
        description.trim() || "Controls runtime platform feature availability.",
      isEnabled,
      environment,
      impactLevel,
      updatedBy: "Super Admin",
      lastUpdated: "Just now",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl animate-in">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {flag ? "Edit Feature Flag" : "Create New Feature Flag"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Toggle platform capabilities without redeployment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Feature Name *
            </label>
            <Input
              required
              placeholder="e.g. AI Workflow Autopilot"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!flag) {
                  setKey(e.target.value.toLowerCase().replace(/\s+/g, "_"));
                }
              }}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Unique Flag Key *
            </label>
            <Input
              required
              placeholder="e.g. ai_workflow_autopilot"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) =>
                  setEnvironment(e.target.value as FeatureFlag["environment"])
                }
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Beta">Beta</option>
                <option value="All">All Environments</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">
                Impact Level
              </label>
              <select
                value={impactLevel}
                onChange={(e) =>
                  setImpactLevel(e.target.value as FeatureFlag["impactLevel"])
                }
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
              >
                <option value="Low">Low (Safe)</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Core)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Explain what this flag enables and impact on active tenants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Save Flag
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
