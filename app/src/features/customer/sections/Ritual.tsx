import type { ResolvedExtract } from "@/features/atlas/extracts";
import type { QuizResult, RitualCategory } from "../types";
import { formatDate, formatConcern, FRAGRANCE_LABELS } from "../format";

interface RitualRow {
  category: RitualCategory;
  product: string | null;
}

interface RitualProps {
  latestQuiz: QuizResult;
  ritualRows: RitualRow[];
  extractsByCategory: Record<string, ResolvedExtract[]>;
}

export default function Ritual({ latestQuiz, ritualRows, extractsByCategory }: RitualProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Your Ritual</h1>
        <p className="account-section__subtitle">
          Based on consultation from {formatDate(latestQuiz.created_at)}.
        </p>
      </header>
      <table className="account-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Product</th>
            <th>Key extracts</th>
          </tr>
        </thead>
        <tbody>
          {ritualRows.map((row) => {
            const exts = extractsByCategory[row.category] ?? [];
            return (
              <tr key={row.category}>
                <td>{row.category}</td>
                <td>{row.product}</td>
                <td>
                  {exts.length > 0 ? exts.map((e) => e.ingredientName).join(", ") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {latestQuiz.concerns && latestQuiz.concerns.length > 0 && (
        <div className="account-metarow">
          <span className="account-metarow__label">Concerns</span>
          <span className="account-metarow__value">
            {latestQuiz.concerns.map(formatConcern).join(", ")}
          </span>
        </div>
      )}
      {latestQuiz.fragrance_choice && (
        <div className="account-metarow">
          <span className="account-metarow__label">Fragrance</span>
          <span className="account-metarow__value">
            {FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice}
          </span>
        </div>
      )}
    </section>
  );
}
