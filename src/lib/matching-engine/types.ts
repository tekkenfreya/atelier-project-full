import type { AnswerValue } from "@/data/quizQuestions";

export interface Product {
  id: string;
  name: string;
  category: string;
  skin_type: string;
  product_level: string;
  concern_tags: string[] | null;
  safe_for_pregnancy: boolean | null;
  safe_for_rosacea: boolean | null;
  safe_for_eczema: boolean | null;
  contains_retinol: boolean | null;
  contains_bha: boolean | null;
  contains_pegs: boolean | null;
  contains_fragrance: boolean | null;
}

export interface ProductIngredient {
  product_id: string;
  ingredient_id: string;
}

export interface Ingredient {
  id: string;
  name: string;
  function: string | null;
  scientific_name: string | null;
  type: string | null;
  skincare_priorities: string[] | null;
}

export type SkincarePriority =
  | "Anti-aging"
  | "Brightening"
  | "Hydration"
  | "Calming"
  | "Clarifying"
  | "Repair";

export interface ProductWithIngredients extends Product {
  ingredients: Ingredient[];
}

export type QuizAnswers = Record<number, AnswerValue>;

export type SkinType = "oily" | "dry" | "combination" | "sensitive";

export type Concern =
  | "acne"
  | "hyperpigmentation"
  | "brightening"
  | "anti-aging"
  | "anti-aging-gentle"
  | "calming"
  | "hydration"
  | "repair"
  | "oil-control"
  | "antioxidant";

export interface ScoredProduct {
  product: ProductWithIngredients;
  score: number;
  matchedConcerns: Concern[];
  reasons: string[];
}

export type FragranceOption = "F0" | "F1" | "F2";

export type ProductCategory = "Serum" | "Cleanser" | "Moisturizer";

export interface CategoryResult {
  product: ScoredProduct | null;
  hasGap: boolean;
  gapMessage?: string;
}

export interface Recommendation {
  serum: ScoredProduct | null;
  cleanser: ScoredProduct | null;
  moisturizer: ScoredProduct | null;
  skinType: SkinType;
  concerns: Concern[];
  gaps: string[];
}
