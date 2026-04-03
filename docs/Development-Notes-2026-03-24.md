# Development Notes — 24 March 2026
**What was done, what to watch for, what's missing**

---

## Tasks Completed

### 1. Skincare Priorities Column Added to Ingredients Table
- **What:** New `skincare_priorities` text[] column on `ingredients` table in test DB
- **SQL file:** `add-ingredient-priorities.sql`
- **Values:** Anti-aging, Brightening, Hydration, Calming, Clarifying, Repair
- **Watch for:** Column only exists on **test** DB (`epbyhiagcnbyznvmbebj`). Not on production yet. Run the same SQL on production when ready to go live.

### 2. Skincare Priorities UI on ERP Ingredient Form
- **What:** 6 clickable badges on the ingredient edit/create form in Recip3 ERP
- **File changed:** `recip3/src/components/forms/IngredientForm.tsx`
- **Pushed to:** Test repo only (`tekkenfreya/atelier-rusalka-erp-test`)
- **Watch for:** When editing an existing ingredient, the priorities load from DB. When creating a new ingredient, the priorities default to empty — must be manually selected.

### 3. 69 Ingredients Mapped to Skincare Priorities
- **What:** SQL script maps 69 ingredients (extracts + actives) to their skincare priorities based on Kyrill's Excel file (`Atelier_Rusalka_Formula_Matrix_New.xlsx`)
- **SQL file:** `update-ingredient-priorities.sql`
- **Run on:** Test DB only
- **Watch for:**
  - The mapping uses `WHERE LOWER(name) = LOWER(...)` — if an ingredient name in the DB doesn't exactly match the Excel name, it won't be updated
  - Any **new ingredients** added after this point will have **empty priorities** — must be tagged manually in the ERP
  - The 69 mapped ingredients cover all extracts from Kyrill's EE Extract Suggestions sheet + all active ingredients from the Ingredient Index sheet

### 4. Matching Engine Updated — Two Scoring Layers
- **What:** Gate 3 scoring now uses both concern tags AND ingredient skincare priorities
- **Files changed:**
  - `app/src/lib/matching-engine/scoring.ts` — new scoring logic
  - `app/src/lib/matching-engine/types.ts` — added `skincare_priorities` to Ingredient type, added `SkincarePriority` type
  - `app/src/lib/matching-engine/recommend.ts` — fetches `skincare_priorities` from ingredients table
- **How scoring works now:**
  - **Layer 1 (10 pts × multiplier):** Product concern tags matched against customer's Q12 answers. If no concern tags, falls back to hardcoded ingredient map.
  - **Layer 2 (5 pts × multiplier):** Ingredient skincare priorities from DB matched against customer's Q24 ranking. NEW — reads from database, not hardcoded.
  - **Bonus (2 pts each):** Number of active ingredients
  - Layer 1 outweighs Layer 2 so concern tags remain the primary driver
- **Watch for:**
  - Layer 1 fallback still uses `ingredient-map.ts` (hardcoded) when products have no concern tags. The original 24 products in production have no concern tags, so they still use the hardcoded map.
  - Layer 2 only works if ingredients have `skincare_priorities` set in the DB. If an ingredient has no priorities, it contributes 0 to Layer 2 scoring.

### 5. Gate 2 Updated — Checks Both Safety Flags and Ingredients
- **What:** Gate 2 now reads product-level safety flags (`safe_for_pregnancy`, `safe_for_rosacea`, etc.) from the database AND checks ingredients via the ingredient map
- **Files changed:**
  - `app/src/lib/matching-engine/filters.ts` — new `isExcludedByFlags()` function
  - `app/src/lib/matching-engine/types.ts` — added 7 safety flag fields to Product type
  - `app/src/lib/matching-engine/recommend.ts` — fetches safety flag columns
- **Watch for:**
  - The original 24 products in production have ALL safety flags set to defaults (`safe_for_* = true`, `contains_* = false`). This means the safety flag check won't catch anything on those products — only the ingredient map fallback will catch them.
  - The batch-uploaded products (71) have correct safety flags from the JSON file.
  - If Kyrill adds a new product and forgets to set `contains_retinol = true`, Gate 2 might miss it — unless the ingredient map also catches it.

---

## What's Missing

### Not Yet Done
| Item | Priority | Notes |
|---|---|---|
| **Full serum test with new scoring** | High | Need to run 11 tests with updated engine and generate Excel report |
| **Moisturizer + Cleanser in matching engine** | High | Kyrill wants all 3 categories. Engine currently only does serums. |
| **Batch upload skincare priorities** | Low | Skipped — new ingredients get tagged manually in ERP. Not urgent. |
| **Production deployment** | Medium | All changes are on test only. Need to push to production when approved. |
| **Anon read policies on production DB** | Medium | Test DB has anon read policies for products/ingredients/product_ingredients. Production may not. |

### Known Issues
| Issue | Impact | Fix |
|---|---|---|
| `anti-aging-gentle` vs `anti-aging` | SO5 (Bakuchiol) doesn't match "Fine lines or wrinkles" via Layer 1 fallback | Will be resolved when SO5 gets concern tags. Layer 2 now covers it since Bakuchiol has priority "Anti-aging" in the DB. |
| BHA not excluded for pregnancy | Pregnant customer could get SO1 (Salicylic Acid) | Add BHA to pregnancy exclusion in `filters.ts`, or ensure `safe_for_pregnancy = false` on products with BHA |
| All oily serums have fragrance | Oily + eczema = GAP (no products) | Need F0 (fragrance-free) oily serum variants in the catalog |
| SD12 skin_type = "Dry" not "Dry Skin" | SD12 invisible to engine on test DB | Run normalization SQL: `UPDATE products SET skin_type = 'Dry Skin' WHERE skin_type = 'Dry';` |
| Original 24 products have no concern tags | They rely on hardcoded ingredient map (Layer 1 fallback) | Tag them in the ERP or re-upload with concern tags |
| Original 24 products have default safety flags | Safety flag check doesn't catch them | Set correct flags in ERP or run UPDATE SQL |
| Some ingredients have no skincare priorities | They don't contribute to Layer 2 scoring | Tag them manually in ERP ingredient form |

### Database Sync Status
| Database | Has skincare_priorities column? | Has safety flag columns? | Has anon read policies? | Has ingredient priorities set? |
|---|---|---|---|---|
| **Production** (`kdjcbxjagaltvynvshkj`) | Yes | Yes | Partial (may need ingredients/product_ingredients) | No |
| **Test** (`epbyhiagcnbyznvmbebj`) | Yes | Yes | Yes | Yes (69 ingredients) |

### Repos — What's Where
| Repo | What it has | What's pending |
|---|---|---|
| `tekkenfreya/Atelier-Rusalka` (app) | Matching engine with Gate 2 safety flags + skincare priorities scoring | Not pushed yet — new scoring changes are local only |
| `tekkenfreya/atelier-rusalka-erp-test` (test ERP) | Ingredient form with priorities, batch upload with dedup + auto-create | Latest — all test features |
| `tekkenfreya/atelier-rusalka-erp` (prod ERP) | Old version — no ingredient priorities, no batch upload | Waiting for Kyrill approval to push |

### Files to Run on Production (When Ready)
1. `add-product-match-fields.sql` — concern tags + safety flags on products (already run)
2. `add-ingredient-priorities.sql` — skincare priorities column on ingredients
3. `update-ingredient-priorities.sql` — map 69 ingredients to priorities
4. `normalize-skin-types.sql` — fix "Dry" → "Dry Skin" inconsistencies
5. Anon read policies for products, ingredients, product_ingredients
6. Push app code with updated matching engine
7. Push ERP code with ingredient form priorities

---

## Architecture Summary (Current State)

```
Customer → Quiz (30 questions)
    ↓
POST /api/recommend
    ↓
GATE 1: Filter by skin type (Q11)
    ↓
GATE 2: Safety exclusions
  ├── Check product safety flags from DB (safe_for_pregnancy, etc.)
  ├── Check ingredient map fallback (Salicylic Acid → BHA, etc.)
  └── Sources: Q10 (pregnancy), Q16 (rosacea/eczema), Q29 (ingredient exclusions)
    ↓
GATE 3: Scoring
  ├── Layer 1: Product concern tags vs Q12 answers (10 pts × multiplier)
  │   └── Fallback: hardcoded ingredient map if no concern tags
  ├── Layer 2: Ingredient skincare priorities from DB vs Q24 ranking (5 pts × multiplier)
  └── Bonus: Active ingredient count (2 pts each)
    ↓
Winner = highest score
    ↓
Results page + fragrance selector (F0/F1/F2)
```
