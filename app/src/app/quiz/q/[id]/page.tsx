import { Suspense } from "react";
import { notFound } from "next/navigation";
import QuestionClient from "@/components/quiz/QuestionClient";
import { quizQuestions } from "@/data/quizQuestions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const VALID_IDS = new Set(
  quizQuestions.filter((q) => q.id !== 2).map((q) => q.id)
);

export default async function QuizQuestionPage({ params }: PageProps) {
  const { id } = await params;
  const questionId = Number(id);
  if (!Number.isInteger(questionId) || !VALID_IDS.has(questionId)) notFound();
  return (
    <Suspense fallback={null}>
      <QuestionClient questionId={questionId} />
    </Suspense>
  );
}
