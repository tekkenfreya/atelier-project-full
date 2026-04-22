import type { QuizResult } from "../types";
import { formatShortDate } from "../format";

interface OverviewProps {
  latestQuiz: QuizResult;
  quizCount: number;
  ordersCount: number;
}

export default function Overview({ latestQuiz, quizCount, ordersCount }: OverviewProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Overview</h1>
        <p className="account-section__subtitle">
          A summary of your account and current ritual.
        </p>
      </header>
      <div className="account-grid">
        <div className="account-card">
          <span className="account-card__label">Skin type</span>
          <span className="account-card__value">{latestQuiz.skin_type || "—"}</span>
        </div>
        <div className="account-card">
          <span className="account-card__label">Consultations</span>
          <span className="account-card__value">{quizCount}</span>
        </div>
        <div className="account-card">
          <span className="account-card__label">Orders</span>
          <span className="account-card__value">{ordersCount}</span>
        </div>
        <div className="account-card">
          <span className="account-card__label">Last updated</span>
          <span className="account-card__value">{formatShortDate(latestQuiz.created_at)}</span>
        </div>
      </div>
      <div className="account-actions">
        <button
          type="button"
          className="account-btn account-btn--primary"
          onClick={() => (window.location.href = "/quiz")}
        >
          Retake consultation
        </button>
        <button
          type="button"
          className="account-btn account-btn--secondary"
          onClick={() => (window.location.href = "/shop")}
        >
          Shop products
        </button>
      </div>
    </section>
  );
}
