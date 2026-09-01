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
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Layers,
  ArrowRightLeft,
  Check,
  UserCheck,
  Shield,
  Sparkles,
} from "lucide-react";
import { DepartmentId } from "@/types/live-chat";
import { MOCK_AGENTS } from "@/lib/live-chat-mock";
import { cn } from "@/lib/utils";

interface LiveChatTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCount: number;
  onConfirmTransfer: (targetAgentId?: string, targetDept?: DepartmentId) => void;
}

const DEPARTMENTS: { id: DepartmentId; label: string }[] = [
  { id: "sales", label: "Sales & Inbound" },
  { id: "support", label: "Customer Support" },
  { id: "billing", label: "Billing & Accounts" },
  { id: "onboarding", label: "Enterprise Onboarding" },
];

export function LiveChatTransferModal({
  isOpen,
  onClose,
  targetCount,
  onConfirmTransfer,
}: LiveChatTransferModalProps) {
  const [transferType, setTransferType] = useState<"agent" | "department">("agent");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(MOCK_AGENTS[1].id);
  const [selectedDept, setSelectedDept] = useState<DepartmentId>("support");

  if (!isOpen) return null;

  const handleTransfer = () => {
    if (transferType === "agent") {
      onConfirmTransfer(selectedAgentId, undefined);
    } else {
      onConfirmTransfer(undefined, selectedDept);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Transfer {targetCount === 1 ? "Conversation" : `${targetCount} Conversations`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Reassign chat ownership and ticket SLA to another team specialist or department queue.
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Transfer Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border">
            <button
              type="button"
              onClick={() => setTransferType("agent")}
              className={cn(
                "py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5",
                transferType === "agent"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Specific Agent</span>
            </button>
            <button
              type="button"
              onClick={() => setTransferType("department")}
              className={cn(
                "py-1.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5",
                transferType === "department"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Department Queue</span>
            </button>
          </div>

          {/* Agent Selection List */}
          {transferType === "agent" ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Select Team Member:
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {MOCK_AGENTS.map((agent) => {
                  const isSelected = selectedAgentId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={cn(
                        "p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-xs">{agent.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {agent.role} • {agent.department}
                          </p>
                        </div>
                      </div>

                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Department Selection */
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Select Department Queue:
              </span>
              <div className="space-y-1.5">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDept === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.id)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <span className="font-bold text-foreground text-xs">{dept.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleTransfer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Confirm Transfer</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
