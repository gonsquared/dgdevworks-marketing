import Link from "next/link";
import clsx from "clsx";

export interface ServiceColumnProps {
  href: string;
  index: string;
  title: string;
  meta?: string;
  /** Semantic heading level for the title — pick based on the column's
   * position in the page's document outline. Defaults to 3 (columns are
   * typically one level below a section's h2). */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

const HeadingTag = { 2: "h2", 3: "h3", 4: "h4" } as const;

/**
 * A single ruled column in a services/pricing-tier grid — the columnar
 * counterpart to IndexRow. Meant to sit inside a `grid grid-cols-1
 * md:grid-cols-4` wrapper with `border-y border-rule`; this component only
 * owns the dividers between columns (see className below), not the
 * grid's outer top/bottom rule.
 *
 * Usage:
 *   <div className="grid grid-cols-1 border-y border-rule md:grid-cols-4">
 *     <ServiceColumn href="/services/mvp-development" index="01"
 *       title="MVP / Product Build" meta="Starting at $8,400" />
 *     ...
 *   </div>
 */
export function ServiceColumn({ href, index, title, meta, headingLevel = 3, className }: ServiceColumnProps) {
  const Tag = HeadingTag[headingLevel];

  return (
    <Link
      href={href}
      className={clsx(
        "group flex h-full min-h-[180px] flex-col justify-between border-t border-rule px-1 py-6 transition-colors duration-150 first:border-t-0 hover:bg-wash focus-visible:bg-wash md:border-t-0 md:border-l md:px-6 md:last:border-r",
        className
      )}
    >
      <div>
        <span className="font-mono-annotation text-text-secondary">{index}</span>
        <Tag className="heading-h4 mt-2">{title}</Tag>
      </div>
      <div className="mt-6 flex items-center justify-between gap-2">
        {meta && <span className="text-ui text-accent">{meta}</span>}
        <span
          aria-hidden="true"
          className="font-mono-annotation text-accent shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}
