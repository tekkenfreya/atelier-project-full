import { useMemo, useState } from "react";
import { SYMBOLOGIES, type Symbology } from "../lib/gtin";
import { validatePrefix } from "../lib/generator";
import { configureIssuer } from "../lib/engine";

interface OnboardingProps {
  onComplete: () => void;
  onSignOut: () => void;
}

export default function Onboarding({ onComplete, onSignOut }: OnboardingProps) {
  const [symbology, setSymbology] = useState<Symbology>("ean13");
  const [prefix, setPrefix] = useState("");
  const [brand, setBrand] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prefixValidation = useMemo(
    () => validatePrefix(prefix, symbology),
    [prefix, symbology],
  );

  const canSubmit = prefixValidation.ok && brand.trim().length > 0 && !busy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await configureIssuer({
        companyPrefix: prefix,
        brand: brand.trim(),
        symbology,
        initialBatchSize: 100,
      });
      onComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "failed to configure issuer";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const helperText = prefixValidation.error
    ? prefixValidation.error
    : prefixValidation.ok
      ? `product references will be ${prefixValidation.productRefLength} digits · initial batch of 100 will be pre-generated`
      : "6–11 digits, issued by GS1";

  const helperTone = prefixValidation.error
    ? "is-err"
    : prefixValidation.ok
      ? "is-ok"
      : "";

  return (
    <div className="bs-onboard">
      <form className="bs-onboard-card" onSubmit={handleSubmit}>
        <div className="bs-onboard-heading">
          <span className="bs-onboard-eyebrow">SETUP · 01</span>
          <h1 className="bs-onboard-title">Configure issuer</h1>
          <p className="bs-onboard-desc">
            This is your company's GS1 prefix. Barcode Studio pre-generates a pool of
            GTINs within it; each order pulls from the pool atomically. Saved to the
            shared engine — all admins see the same configuration.
          </p>
        </div>

        <fieldset className="bs-field">
          <legend className="bs-field-label">Symbology</legend>
          <div className="bs-sym" role="radiogroup">
            {SYMBOLOGIES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={symbology === s.id}
                className={`bs-sym-btn ${symbology === s.id ? "is-active" : ""}`}
                onClick={() => setSymbology(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="bs-field">
          <legend className="bs-field-label">Company prefix</legend>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 3800502"
            maxLength={11}
            className={`bs-input ${prefixValidation.ok ? "is-ok" : prefixValidation.error ? "is-err" : ""}`}
          />
          <p className={`bs-helper ${helperTone}`}>{helperText}</p>
        </fieldset>

        <fieldset className="bs-field">
          <legend className="bs-field-label">Brand name</legend>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="KYRILL"
            maxLength={40}
            className="bs-text-field"
          />
          <p className="bs-helper">shown on the 3D product mockup and labels</p>
        </fieldset>

        {error && <p className="bs-helper is-err">{error}</p>}

        <button
          type="submit"
          className="bs-btn bs-btn--primary bs-onboard-submit"
          disabled={!canSubmit}
        >
          {busy ? "Creating issuer + pool…" : "Create issuer →"}
        </button>

        <button
          type="button"
          className="bs-btn bs-btn--ghost"
          onClick={onSignOut}
          disabled={busy}
          style={{ marginTop: "0.5rem" }}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
