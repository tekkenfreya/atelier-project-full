"use client";

import { useEffect, useState } from "react";
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
  ui: { label: string; where: string; sample: string; sampleStyle: React.CSSProperties };
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
      where:
        "Homepage hero · featured 'Let's begin with your name.' · brand line · italic input text",
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
      where:
        "Cart titles · quiz section names · results 'Your Skin Profile' · disclosure scientific names",
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
      where:
        "Subscription card cadence + notes + button · footer detail rows · default homepage body text",
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
      where:
        "Cart item names + summary · checkout copy · quiz question body · results detail panels · trust strips",
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
      where:
        "Navigation links + CTA · hero mark · 'Begin' button · promo strip · eyebrows · category labels",
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

  function setSlot(key: SlotKey, value: string) {
    setSelections((prev) => ({ ...prev, [key]: value }));
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

      {SLOT_ORDER.map((key) => {
        const slot = SLOT_TARGETS[key];
        const value = selections[key];
        const stack =
          slot.source.find((f) => f.id === value)?.stack ?? slot.source[0].stack;
        return (
          <div className="design-lab__row" key={key}>
            <span className="design-lab__label">{slot.ui.label}</span>
            <span className="design-lab__where">{slot.ui.where}</span>
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
