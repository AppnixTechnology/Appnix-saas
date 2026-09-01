"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  CreditCard,
  Building,
  QrCode,
  ArrowRight,
  Receipt,
  Sparkles,
} from "lucide-react";
import { formatCurrency2, formatCurrency4 } from "@/lib/channel-balance";
import { cn } from "@/lib/utils";

interface RechargeTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  phoneNumber: string;
  currentBalance: number;
  onConfirmRecharge: (amount: number, paymentMethod: string) => Promise<void>;
}

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];

export function RechargeTopUpModal({
  isOpen,
  onClose,
  channelName,
  phoneNumber,
  currentBalance,
  onConfirmRecharge,
}: RechargeTopUpModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [rechargedAmount, setRechargedAmount] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<number>(0);

  const effectiveAmount = customAmount
    ? parseFloat(customAmount) || 0
    : selectedPreset;

  const baseAmount = effectiveAmount;
  const gstAmount = baseAmount * 0.18;
  const totalPayable = baseAmount + gstAmount;

  const handleSelectPreset = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
  };

  const handlePay = async () => {
    if (effectiveAmount < 100) {
      alert("Minimum recharge amount is ₹100.");
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirmRecharge(effectiveAmount, paymentMethod);
      setRechargedAmount(effectiveAmount);
      setNewBalance(currentBalance + effectiveAmount);
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isSuccess ? "Recharge Successful!" : "Recharge Prepaid Channel Wallet"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {channelName} ({phoneNumber})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-3 text-xs animate-in zoom-in-95">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-5 text-center space-y-2.5">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-foreground text-base">
                + {formatCurrency2(rechargedAmount)} Credited Successfully
              </h4>
              <p className="text-muted-foreground text-xs">
                Your prepaid credits have been updated immediately and are available for live broadcasts and API traffic.
              </p>
              <div className="inline-block bg-background px-4 py-1.5 rounded-xl border text-xs font-mono font-bold text-foreground mt-1 shadow-2xs">
                Updated Balance: {formatCurrency4(newBalance)}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-3.5 space-y-2">
              <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                <Receipt className="h-3.5 w-3.5 text-primary" /> Tax Invoice Generated
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <div>
                  <span>GST Invoice Ref:</span>
                  <p className="font-mono font-semibold text-foreground">INV-2026-08-{Math.floor(100 + Math.random() * 900)}</p>
                </div>
                <div>
                  <span>Payment Gateway:</span>
                  <p className="font-semibold text-foreground uppercase">{paymentMethod} (Auto-verified)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            {/* Current Balance Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Current Available Balance</span>
                <span className="font-mono font-bold text-sm text-foreground">{formatCurrency4(currentBalance)}</span>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                Active Channel
              </Badge>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground block text-xs">
                Select Recharge Amount (INR)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = selectedPreset === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={cn(
                        "py-2 px-1 rounded-xl border text-center transition-all font-mono font-semibold text-xs",
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600"
                          : "border-border hover:bg-muted/40 text-foreground"
                      )}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">
                  Or enter custom amount:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground font-mono font-bold">₹</span>
                  <Input
                    type="number"
                    min="100"
                    step="100"
                    placeholder="e.g. 15000"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-7 h-9 text-xs font-mono bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground block text-xs">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "upi" as const, label: "UPI / QR", icon: QrCode },
                  { id: "card" as const, label: "Cards", icon: CreditCard },
                  { id: "netbanking" as const, label: "NetBanking", icon: Building },
                ].map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all",
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 mb-1", isSelected ? "text-emerald-600" : "text-muted-foreground")} />
                      <span className="text-[11px] font-semibold text-foreground">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & GST Breakdown */}
            <div className="rounded-xl border bg-card p-3.5 space-y-2 shadow-xs">
              <span className="font-bold text-foreground text-xs">Billing Summary & GST</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Prepaid Wallet Credit:</span>
                  <span className="font-mono font-medium text-foreground">{formatCurrency2(baseAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18% Input Tax Credit Eligible):</span>
                  <span className="font-mono font-medium text-foreground">{formatCurrency2(gstAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-foreground text-sm">
                  <span>Total Payable:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency2(totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {isSuccess ? (
            <Button
              type="button"
              onClick={handleFinish}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
            >
              Done & Return to Ledger
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePay}
                disabled={isProcessing || effectiveAmount <= 0}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatCurrency2(totalPayable)}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
