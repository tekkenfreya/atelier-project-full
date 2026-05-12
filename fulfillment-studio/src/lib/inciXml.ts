/**
 * INCI Beauty XML export.
 *
 * Generates a single-product XML document that conforms to the INCI Beauty
 * import schema. One file is exported per fulfilled item (per bottle, per
 * order), so each download lands in INCI Beauty as one product entry with
 * its EAN/GTIN, brand, INCI composition, and price.
 *
 * Schema (per the INCI document tree we were sent):
 *
 *   <products>
 *     <product>
 *       <ean>{gtin}</ean>
 *       <brand>{brand}</brand>
 *       <title>{title}</title>
 *       <category>{category}</category>
 *       <compositions>
 *         <composition>
 *           <label>{optional sub-label}</label>
 *           <inci>{comma-separated INCI ingredients}</inci>
 *           <info>{optional info string}</info>
 *         </composition>
 *       </compositions>
 *       <price>{price}</price>
 *       <currency>{eur|...}</currency>
 *       <image_product>{public image URL}</image_product>
 *     </product>
 *   </products>
 *
 * The image URL must be a publicly fetchable URL — INCI Beauty fetches it
 * server-side when ingesting the XML. The placeholder used here points at
 * a Rose Bulgare bottle that lives in /public/products/ until each Atelier
 * Rusalka product has its own photographed bottle in Supabase Storage.
 */

import type { FulfilledItem, OrderItem } from "./engine";

/** Brand string written to every <brand> tag. */
const BRAND = "Atelier Rusalka";

/** Placeholder product image — Rose Bulgare bottle render. Now
 *  served from Supabase Storage (bucket `products`, public) at a
 *  permanent URL that is independent of Vercel redeploys. URL
 *  verified as HTTP 200 with content-type image/jpeg + open CORS,
 *  so INCI Beauty's ingest can fetch it without extra config.
 *
 *  Served as JPEG (not WebP) because INCI Beauty's ingest does
 *  not accept WebP and silently rejects products whose
 *  <image_product> resolves to one.
 *
 *  As products gain their own photographs, switch the source per
 *  product or set VITE_INCI_IMAGE_URL per environment. Convention:
 *  one object per GTIN inside the same `products` bucket
 *  (e.g. <PROJECT>.supabase.co/storage/v1/object/public/products/
 *  <gtin>.jpg). The bucket is public, so the URL pattern stays
 *  predictable. */
export const DEFAULT_PRODUCT_IMAGE_URL =
  (import.meta.env.VITE_INCI_IMAGE_URL as string | undefined) ??
  "https://epbyhiagcnbyznvmbebj.supabase.co/storage/v1/object/public/products/placeholder-rose-bulgare.jpg";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Build an INCI Beauty-compatible single-product XML document from
 *  one fulfilled item plus its source order line.
 *
 *  `sourceItem.price` is the canonical price — the fulfilled record
 *  only carries label content. `assigned.inci` is the comma-separated
 *  INCI string that's already on the product record. */
export function buildInciXml(
  assigned: FulfilledItem,
  sourceItem: OrderItem,
  imageUrl: string = DEFAULT_PRODUCT_IMAGE_URL,
): string {
  const ean = assigned.gtin || "";
  const title = assigned.name || sourceItem.productName || "";
  const category = assigned.category || sourceItem.category || "";
  const inci = assigned.inci ?? "";
  const price = typeof sourceItem.price === "number"
    ? sourceItem.price.toFixed(2)
    : "0.00";
  const info = assigned.net_content
    ? `Net content: ${assigned.net_content}`
    : "";

  // <label/> stays self-closing for single-composition products (the
  // INCI sample uses an empty self-closing tag when there's no
  // sub-composition like "Wax / Wipes / SOS Oil").
  return `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <ean>${escapeXml(ean)}</ean>
    <brand>${escapeXml(BRAND)}</brand>
    <title>${escapeXml(title)}</title>
    <category>${escapeXml(category)}</category>
    <compositions>
      <composition>
        <label/>
        <inci>${escapeXml(inci)}</inci>
        <info>${escapeXml(info)}</info>
      </composition>
    </compositions>
    <price>${price}</price>
    <currency>eur</currency>
    <image_product>${escapeXml(imageUrl)}</image_product>
  </product>
</products>
`;
}

/** Trigger a browser download of the INCI XML for a single product.
 *  Filename is "{gtin}.xml" so multiple downloads from one order
 *  don't collide. */
export function downloadInciXml(
  assigned: FulfilledItem,
  sourceItem: OrderItem,
  imageUrl?: string,
): void {
  const xml = buildInciXml(assigned, sourceItem, imageUrl);
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${assigned.gtin || "product"}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
