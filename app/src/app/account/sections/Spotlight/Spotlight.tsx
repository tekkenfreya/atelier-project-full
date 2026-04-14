"use client";

import { useRef } from "react";
import { useSpotlightAnim } from "./useSpotlightAnim";
import "./Spotlight.css";

interface SpotlightProps {
  intro?: string;
  headline: string;
  ready: boolean;
}

const IMAGE_TONES = ["warm", "cool", "olive"] as const;

export default function Spotlight({
  intro = "Every formula begins here — with soil, root, and ritual.",
  headline,
  ready,
}: SpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSpotlightAnim(sectionRef, ready);

  const words = headline.split(" ");

  return (
    <section ref={sectionRef} className="sp-section">
      <div className="sp-intro">{intro}</div>

      <div className="sp-images">
        {Array.from({ length: 4 }).map((_, row) => (
          <div key={row} className="sp-images-row">
            {Array.from({ length: 3 }).map((_, col) => {
              const tone = IMAGE_TONES[(row + col) % IMAGE_TONES.length];
              return <div key={col} className={`sp-image sp-image--${tone}`} aria-hidden="true" />;
            })}
          </div>
        ))}
      </div>

      <div className="sp-mask">
        <div className="sp-mask-image" />
      </div>

      <div className="sp-headline-slot">
        <h2 className="sp-headline">
          {words.map((word, idx) => (
            <span key={idx} className="sp-word">
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
