import Link from "next/link";
import clsx from "clsx";

export interface IndexRowProps {
  href: string;
  index: string;
  title: string;
  summary: string;
  meta?: string;
  className?: string;
}

/**
 * A single ruled, fully-clickable index row — the card-grid replacement.
 * The entire row is one <Link>; never nest another interactive element
 * inside it (breaks screen-reader navigation and HTML validity).
 *
 * Usage:
 *   <IndexRow href="/services/mvp-development" index="01"
 *     title="MVP / Product Build" summary="…" meta="Starting at $8,400" />
 */
export function IndexRow({ href, index, title, summary, meta, className }: IndexRowProps) {
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
        <span className="heading-h3 block">{title}</span>
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
