import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import {
  fulfillOrder,
  isAdmin,
  listIssuers,
  listOrderGtins,
  listOrders,
  markOrderPrinted,
  type CustomerOrder,
  type FulfilledItem,
  type Issuer,
} from "./lib/engine";
import LoginForm from "./components/LoginForm";
import PrintSheet from "./components/PrintSheet";
import ProductCard from "./components/ProductCard";

type GateState = "loading" | "signin" | "not-admin" | "no-issuer" | "ready";
type TabState = "pending" | "fulfilled" | "all";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gate, setGate] = useState<GateState>("loading");
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, FulfilledItem[]>>({});
  const [tab, setTab] = useState<TabState>("pending");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [fulfillingOrderId, setFulfillingOrderId] = useState<string | null>(null);

  // --- Auth session ---
  useEffect(() => {
    let cancelled = false;

    async function gateFor(currentUser: User | null) {
      if (!currentUser) {
        if (!cancelled) {
          setUser(null);
          setGate("signin");
        }
        return;
      }
      if (!cancelled) setUser(currentUser);
      const admin = await isAdmin(currentUser.id);
      if (cancelled) return;
      if (!admin) {
        setGate("not-admin");
        return;
      }
      const issuers = await listIssuers();
      if (cancelled) return;
      if (issuers.length === 0) {
        setGate("no-issuer");
        return;
      }
      setIssuer(issuers[0]);
      setGate("ready");
    }

    supabase.auth.getSession().then(({ data }) => {
      gateFor(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      gateFor(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const list = await listOrders();
      setOrders(list);

      const mapping: Record<string, FulfilledItem[]> = {};
      await Promise.all(
        list.map(async (o) => {
          const items = await listOrderGtins(o.id);
          if (items.length > 0) mapping[o.id] = items;
        }),
      );
      setAssignments(mapping);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load orders");
    }
  }, []);

  useEffect(() => {
    if (gate !== "ready") return;
    loadAll();
  }, [gate, loadAll]);

  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) ?? null,
    [orders, selectedId],
  );
  const selectedItems = selected ? assignments[selected.id] ?? [] : [];

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (tab === "pending") list = list.filter((o) => !o.fulfilled_at);
    else if (tab === "fulfilled") list = list.filter((o) => !!o.fulfilled_at);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.shipping_name?.toLowerCase().includes(q) ||
          o.shipping_email?.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [orders, tab, search]);

  const pendingCount = orders.filter((o) => !o.fulfilled_at).length;
  const fulfilledCount = orders.length - pendingCount;

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    setAssignments({});
    setSelectedId(null);
    setGate("signin");
  }, []);

  const handleFulfill = useCallback(async () => {
    if (!selected || !issuer) return;
    setBusy(true);
    setError(null);
    setFulfillingOrderId(selected.id);
    try {
      const items = await fulfillOrder(selected.id, issuer.id);
      // tiny artificial delay so the reserve→reveal animation can breathe
      await new Promise((r) => setTimeout(r, 420));
      setAssignments((prev) => ({ ...prev, [selected.id]: items }));
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "fulfill failed");
    } finally {
      setBusy(false);
      setFulfillingOrderId(null);
    }
  }, [selected, issuer, loadAll]);

  const handlePrint = useCallback(async () => {
    if (!selected) return;
    await markOrderPrinted(selected.id);
    window.print();
    await loadAll();
  }, [selected, loadAll]);

  // --- Render gates ---
  if (gate === "loading") {
    return (
      <div className="fs-app">
        <div className="fs-boot">
          <span className="fs-boot-dot" />
          loading studio
        </div>
      </div>
    );
  }

  if (gate === "signin") {
    return (
      <div className="fs-app">
        <LoginForm onAuthenticated={() => setGate("loading")} />
      </div>
    );
  }

  if (gate === "not-admin") {
    return (
      <div className="fs-app">
        <div className="fs-auth">
          <div className="fs-auth-card">
            <div className="fs-auth-heading">
              <span className="fs-auth-eyebrow">ACCESS DENIED</span>
              <h1 className="fs-auth-title">Admin role required</h1>
              <p className="fs-auth-desc">
                Your account is authenticated but not marked as admin. Ask an admin
                to grant you the role in <span className="fs-mono">user_roles</span>.
              </p>
            </div>
            <button type="button" className="fs-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gate === "no-issuer") {
    return (
      <div className="fs-app">
        <div className="fs-auth">
          <div className="fs-auth-card">
            <div className="fs-auth-heading">
              <span className="fs-auth-eyebrow">CONFIG MISSING</span>
              <h1 className="fs-auth-title">No GTIN issuer configured</h1>
              <p className="fs-auth-desc">
                Open Barcode Studio first and configure your company prefix. This tool
                reserves GTINs from that issuer's pool to fulfill orders.
              </p>
            </div>
            <button type="button" className="fs-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFulfillingSelected = fulfillingOrderId === selected?.id;

  return (
    <div className="fs-app">
      <header className="fs-topbar">
        <div className="fs-brand">
          <span className="fs-brand-dot" />
          <span>Fulfillment Studio</span>
        </div>
        <div className="fs-meta">
          <div className="fs-meta-item">
            <span className="fs-meta-key">issuer</span>
            <span className="fs-meta-val">{issuer?.brand}</span>
          </div>
          <div className="fs-meta-item">
            <span className="fs-meta-key">prefix</span>
            <span className="fs-meta-val">{issuer?.company_prefix}</span>
          </div>
          <div className="fs-meta-item">
            <span className="fs-meta-key">pending</span>
            <span className="fs-meta-val fs-meta-val--accent">{pendingCount}</span>
          </div>
          <div className="fs-meta-item">
            <span className="fs-meta-key">{user?.email?.split("@")[0]}</span>
          </div>
          <button type="button" className="fs-meta-btn" onClick={handleSignOut}>
            sign out
          </button>
        </div>
      </header>

      <main className="fs-main">
        <section className="fs-orders">
          <div className="fs-orders-head">
            <div className="fs-tabs" role="tablist">
              {(
                [
                  ["pending", pendingCount],
                  ["fulfilled", fulfilledCount],
                  ["all", orders.length],
                ] as const
              ).map(([t, count]) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  className={`fs-tab ${tab === t ? "is-active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                  <span className="fs-tab-count">{count}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search"
              className="fs-search"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="fs-orders-empty">
              <span className="fs-orders-empty-label">
                {tab === "pending" ? "queue is empty" : "nothing here"}
              </span>
              <span className="fs-orders-empty-hint">
                {tab === "pending"
                  ? "All orders fulfilled. Quiet day at the bench."
                  : `No ${tab} orders match.`}
              </span>
            </div>
          ) : (
            <ul className="fs-orders-list">
              {filteredOrders.map((o) => {
                const assigned = assignments[o.id] ?? [];
                const status = o.fulfilled_at
                  ? "fulfilled"
                  : assigned.length > 0
                    ? "reserved"
                    : "pending";
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      className={`fs-order fs-order--${status} ${o.id === selectedId ? "is-selected" : ""}`}
                      onClick={() => setSelectedId(o.id)}
                    >
                      <span className="fs-order-rail" aria-hidden />
                      <span className="fs-order-body">
                        <span className="fs-order-name">
                          {o.shipping_name ?? "(unnamed)"}
                        </span>
                        <span className="fs-order-meta">
                          <span>{o.items.length} × bottle</span>
                          <span className="fs-order-sep">·</span>
                          <span>{o.subscription_plan ?? "one-time"}</span>
                          <span className="fs-order-sep">·</span>
                          <span className="fs-mono">
                            {new Date(o.created_at).toISOString().slice(5, 10)}
                          </span>
                        </span>
                      </span>
                      <span className={`fs-order-status fs-order-status--${status}`}>
                        <span className="fs-order-status-dot" />
                        {status}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="fs-stage">
          {!selected ? (
            <div className="fs-stage-idle">
              <span className="fs-stage-idle-eyebrow">FULFILLMENT · STUDIO</span>
              <h2 className="fs-stage-idle-title">Select an order to begin the ritual</h2>
              <p className="fs-stage-idle-desc">
                Each order is a ritual of three: cleanser, serum, moisturizer. Fulfilling
                reserves three GTINs from your pool atomically and composes the label for
                each bottle — name, net content, INCI pulled from the customer's quiz.
              </p>
              <div className="fs-stage-idle-stat">
                <span className="fs-stage-idle-stat-k">pending</span>
                <span className="fs-stage-idle-stat-v">{pendingCount}</span>
                <span className="fs-stage-idle-stat-sep">/</span>
                <span className="fs-stage-idle-stat-v">{orders.length}</span>
                <span className="fs-stage-idle-stat-k">total today</span>
              </div>
            </div>
          ) : (
            <div className="fs-stage-body">
              <header className="fs-stage-head">
                <div>
                  <span className="fs-stage-head-eyebrow">ORDER · {selected.id.slice(0, 6).toUpperCase()}</span>
                  <h2 className="fs-stage-head-name">
                    {selected.shipping_name ?? "unnamed customer"}
                  </h2>
                  <p className="fs-stage-head-sub">
                    {selected.shipping_email ?? "—"}
                    <span className="fs-stage-head-sep">·</span>
                    {selected.subscription_plan ?? "one-time"}
                    <span className="fs-stage-head-sep">·</span>
                    <span className="fs-mono">
                      {new Date(selected.created_at).toISOString().slice(0, 10)}
                    </span>
                    {selected.total != null && (
                      <>
                        <span className="fs-stage-head-sep">·</span>
                        <span className="fs-mono">€{selected.total}</span>
                      </>
                    )}
                  </p>
                </div>
                <div
                  className={`fs-stage-badge fs-stage-badge--${
                    selected.fulfilled_at
                      ? "fulfilled"
                      : selectedItems.length > 0
                        ? "reserved"
                        : "pending"
                  }`}
                >
                  <span className="fs-stage-badge-dot" />
                  {selected.fulfilled_at
                    ? "ready to ship"
                    : selectedItems.length > 0
                      ? "GTINs reserved"
                      : "awaiting fulfillment"}
                </div>
              </header>

              <div
                className={`fs-triptych ${isFulfillingSelected ? "is-fulfilling" : ""} ${
                  selectedItems.length > 0 ? "is-composed" : ""
                }`}
              >
                <span className="fs-triptych-corner fs-triptych-corner--tl" aria-hidden />
                <span className="fs-triptych-corner fs-triptych-corner--tr" aria-hidden />
                <span className="fs-triptych-corner fs-triptych-corner--bl" aria-hidden />
                <span className="fs-triptych-corner fs-triptych-corner--br" aria-hidden />

                <div className="fs-triptych-grid">
                  {selected.items.map((item, idx) => {
                    const assigned = selectedItems.find(
                      (a) => a.item_ref === `item_${idx}`,
                    );
                    return (
                      <ProductCard
                        key={idx}
                        index={idx}
                        sourceItem={item}
                        assigned={assigned ?? null}
                        isFulfilling={isFulfillingSelected}
                        revealDelayMs={idx * 120}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="fs-stage-strip">
                <div className="fs-strip-kv">
                  <span className="fs-strip-k">SHIPPING</span>
                  <span className="fs-strip-v">
                    {[
                      selected.shipping_address,
                      selected.shipping_city,
                      selected.shipping_postal_code,
                      selected.shipping_country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="fs-strip-divider" />
                <div className="fs-strip-kv">
                  <span className="fs-strip-k">RESERVED</span>
                  <span className="fs-strip-v fs-mono">
                    {selectedItems.length
                      ? `${selectedItems.length} / ${selected.items.length}`
                      : `0 / ${selected.items.length}`}
                  </span>
                </div>
                <div className="fs-strip-divider" />
                <div className="fs-strip-kv">
                  <span className="fs-strip-k">FULFILLED</span>
                  <span className="fs-strip-v fs-mono">
                    {selected.fulfilled_at
                      ? new Date(selected.fulfilled_at).toISOString().slice(0, 10)
                      : "—"}
                  </span>
                </div>
                <div className="fs-strip-divider" />
                <div className="fs-strip-kv">
                  <span className="fs-strip-k">PRINTED</span>
                  <span className="fs-strip-v fs-mono">
                    {selected.printed_at
                      ? new Date(selected.printed_at).toISOString().slice(0, 10)
                      : "—"}
                  </span>
                </div>
              </div>

              {error && <p className="fs-helper is-err">{error}</p>}

              <div className="fs-stage-action">
                {selectedItems.length === 0 ? (
                  <button
                    type="button"
                    className="fs-btn fs-btn--primary fs-btn--hero"
                    onClick={handleFulfill}
                    disabled={busy}
                  >
                    <span className="fs-btn-primary-label">
                      {busy ? "reserving…" : `Fulfill · reserve ${selected.items.length} GTIN${selected.items.length === 1 ? "" : "s"}`}
                    </span>
                    <span className="fs-btn-primary-sub">
                      {busy
                        ? "pulling from pool, composing records"
                        : "atomic · irreversible · from issuer pool"}
                    </span>
                  </button>
                ) : (
                  <div className="fs-action-row">
                    <button
                      type="button"
                      className="fs-btn fs-btn--primary fs-btn--hero"
                      onClick={handlePrint}
                      disabled={busy}
                    >
                      <span className="fs-btn-primary-label">
                        Print {selectedItems.length} label{selectedItems.length === 1 ? "" : "s"}
                      </span>
                      <span className="fs-btn-primary-sub">
                        opens browser print dialog with composed labels
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {selected && selectedItems.length > 0 && (
        <div className="fs-print-only" aria-hidden="true">
          <PrintSheet
            order={selected}
            items={selectedItems}
            brand={issuer?.brand ?? ""}
          />
        </div>
      )}
    </div>
  );
}
