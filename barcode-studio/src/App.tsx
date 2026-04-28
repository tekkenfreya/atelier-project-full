import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Scene from "./three/Scene";
import Onboarding from "./components/Onboarding";
import LoginForm from "./components/LoginForm";
import { supabase } from "./lib/supabase";
import { getSpec, lookupPrefixCountry } from "./lib/gtin";
import { createBarcodeCanvas, renderBarcodeToSvg } from "./lib/barcode";
import {
  composeProductRecord,
  getPoolStats,
  isAdmin,
  listIssuers,
  listProductRecords,
  replenishPool,
  reserveGtinForOrder,
  resetIssuer,
  voidGtin,
  type Issuer,
  type PoolEntry,
  type PoolStats,
  type ProductRecord,
} from "./lib/engine";

type GateState = "loading" | "signin" | "not-admin" | "ready";

type PoolRow = PoolEntry & { record: ProductRecord | null };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gate, setGate] = useState<GateState>("loading");
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [pool, setPool] = useState<PoolRow[]>([]);
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [selectedGtin, setSelectedGtin] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PoolEntry["status"] | "all">("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Issue test GTIN form
  const [testName, setTestName] = useState("");
  const [testVariant, setTestVariant] = useState("");

  const printImgRef = useRef<HTMLImageElement>(null);

  // --- Auth session ---
  useEffect(() => {
    let cancelled = false;

    async function runGate(currentUser: User | null) {
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
      setGate("ready");
    }

    supabase.auth.getSession().then(({ data }) => {
      runGate(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      runGate(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // --- Issuer + pool hydration ---
  const refresh = useCallback(async () => {
    try {
      const issuers = await listIssuers();
      const first = issuers[0] ?? null;
      setIssuer(first);
      if (first) {
        const [rows, s] = await Promise.all([
          listProductRecords(first.id),
          getPoolStats(first.id),
        ]);
        setPool(rows);
        setStats(s);
      } else {
        setPool([]);
        setStats(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "failed to load data";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    if (gate !== "ready") return;
    refresh();
  }, [gate, refresh]);

  // Auto-select most recent non-available entry
  useEffect(() => {
    if (!selectedGtin && pool.length > 0) {
      const interesting = pool.find((p) => p.status !== "available") ?? pool[0];
      setSelectedGtin(interesting.gtin);
    }
  }, [pool, selectedGtin]);

  const selected = useMemo(
    () => pool.find((p) => p.gtin === selectedGtin) ?? null,
    [pool, selectedGtin],
  );

  const country = useMemo(
    () => (issuer ? lookupPrefixCountry(issuer.company_prefix) : null),
    [issuer],
  );

  const filteredPool = useMemo(() => {
    if (statusFilter === "all") return pool;
    return pool.filter((p) => p.status === statusFilter);
  }, [pool, statusFilter]);

  // --- Actions ---
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIssuer(null);
    setPool([]);
    setStats(null);
    setSelectedGtin(null);
    setGate("signin");
  }, []);

  const handleIssueTestGtin = useCallback(async () => {
    if (!issuer) return;
    if (!testName.trim()) {
      setError("Product name required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const gtin = await reserveGtinForOrder(issuer.id, null);
      await composeProductRecord({
        gtin,
        name: testName.trim(),
        variant: testVariant.trim() || null,
      });
      setTestName("");
      setTestVariant("");
      await refresh();
      setSelectedGtin(gtin);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "failed to issue GTIN";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [issuer, testName, testVariant, refresh]);

  const handleReplenish = useCallback(async () => {
    if (!issuer) return;
    setBusy(true);
    setError(null);
    try {
      const added = await replenishPool(issuer.id, 100);
      await refresh();
      alert(`Generated ${added} new GTINs into the pool`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "replenish failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [issuer, refresh]);

  const handleResetIssuer = useCallback(async () => {
    if (!issuer) return;
    const expected = issuer.company_prefix;
    const typed = window.prompt(
      `DANGER: this wipes every GTIN, product record, audit entry, and sync log for issuer "${issuer.brand}" (${expected}).\n\nType the prefix (${expected}) to confirm:`,
    );
    if (typed !== expected) return;
    setBusy(true);
    setError(null);
    try {
      await resetIssuer(issuer.id);
      setSelectedGtin(null);
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "reset failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [issuer, refresh]);

  const handleVoidSelected = useCallback(async () => {
    if (!selected) return;
    const reason = window.prompt(`Void reason for ${selected.gtin}?`);
    if (!reason) return;
    setBusy(true);
    try {
      await voidGtin(selected.gtin, reason);
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "void failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [selected, refresh]);

  const downloadPng = useCallback(() => {
    if (!selected) return;
    // Print mode: GS1 EAN-13 100% target (22.85mm × 0.330mm X-dim, 11X/7X quiet)
    const canvas = createBarcodeCanvas({
      value: selected.gtin,
      symbology: selected.symbology,
      mode: "print",
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${selected.gtin}.png`;
    link.click();
  }, [selected]);

  const downloadSvg = useCallback(() => {
    if (!selected) return;
    const svg = renderBarcodeToSvg({
      value: selected.gtin,
      symbology: selected.symbology,
      mode: "print",
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selected.gtin}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [selected]);

  const printBarcode = useCallback(() => {
    if (!selected) return;
    const canvas = createBarcodeCanvas({
      value: selected.gtin,
      symbology: selected.symbology,
      mode: "print",
    });
    if (printImgRef.current) printImgRef.current.src = canvas.toDataURL("image/png");
    window.requestAnimationFrame(() => window.print());
  }, [selected]);

  // --- Gate renders ---
  if (gate === "loading") {
    return (
      <div className="bs-app">
        <div className="bs-boot">Loading…</div>
      </div>
    );
  }

  if (gate === "signin") {
    return (
      <div className="bs-app">
        <LoginForm onAuthenticated={() => setGate("loading")} />
      </div>
    );
  }

  if (gate === "not-admin") {
    return (
      <div className="bs-app">
        <div className="bs-onboard">
          <div className="bs-onboard-card">
            <div className="bs-onboard-heading">
              <span className="bs-onboard-eyebrow">ACCESS DENIED</span>
              <h1 className="bs-onboard-title">Admin role required</h1>
              <p className="bs-onboard-desc">
                Your account is authenticated but not marked as admin in user_roles.
                Ask an existing admin to grant you the role.
              </p>
            </div>
            <button type="button" className="bs-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // gate === "ready"
  if (!issuer) {
    return (
      <div className="bs-app">
        <Onboarding onComplete={refresh} onSignOut={handleSignOut} />
      </div>
    );
  }

  const spec = getSpec(issuer.symbology);
  const selectedName = selected?.record?.name ?? issuer.brand;
  const selectedVariant = selected?.record?.variant ?? "";

  return (
    <div className="bs-app">
      <header className="bs-topbar">
        <div className="bs-brand">
          <span className="bs-brand-dot" />
          <span>Barcode Studio</span>
        </div>
        <div className="bs-meta">
          <div className="bs-meta-item">
            <span className="bs-meta-key">issuer</span>
            <span className="bs-meta-val">{issuer.brand}</span>
          </div>
          <div className="bs-meta-item">
            <span className="bs-meta-key">prefix</span>
            <span className="bs-meta-val">{issuer.company_prefix}</span>
          </div>
          <div className="bs-meta-item">
            <span className="bs-meta-key">sym</span>
            <span className="bs-meta-val">{spec.label}</span>
          </div>
          {country && (
            <div className="bs-meta-item">
              <span className="bs-meta-key">region</span>
              <span className="bs-meta-val">{country}</span>
            </div>
          )}
          <div className="bs-meta-item">
            <span className="bs-meta-key">user</span>
            <span className="bs-meta-val">{user?.email?.split("@")[0]}</span>
          </div>
          <button
            type="button"
            className="bs-meta-reset"
            onClick={handleResetIssuer}
            disabled={busy}
            title="Wipe every GTIN for this issuer (test only)"
          >
            reset issuer
          </button>
          <button type="button" className="bs-meta-reset" onClick={handleSignOut}>
            sign out
          </button>
        </div>
      </header>

      <main className="bs-main">
        <section className="bs-panel">
          <div className="bs-panel-heading">
            <h1 className="bs-panel-title">Pool</h1>
            <p className="bs-panel-desc">
              {stats
                ? `${stats.available} available · ${stats.reserved} reserved · ${stats.used} used · ${stats.activated} activated${stats.voided ? ` · ${stats.voided} voided` : ""}`
                : "loading pool state…"}
            </p>
          </div>

          <div className="bs-newprod">
            <div className="bs-newprod-heading">
              <span className="bs-field-label">Issue test GTIN</span>
            </div>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Product name"
              maxLength={40}
              className="bs-text-field"
              disabled={busy}
            />
            <input
              type="text"
              value={testVariant}
              onChange={(e) => setTestVariant(e.target.value)}
              placeholder="Variant / volume (e.g. 50 ml)"
              maxLength={60}
              className="bs-text-field"
              disabled={busy}
            />
            <button
              type="button"
              className="bs-btn bs-btn--primary bs-newprod-submit"
              onClick={handleIssueTestGtin}
              disabled={busy || !testName.trim()}
            >
              {busy ? "Reserving…" : "Reserve + compose"}
            </button>
          </div>

          {error && <p className="bs-helper is-err">{error}</p>}

          <div className="bs-divider" />

          <div className="bs-field">
            <span className="bs-field-label">Filter</span>
            <div className="bs-sym" role="radiogroup">
              {(["all", "available", "reserved", "used", "activated"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={statusFilter === s}
                  className={`bs-sym-btn ${statusFilter === s ? "is-active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {filteredPool.length === 0 ? (
            <div className="bs-products-empty">
              <span className="bs-products-empty-label">Empty</span>
              <span className="bs-products-empty-hint">
                {statusFilter === "all"
                  ? "Pool is empty. Replenish to generate more GTINs."
                  : `No GTINs in status "${statusFilter}".`}
              </span>
            </div>
          ) : (
            <ul className="bs-products">
              {filteredPool.slice(0, 100).map((p) => (
                <li key={p.gtin}>
                  <button
                    type="button"
                    className={`bs-product ${p.gtin === selectedGtin ? "is-selected" : ""}`}
                    onClick={() => setSelectedGtin(p.gtin)}
                  >
                    <span className="bs-product-main">
                      <span className="bs-product-name">
                        {p.record?.name ?? `· ${p.status}`}
                      </span>
                      {p.record?.variant && (
                        <span className="bs-product-variant">{p.record.variant}</span>
                      )}
                    </span>
                    <span className="bs-product-gtin">{p.gtin}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="bs-panel-footer">
            <button
              type="button"
              className="bs-btn bs-btn--ghost"
              onClick={handleReplenish}
              disabled={busy}
            >
              Replenish +100
            </button>
            {selected && selected.status !== "voided" && (
              <button
                type="button"
                className="bs-btn bs-btn--ghost bs-btn--danger"
                onClick={handleVoidSelected}
                disabled={busy}
              >
                Void selected
              </button>
            )}
          </div>
        </section>

        <section className="bs-stage">
          <div className="bs-canvas-wrap">
            {selected ? (
              <>
                <div className="bs-readout">
                  <div className="bs-readout-gtin">{selected.gtin}</div>
                  <div className="bs-readout-sym">
                    {spec.label} · {selected.status.toUpperCase()}
                    {country ? ` · ${country}` : ""}
                  </div>
                </div>
                <span className="bs-stage-corner bs-stage-corner--tl" />
                <span className="bs-stage-corner bs-stage-corner--tr" />
                <span className="bs-stage-corner bs-stage-corner--bl" />
                <span className="bs-stage-corner bs-stage-corner--br" />
                <Suspense fallback={<div className="bs-empty">loading scene</div>}>
                  <Scene
                    gtin={selected.gtin}
                    symbology={selected.symbology}
                    productName={selectedName}
                    subtitle={selectedVariant}
                  />
                </Suspense>
              </>
            ) : (
              <div className="bs-stage-idle">
                <span className="bs-stage-idle-eyebrow">POOL READY</span>
                <span className="bs-stage-idle-title">
                  Issue a test GTIN to see the label
                </span>
                <span className="bs-stage-idle-desc">
                  Prefix <span className="bs-mono">{issuer.company_prefix}</span> · pool
                  has <span className="bs-mono">{stats?.available ?? 0}</span>{" "}
                  available GTINs.
                </span>
              </div>
            )}
          </div>

          <footer className="bs-stage-footer">
            <div className="bs-stage-foot-meta">
              <span>
                status
                <span className="bs-stage-foot-meta-val">
                  {selected ? selected.status : "—"}
                </span>
              </span>
              <span>
                gtin
                <span className="bs-stage-foot-meta-val">
                  {selected ? selected.gtin : "—"}
                </span>
              </span>
              <span>
                reserved
                <span className="bs-stage-foot-meta-val">
                  {selected?.reserved_at
                    ? new Date(selected.reserved_at).toISOString().slice(0, 16).replace("T", " ")
                    : "—"}
                </span>
              </span>
            </div>

            <div className="bs-actions">
              <button
                type="button"
                className="bs-btn"
                onClick={printBarcode}
                disabled={!selected}
              >
                Print
              </button>
              <button
                type="button"
                className="bs-btn"
                onClick={downloadSvg}
                disabled={!selected}
              >
                SVG
              </button>
              <button
                type="button"
                className="bs-btn bs-btn--primary"
                onClick={downloadPng}
                disabled={!selected}
              >
                Download PNG
              </button>
            </div>
          </footer>
        </section>
      </main>

      <div className="bs-print-only" aria-hidden="true" style={{ display: "none" }}>
        <img ref={printImgRef} alt="" />
      </div>
    </div>
  );
}
