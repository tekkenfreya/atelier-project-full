"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import {
  useQuizState,
  type BiologicalSex,
} from "@/components/quiz/hooks/useQuizState";

const OPTIONS: { value: BiologicalSex; subtle?: boolean }[] = [
  { value: "Female" },
  { value: "Male" },
  { value: "Prefer not to say", subtle: true },
];

export default function SexSelectClient() {
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";
  const { customerName, setBiologicalSex, loaded } = useQuizState();

  useEffect(() => {
    if (!loaded) return;
    if (isPreview) return;
    if (!customerName.trim()) router.replace("/quiz");
  }, [loaded, customerName, isPreview, router]);

  function handleSelect(value: BiologicalSex) {
    setBiologicalSex(value);
    router.push("/quiz/intro");
  }

  if (!loaded) {
    return (
      <QuizContainer>
        <div className="quiz-loading" />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <div className="quiz-sex-select">
        <span className="quiz-intro-label">Before We Begin</span>
        <h2 className="quiz-sex-title">What is your biological sex?</h2>
        <p className="quiz-sex-subtitle">
          Hormonal differences affect sebum production, skin thickness, and
          sensitivity patterns. This lets us account for that in your formula.
        </p>
        <div className="quiz-sex-options">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`quiz-sex-btn${opt.subtle ? " quiz-sex-btn-subtle" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.value}
            </button>
          ))}
        </div>
      </div>
    </QuizContainer>
  );
}
