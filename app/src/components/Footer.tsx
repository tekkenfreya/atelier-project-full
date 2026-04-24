"use client";

import Image from "next/image";
import { useState } from "react";
import "./Footer.css";

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
    <footer className="lux-foot">
      <div className="lux-foot__inner">
        <div className="lux-foot__top">
          <div className="lux-foot__brand">
            <Image
              src="/logo.png"
              alt="Atelier Rusalka"
              width={160}
              height={36}
              className="lux-foot__logo"
            />
            <p className="lux-foot__tagline">
              Personalised skincare, composed from your skin alone. Made in
              Bulgaria, shipped worldwide.
            </p>
          </div>

          <form className="lux-foot__newsletter" onSubmit={handleSubscribe}>
            <label className="lux-foot__news-label" htmlFor="foot-email">
              LETTERS · SEASONAL
            </label>
            <div className="lux-foot__news-row">
              <input
                id="foot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={submitted ? "thank you ·" : "your email"}
                className="lux-foot__news-input"
                disabled={submitted}
              />
              <button
                type="submit"
                className="lux-foot__news-btn"
                disabled={submitted}
              >
                {submitted ? "↩" : "→"}
              </button>
            </div>
            <p className="lux-foot__news-note">
              Quarterly essays on ingredients and ritual. No marketing.
            </p>
          </form>
        </div>

        <div className="lux-foot__columns">
          <div className="lux-foot__col">
            <h4 className="lux-foot__col-h">The Formula</h4>
            <ul>
              <li><a href="#products">Cleanser</a></li>
              <li><a href="#products">Serum</a></li>
              <li><a href="#products">Moisturiser</a></li>
              <li><a href="#ritual">The Ritual</a></li>
            </ul>
          </div>
          <div className="lux-foot__col">
            <h4 className="lux-foot__col-h">Atelier</h4>
            <ul>
              <li><a href="/ingredients">Ingredients</a></li>
              <li><a href="/account">Your account</a></li>
              <li><a href="#">Our story</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="lux-foot__col">
            <h4 className="lux-foot__col-h">Care</h4>
            <ul>
              <li><a href="#">Shipping &amp; returns</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="mailto:hello@atelier-rusalka.com">Contact</a></li>
              <li><a href="#">Wholesale</a></li>
            </ul>
          </div>
        </div>

        <div className="lux-foot__bottom">
          <span className="lux-foot__copy">
            &copy; {new Date().getFullYear()} Atelier Rusalka · Sofia, Bulgaria
          </span>
          <span className="lux-foot__small">
            <a href="#">Privacy</a>
            <span className="lux-foot__dot">·</span>
            <a href="#">Terms</a>
            <span className="lux-foot__dot">·</span>
            <a href="#">Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
