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
} from "./types";
import { extractSkinType, extractExclusions, filterProducts } from "./filters";
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
