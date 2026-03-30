"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signIn, signUp, signOut, getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AuthMode = "login" | "signup";

interface QuizResult {
  id: string;
  skin_type: string;
  concerns: string[];
  recommended_serum: string | null;
  recommended_cleanser: string | null;
  recommended_moisturizer: string | null;
  fragrance_choice: string | null;
  created_at: string;
}

interface OrderItem {
  productName: string;
  category: string;
  price: number;
}

interface CustomerOrder {
  id: string;
  items: OrderItem[];
  subscription_plan: string;
  total: number;
  status: string;
  created_at: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PLAN_LABELS: Record<string, string> = {
  "one-time": "One-Time",
  "bi-monthly": "Bi-Monthly",
  annual: "Annual",
};

const FRAGRANCE_LABELS: Record<string, string> = {
  F0: "No fragrance",
  F1: "Light, fresh botanical",
  F2: "Warm, earthy undertones",
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatConcern(concern: string): string {
  return capitalize(concern.replace(/-/g, " "));
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  // Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Section refs for GSAP scroll animations
  const heroRef = useRef<HTMLElement>(null);
  const regimenRef = useRef<HTMLElement>(null);
  const skinProfileRef = useRef<HTMLElement>(null);
  const botanicalsRef = useRef<HTMLElement>(null);
  const quizHistoryRef = useRef<HTMLElement>(null);
  const ordersRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const fetchAccountData = useCallback(async (userId: string) => {
    setDataLoading(true);
    try {
      const [quizResponse, ordersResponse] = await Promise.all([
        supabase
          .from("quiz_results")
          .select("id, skin_type, concerns, recommended_serum, recommended_cleanser, recommended_moisturizer, fragrance_choice, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("customer_orders")
          .select("id, items, subscription_plan, total, status, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (quizResponse.data) {
        setQuizResults(quizResponse.data as QuizResult[]);
      }
      if (ordersResponse.data) {
        setOrders(ordersResponse.data as CustomerOrder[]);
      }
    } catch {
      // Non-critical
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
      const storedName = sessionStorage.getItem("customerName");
      if (storedName) setCustomerName(storedName);
      if (currentUser) {
        fetchAccountData(currentUser.id);
      }
    }
    checkAuth();
  }, [fetchAccountData]);

  // GSAP scroll-triggered animations — correct gsap.context pattern
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !user || dataLoading) return;
    if (!pageRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Hero — visible on load, animate immediately (no ScrollTrigger)
      if (heroRef.current) {
        gsap.fromTo(heroRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }

      // Below-fold sections — paused, triggered on scroll
      const belowFoldRefs = [
        regimenRef, skinProfileRef, botanicalsRef,
        quizHistoryRef, ordersRef, actionsRef, settingsRef, footerRef,
      ];

      belowFoldRefs.forEach((ref) => {
        if (!ref.current) return;
        const anim = gsap.fromTo(ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", paused: true }
        );
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 85%",
          animation: anim,
          once: true,
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [loading, user, dataLoading]);

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
    if (authedUser) {
      fetchAccountData(authedUser.id);
    }
  }, [mode, email, password, submitting, fetchAccountData]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setEmail("");
    setPassword("");
    setQuizResults([]);
    setOrders([]);
  }, []);

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
      email: user?.email ?? "",
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError("Current password is incorrect.");
      setPasswordSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setPasswordError(updateError.message);
      setPasswordSubmitting(false);
      return;
    }

    setPasswordSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setPasswordSubmitting(false);
  }, [currentPassword, newPassword, passwordSubmitting, user?.email]);

  // Loading state
  if (loading) {
    return (
      <div className="account-container">
        <div className="account-loading">Loading...</div>
      </div>
    );
  }

  // Authenticated — Luxury editorial dashboard
  if (user) {
    const latestQuiz = quizResults.length > 0 ? quizResults[0] : null;

    // No quiz data — single CTA
    if (!dataLoading && !latestQuiz) {
      return (
        <div className="profile-page">
          <section className="profile-hero profile-hero--empty">
            <div className="profile-content">
              <h1 className="profile-hero__title">
                Welcome{customerName ? `, ${customerName}` : ""}
              </h1>
              <p className="profile-hero__subtitle">
                Take your first consultation to receive personalized skincare recommendations tailored to your skin.
              </p>
              <button
                type="button"
                className="profile-btn profile-btn--primary profile-btn--large"
                onClick={() => router.push("/quiz")}
              >
                Take Your First Consultation
              </button>
            </div>
          </section>

          <footer className="profile-signout">
            <button
              type="button"
              className="profile-signout__link"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </footer>
        </div>
      );
    }

    if (dataLoading) {
      return (
        <div className="account-container">
          <div className="account-loading">Loading your profile...</div>
        </div>
      );
    }

    return (
      <div className="profile-page" ref={pageRef}>
        {/* HERO */}
        <section ref={heroRef} className="profile-hero">
          <div className="profile-content">
            <h1 className="profile-hero__title">
              Welcome back{customerName ? `, ${customerName}` : ""}
            </h1>
            <p className="profile-hero__email">{user.email}</p>
            {latestQuiz && (
              <span className="profile-hero__skin-badge">
                {capitalize(latestQuiz.skin_type)} Skin
              </span>
            )}
          </div>
        </section>

        {/* YOUR REGIMEN */}
        {latestQuiz && (
          <section ref={regimenRef} className="profile-section">
            <div className="profile-content">
              <div className="profile-divider" />
              <h2 className="profile-section__title">Your Regimen</h2>
              <div className="profile-regimen">
                {latestQuiz.recommended_serum && (
                  <div className="profile-regimen__item">
                    <span className="profile-regimen__label">SERUM</span>
                    <span className="profile-regimen__name">{latestQuiz.recommended_serum}</span>
                  </div>
                )}
                {latestQuiz.recommended_cleanser && (
                  <div className="profile-regimen__item">
                    <span className="profile-regimen__label">CLEANSER</span>
                    <span className="profile-regimen__name">{latestQuiz.recommended_cleanser}</span>
                  </div>
                )}
                {latestQuiz.recommended_moisturizer && (
                  <div className="profile-regimen__item">
                    <span className="profile-regimen__label">MOISTURIZER</span>
                    <span className="profile-regimen__name">{latestQuiz.recommended_moisturizer}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SKIN PROFILE */}
        {latestQuiz && (
          <section ref={skinProfileRef} className="profile-section">
            <div className="profile-content">
              <div className="profile-divider" />
              <h2 className="profile-section__title">Skin Profile</h2>
              <div className="profile-skin">
                <div className="profile-skin__block">
                  <span className="profile-skin__label">Skin Type</span>
                  <span className="profile-skin__type">
                    {capitalize(latestQuiz.skin_type)}
                  </span>
                </div>
                {latestQuiz.concerns.length > 0 && (
                  <div className="profile-skin__block">
                    <span className="profile-skin__label">Top Concerns</span>
                    <div className="profile-concerns">
                      {latestQuiz.concerns.slice(0, 3).map((concern) => (
                        <span key={concern} className="profile-concern">
                          {formatConcern(concern)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {latestQuiz.fragrance_choice && (
                  <div className="profile-skin__block">
                    <span className="profile-skin__label">Fragrance</span>
                    <span className="profile-skin__value">
                      {FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* YOUR BOTANICALS */}
        {latestQuiz && (
          <section ref={botanicalsRef} className="profile-section">
            <div className="profile-content">
              <div className="profile-divider" />
              <h2 className="profile-section__title">Your Botanicals</h2>
              <p className="profile-desc">
                Eastern European botanical extracts selected for your skin.
              </p>
              <a href="/report" className="profile-text-link">
                Explore your ingredients
              </a>
            </div>
          </section>
        )}

        {/* QUIZ HISTORY */}
        <section ref={quizHistoryRef} className="profile-section">
          <div className="profile-content">
            <div className="profile-divider" />
            <h2 className="profile-section__title">Quiz History</h2>
            {quizResults.length > 0 ? (
              <div className="profile-rows">
                {quizResults.map((quiz) => (
                  <div key={quiz.id} className="profile-row">
                    <span className="profile-row__date">{formatShortDate(quiz.created_at)}</span>
                    <span className="profile-row__detail">
                      {capitalize(quiz.skin_type)} Skin
                    </span>
                    <span className="profile-row__detail profile-row__detail--muted">
                      {[quiz.recommended_serum, quiz.recommended_cleanser, quiz.recommended_moisturizer]
                        .filter(Boolean).length}{" "}products
                    </span>
                    <button
                      type="button"
                      className="profile-row__link"
                      onClick={() => router.push("/report")}
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-empty">No quiz results yet.</p>
            )}
          </div>
        </section>

        {/* ORDERS */}
        <section ref={ordersRef} className="profile-section">
          <div className="profile-content">
            <div className="profile-divider" />
            <h2 className="profile-section__title">Orders</h2>
            {orders.length > 0 ? (
              <div className="profile-rows">
                {orders.map((order) => (
                  <div key={order.id} className="profile-row">
                    <span className="profile-row__date">{formatShortDate(order.created_at)}</span>
                    <span className="profile-row__detail">
                      {Array.isArray(order.items) ? order.items.length : 0}{" "}
                      item{Array.isArray(order.items) && order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="profile-row__detail">${order.total.toFixed(2)}</span>
                    <span className="profile-row__detail profile-row__detail--muted">
                      {PLAN_LABELS[order.subscription_plan] ?? order.subscription_plan}
                    </span>
                    <span className={`profile-status profile-status--${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="profile-empty">No orders yet.</p>
            )}
          </div>
        </section>

        {/* ACTIONS */}
        <section ref={actionsRef} className="profile-section">
          <div className="profile-content">
            <div className="profile-divider" />
            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn--primary"
                onClick={() => router.push("/quiz")}
              >
                Retake Quiz
              </button>
              <button
                type="button"
                className="profile-btn profile-btn--outline"
                onClick={() => router.push("/report")}
              >
                View Report
              </button>
            </div>
          </div>
        </section>

        {/* SETTINGS */}
        <section ref={settingsRef} className="profile-section">
          <div className="profile-content">
            <div className="profile-divider" />
            <h2 className="profile-section__title">Settings</h2>
            <div className="profile-settings">
              <div className="profile-settings__info">
                <span className="profile-settings__label">Email</span>
                <span className="profile-settings__value">{user.email}</span>
              </div>
              <div className="profile-settings__info">
                <span className="profile-settings__label">Member since</span>
                <span className="profile-settings__value">{formatDate(user.created_at)}</span>
              </div>

              <div className="profile-settings__password">
                <h3 className="profile-settings__heading">Change Password</h3>

                <div className="profile-field">
                  <label className="profile-field__label" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="profile-field__input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-field__label" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="profile-field__input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {passwordError && <p className="profile-field__error">{passwordError}</p>}
                {passwordSuccess && <p className="profile-field__success">{passwordSuccess}</p>}

                <button
                  type="button"
                  className="profile-btn profile-btn--primary"
                  onClick={handlePasswordChange}
                  disabled={passwordSubmitting || currentPassword.trim() === "" || newPassword.trim() === ""}
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SIGN OUT */}
        <footer ref={footerRef} className="profile-signout">
          <button
            type="button"
            className="profile-signout__link"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </footer>
      </div>
    );
  }

  // Not authenticated — Login/Signup Form
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
