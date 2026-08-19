import Link from "next/link";
import clsx from "clsx";
import type { CaseStudy } from "@/data/types";

export interface CaseStudyLeadProps {
  caseStudy: CaseStudy;
  /** Semantic heading level for the title — pick based on this block's
   * position in the page's document outline. Defaults to 3, matching
   * IndexRow's convention (one level below a section's h2). */
  headingLevel?: 2 | 3 | 4;
}

const HeadingTag = { 2: "h2", 3: "h3", 4: "h4" } as const;

/**
 * One dominant, full-width editorial case-study block — used once per page
 * (home, work index) alongside IndexRow for the remaining case studies.
 * Renders the headline stat as large mono text rather than a chart, since
 * only some case studies have a real comparable before/after pair.
 */
export function CaseStudyLead({ caseStudy, headingLevel = 3 }: CaseStudyLeadProps) {
  const stat = caseStudy.headlineStat;
  const Tag = HeadingTag[headingLevel];

  return (
    <div className="grid grid-cols-1 gap-6 border-t border-rule py-10 lg:grid-cols-12 lg:gap-10">
      {stat && (
        <div className="lg:col-span-3">
          <p className="font-mono-figure text-accent">{stat.value}</p>
          <p className="text-ui text-text-secondary mt-1">{stat.label}</p>
        </div>
      )}
      <div className={clsx(stat ? "lg:col-span-9" : "lg:col-span-12")}>
        <Tag className="heading-h2">{caseStudy.title}</Tag>
        <p className="text-body-lead text-text-secondary mt-4">{caseStudy.challenge}</p>
        <Link
          href={`/work/${caseStudy.slug}`}
          aria-label={`Read the record for ${caseStudy.title}`}
          className="text-ui text-accent mt-6 inline-block hover:text-accent-hover"
        >
          <span aria-hidden="true">Read the record →</span>
        </Link>
      </div>
    </div>
  );
}
