import bwipjs from "bwip-js/browser";
import type { Symbology } from "./gtin";
import { getSpec } from "./gtin";

interface RenderOpts {
  value: string;
  symbology: Symbology;
  scale?: number;
  height?: number;
  includeText?: boolean;
  background?: string;
  foreground?: string;
}

export function renderBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  opts: RenderOpts,
): void {
  bwipjs.toCanvas(canvas, {
    bcid: getSpec(opts.symbology).bwipName,
    text: opts.value,
    scale: opts.scale ?? 3,
    height: opts.height ?? 20,
    includetext: opts.includeText ?? true,
    textxalign: "center",
    textsize: 10,
    paddingwidth: 6,
    paddingheight: 4,
    backgroundcolor: opts.background ?? "FFFFFF",
    barcolor: opts.foreground ?? "000000",
  });
}

export function renderBarcodeToSvg(opts: RenderOpts): string {
  return bwipjs.toSVG({
    bcid: getSpec(opts.symbology).bwipName,
    text: opts.value,
    scale: opts.scale ?? 3,
    height: opts.height ?? 20,
    includetext: opts.includeText ?? true,
    textxalign: "center",
    textsize: 10,
    paddingwidth: 6,
    paddingheight: 4,
  });
}

export function createBarcodeCanvas(opts: RenderOpts): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  renderBarcodeToCanvas(canvas, opts);
  return canvas;
}
