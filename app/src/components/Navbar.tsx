"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./Navbar.css";

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
  /** Mobile menu visible when the inline `.nav__links` are
   *  hidden by the <980px breakpoint. The hamburger toggle next
   *  to the icons opens an overlay with the same routes. */
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        <span className="nav__logo-text">
          Atelier <em>Rusalka</em>
        </span>
      </button>

      <ul className="nav__links">
        <li>
          <Link href="/#products">Skincare</Link>
        </li>
        <li>
          <Link href="/accessories">Accessories</Link>
        </li>
        <li>
          <Link href="/ingredients">Our ingredients</Link>
        </li>
        <li>
          <Link href="/#about">About us</Link>
        </li>
        <li>
          <Link href="/#reviews">Reviews</Link>
        </li>
        <li>
          <Link href="/gift">Gift Rusalka</Link>
        </li>
        <li>
          <Link href="/#subscription">Subscribe</Link>
        </li>
      </ul>

      <div className="nav__right">
        <button
          type="button"
          className={`nav__menu-toggle${menuOpen ? " nav__menu-toggle--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
              <path
                d="M0 1h20M0 7h20M0 13h20"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

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

      {menuOpen && (
        <div
          id="nav-mobile-menu"
          className="nav__menu"
          role="dialog"
          aria-label="Site navigation"
        >
          <ul className="nav__menu-list">
            <li>
              <Link href="/#products" onClick={() => setMenuOpen(false)}>
                Skincare
              </Link>
            </li>
            <li>
              <Link href="/accessories" onClick={() => setMenuOpen(false)}>
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/ingredients" onClick={() => setMenuOpen(false)}>
                Our ingredients
              </Link>
            </li>
            <li>
              <Link href="/#about" onClick={() => setMenuOpen(false)}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/#reviews" onClick={() => setMenuOpen(false)}>
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/gift" onClick={() => setMenuOpen(false)}>
                Gift Rusalka
              </Link>
            </li>
            <li>
              <Link href="/#subscription" onClick={() => setMenuOpen(false)}>
                Subscribe
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
