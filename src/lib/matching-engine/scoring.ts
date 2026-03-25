import type {
  ProductWithIngredients,
  QuizAnswers,
  Concern,
  ScoredProduct,
  SkincarePriority,
} from "./types";
import { getProductConcerns } from "./ingredient-map";

// Skincare priority → internal concern code (for fallback when no concern tags)
const PRIORITY_TO_CONCERN: Record<string, Concern> = {
  "Anti-aging": "anti-aging",
  "Brightening": "brightening",
  "Hydration": "hydration",
  "Calming": "calming",
  "Clarifying": "acne",
  "Repair": "repair",
};

// Q12 concern options → internal concern codes (for concern tag matching)
const QUIZ_CONCERN_MAP: Record<string, Concern> = {
  "Breakouts or blemishes": "acne",
  "Dryness or dehydration": "hydration",
  "Oiliness or excess shine": "oil-control",
  "Fine lines or wrinkles": "anti-aging",
  "Lack of firmness": "anti-aging",
  "Uneven skin tone or dark spots": "hyperpigmentation",
  "Enlarged pores": "oil-control",
  "Redness or irritation": "calming",
  "Dullness or tired-looking skin": "brightening",
  "Sensitivity or reactivity": "calming",
  "Under-eye concerns (dark circles, puffiness)": "brightening",
  "Texture irregularities": "repair",
};

// Q24 priority options → SkincarePriority strings (match DB values)
const Q24_PRIORITY_MAP: Record<string, SkincarePriority> = {
  "Anti-aging (wrinkles, firmness, elasticity)": "Anti-aging",
  "Brightening (even tone, radiance)": "Brightening",
  "Hydration (plump, dewy, moisturised)": "Hydration",
  "Calming (reduce redness, soothe irritation)": "Calming",
  "Clarifying (control oil, minimise breakouts)": "Clarifying",
  "Repair (strengthen barrier, heal damage)": "Repair",
};

// Q24 priority options → internal concern codes (for concern tag matching)
const PRIORITY_CONCERN_MAP: Record<string, Concern> = {
  "Anti-aging (wrinkles, firmness, elasticity)": "anti-aging",
  "Brightening (even tone, radiance)": "brightening",
  "Hydration (plump, dewy, moisturised)": "hydration",
  "Calming (reduce redness, soothe irritation)": "calming",
  "Clarifying (control oil, minimise breakouts)": "acne",
  "Repair (strengthen barrier, heal damage)": "repair",
};

// Concern tag strings → internal concern codes
const CONCERN_TAG_MAP: Record<string, Concern> = {
  "Breakouts or blemishes": "acne",
  "Dryness or dehydration": "hydration",
  "Oiliness or excess shine": "oil-control",
  "Fine lines or wrinkles": "anti-aging",
  "Lack of firmness": "anti-aging",
  "Uneven skin tone or dark spots": "hyperpigmentation",
  "Enlarged pores": "oil-control",
  "Redness or irritation": "calming",
  "Dullness or tired-looking skin": "brightening",
  "Sensitivity or reactivity": "calming",
  "Under-eye concerns (dark circles, puffiness)": "brightening",
  "Texture irregularities": "repair",
};

export function extractConcerns(answers: QuizAnswers): Concern[] {
  const concerns = new Set<Concern>();
  const q12 = answers[12] as string[] | undefined;
  if (q12 && Array.isArray(q12)) {
    for (const item of q12) {
      const concern = QUIZ_CONCERN_MAP[item];
      if (concern) concerns.add(concern);
    }
  }
  return Array.from(concerns);
}

export function extractPriorityRanking(answers: QuizAnswers): Concern[] {
  const q24 = answers[24] as string[] | undefined;
  if (!q24 || !Array.isArray(q24)) return [];
  const ranked: Concern[] = [];
  for (const item of q24) {
    const concern = PRIORITY_CONCERN_MAP[item];
    if (concern) ranked.push(concern);
  }
  return ranked;
}

function extractSkincarePriorities(answers: QuizAnswers): SkincarePriority[] {
  const q24 = answers[24] as string[] | undefined;
  if (!q24 || !Array.isArray(q24)) return [];
  const ranked: SkincarePriority[] = [];
  for (const item of q24) {
    const priority = Q24_PRIORITY_MAP[item];
    if (priority) ranked.push(priority);
  }
  return ranked;
}

function getProductConcernsFromTags(tags: string[]): Concern[] {
  const concerns = new Set<Concern>();
  for (const tag of tags) {
    const concern = CONCERN_TAG_MAP[tag];
    if (concern) concerns.add(concern);
  }
  return Array.from(concerns);
}

function getProductConcernsFromIngredientPriorities(product: ProductWithIngredients): Concern[] {
  const concerns = new Set<Concern>();
  for (const ingredient of product.ingredients) {
    if (ingredient.skincare_priorities && ingredient.skincare_priorities.length > 0) {
      for (const p of ingredient.skincare_priorities) {
        const concern = PRIORITY_TO_CONCERN[p];
        if (concern) concerns.add(concern);
      }
    }
  }
  return Array.from(concerns);
}

function getProductPrioritiesFromIngredients(product: ProductWithIngredients): SkincarePriority[] {
  const priorities = new Set<SkincarePriority>();
  for (const ingredient of product.ingredients) {
    if (ingredient.skincare_priorities && ingredient.skincare_priorities.length > 0) {
      for (const p of ingredient.skincare_priorities) {
        priorities.add(p as SkincarePriority);
      }
    }
  }
  return Array.from(priorities);
}

export function scoreProduct(
  product: ProductWithIngredients,
  concerns: Concern[],
  priorityRanking: Concern[],
  skincarePriorities: SkincarePriority[]
): ScoredProduct {
  let score = 0;
  const matchedConcerns: Concern[] = [];
  const reasons: string[] = [];

  // --- SCORING LAYER 1: Product concern tags (Q12 matching) ---
  // Determine product concerns — 2 sources in priority order:
  // 1. Product concern_tags (explicit, set by Kyrill in ERP)
  // 2. Ingredient skincare_priorities from DB (data-driven)
  // 3. Hardcoded ingredient map — DISABLED, kept for future use
  const hasConcernTags = product.concern_tags && product.concern_tags.length > 0;
  let productConcerns: Concern[];
  if (hasConcernTags) {
    productConcerns = getProductConcernsFromTags(product.concern_tags!);
  } else {
    productConcerns = getProductConcernsFromIngredientPriorities(product);
    // const fromHardcoded = getProductConcerns(product.ingredients.map((i) => i.name));
    // productConcerns = fromHardcoded; // DISABLED — use only when concern_tags and skincare_priorities are both empty
  }

  for (const concern of concerns) {
    if (productConcerns.includes(concern)) {
      const rankIndex = priorityRanking.indexOf(concern);
      let multiplier = 1;
      if (rankIndex === 0) multiplier = 3;
      else if (rankIndex === 1) multiplier = 2;
      else if (rankIndex === 2) multiplier = 1.5;

      score += 10 * multiplier;
      matchedConcerns.push(concern);
    }
  }

  if (matchedConcerns.length > 0) {
    const concernLabels = matchedConcerns.map(formatConcern);
    reasons.push(`Formulated for ${concernLabels.join(", ")}`);
  }

  if (priorityRanking.length > 0 && productConcerns.includes(priorityRanking[0])) {
    reasons.push("Matched to your top priority");
  }

  // --- SCORING LAYER 2: Ingredient skincare priorities (Q24 matching) ---
  const productPriorities = getProductPrioritiesFromIngredients(product);

  if (productPriorities.length > 0 && skincarePriorities.length > 0) {
    for (let i = 0; i < skincarePriorities.length; i++) {
      const customerPriority = skincarePriorities[i];
      if (productPriorities.includes(customerPriority)) {
        let multiplier = 1;
        if (i === 0) multiplier = 3;
        else if (i === 1) multiplier = 2;
        else if (i === 2) multiplier = 1.5;

        score += 5 * multiplier;

        if (i === 0) {
          reasons.push(`Ingredients aligned with your #1 priority: ${customerPriority}`);
        }
      }
    }
  }

  // --- BONUS: Active ingredient count ---
  const activeCount = product.ingredients.filter(
    (i) => i.function?.includes("Active") || i.function?.includes("Phase-Shot")
  ).length;
  score += activeCount * 2;

  return { product, score, matchedConcerns, reasons };
}

function formatConcern(concern: Concern): string {
  const labels: Record<Concern, string> = {
    acne: "breakouts & blemishes",
    hyperpigmentation: "dark spots",
    brightening: "dullness & uneven tone",
    "anti-aging": "fine lines & wrinkles",
    "anti-aging-gentle": "gentle anti-aging",
    calming: "redness & sensitivity",
    hydration: "hydration",
    repair: "barrier repair",
    "oil-control": "oil control",
    antioxidant: "antioxidant protection",
  };
  return labels[concern] || concern;
}

export function rankProducts(
  products: ProductWithIngredients[],
  answers: QuizAnswers
): ScoredProduct[] {
  const concerns = extractConcerns(answers);
  const priorityRanking = extractPriorityRanking(answers);
  const skincarePriorities = extractSkincarePriorities(answers);

  return products
    .map((p) => scoreProduct(p, concerns, priorityRanking, skincarePriorities))
    .sort((a, b) => b.score - a.score);
}
