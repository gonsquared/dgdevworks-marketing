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
 * Content-derived illustrative figure that renders the actual data being
 * illustrated. All numeric/text content is real DOM text, not SVG-embedded
 * text; any decorative SVG is aria-hidden with the equivalent information
 * available as adjacent real text.
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

/** A real sequence, so it keeps its numbers; a rail connects the steps. */
function PhaseTrack({ steps, className }: PhaseTrackFigureProps) {
  return (
    <ol className={clsx("grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, index) => (
        <li key={step} className="relative flex gap-5 lg:flex-col lg:gap-6">
          <span
            aria-hidden="true"
            className="font-figure relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg text-accent"
          >
            {index + 1}
          </span>
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-11 -bottom-10 left-5.25 w-px bg-border-strong md:hidden"
            />
          )}
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-5.25 left-14 hidden h-px w-[calc(100%-3.5rem+2.5rem)] bg-border-strong lg:block"
            />
          )}
          <span className="text-body text-text-secondary">
            <span className="sr-only">Step {index + 1}: </span>
            {step}
          </span>
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
      <span className="text-ui text-text-secondary">{label}</span>
      {rows.map((row) => {
        const width = Math.max((row.value / max) * 100, 2);
        return (
          <div key={row.key} className="flex items-center gap-3">
            <span className="text-ui text-text-secondary w-16 shrink-0">{row.label}</span>
            <svg viewBox="0 0 100 8" className="h-2 flex-1" aria-hidden="true" preserveAspectRatio="none">
              <rect width="100" height="8" rx="4" className="fill-surface-sunken" />
              <rect width={width} height="8" rx="4" className={row.tone} />
            </svg>
            <span className={clsx("font-figure w-16 shrink-0 text-right text-base", row.textTone)}>
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
      <span className="text-ui text-text-secondary">{label}</span>
      <svg viewBox="0 0 100 8" className="h-2 w-full" aria-hidden="true" preserveAspectRatio="none">
        <rect width="100" height="8" rx="4" className="fill-surface-sunken" />
        <rect x={start} width={width} height="8" rx="4" className="fill-accent" />
      </svg>
      <span className="font-figure text-accent text-base">
        {formatValue(rangeMin)}–{formatValue(rangeMax)}
      </span>
    </div>
  );
}
