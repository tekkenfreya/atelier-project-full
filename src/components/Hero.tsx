"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const VIDEOS = [
  "/videos/drop.mp4",
  "/videos/macro drop.mp4",
  "/videos/4.mp4",
  "/videos/Ingredients.mp4",
  "/videos/3.mp4",
  "/videos/skin repair.mp4",
];

const CROSSFADE_DURATION = 5000;

export default function Hero() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
    }, CROSSFADE_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    })
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

    gsap.set([taglineRef.current, titleRef.current, subtitleRef.current, ctaRef.current], {
      y: 30,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="hero-video-container">
          {VIDEOS.map((src, i) => (
            <video
              key={src}
              className={`hero-video ${i === activeIndex ? "active" : ""}`}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
            />
          ))}
        </div>

        <div className="hero-overlay" />
        <div className="hero-grain" />

        <div className="hero-content">
          <p className="hero-tagline" ref={taglineRef}>
            Personalised Skincare
          </p>
          <h1 className="hero-title" ref={titleRef}>
            Your Skin,
            <br />
            Your Formula
          </h1>
          <p className="hero-subtitle" ref={subtitleRef}>
            Custom-blended from 185+ active ingredients, formulated through an
            in-depth consultation. Uniquely yours.
          </p>
          <button className="hero-cta" ref={ctaRef} onClick={() => router.push("/quiz")}>
            Begin Your Consultation
          </button>
        </div>

      </section>

    </>
  );
}
