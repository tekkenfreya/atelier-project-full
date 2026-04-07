"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Ingredient, ProductCategory } from "@/lib/matching-engine/types";

interface BotanicalCardProps {
  ingredient: Ingredient;
  category: ProductCategory;
  index: number;
  visible: boolean;
}

export default function BotanicalCard({
  ingredient,
  category,
  index,
  visible,
}: BotanicalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  /* ─── Entrance animation ─── */
  useEffect(() => {
    if (!visible || hasAnimated.current || !cardRef.current) return;
    hasAnimated.current = true;

    gsap.set(cardRef.current, { opacity: 0, y: 40, scale: 0.95 });
    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: index * 0.12,
      ease: "power4.out",
    });
  }, [visible, index]);

  /* ─── Breathing glow ─── */
  useEffect(() => {
    if (!visible || !glowRef.current) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.3 });
    tl.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.05,
      duration: 2.5,
      ease: "sine.inOut",
    });
    tl.to(glowRef.current, {
      opacity: 0.2,
      scale: 1,
      duration: 2.5,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [visible, index]);

  const priorities = ingredient.skincare_priorities ?? [];

  return (
    <div ref={cardRef} className="rd-botanical-card" style={{ opacity: 0 }}>
      {/* Glow ring */}
      <div ref={glowRef} className="rd-botanical-glow" />

      {/* Shimmer sweep */}
      <div className="rd-botanical-shimmer" />

      {/* Content */}
      <div className="rd-botanical-content">
        <span className="rd-botanical-cat">{category}</span>
        <h3 className="rd-botanical-name">{ingredient.name}</h3>
        {ingredient.scientific_name && (
          <p className="rd-botanical-sci">{ingredient.scientific_name}</p>
        )}
        {priorities.length > 0 && (
          <div className="rd-botanical-benefits">
            {priorities.map((p) => (
              <span key={p} className="rd-botanical-tag">{p}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
