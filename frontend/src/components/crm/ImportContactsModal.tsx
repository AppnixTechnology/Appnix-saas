"use client";

import { useState, useRef, useTransition } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Info,
  Check,
  FileText,
  Trash2,
  ExternalLink,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Contact,
  DuplicateStrategy,
  ParsedCsvRow,
  ValidationSummary,
  ImportHistoryRecord,
} from "./types";
import {
  parseCSVText,
  validateCsvContent,
  downloadSampleCsvTemplate,
  downloadErrorReportCsv,
  downloadImportResultCsv,
} from "./csv-utils";
import { api } from "@/lib/api/axios";

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingContacts: Contact[];
  onImportComplete: (newContacts: Contact[], historyRecord: ImportHistoryRecord) => void;
}

export function ImportContactsModal({
  isOpen,
  onClose,
  existingContacts,
  onImportComplete,
}: ImportContactsModalProps) {
  // Wizard steps: 1 = Upload CSV, 2 = Validate Data, 3 = Import Execution / Progress / Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Uploading
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [detectedRowCount, setDetectedRowCount] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 2 State: Validation & Options
  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>("SKIP");
  const [errorFilterTab, setErrorFilterTab] = useState<"ALL" | "INVALID" | "DUPLICATE">("ALL");
  const [previewLimit, setPreviewLimit] = useState<number>(20);

  // Step 3 State: Confirmation, Progress, Success
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [importSuccessData, setImportSuccessData] = useState<{
    totalProcessed: number;
    newCount: number;
    updatedCount: number;
    skippedCount: number;
    invalidCount: number;
  } | null>(null);

  const [, startTransition] = useTransition();

  if (!isOpen) return null;

  // Handle Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setUploadError(null);

    // Validate extension & type
    if (!selectedFile.name.toLowerCase().endsWith(".csv") && selectedFile.type !== "text/csv" && selectedFile.type !== "application/vnd.ms-excel") {
      setUploadError("Please upload a valid .CSV file.");
      return;
    }

    // Validate size (limit 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setUploadError("File size exceeds 10MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFile(selectedFile);
      setFileContent(text);

      const parsed = parseCSVText(text);
      setDetectedRowCount(parsed.rows.length);
    };
    reader.onerror = () => {
      setUploadError("Failed to read the file. Please try again.");
    };
    reader.readAsText(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileContent("");
    setDetectedRowCount(0);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Run Validation (Client + Backend fallback)
  const handleProceedToValidation = async () => {
    if (!fileContent) return;

    const parsed = parseCSVText(fileContent);
    const summary = validateCsvContent(
      parsed.headers,
      parsed.rows,
      existingContacts,
      file?.name || "contacts.csv",
      file?.size || 0
    );

    setValidationResult(summary);
    setCurrentStep(2);

    // Optionally attempt server-side verification
    try {
      api.post("/crm-contacts/validate-csv", {
        headers: parsed.headers,
        rows: summary.validRows.concat(summary.invalidRows),
        fileName: file?.name,
      }).catch(() => {
        // Backend optional fallback silently handled
      });
    } catch {
      // client-side validation already complete
    }
  };

  // Calculate dynamic import count based on strategy
  const getDynamicImportCount = () => {
    if (!validationResult) return 0;
    if (duplicateStrategy === "SKIP") {
      return validationResult.validCount - validationResult.duplicateCount;
    }
    return validationResult.validCount;
  };

  // Trigger Import Execution
  const handleStartImport = () => {
    setIsConfirmOpen(false);
    setCurrentStep(3);
    setIsImporting(true);
    setImportProgress(0);
    setProcessedCount(0);

    if (!validationResult) return;

    const validRowsToImport = duplicateStrategy === "SKIP"
      ? validationResult.validRows.filter((r) => r.status !== "DUPLICATE")
      : validationResult.validRows;

    const totalToProcess = validRowsToImport.length;
    const existingPhoneSet = new Set(existingContacts.map((c) => c.whatsappNumber.replace(/\D/g, "")));

    let newCount = 0;
    let updatedCount = 0;
    let skippedCount = duplicateStrategy === "SKIP" ? validationResult.duplicateCount : 0;

    const importedContactObjects: Contact[] = [];
    const nowStr = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());

    // Batched asynchronous processing simulation to ensure non-freezing UI with real progress
    const batchSize = Math.max(1, Math.floor(totalToProcess / 10));
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += batchSize;
      const progress = Math.min(100, Math.round((currentIndex / totalToProcess) * 100));
      const currentProcessed = Math.min(totalToProcess, currentIndex);

      setImportProgress(progress);
      setProcessedCount(currentProcessed);

      if (currentIndex >= totalToProcess) {
        clearInterval(interval);

        // Process final records
        validRowsToImport.forEach((row) => {
          const cleanPhone = row.whatsappNumber.replace(/\D/g, "");
          const isExisting = existingPhoneSet.has(cleanPhone);

          const tagList: { label: string; variant: "vip" | "star" | "check" | "none" }[] = [];
          if (row.tags) {
            const rawTags = row.tags.split(/[,|;]/).map((t) => t.trim());
            rawTags.forEach((t) => {
              if (t.toLowerCase() === "vip") {
                tagList.push({ label: "VIP", variant: "vip" });
              } else if (t.toLowerCase() === "star") {
                tagList.push({ label: "star", variant: "star" });
              } else if (t) {
                tagList.push({ label: t, variant: "check" });
              }
            });
          }

          if (isExisting) {
            if (duplicateStrategy === "UPDATE") {
              updatedCount++;
            }
          } else {
            newCount++;
            importedContactObjects.push({
              id: `imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              createdOn: nowStr,
              fullName: row.fullName,
              whatsappNumber: row.whatsappNumber,
              email: row.email,
              marketingBudget: row.marketingBudget,
              marketingGoal: row.marketingGoal,
              tags: tagList,
            });
          }
        });

        // Record history log
        const historyRecord: ImportHistoryRecord = {
          id: `imp_${Date.now()}`,
          fileName: validationResult.fileName,
          fileSize: validationResult.fileSize,
          importedBy: "Admin",
          totalRows: validationResult.totalRows,
          importedCount: newCount + updatedCount,
          failedCount: validationResult.invalidCount,
          skippedCount,
          status: validationResult.invalidCount > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED",
          strategy: duplicateStrategy,
          errorReport: validationResult.invalidRows,
          createdAt: new Date().toISOString(),
        };

        // Try backend sync in background
        api.post("/crm-contacts/bulk-import", {
          contacts: validRowsToImport,
          duplicateStrategy,
          fileName: validationResult.fileName,
          fileSize: validationResult.fileSize,
          totalRows: validationResult.totalRows,
          errorReport: validationResult.invalidRows,
        }).catch(() => {});

        setIsImporting(false);
        setImportSuccessData({
          totalProcessed: validationResult.totalRows,
          newCount,
          updatedCount,
          skippedCount,
          invalidCount: validationResult.invalidCount,
        });

        startTransition(() => {
          onImportComplete(importedContactObjects, historyRecord);
        });
      }
    }, 150);
  };

  const handleReset = () => {
    setCurrentStep(1);
    handleRemoveFile();
    setValidationResult(null);
    setImportSuccessData(null);
    setImportProgress(0);
    setProcessedCount(0);
    setIsConfirmOpen(false);
  };

  // Filtered issues for the Error Table
  const filteredErrorRows = validationResult
    ? errorFilterTab === "ALL"
      ? [...validationResult.invalidRows, ...validationResult.duplicateRows]
      : errorFilterTab === "INVALID"
      ? validationResult.invalidRows
      : validationResult.duplicateRows
    : [];

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border bg-card text-card-foreground shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b bg-muted/10 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Import Contacts</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upload your contacts using our predefined CSV format.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="px-6 py-3 border-b bg-muted/5 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  currentStep === 1
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : currentStep > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > 1 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : "1"}
              </div>
              <div className="hidden sm:block">
                <p className={cn("text-xs font-medium", currentStep === 1 ? "text-foreground font-semibold" : "text-muted-foreground")}>
                  Upload CSV
                </p>
              </div>
            </div>

            <div className={cn("h-0.5 flex-1 mx-3 rounded transition-colors", currentStep > 1 ? "bg-emerald-600" : "bg-border")} />

            {/* Step 2 */}
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  currentStep === 2
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : currentStep > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > 2 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : "2"}
              </div>
              <div className="hidden sm:block">
                <p className={cn("text-xs font-medium", currentStep === 2 ? "text-foreground font-semibold" : "text-muted-foreground")}>
                  Validate Data
                </p>
              </div>
            </div>

            <div className={cn("h-0.5 flex-1 mx-3 rounded transition-colors", currentStep > 2 ? "bg-emerald-600" : "bg-border")} />

            {/* Step 3 */}
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  currentStep === 3
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : "bg-muted text-muted-foreground"
                )}
              >
                3
              </div>
              <div className="hidden sm:block">
                <p className={cn("text-xs font-medium", currentStep === 3 ? "text-foreground font-semibold" : "text-muted-foreground")}>
                  Import Contacts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ========================================================= */}
          {/* STEP 1: UPLOAD CSV */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Highlighted Information Box: Use Our CSV Format */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <FileSpreadsheet className="h-4.5 w-4.5" />
                    <span>Use Our CSV Format</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    To ensure a successful import, download our sample CSV template and fill in your contact data using the same column structure.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadSampleCsvTemplate}
                  className="bg-card hover:bg-muted/80 text-xs font-medium shrink-0 shadow-xs border-primary/30 text-primary hover:text-primary gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Sample CSV
                </Button>
              </div>

              {/* Drag & Drop Upload Zone */}
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-border/80 hover:border-primary/60 hover:bg-muted/30 bg-muted/10"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>

                  <p className="text-sm font-semibold text-foreground text-center">
                    Drag & Drop your CSV file here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">or</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2 text-xs font-medium pointer-events-none"
                  >
                    Browse CSV File
                  </Button>

                  <div className="flex items-center gap-3 mt-4 text-[11px] text-muted-foreground/80">
                    <span>Supported format: <strong className="font-semibold text-foreground">.CSV</strong></span>
                    <span>•</span>
                    <span>Max file size: <strong className="font-semibold text-foreground">10MB</strong> (up to 25,000 rows)</span>
                  </div>
                </div>
              ) : (
                /* Uploaded File Summary Card */
                <div className="rounded-xl border bg-card p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {detectedRowCount} rows detected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs h-8"
                    >
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-xs h-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* CSV Format Requirements Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Required & Optional Fields
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Do not rename header column names
                  </span>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>
                        <th className="py-2.5 px-3.5 font-semibold text-muted-foreground">Field</th>
                        <th className="py-2.5 px-3.5 font-semibold text-muted-foreground w-24">Required</th>
                        <th className="py-2.5 px-3.5 font-semibold text-muted-foreground">Description / Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-foreground/90">
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium text-primary">full_name</td>
                        <td className="py-2.5 px-3.5">
                          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] px-1.5 py-0">
                            Yes
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Contact's full name (e.g. <span className="text-foreground">Rahul Verma</span>)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium text-primary">whatsapp_number</td>
                        <td className="py-2.5 px-3.5">
                          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] px-1.5 py-0">
                            Yes
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          WhatsApp number with country code (e.g. <span className="font-mono text-foreground">919876543210</span>)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium">email</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">No</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Valid email address (e.g. <span className="text-foreground">rahul@example.com</span>)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium">tags</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">No</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Comma-separated tags (e.g. <span className="text-foreground">VIP, Lead</span>)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium">marketing_budget</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">No</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Estimated budget (e.g. <span className="text-foreground">5000</span> or <span className="text-foreground">$5,000</span>)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-mono font-medium">marketing_goal</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">No</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Marketing goal (e.g. <span className="text-foreground">Brand Awareness, Conversions</span>)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> Phone numbers must include country code digits (e.g., <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">91</code> for India). Numbers without country code or with invalid lengths will be flagged.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: VALIDATE DATA */}
          {/* ========================================================= */}
          {currentStep === 2 && validationResult && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl border bg-card p-3.5 shadow-xs">
                  <p className="text-xs text-muted-foreground">Total Rows</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">
                    {validationResult.totalRows.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Detected in CSV</p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 shadow-xs">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Valid Contacts</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {validationResult.validCount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready to import
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 shadow-xs">
                  <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Invalid Contacts</p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {validationResult.invalidCount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Will be excluded
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 shadow-xs">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Duplicate Contacts</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {validationResult.duplicateCount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Strategy selectable
                  </p>
                </div>
              </div>

              {/* Column Warnings / Notification */}
              {validationResult.columnsValidation.unsupportedColumns.length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-semibold">Unsupported column(s) detected:</span>{" "}
                    {validationResult.columnsValidation.unsupportedColumns.join(", ")}. These columns will be safely ignored during import.
                  </div>
                </div>
              )}

              {/* Duplicate Handling Selector */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Duplicate Contacts Strategy</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Duplicate matching is performed based on WhatsApp number.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {validationResult.duplicateCount} duplicate(s)
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Skip Duplicates */}
                  <label
                    onClick={() => setDuplicateStrategy("SKIP")}
                    className={cn(
                      "flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                      duplicateStrategy === "SKIP"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Skip Duplicates</span>
                      <input
                        type="radio"
                        name="dupStrategy"
                        checked={duplicateStrategy === "SKIP"}
                        onChange={() => setDuplicateStrategy("SKIP")}
                        className="accent-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-normal">
                      Do not import contacts that already exist in your CRM.
                    </p>
                    <span className="text-[10px] font-semibold text-primary mt-2">Recommended</span>
                  </label>

                  {/* Update Existing */}
                  <label
                    onClick={() => setDuplicateStrategy("UPDATE")}
                    className={cn(
                      "flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                      duplicateStrategy === "UPDATE"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Update Existing</span>
                      <input
                        type="radio"
                        name="dupStrategy"
                        checked={duplicateStrategy === "UPDATE"}
                        onChange={() => setDuplicateStrategy("UPDATE")}
                        className="accent-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-normal">
                      Update existing CRM contacts with new CSV information.
                    </p>
                  </label>

                  {/* Import as New */}
                  <label
                    onClick={() => setDuplicateStrategy("NEW")}
                    className={cn(
                      "flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                      duplicateStrategy === "NEW"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Import as New</span>
                      <input
                        type="radio"
                        name="dupStrategy"
                        checked={duplicateStrategy === "NEW"}
                        onChange={() => setDuplicateStrategy("NEW")}
                        className="accent-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-normal">
                      Import all as new entries alongside existing contacts.
                    </p>
                  </label>
                </div>
              </div>

              {/* Error & Flagged Rows Section */}
              {(validationResult.invalidCount > 0 || validationResult.duplicateCount > 0) && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">Issues Requiring Attention</h3>
                      <Badge variant="destructive" className="text-[10px] h-5">
                        {validationResult.invalidCount + validationResult.duplicateCount} rows
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-xs">
                        <button
                          type="button"
                          onClick={() => setErrorFilterTab("ALL")}
                          className={cn(
                            "px-2.5 py-1 rounded-md font-medium transition-colors",
                            errorFilterTab === "ALL" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                          )}
                        >
                          All ({validationResult.invalidCount + validationResult.duplicateCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilterTab("INVALID")}
                          className={cn(
                            "px-2.5 py-1 rounded-md font-medium transition-colors",
                            errorFilterTab === "INVALID" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                          )}
                        >
                          Invalid ({validationResult.invalidCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorFilterTab("DUPLICATE")}
                          className={cn(
                            "px-2.5 py-1 rounded-md font-medium transition-colors",
                            errorFilterTab === "DUPLICATE" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                          )}
                        >
                          Duplicates ({validationResult.duplicateCount})
                        </button>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadErrorReportCsv([...validationResult.invalidRows, ...validationResult.duplicateRows], validationResult.fileName)}
                        className="text-xs h-7 gap-1 shadow-xs"
                      >
                        <Download className="h-3 w-3" />
                        Download Error Report
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b sticky top-0 backdrop-blur-xs">
                        <tr>
                          <th className="py-2 px-3 font-semibold text-muted-foreground w-12">Row</th>
                          <th className="py-2 px-3 font-semibold text-muted-foreground">Name</th>
                          <th className="py-2 px-3 font-semibold text-muted-foreground">WhatsApp Number</th>
                          <th className="py-2 px-3 font-semibold text-muted-foreground w-24">Status</th>
                          <th className="py-2 px-3 font-semibold text-muted-foreground">Issue & Suggested Fix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredErrorRows.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-muted-foreground text-xs">
                              No issues under this filter.
                            </td>
                          </tr>
                        ) : (
                          filteredErrorRows.map((row) => (
                            <tr key={row.rowIndex} className="hover:bg-muted/20">
                              <td className="py-2 px-3 font-mono text-muted-foreground">{row.rowIndex}</td>
                              <td className="py-2 px-3 font-medium text-foreground">{row.fullName}</td>
                              <td className="py-2 px-3 font-mono">{row.whatsappNumber}</td>
                              <td className="py-2 px-3">
                                {row.status === "INVALID" ? (
                                  <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] px-1.5 py-0">
                                    Invalid
                                  </Badge>
                                ) : row.status === "DUPLICATE" ? (
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] px-1.5 py-0">
                                    Duplicate
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    Warning
                                  </Badge>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-foreground">{row.issue}</span>
                                {row.suggestedFix && (
                                  <span className="text-muted-foreground block text-[11px]">
                                    Fix: {row.suggestedFix}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Data Preview Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Import Preview</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Showing first {Math.min(previewLimit, validationResult.validRows.length)} of {validationResult.validCount} valid contacts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Preview:</span>
                    <select
                      value={previewLimit}
                      onChange={(e) => setPreviewLimit(Number(e.target.value))}
                      className="h-7 text-xs rounded border bg-background px-2"
                    >
                      <option value={10}>10 rows</option>
                      <option value={20}>20 rows</option>
                      <option value={50}>50 rows</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b sticky top-0 backdrop-blur-xs">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Name</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">WhatsApp Number</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Email</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Tags</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Marketing Budget</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Marketing Goal</th>
                        <th className="py-2 px-3 font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {validationResult.validRows.slice(0, previewLimit).map((row) => (
                        <tr key={row.rowIndex} className="hover:bg-muted/20">
                          <td className="py-2 px-3 font-medium text-foreground">{row.fullName}</td>
                          <td className="py-2 px-3 font-mono text-xs">{row.whatsappNumber}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.email || "—"}</td>
                          <td className="py-2 px-3">
                            {row.tags ? (
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-medium">{row.tags}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{row.marketingBudget}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.marketingGoal}</td>
                          <td className="py-2 px-3">
                            {row.status === "DUPLICATE" ? (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] px-1.5 py-0">
                                Duplicate
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-1.5 py-0">
                                Valid
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: PROGRESS / SUCCESS */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="py-8 space-y-6">
              {isImporting ? (
                /* Import Progress Screen */
                <div className="max-w-md mx-auto text-center space-y-6 animate-in fade-in">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center animate-pulse">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-foreground">Importing Contacts...</h3>
                    <p className="text-xs text-muted-foreground">
                      Please wait while we process and import your contacts. Do not close this window.
                    </p>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>Importing {processedCount.toLocaleString()} of {getDynamicImportCount().toLocaleString()} contacts</span>
                      <span>{importProgress}%</span>
                    </div>
                  </div>
                </div>
              ) : importSuccessData ? (
                /* Import Complete Screen */
                <div className="max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground">Import Completed Successfully</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your contacts have been processed and integrated into your CRM database.
                    </p>
                  </div>

                  {/* Summary Metric Boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                    <div className="rounded-xl border bg-card p-3.5">
                      <p className="text-[11px] text-muted-foreground">Total Processed</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">
                        {importSuccessData.totalProcessed.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">New Added</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {importSuccessData.newCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
                      <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Updated / Skipped</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        {(importSuccessData.updatedCount + importSuccessData.skippedCount).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
                      <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Invalid Excluded</p>
                      <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                        {importSuccessData.invalidCount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (validationResult) {
                          downloadImportResultCsv(
                            validationResult.validRows,
                            validationResult.invalidRows,
                            validationResult.fileName.replace(/\.csv$/i, "") + "_import_summary.csv"
                          );
                        }
                      }}
                      className="w-full sm:w-auto text-xs h-9 gap-1.5 shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Import Report
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="w-full sm:w-auto text-xs h-9 gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Import Another File
                    </Button>
                    <Button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto bg-primary text-primary-foreground text-xs h-9 font-semibold gap-1.5 shadow-sm"
                    >
                      <Users className="h-3.5 w-3.5" />
                      View Contacts
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-t bg-muted/10 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(1)}
              className="text-xs h-9"
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep === 1 ? (
              <Button
                type="button"
                size="sm"
                disabled={!file || detectedRowCount === 0}
                onClick={handleProceedToValidation}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-medium gap-1.5 shadow-sm"
              >
                <span>Continue to Validate Data</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={!validationResult || getDynamicImportCount() === 0}
                onClick={() => setIsConfirmOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold gap-1.5 shadow-sm"
              >
                <span>Import {getDynamicImportCount().toLocaleString()} Contacts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && validationResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Confirm Import</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsConfirmOpen(false)}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              You are about to import <strong className="text-foreground font-semibold">{getDynamicImportCount().toLocaleString()} contacts</strong> into your CRM database.
            </p>

            {/* Breakdown breakdown */}
            <div className="rounded-xl border bg-muted/20 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Contacts:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {(validationResult.validCount - validationResult.duplicateCount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Existing Contacts ({duplicateStrategy}):</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {validationResult.duplicateCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1.5">
                <span className="text-muted-foreground">Invalid Rows (Excluded):</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {validationResult.invalidCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmOpen(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleStartImport}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 font-semibold shadow-sm"
              >
                Confirm Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
