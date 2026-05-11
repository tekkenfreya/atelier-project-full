"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "./Hero.css";

/**
 * Atelier Rusalka 2026 — single-video hero (post-carousel).
 * The carousel UI (prev/next/dots/keyboard arrows) was removed
 * once the brief shifted to "widen the canvas, one hero clip" —
 * the single video plays muted and looped, full-bleed inside the
 * rounded panel. The CTA stays bottom-right; the editorial mark
 * sits top-left.
 */
const HERO_VIDEO = "/videos/3.mp4";

export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        [".hero-v__mark", ".hero-v__cta-wrap"],
        {
          opacity: 0,
          y: 14,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.5,
          stagger: 0.1,
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, []);

  return (
    <section className="hero-v" ref={sectionRef}>
      <div className="hero-v__stage" aria-hidden>
        <video
          ref={videoRef}
          className="hero-v__video is-active"
          src={HERO_VIDEO}
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-v__vignette" aria-hidden />
      </div>

      <div className="hero-v__mark">
        <span>Atelier Rusalka</span>
      </div>

      <div className="hero-v__cta-wrap">
        <button
          type="button"
          className="hero-v__cta"
          onClick={() => router.push("/quiz")}
        >
          Begin the consultation
          <span className="hero-v__cta-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>
    </section>
  );
}
