"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";
import { isAdmin } from "@/features/admin/guards";
import type { CustomerOrder } from "@/features/customer/types";
import OrderRow from "@/features/fulfillment/orders/OrderRow";
import "@/features/fulfillment/orders/admin-orders.css";

type Tab = "pending" | "fulfilled";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");

  useEffect(() => {
    let cancelled = false;
    async function gate() {
      const currentUser = await getUser();
      if (cancelled) return;
      if (!currentUser) {
        router.replace("/account?redirect=/admin/orders");
        return;
      }
      const admin = await isAdmin(currentUser.id);
      if (cancelled) return;
      if (!admin) {
        router.replace("/account");
        return;
      }
      setUser(currentUser);
      setChecking(false);
    }
    gate();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("customer_orders")
      .select(
        "id, user_id, items, subscription_plan, total, status, shipping_name, shipping_email, shipping_address, shipping_city, shipping_country, shipping_postal_code, printed_at, fulfilled_at, next_shipment_at, created_at"
      )
      .order("created_at", { ascending: false });
    if (data) setOrders(data as CustomerOrder[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const visibleOrders = orders.filter((o) =>
    tab === "pending" ? !o.fulfilled_at : !!o.fulfilled_at
  );

  const handleUpdate = (updated: CustomerOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  if (checking) {
    return (
      <div className="admin-orders-shell">
        <p className="admin-orders-loading">Checking access…</p>
      </div>
    );
  }

  const pendingCount = orders.filter((o) => !o.fulfilled_at).length;
  const fulfilledCount = orders.length - pendingCount;

  return (
    <div className="admin-orders-shell">
      <header className="admin-orders-header">
        <h1 className="admin-orders-title">Order Dashboard</h1>
        <nav className="admin-orders-tabs" aria-label="Order view">
          <button
            type="button"
            className={`admin-orders-tab ${tab === "pending" ? "is-active" : ""}`}
            onClick={() => setTab("pending")}
          >
            Pending <span className="admin-orders-tab-count">{pendingCount}</span>
          </button>
          <button
            type="button"
            className={`admin-orders-tab ${tab === "fulfilled" ? "is-active" : ""}`}
            onClick={() => setTab("fulfilled")}
          >
            Fulfilled <span className="admin-orders-tab-count">{fulfilledCount}</span>
          </button>
        </nav>
      </header>

      {loading ? (
        <p className="admin-orders-loading">Loading orders…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="admin-orders-empty">
          {tab === "pending" ? "No pending orders." : "No fulfilled orders yet."}
        </p>
      ) : (
        <ul className="admin-orders-list">
          {visibleOrders.map((order) => (
            <OrderRow key={order.id} order={order} onUpdate={handleUpdate} />
          ))}
        </ul>
      )}
    </div>
  );
}
