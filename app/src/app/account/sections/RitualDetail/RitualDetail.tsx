"use client";

import { useRef } from "react";
import BottleSvg from "../../lib/BottleSvg";
import { formatProductName } from "../../lib/format";
import type { RitualItem } from "../../lib/types";
import type { ResolvedExtract } from "@/lib/extracts";
import { useRitualDetailAnim } from "./useRitualDetailAnim";
import "./RitualDetail.css";

interface RitualDetailProps {
  customerName: string | null;
  ritualItems: RitualItem[];
  extractsByCategory: Record<string, ResolvedExtract[]>;
  ready: boolean;
}

export default function RitualDetail({ customerName, ritualItems, extractsByCategory, ready }: RitualDetailProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useRitualDetailAnim(sectionRef, ready);

  if (ritualItems.length === 0) return null;

  return (
    <section ref={sectionRef} className="rd-section">
      <h2 className="rd-header">The Ritual.</h2>

      <div className="rd-stage">
        <div className="rd-rack">
          {ritualItems.map((item, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            const categoryExtracts = extractsByCategory[item.category] ?? [];
            return (
              <article key={item.variant} id={`rd-card-${idx + 1}`} className="rd-card">
                <div className="rd-card-wrapper">
                  <div className="rd-card-inner">
                    <div className="rd-card-front">
                      <div className="rd-card-row">
                        <span>{item.category}</span>
                        <span>{num}</span>
                      </div>
                      <div className="rd-card-bottle">
                        <BottleSvg variant={item.variant} />
                      </div>
                      <span className="rd-card-name">{formatProductName(customerName, item.category)}</span>
                      <div className="rd-card-row rd-card-row--bot">
                        <span>{num}</span>
                        <span>{item.category}</span>
                      </div>
                    </div>

                    <div className="rd-card-back">
                      <div className="rd-card-row">
                        <span>Formulated with</span>
                        <span>{num}</span>
                      </div>
                      <div className="rd-card-ingredients">
                        {categoryExtracts.length > 0 ? (
                          <ul>
                            {categoryExtracts.map((e) => (
                              <li key={e.ingredientName}>{e.origin.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="rd-card-empty">Formulation details coming soon.</p>
                        )}
                      </div>
                      <div className="rd-card-row rd-card-row--bot">
                        <span>{num}</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
