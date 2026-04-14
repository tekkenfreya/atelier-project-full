"use client";

import { useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "./sections/Hero/Hero";
import RitualDetail from "./sections/RitualDetail/RitualDetail";
import Botanicals from "./sections/Botanicals/Botanicals";
import Profile from "./sections/Profile/Profile";

import { useAccountData } from "./hooks/useAccountData";
import type { RitualItem } from "./lib/types";

gsap.registerPlugin(ScrollTrigger);

interface DashboardProps {
  user: User;
  customerName: string | null;
  onSignOut: () => void;
}

export default function Dashboard({ user, customerName, onSignOut }: DashboardProps) {
  const { quizResults, orders, extracts, extractsByCategory, loading } = useAccountData(user.id);

  const latestQuiz = quizResults.length > 0 ? quizResults[0] : null;
  const displayName = customerName ?? user.email?.split("@")[0] ?? "";
  const ready = !loading && !!latestQuiz;

  const ritualItems = useMemo<RitualItem[]>(() => {
    if (!latestQuiz) return [];
    return (
      [
        { variant: "cleanser", category: "Cleanser", shown: !!latestQuiz.recommended_cleanser, tagline: "To begin. A quiet first step." },
        { variant: "serum", category: "Serum", shown: !!latestQuiz.recommended_serum, tagline: "The heart of your ritual." },
        { variant: "moisturizer", category: "Moisturizer", shown: !!latestQuiz.recommended_moisturizer, tagline: "To close. A breath of care." },
      ] as const
    )
      .filter((r) => r.shown)
      .map(({ variant, category, tagline }) => ({ variant, category, tagline }));
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
      <div className="profile-page">
        <section className="profile-hero profile-hero--empty">
          <div className="profile-content">
            <h1 className="profile-hero__title">
              Welcome{customerName ? `, ${customerName}` : ""}
            </h1>
            <p className="profile-hero__subtitle">
              Take your first consultation to receive personalized skincare recommendations tailored to your skin.
            </p>
            <button type="button" className="profile-btn profile-btn--primary profile-btn--large" onClick={() => (window.location.href = "/quiz")}>
              Take Your First Consultation
            </button>
          </div>
        </section>
        <footer className="profile-signout">
          <button type="button" className="profile-signout__link" onClick={onSignOut}>
            Sign out
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <Hero displayName={displayName} customerName={customerName} ritualItems={ritualItems} ready={ready} />

      <RitualDetail
        customerName={customerName}
        ritualItems={ritualItems}
        extractsByCategory={extractsByCategory}
        ready={ready}
      />

      <Botanicals extracts={extracts} ready={ready} />

      <Profile
        user={user}
        latestQuiz={latestQuiz}
        quizCount={quizResults.length}
        orders={orders}
        onSignOut={onSignOut}
        ready={ready}
      />
    </div>
  );
}
