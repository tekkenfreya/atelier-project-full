"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Recommendation, FragranceOption, ScoredProduct, ProductCategory } from "@/lib/matching-engine/types";
import type { AnswerValue } from "@/data/quizQuestions";
import type { CartItem } from "@/types/cart";
import { PRODUCT_PRICES, BUNDLE_PRICE, calculateTotal } from "@/types/cart";
import SerumCard from "@/components/results/SerumCard";

function getDefaultFragrance(answers: Record<number, AnswerValue>): FragranceOption {
  const q25 = answers[25] as string[] | undefined;
  if (q25 && Array.isArray(q25) && q25.includes("Fragrance-free")) {
    return "F0";
  }

  const q29 = answers[29] as string[] | undefined;
  if (q29 && Array.isArray(q29) && q29.includes("Fragrance / essential oils")) {
    return "F0";
  }

  return "F1";
}

function getCategoryFromProduct(product: ScoredProduct["product"]): ProductCategory {
  const cat = product.category?.toLowerCase() ?? "";
  if (cat.includes("cleanser")) return "Cleanser";
  if (cat.includes("moistur")) return "Moisturizer";
  return "Serum";
}

interface SelectedProducts {
  cleanser: boolean;
  serum: boolean;
  moisturizer: boolean;
}

export default function ResultsPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fragranceOption, setFragranceOption] = useState<FragranceOption>("F0");
  const [selected, setSelected] = useState<SelectedProducts>({
    cleanser: true,
    serum: true,
    moisturizer: true,
  });

  useEffect(() => {
    async function fetchRecommendation() {
      const stored = sessionStorage.getItem("quizAnswers");
      if (!stored) {
        router.push("/quiz");
        return;
      }

      try {
        const answers: Record<number, AnswerValue> = JSON.parse(stored);
        setFragranceOption(getDefaultFragrance(answers));

        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
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

  const handleContinueToCart = useCallback(() => {
    const items = getSelectedItems();
    if (items.length === 0) return;
    sessionStorage.setItem("cartItems", JSON.stringify(items));
    router.push("/cart");
  }, [getSelectedItems, router]);

  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <h2>Analysing your skin profile...</h2>
          <p>This won&apos;t take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="results-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/quiz")} className="results-btn">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const skinTypeLabel = recommendation.skinType.charAt(0).toUpperCase() + recommendation.skinType.slice(1);
  const hasAnyProduct = recommendation.serum || recommendation.cleanser || recommendation.moisturizer;

  const selectedItems = getSelectedItems();
  const selectedCount = selectedItems.length;
  const { subtotal } = calculateTotal(selectedItems, "one-time");
  const { total: subscriptionTotal } = calculateTotal(selectedItems, "bi-monthly");
  const isBundle = selectedCount === 3;

  return (
    <div className="results-container">
      <div className="results-header">
        <span className="results-label">Selected For You</span>
        <h1 className="results-title">Your Personalised Regimen</h1>
        <p className="results-subtitle">
          Based on your {skinTypeLabel} skin profile
          {recommendation.concerns.length > 0 &&
            ` and your top ${recommendation.concerns.length} concerns`}
        </p>
      </div>

      {hasAnyProduct ? (
        <div className="results-grid-3">
          {recommendation.cleanser && (
            <SerumCard
              result={recommendation.cleanser}
              fragranceOption={fragranceOption}
              onFragranceChange={setFragranceOption}
              selected={selected.cleanser}
              onToggleSelect={() => toggleProduct("cleanser")}
              showSelection
            />
          )}
          {recommendation.serum && (
            <SerumCard
              result={recommendation.serum}
              fragranceOption={fragranceOption}
              onFragranceChange={setFragranceOption}
              selected={selected.serum}
              onToggleSelect={() => toggleProduct("serum")}
              showSelection
            />
          )}
          {recommendation.moisturizer && (
            <SerumCard
              result={recommendation.moisturizer}
              fragranceOption={fragranceOption}
              onFragranceChange={setFragranceOption}
              selected={selected.moisturizer}
              onToggleSelect={() => toggleProduct("moisturizer")}
              showSelection
            />
          )}
        </div>
      ) : (
        <div className="results-gap">
          <p>We don&apos;t have products matching your profile yet. New formulations are in development.</p>
        </div>
      )}

      {recommendation.gaps.length > 0 && (
        <div className="results-gaps">
          {recommendation.gaps.map((gap, i) => (
            <p key={i} className="results-gap-item">{gap}</p>
          ))}
        </div>
      )}

      {selectedCount > 0 && (
        <div className="results-pricing">
          <div className="results-pricing-row">
            <span className="results-pricing-label">
              {isBundle ? "Full Routine" : `${selectedCount} product${selectedCount > 1 ? "s" : ""}`}
            </span>
            <span className="results-pricing-value">${subtotal}</span>
          </div>
          {isBundle && (
            <p className="results-pricing-note">
              Bundle saves you ${(PRODUCT_PRICES.Cleanser + PRODUCT_PRICES.Serum + PRODUCT_PRICES.Moisturizer) - BUNDLE_PRICE} vs individual prices
            </p>
          )}
          <div className="results-pricing-sub">
            <span className="results-pricing-sub-label">With subscription</span>
            <span className="results-pricing-sub-value">
              ${subscriptionTotal}
              <span className="results-pricing-sub-freq"> / shipment</span>
            </span>
          </div>
        </div>
      )}

      <div className="results-actions">
        <button onClick={() => router.push("/quiz")} className="results-btn-secondary">
          Retake Quiz
        </button>
        {selectedCount > 0 ? (
          <button onClick={handleContinueToCart} className="results-btn">
            Continue to Cart
          </button>
        ) : (
          <button onClick={() => router.push("/")} className="results-btn">
            Return Home
          </button>
        )}
      </div>
    </div>
  );
}
