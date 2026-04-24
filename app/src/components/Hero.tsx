"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "./Hero.css";

const VIDEOS = [
  "/videos/drop.mp4",
  "/videos/macro drop.mp4",
  "/videos/4.mp4",
  "/videos/Ingredients.mp4",
  "/videos/3.mp4",
  "/videos/skin repair.mp4",
];

const CROSSFADE_DURATION = 5500;

export default function Hero() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
    }, CROSSFADE_DURATION);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = [
      eyebrowRef.current,
      titleRef.current,
      subtitleRef.current,
      ctaRef.current,
      specRef.current,
    ];
    gsap.set(elements, { y: 28, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.4 });
    tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .to(
        titleRef.current,
        { y: 0, opacity: 1, duration: 1.05, ease: "power3.out" },
        "-=0.45",
      )
      .to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" },
        "-=0.55",
      )
      .to(
        ctaRef.current,
        { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
        "-=0.4",
      )
      .to(
        specRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.35",
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="lux-hero" ref={heroRef}>
      <div className="lux-hero__video-wrap">
        {VIDEOS.map((src, i) => (
          <video
            key={src}
            className={`lux-hero__video ${i === activeIndex ? "is-active" : ""}`}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
          />
        ))}
      </div>

      <div className="lux-hero__wash" />
      <div className="lux-hero__grain" />

      <header className="lux-hero__corner lux-hero__corner--top" aria-hidden>
        <span className="lux-hero__corner-mark">№ 01</span>
        <span className="lux-hero__corner-sep">·</span>
        <span className="lux-hero__corner-mark">Atelier Rusalka</span>
        <span className="lux-hero__corner-sep">·</span>
        <span className="lux-hero__corner-mark">Sofia · MMXXVI</span>
      </header>

      <div className="lux-hero__content">
        <span className="lux-hero__eyebrow" ref={eyebrowRef}>
          PERSONALISED · ATELIER MADE
        </span>

        <h1 className="lux-hero__title" ref={titleRef}>
          <span className="lux-hero__title-line">A skincare ritual,</span>
          <span className="lux-hero__title-line lux-hero__title-line--italic">
            composed from you.
          </span>
        </h1>

        <p className="lux-hero__subtitle" ref={subtitleRef}>
          Custom-blended from 185 botanical actives, formulated through a quiet,
          considered consultation. No two bottles alike.
        </p>

        <div className="lux-hero__cta" ref={ctaRef}>
          <button
            type="button"
            className="lux-hero__btn"
            onClick={() => router.push("/quiz")}
          >
            <span className="lux-hero__btn-label">Begin the consultation</span>
            <span className="lux-hero__btn-arrow" aria-hidden>
              →
            </span>
          </button>
          <span className="lux-hero__cta-hint">five minutes · no account needed</span>
        </div>
      </div>

      <footer className="lux-hero__spec" ref={specRef}>
        <div className="lux-hero__spec-item">
          <span className="lux-hero__spec-k">Formula</span>
          <span className="lux-hero__spec-v">Per-skin</span>
        </div>
        <span className="lux-hero__spec-rule" />
        <div className="lux-hero__spec-item">
          <span className="lux-hero__spec-k">Actives</span>
          <span className="lux-hero__spec-v">185</span>
        </div>
        <span className="lux-hero__spec-rule" />
        <div className="lux-hero__spec-item">
          <span className="lux-hero__spec-k">Made in</span>
          <span className="lux-hero__spec-v">Bulgaria</span>
        </div>
        <span className="lux-hero__spec-rule" />
        <div className="lux-hero__spec-item">
          <span className="lux-hero__spec-k">Est.</span>
          <span className="lux-hero__spec-v">MMXXVI</span>
        </div>
      </footer>
    </section>
  );
}
