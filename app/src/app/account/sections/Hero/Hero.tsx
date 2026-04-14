"use client";

import { useRef } from "react";
import BottleSvg from "../../lib/BottleSvg";
import { formatProductName } from "../../lib/format";
import type { RitualItem } from "../../lib/types";
import { useHeroAnim } from "./useHeroAnim";
import "./Hero.css";

interface HeroProps {
  displayName: string;
  customerName: string | null;
  ritualItems: RitualItem[];
  ready: boolean;
}

export default function Hero({ displayName, customerName, ritualItems, ready }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  useHeroAnim(heroRef, ready);

  return (
    <section ref={heroRef} className="rh-hero">
      <div className="rh-stack">
        <div className="rh-name-slot">
          <h1>{displayName.toUpperCase()}</h1>
        </div>
        <div className="rh-caption-slot">
          <div className="rh-caption-copy">
            <p>
              Your personal skincare ritual, composed from Eastern European botanicals. Every formula begins with a consultation and ends in your hands.
            </p>
          </div>
        </div>
      </div>

      {ritualItems.length > 0 && (
        <div className="rh-deck">
          {ritualItems.map((item, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            return (
              <div key={item.variant} id={`rh-card-${idx + 1}`} className="rh-card">
                <div className="rh-card-face">
                  <div className="rh-card-meta">
                    <p className="rh-mono">{item.category}</p>
                    <p className="rh-mono">{num}</p>
                  </div>
                  <div className="rh-card-vessel">
                    <BottleSvg variant={item.variant} />
                  </div>
                  <p className="rh-card-label">{formatProductName(customerName, item.category)}</p>
                  <div className="rh-card-meta">
                    <p className="rh-mono">{num}</p>
                    <p className="rh-mono">{item.category}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
