"use client";

import { useState, useEffect, useCallback } from "react";

interface DragRankProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

type InsertPosition = "above" | "below";

interface DragState {
  dragIndex: number;
  overIndex: number | null;
  insertPosition: InsertPosition | null;
}

export default function DragRank({ options, value, onChange }: DragRankProps) {
  const items = value.length > 0 ? value : options;
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    if (value.length === 0 && options.length > 0) {
      onChange(options);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      const targetIndex = e.key === "ArrowUp" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const updated = [...items];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      onChange(updated);
    },
    [items, onChange]
  );

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.dataTransfer.effectAllowed = "move";
    setDragState({ dragIndex: index, overIndex: null, insertPosition: null });
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragState === null || dragState.dragIndex === index) {
      if (dragState && dragState.overIndex !== null) {
        setDragState({ ...dragState, overIndex: null, insertPosition: null });
      }
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position: InsertPosition = e.clientY < midpoint ? "above" : "below";

    if (dragState.overIndex !== index || dragState.insertPosition !== position) {
      setDragState({ ...dragState, overIndex: index, insertPosition: position });
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    if (dragState === null || dragState.dragIndex === index) {
      resetDrag();
      return;
    }

    const updated = [...items];
    const [moved] = updated.splice(dragState.dragIndex, 1);

    let insertAt = index;
    if (dragState.dragIndex < index) {
      insertAt = dragState.insertPosition === "above" ? index - 1 : index;
    } else {
      insertAt = dragState.insertPosition === "above" ? index : index + 1;
    }

    updated.splice(insertAt, 0, moved);
    onChange(updated);
    resetDrag();
  }

  function handleDragEnd() {
    resetDrag();
  }

  function resetDrag() {
    setDragState(null);
  }

  function getItemClassName(index: number): string {
    const classes = ["quiz-rank-item"];

    if (dragState) {
      if (dragState.dragIndex === index) {
        classes.push("quiz-rank-dragging");
      }
      if (dragState.overIndex === index && dragState.insertPosition === "above") {
        classes.push("quiz-rank-insert-above");
      }
      if (dragState.overIndex === index && dragState.insertPosition === "below") {
        classes.push("quiz-rank-insert-below");
      }
    }

    return classes.join(" ");
  }

  return (
    <div className="quiz-drag-rank" role="list">
      {items.map((item, index) => (
        <div
          key={item}
          className={getItemClassName(index)}
          draggable
          tabIndex={0}
          role="listitem"
          aria-label={`Item ${index + 1} of ${items.length}: ${item}`}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          onDragLeave={() => {
            if (dragState && dragState.overIndex === index) {
              setDragState({ ...dragState, overIndex: null, insertPosition: null });
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          <span className="quiz-rank-number">{index + 1}</span>
          <span className="quiz-rank-handle">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              <circle cx="2" cy="2" r="1.5" />
              <circle cx="8" cy="2" r="1.5" />
              <circle cx="2" cy="8" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="2" cy="14" r="1.5" />
              <circle cx="8" cy="14" r="1.5" />
            </svg>
          </span>
          <span className="quiz-rank-label">{item}</span>
        </div>
      ))}
    </div>
  );
}
