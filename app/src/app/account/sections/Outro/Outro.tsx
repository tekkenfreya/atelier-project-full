"use client";

import { useRef } from "react";
import { useOutroAnim } from "./useOutroAnim";
import "./Outro.css";

interface OutroProps {
  headline: string;
  chips?: string[];
  ready: boolean;
}

const DEFAULT_CHIPS = [
  "Rosa canina",
  "Rosmarinus",
  "Chamaemelum",
  "Calendula",
  "Lavandula",
  "Hippophae",
  "Centella",
  "Tilia",
  "Achillea",
  "Thymus",
  "Quercus",
  "Salvia",
];

function stripOf(chips: string[], variant: 1 | 2 | 3) {
  return chips.map((chip, idx) => (
    <span key={`${variant}-${idx}`} className={`ot-chip ot-chip--${variant}`}>
      {chip}
    </span>
  ));
}

export default function Outro({ headline, chips = DEFAULT_CHIPS, ready }: OutroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useOutroAnim(sectionRef, ready);

  const words = headline.split(" ");

  return (
    <section ref={sectionRef} className="ot-section">
      <div className="ot-strips">
        <div className="ot-strip ot-os-1">{stripOf(chips, 1)}</div>
        <div className="ot-strip ot-os-2">{stripOf(chips, 2)}</div>
        <div className="ot-strip ot-os-3">{stripOf(chips, 3)}</div>
        <div className="ot-strip ot-os-4">{stripOf(chips, 1)}</div>
        <div className="ot-strip ot-os-5">{stripOf(chips, 2)}</div>
        <div className="ot-strip ot-os-6">{stripOf(chips, 3)}</div>
      </div>

      <div className="ot-container">
        <h2 className="ot-headline">
          {words.map((word, idx) => (
            <span key={idx} className="ot-word">
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
