"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  User,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImportHistoryRecord, ParsedCsvRow } from "./types";
import { downloadErrorReportCsv } from "./csv-utils";

interface ImportHistoryTableProps {
  historyList: ImportHistoryRecord[];
  onRefresh?: () => void;
}

export function ImportHistoryTable({ historyList, onRefresh }: ImportHistoryTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<ImportHistoryRecord | null>(null);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: ImportHistoryRecord["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1 font-medium text-[11px] px-2 py-0.5 border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "COMPLETED_WITH_ERRORS":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 gap-1 font-medium text-[11px] px-2 py-0.5 border-amber-200">
            <AlertTriangle className="h-3 w-3" />
            Completed with Errors
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 gap-1 font-medium text-[11px] px-2 py-0.5 border-rose-200">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case "PROCESSING":
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 gap-1 font-medium text-[11px] px-2 py-0.5 border-blue-200">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* History Table Container */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="flex items-center justify-between p-3.5 border-b bg-muted/20">
          <div>
            <h3 className="text-sm font-bold text-foreground">CSV Import Logs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Historical record of batch contact uploads and system processing results.
            </p>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-8 text-xs gap-1.5 shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  File Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Imported By
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Total Rows
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Imported
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Failed
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {historyList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                    No import history records found.
                  </td>
                </tr>
              ) : (
                historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate max-w-[180px]">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{item.importedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground text-right">
                      {item.totalRows.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                      {item.importedCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-right">
                      {item.failedCount > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">{item.failedCount.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-7 text-xs px-2 gap-1 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Report</span>
                        </Button>

                        {item.failedCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const errorRows: ParsedCsvRow[] = item.errorReport && item.errorReport.length > 0
                                ? item.errorReport
                                : [
                                    {
                                      rowIndex: 1,
                                      fullName: "Sample Flagged Contact",
                                      whatsappNumber: "98765",
                                      email: "",
                                      tags: "",
                                      marketingBudget: "",
                                      marketingGoal: "",
                                      status: "INVALID",
                                      issue: "Country code missing",
                                      suggestedFix: "Prefix with country code (e.g. 91)",
                                    },
                                  ];
                              downloadErrorReportCsv(errorRows, item.fileName);
                            }}
                            className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                            title="Download Error Report CSV"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Error Report</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Report Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Import Job Details</h3>
                  <p className="text-xs text-muted-foreground">{selectedRecord.fileName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRecord(null)}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border bg-muted/20 p-3">
                <p className="text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <p className="text-muted-foreground">Total Rows</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {selectedRecord.totalRows.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border bg-emerald-500/10 p-3">
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">Successfully Imported</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedRecord.importedCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border bg-rose-500/10 p-3">
                <p className="text-rose-700 dark:text-rose-400 font-medium">Failed / Excluded</p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  {selectedRecord.failedCount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Job Metadata */}
            <div className="rounded-xl border bg-card p-3.5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Imported By:</span>
                <span className="font-medium text-foreground">{selectedRecord.importedBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Execution Date:</span>
                <span className="font-medium text-foreground">{formatDate(selectedRecord.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Duplicate Strategy Applied:</span>
                <span className="font-mono text-primary font-semibold">{selectedRecord.strategy || "SKIP"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Skipped Duplicates:</span>
                <span className="font-medium text-foreground">{selectedRecord.skippedCount || 0}</span>
              </div>
            </div>

            {/* Error Report Actions if available */}
            {selectedRecord.failedCount > 0 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    {selectedRecord.failedCount} rows encountered errors during import
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Download the detailed error report CSV to review and correct issues.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const errorRows: ParsedCsvRow[] = selectedRecord.errorReport && selectedRecord.errorReport.length > 0
                      ? selectedRecord.errorReport
                      : [
                          {
                            rowIndex: 1,
                            fullName: "Sample Flagged Contact",
                            whatsappNumber: "98765",
                            email: "",
                            tags: "",
                            marketingBudget: "",
                            marketingGoal: "",
                            status: "INVALID",
                            issue: "Country code missing",
                            suggestedFix: "Prefix with country code (e.g. 91)",
                          },
                        ];
                    downloadErrorReportCsv(errorRows, selectedRecord.fileName);
                  }}
                  className="text-xs h-8 gap-1.5 shadow-xs shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Error CSV
                </Button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecord(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
