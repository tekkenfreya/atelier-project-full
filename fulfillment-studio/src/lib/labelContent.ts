/**
 * Hardcoded label copy. Edit these values before going live.
 * Eventually these should move to a `label_settings` table in Supabase
 * so non-developers can edit them, but for the printing-tool MVP they
 * live as constants.
 */

export const MANUFACTURER = {
  name: "Atelier Rusalka",
  addressLine1: "[Street address]",
  addressLine2: "Sofia, Bulgaria",
  // Optional — shown beneath the address if present
  contact: "hello@atelier-rusalka.com",
};

/**
 * Per-category function statement and use instructions, printed on the
 * back of the label. Keys are case-insensitive (we lowercase before lookup).
 */
export const CATEGORY_COPY: Record<
  string,
  { function: string; instruction: string }
> = {
  cleanser: {
    function: "Personalised botanical cleanser",
    instruction:
      "Apply to damp skin morning and evening, massage gently, rinse with warm water.",
  },
  serum: {
    function: "Personalised concentrated serum",
    instruction:
      "Apply 2–3 drops to clean skin morning and evening before moisturiser.",
  },
  moisturizer: {
    function: "Personalised daily moisturiser",
    instruction:
      "Apply to clean skin morning and evening as the final step of your ritual.",
  },
};

const FALLBACK_COPY = {
  function: "Personalised cosmetic product",
  instruction: "Apply to clean skin as directed.",
};

export function copyForCategory(category: string | null | undefined) {
  if (!category) return FALLBACK_COPY;
  return CATEGORY_COPY[category.toLowerCase()] ?? FALLBACK_COPY;
}
