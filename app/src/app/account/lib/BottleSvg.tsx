import type { RitualVariant } from "./types";

const TINTS: Record<RitualVariant, string> = {
  serum: "#b8a85e",
  cleanser: "#a8b8bc",
  moisturizer: "#d4c4a8",
};

export default function BottleSvg({ variant }: { variant: RitualVariant }) {
  const tint = TINTS[variant];
  const gradientId = `bottle-${variant}`;
  return (
    <svg viewBox="0 0 48 72" className="rd-bottle-svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.3" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="18" y="4" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path
        d="M16 12 L16 18 Q16 20 18 20 L30 20 Q32 20 32 18 L32 12 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="10"
        y="20"
        width="28"
        height="46"
        rx="3"
        fill={`url(#${gradientId})`}
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line x1="14" y1="54" x2="34" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}
