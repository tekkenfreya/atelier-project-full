"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "./Products.css";

export default function Products() {
  const router = useRouter();
  const [name, setName] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  const trimmedName = name.trim();
  const labelLine = trimmedName
    ? `FOR ${trimmedName.toUpperCase()}`
    : "FOR ———";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".featured__visual", {
        opacity: 0,
        y: 32,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".featured__fade", {
        opacity: 0,
        y: 16,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.3,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = trimmedName ? `?name=${encodeURIComponent(trimmedName)}` : "";
    router.push(`/quiz${query}`);
  }

  return (
    <section className="featured" id="products" ref={sectionRef}>
      <div className="featured__panel">
        <div className="featured__inner">
          <div
            className="featured__visual"
            onClick={() => router.push("/quiz")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push("/quiz");
            }}
            aria-label="Begin the consultation"
          >
            <svg
              className="featured__sprig"
              viewBox="0 0 320 720"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <g
                stroke="currentColor"
                strokeWidth="0.7"
                fill="none"
                strokeLinecap="round"
              >
                <path d="M40 700 Q56 480 72 280 Q86 130 60 40" />
                <path d="M74 380 Q34 364 16 332" />
                <path d="M62 560 Q22 548 6 522" />
                <path
                  d="M62 250 Q108 232 158 196 Q138 224 78 256"
                  fill="currentColor"
                  fillOpacity="0.10"
                  stroke="none"
                />
                <path
                  d="M82 470 Q138 456 178 422 Q156 444 90 478"
                  fill="currentColor"
                  fillOpacity="0.10"
                  stroke="none"
                />
                <path d="M68 178 Q92 160 112 130" />
                <path d="M70 132 Q104 116 134 90" />
                <circle
                  cx="68"
                  cy="60"
                  r="3.6"
                  fill="currentColor"
                  fillOpacity="0.22"
                  stroke="none"
                />
                <circle
                  cx="82"
                  cy="100"
                  r="2.6"
                  fill="currentColor"
                  fillOpacity="0.18"
                  stroke="none"
                />
              </g>
            </svg>

            <div className="featured__bottle">
              <span className="featured__bottle-cap" aria-hidden />
              <span className="featured__bottle-glass" aria-hidden />
              <span className="featured__bottle-label">
                <span>Atelier</span>
                <span>{labelLine}</span>
              </span>
            </div>
            <div className="featured__reflection" aria-hidden />
          </div>

          <div className="featured__copy">
            <span className="featured__eyebrow featured__fade">
              Your Custom Formula Awaits
            </span>
            <h2 className="featured__name featured__fade">
              Let&apos;s begin with your name.
            </h2>
            <p className="featured__brand-line featured__fade">
              Each bottle is composed from 185 botanical actives — no two alike.
            </p>

            <form
              className="featured__name-form featured__fade"
              onSubmit={handleSubmit}
            >
              <label className="featured__name-label" htmlFor="featured-name">
                Begin
              </label>
              <div className="featured__name-row">
                <input
                  id="featured-name"
                  type="text"
                  className="featured__name-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  maxLength={48}
                />
                <button
                  type="submit"
                  className="featured__name-submit"
                  aria-label="Begin the consultation"
                >
                  →
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
