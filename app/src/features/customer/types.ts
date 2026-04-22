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
  printed_at?: string | null;
  fulfilled_at?: string | null;
  next_shipment_at?: string | null;
  shipping_name?: string | null;
  shipping_email?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_country?: string | null;
  shipping_postal_code?: string | null;
  user_id?: string | null;
}

export interface OrderItemExtended extends OrderItem {
  productId: string;
  skinType?: string;
  fragranceOption?: string;
}
