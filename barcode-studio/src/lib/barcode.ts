import bwipjs from "bwip-js/browser";
import type { Symbology } from "./gtin";
import { getSpec } from "./gtin";

/**
 * GS1 EAN-13 specification — 100% target ("nominal") size.
 * Source: GS1 General Specifications, "Barcode symbols intended for
 * scanning at point-of-sale" table.
 *
 * The X-dimension is the width of one module (the smallest bar/space
 * unit). Minimum height is the bar portion only — does NOT include the
 * human-readable digits beneath the symbol.
 */
export const GS1_EAN13 = {
  X_DIMENSION_MM: 0.330,
  HEIGHT_MM: 22.85,
  /** Modules of left quiet zone (white space). */
  LEFT_QUIET_ZONE_MODULES: 11,
  /** Modules of right quiet zone. */
  RIGHT_QUIET_ZONE_MODULES: 7,
} as const;

/**
 * Padding mm value passed to bwip-js — uses the larger of the two quiet
 * zones (11X left) since bwip-js applies paddingwidth symmetrically.
 * That makes the right side oversized but always meets GS1 minimum.
 */
const QUIET_ZONE_PADDING_MM =
  GS1_EAN13.LEFT_QUIET_ZONE_MODULES * GS1_EAN13.X_DIMENSION_MM;

/**
 * Render mode presets:
 * - "preview" — scale 3, low-resolution PNG for on-screen UI
 * - "print"   — scale 6 (~457 DPI), GS1-compliant PNG for downloads + print
 */
const SCALE_BY_MODE = { preview: 3, print: 6 } as const;

export type RenderMode = "preview" | "print";

interface RenderOpts {
  value: string;
  symbology: Symbology;
  /** Resolution preset. Defaults to "preview". */
  mode?: RenderMode;
  /** Pixels per module override. Trumps mode. */
  scale?: number;
  /** Bar height in mm override. Trumps GS1 spec default of 22.85mm. */
  height?: number;
  /** Padding width in mm override. Trumps GS1 quiet zone default. */
  paddingWidth?: number;
  includeText?: boolean;
  /** Hex (no #), default "FFFFFF". */
  background?: string;
  /** Hex (no #), default "000000". */
  foreground?: string;
}

function buildOpts(opts: RenderOpts) {
  const mode: RenderMode = opts.mode ?? "preview";
  return {
    bcid: getSpec(opts.symbology).bwipName,
    text: opts.value,
    scale: opts.scale ?? SCALE_BY_MODE[mode],
    height: opts.height ?? GS1_EAN13.HEIGHT_MM,
    includetext: opts.includeText ?? true,
    textxalign: "center" as const,
    textsize: 10,
    paddingwidth: opts.paddingWidth ?? QUIET_ZONE_PADDING_MM,
    paddingheight: 1.5,
    backgroundcolor: opts.background ?? "FFFFFF",
    barcolor: opts.foreground ?? "000000",
  };
}

export function renderBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  opts: RenderOpts,
): void {
  bwipjs.toCanvas(canvas, buildOpts(opts));
}

export function renderBarcodeToSvg(opts: RenderOpts): string {
  return bwipjs.toSVG(buildOpts(opts));
}

export function createBarcodeCanvas(opts: RenderOpts): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  renderBarcodeToCanvas(canvas, opts);
  return canvas;
}
