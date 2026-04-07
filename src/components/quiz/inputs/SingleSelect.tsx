"use client";

interface SingleSelectProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

export default function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="quiz-single-select">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`quiz-select-card ${value === option ? "selected" : ""}`}
          onClick={() => onChange(option)}
        >
          <span className="quiz-select-indicator" />
          <span className="quiz-select-label">{option}</span>
        </button>
      ))}
    </div>
  );
}
