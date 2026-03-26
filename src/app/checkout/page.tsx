"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, SubscriptionPlan, ShippingInfo, OrderData } from "@/types/cart";
import { calculateTotal } from "@/types/cart";

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  "one-time": "One-Time Purchase",
  "bi-monthly": "Bi-Monthly Subscription",
  annual: "Annual Subscription",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [plan, setPlan] = useState<SubscriptionPlan>("one-time");
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [shipping, setShipping] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    const storedItems = sessionStorage.getItem("cartItems");
    const storedPlan = sessionStorage.getItem("subscriptionPlan");

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

    setLoaded(true);
  }, [router]);

  const updateField = useCallback(
    (field: keyof ShippingInfo, value: string) => {
      setShipping((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const isFormValid =
    shipping.firstName.trim() !== "" &&
    shipping.lastName.trim() !== "" &&
    shipping.email.trim() !== "" &&
    shipping.address.trim() !== "" &&
    shipping.city.trim() !== "" &&
    shipping.country.trim() !== "" &&
    shipping.postalCode.trim() !== "";

  const handlePlaceOrder = useCallback(() => {
    if (!isFormValid || submitting) return;

    setSubmitting(true);

    const { subtotal, discount, total } = calculateTotal(items, plan);

    const order: OrderData = {
      items,
      subscription: plan,
      subtotal,
      discount,
      total,
      shipping,
    };

    sessionStorage.setItem("orderData", JSON.stringify(order));
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("subscriptionPlan");

    router.push("/confirmation");
  }, [isFormValid, submitting, items, plan, shipping, router]);

  if (!loaded) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Loading checkout...</div>
      </div>
    );
  }

  const { subtotal, discount, total } = calculateTotal(items, plan);

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <span className="checkout-label">Checkout</span>
        <h1 className="checkout-title">Complete Your Order</h1>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h2 className="checkout-section-title">Shipping Information</h2>

          <div className="checkout-form-row">
            <div className="checkout-field">
              <label className="checkout-field-label" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="checkout-input"
                value={shipping.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div className="checkout-field">
              <label className="checkout-field-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="checkout-input"
                value={shipping.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="checkout-field">
            <label className="checkout-field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="checkout-input"
              value={shipping.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="checkout-field">
            <label className="checkout-field-label" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="checkout-input"
              value={shipping.address}
              onChange={(e) => updateField("address", e.target.value)}
              autoComplete="street-address"
            />
          </div>

          <div className="checkout-form-row">
            <div className="checkout-field">
              <label className="checkout-field-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className="checkout-input"
                value={shipping.city}
                onChange={(e) => updateField("city", e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div className="checkout-field">
              <label className="checkout-field-label" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                className="checkout-input"
                value={shipping.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                autoComplete="postal-code"
              />
            </div>
          </div>

          <div className="checkout-field">
            <label className="checkout-field-label" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              type="text"
              className="checkout-input"
              value={shipping.country}
              onChange={(e) => updateField("country", e.target.value)}
              autoComplete="country-name"
            />
          </div>

          <button
            type="button"
            className="checkout-place-order"
            onClick={handlePlaceOrder}
            disabled={!isFormValid || submitting}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        <div className="checkout-sidebar">
          <h2 className="checkout-sidebar-title">Order Summary</h2>

          <div className="checkout-sidebar-items">
            {items.map((item) => (
              <div key={item.productId} className="checkout-sidebar-item">
                <div>
                  <span className="checkout-sidebar-item-category">{item.category}</span>
                  <span className="checkout-sidebar-item-name">{item.productName}</span>
                </div>
                <span className="checkout-sidebar-item-price">${item.price}</span>
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
              <span>${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="checkout-sidebar-row checkout-sidebar-discount">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="checkout-sidebar-row checkout-sidebar-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => router.push("/cart")}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
