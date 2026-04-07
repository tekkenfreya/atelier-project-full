"use client";

interface FreeTextProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_CHARS = 1000;

export default function FreeText({ value, onChange }: FreeTextProps) {
  return (
    <div className="quiz-free-text">
      <textarea
        className="quiz-textarea"
        aria-label="Share additional skin information"
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) {
            onChange(e.target.value);
          }
        }}
        placeholder="Share anything that feels relevant: skin history, goals, sensitivities, dermatologist advice..."
        rows={6}
      />
      <div className="quiz-char-count">
        {value.length} / {MAX_CHARS}
      </div>
    </div>
  );
}
