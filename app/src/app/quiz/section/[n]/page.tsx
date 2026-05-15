import { Suspense } from "react";
import { notFound } from "next/navigation";
import SectionTransitionClient from "@/components/quiz/SectionTransitionClient";

interface PageProps {
  params: Promise<{ n: string }>;
}

export default async function QuizSectionPage({ params }: PageProps) {
  const { n } = await params;
  const section = Number(n);
  if (section !== 1 && section !== 2 && section !== 3) notFound();
  return (
    <Suspense fallback={null}>
      <SectionTransitionClient section={section as 1 | 2 | 3} />
    </Suspense>
  );
}
