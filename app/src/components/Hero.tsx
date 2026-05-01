"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

/**
 * Atelier 2026 hero — two-column composition. Left: editorial
 * dedication ("A skincare ritual, composed from you.") with an
 * inline morphing amber orb between two italic words. Right: a
 * glass capsule with a botanical sprig (inline SVG) and floating
 * info chips.
 */
export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      eyebrowRef.current,
      titleRef.current,
      subRef.current,
      ctaRef.current,
      statsRef.current,
      visualRef.current,
    ];
    gsap.set(elements, { y: 28, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .to(
        titleRef.current,
        { y: 0, opacity: 1, duration: 1.05, ease: "power3.out" },
        "-=0.45",
      )
      .to(
        visualRef.current,
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        "-=0.95",
      )
      .to(
        subRef.current,
        { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" },
        "-=0.65",
      )
      .to(
        ctaRef.current,
        { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
        "-=0.4",
      )
      .to(
        statsRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.35",
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__copy">
        <span className="hero__eyebrow" ref={eyebrowRef}>
          <span className="hero__eyebrow-dot" aria-hidden />
          Personalised · Atelier Made · Sofia MMXXVI
        </span>

        <h1 className="hero__title" ref={titleRef}>
          <span className="hero__title-row">A skincare</span>
          <span className="hero__title-row">
            <span className="hero__title-flow">
              <span className="hero__title-orb" aria-hidden />
              <span>ritual,</span>
            </span>
          </span>
          <span className="hero__title-row">
            <em>composed from you.</em>
          </span>
        </h1>

        <p className="hero__sub" ref={subRef}>
          Custom-blended from 185 botanical actives, formulated through a
          quiet, considered consultation. No two bottles alike.
        </p>

        <div className="hero__cta-row" ref={ctaRef}>
          <button
            type="button"
            className="hero__cta"
            onClick={() => router.push("/quiz")}
          >
            Begin the consultation
            <span className="hero__cta-arrow" aria-hidden>
              →
            </span>
          </button>
          <span className="hero__hint">five minutes · no account needed</span>
        </div>

        <div className="hero__stats" ref={statsRef}>
          <div>
            <span className="hero__stat-k">Actives</span>
            <span className="hero__stat-v">185</span>
          </div>
          <div>
            <span className="hero__stat-k">Formula</span>
            <span className="hero__stat-v">Per-skin</span>
          </div>
          <div>
            <span className="hero__stat-k">Made in</span>
            <span className="hero__stat-v">Bulgaria</span>
          </div>
        </div>
      </div>

      <div className="hero__visual" aria-hidden ref={visualRef}>
        <div className="hero__capsule">
          <svg
            className="hero__sprig"
            viewBox="0 0 240 360"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ar-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.08 130)" />
                <stop offset="100%" stopColor="oklch(0.42 0.08 130)" />
              </linearGradient>
              <radialGradient id="ar-berry" cx="0.35" cy="0.35">
                <stop offset="0%" stopColor="oklch(0.85 0.12 30)" />
                <stop offset="60%" stopColor="oklch(0.62 0.14 25)" />
                <stop offset="100%" stopColor="oklch(0.40 0.12 25)" />
              </radialGradient>
            </defs>
            <path
              d="M120 350 Q118 260 122 180 Q124 110 120 30"
              stroke="oklch(0.42 0.05 100)"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <g>
              <path
                d="M122 280 Q70 270 50 240 Q80 250 120 270 Z"
                fill="url(#ar-leaf)"
                opacity="0.9"
              />
              <path
                d="M120 280 Q90 260 80 230"
                stroke="oklch(0.32 0.04 130)"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <g>
              <path
                d="M122 240 Q175 230 195 200 Q165 210 122 230 Z"
                fill="url(#ar-leaf)"
                opacity="0.92"
              />
              <path
                d="M122 240 Q155 220 170 195"
                stroke="oklch(0.32 0.04 130)"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <g>
              <path
                d="M122 200 Q72 195 48 165 Q82 175 122 188 Z"
                fill="url(#ar-leaf)"
                opacity="0.88"
              />
              <path
                d="M122 200 Q92 180 78 158"
                stroke="oklch(0.32 0.04 130)"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <g>
              <path
                d="M122 160 Q170 150 188 122 Q160 132 122 148 Z"
                fill="url(#ar-leaf)"
                opacity="0.92"
              />
              <path
                d="M122 160 Q150 140 168 118"
                stroke="oklch(0.32 0.04 130)"
                strokeWidth="1"
                fill="none"
              />
            </g>
            <circle cx="98" cy="62" r="11" fill="url(#ar-berry)" />
            <circle cx="138" cy="48" r="14" fill="url(#ar-berry)" />
            <circle cx="116" cy="82" r="9" fill="url(#ar-berry)" />
            <circle cx="148" cy="78" r="7" fill="url(#ar-berry)" opacity="0.85" />
            <circle cx="95" cy="58" r="2.5" fill="oklch(0.95 0.02 30)" opacity="0.7" />
            <circle cx="135" cy="44" r="3" fill="oklch(0.95 0.02 30)" opacity="0.7" />
          </svg>

          <div className="hero__capsule-cap" aria-hidden />
          <div className="hero__capsule-glass" aria-hidden />
          <div className="hero__capsule-label">
            <span>Forbidden Spring</span>
            <span>Specimen №01 · Sofia</span>
          </div>
        </div>

        <div className="hero__chip hero__chip--01">
          <div className="hero__chip-icon hero__chip-icon--rose">BG</div>
          <div>
            <span className="hero__chip-k">Crafted in</span>
            <span className="hero__chip-v">Sofia, Bulgaria</span>
          </div>
        </div>
        <div className="hero__chip hero__chip--02">
          <div className="hero__chip-icon">47</div>
          <div>
            <span className="hero__chip-k">Botanicals from</span>
            <span className="hero__chip-v">Eastern Europe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
