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

  return (
    <div className="quiz-multi-select">
      {options.map((option) => {
        const isSelected =
          option === "Other"
            ? hasOther
            : option === "None that I know of"
              ? hasNone
              : selectedItems.includes(option);

        return (
          <div key={option}>
            <button
              type="button"
              className={`quiz-option ${isSelected ? "selected" : ""}`}
              onClick={() => handleToggle(option)}
            >
              {option}
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
