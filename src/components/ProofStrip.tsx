import Link from "next/link";
import { caseStudies } from "@/data/caseStudies";

/**
 * Full-bleed ruled row of quantified proof, pulled directly from
 * caseStudies[].headlineStat — the home page's trust layer (previously
 * absent entirely). Each cell links to its source case study.
 */
export function ProofStrip() {
  const stats = caseStudies.filter((cs) => cs.headlineStat);

  return (
    <div className="grid grid-cols-1 border-t border-rule sm:grid-cols-3">
      {/* One cell per case study (currently 3). Stacked below sm with a
          bottom rule between cells; a single ruled row at sm+, where only the
          first cell drops its left rule. Assumes each Link below is a
          direct, unwrapped grid child with no interspersed elements. */}
      {stats.map((cs) => (
        <Link
          key={cs.slug}
          href={`/work/${cs.slug}`}
          aria-label={`${cs.headlineStat!.value}: ${cs.headlineStat!.label}`}
          className="group flex flex-col gap-1 border-b border-rule px-5 py-6 transition-colors duration-150 last:border-b-0 sm:border-b-0 sm:border-l sm:first:border-l-0 hover:bg-wash focus-visible:bg-wash"
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
