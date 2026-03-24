"use client";

import type { GridRow } from "@/data/quizQuestions";

interface MultiScaleGridProps {
  rows: GridRow[];
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

export default function MultiScaleGrid({ rows, value, onChange }: MultiScaleGridProps) {
  function handleSegmentClick(label: string, segValue: number) {
    onChange({ ...value, [label]: segValue });
  }

  return (
    <div className="quiz-grid">
      {rows.map((row) => {
        const segments = Array.from(
          { length: row.max - row.min + 1 },
          (_, i) => row.min + i
        );

        return (
          <div key={row.label} className="quiz-grid-row">
            <span className="quiz-grid-label">{row.label}</span>
            <div className="quiz-grid-scale">
              <div className="quiz-scale-segments">
                {segments.map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    className={`quiz-scale-segment ${value[row.label] === seg ? "selected" : ""}`}
                    onClick={() => handleSegmentClick(row.label, seg)}
                  >
                    {seg}
                  </button>
                ))}
              </div>
              <div className="quiz-scale-labels">
                <span>{row.minLabel}</span>
                <span>{row.maxLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
