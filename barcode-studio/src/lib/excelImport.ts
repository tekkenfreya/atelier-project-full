import * as XLSX from "xlsx";
import { computeCheckDigit, stripNonDigits } from "./gtin";

export interface ParsedExcelImport {
  /** Unique, validated 13-digit GTINs found anywhere in the workbook. */
  gtins: string[];
  /** Detected brand owner if a recognisable header is present, else null. */
  brand: string | null;
  /** First 7 digits of the first GTIN — the GS1 BG company prefix. */
  prefix: string | null;
  /** Country guessed from the prefix (e.g. "Bulgaria" for 380). */
  country: string | null;
  /** Total cells scanned across every sheet. */
  cellsScanned: number;
  /** GTIN-shaped strings that failed check-digit validation (informational). */
  invalidCount: number;
}

/**
 * Parse a GS1-Bulgaria–style registration template into a clean GTIN
 * import payload. Implementation is structure-agnostic: walks every
 * cell of every sheet, pulls anything that looks like a 13-digit
 * number, validates the GS1 mod-10 check digit, dedupes, and sorts.
 *
 * The official GS1 BG export keeps the issued GTIN block as a data-
 * validation source list inside the workbook's shared strings rather
 * than in the visible table — that's why we scan everything.
 */
export async function parseGtinsFromExcel(file: File): Promise<ParsedExcelImport> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  let cellsScanned = 0;
  let invalidCount = 0;
  const gtinSet = new Set<string>();

  // Brand owner: look for a header that contains "brand owner" /
  // "собственик на марка" and capture the value next to it.
  let brandOwner: string | null = null;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
    });

    // First pass: find brand owner from header/value adjacency
    for (const row of rows) {
      for (let i = 0; i < row.length; i++) {
        const value = row[i];
        if (value == null) continue;
        const text = String(value).trim();
        if (!text) continue;

        const lower = text.toLowerCase();
        if (
          !brandOwner &&
          (lower.includes("brand owner") ||
            lower.includes("собственик на марка"))
        ) {
          // Take the next non-null value in the same row as the brand value.
          const next = row.slice(i + 1).find((c) => c != null);
          if (next != null) {
            const nextText = String(next).trim();
            if (nextText) brandOwner = nextText;
          }
        }
      }
    }

    // Second pass: collect GTINs anywhere in the sheet
    for (const row of rows) {
      for (const cell of row) {
        cellsScanned++;
        if (cell == null) continue;
        const digits = stripNonDigits(String(cell));
        if (digits.length !== 13) continue;
        if (!isValidEan13(digits)) {
          invalidCount++;
          continue;
        }
        gtinSet.add(digits);
      }
    }
  }

  const gtins = Array.from(gtinSet).sort();
  const prefix = gtins.length > 0 ? gtins[0].slice(0, 7) : null;
  const country = prefix ? countryForPrefix(prefix) : null;

  return {
    gtins,
    brand: brandOwner,
    prefix,
    country,
    cellsScanned,
    invalidCount,
  };
}

function isValidEan13(gtin: string): boolean {
  if (!/^\d{13}$/.test(gtin)) return false;
  const body = gtin.slice(0, 12);
  return Number(gtin[12]) === computeCheckDigit(body);
}

function countryForPrefix(prefix: string): string | null {
  // Minimal lookup — covers the cases we expect for this brand. Full
  // GS1 country prefix table is in lib/gtin.ts; we mirror the relevant
  // ones here to avoid adding a coupling import for a one-shot label.
  const first3 = Number(prefix.slice(0, 3));
  if (first3 === 380) return "Bulgaria";
  if (first3 >= 300 && first3 <= 379) return "France";
  if (first3 >= 400 && first3 <= 440) return "Germany";
  if (first3 >= 500 && first3 <= 509) return "United Kingdom";
  if (first3 >= 800 && first3 <= 839) return "Italy";
  return null;
}
