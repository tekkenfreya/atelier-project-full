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
 * Renders one or more 110×60mm cosmetic labels, each on its own print page.
 * Layout per label: 2-column landscape — front (personalised) on the left
 * side, back (regulatory) on the right.
 *
 *  ┌────────── FRONT (55mm) ──────────┬────────── BACK (55mm) ──────────┐
 *  │ Logo / wordmark                  │ Ingredients (INCI)              │
 *  │ Category                         │ Category + Instruction          │
 *  │ For [customer]                   │ Responsible person + address    │
 *  │ Net content                      │ Barcode (EAN-13)                │
 *  └──────────────────────────────────┴─────────────────────────────────┘
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
      // ~80% GS1 target (X = 0.264mm, height = 18.28mm) — fits the back
      // panel of a 110×60mm label while staying inside the GS1 minimum.
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
  const categoryDisplay = category.toUpperCase() || "PRODUCT";
  const copy = copyForCategory(category);
  const netContent = item.net_content ?? "";
  const customerName = order.shipping_name ?? "";

  return (
    <article className="fs-label" aria-label={`Label for ${item.name}`}>
      {/* ─────────── FRONT (left half, personalised) ─────────── */}
      <section className="fs-label__face fs-label__face--front">
        <header className="fs-label__brand">
          <span className="fs-label__brand-mark">{brand || "ATELIER RUSALKA"}</span>
          <span className="fs-label__brand-eyebrow">atelier · made</span>
        </header>

        <span className="fs-label__category">{categoryDisplay}</span>

        {customerName && (
          <p className="fs-label__customer">
            <span className="fs-label__customer-eyebrow">composed for</span>
            <span className="fs-label__customer-name">{customerName}</span>
          </p>
        )}

        <span className="fs-label__volume">
          <span className="fs-label__volume-emark" aria-hidden>e</span>
          <span className="fs-label__volume-value">{netContent || "—"}</span>
        </span>
      </section>

      {/* ─────────── BACK (right half, regulatory) ─────────── */}
      <section className="fs-label__face fs-label__face--back">
        <div className="fs-label__inci">
          <span className="fs-label__h">Ingredients</span>
          <p className="fs-label__inci-body">{item.inci || "—"}</p>
        </div>

        <div className="fs-label__usage">
          <span className="fs-label__h">{copy.function}</span>
          <p className="fs-label__usage-body">{copy.instruction}</p>
        </div>

        <div className="fs-label__resp">
          <span className="fs-label__h">Responsible person</span>
          <p className="fs-label__resp-body">
            {MANUFACTURER.name}
            <br />
            {MANUFACTURER.addressLine1}
            <br />
            {MANUFACTURER.addressLine2}
          </p>
        </div>

        <div className="fs-label__barcode">
          <canvas ref={canvasRef} />
        </div>
      </section>
    </article>
  );
}
