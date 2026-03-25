import type { ProductWithIngredients, ProductCategory, QuizAnswers, SkinType } from "./types";
import { getProductExcludables } from "./ingredient-map";

export function normalizeSkinType(raw: string): SkinType {
  const lower = raw.toLowerCase().replace(" skin", "").trim();
  if (lower === "oily") return "oily";
  if (lower === "dry") return "dry";
  if (lower === "combination") return "combination";
  if (lower === "sensitive") return "sensitive";
  return "combination";
}

export function extractSkinType(answers: QuizAnswers): SkinType {
  const q11 = answers[11] as string | undefined;
  if (!q11) return "combination";
  const label = q11.includes(":") ? q11.split(":")[0].trim() : q11;
  return normalizeSkinType(label);
}

export function extractExclusions(answers: QuizAnswers): string[] {
  const exclusions: string[] = [];

  // Q10: Pregnancy
  const q10 = answers[10] as string | undefined;
  if (q10 === "Yes") {
    exclusions.push("Retinol / retinoids");
  }

  // Q16: Skin conditions — safety exclusions
  const q16 = answers[16] as string[] | undefined;
  if (q16 && Array.isArray(q16)) {
    for (const condition of q16) {
      if (condition === "Rosacea or redness-prone skin") {
        if (!exclusions.includes("Exfoliating acids (AHA, BHA)")) {
          exclusions.push("Exfoliating acids (AHA, BHA)");
        }
      }
      if (condition === "Eczema or atopic dermatitis") {
        if (!exclusions.includes("Fragrance / essential oils")) {
          exclusions.push("Fragrance / essential oils");
        }
      }
    }
  }

  // Q29: Ingredient exclusions (multi-select)
  // "Fragrance / essential oils" is no longer a hard exclusion from Q29 —
  // fragrance is now a customer choice (F0/F1/F2) on the results page.
  const q29 = answers[29] as string[] | undefined;
  if (q29 && Array.isArray(q29)) {
    for (const item of q29) {
      if (item === "Fragrance / essential oils") continue;
      if (!exclusions.includes(item)) {
        exclusions.push(item);
      }
    }
  }

  return exclusions;
}

export function extractSafetyContext(answers: QuizAnswers): {
  isPregnant: boolean;
  hasRosacea: boolean;
  hasEczema: boolean;
} {
  const q10 = answers[10] as string | undefined;
  const isPregnant = q10 === "Yes";

  const q16 = answers[16] as string[] | undefined;
  let hasRosacea = false;
  let hasEczema = false;
  if (q16 && Array.isArray(q16)) {
    hasRosacea = q16.includes("Rosacea or redness-prone skin");
    hasEczema = q16.includes("Eczema or atopic dermatitis");
  }

  return { isPregnant, hasRosacea, hasEczema };
}

function isExcludedByFlags(
  product: ProductWithIngredients,
  safety: { isPregnant: boolean; hasRosacea: boolean; hasEczema: boolean },
  ingredientExclusions: string[]
): boolean {
  // Check product-level safety flags (from database)
  if (safety.isPregnant && product.safe_for_pregnancy === false) return true;
  if (safety.hasRosacea && product.safe_for_rosacea === false) return true;
  if (safety.hasEczema && product.safe_for_eczema === false) return true;

  // Check product-level content flags against Q29 exclusions
  if (product.contains_retinol && ingredientExclusions.includes("Retinol / retinoids")) return true;
  if (product.contains_bha && ingredientExclusions.includes("Exfoliating acids (AHA, BHA)")) return true;
  if (product.contains_pegs && ingredientExclusions.includes("PEGs")) return true;
  if (product.contains_fragrance && safety.hasEczema) return true;

  // Check pregnancy against content flags
  if (safety.isPregnant && product.contains_retinol) return true;

  return false;
}

export function filterProducts(
  products: ProductWithIngredients[],
  skinType: SkinType,
  exclusions: string[],
  answers: QuizAnswers,
  category: ProductCategory = "Serum"
): ProductWithIngredients[] {
  const safety = extractSafetyContext(answers);
  const ingredientExclusions = exclusions.filter(e => e !== "Fragrance / essential oils");

  return products.filter((product) => {
    // Must be End Product
    if (product.product_level !== "End Product") return false;

    // Must match category
    if (product.category !== category) return false;

    // Must match skin type
    if (normalizeSkinType(product.skin_type) !== skinType) return false;

    // Check 1: Product-level safety flags (from database)
    if (isExcludedByFlags(product, safety, ingredientExclusions)) return false;

    // Check 2: Ingredient-level exclusions (fallback for untagged products)
    if (exclusions.length > 0) {
      const ingredientNames = product.ingredients.map((i) => i.name);
      const productExcludables = getProductExcludables(ingredientNames);
      for (const exclusion of exclusions) {
        if (productExcludables.includes(exclusion)) return false;
      }
    }

    return true;
  });
}
