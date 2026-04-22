"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { usePageTransition } from "@/hooks/usePageTransition";
import type {
  Recommendation,
  FragranceOption,
  ScoredProduct,
  ProductCategory,
  SkinType,
  Ingredient,
} from "@/features/consultation/types";
import type { AnswerValue } from "@/data/quizQuestions";
import type { CartItem } from "@/types/cart";
import { PRODUCT_PRICES, BUNDLE_PRICE, calculateTotal } from "@/types/cart";
import { supabase } from "@/lib/supabase";
import BotanicalCard from "@/components/results/BotanicalCard";
import type { BotanicalItem } from "@/components/results/ProductScene";

const ProductScene = dynamic(() => import("@/components/results/ProductScene"), {
  ssr: false,
  loading: () => <div className="rd-scene-container rd-scene-loading" />,
});

/* ─── Static Data ─── */

const SKIN_TYPE_DESCRIPTIONS: Record<SkinType, string> = {
  oily: "Your skin produces more sebum than average, particularly in the T-zone. Lightweight, oil-free textures work best. The good news: oily skin ages more slowly.",
  dry: "Your skin barrier needs extra support. Hydration and nourishment are key. Rich textures and barrier-strengthening ingredients will transform how your skin feels.",
  combination: "Your skin has dual needs — managing oil in some areas while nourishing others. We balance lightweight hydration with targeted treatment.",
  sensitive: "Your skin reacts easily to new ingredients and environmental stress. We focus on calming, barrier-supporting formulas with minimal irritation risk.",
};

const CONCERN_EXPLANATIONS: Record<string, string> = {
  "Breakouts or blemishes": "Active breakouts signal excess sebum and bacterial activity. We target this with clarifying actives that clear pores without stripping your barrier.",
  "Dryness or dehydration": "Your skin is losing moisture faster than it can replenish. We layer humectants and emollients to lock in hydration throughout the day.",
  "Oiliness or excess shine": "Overactive sebaceous glands need regulation, not suppression. We balance oil production with lightweight, mattifying actives.",
  "Fine lines or wrinkles": "Early signs of collagen breakdown. We introduce peptides and retinoid-class ingredients calibrated to your tolerance level.",
  "Lack of firmness": "Elastin and collagen fibres are losing density. We focus on firming botanicals and peptides that support structural integrity.",
  "Uneven skin tone or dark spots": "Post-inflammatory hyperpigmentation or sun damage. We use brightening actives that inhibit excess melanin production safely.",
  "Enlarged pores": "Pore visibility is driven by sebum output and skin elasticity. We refine texture with gentle exfoliants and pore-tightening botanicals.",
  "Redness or irritation": "Your skin barrier is compromised or reactive. We prioritise calming, anti-inflammatory ingredients that restore equilibrium.",
  "Dullness or tired-looking skin": "Cell turnover has slowed, and dead cells are accumulating. We boost radiance with gentle exfoliation and antioxidant-rich botanicals.",
  "Sensitivity or reactivity": "Your barrier function needs reinforcement. We use only well-tolerated, soothing ingredients to rebuild resilience.",
  "Under-eye concerns (dark circles, puffiness)": "The periorbital area is thinner and more vascular. We address circulation and fluid retention with targeted peptides.",
  "Texture irregularities": "Uneven texture comes from buildup, dehydration, or scarring. We smooth and resurface with calibrated exfoliation.",
};

/* ─── Helpers ─── */

function getFragranceFromAnswers(answers: Record<number, AnswerValue>): FragranceOption {
  const q31 = answers[31] as string | undefined;
  if (q31 === "No fragrance") return "F0";
  if (q31 === "Warm, earthy undertones") return "F2";
  if (q31 === "Light, fresh botanical notes") return "F1";
  return "F1";
}

function getCategoryFromProduct(product: ScoredProduct["product"]): ProductCategory {
  const cat = product.category?.toLowerCase() ?? "";
  if (cat.includes("cleanser")) return "Cleanser";
  if (cat.includes("moistur")) return "Moisturizer";
  return "Serum";
}

function parseConcerns(answers: Record<number, AnswerValue>): string[] {
  const q12 = answers[12];
  if (Array.isArray(q12)) return q12;
  return [];
}

function parsePriorities(answers: Record<number, AnswerValue>): string[] {
  const q24 = answers[24];
  if (Array.isArray(q24)) return q24;
  return [];
}

interface BotanicalEntry {
  ingredient: Ingredient;
  productName: string;
  category: ProductCategory;
}

function extractBotanicals(recommendation: Recommendation): BotanicalEntry[] {
  const entries: BotanicalEntry[] = [];
  const seen = new Set<string>();

  function addFromProduct(scored: ScoredProduct | null) {
    if (!scored) return;
    const category = getCategoryFromProduct(scored.product);
    for (const ing of scored.product.ingredients) {
      if (seen.has(ing.id)) continue;
      const fn = ing.function?.toLowerCase() ?? "";
      if (fn.includes("extract") || fn.includes("botanical")) {
        seen.add(ing.id);
        entries.push({ ingredient: ing, productName: scored.product.name, category });
      }
    }
  }

  addFromProduct(recommendation.cleanser);
  addFromProduct(recommendation.serum);
  addFromProduct(recommendation.moisturizer);
  return entries;
}

const FRAGRANCE_LABELS: Record<FragranceOption, string> = {
  F0: "No fragrance",
  F1: "Light, fresh botanical notes",
  F2: "Warm, earthy undertones",
};

/* ─── Tabs ─── */

type Tab = "analysis" | "regimen";

const TABS: { key: Tab; label: string }[] = [
  { key: "analysis", label: "Analysis" },
  { key: "regimen", label: "Regimen" },
];

/* ─── Component ─── */

interface SelectedProducts {
  cleanser: boolean;
  serum: boolean;
  moisturizer: boolean;
}

export default function ResultsPage() {
  const router = useRouter();
  const { go } = usePageTransition();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fragranceOption, setFragranceOption] = useState<FragranceOption>("F1");
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [selected, setSelected] = useState<SelectedProducts>({
    cleanser: true,
    serum: true,
    moisturizer: true,
  });
  const [plan, setPlan] = useState<"one-time" | "bi-monthly" | "annual">("one-time");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("analysis");

  const savedQuizRef = useRef(false);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  /* ─── Data fetching ─── */

  useEffect(() => {
    async function saveQuizResults(
      quizAnswers: Record<number, AnswerValue>,
      data: Recommendation,
      fragrance: FragranceOption
    ) {
      if (savedQuizRef.current) return;
      savedQuizRef.current = true;

      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;

        const answersKey = JSON.stringify(quizAnswers);
        const { data: existing } = await supabase
          .from("quiz_results")
          .select("id")
          .eq("user_id", authData.user.id)
          .eq("answers", answersKey)
          .limit(1);

        if (existing && existing.length > 0) return;

        await supabase.from("quiz_results").insert({
          user_id: authData.user.id,
          answers: quizAnswers,
          skin_type: data.skinType,
          concerns: data.concerns,
          recommended_serum: data.serum?.product.name ?? null,
          recommended_cleanser: data.cleanser?.product.name ?? null,
          recommended_moisturizer: data.moisturizer?.product.name ?? null,
          fragrance_choice: fragrance,
        });
      } catch {
        // Non-critical
      }
    }

    async function fetchRecommendation() {
      const stored = sessionStorage.getItem("quizAnswers");
      if (!stored) {
        router.push("/quiz");
        return;
      }

      try {
        const parsed: Record<number, AnswerValue> = JSON.parse(stored);
        setAnswers(parsed);
        const fragrance = getFragranceFromAnswers(parsed);
        setFragranceOption(fragrance);

        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: parsed }),
        });

        if (!res.ok) throw new Error("Failed to get recommendation");

        const data: Recommendation = await res.json();
        setRecommendation(data);

        setSelected({
          cleanser: data.cleanser !== null,
          serum: data.serum !== null,
          moisturizer: data.moisturizer !== null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  /* ─── Tab indicator slide ─── */

  useEffect(() => {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    const btn = tabButtonsRef.current[idx];
    const indicator = tabIndicatorRef.current;
    if (!btn || !indicator) return;

    gsap.to(indicator, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [activeTab]);

  /* ─── Tab content transition ─── */

  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab) return;
    const content = tabContentRef.current;
    if (!content) {
      setActiveTab(tab);
      return;
    }

    gsap.to(content, {
      opacity: 0,
      x: -20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        gsap.fromTo(
          content,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power4.out" }
        );
      },
    });
  }, [activeTab]);

  /* ─── Product selection ─── */

  const toggleProduct = useCallback((key: keyof SelectedProducts) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getSelectedItems = useCallback((): CartItem[] => {
    if (!recommendation) return [];

    const items: CartItem[] = [];
    const entries: [keyof SelectedProducts, ScoredProduct | null][] = [
      ["cleanser", recommendation.cleanser],
      ["serum", recommendation.serum],
      ["moisturizer", recommendation.moisturizer],
    ];

    for (const [key, scored] of entries) {
      if (!selected[key] || !scored) continue;
      const cat = getCategoryFromProduct(scored.product);
      items.push({
        productId: scored.product.id,
        productName: scored.product.name,
        category: cat,
        skinType: scored.product.skin_type,
        fragranceOption,
        price: PRODUCT_PRICES[cat],
      });
    }

    return items;
  }, [recommendation, selected, fragranceOption]);

  /* ─── Checkout ─── */

  const handleCheckout = useCallback(async () => {
    const items = getSelectedItems();
    if (items.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, plan }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(false);
    }
  }, [getSelectedItems, plan]);

  const handleContinueToCart = useCallback(() => {
    const items = getSelectedItems();
    if (items.length === 0) return;
    sessionStorage.setItem("cartItems", JSON.stringify(items));
    go("/cart");
  }, [getSelectedItems, go]);

  /* ─── Loading / Error ─── */

  if (loading) {
    return (
      <div className="rd-loading">
        <div className="rd-loading-inner">
          <div className="rd-loading-orb" />
          <h2 className="rd-loading-title">Analysing your skin profile</h2>
          <p className="rd-loading-desc">Matching botanicals to your skin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rd-loading">
        <div className="rd-loading-inner">
          <h2 className="rd-loading-title">Something went wrong</h2>
          <p className="rd-loading-desc">{error}</p>
          <button onClick={() => router.push("/quiz")} className="rd-btn-primary">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  /* ─── Derived data ─── */

  const skinType = recommendation.skinType;
  const skinTypeLabel = skinType.charAt(0).toUpperCase() + skinType.slice(1);
  const skinDescription = SKIN_TYPE_DESCRIPTIONS[skinType];
  const concerns = parseConcerns(answers);
  const priorities = parsePriorities(answers);
  const topPriority = priorities.length > 0 ? priorities[0] : null;
  const customerName = typeof window !== "undefined" ? sessionStorage.getItem("customerName") : null;
  const botanicals = extractBotanicals(recommendation);

  const availableCategories: string[] = [];
  if (recommendation.cleanser) availableCategories.push("Cleanser");
  if (recommendation.serum) availableCategories.push("Serum");
  if (recommendation.moisturizer) availableCategories.push("Moisturizer");

  const botanicalItems: BotanicalItem[] = botanicals.map((entry) => ({
    id: entry.ingredient.id,
    name: entry.ingredient.name,
    scientificName: entry.ingredient.scientific_name ?? undefined,
  }));

  const selectedItems = getSelectedItems();
  const selectedCount = selectedItems.length;
  const { subtotal } = calculateTotal(selectedItems, "one-time");
  const { total: subscriptionTotal } = calculateTotal(selectedItems, "bi-monthly");
  const { total: currentTotal, discount } = calculateTotal(selectedItems, plan);
  const isBundle = selectedCount === 3;

  const PLAN_OPTIONS = [
    { value: "one-time" as const, label: "One-Time", desc: "Full price" },
    { value: "bi-monthly" as const, label: "Bi-Monthly", desc: "20% off" },
    { value: "annual" as const, label: "Annual", desc: "20% off" },
  ];

  /* ─── Product detail for order panel ─── */

  const productEntries: { key: keyof SelectedProducts; scored: ScoredProduct | null; cat: ProductCategory }[] = [
    { key: "cleanser", scored: recommendation.cleanser, cat: "Cleanser" },
    { key: "serum", scored: recommendation.serum, cat: "Serum" },
    { key: "moisturizer", scored: recommendation.moisturizer, cat: "Moisturizer" },
  ];

  return (
    <div className="rd-page">
      {/* ═══ Left Panel ═══ */}
      <div className="rd-left">
        {/* Header */}
        <div className="rd-header">
          <span className="rd-label">Your Results</span>
          <h1 className="rd-title">
            {customerName ? `${customerName}\u2019s` : "Your"} Skin Profile
          </h1>
        </div>

        {/* 3D Botanical Carousel */}
        <div className="rd-scene-header">
          <span className="rd-label">Selected For Your Skin</span>
          <h2 className="rd-scene-title">Key Botanicals</h2>
        </div>
        <ProductScene botanicals={botanicalItems} />

        {/* Tab Navigation */}
        <div className="rd-tabs">
          <div className="rd-tabs-bar">
            {TABS.map((tab, i) => (
              <button
                key={tab.key}
                ref={(el) => { tabButtonsRef.current[i] = el; }}
                type="button"
                className={`rd-tab${activeTab === tab.key ? " rd-tab-active" : ""}`}
                onClick={() => switchTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
            <div ref={tabIndicatorRef} className="rd-tab-indicator" />
          </div>
        </div>

        {/* Tab Content */}
        <div ref={tabContentRef} className="rd-tab-content">
          {/* ─── Analysis Tab ─── */}
          {activeTab === "analysis" && (
            <div className="rd-analysis">
              <div className="rd-analysis-type">
                <span className="rd-label-sm">Skin Type</span>
                <h2 className="rd-analysis-type-name">{skinTypeLabel}</h2>
                <p className="rd-analysis-type-desc">{skinDescription}</p>
              </div>

              {concerns.length > 0 && (
                <div className="rd-analysis-concerns">
                  <span className="rd-label-sm">Your Concerns</span>
                  <div className="rd-concerns-list">
                    {concerns.map((concern) => (
                      <div key={concern} className="rd-concern">
                        <h3 className="rd-concern-name">{concern}</h3>
                        <p className="rd-concern-desc">
                          {CONCERN_EXPLANATIONS[concern] ?? "Factored into your formulation."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {topPriority && (
                <div className="rd-analysis-priority">
                  <span className="rd-label-sm">Top Priority</span>
                  <p className="rd-priority-text">
                    <strong>{topPriority}</strong> drives the hero active in your serum at maximum concentration.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── Regimen Tab ─── */}
          {activeTab === "regimen" && (
            <div className="rd-regimen">
              {productEntries.map(({ key, scored, cat }) => {
                if (!scored) return null;
                const product = scored.product;
                const actives = product.ingredients.filter(
                  (i) =>
                    i.function?.includes("Active") ||
                    i.function?.includes("Phase-Shot") ||
                    i.function?.includes("Extract")
                );

                return (
                  <div
                    key={key}
                    className={`rd-product-card${""}`}
                  >
                    <div className="rd-product-top">
                      <div>
                        <span className="rd-product-cat">{cat}</span>
                        <h3 className="rd-product-name">{product.name}</h3>
                        <p className="rd-product-skin">For {product.skin_type}</p>
                      </div>
                      <span className="rd-product-price">&euro;{PRODUCT_PRICES[cat]}</span>
                    </div>

                    <div className="rd-product-actives">
                      {actives.slice(0, 4).map((ing) => (
                        <span key={ing.id} className="rd-active-tag">{ing.name}</span>
                      ))}
                    </div>

                    <div className="rd-product-reasons">
                      {scored.reasons.map((reason, i) => (
                        <p key={i} className="rd-reason">{reason}</p>
                      ))}
                    </div>

                    <div className="rd-product-fragrance">
                      <span className="rd-label-xs">Fragrance</span>
                      <span className="rd-fragrance-val">{FRAGRANCE_LABELS[fragranceOption]}</span>
                    </div>
                  </div>
                );
              })}

              {recommendation.gaps.length > 0 && (
                <div className="rd-gaps">
                  {recommendation.gaps.map((gap, i) => (
                    <p key={i} className="rd-gap">{gap}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rd-footer">
          <button onClick={() => go("/quiz")} className="rd-btn-ghost">
            Retake Quiz
          </button>
          <a href="/report" className="rd-report-link">Detailed Report</a>
        </div>
      </div>

      {/* ═══ Right Panel — Order Summary ═══ */}
      <div className="rd-right">
        <div className="rd-order">
          <span className="rd-label">Your Order</span>

          {/* Product list */}
          <div className="rd-order-items">
            {productEntries.map(({ key, scored, cat }) => {
              if (!scored) return null;
              return (
                <div key={key} className="rd-order-item">
                  <button
                    type="button"
                    className={`rd-order-check${selected[key] ? " rd-order-check-on" : ""}`}
                    onClick={() => toggleProduct(key)}
                    aria-label={selected[key] ? `Remove ${cat}` : `Add ${cat}`}
                  >
                    {selected[key] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="rd-order-item-info">
                    <span className="rd-order-item-cat">{cat}</span>
                    <span className="rd-order-item-name">{scored.product.name}</span>
                  </div>
                  <span className={`rd-order-item-price${!selected[key] ? " rd-order-item-price-off" : ""}`}>
                    &euro;{PRODUCT_PRICES[cat]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing */}
          {selectedCount > 0 && (
            <>
              <div className="rd-order-pricing">
                <div className="rd-price-row">
                  <span>{isBundle ? "Full Routine" : `${selectedCount} product${selectedCount > 1 ? "s" : ""}`}</span>
                  <span className="rd-price-val">&euro;{subtotal}</span>
                </div>
                {isBundle && (
                  <p className="rd-price-save">
                    Bundle saves &euro;{(PRODUCT_PRICES.Cleanser + PRODUCT_PRICES.Serum + PRODUCT_PRICES.Moisturizer) - BUNDLE_PRICE}
                  </p>
                )}
                <div className="rd-price-row rd-price-sub">
                  <span>With subscription</span>
                  <span>&euro;{subscriptionTotal}<small> / shipment</small></span>
                </div>
              </div>

              {/* Plan selector */}
              <div className="rd-plan">
                <span className="rd-label-sm">Plan</span>
                <div className="rd-plan-btns">
                  {PLAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`rd-plan-btn${plan === opt.value ? " rd-plan-btn-on" : ""}`}
                      onClick={() => setPlan(opt.value)}
                    >
                      <span className="rd-plan-btn-name">{opt.label}</span>
                      <span className="rd-plan-btn-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="rd-order-total">
                {discount > 0 && (
                  <div className="rd-price-row">
                    <span>Discount</span>
                    <span className="rd-discount">-&euro;{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="rd-price-row rd-total-row">
                  <span>Total</span>
                  <span className="rd-total-val">&euro;{currentTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="rd-order-actions">
                <button
                  className="rd-btn-primary"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Redirecting..." : "Checkout"}
                </button>
                <button className="rd-btn-secondary" onClick={handleContinueToCart}>
                  View Cart
                </button>
              </div>
              {checkoutError && <p className="rd-checkout-err">{checkoutError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
