"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRESS = ["Vogue", "Allure", "Harper's Bazaar", "Byrdie", "Glamour"];

const QUOTES = [
  {
    q: "The closest thing to a dermatologist in a bottle. Every ingredient chosen for your skin alone.",
    who: "Allure",
    role: "Best of Beauty · 2026",
  },
  {
    q: "Refreshingly quiet skincare. No grand promises, just formulas that feel earned.",
    who: "Vogue",
    role: "Monthly edit · Sept 2026",
  },
  {
    q: "A ritual rather than a routine. The consultation reads like a letter.",
    who: "Harper's Bazaar",
    role: "Editors' picks",
  },
];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(stripRef.current, { y: 22, opacity: 0 });
      gsap.set(cardRefs.current, { y: 32, opacity: 0 });

      gsap.to(stripRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="proof" ref={sectionRef}>
      <div className="proof__strip" ref={stripRef}>
        <span className="proof__label">Featured in</span>
        <div className="proof__logos">
          {PRESS.map((name) => (
            <span key={name} className="proof__logo">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="proof__quotes">
        {QUOTES.map((quote, i) => (
          <article
            key={quote.who}
            className="proof__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <span className="proof__quote-mark" aria-hidden>
              &ldquo;
            </span>
            <p className="proof__quote">{quote.q}</p>
            <div className="proof__attr">
              <span className="proof__attr-name">{quote.who}</span>
              <span className="proof__attr-role">{quote.role}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
