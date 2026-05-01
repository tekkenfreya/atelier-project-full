"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <footer className="foot">
      <div className="foot__top">
        <div>
          <h3 className="foot__brand-name">
            Atelier <em>Rusalka</em>
          </h3>
          <p className="foot__tagline">
            Personalised skincare composed from your skin alone. Made in
            Bulgaria, shipped worldwide.
          </p>
        </div>

        <form className="foot__news" onSubmit={handleSubscribe}>
          <label className="foot__news-label" htmlFor="foot-email">
            LETTERS · SEASONAL
          </label>
          <div className="foot__news-row">
            <input
              id="foot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={submitted ? "thank you" : "your email"}
              className="foot__news-input"
              disabled={submitted}
            />
            <button
              type="submit"
              className="foot__news-btn"
              disabled={submitted}
              aria-label="Subscribe"
            >
              {submitted ? "↩" : "→"}
            </button>
          </div>
          <p className="foot__news-note">
            Quarterly essays on ingredients and ritual. No marketing.
          </p>
        </form>
      </div>

      <div className="foot__cols">
        <div className="foot__col">
          <h4>The Formula</h4>
          <ul>
            <li><a href="/#products">Cleanser</a></li>
            <li><a href="/#products">Serum</a></li>
            <li><a href="/#products">Moisturiser</a></li>
            <li><a href="/#ritual">The Ritual</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h4>Atelier</h4>
          <ul>
            <li><a href="/ingredients">Ingredients</a></li>
            <li><a href="/account">Your account</a></li>
            <li><a href="/#about">Our story</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h4>Care</h4>
          <ul>
            <li><a href="#">Shipping &amp; returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="mailto:hello@atelier-rusalka.com">Contact</a></li>
            <li><a href="#">Wholesale</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">CPNP</a></li>
          </ul>
        </div>
      </div>

      <div className="foot__bottom">
        <span>
          &copy; {new Date().getFullYear()} Atelier Rusalka · Sofia, Bulgaria
        </span>
        <span>
          <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
