"use client";

interface QuizProgressProps {
  section: 1 | 2 | 3;
  sectionTitle: string;
  questionIndex: number;
  totalQuestions: number;
}

export default function QuizProgress({
  section,
  sectionTitle,
  questionIndex,
  totalQuestions,
}: QuizProgressProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-progress">
      <span className="quiz-progress-text">
        Section {section} of 3 &middot; Question {questionIndex + 1} of {totalQuestions}
      </span>
      <span className="quiz-progress-section">{sectionTitle}</span>
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
