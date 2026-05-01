"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  n: string;
  cat: string;
  name: string;
  blurb: string;
  desc: string;
  price: string;
  notes: string[];
  hue: "sage" | "rose" | "amber";
  label: string;
}

const PRODUCTS: Product[] = [
  {
    n: "01",
    cat: "Cleanser",
    name: "The Purifying Wash",
    blurb: "Dissolves the day.",
    desc: "Gentle, pH-balanced. Removes the day without stripping the barrier — calibrated to your profile.",
    price: "€23",
    notes: ["Chamomile", "Oat", "Glycerin"],
    hue: "sage",
    label: "01 · Wash",
  },
  {
    n: "02",
    cat: "Serum",
    name: "The Concentrated Elixir",
    blurb: "The potent middle.",
    desc: "Targeted actives — fine lines, tone, radiance. The most considered step in the ritual.",
    price: "€50",
    notes: ["Niacinamide", "Peptide", "Bakuchiol"],
    hue: "rose",
    label: "02 · Elixir",
  },
  {
    n: "03",
    cat: "Moisturiser",
    name: "The Nourishing Veil",
    blurb: "A quiet seal.",
    desc: "Weightless hydration that adapts. Locks in the serum, softens the skin, finishes the ritual.",
    price: "€41",
    notes: ["Ceramide", "Squalane", "Shea"],
    hue: "amber",
    label: "03 · Veil",
  },
];

export default function Products() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headRef.current, { y: 26, opacity: 0 });
      gsap.set(cardRefs.current, { y: 40, opacity: 0 });

      gsap.to(headRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sec" id="products" ref={sectionRef}>
      <header className="sec__head" ref={headRef}>
        <span className="sec__num">No. 01 · Collection</span>
        <div>
          <h2 className="sec__title">
            Three bottles, <em>infinite formulas.</em>
          </h2>
          <p className="sec__lead">
            A complete ritual: wash, serum, veil. Each personalised from a
            shared consultation, so the three work in harmony on your skin
            alone.
          </p>
        </div>
      </header>

      <div className="prod__grid">
        {PRODUCTS.map((p, i) => (
          <article
            key={p.n}
            className={`prod__card prod__card--${p.hue}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onClick={() => router.push("/quiz")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push("/quiz");
            }}
          >
            <div className="prod__card-art">
              <span className="prod__card-num">№{p.n}</span>
              <span className="prod__card-cat">{p.cat}</span>
              <div className="prod__bottle" data-label={p.label} aria-hidden />
            </div>
            <div className="prod__card-body">
              <span className="prod__card-blurb">{p.blurb}</span>
              <h3 className="prod__card-name">{p.name}</h3>
              <p className="prod__card-desc">{p.desc}</p>
              <ul className="prod__card-notes">
                {p.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <footer className="prod__card-foot">
              <span className="prod__card-price">
                from <span className="prod__card-price-v">{p.price}</span>
              </span>
              <span className="prod__card-cta" aria-hidden>
                →
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
