"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/hooks/usePageTransition";
import type {
  Recommendation,
  FragranceOption,
  ScoredProduct,
  ProductCategory,
  SkinType,
  Ingredient,
} from "@/lib/matching-engine/types";
import type { AnswerValue } from "@/data/quizQuestions";
import type { CartItem } from "@/types/cart";
import { PRODUCT_PRICES, BUNDLE_PRICE, calculateTotal } from "@/types/cart";
import { supabase } from "@/lib/supabase";
import SerumCard from "@/components/results/SerumCard";

gsap.registerPlugin(ScrollTrigger);

/* ─── Static Data ─── */

const SKIN_TYPE_DESCRIPTIONS: Record<SkinType, string> = {
  oily: "Your skin produces more sebum than average, particularly in the T-zone. This means lightweight, oil-free textures work best. The good news: oily skin ages more slowly.",
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
        entries.push({
          ingredient: ing,
          productName: scored.product.name,
          category,
        });
      }
    }
  }

  addFromProduct(recommendation.cleanser);
  addFromProduct(recommendation.serum);
  addFromProduct(recommendation.moisturizer);

  return entries;
}

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
  const [showStickyBar, setShowStickyBar] = useState(false);

  const savedQuizRef = useRef(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

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

        saveQuizResults(parsed, data, fragrance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  /* ─── ScrollTrigger animations ─── */

  useEffect(() => {
    if (loading || !pageRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const triggers: ScrollTrigger[] = [];

    // Section reveals
    const sections = pageRef.current.querySelectorAll(".ur-section");
    sections.forEach((section) => {
      const elements = section.querySelectorAll(".ur-reveal");
      if (elements.length === 0) return;

      gsap.set(elements, { opacity: 0, y: 50 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
          });
        },
      });
      triggers.push(trigger);
    });

    // Parallax on background decorative elements (desktop only)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      const parallaxElements = pageRef.current.querySelectorAll(".ur-parallax");
      parallaxElements.forEach((el) => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(el, { y: self.progress * -80 });
          },
        });
        triggers.push(trigger);
      });
    }

    // Sticky bar trigger
    if (stickyTriggerRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: stickyTriggerRef.current,
        start: "top 90%",
        onEnter: () => setShowStickyBar(true),
        onLeaveBack: () => setShowStickyBar(false),
      });
      triggers.push(trigger);
    }

    scrollTriggersRef.current = triggers;

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [loading]);

  /* ─── Product selection ─── */

  const toggleProduct = useCallback((key: keyof SelectedProducts) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getSelectedItems = useCallback((): CartItem[] => {
    if (!recommendation) return [];

    const items: CartItem[] = [];

    if (selected.cleanser && recommendation.cleanser) {
      const cat = getCategoryFromProduct(recommendation.cleanser.product);
      items.push({
        productId: recommendation.cleanser.product.id,
        productName: recommendation.cleanser.product.name,
        category: cat,
        skinType: recommendation.cleanser.product.skin_type,
        fragranceOption,
        price: PRODUCT_PRICES[cat],
      });
    }

    if (selected.serum && recommendation.serum) {
      const cat = getCategoryFromProduct(recommendation.serum.product);
      items.push({
        productId: recommendation.serum.product.id,
        productName: recommendation.serum.product.name,
        category: cat,
        skinType: recommendation.serum.product.skin_type,
        fragranceOption,
        price: PRODUCT_PRICES[cat],
      });
    }

    if (selected.moisturizer && recommendation.moisturizer) {
      const cat = getCategoryFromProduct(recommendation.moisturizer.product);
      items.push({
        productId: recommendation.moisturizer.product.id,
        productName: recommendation.moisturizer.product.name,
        category: cat,
        skinType: recommendation.moisturizer.product.skin_type,
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
      if (url) {
        window.location.href = url;
      }
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
      <div className="ur-loading-screen">
        <div className="ur-loading-content">
          <h2 className="ur-loading-title">Analysing your skin profile...</h2>
          <p className="ur-loading-desc">This won&apos;t take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ur-loading-screen">
        <div className="ur-loading-content">
          <h2 className="ur-loading-title">Something went wrong</h2>
          <p className="ur-loading-desc">{error}</p>
          <button onClick={() => router.push("/quiz")} className="ur-btn-primary">
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
  const hasAnyProduct = recommendation.serum || recommendation.cleanser || recommendation.moisturizer;

  const selectedItems = getSelectedItems();
  const selectedCount = selectedItems.length;
  const { subtotal } = calculateTotal(selectedItems, "one-time");
  const { total: subscriptionTotal } = calculateTotal(selectedItems, "bi-monthly");
  const { total: currentTotal, discount } = calculateTotal(selectedItems, plan);
  const isBundle = selectedCount === 3;

  const PLAN_OPTIONS = [
    { value: "one-time" as const, label: "One-Time Purchase", desc: "Full price" },
    { value: "bi-monthly" as const, label: "Bi-Monthly", desc: "20% off, every 2 months" },
    { value: "annual" as const, label: "Annual", desc: "20% off, billed yearly" },
  ];

  return (
    <div className="ur-page" ref={pageRef}>
      {/* ═══ Section 1: Skin Profile ═══ */}
      <section className="ur-section ur-section-profile">
        <div className="ur-parallax ur-profile-bg-accent" />
        <div className="ur-section-inner">
          <div className="ur-reveal">
            <span className="ur-label">Your Skin Analysis</span>
            <h1 className="ur-hero-title">
              {customerName ? `${customerName}, Here\u2019s` : "Here\u2019s"} What We Found
            </h1>
          </div>

          <div className="ur-profile-type ur-reveal">
            <span className="ur-section-label">Your Skin Type</span>
            <h2 className="ur-profile-type-name">{skinTypeLabel}</h2>
            <p className="ur-profile-type-desc">{skinDescription}</p>
          </div>

          {concerns.length > 0 && (
            <div className="ur-profile-concerns ur-reveal">
              <span className="ur-section-label">Your Concerns</span>
              <div className="ur-concerns-grid">
                {concerns.map((concern) => (
                  <div key={concern} className="ur-concern-card">
                    <h3 className="ur-concern-name">{concern}</h3>
                    <p className="ur-concern-desc">
                      {CONCERN_EXPLANATIONS[concern] ?? "We\u2019ve noted this concern and factored it into your formulation."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topPriority && (
            <div className="ur-profile-priority ur-reveal">
              <span className="ur-section-label">Your Top Priority</span>
              <p className="ur-priority-text">
                You ranked <strong>{topPriority}</strong> as your most important goal.
                This drives the hero active in your serum at maximum concentration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Section 2: Key Botanicals ═══ */}
      {botanicals.length > 0 && (
        <section className="ur-section ur-section-botanicals">
          <div className="ur-parallax ur-botanicals-bg-accent" />
          <div className="ur-section-inner">
            <div className="ur-reveal">
              <span className="ur-label">Selected For Your Skin</span>
              <h2 className="ur-section-title">Your Key Botanicals</h2>
              <p className="ur-section-subtitle">
                Eastern European botanical extracts selected for your skin profile
              </p>
            </div>

            <div className="ur-botanicals-grid ur-reveal">
              {botanicals.map((entry) => (
                <div key={entry.ingredient.id} className="ur-botanical-card">
                  <span className="ur-botanical-category">{entry.category}</span>
                  <h3 className="ur-botanical-name">{entry.ingredient.name}</h3>
                  {entry.ingredient.scientific_name && (
                    <p className="ur-botanical-scientific">
                      {entry.ingredient.scientific_name}
                    </p>
                  )}
                  {entry.ingredient.skincare_priorities && entry.ingredient.skincare_priorities.length > 0 && (
                    <div className="ur-botanical-priorities">
                      <span className="ur-botanical-priorities-label">Benefits</span>
                      <p className="ur-botanical-priorities-value">
                        {entry.ingredient.skincare_priorities.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Section 3: Your Products ═══ */}
      <section className="ur-section ur-section-products" ref={stickyTriggerRef}>
        <div className="ur-parallax ur-products-bg-accent" />
        <div className="ur-section-inner">
          <div className="ur-reveal">
            <span className="ur-label">Crafted For You</span>
            <h2 className="ur-section-title">
              {customerName ? `${customerName}\u2019s` : "Your"} Personalised Regimen
            </h2>
            <p className="ur-section-subtitle">
              Based on your {skinTypeLabel.toLowerCase()} skin profile
              {recommendation.concerns.length > 0 &&
                ` and your top ${recommendation.concerns.length} concerns`}
            </p>
          </div>

          {hasAnyProduct ? (
            <div className="ur-products-grid ur-reveal">
              {recommendation.cleanser && (
                <SerumCard
                  result={recommendation.cleanser}
                  fragranceOption={fragranceOption}
                  selected={selected.cleanser}
                  onToggleSelect={() => toggleProduct("cleanser")}
                  showSelection
                />
              )}
              {recommendation.serum && (
                <SerumCard
                  result={recommendation.serum}
                  fragranceOption={fragranceOption}
                  selected={selected.serum}
                  onToggleSelect={() => toggleProduct("serum")}
                  showSelection
                />
              )}
              {recommendation.moisturizer && (
                <SerumCard
                  result={recommendation.moisturizer}
                  fragranceOption={fragranceOption}
                  selected={selected.moisturizer}
                  onToggleSelect={() => toggleProduct("moisturizer")}
                  showSelection
                />
              )}
            </div>
          ) : (
            <div className="ur-no-products ur-reveal">
              <p>We don&apos;t have products matching your profile yet. New formulations are in development.</p>
            </div>
          )}

          {recommendation.gaps.length > 0 && (
            <div className="ur-gaps ur-reveal">
              {recommendation.gaps.map((gap, i) => (
                <p key={i} className="ur-gap-item">{gap}</p>
              ))}
            </div>
          )}

          {/* ─── Pricing + Plan Selection ─── */}
          {selectedCount > 0 && (
            <div className="ur-checkout-panel ur-reveal">
              <div className="ur-checkout-pricing">
                <div className="ur-pricing-row">
                  <span className="ur-pricing-label">
                    {isBundle ? "Full Routine" : `${selectedCount} product${selectedCount > 1 ? "s" : ""}`}
                  </span>
                  <span className="ur-pricing-value">&euro;{subtotal}</span>
                </div>
                {isBundle && (
                  <p className="ur-pricing-note">
                    Bundle saves you &euro;{(PRODUCT_PRICES.Cleanser + PRODUCT_PRICES.Serum + PRODUCT_PRICES.Moisturizer) - BUNDLE_PRICE} vs individual prices
                  </p>
                )}
                <div className="ur-pricing-sub">
                  <span className="ur-pricing-sub-label">With subscription</span>
                  <span className="ur-pricing-sub-value">
                    &euro;{subscriptionTotal}
                    <span className="ur-pricing-freq"> / shipment</span>
                  </span>
                </div>
              </div>

              <div className="ur-plan-selector">
                <span className="ur-section-label">Choose Your Plan</span>
                <div className="ur-plan-options">
                  {PLAN_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`ur-plan-option${plan === option.value ? " ur-plan-option-active" : ""}`}
                      onClick={() => setPlan(option.value)}
                    >
                      <span className={`ur-plan-radio${plan === option.value ? " ur-plan-radio-active" : ""}`} />
                      <span className="ur-plan-text">
                        <span className="ur-plan-name">{option.label}</span>
                        <span className="ur-plan-desc">{option.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ur-checkout-summary">
                {discount > 0 && (
                  <div className="ur-summary-row">
                    <span className="ur-summary-label">Discount</span>
                    <span className="ur-summary-discount">-&euro;{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="ur-summary-row ur-summary-total">
                  <span className="ur-summary-label">Total</span>
                  <span className="ur-summary-value">&euro;{currentTotal}</span>
                </div>
                {plan === "annual" && isBundle && (
                  <p className="ur-summary-note">Billed as &euro;600 annually</p>
                )}
              </div>

              <div className="ur-checkout-actions">
                <button
                  className="ur-btn-primary"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Redirecting to Stripe..." : "Checkout"}
                </button>
                <button className="ur-btn-secondary" onClick={handleContinueToCart}>
                  View Full Cart
                </button>
              </div>
              {checkoutError && <p className="ur-checkout-error">{checkoutError}</p>}
            </div>
          )}

          <div className="ur-footer-links ur-reveal">
            <button onClick={() => go("/quiz")} className="ur-btn-secondary">
              Retake Quiz
            </button>
            <a href="/report" className="ur-report-link">View detailed report</a>
          </div>
        </div>
      </section>

      {/* ═══ Sticky Bottom Bar ═══ */}
      {selectedCount > 0 && showStickyBar && (
        <div className="ur-sticky-bar">
          <div className="ur-sticky-inner">
            <span className="ur-sticky-summary">
              {selectedCount} product{selectedCount > 1 ? "s" : ""} — &euro;{currentTotal}
              {plan !== "one-time" && <span className="ur-sticky-plan"> ({PLAN_OPTIONS.find(o => o.value === plan)?.label})</span>}
            </span>
            <button
              className="ur-sticky-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Redirecting..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
