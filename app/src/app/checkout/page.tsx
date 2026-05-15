"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, SubscriptionPlan } from "@/types/cart";
import { calculateTotal } from "@/types/cart";
import { supabase } from "@/lib/supabase";
import TrustStrip from "@/components/TrustStrip";
import {
  DEFAULT_COUNTRY,
  getCurrencyForCountry,
  getCurrencySymbol,
  isSupportedCountry,
} from "@/lib/regions";

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  "one-time": "One-Time Purchase",
  "bi-monthly": "Bi-Monthly Subscription",
  annual: "Annual Subscription",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [plan, setPlan] = useState<SubscriptionPlan>("one-time");
  const [shipToCountry, setShipToCountry] = useState<string>(DEFAULT_COUNTRY);
  const [loaded, setLoaded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedItems = sessionStorage.getItem("cartItems");
    const storedPlan = sessionStorage.getItem("subscriptionPlan");
    const storedCountry = sessionStorage.getItem("shipToCountry");

    if (!storedItems) {
      router.push("/cart");
      return;
    }

    try {
      const parsed: CartItem[] = JSON.parse(storedItems);
      if (parsed.length === 0) {
        router.push("/cart");
        return;
      }
      setItems(parsed);
    } catch {
      router.push("/cart");
      return;
    }

    if (storedPlan === "bi-monthly" || storedPlan === "annual" || storedPlan === "one-time") {
      setPlan(storedPlan);
    }

    if (storedCountry && isSupportedCountry(storedCountry)) {
      setShipToCountry(storedCountry);
    }

    setLoaded(true);
  }, [router]);

  const currency = useMemo(() => getCurrencyForCountry(shipToCountry), [shipToCountry]);
  const symbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const handlePayWithStripe = useCallback(async () => {
    if (redirecting) return;

    setRedirecting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? undefined;
      const email = session?.user?.email ?? undefined;
      const customerName =
        (typeof window !== "undefined" && sessionStorage.getItem("customerName")) || undefined;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            price: item.price,
            skinType: item.skinType,
            fragranceOption: item.fragranceOption,
            currency: item.currency,
          })),
          plan,
          currency,
          shipToCountry,
          email,
          userId,
          customerName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setRedirecting(false);
    }
  }, [items, plan, currency, shipToCountry, redirecting]);

  if (!loaded) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Loading checkout...</div>
      </div>
    );
  }

  const { subtotal, discount, total } = calculateTotal(items, plan, currency);

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <span className="checkout-label">Checkout</span>
        <h1 className="checkout-title">Review Your Order</h1>
      </div>

      <div className="checkout-review">
        <div className="checkout-review-items">
          {items.map((item) => (
            <div key={item.productId} className="checkout-review-item">
              <div>
                <span className="checkout-review-item-category">{item.category}</span>
                <span className="checkout-review-item-name">{item.productName}</span>
              </div>
              <span className="checkout-review-item-price">{symbol}{item.price}</span>
            </div>
          ))}
        </div>

        <div className="checkout-sidebar-divider" />

        <div className="checkout-sidebar-plan">
          <span className="checkout-sidebar-plan-label">Plan</span>
          <span className="checkout-sidebar-plan-value">{PLAN_LABELS[plan]}</span>
        </div>

        <div className="checkout-sidebar-divider" />

        <div className="checkout-sidebar-totals">
          <div className="checkout-sidebar-row">
            <span>Subtotal</span>
            <span>{symbol}{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="checkout-sidebar-row checkout-sidebar-discount">
              <span>Subscription discount (20%)</span>
              <span>-{symbol}{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout-sidebar-row checkout-sidebar-total">
            <span>Total</span>
            <span>{symbol}{total.toFixed(2)}</span>
          </div>
        </div>

        {plan !== "one-time" && (
          <p className="checkout-recurring-note">
            {plan === "bi-monthly"
              ? `You will be charged ${symbol}${total.toFixed(2)} every 2 months.`
              : `You will be charged ${symbol}${total.toFixed(2)} annually.`}
          </p>
        )}

        {error && <p className="checkout-error">{error}</p>}

        <button
          type="button"
          className="checkout-stripe-btn"
          onClick={handlePayWithStripe}
          disabled={redirecting}
        >
          {redirecting ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </button>

        <TrustStrip />

        <button
          type="button"
          className="checkout-back-btn"
          onClick={() => router.push("/cart")}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
