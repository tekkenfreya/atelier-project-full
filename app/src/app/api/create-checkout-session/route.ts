import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";
import type { FragranceOption, ProductCategory } from "@/features/consultation/types";
import type { CurrencyCode } from "@/lib/regions";
import { DEFAULT_CURRENCY, getAllSupportedCountries, isSupportedCountry } from "@/lib/regions";

interface CheckoutCartItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  price: number;
  skinType?: string;
  fragranceOption?: FragranceOption;
  currency?: CurrencyCode;
}

interface CheckoutRequestBody {
  items: CheckoutCartItem[];
  plan: "one-time" | "bi-monthly" | "annual";
  currency?: CurrencyCode;
  shipToCountry?: string;
  email?: string;
  userId?: string;
  customerName?: string;
}

const SUBSCRIPTION_DISCOUNT = 0.2;

const BUNDLE_PRICE_CENTS: Record<CurrencyCode, number> = {
  EUR: 11500,
  USD: 12900,
  GBP: 9900,
};

const CATEGORY_SHARES_CENTS: Record<CurrencyCode, Record<ProductCategory, number>> = {
  EUR: { Cleanser: 2300, Serum: 5000, Moisturizer: 4100 },
  USD: { Cleanser: 2600, Serum: 5500, Moisturizer: 4600 },
  GBP: { Cleanser: 2000, Serum: 4400, Moisturizer: 3600 },
};

function getItemPriceCents(
  item: CheckoutCartItem,
  isBundle: boolean,
  isSubscription: boolean,
  currency: CurrencyCode
): number {
  if (isBundle) {
    const shares = CATEGORY_SHARES_CENTS[currency];
    const fullShare = shares[item.category];
    const sharesSum = shares.Cleanser + shares.Serum + shares.Moisturizer;
    const bundleShare = Math.round((fullShare / sharesSum) * BUNDLE_PRICE_CENTS[currency]);

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

function resolveCurrency(body: CheckoutRequestBody): CurrencyCode {
  if (body.currency) return body.currency;
  const fromItem = body.items.find((i) => i.currency)?.currency;
  return fromItem ?? DEFAULT_CURRENCY;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();
    const { items, plan, shipToCountry, email, userId, customerName } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!plan || !["one-time", "bi-monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid subscription plan" }, { status: 400 });
    }

    const currency = resolveCurrency(body);
    if (!BUNDLE_PRICE_CENTS[currency]) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const isBundle = items.length === 3;
    const isSubscription = plan !== "one-time";
    const stripeCurrency = currency.toLowerCase();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const unitAmount = getItemPriceCents(item, isBundle, isSubscription, currency);

      if (isSubscription) {
        const interval: "month" | "year" = plan === "annual" ? "year" : "month";
        const intervalCount = plan === "annual" ? 1 : 2;

        return {
          price_data: {
            currency: stripeCurrency,
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
          currency: stripeCurrency,
          product_data: {
            name: `${item.category} — ${item.productName}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      };
    });

    const itemsMetadata = JSON.stringify(
      items.map((item) => ({
        pid: item.productId,
        n: item.productName,
        c: item.category,
        p: item.price,
        s: item.skinType ?? null,
        f: item.fragranceOption ?? null,
      })),
    );

    const allowedCountries = getAllSupportedCountries();
    // Omitting `payment_method_types` makes Stripe Checkout auto-display the
    // payment methods enabled in the Dashboard, matched against the customer's
    // location, currency, and device. This is Stripe's "automatic payment
    // methods" behavior — no SDK flag needed in v21.
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? "subscription" : "payment",
      line_items: lineItems,
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: allowedCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      metadata: {
        plan,
        currency,
        items: itemsMetadata,
        userId: userId ?? "",
        customerName: customerName ?? "",
      },
    };

    if (shipToCountry && isSupportedCountry(shipToCountry)) {
      sessionParams.metadata!.shipToCountry = shipToCountry;
    }

    if (isSubscription) {
      sessionParams.subscription_data = {
        metadata: {
          plan,
          currency,
          items: itemsMetadata,
          userId: userId ?? "",
          customerName: customerName ?? "",
        },
      };
    }

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
