import clsx from "clsx";

export interface AbstractVisualProps {
  /** A service or case study slug — deterministically picks a visual pattern. Never a real screenshot. */
  variant: string;
  className?: string;
  label?: string;
}

const PATTERNS = [
  // Diagonal grid + circle
  (id: string) => (
    <>
      <rect width="400" height="240" fill={`url(#grad-${id})`} />
      <g stroke="var(--color-border-strong)" strokeWidth="1" opacity="0.5">
        <line x1="0" y1="60" x2="400" y2="60" />
        <line x1="0" y1="120" x2="400" y2="120" />
        <line x1="0" y1="180" x2="400" y2="180" />
        <line x1="100" y1="0" x2="100" y2="240" />
        <line x1="200" y1="0" x2="200" y2="240" />
        <line x1="300" y1="0" x2="300" y2="240" />
      </g>
      <circle cx="300" cy="70" r="46" fill="none" stroke="var(--color-accent-bright)" strokeWidth="2" />
    </>
  ),
  // Stacked bars
  (id: string) => (
    <>
      <rect width="400" height="240" fill={`url(#grad-${id})`} />
      <g fill="var(--color-accent-bright)" opacity="0.85">
        <rect x="60" y="150" width="36" height="60" />
        <rect x="130" y="110" width="36" height="100" />
        <rect x="200" y="70" width="36" height="140" />
        <rect x="270" y="130" width="36" height="80" />
      </g>
    </>
  ),
  // Concentric arcs
  (id: string) => (
    <>
      <rect width="400" height="240" fill={`url(#grad-${id})`} />
      <g fill="none" stroke="var(--color-accent-bright)" strokeWidth="2" opacity="0.8">
        <circle cx="120" cy="120" r="40" />
        <circle cx="120" cy="120" r="70" />
        <circle cx="120" cy="120" r="100" />
      </g>
    </>
  ),
  // Node/path diagram
  (id: string) => (
    <>
      <rect width="400" height="240" fill={`url(#grad-${id})`} />
      <g stroke="var(--color-accent-bright)" strokeWidth="2" fill="var(--color-surface)">
        <line x1="70" y1="70" x2="200" y2="120" opacity="0.6" />
        <line x1="200" y1="120" x2="330" y2="70" opacity="0.6" />
        <line x1="200" y1="120" x2="200" y2="200" opacity="0.6" />
        <circle cx="70" cy="70" r="10" />
        <circle cx="200" cy="120" r="12" />
        <circle cx="330" cy="70" r="10" />
        <circle cx="200" cy="200" r="10" />
      </g>
    </>
  ),
];

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 1000;
  }
  return hash;
}

/**
 * Abstract/illustrative SVG visual (diagrams, gradients, geometric shapes) —
 * never a real product screenshot, per the spec's confidentiality
 * requirement for case study and service imagery. Variant is derived
 * deterministically from a slug so the same page always renders the same
 * pattern.
 */
export function AbstractVisual({ variant, className, label }: AbstractVisualProps) {
  const id = variant;
  const index = hashSlug(variant) % PATTERNS.length;
  const pattern = PATTERNS[index];

  return (
    <svg
      viewBox="0 0 400 240"
      className={clsx("h-full w-full rounded-lg", className)}
      role="img"
      aria-label={label ?? "Abstract illustrative graphic"}
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-soft)" />
          <stop offset="100%" stopColor="var(--color-surface-sunken)" />
        </linearGradient>
      </defs>
      {pattern(id)}
    </svg>
  );
}
