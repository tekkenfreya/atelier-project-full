import type { Concern } from "./types";

interface IngredientMapping {
  concerns: Concern[];
  isExcludable: boolean;
  excludeLabel?: string;
}

const INGREDIENT_MAP: Record<string, IngredientMapping> = {
  // BHA / Acne fighters
  "Salicylic Acid": {
    concerns: ["acne", "oil-control"],
    isExcludable: true,
    excludeLabel: "Exfoliating acids (AHA, BHA)",
  },
  "Zinc PCA": {
    concerns: ["acne", "oil-control"],
    isExcludable: false,
  },

  // Brightening / Hyperpigmentation
  "Tranexamic Acid": {
    concerns: ["hyperpigmentation", "brightening"],
    isExcludable: false,
  },
  "Azeloglycine": {
    concerns: ["brightening"],
    isExcludable: false,
  },
  "Niacinamide": {
    concerns: ["brightening", "oil-control"],
    isExcludable: false,
  },
  "Vitamin C": {
    concerns: ["brightening", "antioxidant"],
    isExcludable: false,
  },

  // Retinol / Anti-aging
  "Retinol Liposome OS": {
    concerns: ["anti-aging"],
    isExcludable: true,
    excludeLabel: "Retinol / retinoids",
  },
  "Retinol in Phytosqualane": {
    concerns: ["anti-aging"],
    isExcludable: true,
    excludeLabel: "Retinol / retinoids",
  },
  "SymRenew HPR": {
    concerns: ["anti-aging"],
    isExcludable: true,
    excludeLabel: "Retinol / retinoids",
  },
  "Matrixyl 3000": {
    concerns: ["anti-aging"],
    isExcludable: false,
  },
  "SepiliftTM DPHP": {
    concerns: ["anti-aging"],
    isExcludable: false,
  },

  // Gentle anti-aging / Calming
  "Bakuchiol": {
    concerns: ["anti-aging-gentle", "calming"],
    isExcludable: false,
  },
  "Bisabolol": {
    concerns: ["calming"],
    isExcludable: false,
  },
  "Ectoin": {
    concerns: ["calming"],
    isExcludable: false,
  },
  "Centella Asiatica Extract GW": {
    concerns: ["calming", "repair"],
    isExcludable: false,
  },

  // Hydration
  "4D MB Hyaluronic acid": {
    concerns: ["hydration"],
    isExcludable: false,
  },
  "AquaxylTM": {
    concerns: ["hydration"],
    isExcludable: false,
  },
  "Panthenol": {
    concerns: ["hydration", "repair"],
    isExcludable: false,
  },

  // Repair / Barrier
  "Betaglucano sol.": {
    concerns: ["repair"],
    isExcludable: false,
  },

  // Antioxidant
  "Stabilized Coenzyme Q10": {
    concerns: ["antioxidant", "anti-aging"],
    isExcludable: false,
  },
  "Cosphaderm\u00AE Tocopharin": {
    concerns: ["antioxidant"],
    isExcludable: false,
  },

  // Fragrance — excludable only via safety conditions (eczema), not via user Q29 preference.
  // Fragrance preference is handled as a customer choice (F0/F1/F2) on the results page.
  "Parfum": {
    concerns: [],
    isExcludable: true,
    excludeLabel: "Fragrance / essential oils",
  },
};

export function getIngredientMapping(name: string): IngredientMapping | null {
  return INGREDIENT_MAP[name] ?? null;
}

export function getProductConcerns(ingredientNames: string[]): Concern[] {
  const concerns = new Set<Concern>();
  for (const name of ingredientNames) {
    const mapping = INGREDIENT_MAP[name];
    if (mapping) {
      for (const concern of mapping.concerns) {
        concerns.add(concern);
      }
    }
  }
  return Array.from(concerns);
}

export function getProductExcludables(ingredientNames: string[]): string[] {
  const labels: string[] = [];
  for (const name of ingredientNames) {
    const mapping = INGREDIENT_MAP[name];
    if (mapping?.isExcludable && mapping.excludeLabel) {
      if (!labels.includes(mapping.excludeLabel)) {
        labels.push(mapping.excludeLabel);
      }
    }
  }
  return labels;
}
