import clsx from "clsx";

export interface SpecLabelProps {
  /** e.g. "§01", "FIG. 02", "// SITE" */
  children: string;
  className?: string;
}

/** Mono eyebrow / divider label used sparingly for the "spec sheet" annotation motif. */
export function SpecLabel({ children, className }: SpecLabelProps) {
  return (
    <span className={clsx("font-mono-annotation text-accent", className)} aria-hidden={false}>
      {children}
    </span>
  );
}
