"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnswerValue } from "@/data/quizQuestions";

export type BiologicalSex = "Female" | "Male" | "Prefer not to say";

export interface QuizState {
  customerName: string;
  biologicalSex: BiologicalSex | null;
  answers: Record<number, AnswerValue>;
  loaded: boolean;
}

export interface QuizActions {
  setCustomerName: (name: string) => void;
  setBiologicalSex: (sex: BiologicalSex) => void;
  setAnswer: (questionId: number, value: AnswerValue) => void;
}

function parseBiologicalSex(raw: string | null): BiologicalSex | null {
  if (raw === "Female" || raw === "Male" || raw === "Prefer not to say") return raw;
  return null;
}

export function useQuizState(): QuizState & QuizActions {
  const [customerName, setNameState] = useState("");
  const [biologicalSex, setSexState] = useState<BiologicalSex | null>(null);
  const [answers, setAnswersState] = useState<Record<number, AnswerValue>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let nextName = "";
    let nextSex: BiologicalSex | null = null;
    let nextAnswers: Record<number, AnswerValue> = {};

    try {
      nextName = sessionStorage.getItem("customerName") ?? "";
      nextSex = parseBiologicalSex(sessionStorage.getItem("biologicalSex"));
      const rawAnswers = sessionStorage.getItem("quizAnswers");
      if (rawAnswers) nextAnswers = JSON.parse(rawAnswers);
    } catch {
      // corrupted state — fall through with defaults
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sessionStorage hydration on mount
    setNameState(nextName);
    setSexState(nextSex);
    setAnswersState(nextAnswers);
    setLoaded(true);
  }, []);

  const setCustomerName = useCallback((name: string) => {
    setNameState(name);
    sessionStorage.setItem("customerName", name);
  }, []);

  const setBiologicalSex = useCallback((sex: BiologicalSex) => {
    setSexState(sex);
    sessionStorage.setItem("biologicalSex", sex);
    setAnswersState((prev) => {
      const next = { ...prev, 2: sex };
      sessionStorage.setItem("quizAnswers", JSON.stringify(next));
      return next;
    });
  }, []);

  const setAnswer = useCallback((questionId: number, value: AnswerValue) => {
    setAnswersState((prev) => {
      const next = { ...prev, [questionId]: value };
      sessionStorage.setItem("quizAnswers", JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    customerName,
    biologicalSex,
    answers,
    loaded,
    setCustomerName,
    setBiologicalSex,
    setAnswer,
  };
}
