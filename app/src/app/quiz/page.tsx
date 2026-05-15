import type { Metadata } from "next";
import NameInputClient from "@/components/quiz/NameInputClient";

export const metadata: Metadata = {
  title: "Consultation — Atelier Rusalka",
  description:
    "Take our 30-question skin consultation to receive a formula crafted uniquely for you.",
};

export default function QuizPage() {
  return <NameInputClient />;
}
