import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { IndexRow } from "@/components/ui/IndexRow";
import { CaseStudyLead } from "@/components/CaseStudyLead";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Case studies from regulated banking, global hardware, and fintech platforms: reframed proof of the engineering behind DG DevWorks.",
  path: "/work",
});

const LEAD_CASE_STUDY_SLUG = "stock-exchange-data-migration";

export default function WorkIndexPage() {
  const leadCaseStudy = getCaseStudyBySlug(LEAD_CASE_STUDY_SLUG)!;
  const otherCaseStudies = caseStudies.filter((cs) => cs.slug !== LEAD_CASE_STUDY_SLUG);

  return (
    <>
      <Section size="loose" rule="bottom">
        <h1 className="heading-display">Work</h1>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
          Employer projects, reframed as proof of work: challenge, approach, and impact, without
          confidential specifics.
        </p>
      </Section>

      <Section>
        <CaseStudyLead caseStudy={leadCaseStudy} headingLevel={2} />
        <div className="mt-2">
          {otherCaseStudies.map((caseStudy, index) => (
            <ScrollReveal key={caseStudy.slug} delay={index * 0.035}>
              <IndexRow
                href={`/work/${caseStudy.slug}`}
                index={String(index + 1).padStart(2, "0")}
                title={caseStudy.title}
                summary={caseStudy.challenge}
                meta={caseStudy.headlineStat?.value}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>
    </>
  );
}
