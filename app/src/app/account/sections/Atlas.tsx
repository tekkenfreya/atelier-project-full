import dynamic from "next/dynamic";
import type { ResolvedExtract } from "@/lib/extracts";

const EasternEuropeMap = dynamic(
  () => import("@/components/map/EasternEuropeMap"),
  { ssr: false, loading: () => <div className="account-map__loading">Loading map...</div> },
);

interface AtlasProps {
  extracts: ResolvedExtract[];
  activeCountries: Set<string>;
  countryColors: Record<string, string>;
  hoveredCountry: string | null;
  onHoverCountry: (country: string | null) => void;
  onSelectExtract: (extract: ResolvedExtract) => void;
}

export default function Atlas({
  extracts,
  activeCountries,
  countryColors,
  hoveredCountry,
  onHoverCountry,
  onSelectExtract,
}: AtlasProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Atlas</h1>
        <p className="account-section__subtitle">
          Where your extracts are sourced. Click a country or extract for details.
        </p>
      </header>
      <div className="account-atlas">
        <div className="account-atlas__map">
          <EasternEuropeMap
            highlightedCountry={hoveredCountry}
            activeCountries={activeCountries}
            countryColors={countryColors}
          />
        </div>
        <ul className="account-atlas__list">
          {extracts.length === 0 ? (
            <li className="account-empty-inline">No extracts mapped.</li>
          ) : (
            extracts.map((e) => (
              <li key={e.ingredientName}>
                <button
                  type="button"
                  className="account-atlas__item"
                  onMouseEnter={() => onHoverCountry(e.origin.country)}
                  onMouseLeave={() => onHoverCountry(null)}
                  onClick={() => onSelectExtract(e)}
                >
                  <span
                    className="account-atlas__swatch"
                    style={{ backgroundColor: e.origin.color }}
                  />
                  <span className="account-atlas__name">{e.ingredientName}</span>
                  <span className="account-atlas__country">
                    {e.allCountries.join(", ")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
