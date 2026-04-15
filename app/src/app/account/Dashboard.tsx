"use client";

import { useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { useAccountData } from "./hooks/useAccountData";
import {
  formatDate,
  formatShortDate,
  formatConcern,
  PLAN_LABELS,
  FRAGRANCE_LABELS,
} from "./lib/format";
import type { RitualCategory } from "./lib/types";
import "./Dashboard.css";

type SectionId = "overview" | "ritual" | "orders" | "extracts" | "profile";

interface DashboardProps {
  user: User;
  customerName: string | null;
  onSignOut: () => void;
}

const NAV: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "ritual", label: "Ritual" },
  { id: "orders", label: "Orders" },
  { id: "extracts", label: "Extracts" },
  { id: "profile", label: "Profile" },
];

export default function Dashboard({ user, customerName, onSignOut }: DashboardProps) {
  const { quizResults, orders, extracts, extractsByCategory, loading } = useAccountData(user.id);
  const [active, setActive] = useState<SectionId>("overview");

  const latestQuiz = quizResults.length > 0 ? quizResults[0] : null;
  const displayName = customerName ?? user.email?.split("@")[0] ?? "";

  const ritualRows = useMemo(() => {
    if (!latestQuiz) return [];
    return (
      [
        { category: "Cleanser", product: latestQuiz.recommended_cleanser },
        { category: "Serum", product: latestQuiz.recommended_serum },
        { category: "Moisturizer", product: latestQuiz.recommended_moisturizer },
      ] as { category: RitualCategory; product: string | null }[]
    ).filter((r) => !!r.product);
  }, [latestQuiz]);

  if (loading) {
    return (
      <div className="account-container">
        <div className="account-loading">Loading your profile...</div>
      </div>
    );
  }

  if (!latestQuiz) {
    return (
      <div className="account-empty">
        <div className="account-empty__card">
          <h1 className="account-empty__title">
            Welcome{customerName ? `, ${customerName}` : ""}
          </h1>
          <p className="account-empty__subtitle">
            Take your first consultation to receive personalized skincare recommendations.
          </p>
          <button
            type="button"
            className="account-btn account-btn--primary"
            onClick={() => (window.location.href = "/quiz")}
          >
            Take Your First Consultation
          </button>
          <button type="button" className="account-linkbtn" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      <aside className="account-sidebar">
        <div className="account-sidebar__brand">
          <span className="account-sidebar__brand-eyebrow">Account</span>
          <span className="account-sidebar__brand-name">{displayName}</span>
        </div>
        <nav className="account-sidebar__nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                "account-sidebar__navbtn" +
                (active === item.id ? " account-sidebar__navbtn--active" : "")
              }
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="account-sidebar__footer">
          <button type="button" className="account-linkbtn" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="account-main">
        {active === "overview" && (
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
                <span className="account-card__value">{quizResults.length}</span>
              </div>
              <div className="account-card">
                <span className="account-card__label">Orders</span>
                <span className="account-card__value">{orders.length}</span>
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
        )}

        {active === "ritual" && (
          <section className="account-section">
            <header className="account-section__header">
              <h1 className="account-section__title">Your Ritual</h1>
              <p className="account-section__subtitle">
                Based on consultation from {formatDate(latestQuiz.created_at)}.
              </p>
            </header>
            <table className="account-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Key extracts</th>
                </tr>
              </thead>
              <tbody>
                {ritualRows.map((row) => {
                  const exts = extractsByCategory[row.category] ?? [];
                  return (
                    <tr key={row.category}>
                      <td>{row.category}</td>
                      <td>{row.product}</td>
                      <td>
                        {exts.length > 0
                          ? exts.map((e) => e.ingredientName).join(", ")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {latestQuiz.concerns && latestQuiz.concerns.length > 0 && (
              <div className="account-metarow">
                <span className="account-metarow__label">Concerns</span>
                <span className="account-metarow__value">
                  {latestQuiz.concerns.map(formatConcern).join(", ")}
                </span>
              </div>
            )}
            {latestQuiz.fragrance_choice && (
              <div className="account-metarow">
                <span className="account-metarow__label">Fragrance</span>
                <span className="account-metarow__value">
                  {FRAGRANCE_LABELS[latestQuiz.fragrance_choice] ?? latestQuiz.fragrance_choice}
                </span>
              </div>
            )}
          </section>
        )}

        {active === "orders" && (
          <section className="account-section">
            <header className="account-section__header">
              <h1 className="account-section__title">Orders</h1>
              <p className="account-section__subtitle">Your order history.</p>
            </header>
            {orders.length === 0 ? (
              <p className="account-empty-inline">No orders yet.</p>
            ) : (
              <table className="account-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th className="account-table__right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{formatShortDate(o.created_at)}</td>
                      <td>{o.items.map((i) => i.productName).join(", ")}</td>
                      <td>{PLAN_LABELS[o.subscription_plan] ?? o.subscription_plan}</td>
                      <td>
                        <span className="account-status">{o.status}</span>
                      </td>
                      <td className="account-table__right">€{o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {active === "extracts" && (
          <section className="account-section">
            <header className="account-section__header">
              <h1 className="account-section__title">Extracts</h1>
              <p className="account-section__subtitle">
                Botanical extracts in your current ritual.
              </p>
            </header>
            {extracts.length === 0 ? (
              <p className="account-empty-inline">No extracts to display.</p>
            ) : (
              <table className="account-table">
                <thead>
                  <tr>
                    <th>Extract</th>
                    <th>Origin</th>
                    <th>Countries</th>
                  </tr>
                </thead>
                <tbody>
                  {extracts.map((e) => (
                    <tr key={e.ingredientName}>
                      <td>{e.ingredientName}</td>
                      <td>{e.origin.region ?? e.origin.country}</td>
                      <td>{e.allCountries.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {active === "profile" && (
          <section className="account-section">
            <header className="account-section__header">
              <h1 className="account-section__title">Profile</h1>
              <p className="account-section__subtitle">Your account information.</p>
            </header>
            <dl className="account-deflist">
              <div className="account-deflist__row">
                <dt>Name</dt>
                <dd>{customerName ?? "—"}</dd>
              </div>
              <div className="account-deflist__row">
                <dt>Email</dt>
                <dd>{user.email ?? "—"}</dd>
              </div>
              <div className="account-deflist__row">
                <dt>Member since</dt>
                <dd>
                  {user.created_at ? formatDate(user.created_at) : "—"}
                </dd>
              </div>
            </dl>
            <div className="account-actions">
              <button
                type="button"
                className="account-btn account-btn--secondary"
                onClick={onSignOut}
              >
                Sign out
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
