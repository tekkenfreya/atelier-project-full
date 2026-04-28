import bwipjs from "bwip-js/browser";

/**
 * GS1 EAN-13 specification — 100% target ("nominal") size.
 * Source: GS1 General Specifications, "Barcode symbols intended for
 * scanning at point-of-sale" table.
 *
 * The X-dimension is the width of one module. Minimum height is the
 * bar portion only — does NOT include the human-readable digits.
 */
export const GS1_EAN13 = {
  X_DIMENSION_MM: 0.330,
  HEIGHT_MM: 22.85,
  LEFT_QUIET_ZONE_MODULES: 11,
  RIGHT_QUIET_ZONE_MODULES: 7,
} as const;

/**
 * Total nominal width (in mm) of an EAN-13 symbol at 100% target,
 * including both quiet zones. 95 module body + 11 left + 7 right.
 */
export const GS1_EAN13_TOTAL_WIDTH_MM =
  (95 +
    GS1_EAN13.LEFT_QUIET_ZONE_MODULES +
    GS1_EAN13.RIGHT_QUIET_ZONE_MODULES) *
  GS1_EAN13.X_DIMENSION_MM;

const QUIET_ZONE_PADDING_MM =
  GS1_EAN13.LEFT_QUIET_ZONE_MODULES * GS1_EAN13.X_DIMENSION_MM;

const SCALE_BY_MODE = { preview: 3, print: 6 } as const;

export type RenderMode = "preview" | "print";

interface RenderOpts {
  value: string;
  bcid?: string;
  /** Resolution preset. Defaults to "preview". */
  mode?: RenderMode;
  /** Pixels per module override. Trumps mode. */
  scale?: number;
  /** Bar height in mm override. Trumps GS1 spec default of 22.85mm. */
  height?: number;
  /** Padding width in mm override. Trumps GS1 quiet zone default. */
  paddingWidth?: number;
  includeText?: boolean;
}

function buildOpts(opts: RenderOpts) {
  const mode: RenderMode = opts.mode ?? "preview";
  return {
    bcid: opts.bcid ?? "ean13",
    text: opts.value,
    scale: opts.scale ?? SCALE_BY_MODE[mode],
    height: opts.height ?? GS1_EAN13.HEIGHT_MM,
    includetext: opts.includeText ?? true,
    textxalign: "center" as const,
    textsize: 10,
    paddingwidth: opts.paddingWidth ?? QUIET_ZONE_PADDING_MM,
    paddingheight: 1.5,
    backgroundcolor: "FFFFFF",
    barcolor: "000000",
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

export function renderBarcodeToDataUrl(opts: RenderOpts): string {
  return createBarcodeCanvas(opts).toDataURL("image/png");
}
