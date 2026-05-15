"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import { useQuizState } from "@/components/quiz/hooks/useQuizState";
import { useQuizNavigation } from "@/components/quiz/hooks/useQuizNavigation";

export default function IntroClient() {
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";
  const { customerName, biologicalSex, loaded } = useQuizState();
  const { activeQuestions } = useQuizNavigation({ biologicalSex });

  useEffect(() => {
    if (!loaded) return;
    if (isPreview) return;
    if (!customerName.trim()) {
      router.replace("/quiz");
      return;
    }
    if (!biologicalSex) router.replace("/quiz/sex");
  }, [loaded, customerName, biologicalSex, isPreview, router]);

  const counts = useMemo(() => {
    const s1 = activeQuestions.filter((q) => q.section === 1).length;
    const s2 = activeQuestions.filter((q) => q.section === 2).length;
    const s3 = activeQuestions.filter((q) => q.section === 3).length;
    return { s1, s2, s3, total: s1 + s2 + s3 };
  }, [activeQuestions]);

  if (!loaded) {
    return (
      <QuizContainer>
        <div className="quiz-loading" />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <div className="quiz-intro">
        <span className="quiz-intro-label">Your Consultation</span>
        <h1 className="quiz-intro-title">
          Let Us Learn
          <br />
          About Your Skin
        </h1>
        <p className="quiz-intro-desc">
          {counts.total} questions across three sections. Takes about 5 minutes.
          Your answers shape a formula made exclusively for you.
        </p>
        <div className="quiz-intro-sections">
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">01</span>
            <span className="quiz-intro-section-name">About You</span>
            <span className="quiz-intro-section-count">{counts.s1} questions</span>
          </div>
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">02</span>
            <span className="quiz-intro-section-name">Your Skin</span>
            <span className="quiz-intro-section-count">{counts.s2} questions</span>
          </div>
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">03</span>
            <span className="quiz-intro-section-name">Routine & Preferences</span>
            <span className="quiz-intro-section-count">{counts.s3} questions</span>
          </div>
        </div>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={() => router.push("/quiz/section/1")}
        >
          Begin
        </button>
      </div>
    </QuizContainer>
  );
}
