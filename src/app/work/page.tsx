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
    "Case studies of a multi-agent AI development workflow, an n8n Messenger reservation automation, and a custom WordPress cafe site, built by DG DevWorks.",
  path: "/work",
});

const LEAD_CASE_STUDY_SLUG = "dg-devteam";

export default function WorkIndexPage() {
  const leadCaseStudy = getCaseStudyBySlug(LEAD_CASE_STUDY_SLUG)!;
  const otherCaseStudies = caseStudies.filter((cs) => cs.slug !== LEAD_CASE_STUDY_SLUG);

  return (
    <>
      <Section size="loose" rule="bottom">
        <h1 className="heading-display">Work</h1>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
          Projects I&apos;ve designed and built end to end, from AI agent workflows to automation and
          websites. Each one covers the challenge, the approach, and the result, with a link to the full
          write-up on my portfolio.
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
