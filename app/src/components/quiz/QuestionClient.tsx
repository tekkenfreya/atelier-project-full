"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { useQuizState } from "@/components/quiz/hooks/useQuizState";
import { useQuizNavigation } from "@/components/quiz/hooks/useQuizNavigation";
import type { AnswerValue, QuizQuestion as QuizQuestionType } from "@/data/quizQuestions";

interface Props {
  questionId: number;
}

function applySexAdjustments(
  question: QuizQuestionType,
  sex: "Female" | "Male" | "Prefer not to say" | null
): QuizQuestionType {
  if (question.id === 15 && sex === "Male") {
    return {
      ...question,
      options: question.options?.filter((opt) => !opt.includes("around my cycle")),
    };
  }
  return question;
}

function isAnswered(value: AnswerValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return false;
}

export default function QuestionClient({ questionId }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";
  const { customerName, biologicalSex, answers, setAnswer, loaded } = useQuizState();
  const nav = useQuizNavigation({ biologicalSex });

  const question = nav.getQuestionById(questionId);

  useEffect(() => {
    if (!loaded) return;
    if (isPreview) return;
    if (!customerName.trim()) {
      router.replace("/quiz");
      return;
    }
    if (!biologicalSex) {
      router.replace("/quiz/sex");
      return;
    }
    if (!question) router.replace("/quiz");
  }, [loaded, customerName, biologicalSex, isPreview, question, router]);

  const sectionQuestions = useMemo(() => {
    if (!question) return [];
    return nav.activeQuestions.filter((q) => q.section === question.section);
  }, [nav.activeQuestions, question]);

  const sectionIndex = useMemo(() => {
    if (!question) return 0;
    return sectionQuestions.findIndex((q) => q.id === question.id);
  }, [sectionQuestions, question]);

  if (!loaded || !question) {
    return (
      <QuizContainer>
        <div className="quiz-loading" />
      </QuizContainer>
    );
  }

  const adjustedQuestion = applySexAdjustments(question, biologicalSex);
  const currentAnswer = answers[question.id] ?? null;

  const canProceed =
    question.type === "free-text" ||
    question.type === "drag-rank" ||
    isAnswered(currentAnswer);

  const isLast = nav.nextQuestionId(question.id) === null;
  const totalActive = nav.activeQuestions.length;
  const globalIndex = nav.indexOf(question.id);
  const showBack = globalIndex > 0;

  return (
    <QuizContainer
      showBack={showBack}
      onBack={() => nav.goToPrev(question.id)}
      counter={{ current: globalIndex + 1, total: totalActive }}
    >
      <QuizProgress
        section={question.section}
        sectionTitle={question.sectionTitle}
        questionIndex={sectionIndex}
        totalQuestions={sectionQuestions.length}
      />
      <QuizQuestion
        key={question.id}
        question={adjustedQuestion}
        answer={currentAnswer}
        onAnswer={(value) => setAnswer(question.id, value)}
        direction="forward"
      />
      <div className="quiz-nav">
        <button
          type="button"
          className={`quiz-nav-next ${!canProceed ? "disabled" : ""}`}
          disabled={!canProceed}
          onClick={() => nav.goToNext(question.id)}
        >
          {isLast ? "Complete" : "Next"}
        </button>
      </div>
    </QuizContainer>
  );
}
