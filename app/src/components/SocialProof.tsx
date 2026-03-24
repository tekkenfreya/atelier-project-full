"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRESS = ["Vogue", "Allure", "Harper's Bazaar", "Byrdie", "Glamour"];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(logosRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.to(quoteRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.to(attrRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: attrRef.current,
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);

    gsap.set(logosRef.current, { y: 20 });
    gsap.set(quoteRef.current, { y: 20 });

    return () => ctx.revert();
  }, []);

  return (
    <section className="social-proof" ref={sectionRef}>
      <p className="social-proof-label">As Featured In</p>

      <div className="press-logos" ref={logosRef}>
        {PRESS.map((name) => (
          <span key={name} className="press-logo">
            {name}
          </span>
        ))}
      </div>

      <div className="social-divider" />

      <p className="social-quote" ref={quoteRef}>
        &ldquo;The closest thing to a dermatologist in a bottle. Every
        ingredient chosen for your skin alone.&rdquo;
      </p>
      <p className="social-quote-attr" ref={attrRef}>
        — Allure Best of Beauty 2026
      </p>
    </section>
  );
}
