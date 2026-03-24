import { supabase } from "@/lib/supabase";
import type {
  QuizAnswers,
  ProductWithIngredients,
  Recommendation,
  Product,
  ProductIngredient,
  Ingredient,
} from "./types";
import { extractSkinType, extractExclusions, filterProducts } from "./filters";
import { extractConcerns, rankProducts } from "./scoring";

async function fetchSerumProducts(): Promise<ProductWithIngredients[]> {
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, name, category, skin_type, product_level, concern_tags")
    .eq("category", "Serum")
    .eq("product_level", "End Product");

  if (prodError || !products) return [];

  const productIds = products.map((p: Product) => p.id);

  const [piResult, ingResult] = await Promise.all([
    supabase
      .from("product_ingredients")
      .select("product_id, ingredient_id")
      .in("product_id", productIds),
    supabase
      .from("ingredients")
      .select("id, name, function, scientific_name, type"),
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

export async function recommend(answers: QuizAnswers): Promise<Recommendation> {
  const skinType = extractSkinType(answers);
  const exclusions = extractExclusions(answers);
  const concerns = extractConcerns(answers);

  const allProducts = await fetchSerumProducts();
  const candidates = filterProducts(allProducts, skinType, exclusions);

  // Scenario 1: No matches — gap
  if (candidates.length === 0) {
    return {
      serum: null,
      skinType,
      concerns,
      hasGap: true,
      gapMessage: `We don't yet have a serum for your ${skinType} skin with those specific exclusions. New formulations are in development, so check back soon.`,
    };
  }

  // Score and pick best candidate
  const ranked = rankProducts(candidates, answers);
  return {
    serum: ranked[0],
    skinType,
    concerns,
    hasGap: false,
  };
}
