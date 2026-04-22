"use client";

import { useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signIn, signUp } from "@/lib/auth";

type AuthMode = "login" | "signup";

interface LoginFormProps {
  onAuth: (user: User) => void;
}

export default function LoginForm({ onAuth }: LoginFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const action = mode === "login" ? signIn : signUp;
    const { user: authedUser, error: authError } = await action(email, password);

    if (authError) {
      setError(authError);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    if (authedUser) onAuth(authedUser);
  }, [mode, email, password, submitting, onAuth]);

  return (
    <div className="account-container">
      <div className="account-header">
        <span className="account-label">Account</span>
        <h1 className="account-title">{mode === "login" ? "Sign In" : "Create Account"}</h1>
      </div>

      <div className="account-card">
        <div className="account-field">
          <label className="account-field-label" htmlFor="account-email">Email</label>
          <input
            id="account-email"
            type="email"
            className="account-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="account-field">
          <label className="account-field-label" htmlFor="account-password">Password</label>
          <input
            id="account-password"
            type="password"
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <p className="account-error">{error}</p>}

        <button
          type="button"
          className="account-btn"
          onClick={handleSubmit}
          disabled={submitting || email.trim() === "" || password.trim() === ""}
        >
          {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="account-toggle">
          {mode === "login" ? (
            <>Don&apos;t have an account?{" "}
              <button type="button" className="account-toggle-btn" onClick={() => { setMode("signup"); setError(null); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button type="button" className="account-toggle-btn" onClick={() => { setMode("login"); setError(null); }}>
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
