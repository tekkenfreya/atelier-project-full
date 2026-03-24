# Matching Engine V1 — Serum Recommendation

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an ingredient-driven matching engine that recommends the best serum based on quiz answers.

**Architecture:** Decision tree (hard filters on skin type, category, safety exclusions) narrows candidates, then weighted scoring picks the best match when multiple candidates remain. Product capabilities are derived from existing ingredient data — no manual tagging needed.

**Tech Stack:** Next.js 16 (app/), Supabase JS client (new dependency), TypeScript

**Spec:** `docs/PRD-Product-Recommendation-Engine.md`

---

## File Structure

```
app/src/
├── lib/
│   ├── supabase.ts                    # Supabase client init
│   ├── matching-engine/
│   │   ├── types.ts                   # All types for the engine
│   │   ├── ingredient-map.ts          # Ingredient name → concern mapping
│   │   ├── filters.ts                 # Hard filters (skin type, exclusions)
│   │   ├── scoring.ts                 # Scoring logic for tiebreaking
│   │   └── recommend.ts              # Main entry point — orchestrates pipeline
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts               # POST endpoint — quiz answers in, recommendation out
│   └── results/
│       └── page.tsx                   # Results page — shows recommended serum
├── components/
│   └── results/
│       └── SerumCard.tsx              # Product recommendation card
```

**Existing files modified:**
- `app/src/components/quiz/Quiz.tsx` — redirect to `/results` instead of showing "Thank You"
- `app/package.json` — add `@supabase/supabase-js` dependency

---

## Chunk 1: Foundation — Supabase Client + Types + Ingredient Map

### Task 1: Install Supabase and create client

**Files:**
- Modify: `app/package.json`
- Create: `app/src/lib/supabase.ts`
- Create: `app/.env.local`

- [ ] **Step 1: Install Supabase JS**

```bash
cd app && npm install @supabase/supabase-js
```

- [ ] **Step 2: Create .env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://kdjcbxjagaltvynvshkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkamNieGphZ2FsdHZ5bnZzaGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDE0MTksImV4cCI6MjA4ODgxNzQxOX0.s4tx2tzSVVB9rOFE581UBqC4tcJ1aW-H6vQpND1d5cA
```

- [ ] **Step 3: Create Supabase client**

Write `app/src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 4: Add .env.local to .gitignore**

Verify `app/.gitignore` includes `.env.local`. If not, add it.

- [ ] **Step 5: Commit**

```bash
git add app/package.json app/package-lock.json app/src/lib/supabase.ts app/.gitignore
git commit -m "feat: add Supabase client to e-commerce app"
```

---

### Task 2: Define types

**Files:**
- Create: `app/src/lib/matching-engine/types.ts`

- [ ] **Step 1: Write types file**

```typescript
export interface Product {
  id: string;
  name: string;
  category: string;
  skin_type: string;
  product_level: string;
}

export interface ProductIngredient {
  product_id: string;
  ingredient_id: string;
  percentage: string;
  phase: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  function: string | null;
  scientific_name: string | null;
  type: string | null;
}

export interface ProductWithIngredients extends Product {
  ingredients: Ingredient[];
}

export interface QuizAnswers {
  [questionId: number]: string | string[] | number | Record<string, number>;
}

export type SkinType = "oily" | "dry" | "combination" | "sensitive";

export type Concern =
  | "acne"
  | "hyperpigmentation"
  | "brightening"
  | "anti-aging"
  | "anti-aging-gentle"
  | "calming"
  | "hydration"
  | "repair"
  | "oil-control"
  | "antioxidant";

export interface ScoredProduct {
  product: ProductWithIngredients;
  score: number;
  matchedConcerns: Concern[];
  reasons: string[];
}

export interface Recommendation {
  serum: ScoredProduct | null;
  skinType: SkinType;
  concerns: Concern[];
  hasGap: boolean;
  gapMessage?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/lib/matching-engine/types.ts
git commit -m "feat: add matching engine type definitions"
```

---

### Task 3: Build ingredient-to-concern mapping

**Files:**
- Create: `app/src/lib/matching-engine/ingredient-map.ts`

This is the core knowledge layer. It maps ingredient names (as they exist in the DB) to the concerns they address. The engine uses this to determine what each product treats.

- [ ] **Step 1: Write ingredient map**

```typescript
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
  "Cosphaderm® Tocopharin": {
    concerns: ["antioxidant"],
    isExcludable: false,
  },

  // Fragrance
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
```

- [ ] **Step 2: Commit**

```bash
git add app/src/lib/matching-engine/ingredient-map.ts
git commit -m "feat: add ingredient-to-concern mapping"
```

---

## Chunk 2: Filters + Scoring + Recommend

### Task 4: Build hard filters

**Files:**
- Create: `app/src/lib/matching-engine/filters.ts`

- [ ] **Step 1: Write filters**

```typescript
import type { ProductWithIngredients, QuizAnswers, SkinType } from "./types";
import { getProductExcludables } from "./ingredient-map";

export function normalizeSkinType(raw: string): SkinType {
  const lower = raw.toLowerCase().replace(" skin", "").trim();
  if (lower === "oily") return "oily";
  if (lower === "dry") return "dry";
  if (lower === "combination") return "combination";
  if (lower === "sensitive") return "sensitive";
  return "combination";
}

export function extractSkinType(answers: QuizAnswers): SkinType {
  const q11 = answers[11] as string | undefined;
  if (!q11) return "combination";
  return normalizeSkinType(q11);
}

export function extractExclusions(answers: QuizAnswers): string[] {
  const exclusions: string[] = [];

  // Q10: Pregnancy
  const q10 = answers[10] as string | undefined;
  if (q10 === "Yes") {
    exclusions.push("Retinol / retinoids");
  }

  // Q29: Ingredient exclusions (multi-select)
  const q29 = answers[29] as string[] | undefined;
  if (q29 && Array.isArray(q29)) {
    for (const item of q29) {
      if (!exclusions.includes(item)) {
        exclusions.push(item);
      }
    }
  }

  return exclusions;
}

export function filterProducts(
  products: ProductWithIngredients[],
  skinType: SkinType,
  exclusions: string[]
): ProductWithIngredients[] {
  return products.filter((product) => {
    // Must be End Product
    if (product.product_level !== "End Product") return false;

    // Must be Serum
    if (product.category !== "Serum") return false;

    // Must match skin type
    if (normalizeSkinType(product.skin_type) !== skinType) return false;

    // Must not contain excluded ingredients
    if (exclusions.length > 0) {
      const ingredientNames = product.ingredients.map((i) => i.name);
      const productExcludables = getProductExcludables(ingredientNames);
      for (const exclusion of exclusions) {
        if (productExcludables.includes(exclusion)) return false;
      }
    }

    return true;
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/lib/matching-engine/filters.ts
git commit -m "feat: add hard filters for matching engine"
```

---

### Task 5: Build scoring logic

**Files:**
- Create: `app/src/lib/matching-engine/scoring.ts`

- [ ] **Step 1: Write scoring**

```typescript
import type {
  ProductWithIngredients,
  QuizAnswers,
  Concern,
  ScoredProduct,
} from "./types";
import { getProductConcerns } from "./ingredient-map";

const QUIZ_CONCERN_MAP: Record<string, Concern> = {
  "Breakouts & blemishes": "acne",
  "Post-acne dark spots / hyperpigmentation": "hyperpigmentation",
  "Dullness & uneven tone": "brightening",
  "Fine lines & wrinkles": "anti-aging",
  "Loss of firmness / elasticity": "anti-aging",
  "Redness & visible irritation": "calming",
  "Dryness / flakiness": "hydration",
  "Dehydration (skin feels tight)": "hydration",
  "Enlarged pores": "oil-control",
  "Excess oil / shine": "oil-control",
  "Rough or bumpy texture": "repair",
  "Dark circles / under-eye concerns": "brightening",
};

const PRIORITY_CONCERN_MAP: Record<string, Concern> = {
  "Anti-aging (wrinkles, firmness, elasticity)": "anti-aging",
  "Brightening (even tone, radiance)": "brightening",
  "Hydration (plump, dewy, moisturised)": "hydration",
  "Calming (reduce redness, soothe irritation)": "calming",
  "Clarifying (control oil, minimise breakouts)": "acne",
  "Repair (strengthen barrier, heal damage)": "repair",
};

export function extractConcerns(answers: QuizAnswers): Concern[] {
  const concerns = new Set<Concern>();

  // Q12: Skin concerns (multi-select)
  const q12 = answers[12] as string[] | undefined;
  if (q12 && Array.isArray(q12)) {
    for (const item of q12) {
      const concern = QUIZ_CONCERN_MAP[item];
      if (concern) concerns.add(concern);
    }
  }

  return Array.from(concerns);
}

export function extractPriorityRanking(answers: QuizAnswers): Concern[] {
  // Q24: Drag-rank priority (array of strings in order)
  const q24 = answers[24] as string[] | undefined;
  if (!q24 || !Array.isArray(q24)) return [];

  const ranked: Concern[] = [];
  for (const item of q24) {
    const concern = PRIORITY_CONCERN_MAP[item];
    if (concern) ranked.push(concern);
  }
  return ranked;
}

export function scoreProduct(
  product: ProductWithIngredients,
  concerns: Concern[],
  priorityRanking: Concern[]
): ScoredProduct {
  const ingredientNames = product.ingredients.map((i) => i.name);
  const productConcerns = getProductConcerns(ingredientNames);

  let score = 0;
  const matchedConcerns: Concern[] = [];
  const reasons: string[] = [];

  // Score concern overlap
  for (const concern of concerns) {
    if (productConcerns.includes(concern)) {
      // Check priority ranking for multiplier
      const rankIndex = priorityRanking.indexOf(concern);
      let multiplier = 1;
      if (rankIndex === 0) multiplier = 3;
      else if (rankIndex === 1) multiplier = 2;
      else if (rankIndex === 2) multiplier = 1.5;

      score += 10 * multiplier;
      matchedConcerns.push(concern);
    }
  }

  // Generate reasons
  if (matchedConcerns.length > 0) {
    const concernLabels = matchedConcerns.map(formatConcern);
    reasons.push(`Targets your concerns: ${concernLabels.join(", ")}`);
  }

  // Bonus for matching top priority
  if (priorityRanking.length > 0 && productConcerns.includes(priorityRanking[0])) {
    reasons.push(`Directly addresses your #1 priority`);
  }

  // Bonus for number of active ingredients
  const activeCount = product.ingredients.filter(
    (i) => i.function?.includes("Active") || i.function?.includes("Phase-Shot")
  ).length;
  score += activeCount * 2;

  return { product, score, matchedConcerns, reasons };
}

function formatConcern(concern: Concern): string {
  const labels: Record<Concern, string> = {
    acne: "breakouts & blemishes",
    hyperpigmentation: "dark spots",
    brightening: "dullness & uneven tone",
    "anti-aging": "fine lines & wrinkles",
    "anti-aging-gentle": "gentle anti-aging",
    calming: "redness & sensitivity",
    hydration: "hydration",
    repair: "barrier repair",
    "oil-control": "oil control",
    antioxidant: "antioxidant protection",
  };
  return labels[concern] || concern;
}

export function rankProducts(
  products: ProductWithIngredients[],
  answers: QuizAnswers
): ScoredProduct[] {
  const concerns = extractConcerns(answers);
  const priorityRanking = extractPriorityRanking(answers);

  return products
    .map((p) => scoreProduct(p, concerns, priorityRanking))
    .sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/lib/matching-engine/scoring.ts
git commit -m "feat: add scoring logic for matching engine"
```

---

### Task 6: Build main recommend function

**Files:**
- Create: `app/src/lib/matching-engine/recommend.ts`

- [ ] **Step 1: Write recommend orchestrator**

```typescript
import { supabase } from "@/lib/supabase";
import type {
  QuizAnswers,
  ProductWithIngredients,
  Recommendation,
  Product,
  Ingredient,
} from "./types";
import { extractSkinType, extractExclusions, filterProducts } from "./filters";
import { extractConcerns, rankProducts } from "./scoring";

async function fetchSerumProducts(): Promise<ProductWithIngredients[]> {
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, name, category, skin_type, product_level")
    .eq("category", "Serum")
    .eq("product_level", "End Product");

  if (prodError || !products) return [];

  const productIds = products.map((p: Product) => p.id);

  const { data: piRows, error: piError } = await supabase
    .from("product_ingredients")
    .select("product_id, ingredient_id")
    .in("product_id", productIds);

  if (piError || !piRows) return products.map((p: Product) => ({ ...p, ingredients: [] }));

  const ingredientIds = [...new Set(piRows.map((r: { ingredient_id: string }) => r.ingredient_id))];

  const { data: ingredients, error: ingError } = await supabase
    .from("ingredients")
    .select("id, name, function, scientific_name, type")
    .in("id", ingredientIds);

  if (ingError || !ingredients) return products.map((p: Product) => ({ ...p, ingredients: [] }));

  const ingredientMap = new Map<string, Ingredient>();
  for (const ing of ingredients) {
    ingredientMap.set(ing.id, ing);
  }

  return products.map((product: Product) => {
    const productIngredientIds = piRows
      .filter((r: { product_id: string }) => r.product_id === product.id)
      .map((r: { ingredient_id: string }) => r.ingredient_id);

    const productIngredients: Ingredient[] = [];
    for (const id of productIngredientIds) {
      const ing = ingredientMap.get(id);
      if (ing) productIngredients.push(ing);
    }

    return { ...product, ingredients: productIngredients };
  });
}

export async function recommend(answers: QuizAnswers): Promise<Recommendation> {
  const skinType = extractSkinType(answers);
  const exclusions = extractExclusions(answers);
  const concerns = extractConcerns(answers);

  const allProducts = await fetchSerumProducts();
  const candidates = filterProducts(allProducts, skinType, exclusions);

  // Scenario 1: No matches — gap
  if (candidates.length === 0) {
    return {
      serum: null,
      skinType,
      concerns,
      hasGap: true,
      gapMessage: `We don't yet have a serum that matches your ${skinType} skin profile with your current exclusions. We're expanding our range — check back soon.`,
    };
  }

  // Scenario 2: One match — done
  if (candidates.length === 1) {
    const scored = rankProducts(candidates, answers);
    return {
      serum: scored[0],
      skinType,
      concerns,
      hasGap: false,
    };
  }

  // Scenario 3: Multiple matches — score and pick best
  const ranked = rankProducts(candidates, answers);
  return {
    serum: ranked[0],
    skinType,
    concerns,
    hasGap: false,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/lib/matching-engine/recommend.ts
git commit -m "feat: add recommendation orchestrator"
```

---

## Chunk 3: API Route + Results Page + Quiz Integration

### Task 7: Create API route

**Files:**
- Create: `app/src/app/api/recommend/route.ts`

- [ ] **Step 1: Write API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { recommend } from "@/lib/matching-engine/recommend";
import type { QuizAnswers } from "@/lib/matching-engine/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: QuizAnswers = body.answers;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Missing quiz answers" },
        { status: 400 }
      );
    }

    const result = await recommend(answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/app/api/recommend/route.ts
git commit -m "feat: add /api/recommend endpoint"
```

---

### Task 8: Build Results page

**Files:**
- Create: `app/src/components/results/SerumCard.tsx`
- Create: `app/src/app/results/page.tsx`

- [ ] **Step 1: Write SerumCard component**

```typescript
import type { ScoredProduct } from "@/lib/matching-engine/types";

interface SerumCardProps {
  result: ScoredProduct;
}

export default function SerumCard({ result }: SerumCardProps) {
  const { product, reasons } = result;
  const hasFragrance = product.ingredients.some((i) => i.name === "Parfum");

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
        <span className="results-card-label">Why This Is For You</span>
        <ul>
          {reasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>

      {hasFragrance && (
        <p className="results-card-fragrance">Contains fragrance</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write Results page**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recommendation } from "@/lib/matching-engine/types";
import SerumCard from "@/components/results/SerumCard";

export default function ResultsPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      const stored = sessionStorage.getItem("quizAnswers");
      if (!stored) {
        router.push("/quiz");
        return;
      }

      try {
        const answers = JSON.parse(stored);
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) throw new Error("Failed to get recommendation");

        const data: Recommendation = await res.json();
        setRecommendation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <h2>Analysing your skin profile...</h2>
          <p>Finding your perfect match</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="results-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/quiz")} className="results-btn">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const skinTypeLabel = recommendation.skinType.charAt(0).toUpperCase() + recommendation.skinType.slice(1);

  return (
    <div className="results-container">
      <div className="results-header">
        <span className="results-label">Your Personalised Recommendation</span>
        <h1 className="results-title">Your Serum Match</h1>
        <p className="results-subtitle">
          Based on your {skinTypeLabel} skin profile
          {recommendation.concerns.length > 0 &&
            ` and ${recommendation.concerns.length} identified concerns`}
        </p>
      </div>

      {recommendation.hasGap ? (
        <div className="results-gap">
          <p>{recommendation.gapMessage}</p>
          <button onClick={() => router.push("/")} className="results-btn">
            Return Home
          </button>
        </div>
      ) : recommendation.serum ? (
        <div className="results-grid">
          <SerumCard result={recommendation.serum} />
        </div>
      ) : null}

      <div className="results-actions">
        <button onClick={() => router.push("/quiz")} className="results-btn-secondary">
          Retake Quiz
        </button>
        <button onClick={() => router.push("/")} className="results-btn">
          Return Home
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/results/SerumCard.tsx app/src/app/results/page.tsx
git commit -m "feat: add results page with serum card"
```

---

### Task 9: Add results page styles to globals.css

**Files:**
- Modify: `app/src/app/globals.css`

- [ ] **Step 1: Add results styles**

Append to `globals.css` (follow the existing `.quiz-*` prefix pattern):

```css
/* Results Page */
.results-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1.5rem;
  background: var(--background);
}

.results-loading,
.results-error,
.results-gap {
  text-align: center;
  max-width: 480px;
}

.results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.results-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.6;
}

.results-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-top: 0.5rem;
}

.results-subtitle {
  font-size: 1rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.results-grid {
  display: grid;
  gap: 2rem;
  max-width: 420px;
  width: 100%;
}

.results-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.results-card-category {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.5;
}

.results-card-name {
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 0.25rem;
}

.results-card-skin {
  font-size: 0.85rem;
  opacity: 0.6;
  margin-top: 0.25rem;
}

.results-card-actives,
.results-card-reasons {
  margin-top: 1.5rem;
}

.results-card-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.5;
}

.results-card-actives ul,
.results-card-reasons ul {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}

.results-card-actives li,
.results-card-reasons li {
  font-size: 0.9rem;
  padding: 0.25rem 0;
  opacity: 0.85;
}

.results-card-fragrance {
  font-size: 0.8rem;
  opacity: 0.4;
  margin-top: 1rem;
}

.results-actions {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
}

.results-btn {
  padding: 0.75rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.results-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.results-btn-secondary {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.results-btn-secondary:hover {
  opacity: 1;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/app/globals.css
git commit -m "feat: add results page styles"
```

---

### Task 10: Connect quiz completion to results page

**Files:**
- Modify: `app/src/components/quiz/Quiz.tsx`

- [ ] **Step 1: Change quiz completion to redirect to /results**

In `Quiz.tsx`, find the `renderComplete()` function (around line 313) and change the "Return Home" button to navigate to `/results`:

Replace:
```typescript
function renderComplete() {
    return (
      <div className="quiz-complete">
        <span className="quiz-complete-label">Consultation Complete</span>
        <h2 className="quiz-complete-title">Thank You</h2>
        <p className="quiz-complete-desc">
          We have everything we need to craft your personalised formulas. Your
          skincare profile is being put together now.
        </p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={handleClose}
        >
          Return Home
        </button>
      </div>
    );
  }
```

With:
```typescript
function renderComplete() {
    return (
      <div className="quiz-complete">
        <span className="quiz-complete-label">Consultation Complete</span>
        <h2 className="quiz-complete-title">Thank You</h2>
        <p className="quiz-complete-desc">
          We have everything we need to craft your personalised formulas. Your
          skincare profile is being put together now.
        </p>
        <button
          type="button"
          className="quiz-cta-btn"
          onClick={() => router.push("/results")}
        >
          See Your Results
        </button>
      </div>
    );
  }
```

- [ ] **Step 2: Verify build**

```bash
cd app && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/quiz/Quiz.tsx
git commit -m "feat: connect quiz completion to results page"
```

---

### Task 11: Normalize skin_type values in Supabase

**Files:**
- Create: `normalize-skin-types.sql`

The database has inconsistent values: "Dry Skin" vs "Dry", "Oily Skin" vs "Oily". The engine handles this with `normalizeSkinType()`, but we should also fix the source data.

- [ ] **Step 1: Write normalization SQL**

```sql
UPDATE products SET skin_type = 'Oily Skin' WHERE skin_type = 'Oily';
UPDATE products SET skin_type = 'Dry Skin' WHERE skin_type = 'Dry';
```

- [ ] **Step 2: Run in Supabase SQL Editor**

Run the SQL above in the new Supabase project's SQL editor.

- [ ] **Step 3: Commit SQL file**

```bash
git add normalize-skin-types.sql
git commit -m "fix: normalize skin_type values in products table"
```

---

### Task 12: End-to-end test

- [ ] **Step 1: Start dev server**

```bash
cd app && npm run dev
```

- [ ] **Step 2: Complete quiz with oily skin + breakout concern**

Navigate to `http://localhost:3000/quiz`. Answer:
- Q11: Oily
- Q12: Select "Breakouts & blemishes"
- Q24: Rank "Clarifying" as #1
- Q29: Select nothing (no exclusions)
- Complete remaining questions with any values

- [ ] **Step 3: Verify results page**

After quiz completion, should redirect to `/results` and show **SO1** as the recommended serum (it contains Salicylic Acid + Zinc PCA which target acne/oil-control).

- [ ] **Step 4: Test exclusion — retake with fragrance exclusion**

Retake quiz with same answers but Q29: select "Fragrance / essential oils". SO1 contains Parfum, so it should be excluded. Engine should recommend a different serum or show gap message.

- [ ] **Step 5: Test dry skin path**

Retake quiz with Q11: Dry, Q12: "Fine lines & wrinkles", Q24: "Anti-aging" as #1. Should recommend SD4 (contains Matrixyl 3000 + Retinol Liposome).

---
