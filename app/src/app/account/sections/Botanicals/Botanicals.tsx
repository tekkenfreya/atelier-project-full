"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ExtractModal from "@/components/map/ExtractModal";
import { COUNTRY_NAMES, KEY_TO_ISO } from "@/data/countryData";
import { pickLandscape, type ResolvedExtract } from "@/lib/extracts";
import { ROMAN } from "../../lib/format";
import { useFadeInSection } from "../../hooks/useFadeInSection";

const EasternEuropeMap = dynamic(() => import("@/components/map/EasternEuropeMap"), {
  ssr: false,
  loading: () => <div className="extract-map-container extract-map-loading">Loading map...</div>,
});

interface BotanicalsProps {
  extracts: ResolvedExtract[];
  ready: boolean;
}

export default function Botanicals({ extracts, ready }: BotanicalsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeInSection(sectionRef, ready);

  const [selectedExtract, setSelectedExtract] = useState<ResolvedExtract | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryPicker, setCountryPicker] = useState<{ country: string; extracts: ResolvedExtract[] } | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredExtract, setHoveredExtract] = useState<string | null>(null);

  const activeCountries = useMemo(() => {
    const set = new Set<string>();
    extracts.forEach((e) => e.allCountries.forEach((c) => set.add(c)));
    return set;
  }, [extracts]);

  const countryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    if (hoveredExtract) {
      const hovered = extracts.find((e) => e.ingredientName === hoveredExtract);
      if (hovered) hovered.allCountries.forEach((c) => { colors[c] = hovered.origin.color; });
    }
    extracts.forEach((e) => {
      e.allCountries.forEach((c) => { if (!colors[c]) colors[c] = e.origin.color; });
    });
    return colors;
  }, [extracts, hoveredExtract]);

  const countryOpacity = useMemo(() => {
    const counts: Record<string, number> = {};
    extracts.forEach((e) => e.allCountries.forEach((c) => { counts[c] = (counts[c] ?? 0) + 1; }));
    const op: Record<string, number> = {};
    Object.entries(counts).forEach(([c, n]) => {
      op[c] = Math.min(0.35 + 0.15 * n, 0.85);
    });
    return op;
  }, [extracts]);

  const extractsByCountryMap = useMemo(() => {
    const map: Record<string, ResolvedExtract[]> = {};
    extracts.forEach((e) => e.allCountries.forEach((c) => {
      if (!map[c]) map[c] = [];
      map[c].push(e);
    }));
    return map;
  }, [extracts]);

  const extractsByCountry = useMemo(() => {
    const map = new Map<string, ResolvedExtract[]>();
    extracts.forEach((e) => {
      const key = e.origin.country;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).map(([countryKey, items]) => ({
      countryKey,
      countryLabel: COUNTRY_NAMES[KEY_TO_ISO[countryKey]] ?? countryKey,
      items,
    }));
  }, [extracts]);

  const handleCountryClick = (countryKey: string) => {
    const list = extractsByCountryMap[countryKey] ?? [];
    if (list.length === 0) return;
    if (list.length === 1) {
      setSelectedCountry(countryKey);
      setSelectedExtract(list[0]);
      setCountryPicker(null);
      return;
    }
    setCountryPicker({ country: countryKey, extracts: list });
  };

  return (
    <section ref={sectionRef} className="journal-spread journal-spread--wide">
      <div className="journal-spread-header">
        <span className="journal-spread-num">{ROMAN[1]}</span>
        <h2 className="journal-spread-title">Your Botanicals</h2>
        <p className="journal-spread-lede">
          Sourced from the forests and valleys of Eastern Europe. Hover an ingredient to reveal its origin; click a country to see what grows there.
        </p>
        {extracts.length > 0 && (
          <p className="journal-spread-count">
            {extracts.length} botanical{extracts.length === 1 ? "" : "s"} · {activeCountries.size} region{activeCountries.size === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div className="journal-botanicals">
        {extracts.length > 0 && (
          <aside className="journal-botanicals-sidebar">
            {extractsByCountry.map(({ countryKey, countryLabel, items }) => (
              <div key={countryKey} className="journal-botanicals-group">
                <div className="journal-botanicals-group-header">{countryLabel}</div>
                {items.map((e) => {
                  const { ingredientName, origin } = e;
                  return (
                    <button
                      key={ingredientName}
                      type="button"
                      className={`journal-botanicals-item${hoveredExtract === ingredientName ? " journal-botanicals-item-active" : ""}`}
                      onClick={() => {
                        setHoveredCountry(origin.country);
                        setHoveredExtract(ingredientName);
                        setSelectedCountry(origin.country);
                        setSelectedExtract(e);
                      }}
                      onMouseEnter={() => {
                        if (!selectedExtract) {
                          setHoveredCountry(origin.country);
                          setHoveredExtract(ingredientName);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!selectedExtract) {
                          setHoveredCountry(null);
                          setHoveredExtract(null);
                        }
                      }}
                    >
                      <span className="journal-botanicals-item-name">{origin.name}</span>
                      <span className="journal-botanicals-item-region">{origin.region ?? origin.country}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>
        )}

        <div className="journal-botanicals-map">
          {countryPicker && (
            <div className="profile-country-picker">
              <div className="profile-country-picker-header">
                {COUNTRY_NAMES[KEY_TO_ISO[countryPicker.country]] ?? countryPicker.country}
                <button
                  type="button"
                  className="profile-country-picker-close"
                  onClick={() => setCountryPicker(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              {countryPicker.extracts.map((e) => (
                <button
                  key={e.ingredientName}
                  type="button"
                  className="profile-country-picker-item"
                  onClick={() => {
                    setSelectedCountry(countryPicker.country);
                    setSelectedExtract(e);
                    setCountryPicker(null);
                  }}
                >
                  {e.origin.name}
                </button>
              ))}
            </div>
          )}
          <EasternEuropeMap
            highlightedCountry={hoveredCountry}
            activeCountries={activeCountries}
            countryColors={countryColors}
            countryOpacity={countryOpacity}
            onCountryClick={handleCountryClick}
          />
        </div>
      </div>

      <ExtractModal
        extract={selectedExtract?.origin ?? null}
        ingredientName={selectedExtract?.ingredientName ?? null}
        landscapeUrl={selectedExtract ? pickLandscape(selectedExtract, selectedCountry) : null}
        availableCountries={selectedExtract?.allCountries ?? []}
        activeCountry={selectedCountry}
        onCountryChange={(c) => setSelectedCountry(c)}
        onClose={() => {
          setSelectedExtract(null);
          setSelectedCountry(null);
          setHoveredCountry(null);
          setHoveredExtract(null);
        }}
      />
    </section>
  );
}
