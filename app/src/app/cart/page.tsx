"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, SubscriptionPlan } from "@/types/cart";
import { calculateTotal } from "@/types/cart";

const PLAN_OPTIONS: { value: SubscriptionPlan; label: string; description: string }[] = [
  {
    value: "one-time",
    label: "One-Time Purchase",
    description: "No commitment, full price",
  },
  {
    value: "bi-monthly",
    label: "Bi-Monthly Subscription",
    description: "Delivered every 2 months, 20% off",
  },
  {
    value: "annual",
    label: "Annual Subscription",
    description: "6 shipments per year, 20% off, billed annually",
  },
];

const FRAGRANCE_LABELS: Record<string, string> = {
  F0: "No fragrance",
  F1: "Fragrance blend 1",
  F2: "Fragrance blend 2",
};

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [plan, setPlan] = useState<SubscriptionPlan>("one-time");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("cartItems");
    if (!stored) {
      setItems([]);
      setLoaded(true);
      return;
    }

    try {
      const parsed: CartItem[] = JSON.parse(stored);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }

    setLoaded(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.productId !== productId);
      sessionStorage.setItem("cartItems", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleCheckout = useCallback(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(items));
    sessionStorage.setItem("subscriptionPlan", plan);
    router.push("/checkout");
  }, [items, plan, router]);

  if (!loaded) {
    return (
      <div className="cart-container">
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <span className="cart-label">Review</span>
          <h1 className="cart-title">Your cart is empty</h1>
          <p className="cart-subtitle">
            Every formula begins with a consultation. Answer a few questions about
            your skin and we&apos;ll compose a ritual made for you.
          </p>
        </div>
        <div className="cart-empty-actions">
          <button
            type="button"
            className="cart-checkout-btn"
            onClick={() => router.push("/quiz")}
          >
            Begin the consultation →
          </button>
          <button
            type="button"
            className="cart-back-btn"
            onClick={() => router.push("/account")}
          >
            Go to your account
          </button>
          <button
            type="button"
            className="cart-back-btn"
            onClick={() => router.push("/")}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, discount, total } = calculateTotal(items, plan);
  const isBundle = items.length === 3;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <span className="cart-label">Review</span>
        <h1 className="cart-title">Your Cart</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-category">{item.category}</span>
                <h3 className="cart-item-name">{item.productName}</h3>
                <p className="cart-item-details">
                  {item.skinType} &middot; {FRAGRANCE_LABELS[item.fragranceOption] ?? item.fragranceOption}
                </p>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-price">€{item.price}</span>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.productName}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {isBundle && (
            <div className="cart-bundle-note">
              Full routine bundle pricing applied
            </div>
          )}

          <div className="cart-plan-section">
            <h2 className="cart-plan-title">Subscription Plan</h2>
            <div className="cart-plan-options">
              {PLAN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cart-plan-option${plan === opt.value ? " selected" : ""}`}
                  onClick={() => setPlan(opt.value)}
                >
                  <span className="cart-plan-radio">
                    {plan === opt.value && <span className="cart-plan-radio-dot" />}
                  </span>
                  <span className="cart-plan-content">
                    <span className="cart-plan-label">{opt.label}</span>
                    <span className="cart-plan-desc">{opt.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
              <span>€{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="cart-summary-row cart-summary-discount">
                <span>Subscription discount</span>
                <span>-€{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-row cart-summary-shipping">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>

            {plan === "annual" && items.length === 3 && (
              <p className="cart-summary-annual-note">
                Billed as €552 annually (6 shipments)
              </p>
            )}
          </div>

          <button
            type="button"
            className="cart-checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            className="cart-back-btn"
            onClick={() => router.push("/results")}
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
