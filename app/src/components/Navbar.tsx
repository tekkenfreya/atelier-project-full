"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Atelier Rusalka 2026 nav — sticky glass pill, animated morph mark,
 * route-aware active state, cart badge. Renders inside the .atelier
 * shell on the homepage; legacy inner pages still get the same nav
 * but it floats over their existing layouts (glass-morphic background
 * works on any surface).
 */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    function syncCartCount() {
      try {
        const stored = sessionStorage.getItem("cartItems");
        if (stored) {
          const items = JSON.parse(stored) as unknown[];
          setCartCount(Array.isArray(items) ? items.length : 0);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    }
    syncCartCount();
    const onStorage = () => syncCartCount();
    window.addEventListener("storage", onStorage);
    // Re-sync on route change so the badge reflects current state.
    const onFocus = () => syncCartCount();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAccountActive =
    pathname === "/account" || pathname.startsWith("/account/");
  const isCartActive =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/confirmation";

  return (
    <nav className="nav">
      <button
        type="button"
        className="nav__logo"
        onClick={() => router.push("/")}
        aria-label="Atelier Rusalka home"
      >
        <span className="nav__logo-mark" aria-hidden />
        <span>
          Atelier <em>Rusalka</em>
        </span>
      </button>

      <ul className="nav__links">
        <li>
          <a href="/#products">Collection</a>
        </li>
        <li>
          <a href="/#ritual">The Ritual</a>
        </li>
        <li>
          <a href="/ingredients">Ingredients</a>
        </li>
        <li>
          <a href="/#about">Atelier</a>
        </li>
      </ul>

      <div className="nav__right">
        <button
          type="button"
          className={`nav__icon ${isAccountActive ? "nav__icon--active" : ""}`}
          onClick={() => router.push("/account")}
          aria-label={isAuthed ? "Your account" : "Sign in"}
          title={isAuthed ? "Your account" : "Sign in"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle
              cx="9"
              cy="6"
              r="3.2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M2.5 16C2.5 13.2 5.4 11.4 9 11.4C12.6 11.4 15.5 13.2 15.5 16"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={`nav__icon ${isCartActive ? "nav__icon--active" : ""}`}
          onClick={() => router.push("/cart")}
          aria-label={`Cart${cartCount > 0 ? ` — ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
          title="Cart"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 3H4.5L5.5 12.5H13.5L15 5.5H6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="15" r="1" fill="currentColor" />
            <circle cx="12" cy="15" r="1" fill="currentColor" />
          </svg>
          {cartCount > 0 && (
            <span className="nav__icon-badge">{cartCount}</span>
          )}
        </button>

        <button
          type="button"
          className="nav__cta"
          onClick={() => router.push("/quiz")}
        >
          <span className="nav__cta-dot" aria-hidden />
          Take the Quiz
        </button>
      </div>
    </nav>
  );
}
