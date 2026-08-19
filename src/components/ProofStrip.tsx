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
    <div className="grid grid-cols-2 border-t border-rule md:grid-cols-4">
      {stats.map((cs) => (
        <Link
          key={cs.slug}
          href={`/work/${cs.slug}`}
          aria-label={`${cs.headlineStat!.value}: ${cs.headlineStat!.label}`}
          className="group flex flex-col gap-1 border-b border-l border-rule px-5 py-6 transition-colors duration-150 first:border-l-0 hover:bg-wash focus-visible:bg-wash md:border-b-0"
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
