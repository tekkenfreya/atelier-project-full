import type { Metadata } from "next";
import Quiz from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Consultation \u2014 Atelier Rusalka",
  description:
    "Take our 30-question skin consultation to receive a formula crafted uniquely for you.",
};

export default function QuizPage() {
  return <Quiz />;
}
