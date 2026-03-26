export type AnswerValue = string | string[] | number | Record<string, number> | null;

export type QuestionType =
  | "single-select"
  | "multi-select"
  | "multi-select-other"
  | "scale"
  | "multi-scale-grid"
  | "yes-no"
  | "drag-rank"
  | "free-text";

export interface ScaleConfig {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface GridRow {
  label: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface QuizQuestion {
  id: number;
  section: 1 | 2 | 3;
  sectionTitle: string;
  question: string;
  type: QuestionType;
  subtitle?: string;
  options?: string[];
  scaleConfig?: ScaleConfig;
  gridRows?: GridRow[];
  whyWeAsk: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    section: 1,
    sectionTitle: "About You",
    question: "How old are you?",
    type: "single-select",
    options: ["Under 25", "25\u201334", "35\u201344", "45\u201354", "55\u201364", "65+"],
    whyWeAsk:
      "Skin physiology changes with age. Sebum production, collagen turnover, and hydration levels shift across decades, so we pick actives that match where your skin is now.",
  },
  {
    id: 2,
    section: 1,
    sectionTitle: "About You",
    question: "What is your biological sex?",
    type: "single-select",
    subtitle: "This helps us account for hormonal differences that affect skin.",
    options: ["Female", "Male", "Prefer not to say"],
    whyWeAsk:
      "Hormonal profiles differ between biological sexes, influencing sebum production, skin thickness, and sensitivity patterns.",
  },
  {
    id: 3,
    section: 1,
    sectionTitle: "About You",
    question: "Where do you live?",
    type: "single-select",
    subtitle: "Your environment impacts your skin more than you think.",
    options: [
      "Northern Europe (Scandinavia, Baltics, UK, Ireland)",
      "Central Europe (Germany, Poland, Czech Rep., Austria, Switzerland)",
      "Southern Europe (Mediterranean, Balkans)",
      "Eastern Europe (Romania, Bulgaria, Ukraine, Russia)",
      "North America",
      "Asia / Middle East",
      "Other",
    ],
    whyWeAsk:
      "Climate, UV index, humidity, and water hardness vary by region and directly affect skin hydration, barrier function, and aging speed.",
  },
  {
    id: 4,
    section: 1,
    sectionTitle: "About You",
    question: "How would you describe your environment?",
    type: "single-select",
    options: ["Urban / City centre", "Suburban", "Rural / Countryside"],
    whyWeAsk:
      "Urban environments expose skin to higher levels of pollution, particulate matter, and blue light. All of these accelerate oxidative stress and premature aging.",
  },
  {
    id: 5,
    section: 1,
    sectionTitle: "About You",
    question: "How much water do you drink daily?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Less than 1L",
      maxLabel: "2L+",
    },
    whyWeAsk:
      "Internal hydration is the foundation of skin health. Chronic low water intake leads to dull, dehydrated skin regardless of topical products.",
  },
  {
    id: 6,
    section: 1,
    sectionTitle: "About You",
    question: "How many hours of sleep do you typically get?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "<5 hours",
      maxLabel: "8+ hours",
    },
    whyWeAsk:
      "Skin repairs itself overnight. Poor sleep disrupts cortisol regulation, weakens the barrier, and accelerates signs of aging.",
  },
  {
    id: 7,
    section: 1,
    sectionTitle: "About You",
    question: "How would you rate your daily stress level?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Very low",
      maxLabel: "Very high",
    },
    whyWeAsk:
      "Chronic stress elevates cortisol, which triggers inflammation, breakouts, and barrier disruption.",
  },
  {
    id: 8,
    section: 1,
    sectionTitle: "About You",
    question: "How would you describe your diet?",
    type: "multi-scale-grid",
    subtitle: "Move the slider for each food group.",
    gridRows: [
      {
        label: "Vegetables & Fruits",
        min: 1,
        max: 5,
        minLabel: "Rarely",
        maxLabel: "Daily",
      },
      {
        label: "Dairy",
        min: 1,
        max: 5,
        minLabel: "Rarely",
        maxLabel: "Daily",
      },
      {
        label: "Sugar & Processed Foods",
        min: 1,
        max: 5,
        minLabel: "Rarely",
        maxLabel: "Daily",
      },
      {
        label: "Omega-Rich Foods: Fish, Nuts, Seeds",
        min: 1,
        max: 5,
        minLabel: "Rarely",
        maxLabel: "Daily",
      },
    ],
    whyWeAsk:
      "Diet directly impacts skin. Dairy and sugar can trigger breakouts, while omega fatty acids and antioxidant-rich fruits support barrier health.",
  },
  {
    id: 9,
    section: 1,
    sectionTitle: "About You",
    question: "How much daily sun exposure do you get?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Minimal (<30 min)",
      maxLabel: "Very high (4+ hrs)",
    },
    whyWeAsk:
      "UV exposure is the #1 driver of premature skin aging, hyperpigmentation, and collagen breakdown.",
  },
  {
    id: 10,
    section: 1,
    sectionTitle: "About You",
    question: "Are you currently pregnant or breastfeeding?",
    type: "yes-no",
    options: ["Yes", "No"],
    whyWeAsk:
      "Certain actives like retinol, salicylic acid, and some essential oils are contraindicated during pregnancy. We ensure your formula is 100% safe.",
  },
  {
    id: 11,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How would you describe your skin type?",
    type: "single-select",
    subtitle:
      "Think about how your skin feels by midday without any products.",
    options: [
      "Oily: shiny all over, especially T-zone",
      "Dry: tight, flaky, sometimes rough",
      "Combination: oily T-zone, dry cheeks",
      "Sensitive: easily irritated, reactive to new products",
    ],
    whyWeAsk:
      "Your baseline skin type determines the product base and texture, from lightweight aqua-gels for oily skin to rich nutri-creams for dry skin.",
  },
  {
    id: 12,
    section: 2,
    sectionTitle: "Your Skin",
    question: "What are your biggest skin concerns right now?",
    type: "multi-select",
    subtitle: "Select all that apply. Focus on what feels most pressing.",
    options: [
      "Breakouts or blemishes",
      "Dryness or dehydration",
      "Oiliness or excess shine",
      "Fine lines or wrinkles",
      "Lack of firmness",
      "Uneven skin tone or dark spots",
      "Enlarged pores",
      "Redness or irritation",
      "Dullness or tired-looking skin",
      "Sensitivity or reactivity",
      "Under-eye concerns (dark circles, puffiness)",
      "Texture irregularities",
    ],
    whyWeAsk:
      "Your specific concerns guide us to the right active ingredients.",
  },
  {
    id: 13,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How sensitive is your skin to the sun?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Never burns",
      maxLabel: "Burns very easily",
    },
    whyWeAsk:
      "Your photosensitivity indicates your skin\u2019s melanin levels and vulnerability to UV damage.",
  },
  {
    id: 14,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How does your skin feel after cleansing with just water?",
    type: "single-select",
    subtitle:
      "Think about 15 minutes after washing, no products applied.",
    options: [
      "Tight and dry: needs moisture immediately",
      "Comfortable: feels balanced",
      "Slightly oily: shine returns quickly",
      "Irritated or red: even water feels harsh",
    ],
    whyWeAsk:
      "Post-cleanse behaviour is one of the most reliable indicators of your skin\u2019s natural lipid production and barrier integrity.",
  },
  {
    id: 15,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How often do you experience breakouts?",
    type: "single-select",
    options: [
      "Rarely or never",
      "Occasionally, a few times per year",
      "Monthly, often around my cycle",
      "Frequently, multiple times per month",
      "Constantly, always dealing with some form of breakout",
    ],
    whyWeAsk:
      "Breakout frequency helps us determine whether you need a maintenance approach or an active acne-fighting regimen.",
  },
  {
    id: 16,
    section: 2,
    sectionTitle: "Your Skin",
    question: "Do you experience any of the following?",
    type: "multi-select",
    subtitle: "Select all that apply.",
    options: [
      "Rosacea or redness-prone skin",
      "Eczema or atopic dermatitis",
      "Psoriasis",
      "Hormonal acne (jawline, chin)",
      "Melasma or post-inflammatory hyperpigmentation",
      "Contact allergies to cosmetic ingredients",
      "None of the above",
    ],
    whyWeAsk:
      "Pre-existing skin conditions require specific ingredient exclusions and gentler formulation approaches.",
  },
  {
    id: 17,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How visible are your pores?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Barely visible",
      maxLabel: "Extremely visible",
    },
    whyWeAsk:
      "Pore visibility correlates with sebum production and skin texture.",
  },
  {
    id: 18,
    section: 2,
    sectionTitle: "Your Skin",
    question: "How would you describe your skin tone?",
    type: "single-select",
    subtitle:
      "This helps us consider melanin-related concerns like hyperpigmentation.",
    options: [
      "Very fair: burns easily, rarely tans",
      "Fair: sometimes burns, tans gradually",
      "Medium: rarely burns, tans well",
      "Olive: almost never burns",
      "Dark: never burns",
      "Very dark",
    ],
    whyWeAsk:
      "Melanin levels affect how your skin responds to ingredients like vitamin C, retinol, and exfoliating acids.",
  },
  {
    id: 19,
    section: 2,
    sectionTitle: "Your Skin",
    question: "Rate the following about your skin right now.",
    type: "multi-scale-grid",
    subtitle: "Move each slider to describe your current state.",
    gridRows: [
      {
        label: "Hydration Level",
        min: 1,
        max: 5,
        minLabel: "Very low",
        maxLabel: "Very high",
      },
      {
        label: "Oiliness Level",
        min: 1,
        max: 5,
        minLabel: "Very low",
        maxLabel: "Very high",
      },
      {
        label: "Redness Level",
        min: 1,
        max: 5,
        minLabel: "Very low",
        maxLabel: "Very high",
      },
      {
        label: "Firmness / Elasticity",
        min: 1,
        max: 5,
        minLabel: "Very low",
        maxLabel: "Very high",
      },
    ],
    whyWeAsk:
      "A real-time snapshot of your skin\u2019s condition helps us fine-tune the formula beyond your baseline skin type.",
  },
  {
    id: 20,
    section: 2,
    sectionTitle: "Your Skin",
    question: "Have you ever had an allergic reaction to a skincare product?",
    type: "single-select",
    options: [
      "No, never",
      "Yes, to fragrance or essential oils",
      "Yes, to a specific active ingredient",
      "Yes, but I\u2019m not sure what caused it",
      "I have multiple known sensitivities",
    ],
    whyWeAsk:
      "Ingredient sensitivities are critical safety information.",
  },
  {
    id: 21,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "How many steps is your current skincare routine?",
    type: "single-select",
    options: [
      "1 step: I just wash my face",
      "2 steps: cleanser + moisturiser",
      "3\u20134 steps: cleanser, serum, moisturiser, SPF",
      "5+ steps: I have an elaborate routine",
      "I don\u2019t have a routine yet",
    ],
    whyWeAsk:
      "Your current routine complexity tells us how many products you\u2019re ready to manage.",
  },
  {
    id: 22,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "What texture do you prefer in a moisturiser?",
    type: "single-select",
    options: [
      "Lightweight gel: absorbs instantly, no residue",
      "Lotion: light but hydrating",
      "Cream: rich and nourishing",
      "Balm / Oil: very rich, cocooning",
      "I\u2019m not sure, surprise me",
    ],
    whyWeAsk:
      "Texture preference directly affects how likely you are to use a product consistently.",
  },
  {
    id: 23,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "What type of cleanser do you prefer?",
    type: "single-select",
    options: [
      "Foaming / Gel cleanser: fresh, squeaky-clean feel",
      "Cream / Milk cleanser: soft, non-stripping",
      "Oil / Balm cleanser: dissolves everything, luxurious",
      "Micellar / Lotion: gentle, no-rinse",
      "I\u2019m not sure, recommend one for me",
    ],
    whyWeAsk:
      "The wrong cleanser can strip your barrier or leave residue. Getting this right is foundational.",
  },
  {
    id: 24,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Rank these skincare priorities from most to least important.",
    type: "drag-rank",
    subtitle:
      "Drag to reorder. Your top priority gets the highest active concentration.",
    options: [
      "Anti-aging (wrinkles, firmness, elasticity)",
      "Brightening (even tone, radiance)",
      "Hydration (plump, dewy, moisturised)",
      "Calming (reduce redness, soothe irritation)",
      "Clarifying (control oil, minimise breakouts)",
      "Repair (strengthen barrier, heal damage)",
    ],
    whyWeAsk:
      "When multiple concerns compete, we need to know what matters most. Your top priority gets the hero active at maximum concentration.",
  },
  {
    id: 25,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Which ingredient philosophies matter to you?",
    type: "multi-select",
    subtitle: "Select all that apply.",
    options: [
      "Clean beauty: no parabens, SLS, silicones",
      "Natural / botanical-forward formulas",
      "Science-first: proven clinical actives",
      "Fragrance-free",
      "Vegan / cruelty-free",
      "Sustainably sourced ingredients",
      "I don\u2019t have strong preferences",
    ],
    whyWeAsk:
      "Your values shape which formulas feel right for you.",
  },
  {
    id: 26,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "How adventurous are you with skincare ingredients?",
    type: "scale",
    scaleConfig: {
      min: 1,
      max: 5,
      minLabel: "Very cautious",
      maxLabel: "I\u2019ll try anything",
    },
    whyWeAsk:
      "This tells us whether to stick with gentler, well-known actives or introduce newer, more advanced ingredients.",
  },
  {
    id: 27,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Have you used retinol or retinoids before?",
    type: "single-select",
    options: [
      "Never, I\u2019m a retinol beginner",
      "Tried once or twice, didn\u2019t stick with it",
      "Yes, occasionally. I use it a few times a month",
      "Yes, regularly. It\u2019s part of my routine",
      "I use prescription-strength retinoids",
    ],
    whyWeAsk:
      "Retinol tolerance is built over time. We\u2019ll match the retinoid type and concentration to your experience level.",
  },
  {
    id: 28,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "How much time do you spend on your skincare routine?",
    type: "single-select",
    options: [
      "Under 2 minutes, I want it fast",
      "2\u20135 minutes, quick but considered",
      "5\u201310 minutes, I enjoy the process",
      "10+ minutes, skincare is my ritual",
    ],
    whyWeAsk:
      "If you\u2019re a 2-minute person, we won\u2019t recommend 5 products.",
  },
  {
    id: 29,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Is there anything you\u2019d like to avoid in your products?",
    type: "multi-select",
    subtitle: "Select all that apply.",
    options: [
      "Fragrance / essential oils",
      "Retinol / retinoids",
      "Exfoliating acids (AHA, BHA)",
      "Silicones",
      "PEGs",
      "Alcohol (denat.)",
      "Nothing specific, I\u2019m open to everything",
    ],
    whyWeAsk:
      "Personal exclusions are non-negotiable.",
  },
  {
    id: 30,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Do you have any known skin allergies?",
    type: "multi-select-other",
    subtitle:
      "Select all that apply. If your allergy isn\u2019t listed, select Other and describe it.",
    options: [
      "Fragrance / essential oils",
      "Lanolin",
      "Propylene glycol",
      "Formaldehyde / formaldehyde releasers",
      "Cocamidopropyl betaine",
      "Parabens",
      "Nickel (in cosmetic packaging)",
      "Latex (natural rubber)",
      "None that I know of",
      "Other",
    ],
    whyWeAsk:
      "Known allergies are critical safety information. If you select Other, a human will review your response to ensure your formula is safe.",
  },
  {
    id: 31,
    section: 3,
    sectionTitle: "Your Routine & Preferences",
    question: "Would you like fragrance in your products?",
    type: "single-select",
    subtitle:
      "Our fragrances are crafted from Eastern European botanical essences.",
    options: [
      "No fragrance",
      "Light, fresh botanical notes",
      "Warm, earthy undertones",
    ],
    whyWeAsk:
      "Fragrance is entirely your choice. Some prefer fragrance-free formulas, while others enjoy a sensorial experience.",
  },
];
