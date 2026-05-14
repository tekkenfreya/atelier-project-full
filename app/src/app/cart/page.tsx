"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, SubscriptionPlan } from "@/types/cart";
import type { AnswerValue } from "@/data/quizQuestions";
import type { ProductCategory, SkinType } from "@/features/consultation/types";
import { calculateTotal } from "@/types/cart";
import { normalizeSkinType } from "@/features/consultation/filters";
import { formatConcern } from "@/features/consultation/scoring";
import TrustStrip from "@/components/TrustStrip";
import "./cart.css";

const PLAN_OPTIONS: {
  value: SubscriptionPlan;
  label: string;
  description: string;
  mostPopular?: boolean;
  reassurances: readonly string[];
}[] = [
  {
    value: "bi-monthly",
    label: "Bi-Monthly",
    description: "Delivered every 2 months",
    mostPopular: true,
    reassurances: ["Save 20% per shipment", "Skip or cancel anytime", "Priority dispatch"],
  },
  {
    value: "annual",
    label: "Annual",
    description: "6 shipments, billed once",
    reassurances: ["Save 20% per shipment", "Locked-in price", "Free priority dispatch"],
  },
  {
    value: "one-time",
    label: "One-Time",
    description: "Single delivery",
    reassurances: ["Full price", "No commitment", "Standard dispatch"],
  },
];

const FRAGRANCE_LABELS: Record<string, string> = {
  F0: "No fragrance",
  F1: "Light, fresh botanical notes",
  F2: "Warm, earthy undertones",
};

const SKIN_TYPE_LABEL: Record<SkinType, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  sensitive: "Sensitive",
};

const STEP_ORDER: ProductCategory[] = ["Cleanser", "Serum", "Moisturizer"];

function parseConcerns(answers: Record<number, AnswerValue> | null): string[] {
  if (!answers) return [];
  const q12 = answers[12];
  return Array.isArray(q12) ? q12 : [];
}

function getFragranceLabel(item: CartItem, answers: Record<number, AnswerValue> | null): string {
  const q31 = answers?.[31];
  if (typeof q31 === "string" && q31.length > 0) return q31;
  return FRAGRANCE_LABELS[item.fragranceOption] ?? item.fragranceOption;
}

function getCustomerSkinType(answers: Record<number, AnswerValue> | null): SkinType | null {
  const q11 = answers?.[11];
  if (typeof q11 !== "string") return null;
  const label = q11.includes(":") ? q11.split(":")[0].trim() : q11;
  return normalizeSkinType(label);
}

function buildReasonLine(item: CartItem): string {
  const concerns = item.matchedConcerns ?? [];
  if (concerns.length === 0) {
    const cleaned = item.skinType.toLowerCase().replace(" skin", "").trim();
    const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `Composed for ${cap.toLowerCase()} skin`;
  }
  const top = concerns.slice(0, 2).map(formatConcern);
  const joined = top.length === 2 ? `${top[0]} & ${top[1]}` : top[0];
  return `Selected for ${joined}`;
}

function sortByRoutine(items: CartItem[]): CartItem[] {
  return [...items].sort(
    (a, b) => STEP_ORDER.indexOf(a.category) - STEP_ORDER.indexOf(b.category)
  );
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [plan, setPlan] = useState<SubscriptionPlan>("bi-monthly");
  const [answers, setAnswers] = useState<Record<number, AnswerValue> | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let nextItems: CartItem[] = [];
    let nextAnswers: Record<number, AnswerValue> | null = null;
    let nextName: string | null = null;

    const stored = sessionStorage.getItem("cartItems");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) nextItems = parsed;
      } catch {
        nextItems = [];
      }
    }

    const storedAnswers = sessionStorage.getItem("quizAnswers");
    if (storedAnswers) {
      try {
        nextAnswers = JSON.parse(storedAnswers);
      } catch {
        nextAnswers = null;
      }
    }

    const name = sessionStorage.getItem("customerName");
    if (name && name.trim().length > 0) nextName = name.trim();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sessionStorage hydration on mount
    setItems(nextItems);
    setAnswers(nextAnswers);
    setCustomerName(nextName);
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

  const orderedItems = useMemo(() => sortByRoutine(items), [items]);
  const customerSkinType = useMemo(() => getCustomerSkinType(answers), [answers]);
  const topConcerns = useMemo(() => parseConcerns(answers).slice(0, 3), [answers]);
  const fragranceLabel = useMemo(
    () => (items.length > 0 ? getFragranceLabel(items[0], answers) : null),
    [items, answers]
  );

  const planTotals = useMemo(() => {
    if (items.length === 0) {
      return { "one-time": 0, "bi-monthly": 0, annual: 0 } as Record<SubscriptionPlan, number>;
    }
    return {
      "one-time": calculateTotal(items, "one-time").total,
      "bi-monthly": calculateTotal(items, "bi-monthly").total,
      annual: calculateTotal(items, "annual").total,
    };
  }, [items]);

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
  const biMonthlySavings = planTotals["one-time"] - planTotals["bi-monthly"];
  const annualSavingsPerShipment = planTotals["one-time"] - planTotals.annual;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <span className="cart-label">Your Routine</span>
        <h1 className="cart-title">
          {customerName ? `Composed for ${customerName}` : "Your routine"}
        </h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {/* ─── Routine summary panel ─── */}
          <section className="cart-routine-summary" aria-label="Routine summary">
            <span className="cart-routine-greeting">
              {customerName ? "Based on your consultation" : "From your consultation"}
            </span>
            <h2 className="cart-routine-headline">
              {orderedItems.length === 3
                ? "A three-step ritual, tailored to your skin."
                : `${orderedItems.length} formula${orderedItems.length === 1 ? "" : "s"}, tailored to your skin.`}
            </h2>

            <div className="cart-routine-meta">
              {customerSkinType && (
                <div className="cart-routine-row">
                  <span className="cart-routine-row-label">Skin type</span>
                  <div className="cart-routine-tags">
                    <span className="cart-routine-tag accent">
                      {SKIN_TYPE_LABEL[customerSkinType]}
                    </span>
                  </div>
                </div>
              )}

              {topConcerns.length > 0 && (
                <div className="cart-routine-row">
                  <span className="cart-routine-row-label">Targeting</span>
                  <div className="cart-routine-tags">
                    {topConcerns.map((c) => (
                      <span key={c} className="cart-routine-tag">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {fragranceLabel && (
                <div className="cart-routine-row">
                  <span className="cart-routine-row-label">Fragrance</span>
                  <div className="cart-routine-tags">
                    <span className="cart-routine-tag">{fragranceLabel}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─── Numbered routine steps ─── */}
          <ol className="cart-steps">
            {orderedItems.map((item, idx) => (
              <li key={item.productId} className="cart-step">
                <span className="cart-step-num" aria-hidden>
                  {idx + 1}
                </span>
                <div className="cart-step-info">
                  <span className="cart-step-cat">
                    Step {idx + 1} · {item.category}
                  </span>
                  <h3 className="cart-step-name">{item.productName}</h3>
                  <p className="cart-step-reason">{buildReasonLine(item)}</p>
                </div>
                <div className="cart-step-right">
                  <span className="cart-step-price">€{item.price}</span>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.productName}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {isBundle && (
            <div className="cart-bundle-note">
              Full routine bundle pricing applied
            </div>
          )}

          {/* ─── Subscription nudge banner ─── */}
          {plan === "one-time" && biMonthlySavings > 0 && (
            <div className="cart-encourage-banner" role="region" aria-label="Subscription savings">
              <div className="cart-encourage-text">
                Switch to bi-monthly and save{" "}
                <strong>€{biMonthlySavings.toFixed(0)}</strong> on every shipment —
                skip or cancel anytime.
              </div>
              <button
                type="button"
                className="cart-encourage-btn"
                onClick={() => setPlan("bi-monthly")}
              >
                Switch & save
              </button>
            </div>
          )}

          {/* ─── Plan options with savings inline ─── */}
          <div className="cart-plan-section">
            <h2 className="cart-plan-title">Choose your rhythm</h2>
            <div className="cart-plan-options">
              {PLAN_OPTIONS.map((opt) => {
                const planTotal = planTotals[opt.value];
                const savings = planTotals["one-time"] - planTotal;
                const showStrike = opt.value !== "one-time" && savings > 0;
                const priceSuffix =
                  opt.value === "annual" ? "/shipment" :
                  opt.value === "bi-monthly" ? "/shipment" : "";

                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={plan === opt.value}
                    className={`cart-plan-option${plan === opt.value ? " selected" : ""}${opt.mostPopular ? " is-popular" : ""}`}
                    onClick={() => setPlan(opt.value)}
                  >
                    {opt.mostPopular && (
                      <span className="cart-plan-popular">Most Popular</span>
                    )}
                    <span className="cart-plan-content">
                      <span className="cart-plan-label">{opt.label}</span>
                      <span className="cart-plan-desc">{opt.description}</span>

                      <span className="cart-plan-price-row">
                        <span className="cart-plan-price">
                          €{planTotal.toFixed(0)}
                        </span>
                        {priceSuffix && (
                          <span className="cart-plan-price-suffix">{priceSuffix}</span>
                        )}
                        {showStrike && (
                          <span className="cart-plan-price-strike">
                            €{planTotals["one-time"].toFixed(0)}
                          </span>
                        )}
                        {savings > 0 && (
                          <span className="cart-plan-savings">
                            Save €{savings.toFixed(0)}
                          </span>
                        )}
                      </span>

                      <ul className="cart-plan-reassurances">
                        {opt.reassurances.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </span>
                  </button>
                );
              })}
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

            {plan !== "one-time" && (
              <p className="cart-summary-continuity">
                Skin results compound over <strong>8–12 weeks</strong>.
                Subscriptions match your skin&apos;s cycle — skip or cancel anytime.
              </p>
            )}

            {plan === "one-time" && annualSavingsPerShipment > 0 && (
              <p className="cart-summary-continuity">
                You&apos;d save <strong>€{(annualSavingsPerShipment * 6).toFixed(0)}</strong>{" "}
                in the first year by subscribing.
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

          <TrustStrip />

          <button
            type="button"
            className="cart-back-btn"
            onClick={() => router.push("/results")}
          >
            Edit responses
          </button>
        </div>
      </div>
    </div>
  );
}
