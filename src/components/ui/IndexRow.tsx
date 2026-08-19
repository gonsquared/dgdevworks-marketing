import Link from "next/link";
import clsx from "clsx";

export interface IndexRowProps {
  href: string;
  index: string;
  title: string;
  summary: string;
  meta?: string;
  /** Semantic heading level for the title — pick based on the row's position
   * in the page's document outline. Defaults to 3 (index rows are typically
   * one level below a section's h2). */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

const HeadingTag = { 2: "h2", 3: "h3", 4: "h4" } as const;

/**
 * A single ruled, fully-clickable index row — the card-grid replacement.
 * The entire row is one <Link>; never nest another interactive element
 * inside it (breaks screen-reader navigation and HTML validity).
 *
 * Usage:
 *   <IndexRow href="/services/mvp-development" index="01"
 *     title="MVP / Product Build" summary="…" meta="Starting at $8,400" />
 */
export function IndexRow({
  href,
  index,
  title,
  summary,
  meta,
  headingLevel = 3,
  className,
}: IndexRowProps) {
  const Tag = HeadingTag[headingLevel];

  return (
    <Link
      href={href}
      className={clsx(
        "group flex min-h-[88px] flex-col gap-1 border-t border-rule py-6 transition-colors duration-150 last:border-b hover:bg-wash focus-visible:bg-wash md:min-h-[96px] md:flex-row md:items-center md:gap-6 md:py-7",
        className
      )}
    >
      <span className="font-mono-annotation text-text-secondary shrink-0 md:w-12">{index}</span>
      <span className="min-w-0 flex-1">
        <Tag className="heading-h3 block">{title}</Tag>
        <span className="text-body text-text-secondary mt-1 block">{summary}</span>
      </span>
      {meta && <span className="text-ui text-text-secondary shrink-0 md:w-40 md:text-right">{meta}</span>}
      <span
        aria-hidden="true"
        className="font-mono-annotation text-accent shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
