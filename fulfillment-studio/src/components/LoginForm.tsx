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
    <div className="fs-auth">
      <form className="fs-auth-card" onSubmit={handleSubmit}>
        <div className="fs-auth-heading">
          <span className="fs-auth-eyebrow">ACCESS · 00</span>
          <h1 className="fs-auth-title">Sign in</h1>
          <p className="fs-auth-desc">
            Fulfillment Studio is admin-only. Use the same credentials as the Kyrill
            admin role.
          </p>
        </div>

        <label className="fs-field">
          <span className="fs-field-label">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="fs-input"
            required
          />
        </label>

        <label className="fs-field">
          <span className="fs-field-label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="fs-input"
            required
          />
        </label>

        {error && <p className="fs-helper is-err">{error}</p>}

        <button type="submit" className="fs-btn fs-btn--primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
