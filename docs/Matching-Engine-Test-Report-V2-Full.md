# Matching Engine Test Report V2 — Full Results
**Test Database (epbyhiagcnbyznvmbebj) — 71 products with concern_tags**
**Date: 25 March 2026**

---

## Engine Configuration

- **Gate 1:** Skin type filter (Q11)
- **Gate 2:** Safety exclusions (Q10 pregnancy, Q16 conditions, Q29 ingredient exclusions + product safety flags + ingredient map)
- **Gate 3 — Scoring:**
  - Check 1: Product `concern_tags` matched against Q12 answers (10 pts x multiplier). Fallback: ingredient `skincare_priorities`. Hardcoded map: DISABLED.
  - Check 2: Ingredient `skincare_priorities` from DB matched against Q24 ranking (5 pts x multiplier)
  - Bonus: Active ingredient count x 2
  - TOTAL = Check 1 + Check 2 + Bonus. Highest wins.
- **All 71 products have concern_tags**

---

## Test 1: Young oily urban female - Breakouts focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Female |
| Q3 Region | Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland) |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 4 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 3; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 3 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Oily: shiny all over, especially T-zone |
| Q12 Concerns | Breakouts or blemishes; Oiliness or excess shine; Enlarged pores |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Slightly oily: shine returns quickly |
| Q15 Breakout Frequency | Frequently, multiple times per month |
| Q16 Conditions | None of the above |
| Q17 Pores (1-5) | 4 |
| Q18 Skin Tone | Fair: sometimes burns, tans gradually |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 4; Redness Level: 2; Firmness / Elasticity: 4 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 3–4 steps: cleanser, serum, moisturiser, SPF |
| Q22 Moisturizer Texture | Lightweight gel: absorbs instantly, no residue |
| Q23 Cleanser Type | Foaming / Gel cleanser: fresh, squeaky-clean feel |
| Q24 Priority Ranking | Clarifying (control oil, minimise breakouts); Brightening (even tone, radiance); Anti-aging (wrinkles, firmness, elasticity); Hydration (plump, dewy, moisturised); Calming (reduce redness, soothe irritation); Repair (strengthen barrier, heal damage) |
| Q25 Ingredient Philosophy | Science-first: proven clinical actives; Clean beauty: no parabens, SLS, silicones |
| Q26 Adventurousness (1-5) | 4 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | 2–5 minutes, quick but considered |
| Q29 Exclusions | Nothing specific, I’m open to everything |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Oily: shiny all over, especially T-zone" -> **oily**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: None of the above
- Q29 Exclusions: Nothing specific, I’m open to everything
- Product safety flags: pregnancy=false, rosacea=false, eczema=false, retinol=false, bha=true, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SO1** |
| **Score** | 91.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | acne, oil-control |
| **Reasons** | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| **Product concern_tags** | Breakouts or blemishes; Lack of firmness; Redness or irritation; Enlarged pores; Oiliness or excess shine; Texture irregularities |

---

## Test 2: Mature dry rural female - Anti-aging focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 55–64 |
| Q2 Sex | Female |
| Q3 Region | Eastern Europe (Romania, Bulgaria, Ukraine, Russia) |
| Q4 Environment | Rural / Countryside |
| Q5 Water (1-5) | 4 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 2 |
| Q8 Diet | Vegetables & Fruits: 5; Dairy: 2; Sugar & Processed Foods: 1; Omega-Rich Foods: Fish, Nuts, Seeds: 4 |
| Q9 Sun (1-5) | 3 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Dry: tight, flaky, sometimes rough |
| Q12 Concerns | Fine lines or wrinkles; Lack of firmness; Dryness or dehydration |
| Q13 Sun Sensitivity (1-5) | 4 |
| Q14 Post-Cleanse Feel | Tight and dry: needs moisture immediately |
| Q15 Breakout Frequency | Rarely or never |
| Q16 Conditions | None of the above |
| Q17 Pores (1-5) | 2 |
| Q18 Skin Tone | Medium: rarely burns, tans well |
| Q19 Current State | Hydration Level: 2; Oiliness Level: 1; Redness Level: 2; Firmness / Elasticity: 2 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 3–4 steps: cleanser, serum, moisturiser, SPF |
| Q22 Moisturizer Texture | Cream: rich and nourishing |
| Q23 Cleanser Type | Cream / Milk cleanser: soft, non-stripping |
| Q24 Priority Ranking | Anti-aging (wrinkles, firmness, elasticity); Hydration (plump, dewy, moisturised); Repair (strengthen barrier, heal damage); Brightening (even tone, radiance); Calming (reduce redness, soothe irritation); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Natural / botanical-forward formulas; Sustainably sourced ingredients |
| Q26 Adventurousness (1-5) | 3 |
| Q27 Retinol Experience | Yes, occasionally. I use it a few times a month |
| Q28 Routine Time | 5–10 minutes, I enjoy the process |
| Q29 Exclusions | Nothing specific, I’m open to everything |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Dry: tight, flaky, sometimes rough" -> **dry**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: None of the above
- Q29 Exclusions: Nothing specific, I’m open to everything
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SD3** |
| **Score** | 103.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | anti-aging, hydration |
| **Reasons** | Formulated for fine lines & wrinkles, hydration | Matched to your top priority | Ingredients aligned with your #1 priority: Anti-aging |
| **Product concern_tags** | Dullness or tired-looking skin; Fine lines or wrinkles; Redness or irritation; Dryness or dehydration; Texture irregularities; Sensitivity or reactivity |

---

## Test 3: Young oily male - Anti-aging but NO retinol

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Male |
| Q3 Region | North America |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 4 |
| Q8 Diet | Vegetables & Fruits: 3; Dairy: 3; Sugar & Processed Foods: 3; Omega-Rich Foods: Fish, Nuts, Seeds: 2 |
| Q9 Sun (1-5) | 3 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Oily: shiny all over, especially T-zone |
| Q12 Concerns | Fine lines or wrinkles |
| Q13 Sun Sensitivity (1-5) | 2 |
| Q14 Post-Cleanse Feel | Slightly oily: shine returns quickly |
| Q15 Breakout Frequency | Occasionally, a few times per year |
| Q16 Conditions | None of the above |
| Q17 Pores (1-5) | 3 |
| Q18 Skin Tone | Dark: never burns |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 4; Redness Level: 1; Firmness / Elasticity: 3 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 2 steps: cleanser + moisturiser |
| Q22 Moisturizer Texture | Lightweight gel: absorbs instantly, no residue |
| Q23 Cleanser Type | Foaming / Gel cleanser: fresh, squeaky-clean feel |
| Q24 Priority Ranking | Anti-aging (wrinkles, firmness, elasticity); Clarifying (control oil, minimise breakouts); Brightening (even tone, radiance); Hydration (plump, dewy, moisturised); Repair (strengthen barrier, heal damage); Calming (reduce redness, soothe irritation) |
| Q25 Ingredient Philosophy | Science-first: proven clinical actives |
| Q26 Adventurousness (1-5) | 2 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | Under 2 minutes, I want it fast |
| Q29 Exclusions | Retinol / retinoids |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Oily: shiny all over, especially T-zone" -> **oily**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: None of the above
- Q29 Exclusions: Retinol / retinoids
- Product safety flags: pregnancy=false, rosacea=false, eczema=false, retinol=false, bha=true, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SO1** |
| **Score** | 81.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | anti-aging |
| **Reasons** | Formulated for fine lines & wrinkles | Matched to your top priority | Ingredients aligned with your #1 priority: Anti-aging |
| **Product concern_tags** | Breakouts or blemishes; Lack of firmness; Redness or irritation; Enlarged pores; Oiliness or excess shine; Texture irregularities |

---

## Test 4: Pregnant oily female - Breakouts

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Female |
| Q3 Region | Southern Europe (Mediterranean, Balkans) |
| Q4 Environment | Suburban |
| Q5 Water (1-5) | 4 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 3; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 3 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | Yes |
| Q11 Skin Type | Oily: shiny all over, especially T-zone |
| Q12 Concerns | Breakouts or blemishes; Oiliness or excess shine |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Slightly oily: shine returns quickly |
| Q15 Breakout Frequency | Monthly, often around my cycle |
| Q16 Conditions | Hormonal acne (jawline, chin) |
| Q17 Pores (1-5) | 3 |
| Q18 Skin Tone | Olive: almost never burns |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 4; Redness Level: 2; Firmness / Elasticity: 4 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 2 steps: cleanser + moisturiser |
| Q22 Moisturizer Texture | Lotion: light but hydrating |
| Q23 Cleanser Type | Cream / Milk cleanser: soft, non-stripping |
| Q24 Priority Ranking | Clarifying (control oil, minimise breakouts); Calming (reduce redness, soothe irritation); Hydration (plump, dewy, moisturised); Anti-aging (wrinkles, firmness, elasticity); Brightening (even tone, radiance); Repair (strengthen barrier, heal damage) |
| Q25 Ingredient Philosophy | Clean beauty: no parabens, SLS, silicones; Fragrance-free |
| Q26 Adventurousness (1-5) | 1 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | Under 2 minutes, I want it fast |
| Q29 Exclusions | Retinol / retinoids; Exfoliating acids (AHA, BHA) |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Oily: shiny all over, especially T-zone" -> **oily**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: Yes
- Q16 Conditions: Hormonal acne (jawline, chin)
- Q29 Exclusions: Retinol / retinoids; Exfoliating acids (AHA, BHA)
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=true

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SO3** |
| **Score** | 86.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | acne, oil-control |
| **Reasons** | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| **Product concern_tags** | Breakouts or blemishes; Uneven skin tone or dark spots; Redness or irritation; Enlarged pores; Oiliness or excess shine; Texture irregularities; Sensitivity or reactivity; Under-eye concerns (dark circles; puffiness) |

---

## Test 5: Dry + Rosacea - Calming focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 35–44 |
| Q2 Sex | Female |
| Q3 Region | Northern Europe (Scandinavia, Baltics, UK, Ireland) |
| Q4 Environment | Suburban |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 4 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 2; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 4 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Dry: tight, flaky, sometimes rough |
| Q12 Concerns | Redness or irritation; Sensitivity or reactivity; Dryness or dehydration |
| Q13 Sun Sensitivity (1-5) | 4 |
| Q14 Post-Cleanse Feel | Irritated or red: even water feels harsh |
| Q15 Breakout Frequency | Rarely or never |
| Q16 Conditions | Rosacea or redness-prone skin |
| Q17 Pores (1-5) | 2 |
| Q18 Skin Tone | Very fair: burns easily, rarely tans |
| Q19 Current State | Hydration Level: 2; Oiliness Level: 1; Redness Level: 5; Firmness / Elasticity: 3 |
| Q20 Allergies | Yes, to fragrance or essential oils |
| Q21 Routine Steps | 2 steps: cleanser + moisturiser |
| Q22 Moisturizer Texture | Cream: rich and nourishing |
| Q23 Cleanser Type | Cream / Milk cleanser: soft, non-stripping |
| Q24 Priority Ranking | Calming (reduce redness, soothe irritation); Hydration (plump, dewy, moisturised); Repair (strengthen barrier, heal damage); Anti-aging (wrinkles, firmness, elasticity); Brightening (even tone, radiance); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Fragrance-free; Natural / botanical-forward formulas |
| Q26 Adventurousness (1-5) | 1 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | 2–5 minutes, quick but considered |
| Q29 Exclusions | Fragrance / essential oils; Exfoliating acids (AHA, BHA) |
| Q30 Free Text | I have very reactive skin. My dermatologist told me to avoid fragrance. |

### Gate 1 — Skin Type Filter

- Q11 = "Dry: tight, flaky, sometimes rough" -> **dry**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: Rosacea or redness-prone skin
- Q29 Exclusions: Fragrance / essential oils; Exfoliating acids (AHA, BHA)
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SD2** |
| **Score** | 103.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | calming, hydration |
| **Reasons** | Formulated for redness & sensitivity, hydration | Matched to your top priority | Ingredients aligned with your #1 priority: Calming |
| **Product concern_tags** | Redness or irritation; Dryness or dehydration; Texture irregularities; Sensitivity or reactivity |

---

## Test 6: Dry + Eczema - Hydration focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 35–44 |
| Q2 Sex | Female |
| Q3 Region | Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland) |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 4 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 2 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 1; Sugar & Processed Foods: 1; Omega-Rich Foods: Fish, Nuts, Seeds: 4 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Dry: tight, flaky, sometimes rough |
| Q12 Concerns | Dryness or dehydration; Sensitivity or reactivity; Texture irregularities |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Tight and dry: needs moisture immediately |
| Q15 Breakout Frequency | Rarely or never |
| Q16 Conditions | Eczema or atopic dermatitis |
| Q17 Pores (1-5) | 1 |
| Q18 Skin Tone | Fair: sometimes burns, tans gradually |
| Q19 Current State | Hydration Level: 1; Oiliness Level: 1; Redness Level: 3; Firmness / Elasticity: 3 |
| Q20 Allergies | Yes, to fragrance or essential oils |
| Q21 Routine Steps | 2 steps: cleanser + moisturiser |
| Q22 Moisturizer Texture | Balm / Oil: very rich, cocooning |
| Q23 Cleanser Type | Oil / Balm cleanser: dissolves everything, luxurious |
| Q24 Priority Ranking | Hydration (plump, dewy, moisturised); Repair (strengthen barrier, heal damage); Calming (reduce redness, soothe irritation); Anti-aging (wrinkles, firmness, elasticity); Brightening (even tone, radiance); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Fragrance-free; Natural / botanical-forward formulas; Vegan / cruelty-free |
| Q26 Adventurousness (1-5) | 1 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | 2–5 minutes, quick but considered |
| Q29 Exclusions | Fragrance / essential oils |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Dry: tight, flaky, sometimes rough" -> **dry**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: Eczema or atopic dermatitis
- Q29 Exclusions: Fragrance / essential oils
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SD2** |
| **Score** | 118.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | hydration, calming, repair |
| **Reasons** | Formulated for hydration, redness & sensitivity, barrier repair | Matched to your top priority | Ingredients aligned with your #1 priority: Hydration |
| **Product concern_tags** | Redness or irritation; Dryness or dehydration; Texture irregularities; Sensitivity or reactivity |

---

## Test 7: Combination - Brightening focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 35–44 |
| Q2 Sex | Female |
| Q3 Region | Asia / Middle East |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 2; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 4 |
| Q9 Sun (1-5) | 4 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Combination: oily T-zone, dry cheeks |
| Q12 Concerns | Uneven skin tone or dark spots; Dullness or tired-looking skin |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Comfortable: feels balanced |
| Q15 Breakout Frequency | Occasionally, a few times per year |
| Q16 Conditions | Melasma or post-inflammatory hyperpigmentation |
| Q17 Pores (1-5) | 2 |
| Q18 Skin Tone | Medium: rarely burns, tans well |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 3; Redness Level: 2; Firmness / Elasticity: 3 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 3–4 steps: cleanser, serum, moisturiser, SPF |
| Q22 Moisturizer Texture | Lotion: light but hydrating |
| Q23 Cleanser Type | Micellar / Lotion: gentle, no-rinse |
| Q24 Priority Ranking | Brightening (even tone, radiance); Anti-aging (wrinkles, firmness, elasticity); Hydration (plump, dewy, moisturised); Calming (reduce redness, soothe irritation); Repair (strengthen barrier, heal damage); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Science-first: proven clinical actives |
| Q26 Adventurousness (1-5) | 4 |
| Q27 Retinol Experience | Tried once or twice, didn’t stick with it |
| Q28 Routine Time | 5–10 minutes, I enjoy the process |
| Q29 Exclusions | Nothing specific, I’m open to everything |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Combination: oily T-zone, dry cheeks" -> **combination**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: Melasma or post-inflammatory hyperpigmentation
- Q29 Exclusions: Nothing specific, I’m open to everything
- Product safety flags: pregnancy=false, rosacea=false, eczema=false, retinol=true, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SC3** |
| **Score** | 93.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | hyperpigmentation, brightening |
| **Reasons** | Formulated for dark spots, dullness & uneven tone | Matched to your top priority | Ingredients aligned with your #1 priority: Brightening |
| **Product concern_tags** | Uneven skin tone or dark spots; Dullness or tired-looking skin; Fine lines or wrinkles; Lack of firmness; Redness or irritation; Texture irregularities; Sensitivity or reactivity |

---

## Test 8: Sensitive - Calming focus

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Female |
| Q3 Region | Northern Europe (Scandinavia, Baltics, UK, Ireland) |
| Q4 Environment | Suburban |
| Q5 Water (1-5) | 4 |
| Q6 Sleep (1-5) | 4 |
| Q7 Stress (1-5) | 2 |
| Q8 Diet | Vegetables & Fruits: 5; Dairy: 1; Sugar & Processed Foods: 1; Omega-Rich Foods: Fish, Nuts, Seeds: 5 |
| Q9 Sun (1-5) | 1 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Sensitive: easily irritated, reactive to new products |
| Q12 Concerns | Redness or irritation; Sensitivity or reactivity |
| Q13 Sun Sensitivity (1-5) | 5 |
| Q14 Post-Cleanse Feel | Irritated or red: even water feels harsh |
| Q15 Breakout Frequency | Rarely or never |
| Q16 Conditions | Contact allergies to cosmetic ingredients |
| Q17 Pores (1-5) | 1 |
| Q18 Skin Tone | Very fair: burns easily, rarely tans |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 1; Redness Level: 4; Firmness / Elasticity: 4 |
| Q20 Allergies | I have multiple known sensitivities |
| Q21 Routine Steps | 1 step: I just wash my face |
| Q22 Moisturizer Texture | Cream: rich and nourishing |
| Q23 Cleanser Type | Cream / Milk cleanser: soft, non-stripping |
| Q24 Priority Ranking | Calming (reduce redness, soothe irritation); Hydration (plump, dewy, moisturised); Repair (strengthen barrier, heal damage); Brightening (even tone, radiance); Anti-aging (wrinkles, firmness, elasticity); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Fragrance-free; Clean beauty: no parabens, SLS, silicones; Natural / botanical-forward formulas |
| Q26 Adventurousness (1-5) | 1 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | Under 2 minutes, I want it fast |
| Q29 Exclusions | Fragrance / essential oils; Retinol / retinoids; Exfoliating acids (AHA, BHA) |
| Q30 Free Text | Very sensitive skin, react to almost everything. |

### Gate 1 — Skin Type Filter

- Q11 = "Sensitive: easily irritated, reactive to new products" -> **sensitive**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: Contact allergies to cosmetic ingredients
- Q29 Exclusions: Fragrance / essential oils; Retinol / retinoids; Exfoliating acids (AHA, BHA)
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SS5** |
| **Score** | 83.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | calming |
| **Reasons** | Formulated for redness & sensitivity | Matched to your top priority | Ingredients aligned with your #1 priority: Calming |
| **Product concern_tags** | Dullness or tired-looking skin; Redness or irritation; Dryness or dehydration; Sensitivity or reactivity; Under-eye concerns (dark circles; puffiness) |

---

## Test 9: Oily male - Excludes BHA + PEGs

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Male |
| Q3 Region | Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland) |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 4 |
| Q8 Diet | Vegetables & Fruits: 3; Dairy: 3; Sugar & Processed Foods: 4; Omega-Rich Foods: Fish, Nuts, Seeds: 2 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Oily: shiny all over, especially T-zone |
| Q12 Concerns | Breakouts or blemishes; Enlarged pores; Oiliness or excess shine |
| Q13 Sun Sensitivity (1-5) | 2 |
| Q14 Post-Cleanse Feel | Slightly oily: shine returns quickly |
| Q15 Breakout Frequency | Frequently, multiple times per month |
| Q16 Conditions | None of the above |
| Q17 Pores (1-5) | 4 |
| Q18 Skin Tone | Dark: never burns |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 5; Redness Level: 1; Firmness / Elasticity: 4 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 1 step: I just wash my face |
| Q22 Moisturizer Texture | Lightweight gel: absorbs instantly, no residue |
| Q23 Cleanser Type | Foaming / Gel cleanser: fresh, squeaky-clean feel |
| Q24 Priority Ranking | Clarifying (control oil, minimise breakouts); Brightening (even tone, radiance); Anti-aging (wrinkles, firmness, elasticity); Hydration (plump, dewy, moisturised); Calming (reduce redness, soothe irritation); Repair (strengthen barrier, heal damage) |
| Q25 Ingredient Philosophy | Science-first: proven clinical actives |
| Q26 Adventurousness (1-5) | 4 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | Under 2 minutes, I want it fast |
| Q29 Exclusions | Exfoliating acids (AHA, BHA); PEGs |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Oily: shiny all over, especially T-zone" -> **oily**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: None of the above
- Q29 Exclusions: Exfoliating acids (AHA, BHA); PEGs
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=true

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SO3** |
| **Score** | 84 |
| **Source** | concern_tags |
| **Check 1 Matched** | acne, oil-control |
| **Reasons** | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| **Product concern_tags** | Breakouts or blemishes; Uneven skin tone or dark spots; Redness or irritation; Enlarged pores; Oiliness or excess shine; Texture irregularities; Sensitivity or reactivity; Under-eye concerns (dark circles; puffiness) |

---

## Test 10: Dry female - Multiple concerns, Repair #1

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 45–54 |
| Q2 Sex | Female |
| Q3 Region | Eastern Europe (Romania, Bulgaria, Ukraine, Russia) |
| Q4 Environment | Rural / Countryside |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 4; Dairy: 2; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 3 |
| Q9 Sun (1-5) | 3 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Dry: tight, flaky, sometimes rough |
| Q12 Concerns | Texture irregularities; Dryness or dehydration; Sensitivity or reactivity |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Tight and dry: needs moisture immediately |
| Q15 Breakout Frequency | Rarely or never |
| Q16 Conditions | None of the above |
| Q17 Pores (1-5) | 2 |
| Q18 Skin Tone | Medium: rarely burns, tans well |
| Q19 Current State | Hydration Level: 2; Oiliness Level: 1; Redness Level: 2; Firmness / Elasticity: 3 |
| Q20 Allergies | No, never |
| Q21 Routine Steps | 3–4 steps: cleanser, serum, moisturiser, SPF |
| Q22 Moisturizer Texture | Cream: rich and nourishing |
| Q23 Cleanser Type | Oil / Balm cleanser: dissolves everything, luxurious |
| Q24 Priority Ranking | Repair (strengthen barrier, heal damage); Hydration (plump, dewy, moisturised); Calming (reduce redness, soothe irritation); Anti-aging (wrinkles, firmness, elasticity); Brightening (even tone, radiance); Clarifying (control oil, minimise breakouts) |
| Q25 Ingredient Philosophy | Natural / botanical-forward formulas; Sustainably sourced ingredients |
| Q26 Adventurousness (1-5) | 3 |
| Q27 Retinol Experience | Tried once or twice, didn’t stick with it |
| Q28 Routine Time | 5–10 minutes, I enjoy the process |
| Q29 Exclusions | Nothing specific, I’m open to everything |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Dry: tight, flaky, sometimes rough" -> **dry**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: None of the above
- Q29 Exclusions: Nothing specific, I’m open to everything
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SD2** |
| **Score** | 118.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | repair, hydration, calming |
| **Reasons** | Formulated for barrier repair, hydration, redness & sensitivity | Matched to your top priority | Ingredients aligned with your #1 priority: Repair |
| **Product concern_tags** | Redness or irritation; Dryness or dehydration; Texture irregularities; Sensitivity or reactivity |

---

## Test 11: Oily + Eczema (gap test)

### Quiz Answers

| Question | Answer |
|---|---|
| Q1 Age | 25–34 |
| Q2 Sex | Female |
| Q3 Region | Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland) |
| Q4 Environment | Urban / City centre |
| Q5 Water (1-5) | 3 |
| Q6 Sleep (1-5) | 3 |
| Q7 Stress (1-5) | 3 |
| Q8 Diet | Vegetables & Fruits: 3; Dairy: 2; Sugar & Processed Foods: 2; Omega-Rich Foods: Fish, Nuts, Seeds: 3 |
| Q9 Sun (1-5) | 2 |
| Q10 Pregnant? | No |
| Q11 Skin Type | Oily: shiny all over, especially T-zone |
| Q12 Concerns | Breakouts or blemishes |
| Q13 Sun Sensitivity (1-5) | 3 |
| Q14 Post-Cleanse Feel | Slightly oily: shine returns quickly |
| Q15 Breakout Frequency | Frequently, multiple times per month |
| Q16 Conditions | Eczema or atopic dermatitis |
| Q17 Pores (1-5) | 3 |
| Q18 Skin Tone | Fair: sometimes burns, tans gradually |
| Q19 Current State | Hydration Level: 3; Oiliness Level: 4; Redness Level: 3; Firmness / Elasticity: 4 |
| Q20 Allergies | Yes, to fragrance or essential oils |
| Q21 Routine Steps | 2 steps: cleanser + moisturiser |
| Q22 Moisturizer Texture | Lightweight gel: absorbs instantly, no residue |
| Q23 Cleanser Type | Foaming / Gel cleanser: fresh, squeaky-clean feel |
| Q24 Priority Ranking | Clarifying (control oil, minimise breakouts); Calming (reduce redness, soothe irritation); Hydration (plump, dewy, moisturised); Anti-aging (wrinkles, firmness, elasticity); Brightening (even tone, radiance); Repair (strengthen barrier, heal damage) |
| Q25 Ingredient Philosophy | Fragrance-free; Clean beauty: no parabens, SLS, silicones |
| Q26 Adventurousness (1-5) | 1 |
| Q27 Retinol Experience | Never, I’m a retinol beginner |
| Q28 Routine Time | Under 2 minutes, I want it fast |
| Q29 Exclusions | Fragrance / essential oils |
| Q30 Free Text | (empty) |

### Gate 1 — Skin Type Filter

- Q11 = "Oily: shiny all over, especially T-zone" -> **oily**

### Gate 2 — Safety Exclusions

- Q10 Pregnant: No
- Q16 Conditions: Eczema or atopic dermatitis
- Q29 Exclusions: Fragrance / essential oils
- Product safety flags: pregnancy=true, rosacea=true, eczema=true, retinol=false, bha=false, pegs=false, fragrance=false

### Gate 3 — Scoring

| Field | Value |
|---|---|
| **Winner** | **SO5** |
| **Score** | 51.5 |
| **Source** | concern_tags |
| **Check 1 Matched** | (none) |
| **Reasons** | Ingredients aligned with your #1 priority: Clarifying |
| **Product concern_tags** | Fine lines or wrinkles; Redness or irritation; Dryness or dehydration; Texture irregularities; Sensitivity or reactivity; Under-eye concerns (dark circles; puffiness) |

---

## Summary

| Test | Persona | Winner | Score | Source | Check 1 Matched | Reasons |
|---|---|---|---|---|---|---|
| 1 | Young oily urban female - Breakouts focus | **SO1** | 91.5 | concern_tags | acne, oil-control | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| 2 | Mature dry rural female - Anti-aging focus | **SD3** | 103.5 | concern_tags | anti-aging, hydration | Formulated for fine lines & wrinkles, hydration | Matched to your top priority | Ingredients aligned with your #1 priority: Anti-aging |
| 3 | Young oily male - Anti-aging but NO retinol | **SO1** | 81.5 | concern_tags | anti-aging | Formulated for fine lines & wrinkles | Matched to your top priority | Ingredients aligned with your #1 priority: Anti-aging |
| 4 | Pregnant oily female - Breakouts | **SO3** | 86.5 | concern_tags | acne, oil-control | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| 5 | Dry + Rosacea - Calming focus | **SD2** | 103.5 | concern_tags | calming, hydration | Formulated for redness & sensitivity, hydration | Matched to your top priority | Ingredients aligned with your #1 priority: Calming |
| 6 | Dry + Eczema - Hydration focus | **SD2** | 118.5 | concern_tags | hydration, calming, repair | Formulated for hydration, redness & sensitivity, barrier repair | Matched to your top priority | Ingredients aligned with your #1 priority: Hydration |
| 7 | Combination - Brightening focus | **SC3** | 93.5 | concern_tags | hyperpigmentation, brightening | Formulated for dark spots, dullness & uneven tone | Matched to your top priority | Ingredients aligned with your #1 priority: Brightening |
| 8 | Sensitive - Calming focus | **SS5** | 83.5 | concern_tags | calming | Formulated for redness & sensitivity | Matched to your top priority | Ingredients aligned with your #1 priority: Calming |
| 9 | Oily male - Excludes BHA + PEGs | **SO3** | 84 | concern_tags | acne, oil-control | Formulated for breakouts & blemishes, oil control | Matched to your top priority | Ingredients aligned with your #1 priority: Clarifying |
| 10 | Dry female - Multiple concerns, Repair #1 | **SD2** | 118.5 | concern_tags | repair, hydration, calming | Formulated for barrier repair, hydration, redness & sensitivity | Matched to your top priority | Ingredients aligned with your #1 priority: Repair |
| 11 | Oily + Eczema (gap test) | **SO5** | 51.5 | concern_tags | (none) | Ingredients aligned with your #1 priority: Clarifying |
