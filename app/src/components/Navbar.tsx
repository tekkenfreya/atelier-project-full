"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import "./Navbar.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHomePage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    function syncCartCount() {
      try {
        const stored = sessionStorage.getItem("cartItems");
        if (stored) {
          const items = JSON.parse(stored) as unknown[];
          setCartCount(items.length);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    }

    syncCartCount();

    const handleStorage = () => syncCartCount();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="navbar-logo-link">
          <Image
            src="/logo.png"
            alt="Atelier Rusalka"
            width={280}
            height={65}
            className="navbar-logo"
            priority
          />
        </a>

        <ul className="nav-links">
          <li><a href="#products">Products</a></li>
          <li><a href="#ritual">The Ritual</a></li>
          <li><a href="#about">About</a></li>
          <li>
            <button
              className={`nav-icon-btn ${isAuthed ? "nav-icon-btn--authed" : ""}`}
              onClick={() => router.push("/account")}
              aria-label={isAuthed ? "Your account" : "Sign in"}
              title={isAuthed ? "Your account" : "Sign in"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M2 16.5C2 13.5 5 11.5 9 11.5C13 11.5 16 13.5 16 16.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              {isAuthed && <span className="nav-auth-dot" aria-hidden />}
            </button>
          </li>
          <li>
            <button
              className="nav-icon-btn nav-cart-btn"
              onClick={() => router.push("/cart")}
              aria-label="Cart"
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
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </button>
          </li>
          <li>
            <button className="nav-cta" onClick={() => router.push("/quiz")}>Take the Quiz</button>
          </li>
        </ul>

        <button
          className="menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        <a href="#products" onClick={() => setMobileOpen(false)}>Products</a>
        <a href="#ritual" onClick={() => setMobileOpen(false)}>The Ritual</a>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a
          href="/account"
          onClick={() => setMobileOpen(false)}
          className="mobile-nav-link"
        >
          Account
        </a>
        <a
          href="/cart"
          onClick={() => setMobileOpen(false)}
          className="mobile-nav-link"
        >
          Cart{cartCount > 0 ? ` (${cartCount})` : ""}
        </a>
        <a
          href="/quiz"
          onClick={() => setMobileOpen(false)}
          className="mobile-nav-quiz"
        >
          Take the Quiz
        </a>
      </div>
    </>
  );
}
