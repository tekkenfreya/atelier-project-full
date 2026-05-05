import "./TrustStrip.css";

/**
 * Brand-specific reassurances rendered under the primary CTA in
 * cart and checkout. Custom inline SVGs — no icon library dep.
 * Copy is grounded in facts already stated elsewhere in the brand
 * (Sofia provenance, consultation model, 185 botanical actives).
 */
export default function TrustStrip() {
  return (
    <ul className="trust-strip" aria-label="What sets every formula apart">
      <li className="trust-strip__item">
        <svg
          className="trust-strip__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 3v18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M12 9c-3.5 0-5.6-2-5.6-4.5 2.5 0 5.6 2 5.6 4.5z"
            fill="currentColor"
          />
          <path
            d="M12 15c3.5 0 5.6-2 5.6-4.5-2.5 0-5.6 2-5.6 4.5z"
            fill="currentColor"
          />
        </svg>
        <span>Composed in Sofia</span>
      </li>
      <li className="trust-strip__item">
        <svg
          className="trust-strip__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2.5 3"
            opacity="0.7"
          />
        </svg>
        <span>Bespoke to your profile</span>
      </li>
      <li className="trust-strip__item">
        <svg
          className="trust-strip__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 3.5c2.4 3.6 5 6.6 5 10a5 5 0 0 1-10 0c0-3.4 2.6-6.4 5-10z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        <span>From 185 botanicals</span>
      </li>
    </ul>
  );
}
