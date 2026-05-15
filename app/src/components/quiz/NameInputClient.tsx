"use client";

import { useRouter } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import { useQuizState } from "@/components/quiz/hooks/useQuizState";

export default function NameInputClient() {
  const router = useRouter();
  const { customerName, setCustomerName, loaded } = useQuizState();

  function handleContinue() {
    if (!customerName.trim()) return;
    setCustomerName(customerName.trim());
    router.push("/quiz/sex");
  }

  if (!loaded) {
    return (
      <QuizContainer>
        <div className="quiz-loading" />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <div className="quiz-sex-select">
        <span className="quiz-intro-label">Before We Begin</span>
        <div className="quiz-name-field">
          <label htmlFor="customer-name" className="quiz-name-label">
            What should we call you?
          </label>
          <input
            id="customer-name"
            type="text"
            className="quiz-name-input"
            placeholder="Your first name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
            autoFocus
          />
          <button
            type="button"
            className="quiz-cta-btn"
            onClick={handleContinue}
            disabled={!customerName.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    </QuizContainer>
  );
}
