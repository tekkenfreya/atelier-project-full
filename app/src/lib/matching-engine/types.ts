import type { AnswerValue } from "@/data/quizQuestions";

export interface Product {
  id: string;
  name: string;
  category: string;
  skin_type: string;
  product_level: string;
  concern_tags: string[] | null;
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
}

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

export interface Recommendation {
  serum: ScoredProduct | null;
  skinType: SkinType;
  concerns: Concern[];
  hasGap: boolean;
  gapMessage?: string;
}
