"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/hooks/usePageTransition";
import QuizContainer from "@/components/quiz/QuizContainer";
import { useQuizState } from "@/components/quiz/hooks/useQuizState";

export default function CompleteClient() {
  const router = useRouter();
  const { go } = usePageTransition();
  const { customerName, answers, loaded } = useQuizState();

  useEffect(() => {
    if (!loaded) return;
    if (!customerName.trim()) {
      router.replace("/quiz");
      return;
    }
    // answers are already in sessionStorage; this ensures a final flush
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
  }, [loaded, customerName, answers, router]);

  if (!loaded) {
    return (
      <QuizContainer>
        <div className="quiz-loading" />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <div className="quiz-complete">
        <span className="quiz-complete-label">Consultation Complete</span>
        <h2 className="quiz-complete-title">Thank You</h2>
        <p className="quiz-complete-desc">
          We&apos;ve got what we need. Your personalised skincare profile is
          coming together now.
        </p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={() => go("/analysis")}
        >
          See Your Analysis
        </button>
      </div>
    </QuizContainer>
  );
}
