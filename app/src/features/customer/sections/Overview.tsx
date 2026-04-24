import type { CustomerOrder, QuizResult } from "../types";
import type { ResolvedExtract } from "@/features/atlas/extracts";
import { formatShortDate } from "../format";

interface OverviewProps {
  latestQuiz: QuizResult;
  quizCount: number;
  ordersCount: number;
  displayName?: string;
  orders: CustomerOrder[];
  extracts: ResolvedExtract[];
  onSwitchSection?: (section: "orders" | "ritual" | "extracts" | "atlas") => void;
}

export default function Overview({
  latestQuiz,
  quizCount,
  ordersCount,
  displayName,
  orders,
  extracts,
  onSwitchSection,
}: OverviewProps) {
  const firstName = displayName?.trim().split(" ")[0] ?? "";
  const recentOrders = orders.slice(0, 5);
  const featuredExtracts = extracts.slice(0, 8);

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
