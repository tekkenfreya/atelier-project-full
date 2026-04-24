"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Products.css";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  number: string;
  category: string;
  name: string;
  blurb: string;
  description: string;
  price: string;
  notes: string[];
  hue: string;
}

const PRODUCTS: Product[] = [
  {
    number: "01",
    category: "Cleanser",
    name: "The Purifying Wash",
    blurb: "Dissolves the day.",
    description:
      "A gentle, pH-balanced cleanser that removes impurities without stripping your barrier. Custom-formulated for your skin's profile.",
    price: "€23",
    notes: ["Chamomile", "Oat", "Glycerin"],
    hue: "sage",
  },
  {
    number: "02",
    category: "Serum",
    name: "The Concentrated Elixir",
    blurb: "The potent middle.",
    description:
      "Targeted actives that penetrate deep to address your specific concerns — fine lines, tone, radiance. The most considered step in the ritual.",
    price: "€50",
    notes: ["Niacinamide", "Peptide", "Bakuchiol"],
    hue: "rose",
  },
  {
    number: "03",
    category: "Moisturiser",
    name: "The Nourishing Veil",
    blurb: "A quiet seal.",
    description:
      "Weightless hydration that adapts to your environment. Locks in the serum, softens the skin, finishes the ritual.",
    price: "€41",
    notes: ["Ceramide", "Squalane", "Shea"],
    hue: "amber",
  },
];

export default function Products() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, titleRef.current, descRef.current], {
        y: 18,
        opacity: 0,
      });
      gsap.set(cardRefs.current, { y: 40, opacity: 0 });

      gsap.to([eyebrowRef.current, titleRef.current, descRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          delay: i * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="lux-prod" id="products" ref={sectionRef}>
      <header className="lux-prod__header">
        <span className="lux-prod__eyebrow" ref={eyebrowRef}>
          THE COLLECTION · No. 01–03
        </span>
        <h2 className="lux-prod__title" ref={titleRef}>
          <span>Three bottles,</span>
          <span className="lux-prod__title-italic">infinite formulas.</span>
        </h2>
        <p className="lux-prod__desc" ref={descRef}>
          A complete ritual: wash, serum, veil. Each personalised from a shared
          consultation, so the three work in harmony on your skin alone.
        </p>
      </header>

      <div className="lux-prod__triptych">
        {PRODUCTS.map((p, i) => (
          <article
            key={p.number}
            className={`lux-prod__card lux-prod__card--${p.hue}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onClick={() => router.push("/quiz")}
          >
            <div className="lux-prod__card-frame">
              <header className="lux-prod__card-head">
                <span className="lux-prod__card-num">№{p.number}</span>
                <span className="lux-prod__card-cat">{p.category}</span>
              </header>

              <div className="lux-prod__card-bottle" aria-hidden>
                <div className="lux-prod__bottle" />
              </div>

              <div className="lux-prod__card-body">
                <span className="lux-prod__card-blurb">{p.blurb}</span>
                <h3 className="lux-prod__card-name">{p.name}</h3>
                <p className="lux-prod__card-desc">{p.description}</p>

                <ul className="lux-prod__card-notes">
                  {p.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <footer className="lux-prod__card-foot">
                <span className="lux-prod__card-price">
                  from <span className="lux-prod__card-price-v">{p.price}</span>
                </span>
                <span className="lux-prod__card-cta">
                  begin the consultation →
                </span>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
