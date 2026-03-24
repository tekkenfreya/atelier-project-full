# Atelier Rusalka — Online Consultation Quiz
**Functional Requirements Specification**

> **Purpose:** This document defines each quiz question, its UI type, answer options, "Why We Ask" copy, and the backend recommendation logic for the IT developer.

- 30 Questions · 3 Sections · Personalized Product Recommendation
- *Atelier Rusalka · Confidential · March 2026*

---

## Quiz Structure Overview

| Section | Questions | Focus | Role |
|---|---|---|---|
| **Section 1: About You** | Q1–Q10 | Demographics, lifestyle, environment | Establishes user's baseline profile |
| **Section 2: Your Skin** | Q11–Q20 | Skin type, concerns, conditions | PRIMARY routing layer |
| **Section 3: Your Routine & Preferences** | Q21–Q30 | Product preferences, values, exclusions | FILTER & PERSONALISATION layer |

**Question Types Used:** Single Select · Multi-Select · Scale (1–5) · Multi-Scale Grid · Yes/No · Drag & Rank · Free Text

---

## Section 1 — About You
*Demographics, lifestyle & environment · 10 questions*

---

### Q1 — How old are you?
**UI:** Single Select

**Options:**
- Under 25
- 25–34
- 35–44
- 45–54
- 55–64
- 65+

**Why We Ask:**
Skin physiology changes with age — sebum production, collagen turnover, and hydration levels shift significantly across decades. This helps us select age-appropriate actives (e.g. peptides for 40+, gentle BHAs for younger skin).

**Recommendation Logic:**
Maps to age-adjusted formula selection. Under 25 → lighter formulations; 45+ → anti-aging actives like retinol, peptides, ceramides.

---

### Q2 — What is your biological sex?
**UI:** Single Select
> *This helps us account for hormonal differences that affect skin.*

**Options:**
- Female
- Male
- Prefer not to say

**Why We Ask:**
Hormonal profiles differ between biological sexes, influencing sebum production, skin thickness, and sensitivity patterns. We use this to fine-tune ingredient concentrations.

**Recommendation Logic:**
Male skin tends to be thicker, oilier → higher active concentrations tolerated. Female skin may be more reactive to hormonal fluctuations.

---

### Q3 — Where do you live?
**UI:** Single Select
> *Your environment impacts your skin more than you think.*

**Options:**
- Northern Europe (Scandinavia, Baltics, UK, Ireland)
- Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland)
- Southern Europe (Mediterranean, Balkans)
- Eastern Europe (Romania, Bulgaria, Ukraine, Russia)
- North America
- Asia / Middle East
- Other

**Why We Ask:**
Climate, UV index, humidity, and water hardness vary by region and directly affect skin hydration, barrier function, and aging speed.

**Recommendation Logic:**
Cold/dry climates → richer formulations, barrier-focused. Mediterranean → lighter textures, UV-repair focus. Urban → anti-pollution actives.

---

### Q4 — How would you describe your environment?
**UI:** Single Select

**Options:**
- Urban / City centre
- Suburban
- Rural / Countryside

**Why We Ask:**
Urban environments expose skin to higher levels of pollution, particulate matter, and blue light — all of which accelerate oxidative stress and premature aging.

**Recommendation Logic:**
Urban → formulas with antioxidant actives (resveratrol, vitamin C, green tea). Rural → focus on climate-driven needs (hydration, barrier).

---

### Q5 — How much water do you drink daily?
**UI:** Scale (1–5)
> *Scale: Less than 1L → ~1.5L → 2L+*

**Why We Ask:**
Internal hydration is the foundation of skin health. Chronic low water intake leads to dull, dehydrated skin regardless of topical products.

**Recommendation Logic:**
Low water intake (1–2) → prioritise deep hydration actives (hyaluronic acid, Aquaxyl). High intake (4–5) → can focus on other concerns.

---

### Q6 — How many hours of sleep do you typically get?
**UI:** Scale (1–5)
> *Scale: <5 hours → 6–7 hours → 8+ hours*

**Why We Ask:**
Skin repairs itself overnight. Poor sleep disrupts cortisol regulation, weakens the barrier, and accelerates signs of aging.

**Recommendation Logic:**
Poor sleep (1–2) → barrier repair and soothing actives (ectoin, panthenol, ceramides). Adequate sleep → standard formula path.

---

### Q7 — How would you rate your daily stress level?
**UI:** Scale (1–5)
> *Scale: Very low → Moderate → Very high*

**Why We Ask:**
Chronic stress elevates cortisol, which triggers inflammation, breakouts, and barrier disruption. High-stress skin needs calming, anti-inflammatory care.

**Recommendation Logic:**
High stress (4–5) → soothing botanicals (linden, chamomile, bisabolol), microbiome-protective actives (ectoin). Low stress → standard path.

---

### Q8 — How would you describe your diet?
**UI:** Multi-Scale Grid
> *Move the slider for each food group.*

| Food Group | Scale |
|---|---|
| Vegetables & Fruits | Rarely → Daily |
| Dairy | Rarely → Daily |
| Sugar & Processed Foods | Rarely → Daily |
| Omega-Rich Foods (Fish, Nuts, Seeds) | Rarely → Daily |

**Why We Ask:**
Diet directly impacts skin — dairy and sugar can trigger breakouts, while omega fatty acids and antioxidant-rich fruits support barrier health and reduce inflammation.

**Recommendation Logic:**
High dairy/sugar → breakout-prone formulas. Low omega intake → lipid-rich formulations. High fruit/veg → antioxidant base may be sufficient.

---

### Q9 — How much daily sun exposure do you get?
**UI:** Scale (1–5)
> *Scale: Minimal (<30 min) → Moderate (1–2 hrs) → Very high (4+ hrs)*

**Why We Ask:**
UV exposure is the #1 driver of premature skin aging, hyperpigmentation, and collagen breakdown. We adjust antioxidant and repair-active levels accordingly.

**Recommendation Logic:**
High exposure (4–5) → strong antioxidant cocktail (vitamin C, resveratrol, CoQ10), repair actives. Minimal → lighter antioxidant protection.

---

### Q10 — Are you currently pregnant or breastfeeding?
**UI:** Yes / No

**Options:**
- Yes
- No

**Why We Ask:**
Certain actives like retinol, salicylic acid (>2%), and some essential oils are contraindicated during pregnancy. We need to ensure your formula is 100% safe.

**Recommendation Logic:**
If Yes → EXCLUDE all retinoid formulas (SO4, SD4, SD9, CO12), limit BHA concentration. Route to pregnancy-safe alternatives (bakuchiol, azeloglycine).

---

## Section 2 — Your Skin
*Skin type, concerns & conditions · 10 questions*

---

### Q11 — How would you describe your skin type?
**UI:** Single Select
> *Think about how your skin feels by midday without any products.*

**Options:**
- Oily — shiny all over, especially T-zone
- Dry — tight, flaky, sometimes rough
- Combination — oily T-zone, dry cheeks
- Sensitive — easily irritated, reactive to new products

**Why We Ask:**
Your baseline skin type determines the product base and texture — from lightweight aqua-gels for oily skin to rich nutri-creams for dry skin.

**Recommendation Logic:**
**PRIMARY ROUTING VARIABLE.** Oily → O-bases (SO, CO, MO). Dry → D-bases (SD, CD, MD). Combination → C-bases (SC, CC, MC). Sensitive → S-bases (SS, CS, MS).

---

### Q12 — What are your biggest skin concerns right now?
**UI:** Multi-Select
> *Select all that apply — focus on what feels most pressing.*

**Options:**
- Breakouts or blemishes
- Dryness or dehydration
- Oiliness or excess shine
- Fine lines or wrinkles
- Lack of firmness
- Uneven skin tone or dark spots
- Enlarged pores
- Redness or irritation
- Dullness or tired-looking skin
- Sensitivity or reactivity
- Under-eye concerns (dark circles, puffiness)
- Texture irregularities

**Why We Ask:**
Your specific concerns guide us to the right active ingredients. Each concern maps to targeted actives in our botanical-rich formulas.

**Recommendation Logic:**
Multi-select maps to formula codes: Breakouts → BHA/zinc (SO1), Azeloglycine (SO3). Wrinkles → peptides/retinol (SO4, SD4, SD9). Brightening → TXA/niacinamide (SO2). Dryness → HA/aquaxyl (SD3). Sensitivity → ectoin/bisabolol (SD2). Dullness → vitamin C/CoQ10 (SD10).

---

### Q13 — How sensitive is your skin to the sun?
**UI:** Scale (1–5)
> *Scale: Never burns → Sometimes burns → Burns very easily*

**Why We Ask:**
Your photosensitivity indicates your skin's melanin levels and vulnerability to UV damage, which influences our choice of brightening and protective actives.

**Recommendation Logic:**
High sensitivity (4–5) → avoid photosensitising actives (high-dose retinol), prioritise soothing antioxidants. Low → can include TXA, retinoids freely.

---

### Q14 — How does your skin feel after cleansing with just water?
**UI:** Single Select
> *Think about 15 minutes after washing — no products applied.*

**Options:**
- Tight and dry — needs moisture immediately
- Comfortable — feels balanced
- Slightly oily — shine returns quickly
- Irritated or red — even water feels harsh

**Why We Ask:**
Post-cleanse behaviour is one of the most reliable indicators of your skin's natural lipid production and barrier integrity.

**Recommendation Logic:**
Validates Q11 skin type. Tight → confirms Dry. Oily → confirms Oily. Irritated → flags Sensitive override. Comfortable → Combination or Normal-leaning.

---

### Q15 — How often do you experience breakouts?
**UI:** Single Select

**Options:**
- Rarely or never
- Occasionally — a few times per year
- Monthly — often around my cycle
- Frequently — multiple times per month
- Constantly — always dealing with some form of breakout

**Why We Ask:**
Breakout frequency helps us determine whether you need a maintenance approach or an active acne-fighting regimen with ingredients like salicylic acid and zinc PCA.

**Recommendation Logic:**
Monthly+ → acne-targeted actives (BHA, zinc PCA, niacinamide, azeloglycine). Cycle-linked → hormonal profile flag. Rarely → skip acne actives, focus on other concerns.

---

### Q16 — Do you experience any of the following?
**UI:** Multi-Select
> *Select all that apply.*

**Options:**
- Rosacea or redness-prone skin
- Eczema or atopic dermatitis
- Psoriasis
- Hormonal acne (jawline, chin)
- Melasma or post-inflammatory hyperpigmentation
- Contact allergies to cosmetic ingredients
- None of the above

**Why We Ask:**
Pre-existing skin conditions require specific ingredient exclusions and gentler formulation approaches to avoid flare-ups.

**Recommendation Logic:**
Rosacea → exclude BHAs, strong actives; route to ultra-gentle (bisabolol, ectoin, chamomile). Eczema → ceramide-heavy, fragrance-free. Melasma → TXA + niacinamide priority. Allergies → flag for fragrance-free (F0) variants.

---

### Q17 — How visible are your pores?
**UI:** Scale (1–5)
> *Scale: Barely visible → Moderately visible → Extremely visible*

**Why We Ask:**
Pore visibility correlates with sebum production and skin texture. Enlarged pores benefit from pore-refining actives like niacinamide and BHA.

**Recommendation Logic:**
High visibility (4–5) → niacinamide-rich formulas (SO2), BHA (SO1). Low → skip pore-specific actives.

---

### Q18 — How would you describe your skin tone?
**UI:** Single Select
> *This helps us consider melanin-related concerns like hyperpigmentation.*

**Options:**
- Very fair — burns easily, rarely tans
- Fair — sometimes burns, tans gradually
- Medium — rarely burns, tans well
- Olive — almost never burns
- Dark — never burns
- Very dark

**Why We Ask:**
Melanin levels affect how your skin responds to ingredients like vitamin C, retinol, and exfoliating acids. Some actives need to be dosed differently for deeper skin tones to avoid irritation.

**Recommendation Logic:**
Deeper tones → careful with high-concentration AHAs/BHAs (risk of PIH). Prioritise gentler brightening (tranexamic acid over hydroquinone). Fair → standard active dosing.

---

### Q19 — Rate the following about your skin right now.
**UI:** Multi-Scale Grid
> *Move each slider to describe your current state.*

| Dimension | Scale |
|---|---|
| Hydration Level | Very low → Very high |
| Oiliness Level | Very low → Very high |
| Redness Level | Very low → Very high |
| Firmness / Elasticity | Very low → Very high |

**Why We Ask:**
A real-time snapshot of your skin's condition helps us fine-tune the formula beyond just your baseline skin type — because skin fluctuates with seasons, stress, and lifestyle.

**Recommendation Logic:**
Creates a dynamic skin profile overlay on top of Q11 base type. E.g., Dry type + high oiliness → may actually be dehydrated-oily (Combination routing).

---

### Q20 — Have you ever had an allergic reaction to a skincare product?
**UI:** Single Select

**Options:**
- No, never
- Yes — to fragrance or essential oils
- Yes — to a specific active ingredient
- Yes — but I'm not sure what caused it
- I have multiple known sensitivities

**Why We Ask:**
Ingredient sensitivities are critical safety information. We want to make sure your formula is both effective AND safe for your skin.

**Recommendation Logic:**
Fragrance allergy → route to F0 (fragrance-free) variant of all formulas. Active allergy → trigger follow-up to identify ingredient. Multiple sensitivities → Sensitive skin override + minimalist formulas (SD12, CD12).

---

## Section 3 — Your Routine & Preferences
*Preferences, values & exclusions · 10 questions*

---

### Q21 — How many steps is your current skincare routine?
**UI:** Single Select

**Options:**
- 1 step — I just wash my face
- 2 steps — cleanser + moisturiser
- 3–4 steps — cleanser, serum, moisturiser, SPF
- 5+ steps — I have an elaborate routine
- I don't have a routine yet

**Why We Ask:**
Your current routine complexity tells us how many products you're ready to manage. We'll recommend a regimen that fits your lifestyle — not one that overwhelms you.

**Recommendation Logic:**
1–2 steps → recommend a minimal set (1 cleanser + 1 serum-moisturiser hybrid). 3–4 → full trio (cleanser + serum + moisturiser). 5+ → can handle targeted layering.

---

### Q22 — What texture do you prefer in a moisturiser?
**UI:** Single Select

**Options:**
- Lightweight gel — absorbs instantly, no residue
- Lotion — light but hydrating
- Cream — rich and nourishing
- Balm / Oil — very rich, cocooning
- I'm not sure — surprise me

**Why We Ask:**
Texture preference is deeply personal and directly affects how likely you are to use a product consistently. The best formula is one you actually enjoy applying.

**Recommendation Logic:**
Gel → O-AquaGel / O-FilmGel bases. Lotion → C-bases. Cream → D-NutriCream bases. Balm/Oil → D-OmegaOil / C-OmegaBalm bases. Cross-referenced with skin type for final base selection.

---

### Q23 — What type of cleanser do you prefer?
**UI:** Single Select

**Options:**
- Foaming / Gel cleanser — fresh, squeaky-clean feel
- Cream / Milk cleanser — soft, non-stripping
- Oil / Balm cleanser — dissolves everything, luxurious
- Micellar / Lotion — gentle, no-rinse
- I'm not sure — recommend one for me

**Why We Ask:**
Cleanser preference impacts your entire routine. The wrong cleanser can strip your barrier or leave residue — getting this right is foundational.

**Recommendation Logic:**
Foam/Gel → C-LowFoamLotion bases (CO9, CO12). Cream/Milk → C-NutriCreamCleanser (CD2, CD3, CD7, CD12). Oil/Balm → C-OmegaBalm (CD9, CD10). Micellar → light lotion cleanser path.

---

### Q24 — Rank these skincare priorities from most to least important.
**UI:** Drag & Rank
> *Drag to reorder — your #1 priority gets the highest active concentration.*

**Options (default order):**
1. Anti-aging (wrinkles, firmness, elasticity)
2. Brightening (even tone, radiance)
3. Hydration (plump, dewy, moisturised)
4. Calming (reduce redness, soothe irritation)
5. Clarifying (control oil, minimise breakouts)
6. Repair (strengthen barrier, heal damage)

**Why We Ask:**
When multiple concerns compete, we need to know what matters most to you. Your top priority gets the hero active at maximum concentration; secondary concerns are addressed with supporting ingredients.

**Recommendation Logic:**
Ranking determines the PRIMARY active shot: #1 Anti-aging → retinol/peptide formulas. #1 Brightening → TXA/niacinamide. #1 Hydration → HA/aquaxyl. #1 Calming → ectoin/bisabolol. #1 Clarifying → BHA/zinc. #1 Repair → ceramides/betaglucan.

---

### Q25 — Which ingredient philosophies matter to you?
**UI:** Multi-Select
> *Select all that apply.*

**Options:**
- Clean beauty — no parabens, SLS, silicones
- Natural / botanical-forward formulas
- Science-first — proven clinical actives
- Fragrance-free
- Vegan / cruelty-free
- Sustainably sourced ingredients
- I don't have strong preferences

**Why We Ask:**
Your values shape which formulas feel right for you. Atelier Rusalka is built on Eastern European botanical heritage with clinically proven actives — but we want to align with your personal priorities.

**Recommendation Logic:**
Fragrance-free → F0 variants only. Natural-forward → highlight botanical extracts in recommendation. Science-first → emphasise clinical actives. Clean beauty → already compliant (no parabens/SLS in any formula). Vegan → flag any non-vegan ingredient exclusions.

---

### Q26 — How adventurous are you with skincare ingredients?
**UI:** Scale (1–5)
> *Scale: Very cautious → Open to trying → I'll try anything*

**Why We Ask:**
This helps us gauge whether to recommend gentler, well-known actives or more cutting-edge ingredients like azeloglycine, bakuchiol, or encapsulated retinol.

**Recommendation Logic:**
Cautious (1–2) → stick to classic, well-tolerated actives (panthenol, niacinamide, HA). Adventurous (4–5) → can introduce newer actives (bakuchiol, ectoin, azeloglycine, HPR retinoid).

---

### Q27 — Have you used retinol or retinoids before?
**UI:** Single Select

**Options:**
- Never — I'm a retinol beginner
- Tried once or twice — didn't stick with it
- Yes, occasionally — I use it a few times a month
- Yes, regularly — it's part of my routine
- I use prescription-strength retinoids

**Why We Ask:**
Retinol tolerance is built over time. Starting too strong causes irritation, peeling, and sensitivity. We'll match the retinoid type and concentration to your experience level.

**Recommendation Logic:**
Beginner → bakuchiol (SO5) or low-dose HPR (SO4). Occasional → encapsulated retinol (SD9). Regular → full retinol formulas. Prescription → they may not need our retinol products.

---

### Q28 — How much time do you spend on your skincare routine?
**UI:** Single Select

**Options:**
- Under 2 minutes — I want it fast
- 2–5 minutes — quick but considered
- 5–10 minutes — I enjoy the process
- 10+ minutes — skincare is my ritual

**Why We Ask:**
If you're a 2-minute person, we won't recommend 5 products. Your routine should feel effortless, not like a chore.

**Recommendation Logic:**
Under 2 min → 1–2 product recommendation (multi-benefit formulas). 5+ min → full 3-product regimen with targeted serum layering.

---

### Q29 — Is there anything you'd like to avoid in your products?
**UI:** Multi-Select
> *Select all that apply.*

**Options:**
- Fragrance / essential oils
- Retinol / retinoids
- Exfoliating acids (AHA, BHA)
- Silicones
- PEGs
- Alcohol (denat.)
- Nothing specific — I'm open to everything

**Why We Ask:**
Personal exclusions are non-negotiable. Whether based on past reactions, personal beliefs, or dermatologist advice — we'll make sure none of these end up in your formula.

**Recommendation Logic:**
Each exclusion acts as a FILTER on the formula pool. Fragrance → F0 only. Retinol → exclude SO4, SD4, SD9, CO12. BHA → exclude SO1. PEGs → exclude CD2, CD3, CD7, CD9, CD10, CD12. Silicones → already silicone-free.

---

### Q30 — Is there anything else you'd like us to know?
**UI:** Free Text
> *Tell us about specific goals, skin history, dermatologist advice, or anything that didn't fit the previous questions.*

*(User types here)*

**Why We Ask:**
Skin is complex and personal. A quiz can't capture everything — this is your space to tell us what makes your skin unique.

**Recommendation Logic:**
Free-text input parsed by recommendation engine (or reviewed manually in v1). Keywords flagged: `dermatologist`, `medication`, `allergy`, `pregnancy`, `condition`. Used as a qualitative override layer.

---

## Recommendation Engine Logic Summary

### Step 1 — Skin Type Classification
**Inputs:** Q11 + Q14 validation → **PRIMARY ROUTE**

| Skin Type | Formula Base |
|---|---|
| Oily | O-base formulas |
| Dry | D-base formulas |
| Combination | C-base formulas |
| Sensitive | S-base formulas |

---

### Step 2 — Concern Mapping
**Inputs:** Q12 + Q15 + Q17 → **ACTIVE SELECTION**

Each concern maps to specific formula codes and active ingredients. Top concerns from Q24 ranking get priority.

---

### Step 3 — Lifestyle Modifiers
**Inputs:** Q3–Q9 → **FORMULA ADJUSTMENT**

Environment, diet, stress, sleep, and sun exposure adjust active concentrations and add/remove supporting ingredients.

---

### Step 4 — Safety Filters
**Inputs:** Q10 + Q16 + Q20 + Q29 → **HARD EXCLUSIONS**

Pregnancy, conditions, allergies, and ingredient exclusions REMOVE formulas from the candidate pool. Non-negotiable.

---

### Step 5 — Preference Matching
**Inputs:** Q21–Q23 + Q25–Q28 → **FORMAT & TEXTURE**

Routine complexity, texture preference, cleanser format, ingredient philosophy, retinol experience → final product format selection.

---

### Step 6 — Output
**Personalised regimen of 1–3 products:**

- **Cleanser** — matched to format preference
- **Serum** — matched to primary concern
- **Moisturiser** — matched to texture preference

Each product offered with **F0 / F1 / F2** fragrance variant.
