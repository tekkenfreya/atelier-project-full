import bwipjs from "bwip-js/browser";

interface RenderOpts {
  value: string;
  bcid?: string;
  scale?: number;
  height?: number;
  includeText?: boolean;
}

const DEFAULT_BCID = "ean13";

export function renderBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  opts: RenderOpts,
): void {
  bwipjs.toCanvas(canvas, {
    bcid: opts.bcid ?? DEFAULT_BCID,
    text: opts.value,
    scale: opts.scale ?? 3,
    height: opts.height ?? 20,
    includetext: opts.includeText ?? true,
    textxalign: "center",
    textsize: 10,
    paddingwidth: 6,
    paddingheight: 4,
    backgroundcolor: "FFFFFF",
    barcolor: "000000",
  });
}

export function createBarcodeCanvas(opts: RenderOpts): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  renderBarcodeToCanvas(canvas, opts);
  return canvas;
}

export function renderBarcodeToDataUrl(opts: RenderOpts): string {
  return createBarcodeCanvas(opts).toDataURL("image/png");
}
