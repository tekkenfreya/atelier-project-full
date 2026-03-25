"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Image
          src="/logo.png"
          alt="Atelier Rusalka"
          width={280}
          height={65}
          className="navbar-logo"
          priority
          style={scrolled ? {} : { filter: "brightness(0) invert(1)" }}
        />

        <ul className="nav-links">
          <li><a href="#products">Products</a></li>
          <li><a href="#ritual">The Ritual</a></li>
          <li><a href="#about">About</a></li>
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
