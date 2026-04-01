import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import type { ProductCategory } from "@/lib/matching-engine/types";

interface CheckoutCartItem {
  productName: string;
  category: ProductCategory;
  price: number;
}

interface CheckoutRequestBody {
  items: CheckoutCartItem[];
  plan: "one-time" | "bi-monthly" | "annual";
  email?: string;
}

const SUBSCRIPTION_DISCOUNT = 0.2;
const BUNDLE_PRICE_CENTS = 12500;

function getItemPriceCents(item: CheckoutCartItem, isBundle: boolean, isSubscription: boolean): number {
  if (isBundle) {
    const categoryShare: Record<ProductCategory, number> = {
      Cleanser: 2500,
      Serum: 5500,
      Moisturizer: 4500,
    };
    const fullShare = categoryShare[item.category];
    const bundleShare = Math.round((fullShare / 12500) * BUNDLE_PRICE_CENTS);

    if (isSubscription) {
      return Math.round(bundleShare * (1 - SUBSCRIPTION_DISCOUNT));
    }
    return bundleShare;
  }

  const priceCents = item.price * 100;
  if (isSubscription) {
    return Math.round(priceCents * (1 - SUBSCRIPTION_DISCOUNT));
  }
  return priceCents;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();
    const { items, plan, email } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!plan || !["one-time", "bi-monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid subscription plan" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const isBundle = items.length === 3;
    const isSubscription = plan !== "one-time";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const unitAmount = getItemPriceCents(item, isBundle, isSubscription);

      if (isSubscription) {
        const interval: "month" | "year" = plan === "annual" ? "year" : "month";
        const intervalCount = plan === "annual" ? 1 : 2;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.category} — ${item.productName}`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval,
              interval_count: intervalCount,
            },
          },
          quantity: 1,
        };
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.category} — ${item.productName}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      };
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? "subscription" : "payment",
      line_items: lineItems,
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "NL", "DE", "FR", "BE", "AT", "CH", "IT", "ES"],
      },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
