"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions } from "@/data/quizQuestions";
import type { QuizQuestion as QuizQuestionType } from "@/data/quizQuestions";
import type { BiologicalSex } from "./useQuizState";

// Q2 (biological sex) has its own /quiz/sex page, not part of the question flow.
const SKIP_FROM_QUESTION_FLOW = new Set([2]);

interface NavigationOptions {
  biologicalSex: BiologicalSex | null;
}

function shouldSkipForSex(question: QuizQuestionType, sex: BiologicalSex | null): boolean {
  if (question.id === 10 && sex === "Male") return true;
  return false;
}

export function useQuizNavigation({ biologicalSex }: NavigationOptions) {
  const router = useRouter();

  const activeQuestions = useMemo(() => {
    return quizQuestions.filter((q) => {
      if (SKIP_FROM_QUESTION_FLOW.has(q.id)) return false;
      if (shouldSkipForSex(q, biologicalSex)) return false;
      return true;
    });
  }, [biologicalSex]);

  const indexOf = useCallback(
    (id: number): number => activeQuestions.findIndex((q) => q.id === id),
    [activeQuestions]
  );

  const getQuestionById = useCallback(
    (id: number): QuizQuestionType | null => activeQuestions.find((q) => q.id === id) ?? null,
    [activeQuestions]
  );

  const sectionForQuestion = useCallback(
    (id: number): 1 | 2 | 3 | null => getQuestionById(id)?.section ?? null,
    [getQuestionById]
  );

  const firstQuestionOfSection = useCallback(
    (section: 1 | 2 | 3): number | null =>
      activeQuestions.find((q) => q.section === section)?.id ?? null,
    [activeQuestions]
  );

  const nextQuestionId = useCallback(
    (currentId: number): number | null => {
      const i = indexOf(currentId);
      if (i < 0 || i + 1 >= activeQuestions.length) return null;
      return activeQuestions[i + 1].id;
    },
    [activeQuestions, indexOf]
  );

  const prevQuestionId = useCallback(
    (currentId: number): number | null => {
      const i = indexOf(currentId);
      if (i <= 0) return null;
      return activeQuestions[i - 1].id;
    },
    [activeQuestions, indexOf]
  );

  const goToNext = useCallback(
    (currentId: number) => {
      const nextId = nextQuestionId(currentId);
      if (nextId === null) {
        router.push("/quiz/complete");
        return;
      }
      const next = sectionForQuestion(nextId);
      const current = sectionForQuestion(currentId);
      if (next !== null && current !== null && next !== current) {
        router.push(`/quiz/section/${next}`);
        return;
      }
      router.push(`/quiz/q/${nextId}`);
    },
    [router, nextQuestionId, sectionForQuestion]
  );

  const goToPrev = useCallback(
    (currentId: number) => {
      const prevId = prevQuestionId(currentId);
      if (prevId === null) {
        router.push("/quiz/intro");
        return;
      }
      router.push(`/quiz/q/${prevId}`);
    },
    [router, prevQuestionId]
  );

  return {
    activeQuestions,
    getQuestionById,
    indexOf,
    nextQuestionId,
    prevQuestionId,
    sectionForQuestion,
    firstQuestionOfSection,
    goToNext,
    goToPrev,
  };
}
