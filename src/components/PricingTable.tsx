import Link from "next/link";
import clsx from "clsx";
import type { PricingPackage } from "@/data/types";

export interface PricingTableProps {
  packages: PricingPackage[];
  /** Package slug to mark as the recommended row — pass the same slug on
   * every page that renders this table, so the recommendation stays
   * consistent site-wide. */
  recommendedSlug?: string;
  className?: string;
}

/**
 * Ruled pricing ledger — every row links to its matching service detail
 * page (package slugs match service slugs 1:1). tabular-nums on the price
 * column keeps every price vertically aligned.
 */
export function PricingTable({ packages, recommendedSlug, className }: PricingTableProps) {
  return (
    <div className={clsx("border-t border-rule", className)}>
      {packages.map((pkg) => {
        const recommended = pkg.slug === recommendedSlug;
        // JSX strips the whitespace-only text between these sibling <span>s
        // since they're on separate lines, so their text would otherwise
        // concatenate into one run-on accessible name (e.g.
        // "MVP / Product BuildRECOMMENDEDStarting at $8,4004–8 weeks"). Give
        // the link an explicit, comma-separated aria-label instead, and hide
        // the visible spans from the accessibility tree so they don't
        // double up — same pattern as CaseStudyLead and ProofStrip.
        const ariaLabel = [pkg.name, recommended ? "recommended" : null, pkg.priceLabel, pkg.timeframe]
          .filter(Boolean)
          .join(", ");
        return (
          <Link
            key={pkg.slug}
            href={`/services/${pkg.slug}`}
            aria-label={ariaLabel}
            className={clsx(
              "group flex min-h-[88px] flex-col gap-2 border-b border-rule py-6 transition-colors duration-150 hover:bg-wash focus-visible:bg-wash md:flex-row md:items-center md:gap-6 md:py-5",
              recommended && "shadow-[inset_2px_0_0_0_var(--color-accent)] md:pl-4"
            )}
          >
            <span aria-hidden="true" className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="heading-h4">{pkg.name}</span>
                {recommended && <span className="font-mono-annotation text-accent">RECOMMENDED</span>}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="font-mono-figure text-accent shrink-0 text-2xl md:w-48"
            >
              {pkg.priceLabel}
            </span>
            <span
              aria-hidden="true"
              className="text-ui text-text-secondary shrink-0 md:w-32 md:text-right"
            >
              {pkg.timeframe}
            </span>
            <span
              aria-hidden="true"
              className="font-mono-annotation text-accent shrink-0 transition-transform duration-150 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
