import type { User } from "@supabase/supabase-js";
import { formatDate } from "../format";

interface ProfileProps {
  user: User;
  customerName: string | null;
  onSignOut: () => void;
}

export default function Profile({ user, customerName, onSignOut }: ProfileProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Profile</h1>
        <p className="account-section__subtitle">Your account information.</p>
      </header>
      <dl className="account-deflist">
        <div className="account-deflist__row">
          <dt>Name</dt>
          <dd>{customerName ?? "—"}</dd>
        </div>
        <div className="account-deflist__row">
          <dt>Email</dt>
          <dd>{user.email ?? "—"}</dd>
        </div>
        <div className="account-deflist__row">
          <dt>Member since</dt>
          <dd>{user.created_at ? formatDate(user.created_at) : "—"}</dd>
        </div>
      </dl>
      <div className="account-actions">
        <button
          type="button"
          className="account-btn account-btn--secondary"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
