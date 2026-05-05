"use client";

import { useEffect, useState } from "react";
import "./DesignLab.css";

/**
 * Floating dev panel for live A/B-ing typography (display, body,
 * mono) and palette. Hidden by default. Activate with `?lab=1`
 * once — the panel persists itself in localStorage. Shift+L
 * toggles open/closed after activation. `?lab=0` to deactivate.
 *
 * Each row is labelled in plain English with a "where it shows up"
 * hint and a live preview rendered in the selected font, so the
 * relationship between dropdown and surface is immediately obvious.
 */

type Font = {
  id: string;
  label: string;
  stack: string;
  /** Google Fonts query fragment, e.g. "Manrope:wght@200..800". Omit
   *  for fonts already loaded in app/layout.tsx. */
  google?: string;
};

const SERIFS: readonly Font[] = [
  { id: "fraunces", label: "Fraunces (default)", stack: '"Fraunces", Georgia, serif' },
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
  { id: "inter", label: "Inter (default)", stack: '"Inter", system-ui, -apple-system, sans-serif' },
  { id: "dm-sans", label: "DM Sans", stack: '"DM Sans", system-ui, -apple-system, sans-serif' },
  { id: "satoshi", label: "Satoshi", stack: '"Satoshi", system-ui, -apple-system, sans-serif' },
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
  { id: "jetbrains-mono", label: "JetBrains Mono (default)", stack: '"JetBrains Mono", ui-monospace, Menlo, monospace' },
  { id: "geist-mono", label: "Geist Mono", stack: '"Geist Mono", ui-monospace, Menlo, monospace', google: "Geist+Mono:wght@100..900" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", stack: '"IBM Plex Mono", ui-monospace, Menlo, monospace', google: "IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400;1,500" },
  { id: "space-mono", label: "Space Mono", stack: '"Space Mono", ui-monospace, Menlo, monospace', google: "Space+Mono:ital,wght@0,400;0,700;1,400;1,700" },
  { id: "fira-code", label: "Fira Code", stack: '"Fira Code", ui-monospace, Menlo, monospace', google: "Fira+Code:wght@300..700" },
  { id: "dm-mono", label: "DM Mono", stack: '"DM Mono", ui-monospace, Menlo, monospace', google: "DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500" },
  { id: "inconsolata", label: "Inconsolata", stack: '"Inconsolata", ui-monospace, Menlo, monospace', google: "Inconsolata:wght@200..900" },
  { id: "roboto-mono", label: "Roboto Mono", stack: '"Roboto Mono", ui-monospace, Menlo, monospace', google: "Roboto+Mono:ital,wght@0,100..700;1,100..700" },
  { id: "azeret-mono", label: "Azeret Mono", stack: '"Azeret Mono", ui-monospace, Menlo, monospace', google: "Azeret+Mono:ital,wght@0,100..900;1,100..900" },
];

type Palette = {
  id: string;
  label: string;
  /** Four representative swatches: bg, ink, accent-1, accent-2. Used
   *  for the live preview row only — the full palette is set by the
   *  matching CSS rule in DesignLab.css. */
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

/** Plain-English description of where each token actually shows up. */
const SLOTS = {
  display: {
    label: "Headlines · italic serif",
    where: "Big titles · 'Atelier Rusalka' wordmark · 'Let's begin with your name.'",
    sample: "Let’s begin with your name.",
    sampleStyle: { fontStyle: "italic", fontSize: "18px", letterSpacing: "-0.01em" },
  },
  body: {
    label: "Paragraph text · sans",
    where: "Body copy · descriptions · form inputs · most readable text",
    sample: "Each bottle is composed from 185 botanical actives — no two alike.",
    sampleStyle: { fontStyle: "normal", fontSize: "12px", letterSpacing: "0" },
  },
  mono: {
    label: "Captions & buttons · mono",
    where: "Eyebrows · CTAs · the promo strip · category labels · fine print",
    sample: "EDITION MMXXVI · 60% OFF",
    sampleStyle: { fontStyle: "normal", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const },
  },
} as const;

const STORAGE_KEYS = {
  active: "atelier-lab",
  display: "atelier-lab-display",
  body: "atelier-lab-body",
  mono: "atelier-lab-mono",
  palette: "atelier-lab-palette",
} as const;

const DEFAULTS = {
  display: "fraunces",
  body: "inter",
  mono: "jetbrains-mono",
  palette: "default",
} as const;

function buildGoogleFontsUrl(fonts: readonly Font[]): string {
  const families = fonts
    .filter((f) => f.google)
    .map((f) => `family=${f.google}`)
    .join("&");
  if (!families) return "";
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

function buildOverrideCss(): string {
  const rules: string[] = [];

  function addRules(
    attr: string,
    fonts: readonly Font[],
    edVar: string,
    atelierVar: string,
    defaultId: string,
  ) {
    fonts.forEach((f) => {
      if (f.id === defaultId) return;
      rules.push(
        `html[data-${attr}="${f.id}"] { ${edVar}: ${f.stack}; }`,
        `html[data-${attr}="${f.id}"] .atelier { ${atelierVar}: ${f.stack}; }`,
      );
    });
  }

  addRules("display-font", SERIFS, "--ed-serif", "--serif", DEFAULTS.display);
  addRules("body-font", SANS, "--ed-sans", "--sans", DEFAULTS.body);
  addRules("mono-font", MONOS, "--ed-mono", "--mono", DEFAULTS.mono);

  rules.push(`.atelier { font-family: var(--sans); }`);

  return rules.join("\n");
}

export default function DesignLab() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);
  const [display, setDisplay] = useState<string>(DEFAULTS.display);
  const [body, setBody] = useState<string>(DEFAULTS.body);
  const [mono, setMono] = useState<string>(DEFAULTS.mono);
  const [palette, setPalette] = useState<string>(DEFAULTS.palette);

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
    setDisplay(localStorage.getItem(STORAGE_KEYS.display) ?? DEFAULTS.display);
    setBody(localStorage.getItem(STORAGE_KEYS.body) ?? DEFAULTS.body);
    setMono(localStorage.getItem(STORAGE_KEYS.mono) ?? DEFAULTS.mono);
    setPalette(localStorage.getItem(STORAGE_KEYS.palette) ?? DEFAULTS.palette);
  }, []);

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

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-display-font", display);
    localStorage.setItem(STORAGE_KEYS.display, display);
  }, [active, display]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-body-font", body);
    localStorage.setItem(STORAGE_KEYS.body, body);
  }, [active, body]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-mono-font", mono);
    localStorage.setItem(STORAGE_KEYS.mono, mono);
  }, [active, mono]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-palette", palette);
    localStorage.setItem(STORAGE_KEYS.palette, palette);
  }, [active, palette]);

  function reset() {
    setDisplay(DEFAULTS.display);
    setBody(DEFAULTS.body);
    setMono(DEFAULTS.mono);
    setPalette(DEFAULTS.palette);
  }

  if (!active || !open) return null;

  const displayStack =
    SERIFS.find((f) => f.id === display)?.stack ?? SERIFS[0].stack;
  const bodyStack = SANS.find((f) => f.id === body)?.stack ?? SANS[0].stack;
  const monoStack = MONOS.find((f) => f.id === mono)?.stack ?? MONOS[0].stack;
  const activePalette =
    PALETTES.find((p) => p.id === palette) ?? PALETTES[0];

  return (
    <aside className="design-lab" aria-label="Design lab">
      <header className="design-lab__head">
        <span className="design-lab__title">Design Lab</span>
        <div className="design-lab__head-actions">
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

      <div className="design-lab__row">
        <span className="design-lab__label">{SLOTS.display.label}</span>
        <span className="design-lab__where">{SLOTS.display.where}</span>
        <select
          className="design-lab__select"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
        >
          {SERIFS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <span
          className="design-lab__preview"
          style={{ fontFamily: displayStack, ...SLOTS.display.sampleStyle }}
        >
          {SLOTS.display.sample}
        </span>
      </div>

      <div className="design-lab__row">
        <span className="design-lab__label">{SLOTS.body.label}</span>
        <span className="design-lab__where">{SLOTS.body.where}</span>
        <select
          className="design-lab__select"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        >
          {SANS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <span
          className="design-lab__preview"
          style={{ fontFamily: bodyStack, ...SLOTS.body.sampleStyle }}
        >
          {SLOTS.body.sample}
        </span>
      </div>

      <div className="design-lab__row">
        <span className="design-lab__label">{SLOTS.mono.label}</span>
        <span className="design-lab__where">{SLOTS.mono.where}</span>
        <select
          className="design-lab__select"
          value={mono}
          onChange={(e) => setMono(e.target.value)}
        >
          {MONOS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <span
          className="design-lab__preview"
          style={{ fontFamily: monoStack, ...SLOTS.mono.sampleStyle }}
        >
          {SLOTS.mono.sample}
        </span>
      </div>

      <div className="design-lab__row">
        <span className="design-lab__label">Colour palette</span>
        <span className="design-lab__where">
          Page background, ink, botanical accents
        </span>
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

      <p className="design-lab__hint">Shift + L to toggle · ?lab=0 to disable</p>
    </aside>
  );
}
