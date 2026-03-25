"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { quizQuestions } from "@/data/quizQuestions";
import type { AnswerValue } from "@/data/quizQuestions";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";

type BiologicalSex = "Female" | "Male" | "Prefer not to say";
type QuizScreen = "sex-select" | "intro" | "section-transition" | "question" | "complete";

const SECTION_INTROS: Record<1 | 2 | 3, { title: string; description: string }> = {
  1: {
    title: "About You",
    description:
      "We start with your lifestyle, environment, and daily habits. These factors shape your skin more than any single product ever could.",
  },
  2: {
    title: "Your Skin",
    description:
      "Now let\u2019s get into your skin itself: type, concerns, sensitivities, and current condition. This is the core of your formulation.",
  },
  3: {
    title: "Your Routine & Preferences",
    description:
      "Finally, tell us about your habits and preferences. We\u2019ll make sure your products fit naturally into your life.",
  },
};

export default function Quiz() {
  const router = useRouter();
  const [screen, setScreen] = useState<QuizScreen>("sex-select");
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [transitionSection, setTransitionSection] = useState<1 | 2 | 3>(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => { activeTween.current?.kill(); };
  }, []);

  const filteredQuestions = quizQuestions.filter((q) => q.id !== 2);
  const currentQuestion = filteredQuestions[currentIndex];

  function shouldSkipQuestion(questionId: number): boolean {
    if (questionId === 10 && biologicalSex === "Male") return true;
    return false;
  }

  function getNextIndex(fromIndex: number): number {
    let next = fromIndex + 1;
    while (next < filteredQuestions.length && shouldSkipQuestion(filteredQuestions[next].id)) {
      next++;
    }
    return next;
  }

  function getPrevIndex(fromIndex: number): number {
    let prev = fromIndex - 1;
    while (prev >= 0 && shouldSkipQuestion(filteredQuestions[prev].id)) {
      prev--;
    }
    return prev;
  }

  function getActiveQuestions(): typeof filteredQuestions {
    return filteredQuestions.filter((q) => !shouldSkipQuestion(q.id));
  }

  function getAdjustedQuestion(): typeof currentQuestion {
    if (currentQuestion.id === 15 && biologicalSex === "Male") {
      return {
        ...currentQuestion,
        options: currentQuestion.options?.filter(
          (opt) => !opt.includes("around my cycle")
        ),
      };
    }
    return currentQuestion;
  }

  const animateTransition = useCallback(
    (callback: () => void) => {
      const el = contentRef.current;
      if (!el) {
        callback();
        return;
      }
      if (activeTween.current) activeTween.current.kill();
      activeTween.current = gsap.to(el, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          callback();
          activeTween.current = gsap.fromTo(
            el,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: "power2.out" }
          );
        },
      });
    },
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen, currentIndex]);

  function handleAnswer(value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function isAnswered(): boolean {
    const answer = answers[currentQuestion.id];
    if (answer === null || answer === undefined) return false;
    if (typeof answer === "string") return answer.length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === "number") return true;
    if (typeof answer === "object") return Object.keys(answer).length > 0;
    return false;
  }

  function isFreeTextQuestion(): boolean {
    return currentQuestion.type === "free-text";
  }

  function isDragRankQuestion(): boolean {
    return currentQuestion.type === "drag-rank";
  }

  function canProceed(): boolean {
    if (isFreeTextQuestion()) return true;
    if (isDragRankQuestion()) return true;
    return isAnswered();
  }

  function handleNext() {
    setDirection("forward");

    const nextIndex = getNextIndex(currentIndex);

    if (nextIndex < filteredQuestions.length) {
      const nextQuestion = filteredQuestions[nextIndex];

      if (nextQuestion.section !== currentQuestion.section) {
        animateTransition(() => {
          setTransitionSection(nextQuestion.section);
          setScreen("section-transition");
        });
      } else {
        setCurrentIndex(nextIndex);
      }
    } else {
      animateTransition(() => {
        sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
        setScreen("complete");
      });
    }
  }

  function handleBack() {
    setDirection("backward");

    const prevIndex = getPrevIndex(currentIndex);
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  }

  function handleStartSection() {
    animateTransition(() => {
      let sectionStart = filteredQuestions.findIndex(
        (q) => q.section === transitionSection
      );
      while (sectionStart < filteredQuestions.length && shouldSkipQuestion(filteredQuestions[sectionStart].id)) {
        sectionStart++;
      }
      if (sectionStart !== -1 && sectionStart > currentIndex) {
        setCurrentIndex(sectionStart);
      }
      setScreen("question");
    });
  }

  function handleSexSelect(sex: BiologicalSex) {
    setBiologicalSex(sex);
    setAnswers((prev) => ({ ...prev, 2: sex }));
    animateTransition(() => {
      setScreen("intro");
    });
  }

  function handleBeginQuiz() {
    animateTransition(() => {
      setTransitionSection(1);
      setScreen("section-transition");
    });
  }

  function handleClose() {
    router.push("/");
  }

  function renderSexSelect() {
    return (
      <div className="quiz-sex-select">
        <span className="quiz-intro-label">Before We Begin</span>
        <h2 className="quiz-sex-title">
          What is your biological sex?
        </h2>
        <p className="quiz-sex-subtitle">
          Hormonal differences affect sebum production, skin thickness, and sensitivity patterns. This lets us account for that in your formula.
        </p>
        <div className="quiz-sex-options">
          <button
            type="button"
            className="quiz-sex-btn"
            onClick={() => handleSexSelect("Female")}
          >
            Female
          </button>
          <button
            type="button"
            className="quiz-sex-btn"
            onClick={() => handleSexSelect("Male")}
          >
            Male
          </button>
          <button
            type="button"
            className="quiz-sex-btn quiz-sex-btn-subtle"
            onClick={() => handleSexSelect("Prefer not to say")}
          >
            Prefer not to say
          </button>
        </div>
      </div>
    );
  }

  function renderIntro() {
    const active = getActiveQuestions();
    const s1 = active.filter((q) => q.section === 1).length;
    const s2 = active.filter((q) => q.section === 2).length;
    const s3 = active.filter((q) => q.section === 3).length;
    const total = s1 + s2 + s3;

    return (
      <div className="quiz-intro">
        <span className="quiz-intro-label">Your Consultation</span>
        <h1 className="quiz-intro-title">
          Let Us Learn
          <br />
          About Your Skin
        </h1>
        <p className="quiz-intro-desc">
          {total} questions across three sections. Takes about 5 minutes. Your
          answers shape a formula made exclusively for you.
        </p>
        <div className="quiz-intro-sections">
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">01</span>
            <span className="quiz-intro-section-name">About You</span>
            <span className="quiz-intro-section-count">{s1} questions</span>
          </div>
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">02</span>
            <span className="quiz-intro-section-name">Your Skin</span>
            <span className="quiz-intro-section-count">{s2} questions</span>
          </div>
          <div className="quiz-intro-section-card">
            <span className="quiz-intro-section-num">03</span>
            <span className="quiz-intro-section-name">Routine & Preferences</span>
            <span className="quiz-intro-section-count">{s3} questions</span>
          </div>
        </div>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={handleBeginQuiz}
        >
          Begin
        </button>
      </div>
    );
  }

  function renderSectionTransition() {
    const section = SECTION_INTROS[transitionSection];
    return (
      <div className="quiz-section-transition">
        <span className="quiz-section-num">Section {transitionSection}</span>
        <h2 className="quiz-section-title">{section.title}</h2>
        <p className="quiz-section-desc">{section.description}</p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={handleStartSection}
        >
          Continue
        </button>
      </div>
    );
  }

  function renderComplete() {
    return (
      <div className="quiz-complete">
        <span className="quiz-complete-label">Consultation Complete</span>
        <h2 className="quiz-complete-title">Thank You</h2>
        <p className="quiz-complete-desc">
          We've got what we need. Your personalised skincare profile is coming
          together now.
        </p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={() => router.push("/results")}
        >
          See Your Results
        </button>
      </div>
    );
  }

  function renderQuestion() {
    const activeQuestions = getActiveQuestions();
    const sectionQuestions = activeQuestions.filter(
      (q) => q.section === currentQuestion.section
    );
    const sectionIndex = sectionQuestions.findIndex(
      (q) => q.id === currentQuestion.id
    );
    const adjustedQuestion = getAdjustedQuestion();

    return (
      <>
        <QuizProgress
          section={currentQuestion.section}
          sectionTitle={currentQuestion.sectionTitle}
          questionIndex={sectionIndex}
          totalQuestions={sectionQuestions.length}
        />
        <QuizQuestion
          key={currentQuestion.id}
          question={adjustedQuestion}
          answer={answers[currentQuestion.id] ?? null}
          onAnswer={handleAnswer}
          direction={direction}
        />
        <div className="quiz-nav">
          <button
            type="button"
            className={`quiz-nav-next ${!canProceed() ? "disabled" : ""}`}
            disabled={!canProceed()}
            onClick={handleNext}
          >
            {getNextIndex(currentIndex) >= filteredQuestions.length ? "Complete" : "Next"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-topbar">
        {screen === "question" && currentIndex > 0 ? (
          <button
            type="button"
            className="quiz-topbar-back"
            onClick={handleBack}
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

        {screen === "question" && (
          <span className="quiz-topbar-counter">
            {getActiveQuestions().findIndex((q) => q.id === currentQuestion.id) + 1} / {getActiveQuestions().length}
          </span>
        )}

        <button
          type="button"
          className="quiz-topbar-close"
          onClick={handleClose}
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

      <div className="quiz-content" ref={contentRef}>
        {screen === "sex-select" && renderSexSelect()}
        {screen === "intro" && renderIntro()}
        {screen === "section-transition" && renderSectionTransition()}
        {screen === "question" && renderQuestion()}
        {screen === "complete" && renderComplete()}
      </div>
    </div>
  );
}
