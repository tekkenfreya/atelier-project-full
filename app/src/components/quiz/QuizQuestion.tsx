"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import type { QuizQuestion as QuizQuestionType, AnswerValue } from "@/data/quizQuestions";
import SingleSelect from "@/components/quiz/inputs/SingleSelect";
import MultiSelect from "@/components/quiz/inputs/MultiSelect";
import Scale from "@/components/quiz/inputs/Scale";
import MultiScaleGrid from "@/components/quiz/inputs/MultiScaleGrid";
import YesNo from "@/components/quiz/inputs/YesNo";
import DragRank from "@/components/quiz/inputs/DragRank";
import FreeText from "@/components/quiz/inputs/FreeText";

interface QuizQuestionProps {
  question: QuizQuestionType;
  answer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  direction: "forward" | "backward";
}

export default function QuizQuestion({
  question,
  answer,
  onAnswer,
  direction,
}: QuizQuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const xFrom = direction === "forward" ? 40 : -40;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, x: xFrom },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
    return () => { tween.kill(); };
  }, [question.id, direction]);

  function renderInput() {
    switch (question.type) {
      case "single-select":
        return (
          <SingleSelect
            options={question.options ?? []}
            value={typeof answer === "string" ? answer : null}
            onChange={onAnswer}
          />
        );
      case "multi-select":
        return (
          <MultiSelect
            options={question.options ?? []}
            value={Array.isArray(answer) ? answer : []}
            onChange={onAnswer}
          />
        );
      case "scale":
        return question.scaleConfig ? (
          <Scale
            config={question.scaleConfig}
            value={typeof answer === "number" ? answer : null}
            onChange={onAnswer}
          />
        ) : null;
      case "multi-scale-grid":
        return question.gridRows ? (
          <MultiScaleGrid
            rows={question.gridRows}
            value={
              answer !== null && typeof answer === "object" && !Array.isArray(answer)
                ? answer
                : {}
            }
            onChange={onAnswer}
          />
        ) : null;
      case "yes-no":
        return (
          <YesNo
            value={typeof answer === "string" ? answer : null}
            onChange={onAnswer}
          />
        );
      case "drag-rank":
        return (
          <DragRank
            options={question.options ?? []}
            value={Array.isArray(answer) ? answer : []}
            onChange={onAnswer}
          />
        );
      case "free-text":
        return (
          <FreeText
            value={typeof answer === "string" ? answer : ""}
            onChange={onAnswer}
          />
        );
    }
  }

  return (
    <div className="quiz-question" ref={containerRef}>
      <h2 className="quiz-question-title">{question.question}</h2>
      {question.subtitle && (
        <p className="quiz-question-subtitle">{question.subtitle}</p>
      )}

      <div className="quiz-input-area">{renderInput()}</div>

      <div className="quiz-why">
        <button
          type="button"
          className="quiz-why-toggle"
          onClick={() => setWhyOpen(!whyOpen)}
        >
          <span>Why we ask</span>
          <svg
            className={`quiz-why-chevron ${whyOpen ? "open" : ""}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {whyOpen && (
          <p className="quiz-why-text">{question.whyWeAsk}</p>
        )}
      </div>
    </div>
  );
}
