"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useFadeInSection } from "../../hooks/useFadeInSection";

function Ornament() {
  return (
    <svg viewBox="0 0 120 12" className="journal-ornament" aria-hidden="true">
      <line x1="0" y1="6" x2="48" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="60" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <circle cx="60" cy="6" r="0.8" fill="currentColor" opacity="0.5" />
      <line x1="72" y1="6" x2="120" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

interface ActionsProps {
  user: User;
  onSignOut: () => void;
  ready: boolean;
}

export default function Actions({ user, onSignOut, ready }: ActionsProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  useFadeInSection(sectionRef, ready);
  useFadeInSection(footerRef, ready);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const handlePasswordChange = useCallback(async () => {
    if (passwordSubmitting) return;
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordSubmitting(true);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setPasswordSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email ?? "",
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError("Current password is incorrect.");
      setPasswordSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setPasswordError(updateError.message);
      setPasswordSubmitting(false);
      return;
    }

    setPasswordSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setPasswordSubmitting(false);
  }, [currentPassword, newPassword, passwordSubmitting, user.email]);

  return (
    <>
      <section ref={sectionRef} className="journal-spread journal-spread--quiet">
        <Ornament />
        <div className="journal-quiet-actions">
          <button type="button" className="journal-quiet-link" onClick={() => router.push("/quiz")}>
            Retake your consultation
          </button>
          <button type="button" className="journal-quiet-link" onClick={() => router.push("/report")}>
            View your full report
          </button>
          <details className="journal-account-details">
            <summary className="journal-quiet-link">Manage account</summary>
            <div className="journal-account-panel">
              <div className="journal-account-row">
                <span className="journal-account-label">Email</span>
                <span className="journal-account-value">{user.email}</span>
              </div>
              <div className="journal-account-password">
                <span className="journal-account-label">Change password</span>
                <input
                  type="password"
                  className="journal-account-input"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <input
                  type="password"
                  className="journal-account-input"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {passwordError && <p className="journal-account-error">{passwordError}</p>}
                {passwordSuccess && <p className="journal-account-success">{passwordSuccess}</p>}
                <button
                  type="button"
                  className="journal-account-btn"
                  onClick={handlePasswordChange}
                  disabled={passwordSubmitting || currentPassword.trim() === "" || newPassword.trim() === ""}
                >
                  {passwordSubmitting ? "Updating..." : "Update password"}
                </button>
              </div>
            </div>
          </details>
        </div>
      </section>

      <footer ref={footerRef} className="journal-footer">
        <button type="button" className="journal-signout" onClick={onSignOut}>
          Sign out
        </button>
      </footer>
    </>
  );
}
