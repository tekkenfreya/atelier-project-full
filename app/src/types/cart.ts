import type { FragranceOption, ProductCategory } from "@/features/consultation/types";

export interface CartItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  skinType: string;
  fragranceOption: FragranceOption;
  price: number;
}

export type SubscriptionPlan = "one-time" | "bi-monthly" | "annual";

export interface OrderData {
  items: CartItem[];
  subscription: SubscriptionPlan;
  subtotal: number;
  discount: number;
  total: number;
  shipping: ShippingInfo;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export const PRODUCT_PRICES: Record<ProductCategory, number> = {
  Cleanser: 23,
  Serum: 50,
  Moisturizer: 41,
};

export const BUNDLE_PRICE = 115;
export const SUBSCRIPTION_DISCOUNT = 0.2;
export const BIMONTHLY_BUNDLE_PRICE = 92;
export const ANNUAL_BUNDLE_PRICE = 552;

export function calculateSubtotal(items: CartItem[]): number {
  if (items.length === 3) {
    return BUNDLE_PRICE;
  }
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function calculateTotal(
  items: CartItem[],
  plan: SubscriptionPlan
): { subtotal: number; discount: number; total: number } {
  const subtotal = calculateSubtotal(items);

  if (plan === "one-time") {
    return { subtotal, discount: 0, total: subtotal };
  }

  if (items.length === 3) {
    if (plan === "bi-monthly") {
      return { subtotal, discount: subtotal - BIMONTHLY_BUNDLE_PRICE, total: BIMONTHLY_BUNDLE_PRICE };
    }
    return { subtotal, discount: subtotal - (ANNUAL_BUNDLE_PRICE / 6), total: ANNUAL_BUNDLE_PRICE / 6 };
  }

  const discount = subtotal * SUBSCRIPTION_DISCOUNT;
  const total = subtotal - discount;
  return { subtotal, discount, total };
}
