"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { COUNTRY_NAMES, KEY_TO_ISO } from "@/data/countryData";
import type { ExtractOrigin } from "@/data/extractOrigins";

const EasternEuropeMap = dynamic(() => import("./EasternEuropeMap"), {
  ssr: false,
  loading: () => <div className="extract-map-container extract-map-loading">Loading map...</div>,
});

interface ExtractModalProps {
  extract: ExtractOrigin | null;
  ingredientName: string | null;
  landscapeUrl: string | null;
  availableCountries?: string[];
  activeCountry?: string | null;
  onCountryChange?: (country: string) => void;
  onClose: () => void;
}

interface MapHandle {
  flyToCountry: (country: string) => void;
}

export default function ExtractModal({
  extract,
  ingredientName,
  landscapeUrl,
  availableCountries = [],
  activeCountry = null,
  onCountryChange,
  onClose,
}: ExtractModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [zoomTarget, setZoomTarget] = useState<string | null>(null);
  const [dissolving, setDissolving] = useState(false);

  const currentCountry = activeCountry ?? extract?.country ?? null;

  // Modal entrance — runs once per open
  useEffect(() => {
    if (!extract || !overlayRef.current || !panelRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power4.out", delay: 0.1 }
    );
  }, [extract]);

  // Zoom + dissolve sequence — re-runs when the selected country changes
  useEffect(() => {
    if (!extract || !currentCountry) return;

    setZoomTarget(null);
    setDissolving(false);

    if (mapLayerRef.current) {
      gsap.set(mapLayerRef.current, { opacity: 1 });
    }
    if (imageLayerRef.current) {
      gsap.set(imageLayerRef.current, { opacity: 0 });
    }

    timerRef.current = setTimeout(() => {
      setZoomTarget(currentCountry);
      timer2Ref.current = setTimeout(() => {
        setDissolving(true);
      }, 2000);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, [extract, currentCountry]);

  // Cross-dissolve animation
  useEffect(() => {
    if (!dissolving || !mapLayerRef.current || !imageLayerRef.current) return;

    // Map fades out
    gsap.to(mapLayerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    // Image fades in
    gsap.fromTo(
      imageLayerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" }
    );
  }, [dissolving]);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (timer2Ref.current) clearTimeout(timer2Ref.current);

    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    gsap.to(panelRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      delay: 0.1,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!extract) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [extract, handleClose]);

  if (!extract || !ingredientName) return null;

  const displayCountry = currentCountry ?? extract.country;
  const isoCode = KEY_TO_ISO[displayCountry];
  const countryLabel = (isoCode ? COUNTRY_NAMES[isoCode] : null) ?? displayCountry;

  const imagePath = landscapeUrl;
  const showChips = availableCountries.length > 1;

  return (
    <div
      ref={overlayRef}
      className="extract-modal-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div ref={panelRef} className="extract-modal">
        <button
          type="button"
          className="extract-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="extract-modal-layout">
          {/* Left: Map → Image cross-dissolve */}
          <div className="extract-modal-visual">
            {/* Map layer */}
            <div ref={mapLayerRef} className="extract-modal-layer">
              <EasternEuropeMap
                highlightedCountry={displayCountry}
                activeCountries={new Set(availableCountries.length ? availableCountries : [displayCountry])}
                countryColors={Object.fromEntries(
                  (availableCountries.length ? availableCountries : [displayCountry]).map((c) => [c, extract.color])
                )}
                zoomToCountry={zoomTarget}
              />
              <div className="extract-modal-map-label">
                <span className="extract-modal-map-country">{countryLabel}</span>
                {extract.region && (
                  <span className="extract-modal-map-region">{extract.region}</span>
                )}
              </div>
            </div>

            {/* Image layer (fades in after 1.5s) */}
            <div
              ref={imageLayerRef}
              className="extract-modal-layer extract-modal-image-layer"
              style={{ opacity: 0 }}
            >
              {imagePath ? (
                <img
                  src={imagePath}
                  alt={extract.name}
                  className="extract-modal-image"
                />
              ) : null}
              <div className="extract-modal-placeholder" style={{ display: imagePath ? "none" : "flex" }}>
                <div
                  className="extract-modal-placeholder-bg"
                  style={{
                    background: `linear-gradient(135deg, ${extract.color}40 0%, ${extract.color}90 50%, ${extract.color}60 100%)`,
                  }}
                />
                <span className="extract-modal-placeholder-name">{extract.name}</span>
                <span className="extract-modal-placeholder-region">
                  {extract.region ?? countryLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="extract-modal-details">
            <span className="extract-modal-eyebrow">Origin Story</span>
            <h2 className="extract-modal-name">{extract.name}</h2>
            <p className="extract-modal-ingredient">{ingredientName}</p>

            <div className="extract-modal-origin">
              <span className="extract-modal-origin-label">Sourced From</span>
              <span className="extract-modal-origin-value">
                {extract.region ? `${extract.region}, ` : ""}{countryLabel}
              </span>
            </div>

            {showChips && (
              <div className="extract-modal-chips">
                {availableCountries.map((c) => {
                  const iso = KEY_TO_ISO[c];
                  const label = (iso ? COUNTRY_NAMES[iso] : null) ?? c;
                  const active = c === displayCountry;
                  return (
                    <button
                      key={c}
                      type="button"
                      className={`extract-modal-chip${active ? " extract-modal-chip-active" : ""}`}
                      onClick={() => onCountryChange?.(c)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="extract-modal-desc">{extract.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
