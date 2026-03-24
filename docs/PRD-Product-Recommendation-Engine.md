# Product Recommendation Engine — PRD
**Atelier Rusalka / Kyrill Skincare**

> Version 1.0 | March 2026

---

## 1. Executive Summary

Build a modular product recommendation engine that connects the consultation quiz to personalized product suggestions. Customers complete a 30-question quiz, and the engine recommends a 3-product regimen (Cleanser, Serum, Moisturizer) tailored to their skin type, concerns, and preferences. The system must scale from the current ~24 products to several hundred without code changes.

---

## 2. Problem Statement

Today, the consultation quiz collects customer data but does nothing with it. The quiz ends at a "Thank You" screen with no product recommendations. There is no connection between quiz answers and the product database. Products are displayed as static mockups on the e-commerce site.

**Business impact:** Customers complete a detailed 30-question consultation but receive no personalized value in return. This breaks the core brand promise of "custom skincare" and prevents conversion.

---

## 3. Goals & Success Criteria

### Goals
1. Convert quiz answers into a personalized 3-product recommendation
2. Build a modular system that scales as the product catalog grows
3. Allow Kyrill's team to add new products and have them automatically integrate into the recommendation logic
4. Enable customers to customize their selection (deselect products, choose fragrance variants)

### Success Criteria
- Quiz completion leads to a personalized product recommendation page
- Adding a new product to the database (with proper tags) automatically makes it available for recommendation — no code changes required
- System handles 6 to 500+ products per category without performance degradation
- Customer can purchase 1, 2, or 3 products with appropriate pricing (bundle discount for 3)

---

## 4. Customer Journey

```
Quiz (30 questions)
    ↓
Recommendation Engine (scoring + matching)
    ↓
Results Page (3 personalized products)
    ↓
Customer Customization (deselect, fragrance choice)
    ↓
Cart (bundle or individual pricing)
    ↓
Checkout (Stripe)
```

### Detailed Flow

1. **Customer completes quiz** — 30 questions across 3 sections (About You, Your Skin, Your Routine)
2. **Answers are processed** — the recommendation engine scores products based on quiz answers
3. **Results page displays** — 3 recommended products (Cleanser, Serum, Moisturizer) with personalized explanations
4. **Customer can customize:**
   - Deselect 1 or 2 products (keep only what they want)
   - Choose fragrance variant (F0 = no fragrance, F1, F2)
5. **Pricing adjusts dynamically:**
   - All 3 selected = bundle price (discounted)
   - Fewer than 3 = individual pricing (higher per unit)
6. **Add to cart → Checkout**

---

## 5. Recommendation Engine Architecture

### 5.1 Design Principles

- **Modular:** Adding new products requires only database entries, not code changes
- **Deterministic:** Same quiz answers always produce the same recommendation (temperature: 0)
- **Scalable:** Works with 6 products today and 500+ tomorrow
- **Transparent:** Every recommendation can be explained ("We chose this because...")

### 5.2 System Architecture — Hybrid Approach

The system uses two layers:

**Layer 1 — Product Metadata (Supabase / ERP)**
Products are tagged with structured metadata that describes what they treat. This is managed by Kyrill's team in the ERP when adding or modifying products.

**Layer 2 — Rules Engine (E-commerce App)**
A pure function in the Next.js app that takes quiz answers + product metadata as input and outputs scored product recommendations. No AI, no external API calls — just deterministic logic.

```
┌─────────────────────────────────┐
│        SUPABASE DATABASE        │
│                                 │
│  products table                 │
│  ├── id, name, category         │
│  ├── skin_type                  │
│  ├── product_level              │
│  └── (existing fields)          │
│                                 │
│  product_tags table (NEW)       │
│  ├── product_id (FK)            │
│  ├── tag_category               │
│  │   (concern, base_type,       │
│  │    fragrance, age_range,     │
│  │    climate, ingredient_flag) │
│  ├── tag_value                  │
│  └── weight (priority score)    │
│                                 │
│  product_exclusions table (NEW) │
│  ├── product_id (FK)            │
│  ├── exclusion_type             │
│  │   (ingredient, condition,    │
│  │    pregnancy)                │
│  └── exclusion_value            │
│                                 │
└──────────────┬──────────────────┘
               │ API query
               ↓
┌─────────────────────────────────┐
│     NEXT.JS E-COMMERCE APP      │
│                                 │
│  Quiz (30 questions)            │
│         ↓                       │
│  Quiz Answers (sessionStorage)  │
│         ↓                       │
│  Recommendation Engine          │
│  ├── Step 1: Route by skin type │
│  ├── Step 2: Score by concerns  │
│  ├── Step 3: Apply lifestyle    │
│  │           modifiers          │
│  ├── Step 4: Apply safety       │
│  │           filters            │
│  ├── Step 5: Match preferences  │
│  └── Step 6: Select top match   │
│              per category       │
│         ↓                       │
│  Results Page                   │
│  (3 products + explanations)    │
│                                 │
└─────────────────────────────────┘
```

### 5.3 Recommendation Pipeline (6 Steps)

#### Step 1 — Skin Type Classification (PRIMARY ROUTE)
**Inputs:** Q11 (skin type) + Q14 (post-cleanse feel) for validation

| Skin Type | Formula Base | Product Prefix |
|-----------|-------------|----------------|
| Oily | O-base formulas | SO, CO |
| Dry | D-base formulas | SD, CD |
| Combination | C-base formulas | SC, CC |
| Sensitive | S-base formulas | SS, CS |

**Logic:** Filter all products to only those matching the customer's skin type. This is the primary routing layer — it eliminates ~75% of the catalog immediately.

**Validation:** If Q14 (post-cleanse feel) contradicts Q11, flag for secondary consideration. Example: Q11 = "Oily" but Q14 = "Tight and dry" → consider combination products too.

#### Step 2 — Concern Mapping (ACTIVE SELECTION)
**Inputs:** Q12 (skin concerns) + Q15 (breakout frequency) + Q17 (pore visibility) + Q24 (priority ranking)

Each skin concern maps to product tags:

| Concern | Maps To Tag | Example Products |
|---------|-------------|-----------------|
| Breakouts & blemishes | `concern:acne` | SO1 (BHA/zinc) |
| Post-acne dark spots | `concern:hyperpigmentation` | SO2 (TXA/niacinamide) |
| Fine lines & wrinkles | `concern:anti-aging` | SO4 (retinol), SD4 (peptides) |
| Dullness | `concern:brightening` | SO3 (vitamin C) |
| Dehydration | `concern:hydration` | SD2 (aquaxyl) |
| Redness & sensitivity | `concern:calming` | SD3 (ectoin/bisabolol) |

**Scoring:** Products are scored based on how many of the customer's concerns they address. Q24 ranking applies a multiplier — #1 priority gets 3x weight, #2 gets 2x, #3 gets 1.5x, rest get 1x.

#### Step 3 — Lifestyle Modifiers (FORMULA ADJUSTMENT)
**Inputs:** Q1 (age), Q3 (region), Q4 (environment), Q5-Q8 (water, sleep, stress, diet), Q9 (sun exposure)

These apply bonus scores to products with matching tags:

| Factor | Condition | Bonus Tag |
|--------|-----------|-----------|
| Age | 45+ | `age:mature` (peptides, retinol) |
| Age | Under 25 | `age:young` (lighter formulas) |
| Region | Cold/dry climate | `climate:cold` (barrier-focused) |
| Region | Mediterranean | `climate:warm` (UV-repair) |
| Environment | Urban | `environment:urban` (antioxidants) |
| Sun | High exposure | `sun:high` (UV-repair actives) |
| Stress | High (4-5) | `lifestyle:stress` (calming actives) |

#### Step 4 — Safety Filters (HARD EXCLUSIONS)
**Inputs:** Q10 (pregnancy), Q16 (skin conditions), Q20 (allergies), Q29 (ingredient exclusions)

These are non-negotiable — they REMOVE products from the candidate pool:

| Input | Action |
|-------|--------|
| Pregnant = Yes | Remove all retinol/retinoid products |
| Rosacea | Remove products tagged `contains:strong-acids` |
| Eczema | Remove products tagged `contains:fragrance` |
| Exclude fragrance | Show only F0 (fragrance-free) variants |
| Exclude retinol | Remove all products tagged `contains:retinol` |
| Exclude BHA | Remove products tagged `contains:bha` |
| Exclude PEGs | Remove products tagged `contains:pegs` |

#### Step 5 — Preference Matching (FORMAT & TEXTURE)
**Inputs:** Q21 (routine complexity), Q22 (moisturizer texture), Q23 (cleanser type), Q25-Q28 (philosophy, adventurousness, retinol experience, time)

| Input | Mapping |
|-------|---------|
| Q22: Gel texture | → O-AquaGel / O-FilmGel bases |
| Q22: Cream texture | → D-NutriCream bases |
| Q22: Balm/Oil | → D-OmegaOil bases |
| Q23: Foaming cleanser | → C-LowFoamLotion bases (CO9, CO12) |
| Q23: Cream cleanser | → C-NutriCreamCleanser (CD2, CD3) |
| Q23: Oil/Balm cleanser | → C-OmegaBalm (CD9, CD10) |
| Q27: Retinol beginner | → bakuchiol or low-dose HPR |
| Q27: Regular retinol user | → full retinol formulas |
| Q28: Under 2 min | → recommend 1-2 products only |

#### Step 6 — Output (TOP MATCH PER CATEGORY)
For each category (Cleanser, Serum, Moisturizer):
1. Take the filtered, scored product list
2. Select the highest-scoring product
3. Offer F0/F1/F2 fragrance variants if available

**Output object:**
```
{
  cleanser: { product, score, reasons[], fragranceOptions[] },
  serum: { product, score, reasons[], fragranceOptions[] },
  moisturizer: { product, score, reasons[], fragranceOptions[] },
  bundlePrice: number,
  individualPrices: { cleanser, serum, moisturizer }
}
```

---

## 6. Data Model Changes

### 6.1 New Table: `product_tags`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | FK → products |
| tag_category | text | Category: `concern`, `base_type`, `fragrance`, `age_range`, `climate`, `environment`, `lifestyle`, `texture`, `cleanser_type` |
| tag_value | text | Value: `acne`, `hydration`, `retinol`, `F0`, `mature`, etc. |
| weight | numeric | Priority weight (default 1.0, higher = stronger match) |
| created_at | timestamptz | Auto-set |

**Example rows:**
| product_id | tag_category | tag_value | weight |
|------------|-------------|-----------|--------|
| SO1 | concern | acne | 3.0 |
| SO1 | concern | oil-control | 2.0 |
| SO1 | base_type | O-FilmGel | 1.0 |
| SO1 | fragrance | F0 | 1.0 |
| SO2 | concern | hyperpigmentation | 3.0 |
| SO2 | concern | brightening | 2.0 |
| SD4 | concern | anti-aging | 3.0 |
| SD4 | age_range | mature | 2.0 |

### 6.2 New Table: `product_exclusions`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | FK → products |
| exclusion_type | text | `ingredient`, `condition`, `pregnancy` |
| exclusion_value | text | `retinol`, `bha`, `fragrance`, `pegs`, `rosacea`, `pregnant` |
| created_at | timestamptz | Auto-set |

**Example rows:**
| product_id | exclusion_type | exclusion_value |
|------------|---------------|-----------------|
| SO4 | ingredient | retinol |
| SO1 | ingredient | bha |
| SO4 | pregnancy | pregnant |
| CD2 | ingredient | pegs |

### 6.3 New Table: `quiz_answer_tag_mappings`

Maps quiz answers to product tags. This is the core of the modular system — when Kyrill adds a new concern or product tag, they add a mapping row here.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| question_id | integer | Quiz question number (1-30) |
| answer_value | text | The specific answer option |
| tag_category | text | Maps to product_tags.tag_category |
| tag_value | text | Maps to product_tags.tag_value |
| score_weight | numeric | How strongly this answer indicates this tag |
| created_at | timestamptz | Auto-set |

**Example rows:**
| question_id | answer_value | tag_category | tag_value | score_weight |
|-------------|-------------|-------------|-----------|-------------|
| 11 | Oily | skin_type | oily | 10.0 |
| 11 | Dry | skin_type | dry | 10.0 |
| 12 | Breakouts & blemishes | concern | acne | 3.0 |
| 12 | Fine lines & wrinkles | concern | anti-aging | 3.0 |
| 12 | Dullness & uneven tone | concern | brightening | 3.0 |
| 24 | Anti-aging (rank #1) | concern | anti-aging | 5.0 |
| 24 | Anti-aging (rank #2) | concern | anti-aging | 3.0 |
| 29 | Fragrance / essential oils | exclusion | fragrance | -100 |
| 29 | Retinol / retinoids | exclusion | retinol | -100 |

---

## 7. ERP Integration (Product Tagging UI)

### 7.1 What Kyrill's Team Needs

When adding or editing a product in the ERP, the team needs to:
1. **Tag the product** with relevant concerns, skin types, base types, and ingredients
2. **Set exclusion flags** for safety (contains retinol, contains BHA, etc.)
3. **See a visual map** of how the product connects to quiz answers

### 7.2 ERP Product Form Additions

Add a new **"Recommendation Tags"** section to the existing Product Detail page in the ERP:

**Tag Manager:**
- Multi-select tag input grouped by category
- Categories: Concern, Base Type, Fragrance, Age Range, Climate, Texture, Cleanser Type
- Each tag has a weight slider (0.5 to 5.0)
- Pre-populated tag suggestions based on existing products

**Exclusion Manager:**
- Checkbox list of ingredient flags (contains retinol, BHA, PEGs, fragrance, etc.)
- Pregnancy safety toggle
- Condition contraindications

**Coverage Preview:**
- Shows which quiz answer combinations would select this product
- Highlights gaps ("No product covers: Oily + Calming + Fragrance-free")

---

## 8. Results Page (E-commerce App)

### 8.1 Layout

After quiz completion, the customer sees a results page with:

**Header:**
- "Your Personalised Regimen"
- Summary of skin profile (e.g., "Oily skin · Breakout-prone · Urban lifestyle")

**Product Cards (3 cards, horizontally):**
Each card shows:
- Product image
- Product name and category (Cleanser / Serum / Moisturizer)
- Key active ingredients
- "Why this is for you" — 2-3 personalized sentences
- Fragrance selector (F0 / F1 / F2 dropdown)
- Deselect toggle (checkbox, default: selected)
- Individual price

**Pricing Section:**
- Bundle price (all 3 selected) with discount badge ("Save 20%")
- Dynamically updates as customer deselects products
- "Add to Cart" button

### 8.2 Personalization Copy

Each product card includes a "Why this is for you" section generated from the scoring reasons:

> "Based on your concern with breakouts and your preference for a gel texture, we selected our BHA + Zinc serum. It targets active blemishes while controlling oil production — perfect for your oily, urban-exposed skin."

This copy is assembled from templates, not AI-generated (temperature: 0 approach).

---

## 9. Pricing Model

| Selection | Pricing |
|-----------|---------|
| All 3 products (bundle) | Discounted rate (e.g., $120 instead of $145) |
| Any 2 products | Sum of individual prices (no discount) |
| 1 product only | Individual price |

Bundle discount is configurable (currently planned at ~17% off total individual prices).

---

## 10. Fragrance Variants

Each product may have up to 3 fragrance variants:

| Variant | Description |
|---------|-------------|
| F0 | Fragrance-free (default for sensitive skin / fragrance excluders) |
| F1 | Fragrance blend 1 (light, botanical) |
| F2 | Fragrance blend 2 (richer, essential oils) |

If Q25 includes "Fragrance-free" or Q29 excludes fragrance → auto-select F0, hide other options.

---

## 11. Scalability Plan

### Current State (Launch)
- ~6 variations per skin type per category
- ~24 total products
- Recommendation engine handles this easily

### Growth Path
- Products increase to 12, then 24, then 100+ per category
- **No code changes required** — new products are tagged in the ERP and automatically enter the recommendation pool
- The scoring algorithm naturally selects the best match from any pool size
- Tag coverage gaps are surfaced in the ERP's Coverage Preview

### What Happens When Products Are Added
1. Kyrill's team creates the product in the ERP
2. They add tags (concern, skin type, base type, fragrance, exclusions)
3. The product immediately becomes a candidate in the recommendation engine
4. The Coverage Preview shows how it fits into the recommendation landscape

---

## 12. Technical Implementation Summary

### New Database Tables (Supabase)
1. `product_tags` — product metadata for scoring
2. `product_exclusions` — safety/ingredient exclusions
3. `quiz_answer_tag_mappings` — maps quiz answers to product tags

### New ERP Features (recip3)
1. Product Tag Manager component
2. Product Exclusion Manager component
3. Coverage Preview component

### New E-commerce Features (app/)
1. Recommendation engine (pure function, `src/lib/recommendation-engine.ts`)
2. Results page (`src/app/results/page.tsx`)
3. Product card with fragrance selector
4. Dynamic pricing display
5. API route to fetch tagged products from Supabase

### API Routes (Next.js)
1. `POST /api/recommend` — accepts quiz answers, returns product recommendations
2. `GET /api/products/tagged` — fetches products with tags for the engine

---

## 13. Out of Scope (v1)

- AI-powered free-text analysis (Q30) — manual review in v1
- Subscription integration — separate feature
- Shopping cart and Stripe checkout — separate feature
- Customer accounts / saved quiz results
- A/B testing of recommendation algorithms
- Combination skin sub-routing (oily T-zone vs dry cheeks)

---

## 14. Dependencies

| Dependency | Status |
|------------|--------|
| Quiz (30 questions) | Complete |
| Product database (Supabase) | Migrated |
| ERP (product management) | Migrated |
| Product formulations | In progress (Kyrill's team) |
| Stripe checkout | Not started |
| Shopping cart | Not started |

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Formulations not complete | Can't tag products accurately | Start with available products, add tags as formulations finalize |
| Too few products per concern | Some quiz paths lead to no match | Fallback logic: recommend closest match + explain gap |
| Quiz answer conflicts | Contradictory answers confuse engine | Validation step (Step 1) catches skin type contradictions |
| Tag data entry errors | Wrong product recommended | Coverage Preview in ERP highlights gaps and conflicts |

---

## 16. Milestones

| Phase | Deliverable | Description |
|-------|-------------|-------------|
| **Phase 1** | Data model | Create new tables, seed initial tag data |
| **Phase 2** | Recommendation engine | Pure function with 6-step pipeline |
| **Phase 3** | ERP tag manager | UI for tagging products in the ERP |
| **Phase 4** | Results page | Customer-facing recommendation display |
| **Phase 5** | Integration | Connect quiz → engine → results → cart |

---

*Document prepared for Atelier Rusalka — March 2026*
