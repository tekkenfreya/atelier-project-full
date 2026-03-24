import type { ScoredProduct, FragranceOption } from "@/lib/matching-engine/types";

interface SerumCardProps {
  result: ScoredProduct;
  fragranceOption: FragranceOption;
  onFragranceChange: (option: FragranceOption) => void;
}

const FRAGRANCE_OPTIONS: { value: FragranceOption; label: string; description: string }[] = [
  { value: "F0", label: "No fragrance", description: "Pure formula, no added scent" },
  { value: "F1", label: "Fragrance blend 1", description: "Light, fresh botanical notes" },
  { value: "F2", label: "Fragrance blend 2", description: "Warm, earthy undertones" },
];

export default function SerumCard({ result, fragranceOption, onFragranceChange }: SerumCardProps) {
  const { product, reasons } = result;

  const activeIngredients = product.ingredients.filter(
    (i) =>
      i.function?.includes("Active") ||
      i.function?.includes("Phase-Shot") ||
      i.function?.includes("Extract")
  );

  return (
    <div className="results-card">
      <span className="results-card-category">Serum</span>
      <h3 className="results-card-name">{product.name}</h3>
      <p className="results-card-skin">For {product.skin_type}</p>

      <div className="results-card-actives">
        <span className="results-card-label">Key Actives</span>
        <ul>
          {activeIngredients.map((ing) => (
            <li key={ing.id}>{ing.name}</li>
          ))}
        </ul>
      </div>

      <div className="results-card-reasons">
        <span className="results-card-label">Why We Picked This</span>
        <ul>
          {reasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="results-fragrance">
        <span className="results-card-label">Fragrance Preference</span>
        <div className="results-fragrance-options">
          {FRAGRANCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`results-fragrance-option${fragranceOption === opt.value ? " selected" : ""}`}
              onClick={() => onFragranceChange(opt.value)}
            >
              <span className="results-fragrance-indicator" />
              <span className="results-fragrance-content">
                <span className="results-fragrance-label">{opt.label}</span>
                <span className="results-fragrance-desc">{opt.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
