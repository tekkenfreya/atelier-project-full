"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerValue } from "@/data/quizQuestions";
import { quizQuestions } from "@/data/quizQuestions";
import type {
  DebugRecommendation,
  DebugCategoryResult,
  FragranceOption,
} from "@/lib/matching-engine/types";

const ENGINE_QUESTIONS = new Set([10, 11, 12, 16, 24, 29, 31]);

const FRAGRANCE_LABELS: Record<FragranceOption, string> = {
  F0: "No fragrance",
  F1: "Light, fresh botanical notes",
  F2: "Warm, earthy undertones",
};

function getFragranceFromAnswers(answers: Record<number, AnswerValue>): FragranceOption {
  const q31 = answers[31] as string | undefined;
  if (q31 === "No fragrance") return "F0";
  if (q31 === "Warm, earthy undertones") return "F2";
  if (q31 === "Light, fresh botanical notes") return "F1";
  return "F1";
}

function formatAnswerValue(value: AnswerValue): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }
  return String(value);
}

function CategorySection({ data }: { data: DebugCategoryResult }) {
  const top3 = data.allScored.slice(0, 3);

  return (
    <div className="report-category">
      <h3 className="report-category-title">{data.category}</h3>

      {data.hasGap && data.gapMessage && (
        <p className="report-gap-message">{data.gapMessage}</p>
      )}

      <div className="report-gate-row">
        <span className="report-gate-label">Gate 1 — Skin Type Filter</span>
        <span className="report-gate-count">{data.gate1Passed.length} products passed</span>
      </div>

      <div className="report-gate-row">
        <span className="report-gate-label">Gate 2 — Safety Exclusions</span>
        <span className="report-gate-count">{data.gate2Passed.length} products passed</span>
      </div>

      {data.exclusionReasons.length > 0 && (
        <div className="report-exclusions">
          <span className="report-sub-label">Excluded in Gate 2:</span>
          <table className="report-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {data.exclusionReasons.map((er) => (
                <tr key={er.productId}>
                  <td>{er.productName}</td>
                  <td>{er.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {top3.length > 0 && (
        <div className="report-scoring">
          <span className="report-sub-label">Gate 3 — Scoring (top {top3.length}):</span>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Score</th>
                <th>Matched Concerns</th>
                <th>Reasons</th>
              </tr>
            </thead>
            <tbody>
              {top3.map((sp, idx) => (
                <tr key={sp.product.id} className={idx === 0 ? "report-winner-row" : ""}>
                  <td className="report-mono">{idx + 1}</td>
                  <td>{sp.product.name}</td>
                  <td className="report-mono">{sp.score.toFixed(1)}</td>
                  <td>{sp.matchedConcerns.join(", ") || "—"}</td>
                  <td>{sp.reasons.join("; ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.winner && (
        <div className="report-winner">
          Winner: <strong>{data.winner.product.name}</strong> (score: {data.winner.score.toFixed(1)})
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, AnswerValue> | null>(null);
  const [debug, setDebug] = useState<DebugRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugData() {
      const stored = sessionStorage.getItem("quizAnswers");
      if (!stored) {
        router.push("/quiz");
        return;
      }

      try {
        const parsed: Record<number, AnswerValue> = JSON.parse(stored);
        setAnswers(parsed);

        const res = await fetch("/api/recommend-debug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: parsed }),
        });

        if (!res.ok) throw new Error("Failed to get debug data");

        const data: DebugRecommendation = await res.json();
        setDebug(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDebugData();
  }, [router]);

  if (loading) {
    return (
      <div className="report-container">
        <div className="report-loading">Loading debug report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="report-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/results")} className="report-btn">
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (!answers || !debug) return null;

  const fragrance = getFragranceFromAnswers(answers);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="report-container">
      <div className="report-header">
        <h1 className="report-title">Questionnaire Report</h1>
        <p className="report-date">{dateStr} at {timeStr}</p>
      </div>

      {/* Section 1: Quiz Answers */}
      <section className="report-section">
        <h2 className="report-section-title">Section 1: Quiz Answers</h2>
        <table className="report-table report-answers-table">
          <thead>
            <tr>
              <th>Q#</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Engine</th>
            </tr>
          </thead>
          <tbody>
            {quizQuestions.map((q) => (
              <tr
                key={q.id}
                className={ENGINE_QUESTIONS.has(q.id) ? "report-engine-row" : ""}
              >
                <td className="report-mono">Q{q.id}</td>
                <td>{q.question}</td>
                <td>{formatAnswerValue(answers[q.id])}</td>
                <td className="report-mono">
                  {ENGINE_QUESTIONS.has(q.id) ? "Yes" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 2: Gate 1 — Skin Type Filter */}
      <section className="report-section">
        <h2 className="report-section-title">Section 2: Gate 1 — Skin Type Filter</h2>
        <div className="report-info-row">
          <span className="report-info-label">Q11 Answer:</span>
          <span>{formatAnswerValue(answers[11])}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Extracted Skin Type:</span>
          <span className="report-mono">{debug.skinType}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Products passed per category:</span>
        </div>
        <ul className="report-list">
          {debug.categories.map((cat) => (
            <li key={cat.category}>
              {cat.category}: {cat.gate1Passed.length} product{cat.gate1Passed.length !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 3: Gate 2 — Safety Exclusions */}
      <section className="report-section">
        <h2 className="report-section-title">Section 3: Gate 2 — Safety Exclusions</h2>
        <div className="report-info-row">
          <span className="report-info-label">Pregnant / Breastfeeding:</span>
          <span>{debug.safetyContext.isPregnant ? "Yes" : "No"}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Rosacea:</span>
          <span>{debug.safetyContext.hasRosacea ? "Yes" : "No"}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Eczema:</span>
          <span>{debug.safetyContext.hasEczema ? "Yes" : "No"}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Q29 Exclusions:</span>
          <span>{debug.exclusions.length > 0 ? debug.exclusions.join(", ") : "None"}</span>
        </div>
        <div className="report-info-row">
          <span className="report-info-label">Products passed per category:</span>
        </div>
        <ul className="report-list">
          {debug.categories.map((cat) => (
            <li key={cat.category}>
              {cat.category}: {cat.gate2Passed.length} product{cat.gate2Passed.length !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4: Gate 3 — Scoring */}
      <section className="report-section">
        <h2 className="report-section-title">Section 4: Gate 3 — Scoring</h2>
        <div className="report-info-row">
          <span className="report-info-label">Concerns (Q12):</span>
          <span>{debug.concerns.length > 0 ? debug.concerns.join(", ") : "None"}</span>
        </div>
        {debug.categories.map((cat) => (
          <CategorySection key={cat.category} data={cat} />
        ))}
      </section>

      {/* Section 5: Final Results */}
      <section className="report-section">
        <h2 className="report-section-title">Section 5: Final Results</h2>
        <div className="report-info-row">
          <span className="report-info-label">Fragrance:</span>
          <span>{FRAGRANCE_LABELS[fragrance]} ({fragrance})</span>
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product</th>
              <th>Score</th>
              <th>Matched Concerns</th>
            </tr>
          </thead>
          <tbody>
            {debug.categories.map((cat) => (
              <tr key={cat.category}>
                <td>{cat.category}</td>
                <td>{cat.winner?.product.name ?? "—"}</td>
                <td className="report-mono">{cat.winner?.score.toFixed(1) ?? "—"}</td>
                <td>{cat.winner?.matchedConcerns.join(", ") ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="report-actions">
        <button onClick={() => router.push("/results")} className="report-btn">
          Back to Results
        </button>
      </div>
    </div>
  );
}
