import { Suspense } from "react";
import SexSelectClient from "@/components/quiz/SexSelectClient";

export default function QuizSexPage() {
  return (
    <Suspense fallback={null}>
      <SexSelectClient />
    </Suspense>
  );
}
