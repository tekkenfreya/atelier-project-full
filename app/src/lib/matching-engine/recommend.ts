import { supabase } from "@/lib/supabase";
import type {
  QuizAnswers,
  ProductWithIngredients,
  Recommendation,
  Product,
  ProductCategory,
  ProductIngredient,
  Ingredient,
  ScoredProduct,
  DebugRecommendation,
  DebugCategoryResult,
  ProductSummary,
  ExclusionReason,
} from "./types";
import { extractSkinType, extractExclusions, extractSafetyContext, filterProducts, normalizeSkinType } from "./filters";
import { extractConcerns, rankProducts } from "./scoring";

async function fetchAllProducts(): Promise<ProductWithIngredients[]> {
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, name, category, skin_type, product_level, concern_tags, safe_for_pregnancy, safe_for_rosacea, safe_for_eczema, contains_retinol, contains_bha, contains_pegs, contains_fragrance")
    .eq("product_level", "End Product")
    .in("category", ["Serum", "Cleanser", "Moisturizer"]);

  if (prodError || !products) return [];

  const productIds = products.map((p: Product) => p.id);

  const [piResult, ingResult] = await Promise.all([
    supabase
      .from("product_ingredients")
      .select("product_id, ingredient_id")
      .in("product_id", productIds),
    supabase
      .from("ingredients")
      .select("id, name, function, scientific_name, type, skincare_priorities"),
  ]);

  const piRows = piResult.data as ProductIngredient[] | null;
  const ingredients = ingResult.data as Ingredient[] | null;

  if (piResult.error || !piRows || ingResult.error || !ingredients) {
    return products.map((p: Product) => ({ ...p, ingredients: [] }));
  }

  const ingredientMap = new Map<string, Ingredient>();
  for (const ing of ingredients) {
    ingredientMap.set(ing.id, ing);
  }

  return products.map((product: Product) => {
    const productIngredientIds = piRows
      .filter((r: ProductIngredient) => r.product_id === product.id)
      .map((r: ProductIngredient) => r.ingredient_id);

    const productIngredients: Ingredient[] = [];
    for (const id of productIngredientIds) {
      const ing = ingredientMap.get(id);
      if (ing) productIngredients.push(ing);
    }

    return { ...product, ingredients: productIngredients };
  });
}

function pickBest(
  allProducts: ProductWithIngredients[],
  skinType: string,
  exclusions: string[],
  answers: QuizAnswers,
  category: ProductCategory
): { product: ScoredProduct | null; hasGap: boolean; gapMessage?: string } {
  const candidates = filterProducts(allProducts, skinType as "oily" | "dry" | "combination" | "sensitive", exclusions, answers, category);

  if (candidates.length === 0) {
    return {
      product: null,
      hasGap: true,
      gapMessage: `No ${category.toLowerCase()} available for your ${skinType} skin with those exclusions.`,
    };
  }

  const ranked = rankProducts(candidates, answers);
  return { product: ranked[0], hasGap: false };
}

export async function recommend(answers: QuizAnswers): Promise<Recommendation> {
  const skinType = extractSkinType(answers);
  const exclusions = extractExclusions(answers);
  const concerns = extractConcerns(answers);

  const allProducts = await fetchAllProducts();
  const gaps: string[] = [];

  const serumResult = pickBest(allProducts, skinType, exclusions, answers, "Serum");
  if (serumResult.hasGap && serumResult.gapMessage) gaps.push(serumResult.gapMessage);

  const cleanserResult = pickBest(allProducts, skinType, exclusions, answers, "Cleanser");
  if (cleanserResult.hasGap && cleanserResult.gapMessage) gaps.push(cleanserResult.gapMessage);

  const moisturizerResult = pickBest(allProducts, skinType, exclusions, answers, "Moisturizer");
  if (moisturizerResult.hasGap && moisturizerResult.gapMessage) gaps.push(moisturizerResult.gapMessage);

  return {
    serum: serumResult.product,
    cleanser: cleanserResult.product,
    moisturizer: moisturizerResult.product,
    skinType,
    concerns,
    gaps,
  };
}

function toProductSummary(p: ProductWithIngredients): ProductSummary {
  return {
    id: p.id,
    name: p.name,
    skinType: p.skin_type,
    concernTags: p.concern_tags ?? [],
  };
}

function debugCategory(
  allProducts: ProductWithIngredients[],
  skinType: string,
  exclusions: string[],
  answers: QuizAnswers,
  category: ProductCategory
): DebugCategoryResult {
  const normalizedSkinType = skinType as "oily" | "dry" | "combination" | "sensitive";

  // Gate 1: Skin type filter (category + skin type only)
  const gate1 = allProducts.filter((p) => {
    if (p.product_level !== "End Product") return false;
    if (p.category !== category) return false;
    if (normalizeSkinType(p.skin_type) !== normalizedSkinType) return false;
    return true;
  });

  // Gate 2: Safety exclusions
  const gate2 = filterProducts(allProducts, normalizedSkinType, exclusions, answers, category);

  // Build exclusion reasons for products removed in gate 2
  const safety = extractSafetyContext(answers);
  const exclusionReasons: ExclusionReason[] = [];
  for (const product of gate1) {
    const survivedGate2 = gate2.some((g) => g.id === product.id);
    if (!survivedGate2) {
      const reasons: string[] = [];
      if (safety.isPregnant && product.safe_for_pregnancy === false) reasons.push("Not safe for pregnancy");
      if (safety.isPregnant && product.contains_retinol) reasons.push("Contains retinol (pregnancy)");
      if (safety.hasRosacea && product.safe_for_rosacea === false) reasons.push("Not safe for rosacea");
      if (safety.hasEczema && product.safe_for_eczema === false) reasons.push("Not safe for eczema");
      if (safety.hasEczema && product.contains_fragrance) reasons.push("Contains fragrance (eczema)");
      if (product.contains_retinol && exclusions.includes("Retinol / retinoids")) reasons.push("User excluded retinol");
      if (product.contains_bha && exclusions.includes("Exfoliating acids (AHA, BHA)")) reasons.push("User excluded BHA/AHA");
      if (product.contains_pegs && exclusions.includes("PEGs")) reasons.push("User excluded PEGs");

      if (reasons.length === 0) reasons.push("Excluded by ingredient-level check");

      exclusionReasons.push({
        productId: product.id,
        productName: product.name,
        reason: reasons.join("; "),
      });
    }
  }

  // Gate 3: Scoring — score ALL candidates, not just winner
  let allScored: ScoredProduct[] = [];
  let winner: ScoredProduct | null = null;
  let hasGap = false;
  let gapMessage: string | undefined;

  if (gate2.length === 0) {
    hasGap = true;
    gapMessage = `No ${category.toLowerCase()} available for your ${skinType} skin with those exclusions.`;
  } else {
    allScored = rankProducts(gate2, answers);
    winner = allScored[0];
  }

  return {
    category,
    gate1Passed: gate1.map(toProductSummary),
    gate2Passed: gate2.map(toProductSummary),
    allScored,
    winner,
    exclusionReasons,
    hasGap,
    gapMessage,
  };
}

export async function recommendDebug(answers: QuizAnswers): Promise<DebugRecommendation> {
  const skinType = extractSkinType(answers);
  const exclusions = extractExclusions(answers);
  const concerns = extractConcerns(answers);
  const safety = extractSafetyContext(answers);

  const allProducts = await fetchAllProducts();

  const categories: DebugCategoryResult[] = [];
  const gaps: string[] = [];

  for (const category of ["Serum", "Cleanser", "Moisturizer"] as ProductCategory[]) {
    const result = debugCategory(allProducts, skinType, exclusions, answers, category);
    categories.push(result);
    if (result.hasGap && result.gapMessage) gaps.push(result.gapMessage);
  }

  const finalResults: Recommendation = {
    serum: categories.find((c) => c.category === "Serum")?.winner ?? null,
    cleanser: categories.find((c) => c.category === "Cleanser")?.winner ?? null,
    moisturizer: categories.find((c) => c.category === "Moisturizer")?.winner ?? null,
    skinType,
    concerns,
    gaps,
  };

  return {
    skinType,
    concerns,
    exclusions,
    safetyContext: safety,
    categories,
    finalResults,
  };
}
