"use client";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  function handleToggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div className="quiz-multi-select">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`quiz-select-card ${value.includes(option) ? "selected" : ""}`}
          onClick={() => handleToggle(option)}
        >
          <span className="quiz-check-indicator">
            {value.includes(option) && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="quiz-select-label">{option}</span>
        </button>
      ))}
    </div>
  );
}
