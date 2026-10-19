import Link from "next/link";
import clsx from "clsx";

export interface IndexRowProps {
  href: string;
  title: string;
  summary: string;
  /** Right-aligned figure — a price or headline stat. */
  meta?: string;
  /** Semantic heading level for the title — pick based on the row's position
   * in the page's document outline. Defaults to 3 (index rows are typically
   * one level below a section's h2). */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

const HeadingTag = { 2: "h2", 3: "h3", 4: "h4" } as const;

/**
 * A single fully-clickable list row. The whole row is one <Link>; never nest
 * another interactive element inside it (breaks screen-reader navigation and
 * HTML validity). Rows are separated by a hairline that dissolves on hover as
 * the row's rounded wash fades in (pointer-fine devices only).
 *
 * Usage:
 *   <IndexRow href="/services/mvp-development"
 *     title="MVP / Product Build" summary="…" meta="Starting at $8,400" />
 */
export function IndexRow({ href, title, summary, meta, headingLevel = 3, className }: IndexRowProps) {
  const Tag = HeadingTag[headingLevel];

  return (
    <Link
      href={href}
      className={clsx(
        "group relative -mx-4 flex flex-col gap-2 rounded-[14px] px-4 py-7 transition-colors duration-200 ease-out md:-mx-6 md:flex-row md:items-start md:gap-8 md:px-6 md:py-8",
        "after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-rule after:transition-opacity after:duration-200 md:after:inset-x-6 [&:last-child]:after:hidden",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-wash [@media(hover:hover)_and_(pointer:fine)]:hover:after:opacity-0",
        "focus-visible:bg-wash",
        className
      )}
    >
      <span className="min-w-0 flex-1">
        <Tag className="heading-h3 block">{title}</Tag>
        <span className="text-body text-text-secondary mt-2 line-clamp-3 block">{summary}</span>
      </span>
      {meta && (
        <span className="font-figure text-text-primary shrink-0 text-[1.375rem] md:w-48 md:pt-0.5 md:text-right">
          {meta}
        </span>
      )}
      <span
        aria-hidden="true"
        className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-surface text-accent shadow-[0_0_0_1px_var(--color-border)] transition-[transform,background-color,color,box-shadow] duration-200 ease-out md:flex [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-accent [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-accent-on-fill"
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 3.5 4.5 4.5L6 12.5" />
        </svg>
      </span>
    </Link>
  );
}
