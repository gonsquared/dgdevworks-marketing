import clsx from "clsx";

export interface BracketMarkProps {
  className?: string;
}

/**
 * The [DG] mark, drawn as an SVG corner-bracket pair — reused at nav/footer
 * scale (via Logotype) and, oversized and low-contrast, as the
 * ClosingRecord watermark. Promotes the retired .card-bracket motif into
 * the literal logomark. Always decorative: uses currentColor and takes its
 * color from the wrapping element's text color via className.
 */
export function BracketMark({ className }: BracketMarkProps) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className={clsx("shrink-0", className)}>
      <path d="M5 1 H1 V15 H5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M19 1 H23 V15 H19" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
