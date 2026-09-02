"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PlanTier } from "@/super-admin/types";
import { billingService } from "@/super-admin/services";
import { PlanModal } from "@/super-admin/components/billing/PlanModal";
import {
  CreditCard,
  ArrowLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Edit2,
  Shield,
  Zap,
  Users,
  Server,
  BarChart3,
} from "lucide-react";

export default function SuperAdminBillingPage() {
  const [plans, setPlans] = useState<PlanTier[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanTier | null>(null);

  const fetchPlans = () => {
    billingService.getPlans().then(setPlans);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditPlan = (plan: PlanTier) => {
    setEditingPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setIsPlanModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Billing & Plans</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            <CreditCard className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Billing & Plans Management
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Configure subscription tiers, feature entitlements, quotas, and pricing models.
          </p>
        </div>

        <div className="flex flex-col gap-2 xs:flex-row xs:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Opening Revenue & ARPU Analytics...")}
            className="gap-1.5 text-xs font-semibold"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            View Analytics
          </Button>

          <Button
            onClick={handleCreatePlan}
            className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Pricing Plan Cards Grid */}
      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs transition-all duration-200 sm:p-6",
                plan.isPopular
                  ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:shadow-md"
              )}
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-foreground">{plan.name}</h3>
                  {plan.isPopular && (
                    <Badge className="bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      POPULAR
                    </Badge>
                  )}
                </div>

                <div className="my-4 flex flex-wrap items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground sm:text-3xl">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">/mo</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    (${plan.yearlyPrice}/yr)
                  </span>
                </div>

                <div className="my-6 space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Users className="h-4 w-4 shrink-0 text-primary" />
                    <span>Up to {plan.userLimit} Users</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Zap className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>{plan.apiLimit}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Server className="h-4 w-4 shrink-0 text-primary" />
                    <span>{plan.storageLimit}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Shield className="h-4 w-4 shrink-0 text-indigo-600" />
                    <span>{plan.supportSla}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4 text-xs">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Features Included:
                  </p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-[11px] leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPlan(plan)}
                  className="w-full gap-1.5 text-xs font-semibold hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Plan
                </Button>
              </div>
            </div>
          );
        })}

        {/* Create New Plan Card (Dashed) */}
        <button
          type="button"
          onClick={handleCreatePlan}
          className={cn(
            "flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20 p-6 text-center transition-all sm:min-h-[360px]",
            "group hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-card text-primary transition-transform group-hover:scale-110">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            Create New Plan
          </h3>
          <p className="mt-1 max-w-44 text-xs text-muted-foreground">
            Draft a custom pricing tier with unique quota and SLA limits
          </p>
        </button>
      </div>

      {/* Plan Creation / Edit Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        plan={editingPlan}
        onClose={() => setIsPlanModalOpen(false)}
        onSavePlan={(saved) => {
          billingService.savePlan(saved).then(() => {
            fetchPlans();
            alert(`Plan ${saved.name} saved successfully!`);
          });
        }}
      />
    </div>
  );
}