"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface QuizContainerProps {
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  counter?: { current: number; total: number };
}

export default function QuizContainer({
  children,
  showBack,
  onBack,
  counter,
}: QuizContainerProps) {
  const router = useRouter();

  return (
    <div className="quiz-container">
      <div className="quiz-topbar">
        {showBack && onBack ? (
          <button
            type="button"
            className="quiz-topbar-back"
            onClick={onBack}
            aria-label="Previous question"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <div className="quiz-topbar-spacer" />
        )}

        {counter && (
          <span className="quiz-topbar-counter">
            {counter.current} / {counter.total}
          </span>
        )}

        <button
          type="button"
          className="quiz-topbar-close"
          onClick={() => router.push("/")}
          aria-label="Close quiz"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="quiz-content">{children}</div>
    </div>
  );
}
