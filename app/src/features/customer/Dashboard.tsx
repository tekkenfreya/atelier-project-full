"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { useAccountData } from "./useAccountData";
import { isAdmin } from "@/features/admin/guards";
import type { RitualCategory } from "./types";
import type { ResolvedExtract } from "@/features/atlas/extracts";
import ExtractModal from "@/components/map/ExtractModal";

import Overview from "./sections/Overview";
import Ritual from "./sections/Ritual";
import Orders from "./sections/Orders";
import Atlas from "./sections/Atlas";
import Extracts from "./sections/Extracts";
import Profile from "./sections/Profile";

import "./Dashboard.css";

type SectionId = "overview" | "ritual" | "orders" | "atlas" | "extracts" | "profile";

interface DashboardProps {
  user: User;
  customerName: string | null;
  onSignOut: () => void;
}

const NAV: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "ritual", label: "Ritual" },
  { id: "orders", label: "Orders" },
  { id: "atlas", label: "Atlas" },
  { id: "extracts", label: "Extracts" },
  { id: "profile", label: "Profile" },
];

export default function Dashboard({ user, customerName, onSignOut }: DashboardProps) {
  const { quizResults, orders, extracts, extractsByCategory, loading } = useAccountData(user.id);
  const [active, setActive] = useState<SectionId>("overview");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedExtract, setSelectedExtract] = useState<ResolvedExtract | null>(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isAdmin(user.id).then((result) => {
      if (!cancelled) setAdmin(result);
    });
    return () => {
      cancelled = true;
    };
  }, [user.id]);

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

  const activeCountries = useMemo(() => {
    const set = new Set<string>();
    extracts.forEach((e) => e.allCountries.forEach((c) => set.add(c)));
    return set;
  }, [extracts]);

  const countryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    extracts.forEach((e) => {
      e.allCountries.forEach((c) => {
        if (!colors[c]) colors[c] = e.origin.color;
      });
    });
    return colors;
  }, [extracts]);

  const selectedLandscape = useMemo(() => {
    if (!selectedExtract) return null;
    const first = selectedExtract.allCountries[0];
    return (
      (first && selectedExtract.landscapesByCountry[first]) ||
      selectedExtract.legacyLandscapeUrl ||
      null
    );
  }, [selectedExtract]);

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
          {admin && (
            <a href="/admin/orders" className="account-linkbtn">
              Admin dashboard
            </a>
          )}
          <button type="button" className="account-linkbtn" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="account-main">
        {active === "overview" && (
          <Overview
            latestQuiz={latestQuiz}
            quizCount={quizResults.length}
            ordersCount={orders.length}
          />
        )}
        {active === "ritual" && (
          <Ritual
            latestQuiz={latestQuiz}
            ritualRows={ritualRows}
            extractsByCategory={extractsByCategory}
          />
        )}
        {active === "orders" && <Orders orders={orders} />}
        {active === "atlas" && (
          <Atlas
            extracts={extracts}
            activeCountries={activeCountries}
            countryColors={countryColors}
            hoveredCountry={hoveredCountry}
            onHoverCountry={setHoveredCountry}
            onSelectExtract={setSelectedExtract}
          />
        )}
        {active === "extracts" && <Extracts extracts={extracts} />}
        {active === "profile" && (
          <Profile user={user} customerName={customerName} onSignOut={onSignOut} />
        )}
      </main>

      <ExtractModal
        extract={selectedExtract?.origin ?? null}
        ingredientName={selectedExtract?.ingredientName ?? null}
        landscapeUrl={selectedLandscape}
        availableCountries={selectedExtract?.allCountries ?? []}
        activeCountry={selectedExtract?.allCountries[0] ?? null}
        onClose={() => {
          setSelectedExtract(null);
          setHoveredCountry(null);
        }}
      />
    </div>
  );
}
