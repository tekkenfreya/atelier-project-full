import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerOrder, QuizResult } from "../types";
import type { ResolvedExtract } from "@/features/atlas/extracts";
import { formatShortDate } from "../format";
import { supabase } from "@/lib/supabase";
import { PRODUCT_PRICES, type CartItem } from "@/types/cart";
import type { FragranceOption, ProductCategory } from "@/features/consultation/types";

interface OverviewProps {
  latestQuiz: QuizResult;
  quizCount: number;
  ordersCount: number;
  displayName?: string;
  orders: CustomerOrder[];
  extracts: ResolvedExtract[];
  onSwitchSection?: (section: "orders" | "ritual" | "extracts" | "atlas") => void;
}

const CATEGORY_BY_FIELD: Array<{
  field: "recommended_cleanser" | "recommended_serum" | "recommended_moisturizer";
  category: ProductCategory;
}> = [
  { field: "recommended_cleanser", category: "Cleanser" },
  { field: "recommended_serum", category: "Serum" },
  { field: "recommended_moisturizer", category: "Moisturizer" },
];

export default function Overview({
  latestQuiz,
  quizCount,
  ordersCount,
  displayName,
  orders,
  extracts,
  onSwitchSection,
}: OverviewProps) {
  const router = useRouter();
  const firstName = displayName?.trim().split(" ")[0] ?? "";
  const recentOrders = orders.slice(0, 5);
  const featuredExtracts = extracts.slice(0, 8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderRitual = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const recommendations = CATEGORY_BY_FIELD.map(({ field, category }) => ({
        category,
        name: latestQuiz[field],
      })).filter((r): r is { category: ProductCategory; name: string } => !!r.name);

      if (recommendations.length === 0) {
        setError("No ritual available — retake the consultation first.");
        return;
      }

      const names = recommendations.map((r) => r.name);
      const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("id, name")
        .in("name", names);
      if (prodErr) throw prodErr;

      const idByName = new Map<string, string>();
      (products ?? []).forEach((p: { id: string; name: string }) => {
        idByName.set(p.name, p.id);
      });

      const fragrance = (latestQuiz.fragrance_choice ?? "F0") as FragranceOption;
      const skinType = latestQuiz.skin_type ?? "Normal";

      const cart: CartItem[] = recommendations
        .map((r) => {
          const id = idByName.get(r.name);
          if (!id) return null;
          return {
            productId: id,
            productName: r.name,
            category: r.category,
            skinType,
            fragranceOption: fragrance,
            price: PRODUCT_PRICES[r.category],
          } satisfies CartItem;
        })
        .filter((c): c is CartItem => c !== null);

      if (cart.length === 0) {
        setError("Could not locate products. Contact support.");
        return;
      }

      sessionStorage.setItem("cartItems", JSON.stringify(cart));
      router.push("/cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build cart");
    } finally {
      setBusy(false);
    }
  }, [latestQuiz, router]);

  return (
    <article className="acc-section">
      <header className="acc-section__head">
        <span className="acc-section__eyebrow">No. 01 · Overview</span>
        <h1 className="acc-section__title">
          {firstName ? (
            <>
              Welcome back,{" "}
              <span className="acc-section__title-italic">{firstName}.</span>
            </>
          ) : (
            <>
              Your ritual,{" "}
              <span className="acc-section__title-italic">in summary.</span>
            </>
          )}
        </h1>
        <p className="acc-section__lede">
          A quiet record of your skin, the formulas composed for you, and the
          ritual you&apos;re keeping.
        </p>
      </header>

      <section className="acc-facts">
        <div className="acc-fact">
          <span className="acc-fact__k">Skin</span>
          <span className="acc-fact__v">{latestQuiz.skin_type || "—"}</span>
        </div>
        <span className="acc-facts__rule" />
        <div className="acc-fact">
          <span className="acc-fact__k">Consultations</span>
          <span className="acc-fact__v acc-fact__v--num">{quizCount}</span>
        </div>
        <span className="acc-facts__rule" />
        <div className="acc-fact">
          <span className="acc-fact__k">Orders</span>
          <span className="acc-fact__v acc-fact__v--num">{ordersCount}</span>
        </div>
        <span className="acc-facts__rule" />
        <div className="acc-fact">
          <span className="acc-fact__k">Last updated</span>
          <span className="acc-fact__v acc-fact__v--date">
            {formatShortDate(latestQuiz.created_at)}
          </span>
        </div>
      </section>

      <section className="acc-ledger">
        <h3 className="acc-ledger__h">Latest consultation</h3>
        <p className="acc-ledger__p">
          Your current ritual was composed on{" "}
          <em>{formatShortDate(latestQuiz.created_at)}</em>. If your skin has
          shifted — season, lifestyle, or simply time — retake the consultation
          and your formula will adjust on the next order.
        </p>
        <div className="acc-ledger__actions">
          <button
            type="button"
            className="acc-btn acc-btn--primary"
            onClick={handleOrderRitual}
            disabled={busy}
          >
            {busy ? "Preparing cart…" : "Order this ritual →"}
          </button>
          <button
            type="button"
            className="acc-btn"
            onClick={() => (window.location.href = "/quiz")}
          >
            Retake the consultation
          </button>
          <button
            type="button"
            className="acc-btn acc-btn--ghost"
            onClick={() => (window.location.href = "/")}
          >
            Back to the home
          </button>
        </div>
        {error && <p className="acc-ledger__error">{error}</p>}
      </section>

      {featuredExtracts.length > 0 && (
        <section className="acc-block">
          <header className="acc-block__head">
            <span className="acc-block__eyebrow">Your formula · signatures</span>
            {onSwitchSection && (
              <button
                type="button"
                className="acc-block__link"
                onClick={() => onSwitchSection("extracts")}
              >
                View all extracts →
              </button>
            )}
          </header>
          <ul className="acc-chips">
            {featuredExtracts.map((ex) => (
              <li key={ex.ingredientName} className="acc-chip">
                <span
                  className="acc-chip__dot"
                  style={{ background: ex.origin.color }}
                  aria-hidden
                />
                <span className="acc-chip__name">{ex.ingredientName}</span>
                <span className="acc-chip__country">{ex.allCountries[0]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="acc-block">
        <header className="acc-block__head">
          <span className="acc-block__eyebrow">Recent orders</span>
          {onSwitchSection && orders.length > 0 && (
            <button
              type="button"
              className="acc-block__link"
              onClick={() => onSwitchSection("orders")}
            >
              View all {orders.length} →
            </button>
          )}
        </header>
        {recentOrders.length === 0 ? (
          <p className="acc-block__empty">
            No orders yet. Your first order will appear here after checkout.
          </p>
        ) : (
          <ul className="acc-orders">
            {recentOrders.map((order) => {
              const status = order.fulfilled_at
                ? "fulfilled"
                : order.status || "pending";
              return (
                <li key={order.id} className="acc-orderline">
                  <span className="acc-orderline__date">
                    {formatShortDate(order.created_at)}
                  </span>
                  <span className="acc-orderline__items">
                    {order.items?.length ?? 0} × bottle
                  </span>
                  <span className="acc-orderline__plan">
                    {order.subscription_plan ?? "one-time"}
                  </span>
                  <span className={`acc-orderline__status is-${status}`}>
                    <span className="acc-orderline__dot" />
                    {status}
                  </span>
                  <span className="acc-orderline__total">
                    {order.total != null ? `€${order.total}` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="acc-footnote">
        Your file is up to date.
        <span className="acc-footnote__em"> — Atelier Rusalka</span>
      </footer>
    </article>
  );
}
