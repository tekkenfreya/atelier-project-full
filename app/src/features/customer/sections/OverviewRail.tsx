import type { QuizResult, CustomerOrder } from "../types";
import { formatShortDate } from "../format";

interface OverviewRailProps {
  latestQuiz: QuizResult;
  orders: CustomerOrder[];
}

type Hue = "sage" | "rose" | "amber";

const TRIO: Array<{
  num: string;
  category: string;
  field: "recommended_cleanser" | "recommended_serum" | "recommended_moisturizer";
  hue: Hue;
}> = [
  { num: "01", category: "Cleanser", field: "recommended_cleanser", hue: "sage" },
  { num: "02", category: "Serum", field: "recommended_serum", hue: "rose" },
  { num: "03", category: "Moisturiser", field: "recommended_moisturizer", hue: "amber" },
];

export default function OverviewRail({ latestQuiz, orders }: OverviewRailProps) {
  const mostRecentOrder = orders.length > 0 ? orders[0] : null;
  const nextShipment = mostRecentOrder?.next_shipment_at
    ? new Date(mostRecentOrder.next_shipment_at)
    : null;
  const isSubscribed =
    mostRecentOrder?.subscription_plan &&
    mostRecentOrder.subscription_plan !== "one-time";

  return (
    <aside className="acc-rail">
      <section className="acc-rail__block">
        <span className="acc-rail__eyebrow">Your current ritual</span>
        <div className="acc-rail__trio">
          {TRIO.map((t) => {
            const product = latestQuiz[t.field];
            return (
              <article
                key={t.num}
                className={`acc-rail__bottle acc-rail__bottle--${t.hue}`}
              >
                <span className="acc-rail__bottle-num">{t.num}</span>
                <div className="acc-rail__bottle-vessel" aria-hidden>
                  <span className="acc-rail__bottle-cap" />
                  <span className="acc-rail__bottle-glass">
                    {product ?? "—"}
                  </span>
                </div>
                <span className="acc-rail__bottle-cat">{t.category}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="acc-rail__block">
        <span className="acc-rail__eyebrow">Next shipment</span>
        {isSubscribed && nextShipment ? (
          <div className="acc-rail__shipment">
            <span className="acc-rail__shipment-date">
              {nextShipment.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="acc-rail__shipment-plan">
              {mostRecentOrder?.subscription_plan}
            </span>
          </div>
        ) : (
          <div className="acc-rail__shipment">
            <span className="acc-rail__shipment-date acc-rail__shipment-date--quiet">
              Not subscribed
            </span>
            <a href="/cart" className="acc-rail__shipment-link">
              Build a subscription →
            </a>
          </div>
        )}
      </section>

      {mostRecentOrder && (
        <section className="acc-rail__block">
          <span className="acc-rail__eyebrow">Last order</span>
          <div className="acc-rail__order">
            <span className="acc-rail__order-date">
              {formatShortDate(mostRecentOrder.created_at)}
            </span>
            <span className="acc-rail__order-total">
              {mostRecentOrder.total != null
                ? `€${mostRecentOrder.total}`
                : "—"}
            </span>
          </div>
        </section>
      )}

      <section className="acc-rail__block acc-rail__letter">
        <span className="acc-rail__eyebrow">A letter · season</span>
        <p className="acc-rail__letter-body">
          Skin is seasonal. If the air has shifted, your formula can too — the
          consultation is always open, and your ritual re-composes on the next
          order.
        </p>
      </section>
    </aside>
  );
}
