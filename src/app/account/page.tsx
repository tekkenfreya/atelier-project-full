"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signIn, signUp, signOut, getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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

  const fetchAccountData = useCallback(async (userId: string) => {
    setDataLoading(true);
    try {
      const [quizResponse, ordersResponse] = await Promise.all([
        supabase
          .from("quiz_results")
          .select("id, skin_type, concerns, recommended_serum, recommended_cleanser, recommended_moisturizer, fragrance_choice, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("customer_orders")
          .select("id, items, subscription_plan, total, status, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (quizResponse.data) {
        setQuizResults(quizResponse.data as QuizResult[]);
      }
      if (ordersResponse.data) {
        setOrders(ordersResponse.data as CustomerOrder[]);
      }
    } catch {
      // Non-critical — account data fetch failure should not break the page
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchAccountData(currentUser.id);
      }
    }
    checkAuth();
  }, [fetchAccountData]);

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

  if (loading) {
    return (
      <div className="account-container">
        <div className="account-loading">Loading...</div>
      </div>
    );
  }

  if (user) {
    const latestQuiz = quizResults.length > 0 ? quizResults[0] : null;

    return (
      <div className="account-container">
        <div className="account-header">
          <span className="account-label">My Account</span>
          <h1 className="account-title">Welcome</h1>
        </div>

        <div className="account-card account-card-wide">
          <div className="account-info-row">
            <span className="account-info-label">Email</span>
            <span className="account-info-value">{user.email}</span>
          </div>

          <div className="account-info-row">
            <span className="account-info-label">Member since</span>
            <span className="account-info-value">
              {formatDate(user.created_at)}
            </span>
          </div>

          {dataLoading && (
            <div className="account-section-loading">Loading your data...</div>
          )}

          {latestQuiz && (
            <>
              <div className="account-divider" />
              <h2 className="account-section-title">Skin Profile</h2>

              <div className="account-profile-grid">
                <div className="account-profile-item">
                  <span className="account-profile-label">Skin Type</span>
                  <span className="account-profile-value account-profile-highlight">
                    {latestQuiz.skin_type.charAt(0).toUpperCase() + latestQuiz.skin_type.slice(1)}
                  </span>
                </div>

                {latestQuiz.concerns.length > 0 && (
                  <div className="account-profile-item">
                    <span className="account-profile-label">Top Concerns</span>
                    <div className="account-tag-list">
                      {latestQuiz.concerns.slice(0, 3).map((concern) => (
                        <span key={concern} className="account-tag">
                          {concern.charAt(0).toUpperCase() + concern.slice(1).replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="account-profile-item">
                  <span className="account-profile-label">Recommended Products</span>
                  <div className="account-product-list">
                    {latestQuiz.recommended_serum && (
                      <div className="account-product-row">
                        <span className="account-product-category">Serum</span>
                        <span className="account-product-name">{latestQuiz.recommended_serum}</span>
                      </div>
                    )}
                    {latestQuiz.recommended_cleanser && (
                      <div className="account-product-row">
                        <span className="account-product-category">Cleanser</span>
                        <span className="account-product-name">{latestQuiz.recommended_cleanser}</span>
                      </div>
                    )}
                    {latestQuiz.recommended_moisturizer && (
                      <div className="account-product-row">
                        <span className="account-product-category">Moisturizer</span>
                        <span className="account-product-name">{latestQuiz.recommended_moisturizer}</span>
                      </div>
                    )}
                  </div>
                </div>

                {latestQuiz.fragrance_choice && (
                  <div className="account-profile-item">
                    <span className="account-profile-label">Fragrance</span>
                    <span className="account-profile-value">
                      {FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice}
                    </span>
                  </div>
                )}

                <div className="account-profile-item">
                  <span className="account-profile-label">Quiz Taken</span>
                  <span className="account-profile-value">{formatDate(latestQuiz.created_at)}</span>
                </div>
              </div>
            </>
          )}

          {quizResults.length > 1 && (
            <>
              <div className="account-divider" />
              <h2 className="account-section-title">Quiz History</h2>
              <div className="account-history-list">
                {quizResults.slice(1).map((quiz) => (
                  <div key={quiz.id} className="account-history-row">
                    <span className="account-history-date">{formatShortDate(quiz.created_at)}</span>
                    <span className="account-history-detail">
                      {quiz.skin_type.charAt(0).toUpperCase() + quiz.skin_type.slice(1)} skin
                    </span>
                    <span className="account-history-products">
                      {[quiz.recommended_serum, quiz.recommended_cleanser, quiz.recommended_moisturizer]
                        .filter(Boolean)
                        .length}{" "}
                      products
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {orders.length > 0 && (
            <>
              <div className="account-divider" />
              <h2 className="account-section-title">Order History</h2>
              <div className="account-history-list">
                {orders.map((order) => (
                  <div key={order.id} className="account-history-row">
                    <span className="account-history-date">{formatShortDate(order.created_at)}</span>
                    <span className="account-history-detail">
                      {Array.isArray(order.items) ? order.items.length : 0} item
                      {Array.isArray(order.items) && order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="account-history-detail">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="account-history-detail">
                      {PLAN_LABELS[order.subscription_plan] ?? order.subscription_plan}
                    </span>
                    <span className={`account-status account-status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

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
