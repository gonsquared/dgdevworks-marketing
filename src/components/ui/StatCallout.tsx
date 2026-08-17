import clsx from "clsx";

export interface StatCalloutProps {
  value: string;
  label: string;
  className?: string;
}

/** Bracket-framed stat chip — e.g. "40% faster queries", "0 downtime". */
export function StatCallout({ value, label, className }: StatCalloutProps) {
  return (
    <div className={clsx("card-bracket rounded-md border border-border bg-surface px-4 py-3", className)}>
      <p className="font-mono-figure text-accent leading-none">{value}</p>
      <p className="text-ui text-text-secondary mt-1">{label}</p>
    </div>
  );
}
