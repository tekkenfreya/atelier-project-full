import { Suspense } from "react";
import IntroClient from "@/components/quiz/IntroClient";

export default function QuizIntroPage() {
  return (
    <Suspense fallback={null}>
      <IntroClient />
    </Suspense>
  );
}
