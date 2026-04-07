"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  number: string;
  category: string;
  name: string;
  description: string;
  price: string;
  placeholder: string;
}

const PRODUCTS: Product[] = [
  {
    number: "01",
    category: "Daily Cleanser",
    name: "The Purifying Wash",
    description:
      "A gentle, pH-balanced cleanser that dissolves impurities without stripping your skin's natural moisture barrier. Custom-formulated with botanicals selected for your skin type.",
    price: "€23",
    placeholder: "cleanser",
  },
  {
    number: "02",
    category: "Active Serum",
    name: "The Concentrated Elixir",
    description:
      "A potent blend of targeted actives that penetrate deep to address your specific skin concerns, from fine lines to uneven tone. Your most powerful step.",
    price: "€50",
    placeholder: "serum",
  },
  {
    number: "03",
    category: "Daily Moisturiser",
    name: "The Nourishing Veil",
    description:
      "A rich yet weightless moisturiser that locks in hydration and protects your skin throughout the day. Adapts to your environment and skin needs.",
    price: "€41",
    placeholder: "moisturiser",
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLabelRef = useRef<HTMLParagraphElement>(null);
  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerLabelRef.current, { y: 15 });
      gsap.set(headerTitleRef.current, { y: 20 });

      gsap.to(headerLabelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerLabelRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.to(headerTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerTitleRef.current,
          start: "top 85%",
          once: true,
        },
      });

      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.set(row, { y: 40 });
        gsap.to(row, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="products" id="products" ref={sectionRef}>
      <div className="products-header">
        <p className="products-label" ref={headerLabelRef}>
          The Collection
        </p>
        <h2 className="products-title" ref={headerTitleRef}>
          Three Steps, Infinite Formulas
        </h2>
      </div>

      {PRODUCTS.map((product, i) => (
        <div key={product.number}>
          <div
            className={`product-row ${i % 2 !== 0 ? "reverse" : ""}`}
            ref={(el) => { rowRefs.current[i] = el; }}
          >
            <div className="product-image-wrapper">
              <div className="product-image-inner">
                <span className="product-number">{product.number}</span>
                <span className="product-image-placeholder">
                  {product.placeholder}
                </span>
              </div>
            </div>

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{product.price}</p>
              <a href="#" className="product-link">
                Discover
                <span className="product-link-arrow" />
              </a>
            </div>
          </div>

          {i < PRODUCTS.length - 1 && (
            <div className="product-divider">
              <div className="product-divider-line" />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
