import { useCallback, useRef, useState } from "react";
import {
  parseGtinsFromExcel,
  type ParsedExcelImport,
} from "../lib/excelImport";
import { importGtinBatch, type ImportGtinResult } from "../lib/engine";

interface ImportFileProps {
  /** Variant changes copy + chrome but keeps the core flow identical. */
  variant: "onboarding" | "modal";
  /** Existing brand if an issuer has been configured before — pre-fills
   *  the brand field so re-imports don't require re-typing. */
  defaultBrand?: string;
  /** Called after a successful import. Receives the RPC result. */
  onImported: (result: ImportGtinResult) => void;
  /** Optional cancel handler — only meaningful in modal variant. */
  onCancel?: () => void;
  /** Sign-out from the onboarding screen if user wants to switch accounts. */
  onSignOut?: () => void;
}

type Stage = "idle" | "parsing" | "preview" | "importing";

export default function ImportFile({
  variant,
  defaultBrand,
  onImported,
  onCancel,
  onSignOut,
}: ImportFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [parsed, setParsed] = useState<ParsedExcelImport | null>(null);
  const [brand, setBrand] = useState<string>(defaultBrand ?? "");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setStage("parsing");
      try {
        const result = await parseGtinsFromExcel(file);
        if (result.gtins.length === 0) {
          setError(
            "No valid GTINs found in this file. Check that it's a GS1 registration template with 13-digit barcodes.",
          );
          setStage("idle");
          return;
        }
        setParsed(result);
        // Auto-fill brand from the file unless the user has already typed
        // one (keep their input on re-upload).
        if (!brand) {
          setBrand(result.brand ?? defaultBrand ?? "Atelier Rusalka");
        }
        setStage("preview");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to parse file";
        setError(msg);
        setStage("idle");
      }
    },
    [brand, defaultBrand],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleConfirmImport = useCallback(async () => {
    if (!parsed) return;
    if (!brand.trim()) {
      setError("Brand is required");
      return;
    }
    setStage("importing");
    setError(null);
    try {
      const result = await importGtinBatch({
        gtins: parsed.gtins,
        brand: brand.trim(),
      });
      onImported(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setError(msg);
      setStage("preview");
    }
  }, [parsed, brand, onImported]);

  const isOnboarding = variant === "onboarding";

  return (
    <div className={isOnboarding ? "bs-onboard" : "bs-modal"}>
      <div className={isOnboarding ? "bs-onboard-card" : "bs-modal-card"}>
        <div className="bs-onboard-heading">
          <span className="bs-onboard-eyebrow">
            {isOnboarding ? "SETUP · 01" : "IMPORT · MORE"}
          </span>
          <h1 className="bs-onboard-title">
            {isOnboarding
              ? "Import your GTIN file"
              : "Import another batch"}
          </h1>
          <p className="bs-onboard-desc">
            {isOnboarding
              ? "Upload the registration spreadsheet from GS1 Bulgaria. The app reads every GTIN it finds, validates the check digit, and adds them to the issuer pool. No manual prefix entry — everything comes from the file."
              : "Upload a fresh GS1 export to add more GTINs to the existing pool. Duplicates are skipped automatically; invalid rows are reported."}
          </p>
        </div>

        {stage === "idle" && (
          <div
            className={`bs-import-drop ${dragOver ? "is-drag" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="bs-import-input"
              onChange={handleFileInputChange}
              aria-hidden
              tabIndex={-1}
            />
            <span className="bs-import-drop-eyebrow">XLSX · drag or click</span>
            <span className="bs-import-drop-title">
              drop a registration template here
            </span>
            <span className="bs-import-drop-sub">
              or click to choose a file from your computer
            </span>
          </div>
        )}

        {stage === "parsing" && (
          <div className="bs-import-busy">
            <span className="bs-boot-dot" />
            reading the file…
          </div>
        )}

        {stage === "preview" && parsed && (
          <>
            <div className="bs-import-summary">
              <div className="bs-import-stat">
                <span className="bs-import-stat-k">GTINs</span>
                <span className="bs-import-stat-v">{parsed.gtins.length}</span>
              </div>
              <span className="bs-import-stat-rule" />
              <div className="bs-import-stat">
                <span className="bs-import-stat-k">prefix</span>
                <span className="bs-import-stat-v fs-mono">
                  {parsed.prefix ?? "—"}
                </span>
              </div>
              <span className="bs-import-stat-rule" />
              <div className="bs-import-stat">
                <span className="bs-import-stat-k">region</span>
                <span className="bs-import-stat-v">
                  {parsed.country ?? "—"}
                </span>
              </div>
              {parsed.invalidCount > 0 && (
                <>
                  <span className="bs-import-stat-rule" />
                  <div className="bs-import-stat">
                    <span className="bs-import-stat-k">skipped</span>
                    <span className="bs-import-stat-v bs-import-stat-v--err">
                      {parsed.invalidCount}
                    </span>
                  </div>
                </>
              )}
            </div>

            <fieldset className="bs-field">
              <legend className="bs-field-label">Brand</legend>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Atelier Rusalka"
                className="bs-text-field"
                maxLength={60}
              />
              <p className="bs-helper">
                {parsed.brand
                  ? "auto-detected from the file · edit if needed"
                  : "no brand owner header found in the file · type the issuer name"}
              </p>
            </fieldset>

            <details className="bs-import-list">
              <summary className="bs-import-list-summary">
                preview {parsed.gtins.length} GTIN
                {parsed.gtins.length === 1 ? "" : "s"}
              </summary>
              <ul className="bs-import-list-body">
                {parsed.gtins.slice(0, 30).map((g) => (
                  <li key={g} className="fs-mono">
                    {g}
                  </li>
                ))}
                {parsed.gtins.length > 30 && (
                  <li className="bs-import-list-more">
                    + {parsed.gtins.length - 30} more
                  </li>
                )}
              </ul>
            </details>

            {error && <p className="bs-helper is-err">{error}</p>}

            <div className="bs-import-actions">
              <button
                type="button"
                className="bs-btn"
                onClick={() => {
                  setStage("idle");
                  setParsed(null);
                  setError(null);
                }}
              >
                Pick another file
              </button>
              <button
                type="button"
                className="bs-btn bs-btn--primary bs-onboard-submit"
                onClick={handleConfirmImport}
              >
                Import {parsed.gtins.length} GTIN
                {parsed.gtins.length === 1 ? "" : "s"} →
              </button>
            </div>
          </>
        )}

        {stage === "importing" && (
          <div className="bs-import-busy">
            <span className="bs-boot-dot" />
            importing GTINs into the pool…
          </div>
        )}

        {stage === "idle" && error && (
          <p className="bs-helper is-err">{error}</p>
        )}

        {(stage === "idle" || stage === "preview") &&
          (onSignOut || onCancel) && (
            <button
              type="button"
              className="bs-btn bs-btn--ghost"
              onClick={onCancel ?? onSignOut}
              style={{ marginTop: "0.5rem" }}
            >
              {onCancel ? "Cancel" : "Sign out"}
            </button>
          )}
      </div>
    </div>
  );
}
