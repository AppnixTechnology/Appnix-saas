import { ParsedCsvRow, ValidationSummary, Contact, ImportRowStatus } from "./types";

/**
 * Sanitizes value to prevent CSV / Excel formula injection (CWE-1236)
 */
export function sanitizeCsvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  // If starts with =, +, -, @, \t, \r, prepend single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Escapes cell content for CSV format (quotes if containing commas, quotes, or newlines)
 */
export function escapeCsvField(val: string | number | null | undefined): string {
  const sanitized = sanitizeCsvCell(val);
  if (sanitized.includes(",") || sanitized.includes('"') || sanitized.includes("\n") || sanitized.includes("\r")) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

/**
 * Triggers a client-side file download for CSV content with UTF-8 BOM
 */
export function downloadCsv(filename: string, content: string): void {
  // Prepend UTF-8 BOM so Excel opens it with proper UTF-8 encoding
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads predefined sample CSV template
 */
export function downloadSampleCsvTemplate(): void {
  const headers = ["full_name", "whatsapp_number", "email", "tags", "marketing_budget", "marketing_goal"];
  const sampleRows = [
    ["Rahul Verma", "919911234578", "rahul@example.com", "VIP", "5000", "Brand Awareness"],
    ["Sneha Patel", "919876543210", "sneha@example.com", "Lead", "20000", "Enterprise Outreach"],
    ["Amit Sharma", "919812345678", "amit.sharma@example.com", "Prospect", "15000", "Lead Generation"],
    ["Priya Nair", "919765432109", "priya@example.com", "VIP", "8000", "Customer Retention"],
  ];

  const csvLines = [
    headers.join(","),
    ...sampleRows.map((row) => row.map(escapeCsvField).join(",")),
  ];

  downloadCsv("contacts_sample_template.csv", csvLines.join("\r\n"));
}

/**
 * Generates and downloads the Error Report CSV
 */
export function downloadErrorReportCsv(errorRows: ParsedCsvRow[], fileName: string = "contacts_error_report.csv"): void {
  const headers = ["Row Number", "Full Name", "WhatsApp Number", "Email", "Status", "Issue Description", "Suggested Fix"];
  const rows = errorRows.map((row) => [
    row.rowIndex,
    row.fullName,
    row.whatsappNumber,
    row.email,
    row.status,
    row.issue || "Invalid Data",
    row.suggestedFix || "Review row details",
  ]);

  const csvLines = [
    headers.join(","),
    ...rows.map((r) => r.map(escapeCsvField).join(",")),
  ];

  const reportFileName = fileName.replace(/\.csv$/i, "") + "_error_report.csv";
  downloadCsv(reportFileName, csvLines.join("\r\n"));
}

/**
 * Generates and downloads the complete Import Result Report
 */
export function downloadImportResultCsv(
  validRows: ParsedCsvRow[],
  invalidRows: ParsedCsvRow[],
  fileName: string = "import_result_report.csv"
): void {
  const headers = ["Row Number", "Full Name", "WhatsApp Number", "Email", "Tags", "Marketing Budget", "Marketing Goal", "Import Status", "Notes"];
  
  const allRows = [...validRows, ...invalidRows].sort((a, b) => a.rowIndex - b.rowIndex);
  const rows = allRows.map((row) => [
    row.rowIndex,
    row.fullName,
    row.whatsappNumber,
    row.email,
    row.tags,
    row.marketingBudget,
    row.marketingGoal,
    row.status,
    row.issue || "Imported successfully",
  ]);

  const csvLines = [
    headers.join(","),
    ...rows.map((r) => r.map(escapeCsvField).join(",")),
  ];

  downloadCsv(fileName, csvLines.join("\r\n"));
}

/**
 * Robust RFC-4180 CSV parser supporting quotes, commas in quotes, escaped quotes, multiline values, and BOM
 */
export function parseCSVText(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  // Strip BOM if present
  let cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) {
    return { headers: [], rows: [] };
  }

  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip LF of CRLF
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  // Push last cell & row if remaining
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = lines[0].map((h) => h.toLowerCase().trim().replace(/^['"]|['"]$/g, ""));
  const dataRows = lines.slice(1);

  const rows: Record<string, string>[] = dataRows.map((cols) => {
    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, colIdx) => {
      rowObj[header] = cols[colIdx] !== undefined ? cols[colIdx] : "";
    });
    return rowObj;
  });

  return { headers: rawHeaders, rows };
}

/**
 * Validates parsed CSV rows against CRM validation rules
 */
export function validateCsvContent(
  headers: string[],
  rows: Record<string, string>[],
  existingContacts: Contact[],
  fileName: string,
  fileSize: number
): ValidationSummary {
  const requiredHeaders = ["full_name", "whatsapp_number"];
  const allowedHeaders = ["full_name", "whatsapp_number", "email", "tags", "marketing_budget", "marketing_goal"];

  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());
  const missingColumns = requiredHeaders.filter((req) => !normalizedHeaders.includes(req));
  const unsupportedColumns = normalizedHeaders.filter((h) => h !== "" && !allowedHeaders.includes(h));
  const duplicateColumns = normalizedHeaders.filter((h, i, self) => h !== "" && self.indexOf(h) !== i);

  // Build existing DB phone lookup
  const existingPhonesMap = new Map<string, Contact>();
  existingContacts.forEach((c) => {
    const digits = c.whatsappNumber.replace(/\D/g, "");
    if (digits) {
      existingPhonesMap.set(digits, c);
    }
  });

  const seenPhonesInCsv = new Map<string, number>(); // phone -> rowIndex
  const validRows: ParsedCsvRow[] = [];
  const invalidRows: ParsedCsvRow[] = [];
  const duplicateRows: ParsedCsvRow[] = [];

  rows.forEach((row, idx) => {
    const rowIndex = idx + 2; // Row 1 is header
    const rawName = String(row.full_name || row.fullname || row.name || "").trim();
    const rawPhone = String(row.whatsapp_number || row.whatsappnumber || row.phone || "").trim();
    const rawEmail = String(row.email || "").trim();
    const rawTags = String(row.tags || "").trim();
    const rawBudget = String(row.marketing_budget || row.marketingbudget || row.budget || "").trim();
    const rawGoal = String(row.marketing_goal || row.marketinggoal || row.goal || "").trim();

    // Check if completely empty line
    if (!rawName && !rawPhone && !rawEmail && !rawTags && !rawBudget && !rawGoal) {
      return;
    }

    const issues: string[] = [];
    let status: ImportRowStatus = "VALID";
    let suggestedFix = "";

    // 1. Required Full Name Check
    if (!rawName) {
      issues.push("Full name is required");
      status = "INVALID";
      suggestedFix = "Provide contact full name";
    }

    // 2. Phone Number & Country Code Check
    const cleanDigits = rawPhone.replace(/\D/g, "");
    if (!rawPhone || !cleanDigits) {
      issues.push("WhatsApp number is required");
      status = "INVALID";
      suggestedFix = "Provide WhatsApp number with country code";
    } else if (cleanDigits.length < 10 || cleanDigits.length > 15) {
      issues.push(`Invalid phone length (${cleanDigits.length} digits, must be 10-15)`);
      status = "INVALID";
      suggestedFix = "Check country code and number format";
    } else if (cleanDigits.length === 10 && /^[6-9]/.test(cleanDigits)) {
      // 10 digits starting with 6, 7, 8, 9 is likely an Indian number missing country code 91
      issues.push("Country code missing");
      status = "INVALID";
      suggestedFix = "Add country code (e.g. 91" + cleanDigits + ")";
    }

    // 3. Email Check
    if (rawEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(rawEmail)) {
        issues.push("Invalid email address format");
        if (status !== "INVALID") {
          status = "INVALID";
          suggestedFix = "Fix email format (e.g. name@company.com)";
        }
      }
    }

    // 4. Duplicate Check
    if (cleanDigits && status !== "INVALID") {
      if (seenPhonesInCsv.has(cleanDigits)) {
        const firstSeen = seenPhonesInCsv.get(cleanDigits);
        issues.push(`Duplicate number in CSV (Same as Row ${firstSeen})`);
        status = "DUPLICATE";
        suggestedFix = "Remove duplicate entry or update data";
      } else {
        seenPhonesInCsv.set(cleanDigits, rowIndex);
      }

      if (existingPhonesMap.has(cleanDigits)) {
        issues.push("Contact already exists in CRM");
        status = "DUPLICATE";
        suggestedFix = 'Choose "Update Existing" or "Skip Duplicates"';
      }
    }

    // 5. Marketing Budget Format Check
    if (rawBudget) {
      const cleanBudget = rawBudget.replace(/[\$,\s]/g, "").toLowerCase();
      if (!/^\d+(\.\d+)?(k|m)?$/.test(cleanBudget)) {
        issues.push("Invalid marketing budget format");
        if (status === "VALID") {
          status = "WARNING";
          suggestedFix = "Use numbers or currency format like 5000 or $5,000";
        }
      }
    }

    const parsedRow: ParsedCsvRow = {
      rowIndex,
      fullName: rawName || "—",
      whatsappNumber: cleanDigits || rawPhone || "—",
      email: rawEmail,
      tags: rawTags,
      marketingBudget: rawBudget ? (rawBudget.startsWith("$") ? rawBudget : `$${rawBudget}`) : "$0",
      marketingGoal: rawGoal || "General Inquiries",
      status,
      issue: issues.join("; "),
      suggestedFix,
      originalData: row,
    };

    if (status === "INVALID") {
      invalidRows.push(parsedRow);
    } else if (status === "DUPLICATE") {
      duplicateRows.push(parsedRow);
      validRows.push(parsedRow); // can still be imported under UPDATE or NEW strategy
    } else {
      validRows.push(parsedRow);
    }
  });

  const totalRows = validRows.length + invalidRows.length;
  const validOnlyCount = validRows.filter((r) => r.status === "VALID" || r.status === "WARNING").length;
  const duplicateCount = duplicateRows.length;
  const invalidCount = invalidRows.length;

  return {
    fileName,
    fileSize,
    totalRows,
    validCount: validOnlyCount + duplicateCount,
    invalidCount,
    duplicateCount,
    validRows,
    invalidRows,
    duplicateRows,
    columnsValidation: {
      hasRequiredColumns: missingColumns.length === 0,
      missingColumns,
      unsupportedColumns,
      duplicateColumns,
    },
    summaryText: `${validOnlyCount + duplicateCount} contacts are ready to import. ${invalidCount + duplicateCount} rows require attention.`,
  };
}
