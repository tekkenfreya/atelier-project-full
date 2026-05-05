import "./PromoBar.css";

/**
 * Atelier Rusalka 2026 — site-wide welcome offer strip.
 * Renders above the Navbar inside ClientLayout. Non-sticky:
 * scrolls away with the page so the hero can dominate once
 * the visitor begins to engage.
 */
export default function PromoBar() {
  return (
    <div
      className="promo-bar"
      role="complementary"
      aria-label="Welcome offer"
    >
      <span className="promo-bar__dot" aria-hidden />
      <span className="promo-bar__copy">
        Exclusive welcome offer — <strong>60%&nbsp;off</strong> your first ritual
      </span>
      <span className="promo-bar__dot" aria-hidden />
    </div>
  );
}
