export interface ExtractOrigin {
  name: string;
  country: string;
  region?: string;
  description: string;
  color: string;
}

/**
 * Placeholder mapping of botanical extracts to their Eastern European origin.
 * Keys match ingredient names from Supabase (normalized to lowercase for lookup).
 * Colors reflect the natural hue of each plant/extract.
 */
const EXTRACT_ORIGINS: Record<string, ExtractOrigin> = {
  // Bulgaria
  "rosa damascena (bulgarian rose) extract": {
    name: "Bulgarian Rose",
    country: "bulgaria",
    region: "Rose Valley, Kazanlak",
    description: "Hand-harvested at dawn from the Rose Valley, where over 85% of the world's rose oil is produced. Rich in antioxidants and deeply soothing for sensitive skin.",
    color: "#d4a0a0",
  },
  "rosa damascena flower oil": {
    name: "Bulgarian Rose Oil",
    country: "bulgaria",
    region: "Rose Valley, Kazanlak",
    description: "Steam-distilled from Rosa damascena petals. It takes approximately 3,500 kg of rose petals to produce 1 kg of rose oil.",
    color: "#d4a0a0",
  },
  "chamomile co2 extract": {
    name: "Chamomile",
    country: "bulgaria",
    region: "Thracian Plain",
    description: "CO2-extracted to preserve the full spectrum of anti-inflammatory compounds. Bulgarian chamomile is prized for its exceptionally high bisabolol content.",
    color: "#e8d88c",
  },
  "sambucus nigra (elderberry) extract": {
    name: "Elderberry",
    country: "bulgaria",
    region: "Rhodope Mountains",
    description: "Wild-harvested from the Rhodope mountain forests. Packed with anthocyanins and vitamin C for potent antioxidant protection.",
    color: "#8b6b8a",
  },
  "sambucus nigra (elderflower) extract": {
    name: "Elderflower",
    country: "bulgaria",
    region: "Rhodope Mountains",
    description: "Delicate elderflower blossoms gathered from ancient groves. Contains natural bioflavonoids that help even skin tone.",
    color: "#e8e0c8",
  },

  // Ukraine — Carpathians
  "achillea millefolium (yarrow) extract": {
    name: "Yarrow",
    country: "ukraine",
    region: "Carpathian Mountains",
    description: "Foraged from alpine meadows of the Carpathians. Yarrow has been used in Eastern European folk medicine for centuries for its wound-healing and anti-inflammatory properties.",
    color: "#a8b88c",
  },
  "achillea millefolium extract (carpathians)": {
    name: "Carpathian Yarrow",
    country: "ukraine",
    region: "Carpathian Mountains",
    description: "A high-altitude variety with concentrated essential oils. The harsh mountain climate produces plants with exceptional resilience compounds.",
    color: "#a8b88c",
  },
  "hypericum perforatum (st. john's wort) extract": {
    name: "St. John's Wort",
    country: "ukraine",
    region: "Carpathian Foothills",
    description: "Harvested at peak bloom in midsummer. The hypericin-rich extract provides powerful anti-inflammatory and skin-repairing benefits.",
    color: "#c4a840",
  },
  "hypericum perforatum (st. john's wort) oil/extract": {
    name: "St. John's Wort Oil",
    country: "ukraine",
    region: "Carpathian Foothills",
    description: "Cold-macerated in carrier oil to extract the deep red healing pigment. Traditional Carpathian remedy for damaged and irritated skin.",
    color: "#b85c3c",
  },
  "urtica dioica (nettle) extract": {
    name: "Nettle",
    country: "ukraine",
    region: "Polissya Region",
    description: "Sustainably harvested spring nettles, rich in silica, iron, and chlorophyll. Strengthens the skin barrier and supports cellular renewal.",
    color: "#6b8c5a",
  },
  "urtica dioica extract (bulgaria)": {
    name: "Bulgarian Nettle",
    country: "bulgaria",
    region: "Stara Planina",
    description: "Mountain nettle from the Balkan Range. Higher mineral concentration than lowland varieties due to volcanic soils.",
    color: "#6b8c5a",
  },
  "vaccinium myrtillus (bilberry) extract": {
    name: "Bilberry",
    country: "ukraine",
    region: "Carpathian Forests",
    description: "Wild bilberries from ancient Carpathian forests. Anthocyanin content is among the highest of any berry, providing exceptional free-radical protection.",
    color: "#5c5c8c",
  },
  "vaccinium myrtillus (bilberry) seed oil": {
    name: "Bilberry Seed Oil",
    country: "ukraine",
    region: "Carpathian Forests",
    description: "Cold-pressed from wild bilberry seeds. Rich in omega-3 and omega-6 fatty acids for deep barrier repair.",
    color: "#5c5c8c",
  },
  "vaccinium myrtillus extract (ee)": {
    name: "Eastern European Bilberry",
    country: "ukraine",
    region: "Carpathian Forests",
    description: "Selected for its superior antioxidant profile. Carpathian bilberries contain 4x more anthocyanins than cultivated varieties.",
    color: "#5c5c8c",
  },

  // Romania
  "arnica montana (mountain arnica) extract": {
    name: "Mountain Arnica",
    country: "romania",
    region: "Apuseni Mountains",
    description: "Wild-harvested from protected alpine meadows. Arnica's sesquiterpene lactones provide powerful anti-inflammatory action for reactive skin.",
    color: "#d4b040",
  },
  "tilia cordata (linden blossom) extract": {
    name: "Linden Blossom",
    country: "romania",
    region: "Transylvania",
    description: "Gathered from centuries-old linden trees. The fragrant blossoms yield a calming extract rich in mucilage and flavonoids.",
    color: "#c8d4a0",
  },
  "melissa officinalis (lemon balm) extract": {
    name: "Lemon Balm",
    country: "romania",
    region: "Moldavia Region",
    description: "Cultivated in traditional herb gardens. Rosmarinic acid content provides antiviral and antioxidant protection.",
    color: "#90b870",
  },

  // Poland
  "betula alba (birch) bark extract": {
    name: "Birch Bark",
    country: "poland",
    region: "Białowieża Forest",
    description: "Sourced from the last primeval forest in Europe. Betulin from birch bark supports skin barrier function and has anti-inflammatory properties.",
    color: "#d4c8a8",
  },
  "betula alba (birch) extract": {
    name: "Birch Leaf",
    country: "poland",
    region: "Białowieża Forest",
    description: "Young birch leaves harvested in spring. Rich in flavonoids and tannins that tone and tighten the skin.",
    color: "#98b878",
  },
  "betula alba (birch) sap extract": {
    name: "Birch Sap",
    country: "poland",
    region: "Podlasie",
    description: "Tapped in early spring using traditional methods. Birch sap is a natural source of xylitol, amino acids, and minerals for deep hydration.",
    color: "#d8dcc8",
  },
  "juniperus communis (juniper) berry extract": {
    name: "Juniper Berry",
    country: "poland",
    region: "Bieszczady Mountains",
    description: "Hand-picked wild juniper berries. The essential oils have natural antiseptic and detoxifying properties.",
    color: "#5c7c6c",
  },

  // Hungary
  "centaurea cyanus (cornflower) extract": {
    name: "Cornflower",
    country: "hungary",
    region: "Great Hungarian Plain",
    description: "Cultivated without pesticides in the mineral-rich soils of the Plain. The vivid blue petals yield a gentle, soothing extract ideal for eye-area care.",
    color: "#7c8cb8",
  },
  "mallow extract organic": {
    name: "Mallow",
    country: "hungary",
    region: "Transdanubia",
    description: "Organic mallow grown in traditional Hungarian herb farms. High mucilage content provides a protective film that soothes and softens irritated skin.",
    color: "#b890a8",
  },

  // Croatia
  "salvia officinalis (sage) extract": {
    name: "Sage",
    country: "croatia",
    region: "Dalmatian Coast",
    description: "Dalmatian sage is considered the finest in the world. The Mediterranean microclimate produces plants with the highest ursolic acid concentration.",
    color: "#8ca888",
  },
  "sage co2 extract antioxidant": {
    name: "Sage CO2 Extract",
    country: "croatia",
    region: "Dalmatian Coast",
    description: "Supercritical CO2 extraction preserves the full antioxidant spectrum. Carnosic acid and rosmarinic acid protect against environmental stress.",
    color: "#8ca888",
  },
  "rosmarinus officinalis (rosemary) co2 extract": {
    name: "Rosemary CO2",
    country: "croatia",
    region: "Istria Peninsula",
    description: "CO2-extracted rosemary from the Adriatic coast. The extract functions as both a potent antioxidant and a natural preservative.",
    color: "#6c8c6c",
  },
  "rosmarinus officinalis (rosemary) extract": {
    name: "Rosemary",
    country: "croatia",
    region: "Istria Peninsula",
    description: "Sun-drenched Istrian rosemary yields exceptionally high levels of carnosol, a powerful anti-aging compound.",
    color: "#6c8c6c",
  },

  // Lithuania / Baltic
  "equisetum arvense (horsetail) extract": {
    name: "Horsetail",
    country: "lithuania",
    region: "Dzūkija Region",
    description: "Gathered from pristine Baltic wetlands. Horsetail is the richest plant source of bioavailable silica, essential for collagen synthesis.",
    color: "#88a87c",
  },
  "plantago major (plantain) extract": {
    name: "Plantain",
    country: "lithuania",
    region: "Aukštaitija",
    description: "A cornerstone of Baltic folk herbalism. Aucubin and allantoin promote rapid wound healing and skin cell regeneration.",
    color: "#7c9c68",
  },

  // Romania — Sea Buckthorn
  "hippophae rhamnoides (sea buckthorn) co2 oil": {
    name: "Sea Buckthorn CO2 Oil",
    country: "romania",
    region: "Black Sea Coast",
    description: "CO2-extracted from berries growing wild along the Black Sea shore. Contains over 190 bioactive compounds including rare omega-7.",
    color: "#d48c3c",
  },
  "hippophae rhamnoides (sea buckthorn) extract": {
    name: "Sea Buckthorn Extract",
    country: "romania",
    region: "Danube Delta",
    description: "Harvested from the wild shores of the Danube Delta biosphere reserve. One of nature's most nutrient-dense fruits.",
    color: "#d48c3c",
  },
  "hippophae rhamnoides (sea buckthorn) oil": {
    name: "Sea Buckthorn Oil",
    country: "romania",
    region: "Black Sea Coast",
    description: "Cold-pressed berry oil with a distinctive deep orange colour from high carotenoid content. Exceptional for skin repair and regeneration.",
    color: "#d48c3c",
  },
  "hippophae rhamnoides extract (ee)": {
    name: "Eastern European Sea Buckthorn",
    country: "romania",
    region: "Danube Delta",
    description: "Wild-harvested from the biosphere reserve. The extreme continental climate produces berries with concentrated healing properties.",
    color: "#d48c3c",
  },

  // Slovakia
  "vaccinium vitis-idaea (lingonberry) seed oil": {
    name: "Lingonberry Seed Oil",
    country: "slovakia",
    region: "High Tatras",
    description: "Cold-pressed from wild lingonberries of the Tatra mountains. Exceptionally rich in omega-3 alpha-linolenic acid for anti-inflammatory barrier support.",
    color: "#b85858",
  },
  "prunus spinosa (blackthorn) kernel oil": {
    name: "Blackthorn Oil",
    country: "slovakia",
    region: "Slovak Karst",
    description: "Pressed from wild blackthorn fruit kernels. A rare oil rich in oleic acid and vitamin E, prized in Central European skincare traditions.",
    color: "#4c5c70",
  },
  "ribes nigrum (blackcurrant) seed oil": {
    name: "Blackcurrant Seed Oil",
    country: "poland",
    region: "Lublin Region",
    description: "Cold-pressed from Polish blackcurrant seeds. One of the few plant sources of GLA (gamma-linolenic acid), critical for skin barrier integrity.",
    color: "#3c3c5c",
  },

  // General / Multiple origins
  "centella asiatica extract gw": {
    name: "Centella Asiatica",
    country: "hungary",
    region: "Greenhouse Cultivated",
    description: "Grown in controlled environments to ensure consistent madecassoside and asiaticoside levels. A cornerstone ingredient for skin repair.",
    color: "#78a868",
  },
  "centella asiatica gw": {
    name: "Centella Asiatica",
    country: "hungary",
    region: "Greenhouse Cultivated",
    description: "Standardised extract with guaranteed active compound levels. Supports collagen synthesis and accelerates wound healing.",
    color: "#78a868",
  },
  "euphrasia extract gw": {
    name: "Eyebright",
    country: "estonia",
    region: "Saaremaa Island",
    description: "Wild-harvested from the pristine meadows of Estonia's largest island. Traditional Baltic remedy for eye-area inflammation and puffiness.",
    color: "#c8c0d8",
  },
  "organic rosehip seed co2 extract": {
    name: "Rosehip Seed",
    country: "serbia",
    region: "Šumadija Region",
    description: "CO2-extracted from wild rosehips. Rich in trans-retinoic acid and essential fatty acids for natural skin renewal.",
    color: "#c87848",
  },
  "organic cucumber": {
    name: "Cucumber",
    country: "hungary",
    region: "Great Hungarian Plain",
    description: "Organic cucumbers from the mineral-rich soil of the Hungarian Plain. The extract provides cooling hydration and gentle depuffing action.",
    color: "#88b888",
  },
  "organic green tea": {
    name: "Green Tea",
    country: "georgia",
    region: "Guria Region",
    description: "Georgian green tea from the world's northernmost tea plantations. EGCG content rivals Japanese matcha for antioxidant potency.",
    color: "#5c8c48",
  },
  "carote co2 extract organic": {
    name: "Carrot CO2 Extract",
    country: "poland",
    region: "Masuria",
    description: "Supercritical CO2 extraction of organic carrots. Concentrated beta-carotene and falcarinol support skin repair and provide natural UV-protective compounds.",
    color: "#d88840",
  },
  "marigold co2 extract": {
    name: "Marigold (Calendula)",
    country: "romania",
    region: "Maramureș",
    description: "CO2-extracted calendula from traditional Romanian herb gardens. Faradiol esters provide exceptional wound-healing and anti-inflammatory benefits.",
    color: "#d4a030",
  },
  "schisandra co2 extract": {
    name: "Schisandra",
    country: "ukraine",
    region: "Zakarpattia",
    description: "Rare adaptogenic berry from the western Carpathian forests. Contains all five flavours in Traditional Chinese Medicine — unique among botanicals.",
    color: "#a84848",
  },
  "salix alba (white willow) bark extract": {
    name: "White Willow Bark",
    country: "poland",
    region: "Vistula River Basin",
    description: "Sustainably harvested from riverside willows. Natural salicin is the gentler precursor to salicylic acid, providing mild exfoliation without irritation.",
    color: "#b8a888",
  },
  "salix nigra bark extract": {
    name: "Black Willow Bark",
    country: "lithuania",
    region: "Nemunas River Delta",
    description: "Baltic black willow with higher tannin content than its white cousin. Provides natural astringent and pore-refining benefits.",
    color: "#8c7c68",
  },
};

export function getExtractOrigin(ingredientName: string): ExtractOrigin | null {
  return EXTRACT_ORIGINS[ingredientName.toLowerCase()] ?? null;
}

export function getAllExtractOrigins(): Record<string, ExtractOrigin> {
  return EXTRACT_ORIGINS;
}
