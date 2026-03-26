import type { ScoredProduct, FragranceOption, ProductCategory } from "@/lib/matching-engine/types";
import { PRODUCT_PRICES } from "@/types/cart";

interface SerumCardProps {
  result: ScoredProduct;
  fragranceOption: FragranceOption;
  onFragranceChange: (option: FragranceOption) => void;
  selected?: boolean;
  onToggleSelect?: () => void;
  showSelection?: boolean;
}

const FRAGRANCE_OPTIONS: { value: FragranceOption; label: string; description: string }[] = [
  { value: "F0", label: "No fragrance", description: "Pure formula, no added scent" },
  { value: "F1", label: "Fragrance blend 1", description: "Light, fresh botanical notes" },
  { value: "F2", label: "Fragrance blend 2", description: "Warm, earthy undertones" },
];

function getCategoryFromProduct(product: ScoredProduct["product"]): ProductCategory {
  const cat = product.category?.toLowerCase() ?? "";
  if (cat.includes("cleanser")) return "Cleanser";
  if (cat.includes("moistur")) return "Moisturizer";
  return "Serum";
}

export default function SerumCard({
  result,
  fragranceOption,
  onFragranceChange,
  selected = true,
  onToggleSelect,
  showSelection = false,
}: SerumCardProps) {
  const { product, reasons } = result;
  const category = getCategoryFromProduct(product);
  const price = PRODUCT_PRICES[category];

  const activeIngredients = product.ingredients.filter(
    (i) =>
      i.function?.includes("Active") ||
      i.function?.includes("Phase-Shot") ||
      i.function?.includes("Extract")
  );

  const cardClass = showSelection
    ? `results-card${selected ? " results-card-selected" : " results-card-deselected"}`
    : "results-card";

  return (
    <div className={cardClass}>
      {showSelection && (
        <button
          type="button"
          className="results-card-toggle"
          onClick={onToggleSelect}
          aria-label={selected ? `Deselect ${product.name}` : `Select ${product.name}`}
        >
          <span className={`results-card-checkbox${selected ? " checked" : ""}`}>
            {selected && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="results-card-toggle-label">
            {selected ? "Selected" : "Add to routine"}
          </span>
        </button>
      )}

      <span className="results-card-category">{category}</span>
      <h3 className="results-card-name">{product.name}</h3>
      <p className="results-card-skin">For {product.skin_type}</p>

      {showSelection && (
        <p className="results-card-price">${price}</p>
      )}

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
