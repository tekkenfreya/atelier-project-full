"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { KEY_TO_ISO, ISO_TO_KEY } from "@/data/countryData";

interface EasternEuropeMapProps {
  highlightedCountry: string | null;
  onCountryClick?: (countryId: string) => void;
  activeCountries?: Set<string>;
  countryColors?: Record<string, string>;
  countryOpacity?: Record<string, number>;
  zoomToCountry?: string | null;
}

const GEOJSON_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const EE_ISOS = new Set(Object.values(KEY_TO_ISO));

const DEFAULT_STYLE: L.PathOptions = {
  fillColor: "#ede8de",
  fillOpacity: 0.6,
  color: "#c4b9a0",
  weight: 1,
};

const ACTIVE_STYLE: L.PathOptions = {
  fillColor: "#ddd5b8",
  fillOpacity: 0.65,
  color: "#b8ad8a",
  weight: 1.2,
};

const HOVER_STYLE: L.PathOptions = {
  fillColor: "#d0c8a8",
  fillOpacity: 0.8,
  weight: 1.5,
};

const HIGHLIGHT_STYLE: L.PathOptions = {
  fillColor: "#8b7d3c",
  fillOpacity: 0.7,
  color: "#a6954a",
  weight: 2.5,
};

const NON_EE_STYLE: L.PathOptions = {
  fillColor: "#f0ece4",
  fillOpacity: 0.3,
  color: "#d9d3c7",
  weight: 0.5,
};

function getCountryStyle(
  countryKey: string,
  highlighted: string | null,
  activeSet: Set<string>,
  colors: Record<string, string>,
  opacityMap: Record<string, number>
): L.PathOptions {
  if (countryKey === highlighted) {
    const color = colors[countryKey];
    if (color) {
      return { fillColor: color, fillOpacity: 0.8, color, weight: 2.5 };
    }
    return HIGHLIGHT_STYLE;
  }
  if (activeSet.has(countryKey)) {
    const color = colors[countryKey];
    if (color) {
      const fillOpacity = opacityMap[countryKey] ?? 0.35;
      return { fillColor: color, fillOpacity, color: "#c4b9a0", weight: 1.2 };
    }
    return ACTIVE_STYLE;
  }
  return DEFAULT_STYLE;
}

export default function EasternEuropeMap({
  highlightedCountry,
  onCountryClick,
  activeCountries = new Set(),
  countryColors = {},
  countryOpacity = {},
  zoomToCountry = null,
}: EasternEuropeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Record<string, L.GeoJSON>>({});
  const [loaded, setLoaded] = useState(false);

  const activeKey = useMemo(() => [...activeCountries].sort().join(","), [activeCountries]);
  const colorsKey = useMemo(() => Object.entries(countryColors).map(([k, v]) => `${k}:${v}`).join(","), [countryColors]);
  const opacityKey = useMemo(() => Object.entries(countryOpacity).map(([k, v]) => `${k}:${v}`).join(","), [countryOpacity]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [48.5, 22],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd" }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    let cancelled = false;

    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geojson) => {
        if (cancelled) return;

        const features = geojson.features as GeoJSON.Feature[];

        features.forEach((feature) => {
          if (cancelled) return;

          const iso = (feature.id ?? feature.properties?.ISO_A3 ?? feature.properties?.iso_a3) as string;
          const isEE = EE_ISOS.has(iso);
          const countryKey = ISO_TO_KEY[iso];

          const style = isEE
            ? getCountryStyle(countryKey, null, activeCountries, countryColors, countryOpacity)
            : NON_EE_STYLE;

          const layer = L.geoJSON(feature, { style }).addTo(map);

          if (isEE && countryKey) {
            layersRef.current[countryKey] = layer;

            layer.on("mouseover", () => {
              layer.setStyle(HOVER_STYLE);
            });

            layer.on("mouseout", () => {
              layer.setStyle(
                getCountryStyle(countryKey, highlightedCountry, activeCountries, countryColors, countryOpacity)
              );
            });

            layer.on("click", () => {
              onCountryClick?.(countryKey);
            });
          }
        });

        setLoaded(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
      layersRef.current = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle highlight + active country styling
  useEffect(() => {
    if (!loaded) return;

    Object.entries(layersRef.current).forEach(([key, layer]) => {
      layer.setStyle(getCountryStyle(key, highlightedCountry, activeCountries, countryColors, countryOpacity));
      if (key === highlightedCountry) {
        layer.bringToFront();
      }
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedCountry, loaded, activeKey, colorsKey, opacityKey]);

  // Zoom to country on demand
  useEffect(() => {
    if (!loaded || !zoomToCountry || !mapRef.current || !layersRef.current[zoomToCountry]) return;

    const center = layersRef.current[zoomToCountry].getBounds().getCenter();
    mapRef.current.flyTo(center, 18, {
      duration: 3,
      easeLinearity: 0.1,
    });
  }, [loaded, zoomToCountry]);

  return (
    <div className="extract-map-container">
      <div ref={containerRef} className="extract-map-leaflet" />
      {!loaded && (
        <div className="extract-map-loading">Loading map...</div>
      )}
    </div>
  );
}
