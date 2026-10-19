import Link from "next/link";
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
 * One dominant case-study panel — used once per page (home, work index)
 * alongside IndexRow for the remaining case studies. The headline stat sits
 * in a pill above the title rather than as a hero number; the whole panel is
 * a single stretched link.
 */
export function CaseStudyLead({ caseStudy, headingLevel = 3 }: CaseStudyLeadProps) {
  const stat = caseStudy.headlineStat;
  const Tag = HeadingTag[headingLevel];

  return (
    <article className="group relative overflow-hidden rounded-panel border border-border bg-surface p-7 shadow-panel transition-[box-shadow,transform] duration-300 ease-out motion-reduce:transition-none md:p-12 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-lift">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          {stat && (
            <p className="text-ui inline-flex items-baseline gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-accent">
              <span className="font-figure text-lg">{stat.value}</span>
              <span>{stat.label}</span>
            </p>
          )}
          <Tag className="heading-h2 mt-6">{caseStudy.title}</Tag>
          <p className="text-body-lead text-text-secondary mt-5">{caseStudy.challenge}</p>
        </div>

        <div className="flex items-end lg:col-span-4 lg:justify-end">
          <Link
            href={`/work/${caseStudy.slug}`}
            aria-label={`Read the case study: ${caseStudy.title}`}
            className="text-ui inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3.5 text-accent-on-fill transition-[background-color,transform] duration-150 active:scale-[0.97] motion-reduce:active:scale-100 after:absolute after:inset-0 after:content-[''] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover"
          >
            <span aria-hidden="true">Read the case study</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
