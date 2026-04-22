import { NextRequest, NextResponse } from "next/server";
import { recommend } from "@/features/consultation/recommend";
import type { QuizAnswers } from "@/features/consultation/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: QuizAnswers = body.answers;

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing quiz answers" },
        { status: 400 }
      );
    }

    const result = await recommend(answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
