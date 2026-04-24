"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { useAccountData } from "./useAccountData";
import type { RitualCategory } from "./types";
import type { ResolvedExtract } from "@/features/atlas/extracts";
import ExtractModal from "@/components/map/ExtractModal";

import Overview from "./sections/Overview";
import OverviewRail from "./sections/OverviewRail";
import Ritual from "./sections/Ritual";
import Orders from "./sections/Orders";
import Atlas from "./sections/Atlas";
import Extracts from "./sections/Extracts";
import Profile from "./sections/Profile";

import "./Dashboard.css";
import "./Dashboard.editorial.css";

type SectionId = "overview" | "ritual" | "orders" | "atlas" | "extracts" | "profile";

interface DashboardProps {
  user: User;
  customerName: string | null;
  onSignOut: () => void;
}

const NAV: { id: SectionId; label: string; num: string }[] = [
  { id: "overview", label: "Overview", num: "01" },
  { id: "ritual", label: "Ritual", num: "02" },
  { id: "orders", label: "Orders", num: "03" },
  { id: "atlas", label: "Atlas", num: "04" },
  { id: "extracts", label: "Extracts", num: "05" },
  { id: "profile", label: "Profile", num: "06" },
];

export default function Dashboard({ user, customerName, onSignOut }: DashboardProps) {
  const { quizResults, orders, extracts, extractsByCategory, loading } = useAccountData(user.id);
  const [active, setActive] = useState<SectionId>("overview");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedExtract, setSelectedExtract] = useState<ResolvedExtract | null>(null);

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

  const memberSince = quizResults.length > 0
    ? new Date(quizResults[quizResults.length - 1].created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="acc-shell">
      <aside className="acc-aside">
        <div className="acc-aside__inner">
          <header className="acc-aside__brand">
            <span className="acc-aside__eyebrow">Atelier · Member</span>
            <h2 className="acc-aside__name">{displayName}</h2>
            {memberSince && (
              <span className="acc-aside__since">since {memberSince}</span>
            )}
          </header>

          <div className="acc-aside__rule" />

          <nav className="acc-aside__nav" aria-label="Account sections">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`acc-navitem ${active === item.id ? "is-active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <span className="acc-navitem__num">{item.num}</span>
                <span className="acc-navitem__label">{item.label}</span>
                <span className="acc-navitem__rail" aria-hidden />
              </button>
            ))}
          </nav>

          <footer className="acc-aside__foot">
            <button type="button" className="acc-signout" onClick={onSignOut}>
              Sign out →
            </button>
          </footer>
        </div>
      </aside>

      <div className={`acc-stage ${active === "overview" ? "has-rail" : ""}`}>
      <main className="acc-main">
        {active === "overview" && (
          <Overview
            latestQuiz={latestQuiz}
            quizCount={quizResults.length}
            ordersCount={orders.length}
            displayName={displayName}
            orders={orders}
            extracts={extracts}
            onSwitchSection={(s) => setActive(s)}
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
      {active === "overview" && (
        <OverviewRail latestQuiz={latestQuiz} orders={orders} />
      )}
      </div>

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
