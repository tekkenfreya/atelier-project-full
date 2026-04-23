import { useState } from "react";
import { supabase } from "../lib/supabase";

interface LoginFormProps {
  onAuthenticated: () => void;
}

export default function LoginForm({ onAuthenticated }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    onAuthenticated();
  };

  return (
    <div className="bs-onboard">
      <form className="bs-onboard-card" onSubmit={handleSubmit}>
        <div className="bs-onboard-heading">
          <span className="bs-onboard-eyebrow">ACCESS · 00</span>
          <h1 className="bs-onboard-title">Sign in</h1>
          <p className="bs-onboard-desc">
            Barcode Studio is admin-only. Sign in with the same credentials you use for
            the Kyrill admin dashboard.
          </p>
        </div>

        <fieldset className="bs-field">
          <legend className="bs-field-label">Email</legend>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="bs-text-field"
            required
          />
        </fieldset>

        <fieldset className="bs-field">
          <legend className="bs-field-label">Password</legend>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bs-text-field"
            required
          />
        </fieldset>

        {error && <p className="bs-helper is-err">{error}</p>}

        <button
          type="submit"
          className="bs-btn bs-btn--primary bs-onboard-submit"
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
