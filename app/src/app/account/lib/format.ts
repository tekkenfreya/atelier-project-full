import type { RitualCategory } from "./types";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatConcern(concern: string): string {
  return capitalize(concern.replace(/-/g, " "));
}

export function formatConcernList(concerns: string[]): string {
  const formatted = concerns.map(formatConcern);
  if (formatted.length <= 1) return formatted.join("");
  if (formatted.length === 2) return formatted.join(" and ");
  return formatted.slice(0, -1).join(", ") + ", and " + formatted[formatted.length - 1];
}

export function formatProductName(firstName: string | null, category: RitualCategory): string {
  if (firstName && firstName.trim().length > 0) {
    return `${firstName.trim()}'s ${category}`;
  }
  return `Your ${category}`;
}

export const PLAN_LABELS: Record<string, string> = {
  "one-time": "One-Time",
  "bi-monthly": "Bi-Monthly",
  annual: "Annual",
};

export const FRAGRANCE_LABELS: Record<string, string> = {
  F0: "No fragrance",
  F1: "Light, fresh botanical",
  F2: "Warm, earthy undertones",
};

export const ROMAN = ["I", "II", "III", "IV", "V"];
