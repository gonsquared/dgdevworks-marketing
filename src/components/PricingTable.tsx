import Link from "next/link";
import clsx from "clsx";
import type { PricingPackage } from "@/data/types";
import { Badge } from "@/components/ui/Badge";

export interface PricingTableProps {
  packages: PricingPackage[];
  /** Package slug to mark as the recommended row — pass the same slug on
   * every page that renders this table, so the recommendation stays
   * consistent site-wide. */
  recommendedSlug?: string;
  className?: string;
}

/**
 * Pricing list — every row links to its matching service detail page
 * (package slugs match service slugs 1:1). The recommended package is the one
 * raised surface; the rest sit flat and wash on hover. tabular-nums on the
 * price column keeps every price vertically aligned.
 */
export function PricingTable({ packages, recommendedSlug, className }: PricingTableProps) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {packages.map((pkg) => {
        const recommended = pkg.slug === recommendedSlug;
        // JSX strips the whitespace-only text between these sibling <span>s
        // since they're on separate lines, so their text would otherwise
        // concatenate into one run-on accessible name. Give the link an
        // explicit, comma-separated aria-label instead, and hide the visible
        // spans from the accessibility tree so they don't double up — same
        // pattern as CaseStudyLead and ProofStrip.
        const ariaLabel = [pkg.name, recommended ? "recommended" : null, pkg.priceLabel, pkg.timeframe]
          .filter(Boolean)
          .join(", ");
        return (
          <Link
            key={pkg.slug}
            href={`/services/${pkg.slug}`}
            aria-label={ariaLabel}
            className={clsx(
              "group flex min-h-[88px] flex-col gap-3 rounded-[14px] px-5 py-6 transition-[background-color,box-shadow,transform] duration-200 ease-out md:flex-row md:items-center md:gap-8 md:px-7",
              recommended
                ? "border border-border bg-surface shadow-panel"
                : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-wash focus-visible:bg-wash"
            )}
          >
            <span aria-hidden="true" className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="heading-h4">{pkg.name}</span>
                {recommended && <Badge>Recommended</Badge>}
              </span>
              <span className="text-ui text-text-secondary mt-1 block">{pkg.timeframe}</span>
            </span>
            <span
              aria-hidden="true"
              className="font-figure text-text-primary shrink-0 text-[1.5rem] md:w-72 md:text-right md:text-[1.625rem]"
            >
              {pkg.priceLabel}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
