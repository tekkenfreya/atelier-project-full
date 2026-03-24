"use client";

interface YesNoProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function YesNo({ value, onChange }: YesNoProps) {
  return (
    <div className="quiz-yes-no">
      <button
        type="button"
        className={`quiz-yes-no-btn ${value === "Yes" ? "selected" : ""}`}
        onClick={() => onChange("Yes")}
      >
        Yes
      </button>
      <button
        type="button"
        className={`quiz-yes-no-btn ${value === "No" ? "selected" : ""}`}
        onClick={() => onChange("No")}
      >
        No
      </button>
    </div>
  );
}
