import type {
  ProductWithIngredients,
  QuizAnswers,
  Concern,
  ScoredProduct,
} from "./types";
import { getProductConcerns } from "./ingredient-map";

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

const PRIORITY_CONCERN_MAP: Record<string, Concern> = {
  "Anti-aging (wrinkles, firmness, elasticity)": "anti-aging",
  "Brightening (even tone, radiance)": "brightening",
  "Hydration (plump, dewy, moisturised)": "hydration",
  "Calming (reduce redness, soothe irritation)": "calming",
  "Clarifying (control oil, minimise breakouts)": "acne",
  "Repair (strengthen barrier, heal damage)": "repair",
};

export function extractConcerns(answers: QuizAnswers): Concern[] {
  const concerns = new Set<Concern>();

  // Q12: Skin concerns (multi-select)
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
  // Q24: Drag-rank priority (array of strings in order)
  const q24 = answers[24] as string[] | undefined;
  if (!q24 || !Array.isArray(q24)) return [];

  const ranked: Concern[] = [];
  for (const item of q24) {
    const concern = PRIORITY_CONCERN_MAP[item];
    if (concern) ranked.push(concern);
  }
  return ranked;
}

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

function getProductConcernsFromTags(tags: string[]): Concern[] {
  const concerns = new Set<Concern>();
  for (const tag of tags) {
    const concern = CONCERN_TAG_MAP[tag];
    if (concern) concerns.add(concern);
  }
  return Array.from(concerns);
}

export function scoreProduct(
  product: ProductWithIngredients,
  concerns: Concern[],
  priorityRanking: Concern[]
): ScoredProduct {
  const hasConcernTags = product.concern_tags && product.concern_tags.length > 0;
  const productConcerns = hasConcernTags
    ? getProductConcernsFromTags(product.concern_tags!)
    : getProductConcerns(product.ingredients.map((i) => i.name));

  let score = 0;
  const matchedConcerns: Concern[] = [];
  const reasons: string[] = [];

  // Score concern overlap
  for (const concern of concerns) {
    if (productConcerns.includes(concern)) {
      // Check priority ranking for multiplier
      const rankIndex = priorityRanking.indexOf(concern);
      let multiplier = 1;
      if (rankIndex === 0) multiplier = 3;
      else if (rankIndex === 1) multiplier = 2;
      else if (rankIndex === 2) multiplier = 1.5;

      score += 10 * multiplier;
      matchedConcerns.push(concern);
    }
  }

  // Generate reasons
  if (matchedConcerns.length > 0) {
    const concernLabels = matchedConcerns.map(formatConcern);
    reasons.push(`Formulated for ${concernLabels.join(", ")}`);
  }

  // Bonus for matching top priority
  if (priorityRanking.length > 0 && productConcerns.includes(priorityRanking[0])) {
    reasons.push(`Matched to your top priority`);
  }

  // Bonus for number of active ingredients
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

  return products
    .map((p) => scoreProduct(p, concerns, priorityRanking))
    .sort((a, b) => b.score - a.score);
}
