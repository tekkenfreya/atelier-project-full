"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./DesignLab.css";

/**
 * Floating dev panel for live A/B-ing typography and palette.
 * Hidden by default. Activate with `?lab=1` once — the panel
 * persists itself in localStorage. Shift+L toggles open/closed
 * after activation. `?lab=0` to deactivate.
 *
 * The Atelier Rusalka type system carries TWO display serifs and
 * TWO body sans, so the lab exposes five typography slots:
 *
 *   1. Atelier headlines — Fraunces (homepage hero, featured)
 *   2. Editorial display — Cormorant Garamond (cart/quiz/results)
 *   3. Atelier body      — Inter (homepage paragraphs)
 *   4. Editorial body    — Satoshi (cart/quiz/results body copy)
 *   5. Captions & buttons — JetBrains Mono (both contexts)
 *
 * Each slot maps to a specific set of CSS custom properties; the
 * SLOT_TARGETS table below is the single source of truth.
 *
 * Fonts whose families are not statically loaded in app/layout.tsx
 * are pulled from Google Fonts via a single aggregated stylesheet
 * link, only when the lab activates.
 */

type Font = {
  id: string;
  label: string;
  stack: string;
  /** Google Fonts query fragment; omit for fonts already loaded. */
  google?: string;
};

const SERIFS: readonly Font[] = [
  { id: "fraunces", label: "Fraunces", stack: '"Fraunces", Georgia, serif' },
  { id: "cormorant", label: "Cormorant Garamond", stack: '"Cormorant Garamond", Georgia, serif' },
  { id: "playfair", label: "Playfair Display", stack: '"Playfair Display", Georgia, serif', google: "Playfair+Display:ital,wght@0,400..900;1,400..900" },
  { id: "eb-garamond", label: "EB Garamond", stack: '"EB Garamond", Georgia, serif', google: "EB+Garamond:ital,wght@0,400..800;1,400..800" },
  { id: "crimson-pro", label: "Crimson Pro", stack: '"Crimson Pro", Georgia, serif', google: "Crimson+Pro:ital,wght@0,200..900;1,200..900" },
  { id: "lora", label: "Lora", stack: '"Lora", Georgia, serif', google: "Lora:ital,wght@0,400..700;1,400..700" },
  { id: "dm-serif-display", label: "DM Serif Display", stack: '"DM Serif Display", Georgia, serif', google: "DM+Serif+Display:ital@0;1" },
  { id: "dm-serif-text", label: "DM Serif Text", stack: '"DM Serif Text", Georgia, serif', google: "DM+Serif+Text:ital@0;1" },
  { id: "spectral", label: "Spectral", stack: '"Spectral", Georgia, serif', google: "Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700" },
  { id: "bodoni-moda", label: "Bodoni Moda", stack: '"Bodoni Moda", Georgia, serif', google: "Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900" },
  { id: "italiana", label: "Italiana", stack: '"Italiana", Georgia, serif', google: "Italiana" },
  { id: "italianno", label: "Italianno", stack: '"Italianno", "Brush Script MT", cursive', google: "Italianno" },
  { id: "source-serif", label: "Source Serif 4", stack: '"Source Serif 4", Georgia, serif', google: "Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900" },
  { id: "libre-caslon", label: "Libre Caslon Text", stack: '"Libre Caslon Text", Georgia, serif', google: "Libre+Caslon+Text:ital,wght@0,400;0,700;1,400" },
  { id: "tenor-sans", label: "Tenor Sans", stack: '"Tenor Sans", Georgia, serif', google: "Tenor+Sans" },
  { id: "cardo", label: "Cardo", stack: '"Cardo", Georgia, serif', google: "Cardo:ital,wght@0,400;0,700;1,400" },
  { id: "marcellus", label: "Marcellus", stack: '"Marcellus", Georgia, serif', google: "Marcellus" },
  { id: "merriweather", label: "Merriweather", stack: '"Merriweather", Georgia, serif', google: "Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900" },
  { id: "pt-serif", label: "PT Serif", stack: '"PT Serif", Georgia, serif', google: "PT+Serif:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "newsreader", label: "Newsreader", stack: '"Newsreader", Georgia, serif', google: "Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800" },
  { id: "alegreya", label: "Alegreya", stack: '"Alegreya", Georgia, serif', google: "Alegreya:ital,wght@0,400..900;1,400..900" },
  { id: "vidaloka", label: "Vidaloka", stack: '"Vidaloka", Georgia, serif', google: "Vidaloka" },
  { id: "yeseva-one", label: "Yeseva One", stack: '"Yeseva One", Georgia, serif', google: "Yeseva+One" },
  { id: "abril-fatface", label: "Abril Fatface", stack: '"Abril Fatface", Georgia, serif', google: "Abril+Fatface" },
  { id: "cinzel", label: "Cinzel", stack: '"Cinzel", Georgia, serif', google: "Cinzel:wght@400..900" },
  { id: "roboto-slab", label: "Roboto Slab", stack: '"Roboto Slab", Georgia, serif', google: "Roboto+Slab:wght@100..900" },
  { id: "arvo", label: "Arvo", stack: '"Arvo", Georgia, serif', google: "Arvo:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "tinos", label: "Tinos", stack: '"Tinos", Georgia, serif', google: "Tinos:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "lustria", label: "Lustria", stack: '"Lustria", Georgia, serif', google: "Lustria" },
  { id: "old-standard", label: "Old Standard TT", stack: '"Old Standard TT", Georgia, serif', google: "Old+Standard+TT:ital,wght@0,400;0,700;1,400" },
  { id: "cormorant-sc", label: "Cormorant SC", stack: '"Cormorant SC", "Cormorant Garamond", Georgia, serif', google: "Cormorant+SC:wght@300;400;500;600;700" },
  { id: "cormorant-infant", label: "Cormorant Infant", stack: '"Cormorant Infant", Georgia, serif', google: "Cormorant+Infant:ital,wght@0,300..700;1,300..700" },
  { id: "ibm-plex-serif", label: "IBM Plex Serif", stack: '"IBM Plex Serif", Georgia, serif', google: "IBM+Plex+Serif:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500" },
];

const SANS: readonly Font[] = [
  { id: "inter", label: "Inter", stack: '"Inter", system-ui, -apple-system, sans-serif' },
  { id: "satoshi", label: "Satoshi", stack: '"Satoshi", system-ui, -apple-system, sans-serif' },
  { id: "dm-sans", label: "DM Sans", stack: '"DM Sans", system-ui, -apple-system, sans-serif' },
  { id: "manrope", label: "Manrope (Gibson-like)", stack: '"Manrope", system-ui, -apple-system, sans-serif', google: "Manrope:wght@200..800" },
  { id: "plus-jakarta", label: "Plus Jakarta Sans", stack: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', google: "Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800" },
  { id: "geist", label: "Geist", stack: '"Geist", system-ui, -apple-system, sans-serif', google: "Geist:wght@100..900" },
  { id: "outfit", label: "Outfit", stack: '"Outfit", system-ui, -apple-system, sans-serif', google: "Outfit:wght@100..900" },
  { id: "sora", label: "Sora", stack: '"Sora", system-ui, -apple-system, sans-serif', google: "Sora:wght@100..800" },
  { id: "instrument-sans", label: "Instrument Sans", stack: '"Instrument Sans", system-ui, -apple-system, sans-serif', google: "Instrument+Sans:ital,wght@0,400..700;1,400..700" },
  { id: "albert-sans", label: "Albert Sans", stack: '"Albert Sans", system-ui, -apple-system, sans-serif', google: "Albert+Sans:ital,wght@0,100..900;1,100..900" },
  { id: "public-sans", label: "Public Sans", stack: '"Public Sans", system-ui, -apple-system, sans-serif', google: "Public+Sans:ital,wght@0,100..900;1,100..900" },
  { id: "work-sans", label: "Work Sans", stack: '"Work Sans", system-ui, -apple-system, sans-serif', google: "Work+Sans:ital,wght@0,100..900;1,100..900" },
  { id: "hanken-grotesk", label: "Hanken Grotesk", stack: '"Hanken Grotesk", system-ui, -apple-system, sans-serif', google: "Hanken+Grotesk:ital,wght@0,100..900;1,100..900" },
  { id: "be-vietnam", label: "Be Vietnam Pro", stack: '"Be Vietnam Pro", system-ui, -apple-system, sans-serif', google: "Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { id: "figtree", label: "Figtree", stack: '"Figtree", system-ui, -apple-system, sans-serif', google: "Figtree:ital,wght@0,300..900;1,300..900" },
  { id: "epilogue", label: "Epilogue", stack: '"Epilogue", system-ui, -apple-system, sans-serif', google: "Epilogue:ital,wght@0,100..900;1,100..900" },
  { id: "ibm-plex-sans", label: "IBM Plex Sans", stack: '"IBM Plex Sans", system-ui, -apple-system, sans-serif', google: "IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500" },
  { id: "karla", label: "Karla", stack: '"Karla", system-ui, -apple-system, sans-serif', google: "Karla:ital,wght@0,200..800;1,200..800" },
  { id: "mulish", label: "Mulish", stack: '"Mulish", system-ui, -apple-system, sans-serif', google: "Mulish:ital,wght@0,200..1000;1,200..1000" },
  { id: "onest", label: "Onest", stack: '"Onest", system-ui, -apple-system, sans-serif', google: "Onest:wght@100..900" },
  { id: "lato", label: "Lato", stack: '"Lato", system-ui, -apple-system, sans-serif', google: "Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900" },
  { id: "rubik", label: "Rubik", stack: '"Rubik", system-ui, -apple-system, sans-serif', google: "Rubik:ital,wght@0,300..900;1,300..900" },
  { id: "source-sans-3", label: "Source Sans 3", stack: '"Source Sans 3", system-ui, -apple-system, sans-serif', google: "Source+Sans+3:ital,wght@0,200..900;1,200..900" },
  { id: "barlow", label: "Barlow", stack: '"Barlow", system-ui, -apple-system, sans-serif', google: "Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700" },
  { id: "heebo", label: "Heebo", stack: '"Heebo", system-ui, -apple-system, sans-serif', google: "Heebo:wght@100..900" },
  { id: "quicksand", label: "Quicksand", stack: '"Quicksand", system-ui, -apple-system, sans-serif', google: "Quicksand:wght@300..700" },
  { id: "comfortaa", label: "Comfortaa (rounded)", stack: '"Comfortaa", system-ui, -apple-system, sans-serif', google: "Comfortaa:wght@300..700" },
  { id: "cabin", label: "Cabin", stack: '"Cabin", system-ui, -apple-system, sans-serif', google: "Cabin:ital,wght@0,400..700;1,400..700" },
  { id: "lexend", label: "Lexend (legibility)", stack: '"Lexend", system-ui, -apple-system, sans-serif', google: "Lexend:wght@100..900" },
  { id: "roboto", label: "Roboto", stack: '"Roboto", system-ui, -apple-system, sans-serif', google: "Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700" },
  { id: "open-sans", label: "Open Sans", stack: '"Open Sans", system-ui, -apple-system, sans-serif', google: "Open+Sans:ital,wght@0,300..800;1,300..800" },
  { id: "nunito-sans", label: "Nunito Sans", stack: '"Nunito Sans", system-ui, -apple-system, sans-serif', google: "Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000" },
];

const MONOS: readonly Font[] = [
  { id: "jetbrains-mono", label: "JetBrains Mono", stack: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
  { id: "geist-mono", label: "Geist Mono", stack: '"Geist Mono", ui-monospace, Menlo, monospace', google: "Geist+Mono:wght@100..900" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", stack: '"IBM Plex Mono", ui-monospace, Menlo, monospace', google: "IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400;1,500" },
  { id: "space-mono", label: "Space Mono", stack: '"Space Mono", ui-monospace, Menlo, monospace', google: "Space+Mono:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "fira-code", label: "Fira Code", stack: '"Fira Code", ui-monospace, Menlo, monospace', google: "Fira+Code:wght@300..700" },
  { id: "dm-mono", label: "DM Mono", stack: '"DM Mono", ui-monospace, Menlo, monospace', google: "DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500" },
  { id: "inconsolata", label: "Inconsolata", stack: '"Inconsolata", ui-monospace, Menlo, monospace', google: "Inconsolata:wght@200..900" },
  { id: "roboto-mono", label: "Roboto Mono", stack: '"Roboto Mono", ui-monospace, Menlo, monospace', google: "Roboto+Mono:ital,wght@0,100..700;1,100..700" },
  { id: "azeret-mono", label: "Azeret Mono", stack: '"Azeret Mono", ui-monospace, Menlo, monospace', google: "Azeret+Mono:ital,wght@0,100..900;1,100..900" },
  { id: "anonymous-pro", label: "Anonymous Pro", stack: '"Anonymous Pro", ui-monospace, Menlo, monospace', google: "Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "cousine", label: "Cousine", stack: '"Cousine", ui-monospace, Menlo, monospace', google: "Cousine:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "cutive-mono", label: "Cutive Mono", stack: '"Cutive Mono", ui-monospace, Menlo, monospace', google: "Cutive+Mono" },
  { id: "spline-sans-mono", label: "Spline Sans Mono", stack: '"Spline Sans Mono", ui-monospace, Menlo, monospace', google: "Spline+Sans+Mono:ital,wght@0,300..700;1,300..700" },
  { id: "fragment-mono", label: "Fragment Mono", stack: '"Fragment Mono", ui-monospace, Menlo, monospace', google: "Fragment+Mono:ital@0;1" },
  { id: "reddit-mono", label: "Reddit Mono", stack: '"Reddit Mono", ui-monospace, Menlo, monospace', google: "Reddit+Mono:wght@200..900" },
  { id: "nova-mono", label: "Nova Mono", stack: '"Nova Mono", ui-monospace, Menlo, monospace', google: "Nova+Mono" },
  { id: "b612-mono", label: "B612 Mono", stack: '"B612 Mono", ui-monospace, Menlo, monospace', google: "B612+Mono:ital,wght@0,400;0,700;1,400;1,700" },
];

type SlotKey = "display" | "edDisplay" | "body" | "edBody" | "mono";

/** Lookup a font by id across every category. The slot dropdowns
 *  are still scoped to their own pool, but per-element overrides
 *  (the fine-tune panel) can choose any font — so we need a
 *  global lookup for the override CSS rule + previews. */
function findFontAcrossPools(fontId: string): Font | undefined {
  return (
    SERIFS.find((f) => f.id === fontId) ??
    SANS.find((f) => f.id === fontId) ??
    MONOS.find((f) => f.id === fontId)
  );
}

type Override = {
  /** Stable id for React list keys; derived from selector + fontId. */
  id: string;
  /** The CSS selector that scopes this override (e.g. ".cart-title"). */
  selector: string;
  /** Which font from the slot's source pool to apply. */
  fontId: string;
  /** Slot the picked element originally mapped to — used to look
   *  up the candidate pool when re-rendering the overrides list. */
  slotKey: SlotKey;
};

type SlotTarget = {
  /** The data-* attribute on <html> the lab toggles for this slot. */
  attr: string;
  /** Default font id for this slot. */
  defaultId: string;
  /** Pool of font candidates the dropdown is built from. */
  source: readonly Font[];
  /** CSS variable + selector pairs to override when this slot
   *  switches. Each pair becomes one rule in the generated <style>. */
  targets: readonly { selector: string; vars: readonly string[] }[];
  /** Plain-English UI labels. */
  ui: {
    label: string;
    /** Concrete page surfaces this slot controls. First entry is
     *  the most recognisable / dominant surface and is rendered
     *  with extra emphasis. The optional selector lets the user
     *  click a chip to flash the matching elements on the page.
     *  `wide: true` marks selectors that match a huge area
     *  (e.g. the whole .atelier wrapper) so they get skipped when
     *  the picker batch-flashes every surface for the slot. */
    surfaces: readonly {
      label: string;
      selector?: string;
      wide?: boolean;
      /** Page route where this surface is guaranteed to render.
       *  Omit when the surface lives on multiple routes (e.g. nav,
       *  promo strip) — chip homing will then just scroll on the
       *  current page. */
      route?: string;
    }[];
    sample: string;
    sampleStyle: React.CSSProperties;
  };
};

const SLOT_TARGETS: Record<SlotKey, SlotTarget> = {
  display: {
    attr: "display-font",
    defaultId: "fraunces",
    source: SERIFS,
    targets: [
      { selector: "", vars: ["--serif", "--ed-serif"] },
      { selector: ".atelier", vars: ["--serif"] },
    ],
    ui: {
      label: "Homepage headlines · italic serif",
      surfaces: [
        { label: "Atelier wordmark", selector: ".nav__logo" },
        { label: "Featured “Let’s begin…”", selector: ".featured__name", route: "/" },
        { label: "Brand line", selector: ".featured__brand-line", route: "/" },
        { label: "Italic input", selector: ".featured__name-input", route: "/" },
      ],
      sample: "Let’s begin with your name.",
      sampleStyle: { fontStyle: "italic", fontSize: "18px", letterSpacing: "-0.01em" },
    },
  },
  edDisplay: {
    attr: "ed-display-font",
    defaultId: "cormorant",
    source: SERIFS,
    targets: [{ selector: "", vars: ["--ed-display"] }],
    ui: {
      label: "Inner-page display · serif",
      surfaces: [
        { label: "Cart titles", selector: ".cart-title, .cart-summary-title, .cart-item-name, .cart-plan-title", route: "/cart" },
        { label: "Checkout titles", selector: ".checkout-title", route: "/checkout" },
        { label: "Results product name", selector: ".rd-product-name", route: "/results" },
        { label: "Scientific names", selector: ".rd-active-detail-sci", route: "/results" },
      ],
      sample: "Your Skin Profile",
      sampleStyle: { fontStyle: "normal", fontSize: "18px", letterSpacing: "-0.01em" },
    },
  },
  body: {
    attr: "body-font",
    defaultId: "inter",
    source: SANS,
    targets: [
      { selector: "", vars: ["--sans", "--ed-sans"] },
      { selector: ".atelier", vars: ["--sans"] },
    ],
    ui: {
      label: "Homepage body · sans",
      surfaces: [
        { label: "Subscription details", selector: ".lux-sub__card-cadence, .lux-sub__card-notes li", route: "/" },
        { label: "Subscription button", selector: ".sub__cta, .lux-sub__card-cta", route: "/" },
        { label: "Footer detail rows", selector: ".lux-footer__detail-row, .footer-row", route: "/" },
        { label: "Default homepage body", selector: ".atelier", wide: true, route: "/" },
      ],
      sample: "Bi-monthly cadence — billed every 60 days, dispatched on the 1st.",
      sampleStyle: { fontStyle: "normal", fontSize: "12px", letterSpacing: "0" },
    },
  },
  edBody: {
    attr: "ed-body-font",
    defaultId: "satoshi",
    source: SANS,
    targets: [{ selector: "", vars: ["--ed-body"] }],
    ui: {
      label: "Inner-page body · sans",
      surfaces: [
        { label: "Cart item details", selector: ".cart-item-details, .cart-item-category, .cart-item-price", route: "/cart" },
        { label: "Cart plan cards", selector: ".cart-plan-label, .cart-plan-desc, .cart-plan-reassurances li", route: "/cart" },
        { label: "Quiz body", selector: ".quiz-question-body, .quiz-option-label", route: "/quiz" },
        { label: "Results details", selector: ".rd-product-skin, .rd-reason, .rd-active-detail-fn", route: "/results" },
        { label: "Trust strip", selector: ".trust-strip__item", route: "/cart" },
      ],
      sample: "Your bespoke moisturizer is calibrated to oily skin.",
      sampleStyle: { fontStyle: "normal", fontSize: "12px", letterSpacing: "0" },
    },
  },
  mono: {
    attr: "mono-font",
    defaultId: "jetbrains-mono",
    source: MONOS,
    targets: [
      { selector: "", vars: ["--mono", "--ed-mono"] },
      { selector: ".atelier", vars: ["--mono"] },
    ],
    ui: {
      label: "Captions & buttons · mono",
      surfaces: [
        { label: "Navigation links", selector: ".nav__links a" },
        { label: "Nav CTA", selector: ".nav__cta" },
        { label: "Hero mark", selector: ".hero-v__mark", route: "/" },
        { label: "“Begin” button", selector: ".hero-v__cta", route: "/" },
        { label: "Promo strip", selector: ".promo-bar" },
        { label: "Eyebrows", selector: ".featured__eyebrow, .featured__halo, .featured__anchors, .cart-label, .checkout-label, .rd-label" },
      ],
      sample: "EDITION MMXXVI · 60% OFF",
      sampleStyle: { fontStyle: "normal", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" },
    },
  },
};

const SLOT_ORDER: readonly SlotKey[] = [
  "display",
  "edDisplay",
  "body",
  "edBody",
  "mono",
];

type Palette = {
  id: string;
  label: string;
  swatches: readonly [string, string, string, string];
};

const PALETTES: readonly Palette[] = [
  {
    id: "default",
    label: "Warm botanical (default)",
    swatches: ["#f3ecdf", "#1f1d1a", "#a3a05e", "#d4a373"],
  },
  {
    id: "alt-1",
    label: "Slate & moss",
    swatches: ["#e9e6e0", "#1a1d1f", "#7a8d6a", "#a99175"],
  },
  {
    id: "alt-2",
    label: "Porcelain & rust",
    swatches: ["#f6f1ea", "#2a1f17", "#9aa48a", "#c87c52"],
  },
  {
    id: "alt-3",
    label: "Midnight chamomile",
    swatches: ["#0f1218", "#f4ead7", "#7d8a5c", "#caa15a"],
  },
  {
    id: "alt-4",
    label: "Pale linen",
    swatches: ["#faf6ed", "#322d23", "#8a7a4f", "#b58a5d"],
  },
  {
    id: "alt-5",
    label: "Sage & terracotta",
    swatches: ["#eee8db", "#1c2118", "#6e8064", "#c66c4f"],
  },
  {
    id: "alt-6",
    label: "Charcoal & gilt",
    swatches: ["#1a1813", "#ece4d3", "#a39156", "#d9b06e"],
  },
];

const STORAGE_KEYS: Record<
  SlotKey | "active" | "palette" | "position" | "customPresets",
  string
> = {
  active: "atelier-lab",
  display: "atelier-lab-display",
  edDisplay: "atelier-lab-ed-display",
  body: "atelier-lab-body",
  edBody: "atelier-lab-ed-body",
  mono: "atelier-lab-mono",
  palette: "atelier-lab-palette",
  position: "atelier-lab-position",
  customPresets: "atelier-lab-custom-presets",
};

type LabPosition = "bl" | "br";

type LabView = "type" | "map";

/** Curated sitemap of the customer-facing routes Edson reviews
 *  during typography + conversion passes. The lab's "Map" view
 *  renders this as a clickable list so any page can be opened
 *  without walking through the consultation flow each time.
 *
 *  Quiz step deep-linking is intentionally not exposed yet — the
 *  quiz page does not parse a `?step=N` query param. Extending
 *  that is a separate quiz refactor; for now /quiz appears as a
 *  single entry with a note about its multi-step nature. */
/** Curated bundles of font + palette choices Edson can audition
 *  with one click. Each preset names every slot and the palette,
 *  so applying one wipes back to a known-good set rather than the
 *  factory defaults. Reset stays as the strict factory option. */
type Preset = {
  id: string;
  label: string;
  /** A short composer-credit-style line (the dominant typefaces)
   *  shown beneath the preset name. */
  byline: string;
  fonts: Record<SlotKey, string>;
  palette: string;
  /** Custom (user-saved) presets are persisted to localStorage and
   *  rendered with a × delete button. Curated ones are immutable. */
  custom?: boolean;
};

const PRESETS: readonly Preset[] = [
  {
    id: "atelier-default",
    label: "Atelier Default",
    byline: "Fraunces · Inter · JetBrains Mono",
    fonts: {
      display: "fraunces",
      edDisplay: "cormorant",
      body: "inter",
      edBody: "satoshi",
      mono: "jetbrains-mono",
    },
    palette: "default",
  },
  {
    id: "modern-editorial",
    label: "Modern Editorial",
    byline: "Bodoni Moda · Manrope · Geist Mono",
    fonts: {
      display: "bodoni-moda",
      edDisplay: "source-serif",
      body: "manrope",
      edBody: "plus-jakarta",
      mono: "geist-mono",
    },
    palette: "alt-1",
  },
  {
    id: "old-world",
    label: "Old World",
    byline: "Playfair · EB Garamond · IBM Plex Mono",
    fonts: {
      display: "playfair",
      edDisplay: "eb-garamond",
      body: "lato",
      edBody: "ibm-plex-sans",
      mono: "ibm-plex-mono",
    },
    palette: "alt-2",
  },
  {
    id: "apothecary-dark",
    label: "Apothecary Dark",
    byline: "Spectral · Hanken Grotesk · Geist Mono",
    fonts: {
      display: "spectral",
      edDisplay: "cormorant",
      body: "hanken-grotesk",
      edBody: "geist",
      mono: "geist-mono",
    },
    palette: "alt-3",
  },
  {
    id: "couture",
    label: "Couture",
    byline: "Italiana · Hanken · Cousine",
    fonts: {
      display: "italiana",
      edDisplay: "bodoni-moda",
      body: "hanken-grotesk",
      edBody: "instrument-sans",
      mono: "cousine",
    },
    palette: "alt-6",
  },
  {
    id: "soft-linen",
    label: "Soft Linen",
    byline: "Cormorant Infant · Outfit · DM Mono",
    fonts: {
      display: "cormorant-infant",
      edDisplay: "cormorant",
      body: "outfit",
      edBody: "figtree",
      mono: "dm-mono",
    },
    palette: "alt-4",
  },

  /* ──────────────────────────────────────────────────────────
     Brand-inspired presets — each mirrors the typography of a
     well-known luxury skincare / fragrance house, mapped to the
     closest free Google Fonts substitutes already loaded by the
     lab. Defaults are chosen so the homepage + cart + results
     all read in-character with the source brand. The byline
     names the substitutes, not the originals, so the user knows
     exactly what's actually rendering.
     ──────────────────────────────────────────────────────────*/
  {
    id: "brand-aesop",
    label: "Aesop · Apothecary",
    byline: "Tenor Sans · Hanken Grotesk · JetBrains Mono",
    fonts: {
      display: "tenor-sans",
      edDisplay: "marcellus",
      body: "hanken-grotesk",
      edBody: "inter",
      mono: "jetbrains-mono",
    },
    palette: "default",
  },
  {
    id: "brand-le-labo",
    label: "Le Labo · Laboratoire",
    byline: "Marcellus · Inter · Geist Mono",
    fonts: {
      display: "marcellus",
      edDisplay: "bodoni-moda",
      body: "inter",
      edBody: "plus-jakarta",
      mono: "geist-mono",
    },
    palette: "alt-4",
  },
  {
    id: "brand-glossier",
    label: "Glossier · Studio",
    byline: "DM Serif Display · Outfit · JetBrains Mono",
    fonts: {
      display: "dm-serif-display",
      edDisplay: "lora",
      body: "outfit",
      edBody: "figtree",
      mono: "jetbrains-mono",
    },
    palette: "alt-4",
  },
  {
    id: "brand-augustinus-bader",
    label: "Augustinus Bader · Award",
    byline: "Bodoni Moda · Hanken Grotesk · IBM Plex Mono",
    fonts: {
      display: "bodoni-moda",
      edDisplay: "cormorant",
      body: "hanken-grotesk",
      edBody: "inter",
      mono: "ibm-plex-mono",
    },
    palette: "alt-6",
  },
  {
    id: "brand-dr-sturm",
    label: "Dr. Sturm · Clinical",
    byline: "Marcellus · Public Sans · IBM Plex Mono",
    fonts: {
      display: "marcellus",
      edDisplay: "source-serif",
      body: "public-sans",
      edBody: "ibm-plex-sans",
      mono: "ibm-plex-mono",
    },
    palette: "alt-1",
  },
  {
    id: "brand-tatcha",
    label: "Tatcha · Kyoto",
    byline: "Cormorant Infant · Lato · DM Mono",
    fonts: {
      display: "cormorant-infant",
      edDisplay: "lora",
      body: "lato",
      edBody: "hanken-grotesk",
      mono: "dm-mono",
    },
    palette: "alt-2",
  },
];

type SitemapPage = {
  path: string;
  label: string;
  description?: string;
  /** Disabled if the route exists but typically requires auth or
   *  prior state (e.g. /confirmation only loads after a checkout
   *  redirect from Stripe). User can still click it. */
  needs?: string;
  /** Optional state seeder. Called RIGHT BEFORE the lab navigates
   *  to this route — used to bypass front-end guards on pages that
   *  expect specific sessionStorage entries. Only included for
   *  routes whose guards we can fake convincingly without a live
   *  back-end (cart, checkout, results, report, confirmation). */
  mock?: () => void;
};

/** Mock helpers — write the minimum sessionStorage required for
 *  each gated page to render its design review surface. Quality
 *  of the rendered output depends on whether the page also calls
 *  an API that needs valid data; for /results and /report the
 *  matcher will best-effort match these answers, falling back to
 *  the empty / error state when nothing scores. */

function seedCart() {
  sessionStorage.setItem(
    "cartItems",
    JSON.stringify([
      {
        productId: "demo-cleanser",
        productName: "Demo Cleanser",
        category: "Cleanser",
        skinType: "Combination",
        fragranceOption: "F1",
        price: 23,
      },
      {
        productId: "demo-serum",
        productName: "Demo Serum",
        category: "Serum",
        skinType: "Combination",
        fragranceOption: "F1",
        price: 50,
      },
      {
        productId: "demo-moisturizer",
        productName: "Demo Moisturizer",
        category: "Moisturizer",
        skinType: "Combination",
        fragranceOption: "F1",
        price: 41,
      },
    ]),
  );
  sessionStorage.setItem("subscriptionPlan", "bi-monthly");
  sessionStorage.setItem("customerName", "Edson");
}

function seedQuizAnswers() {
  sessionStorage.setItem(
    "quizAnswers",
    JSON.stringify({
      1: "25–34",
      4: "Urban / City centre",
      12: [
        "Dryness or dehydration",
        "Fine lines or wrinkles",
        "Dullness or tired-looking skin",
      ],
      24: ["Hydration", "Anti-aging", "Brightening"],
      31: "Light, fresh botanical notes",
    }),
  );
  sessionStorage.setItem("customerName", "Edson");
}

const SITEMAP: readonly { section: string; pages: readonly SitemapPage[] }[] = [
  {
    section: "Marketing flow",
    pages: [
      { path: "/", label: "Home", description: "Hero · featured · subscription · footer" },
      { path: "/quiz", label: "Consultation Quiz", description: "Multi-step form (~31 questions)" },
      { path: "/results", label: "Results", description: "Recommended formula + regimen", needs: "completed quiz", mock: seedQuizAnswers },
      { path: "/cart", label: "Cart", description: "Plan selection · trust strip", mock: seedCart },
      { path: "/checkout", label: "Checkout", description: "Stripe redirect", needs: "items in cart", mock: seedCart },
      { path: "/confirmation?session_id=demo", label: "Confirmation", description: "Post-payment screen", needs: "Stripe redirect" },
    ],
  },
  {
    section: "Customer area",
    pages: [
      { path: "/account", label: "Account", description: "Dashboard · orders · settings" },
    ],
  },
  {
    section: "Reference",
    pages: [
      { path: "/ingredients", label: "Ingredients", description: "Botanical glossary" },
      { path: "/analysis", label: "Analysis", description: "Skin profile breakdown", needs: "completed quiz", mock: seedQuizAnswers },
      { path: "/report", label: "Detailed Report", description: "Long-form regimen explanation", needs: "completed quiz", mock: seedQuizAnswers },
    ],
  },
];

function buildGoogleFontsUrl(fonts: readonly Font[]): string {
  const seen = new Set<string>();
  const families: string[] = [];
  for (const f of fonts) {
    if (!f.google || seen.has(f.google)) continue;
    seen.add(f.google);
    families.push(`family=${f.google}`);
  }
  if (families.length === 0) return "";
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function buildOverrideCss(): string {
  const rules: string[] = [];

  for (const key of SLOT_ORDER) {
    const slot = SLOT_TARGETS[key];
    for (const f of slot.source) {
      if (f.id === slot.defaultId) continue;
      for (const t of slot.targets) {
        const sel = t.selector
          ? `html[data-${slot.attr}="${f.id}"] ${t.selector}`
          : `html[data-${slot.attr}="${f.id}"]`;
        const decls = t.vars.map((v) => `${v}: ${f.stack};`).join(" ");
        rules.push(`${sel} { ${decls} }`);
      }
    }
  }

  // Force the .atelier wrapper to honour the body swap (font-family
  // is set explicitly on .atelier; var() is live so re-pointing is
  // enough — but the declaration must be present for it to apply).
  rules.push(`.atelier { font-family: var(--sans); }`);

  return rules.join("\n");
}

export default function DesignLab() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  /** When false, the lab collapses into a small floating chip at
   *  the corner. The chip is always visible so the user has a
   *  durable affordance to re-open the panel. */
  const [open, setOpen] = useState(true);
  /** Which corner the panel + collapsed chip dock to. Persisted
   *  so the user's preference survives reloads. */
  const [position, setPosition] = useState<LabPosition>("bl");
  /** Which top-level view is showing: type tools or the sitemap.
   *  Tabs in the panel header swap between them. */
  const [view, setView] = useState<LabView>("type");
  /** When chip homing has to navigate to a different route, the
   *  scroll/flash is queued here and consumed once the pathname
   *  matches. Cleared if 4s elapse without the right route landing
   *  (so a failed navigation never leaves stale work pending). */
  const [pendingHome, setPendingHome] = useState<{
    selector: string;
    route: string;
  } | null>(null);
  const [selections, setSelections] = useState<Record<SlotKey, string>>({
    display: SLOT_TARGETS.display.defaultId,
    edDisplay: SLOT_TARGETS.edDisplay.defaultId,
    body: SLOT_TARGETS.body.defaultId,
    edBody: SLOT_TARGETS.edBody.defaultId,
    mono: SLOT_TARGETS.mono.defaultId,
  });
  const [palette, setPalette] = useState<string>("default");
  /** Element-picker mode: when true, hovering outlines elements
   *  on the page and clicking one identifies which slot controls
   *  its font. */
  const [picking, setPicking] = useState(false);
  /** When set, the matching slot row pulses for ~2.5s — used both
   *  by the picker (page → slot) and by chip clicks (slot → page). */
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  /** A picked element being tuned. Changes apply live, so this
   *  state primarily drives the panel UI; the override list is the
   *  source of truth for what's actually rendered. The
   *  `originalOverrideFontId` lets Cancel revert to whatever was
   *  in effect at pick time — undefined when there was no prior
   *  override on this selector. */
  const [pickedTarget, setPickedTarget] = useState<{
    selector: string;
    currentFamily: string;
    slotKey: SlotKey;
    draftFontId: string;
    sample: string;
    originalOverrideFontId: string | undefined;
  } | null>(null);
  /** Active per-element overrides. Each one becomes one CSS rule
   *  injected into a dedicated <style> tag — slot-wide swaps still
   *  fire, but overrides win because they use !important. */
  const [overrides, setOverrides] = useState<Override[]>([]);
  /** User-saved presets, persisted to localStorage. Live alongside
   *  the six curated presets in the same grid. */
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  /** When true, the inline "name your preset" form is showing. */
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetDraftName, setPresetDraftName] = useState("");

  /** Latest state kept in refs so document-level handlers can read
   *  fresh values without forcing a listener re-bind every render. */
  const selectionsRef = useRef(selections);
  selectionsRef.current = selections;
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const overridesStyleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("lab");
    if (flag === "0") {
      localStorage.removeItem(STORAGE_KEYS.active);
      return;
    }
    const enabled =
      flag === "1" || localStorage.getItem(STORAGE_KEYS.active) === "1";
    if (!enabled) return;
    localStorage.setItem(STORAGE_KEYS.active, "1");
    setActive(true);
    setSelections({
      display: localStorage.getItem(STORAGE_KEYS.display) ?? SLOT_TARGETS.display.defaultId,
      edDisplay: localStorage.getItem(STORAGE_KEYS.edDisplay) ?? SLOT_TARGETS.edDisplay.defaultId,
      body: localStorage.getItem(STORAGE_KEYS.body) ?? SLOT_TARGETS.body.defaultId,
      edBody: localStorage.getItem(STORAGE_KEYS.edBody) ?? SLOT_TARGETS.edBody.defaultId,
      mono: localStorage.getItem(STORAGE_KEYS.mono) ?? SLOT_TARGETS.mono.defaultId,
    });
    setPalette(localStorage.getItem(STORAGE_KEYS.palette) ?? "default");
    const storedPos = localStorage.getItem(STORAGE_KEYS.position);
    if (storedPos === "br" || storedPos === "bl") setPosition(storedPos);
    // Load custom presets — guarded against malformed JSON.
    try {
      const rawPresets = localStorage.getItem(STORAGE_KEYS.customPresets);
      if (rawPresets) {
        const parsed = JSON.parse(rawPresets);
        if (Array.isArray(parsed)) setCustomPresets(parsed as Preset[]);
      }
    } catch {
      // Corrupt entry — wipe it so future loads start clean.
      localStorage.removeItem(STORAGE_KEYS.customPresets);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    localStorage.setItem(
      STORAGE_KEYS.customPresets,
      JSON.stringify(customPresets),
    );
  }, [active, customPresets]);

  useEffect(() => {
    if (!active) return;
    localStorage.setItem(STORAGE_KEYS.position, position);
  }, [active, position]);

  // Inject Google Fonts stylesheet + dynamic override CSS once when
  // the lab activates. Cleaned up if the component unmounts.
  useEffect(() => {
    if (!active) return;

    const url = buildGoogleFontsUrl([...SERIFS, ...SANS, ...MONOS]);
    let linkEl: HTMLLinkElement | null = null;
    if (url) {
      linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = url;
      linkEl.setAttribute("data-design-lab", "fonts");
      document.head.appendChild(linkEl);
    }

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-design-lab", "overrides");
    styleEl.textContent = buildOverrideCss();
    document.head.appendChild(styleEl);

    return () => {
      linkEl?.remove();
      styleEl.remove();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "L" || e.key === "l")) {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Sync each slot's data-* attribute + localStorage when its
  // selection changes.
  useEffect(() => {
    if (!active) return;
    for (const key of SLOT_ORDER) {
      const slot = SLOT_TARGETS[key];
      const value = selections[key];
      document.documentElement.setAttribute(`data-${slot.attr}`, value);
      localStorage.setItem(STORAGE_KEYS[key], value);
    }
  }, [active, selections]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-palette", palette);
    localStorage.setItem(STORAGE_KEYS.palette, palette);
  }, [active, palette]);

  /** Keep a single <style> tag in <head> whose contents are rebuilt
   *  every time `overrides` changes. Using one mutable element
   *  avoids creating + tearing down a node per edit. */
  useEffect(() => {
    if (!active) return;
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-design-lab", "fine-overrides");
    document.head.appendChild(styleEl);
    overridesStyleRef.current = styleEl;
    return () => {
      styleEl.remove();
      overridesStyleRef.current = null;
    };
  }, [active]);

  useEffect(() => {
    const styleEl = overridesStyleRef.current;
    if (!styleEl) return;
    const rules = overrides
      .map((o) => {
        // Cross-category lookup so an override can target any
        // font from any pool (e.g. a serif on the mono-controlled
        // promo strip).
        const font = findFontAcrossPools(o.fontId);
        if (!font) return "";
        return `${o.selector} { font-family: ${font.stack} !important; }`;
      })
      .filter(Boolean);
    styleEl.textContent = rules.join("\n");
  }, [overrides]);

  /** Pending-home consumer: when the route a chip asked us to
   *  navigate to lands, scroll + flash the queued selector. The
   *  short timeout gives the new page a tick to render before we
   *  query for matches. */
  useEffect(() => {
    if (!pendingHome) return;
    if (pathname !== pendingHome.route) return;
    const handle = window.setTimeout(() => {
      const first = document.querySelector<HTMLElement>(pendingHome.selector);
      if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        flashSurface(pendingHome.selector);
      }
      setPendingHome(null);
    }, 350);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingHome, pathname]);

  /** Safety net — never leave a pending home queued indefinitely
   *  if the route never resolves (e.g. the user navigates away
   *  manually before the queued route lands). */
  useEffect(() => {
    if (!pendingHome) return;
    const handle = window.setTimeout(() => setPendingHome(null), 4000);
    return () => window.clearTimeout(handle);
  }, [pendingHome]);

  /** Element picker. When `picking` is true, hovering outlines the
   *  element under the cursor and clicking identifies which slot
   *  controls it — then highlights that slot row in the panel. */
  useEffect(() => {
    if (!active || !picking) return;

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    let highlighted: HTMLElement | null = null;
    function unhighlight() {
      if (highlighted) {
        highlighted.style.outline = "";
        highlighted.style.outlineOffset = "";
        highlighted = null;
      }
    }

    function isInsideLab(el: EventTarget | null): boolean {
      return !!(el instanceof HTMLElement && el.closest(".design-lab"));
    }

    function onMove(e: MouseEvent) {
      if (isInsideLab(e.target)) {
        unhighlight();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (!target || target === highlighted) return;
      unhighlight();
      target.style.outline = "2px solid #d4a373";
      target.style.outlineOffset = "2px";
      highlighted = target;
    }

    function onClick(e: MouseEvent) {
      if (isInsideLab(e.target)) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const slot = findSlotForElement(target);
      unhighlight();
      setPicking(false);
      if (slot) {
        flashSlot(slot);
        const selector = bestSelectorFor(target);
        // Two-tier picker outline: bright on the elements the
        // override will modify (the picked selector's match set),
        // dim on the rest of the slot's footprint — so the user
        // sees what they're about to change vs what merely shares
        // the slot.
        flashPickerResolution(slot, target, selector);
        const family = getComputedStyle(target)
          .fontFamily.split(",")[0]
          .replace(/['"]/g, "")
          .trim();
        // Capture the picked element's visible text for the live
        // preview. Truncated so a long paragraph doesn't blow up
        // the panel; falls back to the slot's default sample when
        // the element has no inline text (e.g. icon-only buttons).
        const text = (target.textContent ?? "").replace(/\s+/g, " ").trim();
        const sample =
          text.length > 0
            ? text.slice(0, 90)
            : SLOT_TARGETS[slot].ui.sample;
        // Seed the dropdown with whatever font is currently winning
        // — the slot-wide selection if no override covers this
        // selector, or the existing override's font if there is one.
        const existing = overridesRef.current.find(
          (o) => o.selector === selector,
        );
        setPickedTarget({
          selector,
          currentFamily: family,
          slotKey: slot,
          draftFontId: existing?.fontId ?? selectionsRef.current[slot],
          sample,
          originalOverrideFontId: existing?.fontId,
        });
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        unhighlight();
        setPicking(false);
      }
    }

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);

    return () => {
      document.body.style.cursor = prevCursor;
      unhighlight();
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, picking]);

  function setSlot(key: SlotKey, value: string) {
    setSelections((prev) => ({ ...prev, [key]: value }));
  }

  /** Build a CSS selector that scopes an override to "this kind of
   *  element". Joins all of the element's component-level classes
   *  for high specificity. Animation/utility helpers (and the lab's
   *  own internals) are filtered out. The .atelier wrapper class is
   *  treated as no-class — overriding `.atelier` would scope the
   *  rule to the entire homepage, which is never what the user
   *  meant when they picked some text inside it. When the picked
   *  element has no useful classes, walks up to the nearest classed
   *  ancestor and emits "<ancestor-classes> <tag>" so an unclassed
   *  <a> inside .nav__links resolves to ".nav__links a" instead of
   *  the dangerously-broad bare tag. */
  function bestSelectorFor(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;

    const skip = /^(design-lab|featured__fade)/;
    const isUseful = (c: string) => !skip.test(c) && c !== "atelier";

    const own = Array.from(el.classList).filter(isUseful);
    if (own.length > 0) return own.map((c) => `.${c}`).join("");

    let ancestor: HTMLElement | null = el.parentElement;
    while (ancestor && ancestor.tagName !== "HTML") {
      const classes = Array.from(ancestor.classList).filter(isUseful);
      if (classes.length > 0) {
        const ancestorSel = classes.map((c) => `.${c}`).join("");
        return `${ancestorSel} ${el.tagName.toLowerCase()}`;
      }
      ancestor = ancestor.parentElement;
    }

    return el.tagName.toLowerCase();
  }

  /** Match a DOM element's computed font-family to one of the five
   *  slot definitions. If an active override already targets this
   *  element, prefer that override's slot — otherwise the picker
   *  would return null after a swap because the rendered font no
   *  longer matches any slot's current value. Disambiguates
   *  display-vs-editorial by whether the element lives inside the
   *  .atelier wrapper. */
  function findSlotForElement(el: HTMLElement): SlotKey | null {
    for (const o of overridesRef.current) {
      try {
        if (el.matches(o.selector)) return o.slotKey;
      } catch {
        // Malformed selector — ignore and fall through.
      }
    }
    const inAtelier = !!el.closest(".atelier");
    const family = (getComputedStyle(el).fontFamily.split(",")[0] || "")
      .replace(/['"]/g, "")
      .trim()
      .toLowerCase();
    if (!family) return null;

    function matches(key: SlotKey): boolean {
      const slot = SLOT_TARGETS[key];
      const fontId = selectionsRef.current[key];
      const font = slot.source.find((f) => f.id === fontId);
      if (!font) return false;
      const slotFirst = (font.stack.split(",")[0] || "")
        .replace(/['"]/g, "")
        .trim()
        .toLowerCase();
      return slotFirst === family;
    }

    if (matches("mono")) return "mono";

    const dispMatch = matches("display");
    const edDispMatch = matches("edDisplay");
    if (dispMatch && edDispMatch) return inAtelier ? "display" : "edDisplay";
    if (dispMatch) return "display";
    if (edDispMatch) return "edDisplay";

    const bodyMatch = matches("body");
    const edBodyMatch = matches("edBody");
    if (bodyMatch && edBodyMatch) return inAtelier ? "body" : "edBody";
    if (bodyMatch) return "body";
    if (edBodyMatch) return "edBody";

    return null;
  }

  function flashSlot(key: SlotKey) {
    setActiveSlot(key);
    window.setTimeout(() => setActiveSlot((cur) => (cur === key ? null : cur)), 2500);
  }

  /** Click a surface chip → outline the matching DOM elements for
   *  ~1.6s so the user sees which page elements that slot owns. */
  function flashSurface(selector: string, durationMs = 1600) {
    if (!selector) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    if (els.length === 0) return;
    for (const el of els) {
      el.style.transition = "outline-color 0.2s ease, outline-offset 0.2s ease";
      el.style.outline = "2px solid #d4a373";
      el.style.outlineOffset = "3px";
    }
    window.setTimeout(() => {
      for (const el of els) {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.style.transition = "";
      }
    }, durationMs);
  }

  /** Update the draft font for the currently-picked element AND
   *  apply it to the page in the same beat — so the user sees the
   *  swap as soon as they touch the dropdown. No "Apply" step.
   *
   *  Picking the slot's default again removes the override entirely,
   *  so cycling through fonts and returning to the default cleans
   *  up after itself. */
  function setDraftFont(fontId: string) {
    if (!pickedTarget) return;
    setPickedTarget({ ...pickedTarget, draftFontId: fontId });

    const slotDefault = selectionsRef.current[pickedTarget.slotKey];
    if (fontId === slotDefault) {
      setOverrides((prev) =>
        prev.filter((o) => o.selector !== pickedTarget.selector),
      );
      return;
    }

    setOverrides((prev) => {
      const filtered = prev.filter(
        (o) => o.selector !== pickedTarget.selector,
      );
      return [
        ...filtered,
        {
          id: `${pickedTarget.selector}::${fontId}`,
          selector: pickedTarget.selector,
          fontId,
          slotKey: pickedTarget.slotKey,
        },
      ];
    });
  }

  /** Close the fine-tune panel and revert the override to whatever
   *  the user had at the moment they opened the panel — used by the
   *  Cancel button. */
  function cancelFineTune(originalFontId: string | undefined) {
    if (!pickedTarget) return;
    if (originalFontId !== undefined) {
      setDraftFont(originalFontId);
    } else {
      // No prior override — strip whatever live edit landed.
      setOverrides((prev) =>
        prev.filter((o) => o.selector !== pickedTarget.selector),
      );
    }
    setPickedTarget(null);
  }

  function removeOverride(id: string) {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  }

  function clearAllOverrides() {
    setOverrides([]);
  }

  /** Scroll the first matching element into view and flash the
   *  whole match set. If nothing matches on the current page and
   *  a route hint is provided, navigate first — the pending-home
   *  effect picks up the flash once the new route lands. */
  function homeToSurface(selector: string, route?: string) {
    const first = document.querySelector<HTMLElement>(selector);
    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
      flashSurface(selector);
      return;
    }
    if (route) {
      setPendingHome({ selector, route });
      router.push(route);
    }
  }

  /** Apply a bright solid outline to a set of elements — used to
   *  identify the elements that will actually change when the user
   *  edits the picked surface. */
  function flashElementsBright(els: readonly HTMLElement[], durationMs = 2800) {
    if (els.length === 0) return;
    for (const el of els) {
      el.style.transition =
        "outline-color 0.2s ease, outline-offset 0.2s ease";
      el.style.outline = "2px solid #d4a373";
      el.style.outlineOffset = "3px";
    }
    window.setTimeout(() => {
      for (const el of els) {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.style.transition = "";
      }
    }, durationMs);
  }

  /** Apply a faint dashed outline — used for "these elements share
   *  the slot but are NOT what your override will modify". */
  function flashElementsDim(els: readonly HTMLElement[], durationMs = 1800) {
    if (els.length === 0) return;
    for (const el of els) {
      el.style.transition = "outline-color 0.2s ease";
      el.style.outline = "1px dashed rgba(212, 163, 115, 0.45)";
      el.style.outlineOffset = "2px";
    }
    window.setTimeout(() => {
      for (const el of els) {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.style.transition = "";
      }
    }, durationMs);
  }

  /** Visualise picker resolution with a clear hierarchy:
   *  - elements matching the picked selector → solid bright outline
   *  - other slot surfaces → dashed dim outline
   *  So the user sees what their override will actually touch
   *  versus what merely shares the same slot. */
  function flashPickerResolution(
    key: SlotKey,
    target: HTMLElement,
    pickedSelector: string,
  ) {
    let pickedEls: HTMLElement[] = [];
    try {
      pickedEls = Array.from(
        document.querySelectorAll<HTMLElement>(pickedSelector),
      );
    } catch {
      pickedEls = [];
    }
    const pickedSet = new Set<HTMLElement>(pickedEls);
    pickedSet.add(target);

    const surfaceSel = SLOT_TARGETS[key].ui.surfaces
      .filter((s): s is { label: string; selector: string; wide?: boolean } =>
        !!s.selector && !s.wide,
      )
      .map((s) => s.selector)
      .join(", ");
    const relatedEls: HTMLElement[] = [];
    if (surfaceSel) {
      for (const el of document.querySelectorAll<HTMLElement>(surfaceSel)) {
        if (!pickedSet.has(el)) relatedEls.push(el);
      }
    }

    flashElementsBright(Array.from(pickedSet));
    flashElementsDim(relatedEls);
  }

  function reset() {
    setSelections({
      display: SLOT_TARGETS.display.defaultId,
      edDisplay: SLOT_TARGETS.edDisplay.defaultId,
      body: SLOT_TARGETS.body.defaultId,
      edBody: SLOT_TARGETS.edBody.defaultId,
      mono: SLOT_TARGETS.mono.defaultId,
    });
    setPalette("default");
    // Also clear every per-element override and any open
    // fine-tune panel — Reset should mean "everything back to
    // factory defaults", not just the slot dropdowns.
    setOverrides([]);
    setPickedTarget(null);
  }

  /** Apply a preset (curated or custom) — sets every slot and the
   *  palette in one beat, and clears any per-element overrides. */
  function applyPreset(presetId: string) {
    const preset =
      PRESETS.find((p) => p.id === presetId) ??
      customPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setSelections({ ...preset.fonts });
    setPalette(preset.palette);
    setOverrides([]);
    setPickedTarget(null);
  }

  /** Detect which preset (if any) the current state matches, so
   *  the active preset card can be highlighted. Searches custom
   *  presets first so user-saved looks win when curated overlap. */
  function activePresetId(): string | null {
    const all = [...customPresets, ...PRESETS];
    for (const preset of all) {
      if (preset.palette !== palette) continue;
      const match = (Object.keys(preset.fonts) as SlotKey[]).every(
        (k) => preset.fonts[k] === selections[k],
      );
      if (match) return preset.id;
    }
    return null;
  }

  /** Build a short composer-credit-style byline from the current
   *  font selections — used when saving a custom preset. */
  function buildBylineFromSelections(): string {
    const parts = [
      SERIFS.find((f) => f.id === selections.display)?.label,
      SANS.find((f) => f.id === selections.body)?.label,
      MONOS.find((f) => f.id === selections.mono)?.label,
    ].filter(Boolean);
    return parts.join(" · ");
  }

  function commitCustomPreset() {
    const trimmed = presetDraftName.trim();
    if (!trimmed) return;
    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      byline: buildBylineFromSelections(),
      fonts: { ...selections },
      palette,
      custom: true,
    };
    setCustomPresets((prev) => [...prev, newPreset]);
    setSavingPreset(false);
    setPresetDraftName("");
  }

  function cancelSavePreset() {
    setSavingPreset(false);
    setPresetDraftName("");
  }

  function deleteCustomPreset(id: string) {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id));
  }

  if (!active) return null;

  if (!open) {
    return (
      <button
        type="button"
        className={`design-lab-chip design-lab-chip--${position}`}
        onClick={() => setOpen(true)}
        aria-label="Open design lab"
        title="Open design lab (Shift + L)"
      >
        <span className="design-lab-chip__dot" aria-hidden />
        Lab
      </button>
    );
  }

  const activePalette =
    PALETTES.find((p) => p.id === palette) ?? PALETTES[0];

  return (
    <aside
      className={`design-lab design-lab--${position}`}
      aria-label="Design lab"
    >
      <header className="design-lab__head">
        <span className="design-lab__title">Design Lab</span>
        <div className="design-lab__head-actions">
          {view === "type" && (
            <button
              type="button"
              className={`design-lab__pick${picking ? " design-lab__pick--on" : ""}`}
              onClick={() => setPicking((p) => !p)}
              aria-pressed={picking}
              aria-label="Pick text on the page to identify its slot"
              title="Click, then point at any text on the page"
            >
              {picking ? "Cancel" : "Pick"}
            </button>
          )}
          {view === "type" && (
            <button
              type="button"
              className="design-lab__reset"
              onClick={reset}
              aria-label="Reset to defaults"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            className="design-lab__side"
            onClick={() => setPosition((p) => (p === "bl" ? "br" : "bl"))}
            aria-label={
              position === "bl"
                ? "Move panel to right side"
                : "Move panel to left side"
            }
            title={
              position === "bl" ? "Move to right" : "Move to left"
            }
          >
            ↔
          </button>
          <button
            type="button"
            className="design-lab__close"
            onClick={() => setOpen(false)}
            aria-label="Minimise design lab"
            title="Minimise"
          >
            ×
          </button>
        </div>
      </header>

      <div className="design-lab__tabs" role="tablist" aria-label="Lab view">
        <button
          type="button"
          role="tab"
          aria-selected={view === "type"}
          className={`design-lab__tab${view === "type" ? " design-lab__tab--on" : ""}`}
          onClick={() => setView("type")}
        >
          Type
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "map"}
          className={`design-lab__tab${view === "map" ? " design-lab__tab--on" : ""}`}
          onClick={() => setView("map")}
        >
          Map
        </button>
      </div>

      {view === "type" && (() => {
        const active = activePresetId();
        const allPresets: Preset[] = [...PRESETS, ...customPresets];
        return (
          <div className="design-lab__presets" role="region" aria-label="Design presets">
            <div className="design-lab__presets-head">
              <span className="design-lab__presets-label">Presets</span>
              {!savingPreset ? (
                <button
                  type="button"
                  className="design-lab__preset-save"
                  onClick={() => {
                    setPresetDraftName(`My preset ${customPresets.length + 1}`);
                    setSavingPreset(true);
                  }}
                  title="Save the current font + palette mix as a preset"
                >
                  + Save current
                </button>
              ) : (
                <span className="design-lab__preset-saving" aria-hidden>
                  Naming…
                </span>
              )}
            </div>

            {savingPreset && (
              <form
                className="design-lab__preset-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  commitCustomPreset();
                }}
              >
                <input
                  className="design-lab__preset-input"
                  type="text"
                  value={presetDraftName}
                  onChange={(e) => setPresetDraftName(e.target.value)}
                  placeholder="Preset name"
                  autoFocus
                  maxLength={48}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") cancelSavePreset();
                  }}
                />
                <button
                  type="submit"
                  className="design-lab__preset-save design-lab__preset-save--commit"
                  disabled={!presetDraftName.trim()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="design-lab__preset-cancel"
                  onClick={cancelSavePreset}
                  aria-label="Cancel"
                >
                  ×
                </button>
              </form>
            )}

            <ul className="design-lab__presets-list">
              {allPresets.map((p) => (
                <li key={p.id} className={p.custom ? "design-lab__preset-li--custom" : ""}>
                  <button
                    type="button"
                    className={`design-lab__preset${active === p.id ? " design-lab__preset--on" : ""}${p.custom ? " design-lab__preset--custom" : ""}`}
                    onClick={() => applyPreset(p.id)}
                    title={p.byline}
                  >
                    <span className="design-lab__preset-name">{p.label}</span>
                    <span className="design-lab__preset-byline">{p.byline}</span>
                  </button>
                  {p.custom && (
                    <button
                      type="button"
                      className="design-lab__preset-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomPreset(p.id);
                      }}
                      aria-label={`Delete preset ${p.label}`}
                      title="Delete this saved preset"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {view === "type" && picking && (
        <p className="design-lab__pick-hint">
          Click any text on the page to find its slot · Esc to cancel
        </p>
      )}

      {view === "map" && (
        <div className="design-lab__map">
          {SITEMAP.map((group) => (
            <section key={group.section} className="design-lab__map-group">
              <h3 className="design-lab__map-section">{group.section}</h3>
              <ul className="design-lab__map-list">
                {group.pages.map((page) => {
                  // Compare pathname against the path's bare route
                  // (sans query string) so /confirmation?session_id=…
                  // still highlights when the user is on that page.
                  const bare = page.path.split("?")[0];
                  const isCurrent = pathname === bare;
                  return (
                    <li key={page.path}>
                      <button
                        type="button"
                        className={`design-lab__map-row${isCurrent ? " design-lab__map-row--current" : ""}`}
                        onClick={() => {
                          // Seed any required state BEFORE
                          // navigating, so guards on the
                          // destination page see the mocked data
                          // and render normally.
                          if (page.mock) page.mock();
                          router.push(page.path);
                        }}
                        title={
                          page.mock
                            ? "Auto-seeds demo state, then opens this page"
                            : page.needs
                            ? `Needs: ${page.needs}`
                            : `Open ${page.path}`
                        }
                      >
                        <span className="design-lab__map-label">
                          {page.label}
                          {isCurrent && (
                            <span className="design-lab__map-here" aria-label="You are here">
                              ◉
                            </span>
                          )}
                        </span>
                        <code className="design-lab__map-path">{page.path}</code>
                        {page.description && (
                          <span className="design-lab__map-desc">
                            {page.description}
                          </span>
                        )}
                        {/* Auto-seeded routes show a green hint;
                            otherwise show the "Needs:" gate so the
                            user knows why the route might fail. */}
                        {page.mock ? (
                          <span className="design-lab__map-mock">
                            ↻ Auto-seeds demo state
                          </span>
                        ) : (
                          page.needs && (
                            <span className="design-lab__map-needs">
                              Needs · {page.needs}
                            </span>
                          )
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <p className="design-lab__map-note">
            Routes flagged{" "}
            <span className="design-lab__map-mock-inline">
              ↻ Auto-seeds demo state
            </span>{" "}
            populate sessionStorage with sample data before
            navigating, so design review never requires walking the
            real flow. Quiz step deep-linking is still pending —
            open <code>/quiz</code> for the form itself.
          </p>
        </div>
      )}

      {view === "type" && pickedTarget && (() => {
        const slot = SLOT_TARGETS[pickedTarget.slotKey];
        // Override font may come from any pool, so look up
        // across all categories.
        const draftFont =
          findFontAcrossPools(pickedTarget.draftFontId) ?? slot.source[0];
        const isLive =
          pickedTarget.draftFontId !== selectionsRef.current[pickedTarget.slotKey];
        return (
          <div className="design-lab__ft" role="region" aria-label="Fine-tune picked element">
            <div className="design-lab__ft-head">
              <span className="design-lab__ft-tag">
                Override only this{isLive ? " · live" : ""}
              </span>
              <button
                type="button"
                className="design-lab__close design-lab__close--ft"
                onClick={() => setPickedTarget(null)}
                aria-label="Close fine-tune (keep override)"
                title="Close (keep override)"
              >
                ×
              </button>
            </div>
            <code className="design-lab__ft-selector">{pickedTarget.selector}</code>
            <span className="design-lab__ft-current">
              Currently · {pickedTarget.currentFamily}
            </span>
            <select
              className="design-lab__select"
              value={pickedTarget.draftFontId}
              onChange={(e) => setDraftFont(e.target.value)}
            >
              {/* Per-element overrides are NOT locked to the slot's
                  pool — the user is allowed to assign any font to
                  the picked surface. Three optgroups expose the
                  full catalogue with the slot's natural pool first
                  for ease of finding the slot default. */}
              {(() => {
                const POOLS: { label: string; fonts: readonly Font[] }[] = [
                  { label: "Serif", fonts: SERIFS },
                  { label: "Sans", fonts: SANS },
                  { label: "Mono", fonts: MONOS },
                ];
                // Order the slot's natural pool first; the others
                // follow in their canonical sequence. The slot
                // default is marked inline so the user can spot it
                // even after the order shifts.
                const slotPool = slot.source;
                const ordered = [
                  POOLS.find((p) => p.fonts === slotPool),
                  ...POOLS.filter((p) => p.fonts !== slotPool),
                ].filter((p): p is { label: string; fonts: readonly Font[] } => !!p);
                return ordered.map(({ label, fonts }) => (
                  <optgroup key={label} label={label}>
                    {fonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.id === slot.defaultId ? `${f.label} (slot default)` : f.label}
                      </option>
                    ))}
                  </optgroup>
                ));
              })()}
            </select>
            <span
              className="design-lab__preview"
              style={{ fontFamily: draftFont.stack, ...slot.ui.sampleStyle }}
            >
              {pickedTarget.sample}
            </span>
            <div className="design-lab__ft-actions">
              <button
                type="button"
                className="design-lab__ft-cancel"
                onClick={() => cancelFineTune(pickedTarget.originalOverrideFontId)}
                title="Revert to the font in effect when you picked this element"
              >
                Cancel
              </button>
              <button
                type="button"
                className="design-lab__ft-apply"
                onClick={() => setPickedTarget(null)}
              >
                Keep
              </button>
            </div>
          </div>
        );
      })()}

      {view === "type" && SLOT_ORDER.map((key) => {
        const slot = SLOT_TARGETS[key];
        const value = selections[key];
        const stack =
          slot.source.find((f) => f.id === value)?.stack ?? slot.source[0].stack;
        return (
          <div
            className={`design-lab__row${activeSlot === key ? " design-lab__row--flash" : ""}`}
            key={key}
          >
            <span className="design-lab__label">{slot.ui.label}</span>
            <ul className="design-lab__surfaces" aria-label="What this slot controls">
              {slot.ui.surfaces.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    className={`design-lab__chip${i === 0 ? " design-lab__chip--key" : ""}${s.selector ? "" : " design-lab__chip--static"}`}
                    onClick={
                      s.selector
                        ? () => homeToSurface(s.selector!, s.route)
                        : undefined
                    }
                    disabled={!s.selector}
                    title={
                      s.selector
                        ? s.route
                          ? `Scroll to this on ${s.route}`
                          : "Scroll to this surface on the current page"
                        : undefined
                    }
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
            <select
              className="design-lab__select"
              value={value}
              onChange={(e) => setSlot(key, e.target.value)}
            >
              {slot.source.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id === slot.defaultId ? `${f.label} (default)` : f.label}
                </option>
              ))}
            </select>
            <span
              className="design-lab__preview"
              style={{ fontFamily: stack, ...slot.ui.sampleStyle }}
            >
              {slot.ui.sample}
            </span>
          </div>
        );
      })}

      {view === "type" && (
        <div className="design-lab__row">
          <span className="design-lab__label">Colour palette</span>
          <ul className="design-lab__surfaces" aria-label="What this slot controls">
            <li className="design-lab__chip design-lab__chip--key">Page background</li>
            <li className="design-lab__chip">Ink</li>
            <li className="design-lab__chip">Botanical accents</li>
          </ul>
          <select
            className="design-lab__select"
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
          >
            {PALETTES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <div className="design-lab__swatches" aria-hidden>
            {activePalette.swatches.map((c, i) => (
              <span
                key={i}
                className="design-lab__swatch"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      )}

      {view === "type" && overrides.length > 0 && (
        <div className="design-lab__row design-lab__row--overrides">
          <div className="design-lab__overrides-head">
            <span className="design-lab__label">
              Per-element overrides ({overrides.length})
            </span>
            <button
              type="button"
              className="design-lab__reset"
              onClick={clearAllOverrides}
              aria-label="Clear all overrides"
            >
              Clear all
            </button>
          </div>
          <ul className="design-lab__overrides-list">
            {overrides.map((o) => {
              // Override font may be from any pool — not just the
              // slot the picked element originally mapped to.
              const font = findFontAcrossPools(o.fontId);
              return (
                <li key={o.id} className="design-lab__override">
                  <code className="design-lab__override-sel">{o.selector}</code>
                  <span className="design-lab__override-arrow" aria-hidden>
                    →
                  </span>
                  <span className="design-lab__override-font">
                    {font?.label ?? o.fontId}
                  </span>
                  <button
                    type="button"
                    className="design-lab__override-remove"
                    onClick={() => removeOverride(o.id)}
                    aria-label={`Remove override for ${o.selector}`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="design-lab__hint">Shift + L to toggle · ?lab=0 to disable</p>
    </aside>
  );
}
