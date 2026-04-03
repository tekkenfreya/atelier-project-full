"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePageTransition } from "@/hooks/usePageTransition";
import type { Recommendation, ScoredProduct, Ingredient, ProductCategory } from "@/lib/matching-engine/types";
import type { AnswerValue } from "@/data/quizQuestions";

interface BotanicalEntry {
  ingredient: Ingredient;
  productName: string;
  category: ProductCategory;
}

function getCategoryFromProduct(product: ScoredProduct["product"]): ProductCategory {
  const cat = product.category?.toLowerCase() ?? "";
  if (cat.includes("cleanser")) return "Cleanser";
  if (cat.includes("moistur")) return "Moisturizer";
  return "Serum";
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

function getPriorityLabel(priorities: string[] | null): string {
  if (!priorities || priorities.length === 0) return "";
  return priorities.join(", ");
}

export default function IngredientsPage() {
  const router = useRouter();
  const { go } = usePageTransition();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => { tweenRef.current?.kill(); };
  }, []);

  useEffect(() => {
    async function fetchRecommendation() {
      const stored = sessionStorage.getItem("quizAnswers");
      if (!stored) {
        router.push("/quiz");
        return;
      }

      try {
        const answers: Record<number, AnswerValue> = JSON.parse(stored);

        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) throw new Error("Failed to get recommendation");

        const data: Recommendation = await res.json();
        setRecommendation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  useEffect(() => {
    if (loading || animatedRef.current || !containerRef.current) return;
    animatedRef.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const header = containerRef.current.querySelectorAll(".botanicals-animate-header");
    const cards = containerRef.current.querySelectorAll(".botanicals-card");

    gsap.set(header, { opacity: 0, y: 30 });
    gsap.set(cards, { opacity: 0, y: 50 });

    tweenRef.current = gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.15,
    });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.5,
    });
  }, [loading]);

  if (loading) {
    return (
      <div className="botanicals-container">
        <div className="botanicals-loading">
          <h2 className="botanicals-loading-title">Loading your botanicals...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="botanicals-container">
        <div className="botanicals-loading">
          <h2 className="botanicals-loading-title">Something went wrong</h2>
          <p className="botanicals-loading-desc">{error}</p>
          <button onClick={() => router.push("/quiz")} className="botanicals-cta">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const botanicals = extractBotanicals(recommendation);

  return (
    <div className="botanicals-container" ref={containerRef}>
      <div className="botanicals-header botanicals-animate-header">
        <span className="botanicals-label">Selected For Your Skin</span>
        <h1 className="botanicals-title">Your Key Botanicals</h1>
        <p className="botanicals-subtitle">
          Eastern European botanical extracts selected for your skin profile
        </p>
      </div>

      {botanicals.length > 0 ? (
        <div className="botanicals-grid">
          {botanicals.map((entry) => (
            <div key={entry.ingredient.id} className="botanicals-card">
              <span className="botanicals-card-category">{entry.category}</span>
              <h3 className="botanicals-card-name">{entry.ingredient.name}</h3>
              {entry.ingredient.scientific_name && (
                <p className="botanicals-card-scientific">
                  {entry.ingredient.scientific_name}
                </p>
              )}
              {entry.ingredient.function && (
                <p className="botanicals-card-function">{entry.ingredient.function}</p>
              )}
              {entry.ingredient.skincare_priorities && entry.ingredient.skincare_priorities.length > 0 && (
                <div className="botanicals-card-priorities">
                  <span className="botanicals-card-priorities-label">Benefits</span>
                  <p className="botanicals-card-priorities-value">
                    {getPriorityLabel(entry.ingredient.skincare_priorities)}
                  </p>
                </div>
              )}
              <p className="botanicals-card-product">
                In your <strong>{entry.productName}</strong>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="botanicals-empty">
          <p>No botanical extracts found for your current recommendation.</p>
        </div>
      )}

      <div className="botanicals-actions botanicals-animate-header">
        <button className="botanicals-cta" onClick={() => go("/results")}>
          See Your Products
        </button>
        <button className="botanicals-cta-secondary" onClick={() => go("/analysis")}>
          Back to Analysis
        </button>
      </div>
    </div>
  );
}
