# Matching Engine V1 — Test Results (Test Database)
**Database: epbyhiagcnbyznvmbebj (test)**
**Date: March 2026**

---

## Database State

### Total Serums (End Product): 25

| Skin Type | Count | Products | Have Concern Tags? |
|---|---|---|---|
| Oily Skin | 5 | SO1, SO2, SO3, SO4, SO5 | No (original 24, using Layer 2) |
| Dry Skin | 7 | SD2, SD3, SD4, SD09, SD10, LF SD12, SD9 | SD9 only has tags, rest use Layer 2 |
| Dry (inconsistent) | 1 | SD12 | No — also broken skin_type value |
| Combination Skin | 6 | SC1, SC2, SC3, SC4, SC5, SC6 | Yes (all from batch upload) |
| Sensitive Skin | 6 | SS1, SS2, SS3, SS4, SS5, SS6 | Yes (all from batch upload) |

### Key Observations
- Oily and Dry serums are the **original 24 products** from production migration — no concern tags
- Combination and Sensitive serums are **new from batch upload** — all have concern tags
- SD12 has skin_type = `"Dry"` instead of `"Dry Skin"` — normalization SQL needs to run on test DB
- The batch upload JSON didn't include new Oily or Dry serums — those categories only have originals

---

## Test Results

### TEST 1: Oily + Breakouts + Clarifying Priority

| Step | Detail |
|---|---|
| **Customer** | Oily skin, concerns: breakouts + oiliness, priority #1: clarifying |
| **Gate 1** | Oily → 5 serums (SO1-SO5) |
| **Gate 2** | No exclusions → all 5 pass |
| **Gate 3** | Source: **Layer 2** (no concern tags on products) |
| **Winner** | **SO1** — Score: 44 |
| **Matched** | acne, oil-control |
| **Reasons** | "Formulated for breakouts & blemishes, oil control. Matched to your top priority." |
| **Why SO1?** | Layer 2 maps Salicylic Acid + Zinc PCA → acne + oil-control. Both match customer concerns. Clarifying is #1 priority → 3x multiplier on acne. |

---

### TEST 2: Oily + Anti-aging + Anti-aging Priority

| Step | Detail |
|---|---|
| **Customer** | Oily skin, concerns: fine lines + firmness, priority #1: anti-aging |
| **Gate 1** | Oily → 5 serums |
| **Gate 2** | No exclusions → all 5 pass |
| **Gate 3** | Source: **Layer 2** |
| **Winner** | **SO4** — Score: 36 |
| **Matched** | anti-aging |
| **Reasons** | "Formulated for fine lines & wrinkles. Matched to your top priority." |
| **Why SO4?** | Layer 2 maps Retinol Liposome OS + SymRenew HPR + Matrixyl 3000 → anti-aging. 3 active ingredients = highest active bonus. |

---

### TEST 3: Oily + Anti-aging + Retinol Excluded

| Step | Detail |
|---|---|
| **Customer** | Oily skin, concern: fine lines, priority #1: anti-aging, excludes retinol |
| **Gate 1** | Oily → 5 serums |
| **Gate 2** | Retinol excluded → **SO4 removed** (has Retinol Liposome OS, SymRenew HPR) → 4 remain |
| **Gate 3** | Source: **Layer 2** |
| **Winner** | **SO1** — Score: 4 |
| **Matched** | (none) |
| **Reasons** | (none) |
| **Problem** | SO5 has Bakuchiol (gentle retinol alternative) but Layer 2 maps it to `anti-aging-gentle`, not `anti-aging`. These are different internal codes so SO5 doesn't match. All 4 remaining products tie at base score. SO1 wins on active ingredient count. |
| **Expected** | SO5 should win since Bakuchiol is a retinol alternative for anti-aging. |

**Status: KNOWN ISSUE** — `anti-aging-gentle` should match `anti-aging` concerns.

---

### TEST 4: Oily + Pregnant

| Step | Detail |
|---|---|
| **Customer** | Oily skin, pregnant, concern: breakouts, priority #1: clarifying |
| **Gate 1** | Oily → 5 serums |
| **Gate 2** | Pregnant → retinol excluded → **SO4 removed** → 4 remain |
| **Gate 3** | Source: **Layer 2** |
| **Winner** | **SO1** — Score: 34 |
| **Matched** | acne |
| **Reasons** | "Formulated for breakouts & blemishes. Matched to your top priority." |
| **Note** | SO1 contains Salicylic Acid (BHA) which some dermatologists advise against during pregnancy. Engine currently only excludes retinol for pregnancy. |

**Status: NEEDS REVIEW** — Consider adding BHA to pregnancy exclusion list.

---

### TEST 5: Dry + Hydration + Hydration Priority

| Step | Detail |
|---|---|
| **Customer** | Dry skin, concern: dehydration, priority #1: hydration |
| **Gate 1** | Dry → 7 serums (SD2, SD3, SD4, SD09, SD10, LF SD12, SD9) |
| **Gate 2** | No exclusions → all 7 pass |
| **Gate 3** | Source: **Layer 2** for most, **Concern Tags** for SD9 |
| **Winner** | **SD2** — Score: 34 |
| **Matched** | hydration |
| **Reasons** | "Formulated for hydration. Matched to your top priority." |
| **Why SD2?** | Layer 2 maps Panthenol → hydration. SD3 should also match (Hyaluronic Acid, Aquaxyl) but may have ingredient linking issues from migration. |

---

### TEST 6: Dry + Calming + Rosacea

| Step | Detail |
|---|---|
| **Customer** | Dry skin, concerns: redness + sensitivity, has rosacea, priority #1: calming |
| **Gate 1** | Dry → 7 serums |
| **Gate 2** | Rosacea → BHA excluded. No dry serums contain BHA → all 7 pass |
| **Gate 3** | Source: **Layer 2** |
| **Winner** | **SD2** — Score: 34 |
| **Matched** | calming |
| **Reasons** | "Formulated for redness & sensitivity. Matched to your top priority." |
| **Why SD2?** | Layer 2 maps Ectoin + Bisabolol → calming. Correct pick for rosacea-prone skin. |

---

### TEST 7: Dry + Brightening + Brightening Priority

| Step | Detail |
|---|---|
| **Customer** | Dry skin, concerns: dullness + dark spots, priority #1: brightening |
| **Gate 1** | Dry → 7 serums |
| **Gate 2** | No exclusions → all 7 pass |
| **Gate 3** | Source: **Concern Tags for SD9**, Layer 2 for rest |
| **Winner** | **SD9** — Score: 42 |
| **Matched** | brightening, hyperpigmentation |
| **Reasons** | "Formulated for dullness & uneven tone, dark spots. Matched to your top priority." |
| **Why SD9?** | SD9 has concern tags: includes "Dullness or tired-looking skin" and "Uneven skin tone or dark spots". Both match customer concerns. Brightening is #1 → 3x multiplier. |
| **Changed from production** | Was SD10 (via Layer 2 Vitamin C). Now SD9 wins because its concern tags cover both brightening AND hyperpigmentation, while SD10 only covers brightening via ingredients. |

---

### TEST 8: Combination + Breakouts (Previously GAP)

| Step | Detail |
|---|---|
| **Customer** | Combination skin, concern: breakouts, priority #1: clarifying |
| **Gate 1** | Combination → **6 serums (SC1-SC6)** — NEW from batch upload! |
| **Gate 2** | No exclusions → all 6 pass |
| **Gate 3** | Source: **Concern Tags** (all have tags) |
| **Winner** | **SC1** — Score: 34 |
| **Matched** | acne |
| **Reasons** | "Formulated for breakouts & blemishes. Matched to your top priority." |
| **Improvement** | Was a GAP on production (0 combination serums). Now returns SC1. |

---

### TEST 9: Oily + Breakouts + Eczema (Still GAP)

| Step | Detail |
|---|---|
| **Customer** | Oily skin, concern: breakouts, has eczema |
| **Gate 1** | Oily → 5 serums (SO1-SO5) |
| **Gate 2** | Eczema → fragrance excluded. All 5 contain Parfum → **all removed** |
| **Result** | **GAP** — 0 products remain |
| **Why still GAP** | All oily serums in the database contain fragrance. No F0 (fragrance-free) oily serums exist. |

**Status: PRODUCT GAP** — Need fragrance-free oily serums (e.g., SO1-F0, SO2-F0).

---

### TEST 10: Dry + Multiple Concerns + Repair Priority

| Step | Detail |
|---|---|
| **Customer** | Dry skin, concerns: texture + dehydration + sensitivity, priority #1: repair, #2: hydration, #3: calming |
| **Gate 1** | Dry → 7 serums |
| **Gate 2** | No exclusions → all 7 pass |
| **Gate 3** | Source: **Layer 2** |
| **Winner** | **SD2** — Score: 69 |
| **Matched** | repair, hydration, calming |
| **Reasons** | "Formulated for barrier repair, hydration, redness & sensitivity. Matched to your top priority." |
| **Why SD2?** | Matches all 3 concerns: Panthenol → repair + hydration, Ectoin + Bisabolol → calming. With priority multipliers: repair (3x=30) + hydration (2x=20) + calming (1.5x=15) = 65 + active bonus = 69. Highest possible score. |

---

### TEST 11: Sensitive + Calming (Previously GAP)

| Step | Detail |
|---|---|
| **Customer** | Sensitive skin, concerns: redness + sensitivity, priority #1: calming |
| **Gate 1** | Sensitive → **6 serums (SS1-SS6)** — NEW from batch upload! |
| **Gate 2** | No exclusions → all 6 pass |
| **Gate 3** | Source: **Concern Tags** (all have tags) |
| **Winner** | **SS1** — Score: 34 |
| **Matched** | calming |
| **Reasons** | "Formulated for redness & sensitivity. Matched to your top priority." |
| **Improvement** | Was a GAP on production (0 sensitive serums). Now returns SS1. |

---

## Summary

| Test | Skin | Winner | Score | Source | vs Production |
|---|---|---|---|---|---|
| 1 | Oily + Breakouts | **SO1** | 44 | Layer 2 | Same |
| 2 | Oily + Anti-aging | **SO4** | 36 | Layer 2 | Same |
| 3 | Oily + Anti-aging - retinol | **SO1** | 4 | Layer 2 | Same (known issue) |
| 4 | Oily + Pregnant | **SO1** | 34 | Layer 2 | Same |
| 5 | Dry + Hydration | **SD2** | 34 | Layer 2 | Same |
| 6 | Dry + Calming + Rosacea | **SD2** | 34 | Layer 2 | Same |
| 7 | Dry + Brightening | **SD9** | 42 | Concern Tags | **Changed** (was SD10) |
| 8 | Combination + Breakouts | **SC1** | 34 | Concern Tags | **Fixed** (was GAP) |
| 9 | Oily + Eczema | **GAP** | — | — | Same gap |
| 10 | Dry + Repair | **SD2** | 69 | Layer 2 | Same |
| 11 | Sensitive + Calming | **SS1** | 34 | Concern Tags | **Fixed** (was GAP) |

---

## Why Tests 1-6 and 10 Are the Same as Production

The oily and dry serum pools **haven't changed** between production and test:
- **Oily:** Same 5 products (SO1-SO5), none have concern tags → still using Layer 2
- **Dry:** Same 7 products (SD2-SD12), only SD9 has concern tags from batch upload

The batch upload added products for **Combination (SC1-SC6)** and **Sensitive (SS1-SS6)** only — no new oily or dry serums were in the JSON file.

To get different results for oily/dry tests, Kyrill needs to either:
1. Add concern tags to the existing SO/SD products in the ERP
2. Add new oily/dry serums via batch upload

---

## Concern Tags vs Layer 2 Usage

| Scenario | Source Used | Why |
|---|---|---|
| Product has concern_tags filled in | **Concern Tags** (direct match) | Tags are checked first, skips ingredient lookup |
| Product has empty concern_tags | **Layer 2** (ingredient fallback) | Reads ingredients, maps via hardcoded ingredient map |
| Product has concern_tags but also ingredients | **Concern Tags only** | Tags take priority, ingredients ignored for scoring |

---

## Known Issues

### 1. anti-aging-gentle vs anti-aging (Test 3)
Bakuchiol maps to `anti-aging-gentle` in Layer 2 but customer concern "Fine lines or wrinkles" maps to `anti-aging`. Different codes = no match. SO5 should be recommended when retinol is excluded.

### 2. BHA and pregnancy (Test 4)
SO1 contains Salicylic Acid which may be unsafe during pregnancy. Only retinol is currently excluded for pregnant customers.

### 3. No fragrance-free oily serums (Test 9)
All oily serums contain Parfum. Eczema safety requires fragrance-free → gap.

### 4. SD12 skin_type inconsistency
SD12 has `skin_type = "Dry"` instead of `"Dry Skin"` in the test DB. Normalization SQL needs to run.

### 5. Oily/Dry products have no concern tags
The original 24 products were migrated without concern tags. They still rely on Layer 2. To use concern tags, Kyrill needs to tag them in the ERP or re-upload with tags.

---

## Action Items

| Priority | Action | Impact |
|---|---|---|
| 1 | Run skin_type normalization SQL on test DB | Fixes SD12 visibility |
| 2 | Add concern tags to original SO/SD products | Removes Layer 2 dependency for oily/dry |
| 3 | Fix anti-aging-gentle → anti-aging mapping | Fixes Test 3 |
| 4 | Add BHA to pregnancy exclusion | Fixes Test 4 safety |
| 5 | Add fragrance-free oily serums to catalog | Fixes Test 9 gap |
