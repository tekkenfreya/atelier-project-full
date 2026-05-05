"use client";

import { useEffect, useState } from "react";
import "./DesignLab.css";

/**
 * Floating dev panel for live A/B-ing body fonts and palette.
 * Hidden by default. Activate with `?lab=1` once — the panel
 * persists itself in localStorage. Shift+L toggles open/closed
 * after activation. Use `?lab=0` to deactivate.
 *
 * The panel sets `data-body-font` and `data-palette` attributes
 * on <html>; the matching CSS rules in DesignLab.css remap the
 * relevant tokens. To add a new font or palette, append it to
 * the arrays below and add the corresponding rule in the CSS.
 */

type Font = { id: string; label: string };
type Palette = { id: string; label: string };

const FONTS: readonly Font[] = [
  { id: "inter", label: "Inter (default)" },
  { id: "dm-sans", label: "DM Sans" },
  { id: "satoshi", label: "Satoshi" },
  { id: "fraunces", label: "Fraunces (serif)" },
];

const PALETTES: readonly Palette[] = [
  { id: "default", label: "Warm botanical (default)" },
  { id: "alt-1", label: "Alt 1 — slate & moss (placeholder)" },
  { id: "alt-2", label: "Alt 2 — porcelain & rust (placeholder)" },
];

const STORAGE_KEYS = {
  active: "atelier-lab",
  font: "atelier-lab-font",
  palette: "atelier-lab-palette",
} as const;

export default function DesignLab() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);
  const [font, setFont] = useState<string>("inter");
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
    setFont(localStorage.getItem(STORAGE_KEYS.font) ?? "inter");
    setPalette(localStorage.getItem(STORAGE_KEYS.palette) ?? "default");
  }, []);

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
    document.documentElement.setAttribute("data-body-font", font);
    localStorage.setItem(STORAGE_KEYS.font, font);
  }, [active, font]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.setAttribute("data-palette", palette);
    localStorage.setItem(STORAGE_KEYS.palette, palette);
  }, [active, palette]);

  if (!active || !open) return null;

  return (
    <aside className="design-lab" aria-label="Design lab">
      <header className="design-lab__head">
        <span className="design-lab__title">Design Lab</span>
        <button
          type="button"
          className="design-lab__close"
          onClick={() => setOpen(false)}
          aria-label="Hide design lab"
        >
          ×
        </button>
      </header>

      <label className="design-lab__row">
        <span className="design-lab__label">Body font</span>
        <select
          className="design-lab__select"
          value={font}
          onChange={(e) => setFont(e.target.value)}
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="design-lab__row">
        <span className="design-lab__label">Palette</span>
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
      </label>

      <p className="design-lab__hint">Shift + L to toggle · ?lab=0 to disable</p>
    </aside>
  );
}
