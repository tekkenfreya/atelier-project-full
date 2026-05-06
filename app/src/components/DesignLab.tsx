"use client";

import { useEffect, useRef, useState } from "react";
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
  { id: "spectral", label: "Spectral", stack: '"Spectral", Georgia, serif', google: "Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700" },
  { id: "bodoni-moda", label: "Bodoni Moda", stack: '"Bodoni Moda", Georgia, serif', google: "Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900" },
  { id: "italiana", label: "Italiana", stack: '"Italiana", Georgia, serif', google: "Italiana" },
  { id: "source-serif", label: "Source Serif 4", stack: '"Source Serif 4", Georgia, serif', google: "Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900" },
  { id: "libre-caslon", label: "Libre Caslon Text", stack: '"Libre Caslon Text", Georgia, serif', google: "Libre+Caslon+Text:ital,wght@0,400;0,700;1,400" },
  { id: "tenor-sans", label: "Tenor Sans", stack: '"Tenor Sans", Georgia, serif', google: "Tenor+Sans" },
  { id: "cardo", label: "Cardo", stack: '"Cardo", Georgia, serif', google: "Cardo:ital,wght@0,400;0,700;1,400" },
  { id: "marcellus", label: "Marcellus", stack: '"Marcellus", Georgia, serif', google: "Marcellus" },
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
];

type SlotKey = "display" | "edDisplay" | "body" | "edBody" | "mono";

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
        { label: "Featured “Let’s begin…”", selector: ".featured__name" },
        { label: "Brand line", selector: ".featured__brand-line" },
        { label: "Italic input", selector: ".featured__name-input" },
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
        { label: "Cart titles", selector: ".cart-title, .cart-summary-title, .cart-item-name, .cart-plan-title" },
        { label: "Checkout titles", selector: ".checkout-title" },
        { label: "Results product name", selector: ".rd-product-name" },
        { label: "Scientific names", selector: ".rd-active-detail-sci" },
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
        { label: "Subscription details", selector: ".lux-sub__card-cadence, .lux-sub__card-notes li" },
        { label: "Subscription button", selector: ".sub__cta, .lux-sub__card-cta" },
        { label: "Footer detail rows", selector: ".lux-footer__detail-row, .footer-row" },
        { label: "Default homepage body", selector: ".atelier", wide: true },
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
        { label: "Cart item details", selector: ".cart-item-details, .cart-item-category, .cart-item-price" },
        { label: "Cart plan cards", selector: ".cart-plan-label, .cart-plan-desc, .cart-plan-reassurances li" },
        { label: "Quiz body", selector: ".quiz-question-body, .quiz-option-label" },
        { label: "Results details", selector: ".rd-product-skin, .rd-reason, .rd-active-detail-fn" },
        { label: "Trust strip", selector: ".trust-strip__item" },
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
        { label: "Hero mark", selector: ".hero-v__mark" },
        { label: "“Begin” button", selector: ".hero-v__cta" },
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
    label: "Slate & moss (placeholder)",
    swatches: ["#e9e6e0", "#1a1d1f", "#7a8d6a", "#a99175"],
  },
  {
    id: "alt-2",
    label: "Porcelain & rust (placeholder)",
    swatches: ["#f6f1ea", "#2a1f17", "#9aa48a", "#c87c52"],
  },
];

const STORAGE_KEYS: Record<SlotKey | "active" | "palette", string> = {
  active: "atelier-lab",
  display: "atelier-lab-display",
  edDisplay: "atelier-lab-ed-display",
  body: "atelier-lab-body",
  edBody: "atelier-lab-ed-body",
  mono: "atelier-lab-mono",
  palette: "atelier-lab-palette",
};

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
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);
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
  /** A picked element waiting to be tuned: the user can choose a
   *  font that applies ONLY to its selector instead of the whole
   *  slot. Cleared on apply or cancel. */
  const [pickedTarget, setPickedTarget] = useState<{
    selector: string;
    currentFamily: string;
    slotKey: SlotKey;
    draftFontId: string;
  } | null>(null);
  /** Active per-element overrides. Each one becomes one CSS rule
   *  injected into a dedicated <style> tag — slot-wide swaps still
   *  fire, but overrides win because they use !important. */
  const [overrides, setOverrides] = useState<Override[]>([]);

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
  }, []);

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
        const slot = SLOT_TARGETS[o.slotKey];
        const font = slot.source.find((f) => f.id === o.fontId);
        if (!font) return "";
        return `${o.selector} { font-family: ${font.stack} !important; }`;
      })
      .filter(Boolean);
    styleEl.textContent = rules.join("\n");
  }, [overrides]);

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
        flashSlotSurfaces(slot);
        const selector = bestSelectorFor(target);
        const family = getComputedStyle(target)
          .fontFamily.split(",")[0]
          .replace(/['"]/g, "")
          .trim();
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
   *  element". Joins all component-level classes for high
   *  specificity; falls back to the tag name when an element is
   *  unclassed. Animation/utility helpers and the lab's own
   *  classes are filtered out. */
  function bestSelectorFor(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;
    const skip = /^(design-lab|featured__fade|atelier)(_|-|$)/;
    const classes = Array.from(el.classList).filter((c) => !skip.test(c));
    if (classes.length === 0) return el.tagName.toLowerCase();
    return classes.map((c) => `.${c}`).join("");
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

  /** Apply the draft font selection from the fine-tune panel as an
   *  override and close the panel. */
  function applyOverride() {
    if (!pickedTarget) return;
    const id = `${pickedTarget.selector}::${pickedTarget.draftFontId}`;
    const next: Override = {
      id,
      selector: pickedTarget.selector,
      fontId: pickedTarget.draftFontId,
      slotKey: pickedTarget.slotKey,
    };
    setOverrides((prev) => {
      const filtered = prev.filter((o) => o.selector !== next.selector);
      return [...filtered, next];
    });
    setPickedTarget(null);
  }

  function removeOverride(id: string) {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  }

  function clearAllOverrides() {
    setOverrides([]);
  }

  /** After the picker resolves a slot, outline every other element
   *  the slot also controls — so the user sees the slot's full
   *  footprint, not just the one element they pointed at. Wide
   *  selectors (e.g. ".atelier" itself) are excluded so the
   *  highlight does not box the entire homepage. */
  function flashSlotSurfaces(key: SlotKey) {
    const surfaces = SLOT_TARGETS[key].ui.surfaces;
    const selectors = surfaces
      .filter((s): s is { label: string; selector: string; wide?: boolean } =>
        !!s.selector && !s.wide,
      )
      .map((s) => s.selector);
    if (selectors.length === 0) return;
    flashSurface(selectors.join(", "), 2200);
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
  }

  if (!active || !open) return null;

  const activePalette =
    PALETTES.find((p) => p.id === palette) ?? PALETTES[0];

  return (
    <aside className="design-lab" aria-label="Design lab">
      <header className="design-lab__head">
        <span className="design-lab__title">Design Lab</span>
        <div className="design-lab__head-actions">
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
          <button
            type="button"
            className="design-lab__reset"
            onClick={reset}
            aria-label="Reset to defaults"
          >
            Reset
          </button>
          <button
            type="button"
            className="design-lab__close"
            onClick={() => setOpen(false)}
            aria-label="Hide design lab"
          >
            ×
          </button>
        </div>
      </header>

      {picking && (
        <p className="design-lab__pick-hint">
          Click any text on the page to find its slot · Esc to cancel
        </p>
      )}

      {pickedTarget && (() => {
        const slot = SLOT_TARGETS[pickedTarget.slotKey];
        return (
          <div className="design-lab__ft" role="region" aria-label="Fine-tune picked element">
            <div className="design-lab__ft-head">
              <span className="design-lab__ft-tag">Override only this</span>
              <button
                type="button"
                className="design-lab__close design-lab__close--ft"
                onClick={() => setPickedTarget(null)}
                aria-label="Cancel fine-tune"
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
              onChange={(e) =>
                setPickedTarget({ ...pickedTarget, draftFontId: e.target.value })
              }
            >
              {slot.source.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id === slot.defaultId ? `${f.label} (default)` : f.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="design-lab__ft-apply"
              onClick={applyOverride}
            >
              Apply override
            </button>
          </div>
        );
      })()}

      {SLOT_ORDER.map((key) => {
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
                    onClick={s.selector ? () => flashSurface(s.selector!) : undefined}
                    disabled={!s.selector}
                    title={s.selector ? "Click to flash this surface on the page" : undefined}
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

      {overrides.length > 0 && (
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
              const slot = SLOT_TARGETS[o.slotKey];
              const font = slot.source.find((f) => f.id === o.fontId);
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
