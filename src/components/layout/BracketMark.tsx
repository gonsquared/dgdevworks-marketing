import clsx from "clsx";

export interface BracketMarkProps {
  className?: string;
}

/**
 * The DG DevWorks logomark: a `</>` code mark drawn as SVG strokes (it
 * replaced the earlier `[ ]` corner-bracket pair; the component keeps its
 * original name). Reused at nav/footer scale (via Logotype), in the home
 * masthead dateline, and, oversized and low-contrast, as the ClosingRecord
 * watermark. Always decorative: uses currentColor and takes its color from
 * the wrapping element's text color via className.
 */
export function BracketMark({ className }: BracketMarkProps) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className={clsx("shrink-0", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 2.5 L2 8 L7.5 13.5" />
        <path d="M13.75 1.5 L10.25 14.5" />
        <path d="M16.5 2.5 L22 8 L16.5 13.5" />
      </g>
    </svg>
  );
}
