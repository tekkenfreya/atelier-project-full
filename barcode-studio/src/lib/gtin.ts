export type Symbology = "ean13" | "upca" | "itf14";

export interface SymbologySpec {
  id: Symbology;
  label: string;
  length: number;
  bwipName: string;
}

export const SYMBOLOGIES: SymbologySpec[] = [
  { id: "ean13", label: "EAN-13", length: 13, bwipName: "ean13" },
  { id: "upca", label: "UPC-A", length: 12, bwipName: "upca" },
  { id: "itf14", label: "ITF-14", length: 14, bwipName: "itf14" },
];

export function getSpec(sym: Symbology): SymbologySpec {
  const spec = SYMBOLOGIES.find((s) => s.id === sym);
  if (!spec) throw new Error(`Unknown symbology: ${sym}`);
  return spec;
}

export function stripNonDigits(input: string): string {
  return input.replace(/\D+/g, "");
}

export function computeCheckDigit(digitsWithoutCheck: string): number {
  const digits = digitsWithoutCheck.split("").map(Number);
  let sum = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    const weight = (digits.length - 1 - i) % 2 === 0 ? 3 : 1;
    sum += digits[i] * weight;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

const GS1_PREFIXES: Array<[number, number, string]> = [
  [0, 139, "United States / Canada"],
  [300, 379, "France / Monaco"],
  [380, 380, "Bulgaria"],
  [383, 383, "Slovenia"],
  [385, 385, "Croatia"],
  [400, 440, "Germany"],
  [450, 459, "Japan"],
  [460, 469, "Russia"],
  [471, 471, "Taiwan"],
  [474, 474, "Estonia"],
  [475, 475, "Latvia"],
  [476, 476, "Azerbaijan"],
  [477, 477, "Lithuania"],
  [478, 478, "Uzbekistan"],
  [479, 479, "Sri Lanka"],
  [480, 480, "Philippines"],
  [481, 481, "Belarus"],
  [482, 482, "Ukraine"],
  [484, 484, "Moldova"],
  [485, 485, "Armenia"],
  [486, 486, "Georgia"],
  [487, 487, "Kazakhstan"],
  [489, 489, "Hong Kong"],
  [490, 499, "Japan"],
  [500, 509, "United Kingdom"],
  [520, 521, "Greece"],
  [528, 528, "Lebanon"],
  [529, 529, "Cyprus"],
  [530, 530, "Albania"],
  [531, 531, "North Macedonia"],
  [535, 535, "Malta"],
  [539, 539, "Ireland"],
  [540, 549, "Belgium / Luxembourg"],
  [560, 560, "Portugal"],
  [569, 569, "Iceland"],
  [570, 579, "Denmark / Faroe / Greenland"],
  [590, 590, "Poland"],
  [594, 594, "Romania"],
  [599, 599, "Hungary"],
  [600, 601, "South Africa"],
  [640, 649, "Finland"],
  [690, 699, "China"],
  [700, 709, "Norway"],
  [729, 729, "Israel"],
  [730, 739, "Sweden"],
  [750, 750, "Mexico"],
  [754, 755, "Canada"],
  [760, 769, "Switzerland / Liechtenstein"],
  [800, 839, "Italy"],
  [840, 849, "Spain / Andorra"],
  [858, 858, "Slovakia"],
  [859, 859, "Czech Republic"],
  [860, 860, "Serbia"],
  [869, 869, "Turkey"],
  [870, 879, "Netherlands"],
  [880, 880, "South Korea"],
  [885, 885, "Thailand"],
  [888, 888, "Singapore"],
  [890, 890, "India"],
  [893, 893, "Vietnam"],
  [896, 896, "Pakistan"],
  [899, 899, "Indonesia"],
  [900, 919, "Austria"],
  [930, 939, "Australia"],
  [940, 949, "New Zealand"],
  [955, 955, "Malaysia"],
];

export function lookupPrefixCountry(gtin: string): string | null {
  const digits = stripNonDigits(gtin);
  if (digits.length < 3) return null;
  const prefix = Number(digits.slice(0, 3));
  for (const [lo, hi, country] of GS1_PREFIXES) {
    if (prefix >= lo && prefix <= hi) return country;
  }
  return null;
}

export interface ValidationResult {
  ok: boolean;
  full: string | null;
  checkDigit: number | null;
  error: string | null;
}

export function validate(input: string, sym: Symbology): ValidationResult {
  const digits = stripNonDigits(input);
  const spec = getSpec(sym);

  if (digits.length === 0) {
    return { ok: false, full: null, checkDigit: null, error: null };
  }

  if (digits.length === spec.length - 1) {
    const check = computeCheckDigit(digits);
    return { ok: true, full: digits + String(check), checkDigit: check, error: null };
  }

  if (digits.length === spec.length) {
    const body = digits.slice(0, -1);
    const provided = Number(digits.slice(-1));
    const expected = computeCheckDigit(body);
    if (provided === expected) {
      return { ok: true, full: digits, checkDigit: expected, error: null };
    }
    return {
      ok: false,
      full: null,
      checkDigit: expected,
      error: `Check digit mismatch — expected ${expected}`,
    };
  }

  return {
    ok: false,
    full: null,
    checkDigit: null,
    error: `Expected ${spec.length - 1} or ${spec.length} digits, got ${digits.length}`,
  };
}
