/**
 * Single source of truth for country → currency → region.
 * Phase 1 covers Europe (EUR), United Kingdom (GBP), and Americas (USD).
 * Phase 2 (Asia-Pacific) entries are kept as commented stubs below —
 * uncomment, enable the matching payment methods in the Stripe Dashboard,
 * and add per-currency pricing in `types/cart.ts` to activate.
 */

export type CurrencyCode = "EUR" | "GBP" | "USD";
// Phase 2: | "JPY" | "SGD" | "AUD" | "HKD"

export type RegionId = "europe" | "uk" | "americas";
// Phase 2: | "asia-pacific-premium" | "asia-pacific-card"

export interface CountryEntry {
  code: string;
  name: string;
  flag: string;
}

export interface RegionConfig {
  id: RegionId;
  label: string;
  currency: CurrencyCode;
  currencySymbol: string;
  countries: CountryEntry[];
}

export const REGIONS: readonly RegionConfig[] = [
  {
    id: "europe",
    label: "Europe",
    currency: "EUR",
    currencySymbol: "€",
    countries: [
      { code: "AT", name: "Austria", flag: "🇦🇹" },
      { code: "BE", name: "Belgium", flag: "🇧🇪" },
      { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
      { code: "CH", name: "Switzerland", flag: "🇨🇭" },
      { code: "DE", name: "Germany", flag: "🇩🇪" },
      { code: "ES", name: "Spain", flag: "🇪🇸" },
      { code: "FR", name: "France", flag: "🇫🇷" },
      { code: "IT", name: "Italy", flag: "🇮🇹" },
      { code: "NL", name: "Netherlands", flag: "🇳🇱" },
    ],
  },
  {
    id: "uk",
    label: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    countries: [{ code: "GB", name: "United Kingdom", flag: "🇬🇧" }],
  },
  {
    id: "americas",
    label: "Americas",
    currency: "USD",
    currencySymbol: "$",
    countries: [
      { code: "US", name: "United States", flag: "🇺🇸" },
      { code: "CA", name: "Canada", flag: "🇨🇦" },
    ],
  },

  // ─── Phase 2 (uncomment to activate) ──────────────────────────────────────
  // Requires: per-currency pricing entries in types/cart.ts, payment methods
  // enabled in Stripe Dashboard, and shipping logistics confirmed for the
  // countries listed.
  //
  // {
  //   id: "asia-pacific-premium",
  //   label: "Japan",
  //   currency: "JPY",
  //   currencySymbol: "¥",
  //   countries: [{ code: "JP", name: "Japan", flag: "🇯🇵" }],
  // },
  // {
  //   id: "asia-pacific-card",
  //   label: "Asia-Pacific",
  //   currency: "SGD",
  //   currencySymbol: "S$",
  //   countries: [
  //     { code: "SG", name: "Singapore", flag: "🇸🇬" },
  //     { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  //     { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  //   ],
  // },
  // {
  //   id: "oceania",
  //   label: "Australia & NZ",
  //   currency: "AUD",
  //   currencySymbol: "A$",
  //   countries: [
  //     { code: "AU", name: "Australia", flag: "🇦🇺" },
  //     { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  //   ],
  // },
];

export const DEFAULT_COUNTRY = "DE";
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";

const COUNTRY_INDEX: Map<string, RegionConfig> = (() => {
  const map = new Map<string, RegionConfig>();
  for (const region of REGIONS) {
    for (const c of region.countries) map.set(c.code, region);
  }
  return map;
})();

export function getRegionForCountry(country: string): RegionConfig | null {
  return COUNTRY_INDEX.get(country) ?? null;
}

export function getCurrencyForCountry(country: string): CurrencyCode {
  return COUNTRY_INDEX.get(country)?.currency ?? DEFAULT_CURRENCY;
}

export function getCountryEntry(country: string): CountryEntry | null {
  const region = COUNTRY_INDEX.get(country);
  if (!region) return null;
  return region.countries.find((c) => c.code === country) ?? null;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  for (const region of REGIONS) {
    if (region.currency === currency) return region.currencySymbol;
  }
  return currency;
}

export function getAllSupportedCountries(): string[] {
  return REGIONS.flatMap((r) => r.countries.map((c) => c.code));
}

export function isSupportedCountry(country: string): boolean {
  return COUNTRY_INDEX.has(country);
}

export function formatPrice(amount: number, currency: CurrencyCode, fractionDigits = 0): string {
  return `${getCurrencySymbol(currency)}${amount.toFixed(fractionDigits)}`;
}
