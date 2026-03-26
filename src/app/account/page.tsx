"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signIn, signUp, signOut, getUser } from "@/lib/auth";

type AuthMode = "login" | "signup";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
    }
    checkAuth();
  }, []);

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

    setUser(authedUser);
    setSubmitting(false);
  }, [mode, email, password, submitting]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setEmail("");
    setPassword("");
  }, []);

  if (loading) {
    return (
      <div className="account-container">
        <div className="account-loading">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="account-container">
        <div className="account-header">
          <span className="account-label">My Account</span>
          <h1 className="account-title">Welcome</h1>
        </div>

        <div className="account-card">
          <div className="account-info-row">
            <span className="account-info-label">Email</span>
            <span className="account-info-value">{user.email}</span>
          </div>

          <div className="account-info-row">
            <span className="account-info-label">Member since</span>
            <span className="account-info-value">
              {new Date(user.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="account-divider" />

          <div className="account-actions">
            <button
              type="button"
              className="account-btn"
              onClick={() => router.push("/quiz")}
            >
              Take New Quiz
            </button>
            <button
              type="button"
              className="account-btn-secondary"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <span className="account-label">Account</span>
        <h1 className="account-title">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>
      </div>

      <div className="account-card">
        <div className="account-field">
          <label className="account-field-label" htmlFor="account-email">
            Email
          </label>
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
          <label className="account-field-label" htmlFor="account-password">
            Password
          </label>
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
          {submitting
            ? "Please wait..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>

        <p className="account-toggle">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="account-toggle-btn"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="account-toggle-btn"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
