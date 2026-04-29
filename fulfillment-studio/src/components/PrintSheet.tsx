import { useMemo } from "react";
import { renderBarcodeToSvg } from "../lib/barcode";
import { MANUFACTURER, copyForCategory, poeticNameFor } from "../lib/labelContent";
import type { FulfilledItem, CustomerOrder } from "../lib/engine";

/** Botanical mark — placeholder line illustration. Replace with real SVG. */
function BotanicalMark() {
  return (
    <svg
      className="fs-label__botanical"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g
        fill="none"
        stroke="#8a857b"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* central stem */}
        <path d="M14 4 V24" />
        {/* upper leaves */}
        <path d="M14 9 Q9 8 7 11 Q11 12 14 11" />
        <path d="M14 9 Q19 8 21 11 Q17 12 14 11" />
        {/* mid leaves */}
        <path d="M14 14 Q8 14 6 17 Q10 18 14 16" />
        <path d="M14 14 Q20 14 22 17 Q18 18 14 16" />
        {/* small bud at top */}
        <circle cx="14" cy="4.5" r="1.2" fill="#8a857b" stroke="none" />
      </g>
    </svg>
  );
}

/** Monogram — placeholder Atelier Rusalka mark. Replace with real logo. */
function Monogram() {
  return (
    <svg
      className="fs-label__monogram"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="0.6"
        y="0.6"
        width="12.8"
        height="12.8"
        fill="none"
        stroke="#1a1a18"
        strokeWidth="0.7"
      />
      <text
        x="7"
        y="9.6"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontSize="6.4"
        fontWeight="500"
        fontStyle="italic"
        fill="#1a1a18"
      >
        ar
      </text>
    </svg>
  );
}

interface PrintSheetProps {
  order: CustomerOrder;
  items: FulfilledItem[];
  brand: string;
}

/**
 * Renders one or more 110×60mm cosmetic labels for a roll-feed printer.
 * Each label is its own page (110mm wide × 60mm tall, landscape) and
 * wraps around the bottle when applied — the 110mm dimension is the
 * circumference, 60mm is the bottle height.
 *
 * Layout philosophy: a single, continuous editorial wrap. No hard
 * divider line between "front" (personalised) and "back" (regulatory)
 * — they share the same paper. The brand wordmark and customer
 * dedication occupy the personalised half; INCI, instructions, and
 * the barcode occupy the regulatory half. Both flow as one design.
 */
export default function PrintSheet({ order, items, brand }: PrintSheetProps) {
  return (
    <div className="fs-print">
      {items.map((item) => (
        <PrintLabel
          key={item.gtin}
          order={order}
          item={item}
          brand={brand}
        />
      ))}
    </div>
  );
}

interface PrintLabelProps {
  order: CustomerOrder;
  item: FulfilledItem;
  brand: string;
}

function PrintLabel({ order, item, brand }: PrintLabelProps) {
  // SVG output rather than canvas — canvas elements rasterise at the
  // browser's print-snapshot DPI, which is unreliable across browsers.
  // bwip-js's SVG path produces crisp vector strokes that print cleanly
  // regardless of printer or browser.
  const barcodeSvg = useMemo(() => {
    if (!item.gtin) return "";
    try {
      return renderBarcodeToSvg({
        value: item.gtin,
        mode: "print",
        height: 18.28,
      });
    } catch {
      return "";
    }
  }, [item.gtin]);

  const category = (item.category || item.variant || "").trim();
  const copy = copyForCategory(category);
  const brandName = brand || "Atelier Rusalka";
  const customerName = order.shipping_name ?? "";
  const poeticName = poeticNameFor(category);
  const netContent = item.net_content ?? "";

  return (
    <article className="fs-label" aria-label={`Label for ${item.name}`}>
      {/* ─── FRONT (personalised) ─── */}
      <section className="fs-label__face fs-label__face--front">
        <div className="fs-label__brand">{brandName}</div>

        <BotanicalMark />

        {customerName && (
          <div className="fs-label__dedication">
            <span className="fs-label__dedication-eyebrow">composed for</span>
            <span className="fs-label__dedication-name">{customerName}</span>
          </div>
        )}

        <div className="fs-label__product">
          <span className="fs-label__product-poetic">{poeticName}</span>
          <span className="fs-label__product-line">
            personalised {(category || "product").toLowerCase()}
            {netContent && (
              <>
                <span className="fs-label__product-sep" aria-hidden> · </span>
                <span className="fs-label__emark" aria-hidden>e </span>
                {netContent}
              </>
            )}
          </span>
        </div>
      </section>

      {/* ─── BACK (regulatory) ─── */}
      <section className="fs-label__face fs-label__face--back">
        <p className="fs-label__inci">{item.inci || "—"}</p>

        <p className="fs-label__usage">
          <span className="fs-label__usage-fn">{copy.function}.</span>{" "}
          {copy.instruction}
        </p>

        <div className="fs-label__back-foot">
          <div className="fs-label__resp-block">
            <p className="fs-label__resp">
              <strong>{MANUFACTURER.name}</strong>
              <br />
              {MANUFACTURER.addressLine1} · {MANUFACTURER.addressLine2}
            </p>

            <div
              className="fs-label__barcode"
              dangerouslySetInnerHTML={{ __html: barcodeSvg }}
            />
          </div>
          <Monogram />
        </div>
      </section>
    </article>
  );
}
