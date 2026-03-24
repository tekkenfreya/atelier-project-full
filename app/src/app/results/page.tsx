"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recommendation, FragranceOption } from "@/lib/matching-engine/types";
import type { AnswerValue } from "@/data/quizQuestions";
import SerumCard from "@/components/results/SerumCard";

function getDefaultFragrance(answers: Record<number, AnswerValue>): FragranceOption {
  // Q25: "Fragrance-free" in ingredient philosophies
  const q25 = answers[25] as string[] | undefined;
  if (q25 && Array.isArray(q25) && q25.includes("Fragrance-free")) {
    return "F0";
  }

  // Q29: "Fragrance / essential oils" in avoidance list
  const q29 = answers[29] as string[] | undefined;
  if (q29 && Array.isArray(q29) && q29.includes("Fragrance / essential oils")) {
    return "F0";
  }

  return "F1";
}

export default function ResultsPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fragranceOption, setFragranceOption] = useState<FragranceOption>("F0");

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <h2>Analysing your skin profile...</h2>
          <p>This won't take long</p>
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

  return (
    <div className="results-container">
      <div className="results-header">
        <span className="results-label">Selected For You</span>
        <h1 className="results-title">Your Serum Match</h1>
        <p className="results-subtitle">
          Based on your {skinTypeLabel} skin profile
          {recommendation.concerns.length > 0 &&
            ` and your top ${recommendation.concerns.length} concerns`}
        </p>
      </div>

      {recommendation.hasGap ? (
        <div className="results-gap">
          <p>{recommendation.gapMessage}</p>
          <button onClick={() => router.push("/")} className="results-btn">
            Return Home
          </button>
        </div>
      ) : recommendation.serum ? (
        <div className="results-grid">
          <SerumCard
            result={recommendation.serum}
            fragranceOption={fragranceOption}
            onFragranceChange={setFragranceOption}
          />
        </div>
      ) : null}

      <div className="results-actions">
        <button onClick={() => router.push("/quiz")} className="results-btn-secondary">
          Retake Quiz
        </button>
        <button onClick={() => router.push("/")} className="results-btn">
          Return Home
        </button>
      </div>
    </div>
  );
}
