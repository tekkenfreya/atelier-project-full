"use client";

import { useEffect, useCallback } from "react";

interface DragRankProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function DragRank({ options, value, onChange }: DragRankProps) {
  const selected = value.length > 0 ? value : [];
  const maxPicks = 3;

  useEffect(() => {
    if (value.length === 0 && options.length > 0) {
      onChange([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (option: string) => {
      const currentIndex = selected.indexOf(option);

      if (currentIndex !== -1) {
        const updated = selected.filter((v) => v !== option);
        onChange(updated);
      } else if (selected.length < maxPicks) {
        onChange([...selected, option]);
      }
    },
    [selected, onChange]
  );

  const getRank = (option: string): number | null => {
    const idx = selected.indexOf(option);
    return idx !== -1 ? idx + 1 : null;
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, option: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(option);
      }
    },
    [handleClick]
  );

  return (
    <div className="rank-grid" role="list">
      <p className="rank-instruction">
        Pick your top 3 in order of importance.
        {selected.length < maxPicks && (
          <span className="rank-counter">
            {" "}{maxPicks - selected.length} remaining
          </span>
        )}
      </p>
      {options.map((option) => {
        const rank = getRank(option);
        const isSelected = rank !== null;
        const isMaxed = selected.length >= maxPicks && !isSelected;

        return (
          <button
            key={option}
            type="button"
            role="listitem"
            className={`rank-card ${isSelected ? "rank-selected" : ""} ${isMaxed ? "rank-disabled" : ""}`}
            onClick={() => handleClick(option)}
            onKeyDown={(e) => handleKeyDown(e, option)}
            disabled={isMaxed}
            aria-label={`${option}${rank ? `, ranked #${rank}` : ""}`}
          >
            {isSelected && (
              <span className="rank-badge" data-rank={rank}>
                {String(rank).padStart(2, "0")}
              </span>
            )}
            <span className="rank-card-label">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
