# Matching Engine V1 — Complete Flow
**Every step, every decision, every fallback**

---

## Overview

```
Customer completes quiz (30 questions)
         |
         v
Quiz answers saved to browser (sessionStorage)
         |
         v
Results page loads → calls POST /api/recommend
         |
         v
Matching Engine runs:
   1. Fetch all serums + their ingredients from Supabase
   2. GATE 1 — Filter by skin type
   3. GATE 2 — Remove unsafe products
   4. Check: how many products remain?
      |-- 0 remaining → return GAP message
      |-- 1 or more → GATE 3 — Score and pick best
   5. Return winner + reasons
         |
         v
Results page shows recommended serum + fragrance selector
```

---

## Step 0: Fetch Products from Database

**File:** `recommend.ts` → `fetchSerumProducts()`

**What happens:**
1. Query `products` table for all rows where `category = "Serum"` AND `product_level = "End Product"`
   - Also fetches `concern_tags` column (if filled in by Kyrill)
2. Query `product_ingredients` table to get which ingredients belong to each product
3. Query `ingredients` table to get ingredient names and functions
4. Queries 2 and 3 run **in parallel** (not sequentially) for speed
5. Combine: each product now has its full ingredient list attached

**Fallback:** If the ingredient queries fail, products are returned with empty ingredient lists. The engine still works using concern tags if they exist.

**Current data:** 11 serums in production DB (5 oily, 7 dry, 0 combination, 0 sensitive). Test DB has 85 products.

---

## Step 1: GATE 1 — Skin Type Filter

**File:** `filters.ts` → `extractSkinType()` + `filterProducts()`

**Input:** Q11 — "How would you describe your skin type?"

**Quiz options (exact strings):**
- `"Oily: shiny all over, especially T-zone"`
- `"Dry: tight, flaky, sometimes rough"`
- `"Combination: oily T-zone, dry cheeks"`
- `"Sensitive: easily irritated, reactive to new products"`

**How it works:**
1. Read Q11 answer from quiz
2. Split on `":"` to get the first word (e.g., `"Oily: shiny all over..."` → `"Oily"`)
3. Lowercase and strip `" skin"` suffix → `"oily"`
4. Filter products: only keep products where `products.skin_type` normalized = customer's skin type

**Normalization function (`normalizeSkinType`):**
- `"Oily Skin"` → `"oily"`
- `"Oily"` → `"oily"`
- `"Dry Skin"` → `"dry"`
- `"Dry"` → `"dry"`
- Anything unrecognized → defaults to `"combination"`

**Also filters:**
- `product_level` must be `"End Product"` (removes base formulas)
- `category` must be `"Serum"`

**Fallback:** If Q11 is not answered, defaults to `"combination"`.

**Result:** Only serums matching the customer's skin type remain.

---

## Step 2: GATE 2 — Safety Exclusions

**File:** `filters.ts` → `extractExclusions()` + `filterProducts()`

**Inputs:**
- Q10 — "Are you currently pregnant or breastfeeding?" (Yes/No)
- Q16 — "Do you experience any of the following?" (multi-select conditions)
- Q29 — "Is there anything you'd like to avoid in your products?" (multi-select ingredients)

### Exclusion Rules

**From Q10 (Pregnancy):**
| Answer | Exclusion added |
|---|---|
| `"Yes"` | `"Retinol / retinoids"` |
| `"No"` | Nothing |

**From Q16 (Conditions):**
| Condition selected | Exclusion added |
|---|---|
| `"Rosacea or redness-prone skin"` | `"Exfoliating acids (AHA, BHA)"` |
| `"Eczema or atopic dermatitis"` | `"Fragrance / essential oils"` |
| `"Psoriasis"` | Nothing (no exclusion rule yet) |
| `"Hormonal acne (jawline, chin)"` | Nothing |
| `"Melasma or post-inflammatory hyperpigmentation"` | Nothing |
| `"Contact allergies to cosmetic ingredients"` | Nothing |
| `"None of the above"` | Nothing |

**From Q29 (Customer exclusions):**
| Option selected | Exclusion added |
|---|---|
| `"Retinol / retinoids"` | `"Retinol / retinoids"` |
| `"Exfoliating acids (AHA, BHA)"` | `"Exfoliating acids (AHA, BHA)"` |
| `"Silicones"` | `"Silicones"` |
| `"PEGs"` | `"PEGs"` |
| `"Alcohol (denat.)"` | `"Alcohol (denat.)"` |
| `"Fragrance / essential oils"` | **SKIPPED** — fragrance is now a customer choice (F0/F1/F2), not a hard exclusion |
| `"Nothing specific, I'm open to everything"` | Nothing |

### How Products Are Checked Against Exclusions

**File:** `ingredient-map.ts` → `getProductExcludables()`

For each remaining product, the engine reads its ingredient list and checks which ingredients are "excludable":

| Ingredient | Excludable? | Exclusion label |
|---|---|---|
| Salicylic Acid | Yes | `"Exfoliating acids (AHA, BHA)"` |
| Retinol Liposome OS | Yes | `"Retinol / retinoids"` |
| Retinol in Phytosqualane | Yes | `"Retinol / retinoids"` |
| SymRenew HPR | Yes | `"Retinol / retinoids"` |
| Parfum | Yes | `"Fragrance / essential oils"` |
| All other ingredients | No | — |

**Matching logic:** If a product contains an excludable ingredient AND that ingredient's exclusion label is in the customer's exclusion list → **product is removed**.

**Example:**
- Customer is pregnant → exclusion list = `["Retinol / retinoids"]`
- SO4 has Retinol Liposome OS → excludable with label `"Retinol / retinoids"` → **match → SO4 removed**
- SO1 has Salicylic Acid → excludable with label `"Exfoliating acids (AHA, BHA)"` → label not in customer's list → **SO1 stays**

---

## Step 3: Decision Point — How Many Products Remain?

**File:** `recommend.ts` → `recommend()`

### Outcome A: 0 products remain → GAP

```
Return:
  serum: null
  hasGap: true
  gapMessage: "We don't yet have a serum for your {skinType} skin
               with those specific exclusions. New formulations are
               in development, so check back soon."
```

This happens when:
- Customer has combination or sensitive skin (no products in DB yet)
- Customer has oily skin + eczema (all oily serums have fragrance)
- Too many exclusions eliminate all candidates

### Outcome B: 1 or more products remain → Go to GATE 3

All remaining products go through scoring.

---

## Step 4: GATE 3 — Scoring (Pick the Best Product)

**File:** `scoring.ts` → `rankProducts()` → `scoreProduct()`

### Step 4A: Extract Customer Concerns from Q12

**Input:** Q12 — "What are your biggest skin concerns right now?" (multi-select)

Each Q12 option maps to an internal concern code:

| Q12 Option (exact string) | Internal Code |
|---|---|
| `"Breakouts or blemishes"` | `acne` |
| `"Dryness or dehydration"` | `hydration` |
| `"Oiliness or excess shine"` | `oil-control` |
| `"Fine lines or wrinkles"` | `anti-aging` |
| `"Lack of firmness"` | `anti-aging` |
| `"Uneven skin tone or dark spots"` | `hyperpigmentation` |
| `"Enlarged pores"` | `oil-control` |
| `"Redness or irritation"` | `calming` |
| `"Dullness or tired-looking skin"` | `brightening` |
| `"Sensitivity or reactivity"` | `calming` |
| `"Under-eye concerns (dark circles, puffiness)"` | `brightening` |
| `"Texture irregularities"` | `repair` |

**Note:** Multiple Q12 options can map to the same code. E.g., both "Fine lines or wrinkles" and "Lack of firmness" → `anti-aging`.

### Step 4B: Extract Priority Ranking from Q24

**Input:** Q24 — "Rank these skincare priorities from most to least important." (drag-rank)

Each Q24 option maps to a concern code:

| Q24 Option (exact string) | Internal Code |
|---|---|
| `"Anti-aging (wrinkles, firmness, elasticity)"` | `anti-aging` |
| `"Brightening (even tone, radiance)"` | `brightening` |
| `"Hydration (plump, dewy, moisturised)"` | `hydration` |
| `"Calming (reduce redness, soothe irritation)"` | `calming` |
| `"Clarifying (control oil, minimise breakouts)"` | `acne` |
| `"Repair (strengthen barrier, heal damage)"` | `repair` |

The order the customer ranks them determines the multiplier:

| Position | Multiplier |
|---|---|
| #1 (top) | **3x** |
| #2 | **2x** |
| #3 | **1.5x** |
| #4 | 1x |
| #5 | 1x |
| #6 | 1x |

### Step 4C: Determine What Each Product Treats (Layer 2)

**For each remaining product, the engine needs to know what concerns it addresses.**

**Two sources (checked in this order):**

#### Source 1: Concern Tags (from ERP)

If the product has `concern_tags` filled in (array of strings in the database), use those.

Example: Product SO1 has `concern_tags = ["Breakouts or blemishes", "Oiliness or excess shine"]`

These strings are mapped to internal codes using the same table as Q12:
- `"Breakouts or blemishes"` → `acne`
- `"Oiliness or excess shine"` → `oil-control`

**This is the preferred source.** Kyrill fills these in through the ERP product form.

#### Source 2: Ingredient Map (fallback)

If `concern_tags` is empty or null, the engine looks at the product's ingredients and uses the hardcoded ingredient map to determine concerns.

**The ingredient map (`ingredient-map.ts`):**

| Ingredient Name | Concerns | Also Excludable? |
|---|---|---|
| Salicylic Acid | `acne`, `oil-control` | Yes → "Exfoliating acids (AHA, BHA)" |
| Zinc PCA | `acne`, `oil-control` | No |
| Tranexamic Acid | `hyperpigmentation`, `brightening` | No |
| Azeloglycine | `brightening` | No |
| Niacinamide | `brightening`, `oil-control` | No |
| Vitamin C | `brightening`, `antioxidant` | No |
| Retinol Liposome OS | `anti-aging` | Yes → "Retinol / retinoids" |
| Retinol in Phytosqualane | `anti-aging` | Yes → "Retinol / retinoids" |
| SymRenew HPR | `anti-aging` | Yes → "Retinol / retinoids" |
| Matrixyl 3000 | `anti-aging` | No |
| SepiliftTM DPHP | `anti-aging` | No |
| Bakuchiol | `anti-aging-gentle`, `calming` | No |
| Bisabolol | `calming` | No |
| Ectoin | `calming` | No |
| Centella Asiatica Extract GW | `calming`, `repair` | No |
| 4D MB Hyaluronic acid | `hydration` | No |
| AquaxylTM | `hydration` | No |
| Panthenol | `hydration`, `repair` | No |
| Betaglucano sol. | `repair` | No |
| Stabilized Coenzyme Q10 | `antioxidant`, `anti-aging` | No |
| Cosphaderm Tocopharin | `antioxidant` | No |
| Parfum | (none) | Yes → "Fragrance / essential oils" |

**Only ingredients in this map are recognized.** If a product has an ingredient not in this list (e.g., "Water (Aqua)"), it's ignored for concern matching.

### Step 4D: Calculate Score

**For each product:**

```
score = 0

For each customer concern (from Q12):
    If product addresses this concern:
        Find this concern's position in Q24 ranking
        If #1 → multiplier = 3
        If #2 → multiplier = 2
        If #3 → multiplier = 1.5
        Otherwise → multiplier = 1

        score += 10 × multiplier
        Add to matchedConcerns list

Bonus: count active ingredients (function contains "Active" or "Phase-Shot")
score += activeCount × 2
```

### Step 4E: Generate Reasons

```
If matchedConcerns is not empty:
    reasons += "Formulated for {concern labels joined by comma}"

If product matches the customer's #1 priority from Q24:
    reasons += "Matched to your top priority"
```

**Concern labels for display:**

| Internal Code | Display Label |
|---|---|
| `acne` | "breakouts & blemishes" |
| `hyperpigmentation` | "dark spots" |
| `brightening` | "dullness & uneven tone" |
| `anti-aging` | "fine lines & wrinkles" |
| `anti-aging-gentle` | "gentle anti-aging" |
| `calming` | "redness & sensitivity" |
| `hydration` | "hydration" |
| `repair` | "barrier repair" |
| `oil-control` | "oil control" |
| `antioxidant` | "antioxidant protection" |

### Step 4F: Sort and Pick Winner

All products sorted by score descending. **Highest score wins.**

If two products have the exact same score, the one with more active ingredients wins (because of the `activeCount × 2` bonus).

If still tied, the first one in database query order wins.

---

## Step 5: Return Result

**File:** `recommend.ts` → `recommend()`

The engine returns:

```
{
  serum: {
    product: { id, name, category, skin_type, product_level, concern_tags, ingredients[] },
    score: number,
    matchedConcerns: ["acne", "oil-control"],
    reasons: ["Formulated for breakouts & blemishes, oil control", "Matched to your top priority"]
  },
  skinType: "oily",
  concerns: ["acne", "oil-control"],
  hasGap: false
}
```

Or if gap:

```
{
  serum: null,
  skinType: "combination",
  concerns: ["acne"],
  hasGap: true,
  gapMessage: "We don't yet have a serum for your combination skin..."
}
```

---

## Step 6: Results Page

**File:** `app/results/page.tsx`

1. Reads quiz answers from `sessionStorage`
2. Sends POST to `/api/recommend` with the answers
3. Displays:
   - Skin type label
   - Number of concerns identified
   - Product name
   - Key active ingredients list
   - "Why we picked this" reasons
   - Fragrance selector (F0 / F1 / F2)

### Fragrance Default Logic

**File:** `results/page.tsx` → `getDefaultFragrance()`

| Condition | Default |
|---|---|
| Q25 includes `"Fragrance-free"` | F0 (no fragrance) |
| Q29 includes `"Fragrance / essential oils"` | F0 (no fragrance) |
| Neither selected | F1 (light botanical) |

Customer can always change the fragrance selection on the results page regardless of the default.

---

## All Internal Concern Codes

These are the internal codes used throughout the engine. They are never shown to customers.

| Code | Used by Q12 mapping | Used by Q24 mapping | Used by ingredient map | Used by concern tag map |
|---|---|---|---|---|
| `acne` | Yes | Yes (Clarifying) | Yes | Yes |
| `hydration` | Yes | Yes | Yes | Yes |
| `oil-control` | Yes | No | Yes | Yes |
| `anti-aging` | Yes | Yes | Yes | Yes |
| `anti-aging-gentle` | No | No | Yes (Bakuchiol only) | No |
| `hyperpigmentation` | Yes | No | Yes | Yes |
| `calming` | Yes | Yes | Yes | Yes |
| `brightening` | Yes | Yes | Yes | Yes |
| `repair` | Yes | Yes | Yes | Yes |
| `antioxidant` | No | No | Yes | No |

**Known issue:** `anti-aging-gentle` is only produced by the ingredient map (Bakuchiol) but never matched by Q12 or concern tags. This means Bakuchiol products won't match "Fine lines or wrinkles" concern through the ingredient fallback path — they need concern tags to be recognized as anti-aging.

---

## Questions NOT Used by the Engine (V1)

| Question | What it asks | Why not used |
|---|---|---|
| Q1 | Age | Future: age-adjusted formulas |
| Q2 | Biological sex | Filtered out of quiz flow |
| Q3 | Region | Future: climate-adjusted |
| Q4 | Environment | Future: urban/rural |
| Q5 | Water intake | Future: lifestyle modifier |
| Q6 | Sleep | Future: lifestyle modifier |
| Q7 | Stress | Future: lifestyle modifier |
| Q8 | Diet | Future: lifestyle modifier |
| Q9 | Sun exposure | Future: UV-repair focus |
| Q13 | Sun sensitivity | Future |
| Q14 | Post-cleanse feel | Future: skin type validation |
| Q15 | Breakout frequency | Future: severity grading |
| Q17 | Pore visibility | Future |
| Q18 | Skin tone | Future |
| Q19 | Current skin state | Future |
| Q20 | Allergic reactions | Future: allergen exclusion |
| Q21 | Routine complexity | Future: product count |
| Q22 | Moisturizer texture | Future: moisturizer matching |
| Q23 | Cleanser type | Future: cleanser matching |
| Q25 | Ingredient philosophy | Only fragrance-free default |
| Q26 | Ingredient adventurousness | Future |
| Q27 | Retinol experience | Future: retinol strength |
| Q28 | Routine time | Future: product count |
| Q30 | Free text | Not processed in V1 |

---

## File Map

| File | What it does |
|---|---|
| `app/src/lib/supabase.ts` | Creates Supabase client connection |
| `app/src/lib/matching-engine/types.ts` | All type definitions (Product, Ingredient, Concern, ScoredProduct, Recommendation) |
| `app/src/lib/matching-engine/ingredient-map.ts` | Layer 2 — maps ingredient names to concerns + excludability |
| `app/src/lib/matching-engine/filters.ts` | Gate 1 (skin type) + Gate 2 (safety exclusions) |
| `app/src/lib/matching-engine/scoring.ts` | Gate 3 — concern mapping, priority multipliers, scoring |
| `app/src/lib/matching-engine/recommend.ts` | Orchestrator — fetches data, runs gates, returns result |
| `app/src/app/api/recommend/route.ts` | API endpoint — receives quiz answers, calls recommend(), returns JSON |
| `app/src/app/results/page.tsx` | Results page — calls API, shows product + fragrance selector |
| `app/src/components/results/SerumCard.tsx` | Product card component with ingredients and reasons |
