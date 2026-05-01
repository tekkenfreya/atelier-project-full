"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Plan = "bimonthly" | "annual";

const PLANS: Record<
  Plan,
  {
    eyebrow: string;
    title: string;
    cadence: string;
    price: string;
    per: string;
    saved: string;
    notes: string[];
    accent: boolean;
  }
> = {
  bimonthly: {
    eyebrow: "EVERY TWO MONTHS",
    title: "The Ritual",
    cadence: "3 bottles · delivered every ~60 days",
    price: "€92",
    per: "shipment",
    saved: "20% off retail",
    accent: true,
    notes: [
      "Pause or cancel anytime",
      "Shipping included",
      "Reformulate on any quiz update",
    ],
  },
  annual: {
    eyebrow: "ANNUAL — SIX SHIPMENTS",
    title: "The Practice",
    cadence: "6 rituals · billed yearly",
    price: "€552",
    per: "year",
    saved: "20% off + priority formulation",
    accent: false,
    notes: [
      "Locked-in pricing for the year",
      "Priority formulation lead",
      "Free international shipping",
    ],
  },
};

export default function Subscription() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Plan>("bimonthly");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(innerRef.current, { y: 32, opacity: 0 });
      gsap.to(innerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sub" id="ritual" ref={sectionRef}>
      <div className="sub__inner" ref={innerRef}>
        <header className="sub__head">
          <span className="sub__eyebrow">SUBSCRIBE · SAVE 20 %</span>
          <h2 className="sub__title">
            Your ritual, <em>kept living.</em>
          </h2>
          <p className="sub__desc">
            Skincare is a practice, not a purchase. Keep the ritual on rhythm
            with a subscription — reformulated whenever your quiz changes,
            paused or cancelled whenever it suits.
          </p>
        </header>

        <div className="sub__cards">
          {(Object.entries(PLANS) as [Plan, typeof PLANS.bimonthly][]).map(
            ([key, plan]) => (
              <button
                key={key}
                type="button"
                className={`sub__card ${selected === key ? "is-selected" : ""}`}
                onClick={() => setSelected(key)}
                aria-pressed={selected === key}
              >
                <header className="sub__card-head">
                  <span className="sub__card-eyebrow">{plan.eyebrow}</span>
                  {plan.accent && (
                    <span className="sub__card-tag">most chosen</span>
                  )}
                </header>
                <h3 className="sub__card-title">{plan.title}</h3>
                <p className="sub__card-cadence">{plan.cadence}</p>
                <div className="sub__card-price">
                  <span className="sub__card-price-v">{plan.price}</span>
                  <span className="sub__card-price-k">/{plan.per}</span>
                </div>
                <span className="sub__card-saved">{plan.saved}</span>
                <ul className="sub__card-notes">
                  {plan.notes.map((n) => (
                    <li key={n}>
                      <span className="sub__card-bullet" aria-hidden>
                        —
                      </span>
                      {n}
                    </li>
                  ))}
                </ul>
              </button>
            ),
          )}
        </div>

        <div className="sub__foot">
          <button
            type="button"
            className="sub__cta"
            onClick={() => router.push("/quiz")}
          >
            Begin with {PLANS[selected].title.toLowerCase()}
            <span className="sub__cta-arrow" aria-hidden>
              →
            </span>
          </button>
          <span className="sub__note">
            The consultation first · no payment required to see your formula
          </span>
        </div>
      </div>
    </section>
  );
}
