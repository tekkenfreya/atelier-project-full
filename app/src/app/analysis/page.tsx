"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePageTransition } from "@/hooks/usePageTransition";
import type { Recommendation, SkinType } from "@/lib/matching-engine/types";
import type { AnswerValue } from "@/data/quizQuestions";

const SKIN_TYPE_DESCRIPTIONS: Record<SkinType, string> = {
  oily: "Your skin produces more sebum than average, particularly in the T-zone. This means lightweight, oil-free textures work best. The good news: oily skin ages more slowly.",
  dry: "Your skin barrier needs extra support. Hydration and nourishment are key. Rich textures and barrier-strengthening ingredients will transform how your skin feels.",
  combination: "Your skin has dual needs \u2014 managing oil in some areas while nourishing others. We balance lightweight hydration with targeted treatment.",
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

function parseSkinType(answers: Record<number, AnswerValue>): string {
  const q11 = answers[11] as string | undefined;
  if (!q11) return "";
  if (q11.startsWith("Oily")) return "oily";
  if (q11.startsWith("Dry")) return "dry";
  if (q11.startsWith("Combination")) return "combination";
  if (q11.startsWith("Sensitive")) return "sensitive";
  return "";
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

export default function AnalysisPage() {
  const router = useRouter();
  const { go } = usePageTransition();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
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
        const parsed: Record<number, AnswerValue> = JSON.parse(stored);
        setAnswers(parsed);

        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: parsed }),
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

    const elements = containerRef.current.querySelectorAll(".analysis-animate");
    gsap.set(elements, { opacity: 0, y: 40 });
    tweenRef.current = gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.2,
    });
  }, [loading]);

  if (loading) {
    return (
      <div className="analysis-container">
        <div className="analysis-loading">
          <h2 className="analysis-loading-title">Analysing your skin profile...</h2>
          <p className="analysis-loading-desc">This won&apos;t take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <div className="analysis-loading">
          <h2 className="analysis-loading-title">Something went wrong</h2>
          <p className="analysis-loading-desc">{error}</p>
          <button onClick={() => router.push("/quiz")} className="analysis-cta">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const skinType = recommendation.skinType;
  const skinTypeLabel = skinType.charAt(0).toUpperCase() + skinType.slice(1);
  const skinDescription = SKIN_TYPE_DESCRIPTIONS[skinType];
  const concerns = parseConcerns(answers);
  const priorities = parsePriorities(answers);
  const topPriority = priorities.length > 0 ? priorities[0] : null;
  const customerName = typeof window !== "undefined" ? sessionStorage.getItem("customerName") : null;

  return (
    <div className="analysis-container" ref={containerRef}>
      <div className="analysis-header analysis-animate">
        <span className="analysis-label">Your Skin Analysis</span>
        <h1 className="analysis-title">
          {customerName ? `${customerName}, Here\u2019s` : "Here\u2019s"} What We Found
        </h1>
      </div>

      <div className="analysis-skin-type analysis-animate">
        <span className="analysis-section-label">Your Skin Type</span>
        <h2 className="analysis-skin-type-name">{skinTypeLabel}</h2>
        <p className="analysis-skin-type-desc">{skinDescription}</p>
      </div>

      {concerns.length > 0 && (
        <div className="analysis-concerns analysis-animate">
          <span className="analysis-section-label">Your Concerns</span>
          <div className="analysis-concerns-list">
            {concerns.map((concern) => (
              <div key={concern} className="analysis-concern-item">
                <h3 className="analysis-concern-name">{concern}</h3>
                <p className="analysis-concern-desc">
                  {CONCERN_EXPLANATIONS[concern] ?? "We\u2019ve noted this concern and factored it into your formulation."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {topPriority && (
        <div className="analysis-priority analysis-animate">
          <span className="analysis-section-label">Your Top Priority</span>
          <p className="analysis-priority-text">
            You ranked <strong>{topPriority}</strong> as your most important goal.
            This drives the hero active in your serum at maximum concentration.
          </p>
        </div>
      )}

      <div className="analysis-summary analysis-animate">
        <span className="analysis-section-label">What This Means</span>
        <p className="analysis-summary-text">
          Based on your {skinTypeLabel.toLowerCase()} skin type
          {concerns.length > 0 && `, ${concerns.length} active concern${concerns.length > 1 ? "s" : ""}`}
          {topPriority && `, and your focus on ${topPriority.toLowerCase().split(" (")[0]}`},
          we&apos;ve matched you to a personalised three-step routine.
          Every ingredient is selected to work with your skin, not against it.
        </p>
      </div>

      <div className="analysis-actions analysis-animate">
        <button className="analysis-cta" onClick={() => go("/ingredients")}>
          Your Key Botanicals
        </button>
      </div>
    </div>
  );
}
