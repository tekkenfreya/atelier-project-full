"use client";

import type { ScaleConfig } from "@/data/quizQuestions";

interface ScaleProps {
  config: ScaleConfig;
  value: number | null;
  onChange: (value: number) => void;
}

export default function Scale({ config, value, onChange }: ScaleProps) {
  const segments = Array.from(
    { length: config.max - config.min + 1 },
    (_, i) => config.min + i
  );

  return (
    <div className="quiz-scale">
      <div className="quiz-scale-segments">
        {segments.map((seg) => (
          <button
            key={seg}
            type="button"
            className={`quiz-scale-segment ${value === seg ? "selected" : ""}`}
            onClick={() => onChange(seg)}
          >
            {seg}
          </button>
        ))}
      </div>
      <div className="quiz-scale-labels">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
    </div>
  );
}
