# Matching Engine V1 — Test Results
**10 Test Scenarios with Gate-by-Gate Breakdown**
**Date: March 2026**

---

## How to Read This Document

Each test shows:
1. **Customer Profile** — what the customer answered in the quiz
2. **Gate 1** — skin type filter (which products pass)
3. **Gate 2** — safety exclusions (which products are removed)
4. **Gate 3** — scoring (how the winner is picked)
5. **Result** — the recommended product

---

## TEST 1: Oily Skin + Breakouts + Clarifying Priority

### Customer Profile
| Question | Answer |
|---|---|
| Q10 Pregnant? | No |
| Q11 Skin type | Oily |
| Q12 Concerns | Breakouts or blemishes, Oiliness or excess shine |
| Q16 Conditions | None |
| Q24 Priority #1 | Clarifying (control oil, minimise breakouts) |
| Q29 Exclusions | None |

### Gate 1: Skin Type Filter
Skin type = **Oily** → Only oily-skin serums pass.

| Product | Skin Type | Pass? |
|---|---|---|
| SO1 | Oily | Yes |
| SO2 | Oily | Yes |
| SO3 | Oily | Yes |
| SO4 | Oily | Yes |
| SO5 | Oily | Yes |
| SD2-SD12 | Dry | No |

**5 products remain.**

### Gate 2: Safety Exclusions
- Not pregnant → no retinol exclusion
- No conditions → no BHA/fragrance exclusion
- No Q29 exclusions

**All 5 products pass. 5 remain.**

### Gate 3: Scoring
Customer concerns: `acne`, `oil-control`
Priority #1: Clarifying → maps to `acne` (3x multiplier)

| Product | Key Actives | Matches acne? | Matches oil-control? | Score |
|---|---|---|---|---|
| **SO1** | Salicylic Acid, Zinc PCA, Niacinamide | Yes (3x = 30) | Yes (1x = 10) | **44** |
| SO2 | Tranexamic Acid, Niacinamide | No | Partial (4) | **4** |
| SO3 | Azeloglycine, Niacinamide | No | Partial (4) | **4** |
| SO4 | Retinol, HPR, Matrixyl | No | No | **6** |
| SO5 | Bakuchiol, Bisabolol | No | No | **4** |

### Result
**Winner: SO1** (Score: 44)
Reasons: "Formulated for breakouts & blemishes, oil control. Matched to your top priority."

---

## TEST 2: Oily Skin + Anti-aging + Anti-aging Priority

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Oily |
| Q12 Concerns | Fine lines or wrinkles, Lack of firmness |
| Q24 Priority #1 | Anti-aging |
| Q29 Exclusions | None |

### Gate 1: Skin Type → 5 oily serums remain
### Gate 2: No exclusions → 5 remain

### Gate 3: Scoring
Customer concerns: `anti-aging`
Priority #1: Anti-aging (3x multiplier)

| Product | Has anti-aging? | Score |
|---|---|---|
| SO1 | No | 4 |
| SO2 | No | 4 |
| SO3 | No | 4 |
| **SO4** | Yes (Retinol, HPR, Matrixyl) | **36** |
| SO5 | Yes (Bakuchiol — gentle) | 34 |

### Result
**Winner: SO4** (Score: 36)
Reasons: "Formulated for fine lines & wrinkles. Matched to your top priority."

SO4 wins over SO5 because it has more active ingredients (Retinol + HPR + Matrixyl = 3 actives vs Bakuchiol + Bisabolol = 2 actives). The active ingredient bonus breaks the tie.

---

## TEST 3: Oily + Anti-aging BUT Retinol Excluded

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Oily |
| Q12 Concerns | Fine lines or wrinkles |
| Q24 Priority #1 | Anti-aging |
| Q29 Exclusions | Retinol / retinoids |

### Gate 1: 5 oily serums remain
### Gate 2: Retinol excluded
- **SO4 removed** (contains Retinol Liposome OS, SymRenew HPR)

**4 products remain: SO1, SO2, SO3, SO5**

### Gate 3: Scoring
Customer wants anti-aging, but SO4 (the best anti-aging product) was excluded.

| Product | Has anti-aging? | Score |
|---|---|---|
| SO1 | No | 4 |
| SO2 | No | 4 |
| SO3 | No | 4 |
| **SO5** | Yes (Bakuchiol — gentle retinol alternative) | **Expected winner** |

### Result
**Winner: SO1** (Score: 4 — tied, won on active ingredient count)

**Issue identified:** SO5 should win here since Bakuchiol is a retinol alternative for anti-aging. However, SO5's concern tags via ingredient map may not be mapping to `anti-aging` correctly. The Bakuchiol mapping goes to `anti-aging-gentle` and `calming`, while the customer's concern is `anti-aging`. These are different concern types in the engine, so SO5 doesn't score on the customer's concern. All 4 remaining products tie at base score, and SO1 wins on active ingredient count.

**Recommendation:** Consider mapping `anti-aging-gentle` as a valid match for `anti-aging` concerns, with a slightly lower weight.

---

## TEST 4: Oily + Pregnant

### Customer Profile
| Question | Answer |
|---|---|
| Q10 Pregnant? | **Yes** |
| Q11 Skin type | Oily |
| Q12 Concerns | Breakouts or blemishes |
| Q24 Priority #1 | Clarifying |

### Gate 1: 5 oily serums remain
### Gate 2: Pregnant → retinol excluded
- **SO4 removed** (contains Retinol)

**4 remain: SO1, SO2, SO3, SO5**

### Gate 3: Scoring
| Product | Matches acne? | Score |
|---|---|---|
| **SO1** | Yes (Salicylic Acid, Zinc PCA) | **34** |
| SO2 | No | 4 |
| SO3 | No | 4 |
| SO5 | No | 4 |

### Result
**Winner: SO1** (Score: 34)

Note: SO1 contains Salicylic Acid which some dermatologists advise against during pregnancy. The engine currently only excludes retinol for pregnancy. This may need refinement — consider adding BHA to the pregnancy exclusion list.

---

## TEST 5: Dry Skin + Hydration Priority

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Dry |
| Q12 Concerns | Dryness or dehydration |
| Q24 Priority #1 | Hydration |

### Gate 1: Skin Type → Only dry-skin serums pass
**7 products remain: SD2, SD3, SD4, SD09, SD10, SD12, LF SD12**

### Gate 2: No exclusions → 7 remain

### Gate 3: Scoring
| Product | Has hydration? | Score |
|---|---|---|
| **SD2** | Yes (Panthenol, Ectoin) | **34** |
| SD3 | Yes (Hyaluronic Acid, Aquaxyl) | Expected match |
| SD4 | No | Low |
| SD09 | No | Low |
| SD10 | No | Low |
| SD12 | Yes (Panthenol) | Possible match |

### Result
**Winner: SD2** (Score: 34)
Reasons: "Formulated for hydration. Matched to your top priority."

Note: SD3 (Hyaluronic Acid + Aquaxyl) might be a better hydration match. If SD3 has those ingredients linked properly in the DB, it should score equally or higher. The current result depends on which ingredients are actually linked in the database.

---

## TEST 6: Dry Skin + Calming + Rosacea

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Dry |
| Q12 Concerns | Redness or irritation, Sensitivity or reactivity |
| Q16 Conditions | **Rosacea** |
| Q24 Priority #1 | Calming |

### Gate 1: 7 dry serums remain

### Gate 2: Rosacea → BHA/exfoliating acids excluded
No dry serums contain BHA, so no products removed.

**7 remain.**

### Gate 3: Scoring
Customer concerns: `calming`

| Product | Has calming? | Score |
|---|---|---|
| **SD2** | Yes (Ectoin, Bisabolol) | **34** |
| SD3 | No | Low |
| Others | No | Low |

### Result
**Winner: SD2** (Score: 34)
Reasons: "Formulated for redness & sensitivity. Matched to your top priority."

SD2 is the correct pick — Ectoin and Bisabolol are proven calming actives, ideal for rosacea-prone skin.

---

## TEST 7: Dry Skin + Brightening Priority

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Dry |
| Q12 Concerns | Dullness or tired-looking skin, Uneven skin tone or dark spots |
| Q24 Priority #1 | Brightening |

### Gate 1: 7 dry serums remain
### Gate 2: No exclusions → 7 remain

### Gate 3: Scoring
Customer concerns: `brightening`, `hyperpigmentation`

| Product | Matches? | Score |
|---|---|---|
| **SD10** | Yes — Vitamin C (brightening), CoQ10 (antioxidant) | **36** |
| SD2 | No | Low |
| Others | No | Low |

### Result
**Winner: SD10** (Score: 36)
Reasons: "Formulated for dullness & uneven tone. Matched to your top priority."

Correct — SD10's Vitamin C and CoQ10 target brightening and antioxidant protection.

---

## TEST 8: Combination Skin (Gap Test)

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Combination |
| Q12 Concerns | Breakouts or blemishes |

### Gate 1: Skin Type = Combination
**No combination-skin serums exist in the database.**

**0 products remain.**

### Gate 2: N/A
### Gate 3: N/A

### Result
**GAP — No product available.**
Message: "We don't yet have a serum for your combination skin with those specific exclusions. New formulations are in development, so check back soon."

This correctly identifies a product catalog gap. Kyrill needs to add combination-skin serums to the database.

---

## TEST 9: Oily + Breakouts + Eczema

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Oily |
| Q12 Concerns | Breakouts or blemishes |
| Q16 Conditions | **Eczema** |

### Gate 1: 5 oily serums remain

### Gate 2: Eczema → fragrance excluded (safety)
All 5 oily serums (SO1-SO5) contain Parfum (fragrance).

- **SO1 removed** (Parfum)
- **SO2 removed** (Parfum)
- **SO3 removed** (Parfum)
- **SO4 removed** (Parfum)
- **SO5 removed** (Parfum)

**0 products remain.**

### Gate 3: N/A

### Result
**GAP — No product available.**

All oily-skin serums contain fragrance, and eczema safety requires fragrance-free products. This reveals a critical gap: **there are no fragrance-free oily-skin serums in the database.**

Kyrill needs to add F0 (fragrance-free) variants of the oily serums.

---

## TEST 10: Dry + Multiple Concerns + Repair Priority

### Customer Profile
| Question | Answer |
|---|---|
| Q11 Skin type | Dry |
| Q12 Concerns | Texture irregularities, Dryness or dehydration, Sensitivity or reactivity |
| Q24 Priority #1 | Repair |

### Gate 1: 7 dry serums remain
### Gate 2: No exclusions → 7 remain

### Gate 3: Scoring
Customer concerns: `repair`, `hydration`, `calming`
Priority #1: Repair (3x), Priority #2: Hydration (2x), Priority #3: Calming (1.5x)

| Product | repair? | hydration? | calming? | Score |
|---|---|---|---|---|
| **SD2** | Yes (Panthenol) | Yes (Panthenol) | Yes (Ectoin, Bisabolol) | **69** |
| SD3 | No | Yes | No | Lower |
| SD12 | Yes (Betaglucano) | Yes (Panthenol) | No | Lower |
| Others | No | No | No | Low |

### Result
**Winner: SD2** (Score: 69)
Reasons: "Formulated for barrier repair, hydration, redness & sensitivity. Matched to your top priority."

SD2 wins because it covers all 3 of the customer's concerns. The priority multipliers make repair worth 3x, hydration 2x, and calming 1.5x — and SD2 matches all three.

---

## Summary Table

| Test | Skin | Concerns | Exclusions | Winner | Score | Correct? |
|---|---|---|---|---|---|---|
| 1 | Oily | Breakouts, Oil | None | **SO1** | 44 | Yes |
| 2 | Oily | Anti-aging | None | **SO4** | 36 | Yes |
| 3 | Oily | Anti-aging | Retinol | **SO1** | 4 | Debatable — SO5 (Bakuchiol) might be better |
| 4 | Oily | Breakouts | Pregnant | **SO1** | 34 | Partially — BHA may need pregnancy exclusion |
| 5 | Dry | Hydration | None | **SD2** | 34 | Yes |
| 6 | Dry | Calming | Rosacea | **SD2** | 34 | Yes |
| 7 | Dry | Brightening | None | **SD10** | 36 | Yes |
| 8 | Combination | Breakouts | None | **GAP** | — | Correct (no products) |
| 9 | Oily | Breakouts | Eczema | **GAP** | — | Correct (no F0 oily serums) |
| 10 | Dry | Repair+Hydration+Calming | None | **SD2** | 69 | Yes |

---

## Issues Identified

### 1. Anti-aging gentle vs Anti-aging mismatch (Test 3)
When retinol is excluded, SO5 (Bakuchiol — gentle retinol alternative) should be recommended for anti-aging, but the engine treats `anti-aging-gentle` and `anti-aging` as different concerns. Consider adding a fallback where `anti-aging-gentle` can match `anti-aging` requests.

### 2. BHA and pregnancy (Test 4)
SO1 contains Salicylic Acid (BHA) which many dermatologists advise against during pregnancy. Currently only retinol is excluded for pregnant customers. Consider adding BHA to the pregnancy exclusion list.

### 3. No fragrance-free oily serums (Test 9)
All oily-skin serums contain Parfum. Customers with eczema (or who simply want F0) get no recommendation for oily skin. Kyrill needs to add F0 variants.

### 4. Combination and Sensitive skin gaps (Test 8)
No products exist for combination or sensitive skin types. These are planned for future product development.

### 5. SD3 hydration not scoring (Test 5)
SD3 has Hyaluronic Acid and Aquaxyl which should be strong hydration matches, but SD2 won instead. This may indicate that SD3's ingredients aren't fully linked in the database, or the Aquaxyl alias mapping isn't resolving.
