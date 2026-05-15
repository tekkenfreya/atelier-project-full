"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import { useQuizState } from "@/components/quiz/hooks/useQuizState";
import { useQuizNavigation } from "@/components/quiz/hooks/useQuizNavigation";

const SECTION_INTROS: Record<1 | 2 | 3, { title: string; description: string }> = {
  1: {
    title: "About You",
    description:
      "We start with your lifestyle, environment, and daily habits. These factors shape your skin more than any single product ever could.",
  },
  2: {
    title: "Your Skin",
    description:
      "Now let’s get into your skin itself: type, concerns, sensitivities, and current condition. This is the core of your formulation.",
  },
  3: {
    title: "Your Routine & Preferences",
    description:
      "Finally, tell us about your habits and preferences. We’ll make sure your products fit naturally into your life.",
  },
};

interface Props {
  section: 1 | 2 | 3;
}

export default function SectionTransitionClient({ section }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";
  const { customerName, biologicalSex, loaded } = useQuizState();
  const { firstQuestionOfSection } = useQuizNavigation({ biologicalSex });

  useEffect(() => {
    if (!loaded) return;
    if (isPreview) return;
    if (!customerName.trim()) {
      router.replace("/quiz");
      return;
    }
    if (!biologicalSex) router.replace("/quiz/sex");
  }, [loaded, customerName, biologicalSex, isPreview, router]);

  function handleContinue() {
    const firstId = firstQuestionOfSection(section);
    if (firstId === null) {
      router.push("/quiz/complete");
      return;
    }
    router.push(`/quiz/q/${firstId}`);
  }

  const intro = SECTION_INTROS[section];

  return (
    <QuizContainer>
      <div className="quiz-section-transition">
        <span className="quiz-section-num">Section {section}</span>
        <h2 className="quiz-section-title">{intro.title}</h2>
        <p className="quiz-section-desc">{intro.description}</p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </QuizContainer>
  );
}
