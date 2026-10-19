import Link from "next/link";
import { caseStudies } from "@/data/caseStudies";

/**
 * The home page's trust layer, set as one running statement in display type
 * instead of a row of stat tiles. Each figure is pulled directly from
 * caseStudies[].headlineStat and links to its source case study.
 */
export function ProofStrip() {
  const stats = caseStudies.filter((cs) => cs.headlineStat);

  return (
    <p className="font-heading max-w-[28ch] text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] leading-[1.14] font-medium tracking-[-0.028em] text-text-secondary sm:max-w-[34ch] md:max-w-[44ch] lg:max-w-[52ch]">
      {stats.map((cs) => (
        <span key={cs.slug}>
          <Link
            href={`/work/${cs.slug}`}
            aria-label={`${cs.headlineStat!.value}: ${cs.headlineStat!.label}`}
            className="group rounded-md transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-primary"
          >
            <span aria-hidden="true">
              <span className="font-figure text-accent">{cs.headlineStat!.value}</span>{" "}
              <span>{cs.headlineStat!.label}</span>
              <span className="text-text-tertiary">.</span>
            </span>
          </Link>{" "}
        </span>
      ))}
    </p>
  );
}
