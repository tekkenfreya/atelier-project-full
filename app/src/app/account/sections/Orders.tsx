import type { CustomerOrder } from "../lib/types";
import { formatShortDate, PLAN_LABELS } from "../lib/format";

interface OrdersProps {
  orders: CustomerOrder[];
}

export default function Orders({ orders }: OrdersProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Orders</h1>
        <p className="account-section__subtitle">Your order history.</p>
      </header>
      {orders.length === 0 ? (
        <p className="account-empty-inline">No orders yet.</p>
      ) : (
        <table className="account-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Items</th>
              <th>Plan</th>
              <th>Status</th>
              <th className="account-table__right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{formatShortDate(o.created_at)}</td>
                <td>{o.items.map((i) => i.productName).join(", ")}</td>
                <td>{PLAN_LABELS[o.subscription_plan] ?? o.subscription_plan}</td>
                <td>
                  <span className="account-status">{o.status}</span>
                </td>
                <td className="account-table__right">€{o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
