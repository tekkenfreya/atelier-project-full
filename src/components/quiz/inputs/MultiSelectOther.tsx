"use client";

import { useState } from "react";

interface MultiSelectOtherProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectOther({ options, value, onChange }: MultiSelectOtherProps) {
  const [otherText, setOtherText] = useState("");

  const selectedItems = value.filter((v) => !v.startsWith("Other:"));
  const hasOther = value.some((v) => v === "Other" || v.startsWith("Other:"));
  const hasNone = value.includes("None that I know of");

  function handleToggle(option: string) {
    if (option === "None that I know of") {
      if (hasNone) {
        onChange(value.filter((v) => v !== "None that I know of"));
      } else {
        onChange(["None that I know of"]);
        setOtherText("");
      }
      return;
    }

    if (option === "Other") {
      if (hasOther) {
        onChange(value.filter((v) => v !== "Other" && !v.startsWith("Other:")));
        setOtherText("");
      } else {
        const without = value.filter((v) => v !== "None that I know of");
        onChange([...without, "Other"]);
      }
      return;
    }

    const withoutNone = value.filter((v) => v !== "None that I know of");
    if (selectedItems.includes(option)) {
      onChange(withoutNone.filter((v) => v !== option));
    } else {
      onChange([...withoutNone, option]);
    }
  }

  function handleOtherText(text: string) {
    setOtherText(text);
    const withoutOther = value.filter((v) => v !== "Other" && !v.startsWith("Other:"));
    if (text.trim()) {
      onChange([...withoutOther, `Other: ${text.trim()}`]);
    } else {
      onChange([...withoutOther, "Other"]);
    }
  }

  function isSelected(option: string): boolean {
    if (option === "Other") return hasOther;
    if (option === "None that I know of") return hasNone;
    return selectedItems.includes(option);
  }

  return (
    <div className="quiz-multi-select">
      {options.map((option) => {
        const selected = isSelected(option);
        return (
          <div key={option}>
            <button
              type="button"
              className={`quiz-select-card ${selected ? "selected" : ""}`}
              onClick={() => handleToggle(option)}
            >
              <span className="quiz-check-indicator">
                {selected && (
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
            {option === "Other" && hasOther && (
              <div className="quiz-other-input">
                <input
                  type="text"
                  className="quiz-other-field"
                  placeholder="Please describe your allergy..."
                  value={otherText}
                  onChange={(e) => handleOtherText(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
