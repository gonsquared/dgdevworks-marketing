import clsx from "clsx";

export interface PhaseTrackFigureProps {
  variant: "phase-track";
  steps: string[];
  className?: string;
}

export interface ImpactBarFigureProps {
  variant: "impact-bar";
  label: string;
  beforeLabel: string;
  beforeValue: number;
  afterLabel: string;
  afterValue: number;
  className?: string;
}

export interface ScopeBandFigureProps {
  variant: "scope-band";
  label: string;
  axisMin: number;
  axisMax: number;
  rangeMin: number;
  rangeMax: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export type FigureProps = PhaseTrackFigureProps | ImpactBarFigureProps | ScopeBandFigureProps;

/**
 * Content-derived illustrative figure — replaces AbstractVisual's decorative
 * placeholder shapes with a rendering of the actual data being illustrated.
 * All numeric/text content is real DOM text, not SVG-embedded text; any
 * decorative SVG is aria-hidden with the equivalent information available as
 * adjacent real text.
 */
export function Figure(props: FigureProps) {
  switch (props.variant) {
    case "phase-track":
      return <PhaseTrack {...props} />;
    case "impact-bar":
      return <ImpactBar {...props} />;
    case "scope-band":
      return <ScopeBand {...props} />;
  }
}

function PhaseTrack({ steps, className }: PhaseTrackFigureProps) {
  return (
    <ol className={clsx("flex flex-col md:flex-row md:items-start", className)}>
      {steps.map((step, index) => (
        <li
          key={step}
          className={clsx(
            "relative flex-1 border-l-2 border-rule py-3 pl-5 md:border-t-2 md:border-l-0 md:py-0 md:pt-4 md:pr-6 md:pl-0",
            index === steps.length - 1 && "md:pr-0"
          )}
        >
          <span className="font-mono-annotation text-accent block">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-body text-text-secondary mt-1 block">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function ImpactBar({ label, beforeLabel, beforeValue, afterLabel, afterValue, className }: ImpactBarFigureProps) {
  const max = Math.max(beforeValue, afterValue, 1);
  const rows = [
    { key: "before", label: beforeLabel, value: beforeValue, tone: "fill-border-strong", textTone: "text-text-secondary" },
    { key: "after", label: afterLabel, value: afterValue, tone: "fill-accent", textTone: "text-accent" },
  ];

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <span className="font-mono-annotation text-text-secondary">{label}</span>
      {rows.map((row) => {
        const width = Math.max((row.value / max) * 100, 2);
        return (
          <div key={row.key} className="flex items-center gap-3">
            <span className="text-ui text-text-secondary w-16 shrink-0">{row.label}</span>
            <svg viewBox="0 0 100 8" className="h-2 flex-1" aria-hidden="true" preserveAspectRatio="none">
              <rect width="100" height="8" rx="1" className="fill-surface-sunken" />
              <rect width={width} height="8" rx="1" className={row.tone} />
            </svg>
            <span className={clsx("font-mono-figure w-16 shrink-0 text-right text-base", row.textTone)}>
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ScopeBand({
  label,
  axisMin,
  axisMax,
  rangeMin,
  rangeMax,
  formatValue = String,
  className,
}: ScopeBandFigureProps) {
  const span = Math.max(axisMax - axisMin, 1);
  const start = ((rangeMin - axisMin) / span) * 100;
  const width = Math.max(((rangeMax - rangeMin) / span) * 100, 2);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <span className="font-mono-annotation text-text-secondary">{label}</span>
      <svg viewBox="0 0 100 8" className="h-2 w-full" aria-hidden="true" preserveAspectRatio="none">
        <rect width="100" height="8" rx="1" className="fill-surface-sunken" />
        <rect x={start} width={width} height="8" rx="1" className="fill-accent" />
      </svg>
      <span className="font-mono-figure text-accent text-base">
        {formatValue(rangeMin)}–{formatValue(rangeMax)}
      </span>
    </div>
  );
}
