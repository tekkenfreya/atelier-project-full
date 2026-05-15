import type { Concern, FragranceOption, ProductCategory } from "@/features/consultation/types";
import type { CurrencyCode } from "@/lib/regions";
import { DEFAULT_CURRENCY } from "@/lib/regions";

export interface CartItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  skinType: string;
  fragranceOption: FragranceOption;
  price: number;
  currency?: CurrencyCode;
  matchedConcerns?: Concern[];
}

export type SubscriptionPlan = "one-time" | "bi-monthly" | "annual";

export interface OrderData {
  items: CartItem[];
  subscription: SubscriptionPlan;
  subtotal: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
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

export const PRODUCT_PRICES: Record<CurrencyCode, Record<ProductCategory, number>> = {
  EUR: { Cleanser: 23, Serum: 50, Moisturizer: 41 },
  USD: { Cleanser: 26, Serum: 55, Moisturizer: 46 },
  GBP: { Cleanser: 20, Serum: 44, Moisturizer: 36 },
};

export const BUNDLE_PRICE: Record<CurrencyCode, number> = {
  EUR: 115,
  USD: 129,
  GBP: 99,
};

export const SUBSCRIPTION_DISCOUNT = 0.2;

export const BIMONTHLY_BUNDLE_PRICE: Record<CurrencyCode, number> = {
  EUR: 92,
  USD: 103,
  GBP: 79,
};

export const ANNUAL_BUNDLE_PRICE: Record<CurrencyCode, number> = {
  EUR: 552,
  USD: 619,
  GBP: 475,
};

function resolveCurrency(items: CartItem[], explicit?: CurrencyCode): CurrencyCode {
  if (explicit) return explicit;
  const fromItems = items.find((i) => i.currency)?.currency;
  return fromItems ?? DEFAULT_CURRENCY;
}

export function calculateSubtotal(items: CartItem[], currency?: CurrencyCode): number {
  const c = resolveCurrency(items, currency);
  if (items.length === 3) return BUNDLE_PRICE[c];
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function calculateTotal(
  items: CartItem[],
  plan: SubscriptionPlan,
  currency?: CurrencyCode
): { subtotal: number; discount: number; total: number } {
  const c = resolveCurrency(items, currency);
  const subtotal = calculateSubtotal(items, c);

  if (plan === "one-time") {
    return { subtotal, discount: 0, total: subtotal };
  }

  if (items.length === 3) {
    if (plan === "bi-monthly") {
      const total = BIMONTHLY_BUNDLE_PRICE[c];
      return { subtotal, discount: subtotal - total, total };
    }
    const total = ANNUAL_BUNDLE_PRICE[c] / 6;
    return { subtotal, discount: subtotal - total, total };
  }

  const discount = subtotal * SUBSCRIPTION_DISCOUNT;
  const total = subtotal - discount;
  return { subtotal, discount, total };
}
