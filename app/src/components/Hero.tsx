"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "./Hero.css";

const VIDEOS: readonly string[] = [
  "/videos/3.mp4",
  "/videos/4.mp4",
  "/videos/drop.mp4",
  "/videos/macro%20drop.mp4",
  "/videos/skin%20repair.mp4",
  "/videos/Ingredients.mp4",
];

export default function Hero() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        [
          ".hero-v__mark",
          ".hero-v__nav--prev",
          ".hero-v__nav--next",
          ".hero-v__cta-wrap",
          ".hero-v__dots",
        ],
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
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setActive((v) => (v + 1) % VIDEOS.length);
      } else if (e.key === "ArrowLeft") {
        setActive((v) => (v - 1 + VIDEOS.length) % VIDEOS.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [active]);

  const next = () => setActive((v) => (v + 1) % VIDEOS.length);
  const prev = () => setActive((v) => (v - 1 + VIDEOS.length) % VIDEOS.length);

  return (
    <section className="hero-v" ref={sectionRef}>
      <div className="hero-v__stage" aria-hidden>
        {VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={`hero-v__video ${i === active ? "is-active" : ""}`}
            src={src}
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
          />
        ))}
        <div className="hero-v__vignette" aria-hidden />
      </div>

      <div className="hero-v__mark">
        <span>Atelier Rusalka</span>
        <span className="hero-v__mark-sep" aria-hidden>
          ·
        </span>
        <span>Sofia MMXXVI</span>
      </div>

      <button
        type="button"
        className="hero-v__nav hero-v__nav--prev"
        onClick={prev}
        aria-label="Previous video"
      >
        <span aria-hidden>◀</span>
      </button>
      <button
        type="button"
        className="hero-v__nav hero-v__nav--next"
        onClick={next}
        aria-label="Next video"
      >
        <span aria-hidden>▶</span>
      </button>

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

      <div className="hero-v__dots" role="tablist" aria-label="Video selector">
        {VIDEOS.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show video ${i + 1}`}
            className={`hero-v__dot ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
