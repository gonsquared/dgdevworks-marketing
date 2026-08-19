import clsx from "clsx";

export interface IndexRailProps {
  number: string;
  label: string;
  className?: string;
}

/**
 * Sticky section index (number + label) rendered in the left rail at
 * >=1280px; degrades to an inline label above the section content below
 * that breakpoint. The label is always present in the static HTML — it is
 * never injected or altered by client-side JS.
 *
 * Usage: <IndexRail number="02" label="PROOF OF WORK" />
 */
export function IndexRail({ number, label, className }: IndexRailProps) {
  return (
    <div
      className={clsx(
        "flex items-baseline gap-2 xl:sticky xl:top-[5.5rem] xl:flex-col xl:items-start xl:gap-1",
        className
      )}
    >
      <span className="font-mono-annotation text-accent">{number}</span>
      <span className="font-mono-annotation text-text-secondary">{label}</span>
    </div>
  );
}
