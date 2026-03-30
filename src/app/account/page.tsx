"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signIn, signUp, signOut, getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";
type DashboardSection = "overview" | "quiz" | "orders" | "subscription" | "settings";

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

const NAV_ITEMS: { key: DashboardSection; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "quiz", label: "Quiz History" },
  { key: "orders", label: "Orders" },
  { key: "subscription", label: "Subscription" },
  { key: "settings", label: "Settings" },
];

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
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");

  // Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

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
      const storedName = sessionStorage.getItem("customerName");
      if (storedName) setCustomerName(storedName);
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
    setActiveSection("overview");
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

    // Re-authenticate with current password first
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

  // Authenticated — Dashboard
  if (user) {
    const latestQuiz = quizResults.length > 0 ? quizResults[0] : null;
    const latestOrder = orders.length > 0 ? orders[0] : null;

    return (
      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-top">
            <h2 className="dashboard-sidebar-name">
              {customerName ?? "My Account"}
            </h2>
            <p className="dashboard-sidebar-email">{user.email}</p>
            {latestQuiz && (
              <span className="dashboard-skin-badge">
                {capitalize(latestQuiz.skin_type)} Skin
              </span>
            )}
          </div>

          <nav className="dashboard-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`dashboard-nav-link${activeSection === item.key ? " dashboard-nav-active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="dashboard-sidebar-bottom">
            <button
              type="button"
              className="dashboard-signout"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Tab Bar */}
        <div className="dashboard-mobile-tabs">
          <div className="dashboard-mobile-tabs-inner">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`dashboard-mobile-tab${activeSection === item.key ? " dashboard-mobile-tab-active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="dashboard-content">
          {dataLoading && (
            <div className="dashboard-loading">Loading your data...</div>
          )}

          {/* Overview Section */}
          {activeSection === "overview" && !dataLoading && (
            <div className="dashboard-section">
              <h1 className="dashboard-page-title">Overview</h1>

              {latestQuiz ? (
                <>
                  <div className="dashboard-block">
                    {/* Your Regimen */}
                    <h3 className="dashboard-block-title">Your Regimen</h3>
                    <div className="dashboard-regimen-grid">
                      {latestQuiz.recommended_serum && (
                        <div className="dashboard-regimen-item">
                          <span className="dashboard-regimen-category">Serum</span>
                          <span className="dashboard-regimen-name">{latestQuiz.recommended_serum}</span>
                        </div>
                      )}
                      {latestQuiz.recommended_cleanser && (
                        <div className="dashboard-regimen-item">
                          <span className="dashboard-regimen-category">Cleanser</span>
                          <span className="dashboard-regimen-name">{latestQuiz.recommended_cleanser}</span>
                        </div>
                      )}
                      {latestQuiz.recommended_moisturizer && (
                        <div className="dashboard-regimen-item">
                          <span className="dashboard-regimen-category">Moisturizer</span>
                          <span className="dashboard-regimen-name">{latestQuiz.recommended_moisturizer}</span>
                        </div>
                      )}
                    </div>

                    <div className="dashboard-divider" />

                    {/* Skin Profile */}
                    <h3 className="dashboard-block-title">Skin Profile</h3>
                    <div className="dashboard-profile-row">
                      <span className="dashboard-profile-label">Skin Type</span>
                      <span className="dashboard-profile-value dashboard-profile-highlight">
                        {capitalize(latestQuiz.skin_type)}
                      </span>
                    </div>
                    {latestQuiz.concerns.length > 0 && (
                      <div className="dashboard-profile-row">
                        <span className="dashboard-profile-label">Top Concerns</span>
                        <div className="dashboard-tag-list">
                          {latestQuiz.concerns.slice(0, 3).map((concern) => (
                            <span key={concern} className="dashboard-tag">
                              {formatConcern(concern)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {latestQuiz.fragrance_choice && (
                      <div className="dashboard-profile-row">
                        <span className="dashboard-profile-label">Fragrance</span>
                        <span className="dashboard-profile-value">
                          {FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice}
                        </span>
                      </div>
                    )}

                    <div className="dashboard-divider" />

                    {/* Quick Actions */}
                    <h3 className="dashboard-block-title">Quick Actions</h3>
                    <div className="dashboard-actions-row">
                      <button
                        type="button"
                        className="dashboard-btn-primary"
                        onClick={() => router.push("/quiz")}
                      >
                        Retake Quiz
                      </button>
                      <button
                        type="button"
                        className="dashboard-btn-secondary"
                        onClick={() => router.push("/report")}
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="dashboard-block dashboard-empty-cta">
                  <h3 className="dashboard-block-title">Discover Your Regimen</h3>
                  <p className="dashboard-empty-text">
                    Take your first consultation to receive personalized skincare recommendations.
                  </p>
                  <button
                    type="button"
                    className="dashboard-btn-primary"
                    onClick={() => router.push("/quiz")}
                  >
                    Take Consultation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quiz History Section */}
          {activeSection === "quiz" && !dataLoading && (
            <div className="dashboard-section">
              <h1 className="dashboard-page-title">Quiz History</h1>

              {quizResults.length > 0 ? (
                <div className="dashboard-table">
                  <div className="dashboard-table-header">
                    <span className="dashboard-th dashboard-th-date">Date</span>
                    <span className="dashboard-th dashboard-th-type">Skin Type</span>
                    <span className="dashboard-th dashboard-th-products">Products</span>
                    <span className="dashboard-th dashboard-th-action">Action</span>
                  </div>
                  {quizResults.map((quiz) => (
                    <div key={quiz.id} className="dashboard-table-row">
                      <span className="dashboard-td dashboard-td-date">{formatShortDate(quiz.created_at)}</span>
                      <span className="dashboard-td dashboard-td-type">{capitalize(quiz.skin_type)}</span>
                      <span className="dashboard-td dashboard-td-products">
                        {[quiz.recommended_serum, quiz.recommended_cleanser, quiz.recommended_moisturizer]
                          .filter(Boolean)
                          .length}{" "}
                        products
                      </span>
                      <span className="dashboard-td dashboard-td-action">
                        <button
                          type="button"
                          className="dashboard-link-btn"
                          onClick={() => router.push("/report")}
                        >
                          View
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-block dashboard-empty-state">
                  <p className="dashboard-empty-text">No quiz results yet.</p>
                  <button
                    type="button"
                    className="dashboard-btn-primary"
                    onClick={() => router.push("/quiz")}
                  >
                    Take Consultation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && !dataLoading && (
            <div className="dashboard-section">
              <h1 className="dashboard-page-title">Orders</h1>

              {orders.length > 0 ? (
                <div className="dashboard-table">
                  <div className="dashboard-table-header">
                    <span className="dashboard-th dashboard-th-date">Date</span>
                    <span className="dashboard-th dashboard-th-items">Items</span>
                    <span className="dashboard-th dashboard-th-total">Total</span>
                    <span className="dashboard-th dashboard-th-plan">Plan</span>
                    <span className="dashboard-th dashboard-th-status">Status</span>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="dashboard-table-row">
                      <span className="dashboard-td dashboard-td-date">{formatShortDate(order.created_at)}</span>
                      <span className="dashboard-td dashboard-td-items">
                        {Array.isArray(order.items) ? order.items.length : 0} item{Array.isArray(order.items) && order.items.length !== 1 ? "s" : ""}
                      </span>
                      <span className="dashboard-td dashboard-td-total">${order.total.toFixed(2)}</span>
                      <span className="dashboard-td dashboard-td-plan">
                        {PLAN_LABELS[order.subscription_plan] ?? order.subscription_plan}
                      </span>
                      <span className={`dashboard-status dashboard-status-${order.status}`}>
                        {capitalize(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-block dashboard-empty-state">
                  <p className="dashboard-empty-text">No orders yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Subscription Section */}
          {activeSection === "subscription" && !dataLoading && (
            <div className="dashboard-section">
              <h1 className="dashboard-page-title">Subscription</h1>

              <div className="dashboard-block">
                {latestOrder ? (
                  <>
                    <div className="dashboard-profile-row">
                      <span className="dashboard-profile-label">Current Plan</span>
                      <span className="dashboard-profile-value dashboard-profile-highlight">
                        {PLAN_LABELS[latestOrder.subscription_plan] ?? latestOrder.subscription_plan}
                      </span>
                    </div>
                    <div className="dashboard-profile-row">
                      <span className="dashboard-profile-label">Last Order</span>
                      <span className="dashboard-profile-value">
                        {formatDate(latestOrder.created_at)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="dashboard-profile-row">
                    <span className="dashboard-profile-label">Current Plan</span>
                    <span className="dashboard-profile-value">No active plan</span>
                  </div>
                )}

                <div className="dashboard-subscription-actions">
                  <button
                    type="button"
                    className="dashboard-btn-primary"
                    disabled
                  >
                    Manage Subscription
                  </button>
                  <p className="dashboard-muted-notice">Subscription management coming soon.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && !dataLoading && (
            <div className="dashboard-section">
              <h1 className="dashboard-page-title">Settings</h1>

              <div className="dashboard-block">
                <div className="dashboard-profile-row">
                  <span className="dashboard-profile-label">Email</span>
                  <span className="dashboard-profile-value">{user.email}</span>
                </div>
                <div className="dashboard-profile-row">
                  <span className="dashboard-profile-label">Member Since</span>
                  <span className="dashboard-profile-value">{formatDate(user.created_at)}</span>
                </div>
              </div>

              <div className="dashboard-block">
                <h3 className="dashboard-block-title">Change Password</h3>

                <div className="dashboard-field">
                  <label className="dashboard-field-label" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="dashboard-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="dashboard-field">
                  <label className="dashboard-field-label" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="dashboard-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {passwordError && <p className="dashboard-field-error">{passwordError}</p>}
                {passwordSuccess && <p className="dashboard-field-success">{passwordSuccess}</p>}

                <button
                  type="button"
                  className="dashboard-btn-primary"
                  onClick={handlePasswordChange}
                  disabled={passwordSubmitting || currentPassword.trim() === "" || newPassword.trim() === ""}
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>

              {/* Mobile Sign Out */}
              <div className="dashboard-mobile-signout">
                <button
                  type="button"
                  className="dashboard-signout"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </main>
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
