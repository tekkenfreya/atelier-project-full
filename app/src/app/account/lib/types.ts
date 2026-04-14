export type RitualVariant = "cleanser" | "serum" | "moisturizer";
export type RitualCategory = "Cleanser" | "Serum" | "Moisturizer";

export interface RitualItem {
  variant: RitualVariant;
  category: RitualCategory;
  tagline: string;
}

export interface QuizResult {
  id: string;
  skin_type: string;
  concerns: string[];
  recommended_serum: string | null;
  recommended_cleanser: string | null;
  recommended_moisturizer: string | null;
  fragrance_choice: string | null;
  created_at: string;
}

export interface OrderItem {
  productName: string;
  category: string;
  price: number;
}

export interface CustomerOrder {
  id: string;
  items: OrderItem[];
  subscription_plan: string;
  total: number;
  status: string;
  created_at: string;
}
