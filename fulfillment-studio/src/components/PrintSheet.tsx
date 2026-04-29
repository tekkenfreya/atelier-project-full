import { useEffect, useRef } from "react";
import { renderBarcodeToCanvas } from "../lib/barcode";
import { MANUFACTURER, copyForCategory } from "../lib/labelContent";
import type { FulfilledItem, CustomerOrder } from "../lib/engine";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      // ~80% GS1 target — fits the back half of the wrap while staying
      // inside the GS1 minimum X-dimension for retail scanning.
      renderBarcodeToCanvas(canvasRef.current, {
        value: item.gtin,
        mode: "print",
        height: 18.28,
      });
    } catch {
      /* silent */
    }
  }, [item.gtin]);

  const category = (item.category || item.variant || "").trim();
  const copy = copyForCategory(category);
  const brandName = brand || "Atelier Rusalka";
  const customerName = order.shipping_name ?? "";
  const productLine = `personalised ${(category || "product").toLowerCase()}`;
  const netContent = item.net_content ?? "";

  return (
    <article className="fs-label" aria-label={`Label for ${item.name}`}>
      {/* ─── FRONT (personalised) ─── */}
      <section className="fs-label__face fs-label__face--front">
        <div className="fs-label__brand">{brandName}</div>

        {customerName && (
          <div className="fs-label__dedication">
            <span className="fs-label__dedication-eyebrow">composed for</span>
            <span className="fs-label__dedication-name">{customerName}</span>
          </div>
        )}

        <div className="fs-label__product">
          <span className="fs-label__product-line">{productLine}</span>
          {netContent && (
            <span className="fs-label__product-volume">
              <span className="fs-label__emark" aria-hidden>e</span>
              {netContent}
            </span>
          )}
        </div>
      </section>

      {/* ─── BACK (regulatory) ─── */}
      <section className="fs-label__face fs-label__face--back">
        <p className="fs-label__inci">{item.inci || "—"}</p>

        <p className="fs-label__usage">
          <span className="fs-label__usage-fn">{copy.function}.</span>{" "}
          {copy.instruction}
        </p>

        <p className="fs-label__resp">
          <strong>{MANUFACTURER.name}</strong>
          <br />
          {MANUFACTURER.addressLine1} · {MANUFACTURER.addressLine2}
        </p>

        <div className="fs-label__barcode">
          <canvas ref={canvasRef} />
        </div>
      </section>
    </article>
  );
}
