"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SocialProof.css";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS: Array<{ quote: string; attribution: string; role: string }> = [
  {
    quote:
      "The closest thing to a dermatologist in a bottle. Every ingredient chosen for your skin alone.",
    attribution: "Allure",
    role: "Best of Beauty · 2026",
  },
  {
    quote:
      "Refreshingly quiet skincare. No grand promises, just formulas that feel earned.",
    attribution: "Vogue",
    role: "Monthly edit · Sept 2026",
  },
  {
    quote:
      "A ritual rather than a routine. The consultation reads like a letter.",
    attribution: "Harper's Bazaar",
    role: "Editors' picks",
  },
];

const PRESS = ["Vogue", "Allure", "Harper's Bazaar", "Byrdie", "Glamour"];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([labelRef.current, logosRef.current], { y: 18, opacity: 0 });
      gsap.set(testimonialRefs.current, { y: 24, opacity: 0 });

      gsap.to([labelRef.current, logosRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      testimonialRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          delay: i * 0.08,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="lux-proof" ref={sectionRef}>
      <div className="lux-proof__press" ref={labelRef}>
        <span className="lux-proof__press-label">Featured in</span>
        <div className="lux-proof__press-logos" ref={logosRef}>
          {PRESS.map((name) => (
            <span key={name} className="lux-proof__press-logo">
              {name}
            </span>
          ))}
        </div>
      </div>

      <ul className="lux-proof__grid">
        {TESTIMONIALS.map((t, i) => (
          <li key={t.attribution}>
            <article
              className="lux-proof__card"
              ref={(el) => {
                testimonialRefs.current[i] = el;
              }}
            >
              <span className="lux-proof__quote-mark" aria-hidden>
                &ldquo;
              </span>
              <p className="lux-proof__quote">{t.quote}</p>
              <div className="lux-proof__attribution">
                <span className="lux-proof__attribution-name">{t.attribution}</span>
                <span className="lux-proof__attribution-role">{t.role}</span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
