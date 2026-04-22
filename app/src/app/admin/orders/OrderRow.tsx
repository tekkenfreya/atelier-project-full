"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CustomerOrder } from "@/app/account/lib/types";
import PrintSheet from "./PrintSheet";

interface OrderRowProps {
  order: CustomerOrder;
  onUpdate: (order: CustomerOrder) => void;
}

const BI_MONTHLY_MS = 1000 * 60 * 60 * 24 * 61; // ~2 months

function formatShortDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function describeOrder(order: CustomerOrder): string {
  if (order.subscription_plan === "one-time") {
    return `Single order ${formatShortDate(order.created_at)}`;
  }
  const plan = order.subscription_plan.replace("-", " ");
  const nextDate = order.next_shipment_at
    ? formatShortDate(order.next_shipment_at)
    : formatShortDate(
        new Date(new Date(order.created_at).getTime() + BI_MONTHLY_MS).toISOString()
      );
  return `Subscription ${plan} next date: ${nextDate}`;
}

export default function OrderRow({ order, onUpdate }: OrderRowProps) {
  const [printing, setPrinting] = useState(false);
  const [fulfilling, setFulfilling] = useState(false);

  const productSummary = order.items
    .map((i) => `${i.category} ${i.productName.replace(/^[A-Z]+/, "")}`.trim())
    .join(" - ");

  const handlePrint = async () => {
    setPrinting(true);
    const prev = order;
    const nowIso = new Date().toISOString();
    onUpdate({ ...order, printed_at: nowIso });

    requestAnimationFrame(() => {
      window.print();
      setPrinting(false);
    });

    const { error } = await supabase
      .from("customer_orders")
      .update({ printed_at: nowIso })
      .eq("id", order.id);
    if (error) {
      onUpdate(prev);
      console.error("Print update failed:", error.message);
    }
  };

  const handleFulfill = async () => {
    if (fulfilling) return;
    setFulfilling(true);
    const prev = order;
    const nowIso = new Date().toISOString();

    let nextShipment: string | null = order.next_shipment_at ?? null;
    if (order.subscription_plan !== "one-time" && !nextShipment) {
      nextShipment = new Date(Date.now() + BI_MONTHLY_MS).toISOString();
    }

    const optimistic: CustomerOrder = {
      ...order,
      fulfilled_at: nowIso,
      next_shipment_at: nextShipment,
    };
    onUpdate(optimistic);

    const { error } = await supabase
      .from("customer_orders")
      .update({
        fulfilled_at: nowIso,
        next_shipment_at: nextShipment,
        status: "fulfilled",
      })
      .eq("id", order.id);

    if (error) {
      onUpdate(prev);
      console.error("Fulfill update failed:", error.message);
    }
    setFulfilling(false);
  };

  const handleUnfulfill = async () => {
    if (!confirm("Mark this order as NOT fulfilled?")) return;
    const prev = order;
    onUpdate({ ...order, fulfilled_at: null });
    const { error } = await supabase
      .from("customer_orders")
      .update({ fulfilled_at: null, status: "pending" })
      .eq("id", order.id);
    if (error) {
      onUpdate(prev);
      console.error("Unfulfill failed:", error.message);
    }
  };

  return (
    <li className={`admin-orders-row ${order.fulfilled_at ? "is-fulfilled" : ""}`}>
      <div className="admin-orders-row-main">
        <div className="admin-orders-row-primary">
          <span className="admin-orders-row-name">
            {order.shipping_name || "Unknown"}
          </span>
          <span className="admin-orders-row-sep">·</span>
          <span className="admin-orders-row-items">{productSummary}</span>
        </div>
        <div className="admin-orders-row-secondary">{describeOrder(order)}</div>
      </div>
      <div className="admin-orders-row-actions">
        {!order.fulfilled_at ? (
          <>
            <button
              type="button"
              className="admin-orders-btn"
              onClick={handlePrint}
              disabled={printing}
            >
              {printing ? "Printing…" : order.printed_at ? "Reprint" : "Print"}
            </button>
            <button
              type="button"
              className="admin-orders-btn admin-orders-btn--primary"
              onClick={handleFulfill}
              disabled={fulfilling}
            >
              {fulfilling ? "…" : "Fulfill"}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="admin-orders-btn admin-orders-btn--ghost"
            onClick={handleUnfulfill}
          >
            Unfulfill
          </button>
        )}
      </div>
      <PrintSheet order={order} />
    </li>
  );
}
