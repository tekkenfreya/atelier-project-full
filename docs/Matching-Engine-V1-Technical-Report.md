# Matching Engine V1 — Technical Report
**Atelier Rusalka / Kyrill Skincare**
**March 2026**

---

## Slide 1: Title

**Matching Engine V1 — How It Works**
Atelier Rusalka Consultation Quiz to Product Recommendation
March 2026

---

## Slide 2: What We Built

A product recommendation engine that connects the 30-question consultation quiz to personalised serum recommendations.

- Customer completes the quiz
- Engine analyses answers in real time
- Returns the best-matched serum with personalised reasons
- No AI, no randomness — fully deterministic logic
- Same answers always produce the same recommendation

**V1 Scope:** Serums only (11 products across Oily and Dry skin types)

---

## Slide 3: System Architecture

```
Customer → Quiz (30 Questions) → Quiz Answers saved to browser
                                         ↓
                                  Results Page loads
                                         ↓
                                  POST /api/recommend
                                         ↓
                              ┌─────────────────────┐
                              │   MATCHING ENGINE    │
                              │                      │
                              │  1. Fetch products   │
                              │     from Supabase    │
                              │                      │
                              │  2. Hard filter:     │
                              │     Skin type        │
                              │                      │
                              │  3. Hard filter:     │
                              │     Safety           │
                              │     exclusions       │
                              │                      │
                              │  4. Score remaining  │
                              │     candidates       │
                              │                      │
                              │  5. Return best      │
                              │     match            │
                              └──────────┬───────────┘
                                         ↓
                              Results Page displays
                              recommended serum
```

**Three systems connected:**
- Supabase Database (shared with Recip3 ERP)
- Next.js E-commerce App (quiz + results)
- Recip3 ERP (where products and ingredients are managed)

---

## Slide 4: The Pipeline — Step by Step

### Step 1: Fetch Products from Database

The engine queries the Supabase database for all products where:
- Category = "Serum"
- Product Level = "End Product" (excludes base formulas)

For each product, it also fetches the full ingredient list from the `product_ingredients` and `ingredients` tables.

**Result:** 11 serums with their complete ingredient profiles loaded into memory.

---

## Slide 5: Step 2 — Skin Type Filter (Hard Filter)

**Input:** Q11 — "What is your skin type?"

The customer's skin type answer determines which products are eligible.

| Customer Answer | Products That Pass |
|---|---|
| Oily | SO1, SO2, SO3, SO4, SO5 (5 products) |
| Dry | SD2, SD3, SD4, SD09, SD10, SD12, LF SD12 (7 products) |
| Combination | (No products yet — future expansion) |
| Sensitive | (No products yet — future expansion) |

**This is a hard boundary.** An oily-skin customer will never receive a dry-skin serum, regardless of scoring.

This single filter eliminates approximately 50% of the product catalog immediately.

---

## Slide 6: Step 3 — Safety Exclusion Filter (Hard Filter)

**Inputs:** Q10 (Pregnancy), Q29 (Ingredient Exclusions)

The engine reads the actual ingredients of each remaining product and removes any that contain excluded substances.

| Exclusion Trigger | What Gets Removed | Why |
|---|---|---|
| Q10: Pregnant = Yes | Products containing Retinol (SO4, SD4, SD09) | Retinol is contraindicated during pregnancy |
| Q29: "Retinol / retinoids" | Products containing Retinol (SO4, SD4, SD09) | Customer preference |
| Q29: "Exfoliating acids (AHA, BHA)" | Products containing Salicylic Acid (SO1) | Customer preference |
| Q29: "Fragrance / essential oils" | Products containing Parfum (SO1-SO5, SD09) | Customer preference |

**This is ingredient-driven, not tag-based.** The engine checks what is actually in each product, not a manually applied label. This means:
- When a new product is added to the ERP with its ingredients, the exclusion logic automatically applies
- No manual safety tagging required
- Zero risk of a mislabelled product slipping through

---

## Slide 7: Step 4 — Scoring (Tiebreaker)

**When 2 or more products survive the filters, scoring determines the winner.**

**Inputs:**
- Q12: Skin concerns (multi-select) — e.g., "Breakouts or blemishes", "Oiliness or excess shine"
- Q24: Priority ranking (drag-and-rank) — customer's top skincare priorities

### How Scoring Works

**1. Map customer concerns to product capabilities**

Each quiz concern maps to an ingredient-derived tag:

| Quiz Concern (Q12) | Maps to Tag |
|---|---|
| Breakouts or blemishes | acne |
| Uneven skin tone or dark spots | hyperpigmentation |
| Dullness or tired-looking skin | brightening |
| Fine lines or wrinkles | anti-aging |
| Redness or irritation | calming |
| Dryness or dehydration | hydration |
| Oiliness or excess shine | oil-control |
| Texture irregularities | repair |

**2. Map product ingredients to capabilities**

The engine knows what each ingredient does:

| Ingredient | Capability |
|---|---|
| Salicylic Acid | acne, oil-control |
| Zinc PCA | acne, oil-control |
| Tranexamic Acid | hyperpigmentation, brightening |
| Azeloglycine | brightening |
| Niacinamide | brightening, oil-control |
| Retinol Liposome OS | anti-aging |
| Bakuchiol | anti-aging (gentle), calming |
| Ectoin | calming |
| 4D MB Hyaluronic Acid | hydration |
| AquaxylTM | hydration |
| Vitamin C | brightening, antioxidant |
| Betaglucano | repair |

**3. Apply priority multipliers from Q24**

| Priority Rank | Score Multiplier |
|---|---|
| #1 Priority | 3x |
| #2 Priority | 2x |
| #3 Priority | 1.5x |
| #4-6 | 1x |

**4. Calculate final score**

Score = Sum of (matched concerns × priority multiplier) + bonus for number of active ingredients

---

## Slide 8: Scoring Example

**Customer profile:**
- Skin type: Oily
- Concerns: Breakouts, Oiliness
- #1 Priority: Clarifying (oil control, breakouts)
- No exclusions

**After skin type filter:** SO1, SO2, SO3, SO4, SO5 remain

**Scoring:**

| Product | Key Actives | Matched Concerns | Priority Multiplier | Base Score | Active Bonus | Total |
|---|---|---|---|---|---|---|
| **SO1** | Salicylic Acid, Zinc PCA, Niacinamide | acne ✓, oil-control ✓ | 3x (Clarifying is #1) | 10×3 + 10×3 = 60 | +6 | **66** |
| SO2 | Tranexamic Acid, Niacinamide | brightening (partial) | 1x | 10 | +4 | **14** |
| SO3 | Azeloglycine, Niacinamide | brightening (partial) | 1x | 10 | +4 | **14** |
| SO4 | Retinol, HPR, Matrixyl | anti-aging (not selected) | — | 0 | +6 | **6** |
| SO5 | Bakuchiol, Bisabolol | calming (not selected) | — | 0 | +4 | **4** |

**Winner: SO1 with 66 points**

The engine recommends SO1 and explains: "Formulated for breakouts and blemishes, oil control. Matched to your top priority."

---

## Slide 9: Three Outcome Scenarios

### Scenario 1: Exact Match (1 product survives filters)
- Decision tree narrowed to exactly 1 product
- No scoring needed — return immediately
- Example: Dry skin + fragrance excluded + retinol excluded → SD2 or SD3

### Scenario 2: Multiple Matches (2+ products survive filters)
- Scoring picks the best match
- Winner determined by concern overlap × priority ranking
- Example: Oily skin + no exclusions → 5 candidates → SO1 wins on breakout concern

### Scenario 3: No Match (0 products survive filters)
- All products were excluded by safety filters
- Engine returns a gap message: "We don't yet have a serum for your skin with those specific exclusions. New formulations are in development, so check back soon."
- This also flags a gap in the product catalog for the team to address

---

## Slide 10: Product Coverage Map

### Current Serum Catalog (V1)

**Oily Skin (5 serums):**

| Product | Primary Concern | Key Actives | Contains Retinol | Contains Fragrance |
|---|---|---|---|---|
| SO1 | Acne, oil control | Salicylic Acid, Zinc PCA | No | Yes |
| SO2 | Hyperpigmentation | Tranexamic Acid, Niacinamide | No | Yes |
| SO3 | Brightening | Azeloglycine, Niacinamide | No | Yes |
| SO4 | Anti-aging (strong) | Retinol, HPR, Matrixyl 3000 | Yes | Yes |
| SO5 | Anti-aging (gentle), calming | Bakuchiol, Bisabolol, Centella | No | Yes |

**Dry Skin (7 serums):**

| Product | Primary Concern | Key Actives | Contains Retinol | Contains Fragrance |
|---|---|---|---|---|
| SD2 | Calming, sensitivity | Ectoin, Bisabolol | No | No |
| SD3 | Deep hydration | 4D Hyaluronic Acid, Aquaxyl | No | No |
| SD4 | Anti-aging (retinol + peptides) | Matrixyl 3000, Retinol Liposome | Yes | No |
| SD09 | Anti-aging (encapsulated retinol) | Retinol in Phytosqualane, Sepilift | Yes | Yes |
| SD10 | Brightening, antioxidant | Vitamin C, CoQ10 | No | No |
| SD12 | Repair, barrier support | Betaglucano, Panthenol | No | No |
| LF SD12 | Repair, barrier (lightweight) | Betaglucano, Panthenol, Chamomile | No | No |

---

## Slide 11: Why Ingredient-Driven (Not Manual Tagging)

Traditional approach: Someone manually tags each product with concerns like "good for acne", "good for wrinkles".

**Our approach: The engine reads the actual ingredients.**

| Approach | Manual Tagging | Ingredient-Driven (Ours) |
|---|---|---|
| Adding a new product | Must remember to tag it correctly | Add product + ingredients in ERP → engine automatically knows what it does |
| Risk of mislabelling | Human error — wrong tag = wrong recommendation | Impossible — the engine reads what's actually in the product |
| Scaling to 500+ products | Every product needs manual review | Automatic — ingredients are already entered during formulation |
| Exclusion accuracy | Could miss a dangerous ingredient | Checks actual ingredient list — no gaps |
| Maintenance burden | Tags must be updated when formulas change | Formula changes in ERP automatically reflect in recommendations |

---

## Slide 12: Modularity — What Happens When a New Product Is Added

### The Process

1. Kyrill's team creates a new serum in Recip3 ERP (e.g., "SO6")
2. They enter the ingredients (e.g., Azelaic Acid, Niacinamide, Panthenol)
3. They set skin type = "Oily Skin", category = "Serum", product level = "End Product"
4. **Done.** The matching engine will automatically:
   - Include SO6 in the candidate pool for oily-skin customers
   - Know it targets brightening (from Azelaic Acid + Niacinamide)
   - Apply safety exclusions based on its ingredients
   - Score it against other candidates

### What Needs Updating

If SO6 contains a **new ingredient** not yet in the ingredient map (e.g., Azelaic Acid), a developer adds one line to `ingredient-map.ts`:

```
"Azelaic Acid": { concerns: ["brightening", "acne"], isExcludable: false }
```

That is the only code change needed. No decision tree branches, no scoring logic changes, no UI updates.

---

## Slide 13: Scalability Path

| Phase | Products per Skin Type | Engine Changes Required |
|---|---|---|
| V1 (Now) | 5-7 serums | None — built |
| V2 | 12 serums | Add new ingredient mappings only |
| V3 | 24 serums | No changes — scoring handles larger pools |
| V4 | 100+ serums | No changes — filtering + scoring scales linearly |
| Future | 500+ serums | Consider caching product data for performance |

The engine handles any number of products because:
- Hard filters (skin type + exclusions) drastically reduce the pool before scoring
- Scoring is O(n) — proportional to number of candidates, not total products
- Adding products only requires database entries, not code changes

---

## Slide 14: V1 Limitations and Next Steps

### Current Limitations
- Serums only (Cleansers and Moisturizers not yet connected)
- No Combination or Sensitive skin products in the database
- No fragrance variant selection (F0/F1/F2) on the results page
- No pricing or cart integration
- Free-text answer (Q30) is not analysed

### Planned Next Steps

| Priority | Feature | Description |
|---|---|---|
| 1 | Add Cleanser + Moisturizer | Extend engine to recommend all 3 product categories |
| 2 | Fragrance variant selector | Let customer choose F0/F1/F2 on results page |
| 3 | Bundle pricing | Show discount when all 3 products selected |
| 4 | Cart + Stripe checkout | Purchase flow |
| 5 | ERP tag manager | Visual interface for mapping products to quiz in Recip3 |
| 6 | Combination/Sensitive serums | Add products to fill skin type gaps |

---

## Slide 15: Technical Stack Summary

| Component | Technology | Purpose |
|---|---|---|
| E-commerce App | Next.js 16 + React 19 | Quiz, results page, customer-facing |
| Matching Engine | TypeScript (pure functions) | Filters, scoring, recommendation |
| Database | Supabase (PostgreSQL) | Products, ingredients, formulations |
| ERP | Vite + React 18 + shadcn/ui | Product management (Recip3) |
| API | Next.js API Routes | POST /api/recommend |
| Hosting | Vercel (planned) | E-commerce deployment |

### Codebase Structure

```
app/src/lib/matching-engine/
├── types.ts           — Type definitions
├── ingredient-map.ts  — Ingredient → concern mapping (22 ingredients)
├── filters.ts         — Skin type + safety exclusion filters
├── scoring.ts         — Concern matching + priority scoring
└── recommend.ts       — Orchestrator (fetch → filter → score → return)
```

---

## Slide 16: Key Decisions and Rationale

| Decision | What We Chose | Why |
|---|---|---|
| AI vs Rule-based | Rule-based (decision tree + scoring) | Deterministic, no hallucination risk, same input = same output every time |
| Manual tagging vs Ingredient-driven | Ingredient-driven | Scales automatically, no human error in tagging, new products auto-integrate |
| Pure scoring vs Decision tree + scoring | Hybrid | Pure scoring risks wrong products passing on points alone. Decision tree guarantees hard boundaries (skin type, safety). Scoring only used as tiebreaker. |
| Separate product database vs Shared | Shared Supabase with ERP | Single source of truth. Product changes in Recip3 immediately available to the engine. |
| Server-side vs Client-side engine | Server-side (API route) | Protects product logic, enables future analytics, keeps bundle size small |
