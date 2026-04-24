"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Subscription.css";

gsap.registerPlugin(ScrollTrigger);

type Plan = "bimonthly" | "annual";

const PLANS: Record<Plan, {
  eyebrow: string;
  title: string;
  cadence: string;
  price: string;
  saved: string;
  notes: string[];
  accent: boolean;
}> = {
  bimonthly: {
    eyebrow: "EVERY TWO MONTHS",
    title: "The Ritual",
    cadence: "3 bottles · delivered every ~60 days",
    price: "€92",
    saved: "20% off retail",
    notes: [
      "Pause or cancel anytime",
      "Shipping included",
      "Reformulate on any quiz update",
    ],
    accent: true,
  },
  annual: {
    eyebrow: "ANNUAL — SIX SHIPMENTS",
    title: "The Practice",
    cadence: "6 rituals · billed yearly",
    price: "€552",
    saved: "20% off + priority formulation",
    notes: [
      "Locked-in pricing for the year",
      "Priority formulation lead",
      "Free international shipping",
    ],
    accent: false,
  },
};

export default function Subscription() {
  const router = useRouter();
  const [selected, setSelected] = useState<Plan>("bimonthly");
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [eyebrowRef.current, titleRef.current, descRef.current, cardsRef.current, footerRef.current],
        { y: 26, opacity: 0 },
      );
      gsap.to(
        [eyebrowRef.current, titleRef.current, descRef.current, cardsRef.current, footerRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="lux-sub" id="ritual" ref={sectionRef}>
      <div className="lux-sub__inner">
        <header className="lux-sub__header">
          <span className="lux-sub__eyebrow" ref={eyebrowRef}>
            SUBSCRIBE · SAVE 20 %
          </span>
          <h2 className="lux-sub__title" ref={titleRef}>
            Your ritual, <span className="lux-sub__title-italic">kept living.</span>
          </h2>
          <p className="lux-sub__desc" ref={descRef}>
            Skincare is a practice, not a purchase. Keep the ritual on rhythm with a
            subscription — reformulated whenever your quiz changes, paused or
            cancelled whenever it suits.
          </p>
        </header>

        <div className="lux-sub__cards" ref={cardsRef}>
          {(Object.entries(PLANS) as [Plan, typeof PLANS.bimonthly][]).map(
            ([key, plan]) => (
              <article
                key={key}
                className={`lux-sub__card ${selected === key ? "is-selected" : ""} ${
                  plan.accent ? "lux-sub__card--accent" : ""
                }`}
                onClick={() => setSelected(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(key);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selected === key}
              >
                <header className="lux-sub__card-head">
                  <span className="lux-sub__card-eyebrow">{plan.eyebrow}</span>
                  {plan.accent && (
                    <span className="lux-sub__card-tag">most chosen</span>
                  )}
                </header>
                <h3 className="lux-sub__card-title">{plan.title}</h3>
                <p className="lux-sub__card-cadence">{plan.cadence}</p>

                <div className="lux-sub__card-price">
                  <span className="lux-sub__card-price-v">{plan.price}</span>
                  <span className="lux-sub__card-price-k">
                    /{key === "bimonthly" ? "shipment" : "year"}
                  </span>
                </div>
                <span className="lux-sub__card-saved">{plan.saved}</span>

                <ul className="lux-sub__card-notes">
                  {plan.notes.map((n) => (
                    <li key={n}>
                      <span className="lux-sub__card-bullet" aria-hidden>
                        —
                      </span>
                      {n}
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>

        <div className="lux-sub__footer" ref={footerRef}>
          <button
            type="button"
            className="lux-sub__cta"
            onClick={() => router.push("/quiz")}
          >
            <span className="lux-sub__cta-label">
              Begin with {PLANS[selected].title.toLowerCase()}
            </span>
            <span className="lux-sub__cta-arrow" aria-hidden>
              →
            </span>
          </button>
          <span className="lux-sub__note">
            The consultation first · no payment required to see your formula
          </span>
        </div>
      </div>
    </section>
  );
}
