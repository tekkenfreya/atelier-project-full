import { useEffect, useRef } from "react";
import { renderBarcodeToCanvas } from "../lib/barcode";
import type { FulfilledItem, OrderItem } from "../lib/engine";

interface ProductCardProps {
  index: number;
  sourceItem: OrderItem;
  assigned: FulfilledItem | null;
  isFulfilling: boolean;
  revealDelayMs?: number;
}

export default function ProductCard({
  index,
  sourceItem,
  assigned,
  isFulfilling,
  revealDelayMs = 0,
}: ProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !assigned?.gtin) return;
    try {
      renderBarcodeToCanvas(canvasRef.current, {
        value: assigned.gtin,
        scale: 3,
        height: 18,
      });
    } catch {
      /* silent */
    }
  }, [assigned?.gtin]);

  const category = sourceItem.category ?? "";
  const productName = sourceItem.productName ?? "—";
  const state: "empty" | "reserving" | "assigned" = isFulfilling
    ? "reserving"
    : assigned
      ? "assigned"
      : "empty";

  return (
    <article
      className={`fs-card fs-card--${state}`}
      style={{ ["--reveal-delay" as string]: `${revealDelayMs}ms` }}
      aria-label={`Card ${index + 1}: ${category}`}
    >
      <header className="fs-card__head">
        <span className="fs-card__index">0{index + 1}</span>
        <span className="fs-card__category">{category || "ITEM"}</span>
      </header>

      <div className="fs-card__body">
        <span className="fs-card__eyebrow">PRODUCT</span>
        <h3 className="fs-card__name">{productName}</h3>
        {sourceItem.skinType && (
          <span className="fs-card__meta">
            {sourceItem.skinType}
            {sourceItem.fragranceOption ? ` · ${sourceItem.fragranceOption}` : ""}
          </span>
        )}
      </div>

      <div className="fs-card__divider" />

      <div className="fs-card__barcode">
        {state === "assigned" && assigned ? (
          <>
            <canvas ref={canvasRef} className="fs-card__canvas" />
            <span className="fs-card__gtin">{assigned.gtin}</span>
          </>
        ) : state === "reserving" ? (
          <div className="fs-card__placeholder">
            <span className="fs-card__placeholder-text">reserving</span>
            <span className="fs-card__placeholder-sub">pulling from pool…</span>
          </div>
        ) : (
          <div className="fs-card__placeholder">
            <span className="fs-card__placeholder-text">awaiting GTIN</span>
            <span className="fs-card__placeholder-sub">fulfill to assign</span>
          </div>
        )}
      </div>
    </article>
  );
}
