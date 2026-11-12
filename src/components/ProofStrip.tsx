import type { CSSProperties } from "react";
import Link from "next/link";
import { caseStudies } from "@/data/caseStudies";

/**
 * Full-bleed ruled row of quantified proof, pulled directly from
 * caseStudies[].headlineStat — the home page's trust layer. Each cell links
 * to its source case study.
 */
export function ProofStrip() {
  const stats = caseStudies.filter((cs) => cs.headlineStat);

  return (
    <div
      // At lg+ every stat sits on a single row, however many case studies there are.
      style={{ "--proof-cols": stats.length } as CSSProperties}
      className="grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-[repeat(var(--proof-cols),minmax(0,1fr))]"
    >
      {/* Rules: stacked below sm (bottom rule between cells); a 2-column wrap
          at sm, where each row's first (odd) cell drops its left rule; a single
          row at lg+, where only the first cell drops its left rule and no cell
          has a bottom rule. Assumes each Link is a direct, unwrapped grid
          child with no interspersed elements. */}
      {stats.map((cs) => (
        <Link
          key={cs.slug}
          href={`/work/${cs.slug}`}
          aria-label={`${cs.headlineStat!.value}: ${cs.headlineStat!.label}`}
          className="group flex flex-col gap-1 border-b border-rule px-5 py-6 transition-colors duration-150 last:border-b-0 sm:border-l sm:[&:nth-child(2n+1)]:border-l-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2n+1)]:border-l lg:first:border-l-0 hover:bg-wash focus-visible:bg-wash"
        >
          <span aria-hidden="true" className="font-mono-figure text-accent text-3xl md:text-4xl">
            {cs.headlineStat!.value}
          </span>
          <span aria-hidden="true" className="text-ui text-text-secondary">
            {cs.headlineStat!.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
