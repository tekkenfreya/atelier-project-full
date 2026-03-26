"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderData } from "@/types/cart";

const PLAN_LABELS: Record<string, string> = {
  "one-time": "One-Time Purchase",
  "bi-monthly": "Bi-Monthly Subscription",
  annual: "Annual Subscription",
};

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("orderData");
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const parsed: OrderData = JSON.parse(stored);
      setOrder(parsed);
    } catch {
      router.push("/");
      return;
    }

    setLoaded(true);
  }, [router]);

  if (!loaded || !order) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="23" stroke="var(--accent)" strokeWidth="1.5" />
          <path
            d="M14 24L21 31L34 17"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="confirmation-header">
        <span className="confirmation-label">Thank You</span>
        <h1 className="confirmation-title">Order Confirmed</h1>
        <p className="confirmation-subtitle">
          A confirmation email will be sent to {order.shipping.email}
        </p>
      </div>

      <div className="confirmation-summary">
        <h2 className="confirmation-summary-title">Order Summary</h2>

        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.productId} className="confirmation-item">
              <div>
                <span className="confirmation-item-category">{item.category}</span>
                <span className="confirmation-item-name">{item.productName}</span>
              </div>
              <span className="confirmation-item-price">${item.price}</span>
            </div>
          ))}
        </div>

        <div className="confirmation-divider" />

        <div className="confirmation-detail-row">
          <span>Plan</span>
          <span>{PLAN_LABELS[order.subscription] ?? order.subscription}</span>
        </div>

        <div className="confirmation-detail-row">
          <span>Shipping to</span>
          <span>
            {order.shipping.firstName} {order.shipping.lastName}, {order.shipping.city}
          </span>
        </div>

        <div className="confirmation-divider" />

        <div className="confirmation-totals">
          <div className="confirmation-detail-row">
            <span>Subtotal</span>
            <span>${order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="confirmation-detail-row confirmation-discount">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="confirmation-detail-row confirmation-total">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button
          type="button"
          className="confirmation-btn"
          onClick={() => router.push("/")}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
