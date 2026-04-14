"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { capitalize, formatConcernList, formatShortDate, FRAGRANCE_LABELS } from "../../lib/format";
import type { QuizResult, CustomerOrder } from "../../lib/types";
import { useFadeInSection } from "../../hooks/useFadeInSection";
import "./Profile.css";

interface ProfileProps {
  user: User;
  latestQuiz: QuizResult;
  quizCount: number;
  orders: CustomerOrder[];
  onSignOut: () => void;
  ready: boolean;
}

export default function Profile({ user, latestQuiz, quizCount, orders, onSignOut, ready }: ProfileProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  useFadeInSection(sectionRef, ready);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const handlePasswordChange = useCallback(async () => {
    if (pwSubmitting) return;
    setPwError(null);
    setPwSuccess(null);
    setPwSubmitting(true);

    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      setPwSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email ?? "",
      password: currentPassword,
    });

    if (signInError) {
      setPwError("Current password is incorrect.");
      setPwSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setPwError(updateError.message);
      setPwSubmitting(false);
      return;
    }

    setPwSuccess("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setPwSubmitting(false);
  }, [currentPassword, newPassword, pwSubmitting, user.email]);

  return (
    <section ref={sectionRef} className="pr-section">
      <p className="pr-eyebrow">III · Your Profile</p>
      <h2 className="pr-title">The Ledger.</h2>

      <p className="pr-prose">
        Your skin type is <em>{capitalize(latestQuiz.skin_type)}</em>.
        {latestQuiz.concerns.length > 0 && (
          <> You&rsquo;ve asked us to address <em>{formatConcernList(latestQuiz.concerns)}</em>.</>
        )}
        {latestQuiz.fragrance_choice && (
          <> Your ritual carries <em>{(FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice).toLowerCase()}</em>.</>
        )}
      </p>

      <div className="pr-meta">
        <div className="pr-meta-item">
          <span className="pr-meta-label">Member since</span>
          <span className="pr-meta-value">{formatShortDate(user.created_at)}</span>
        </div>
        <div className="pr-meta-item">
          <span className="pr-meta-label">Consultations</span>
          <span className="pr-meta-value">{quizCount}</span>
        </div>
        <div className="pr-meta-item">
          <span className="pr-meta-label">Orders</span>
          <span className="pr-meta-value">{orders.length}</span>
        </div>
      </div>

      <div className="pr-divider" />

      <div className="pr-links">
        <button type="button" className="pr-link" onClick={() => router.push("/quiz")}>
          Retake your consultation
        </button>
        <button type="button" className="pr-link" onClick={() => router.push("/report")}>
          View your full report
        </button>
        <button type="button" className="pr-link" onClick={() => router.push("/cart")}>
          Manage subscription
        </button>
      </div>

      <details className="pr-details">
        <summary>Change password</summary>
        <div className="pr-panel">
          <div className="pr-row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>
          <input
            type="password"
            className="pr-input"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <input
            type="password"
            className="pr-input"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          {pwError && <p className="pr-error">{pwError}</p>}
          {pwSuccess && <p className="pr-success">{pwSuccess}</p>}
          <button
            type="button"
            className="pr-btn"
            onClick={handlePasswordChange}
            disabled={pwSubmitting || currentPassword.trim() === "" || newPassword.trim() === ""}
          >
            {pwSubmitting ? "Updating..." : "Update password"}
          </button>
        </div>
      </details>

      <button type="button" className="pr-signout" onClick={onSignOut}>
        Sign out
      </button>
    </section>
  );
}
