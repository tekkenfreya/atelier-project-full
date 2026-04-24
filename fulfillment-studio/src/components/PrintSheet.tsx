import { useEffect, useRef } from "react";
import { renderBarcodeToCanvas } from "../lib/barcode";
import type { FulfilledItem } from "../lib/engine";
import type { CustomerOrder } from "../lib/engine";

interface PrintSheetProps {
  order: CustomerOrder;
  items: FulfilledItem[];
  brand: string;
}

export default function PrintSheet({ order, items, brand }: PrintSheetProps) {
  return (
    <div className="fs-print">
      {items.map((item) => (
        <PrintLabel key={item.gtin} order={order} item={item} brand={brand} />
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
      renderBarcodeToCanvas(canvasRef.current, {
        value: item.gtin,
        scale: 3,
        height: 22,
      });
    } catch {
      /* silent */
    }
  }, [item.gtin]);

  const category = item.category || item.variant || "";
  const netContent = item.net_content ?? "";
  const shippingCountry = order.shipping_country ?? "Bulgaria";
  const batch = (order.id ?? "").slice(0, 8).toUpperCase();
  const year = new Date(order.created_at).getFullYear();

  return (
    <article className="fs-label">
      <header className="fs-label__head">
        <span className="fs-label__brand">{brand.toUpperCase()}</span>
        <span className="fs-label__category">{category.toUpperCase()}</span>
      </header>

      <div className="fs-label__body">
        <h3 className="fs-label__name">
          {item.name}
          {netContent && <span className="fs-label__net"> · {netContent}</span>}
        </h3>
        {order.shipping_name && (
          <p className="fs-label__customer">for {order.shipping_name}</p>
        )}

        {item.inci && (
          <section className="fs-label__inci">
            <span className="fs-label__inci-h">INGREDIENTS</span>
            <p className="fs-label__inci-body">{item.inci}</p>
          </section>
        )}

        <footer className="fs-label__foot">
          <div className="fs-label__eu">
            <span>Made in {shippingCountry}</span>
            <span>BATCH {batch}</span>
            <span>BB {year + 2}-{String(new Date(order.created_at).getMonth() + 1).padStart(2, "0")}</span>
          </div>
          <div className="fs-label__barcode">
            <canvas ref={canvasRef} />
          </div>
        </footer>
      </div>
    </article>
  );
}
