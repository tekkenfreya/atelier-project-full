import type { ProductWithIngredients, QuizAnswers, SkinType } from "./types";
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

export function filterProducts(
  products: ProductWithIngredients[],
  skinType: SkinType,
  exclusions: string[]
): ProductWithIngredients[] {
  return products.filter((product) => {
    // Must be End Product
    if (product.product_level !== "End Product") return false;

    // Must be Serum
    if (product.category !== "Serum") return false;

    // Must match skin type
    if (normalizeSkinType(product.skin_type) !== skinType) return false;

    // Must not contain excluded ingredients
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
