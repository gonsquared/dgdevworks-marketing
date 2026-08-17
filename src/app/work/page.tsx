import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { caseStudies } from "@/data/caseStudies";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Case studies from regulated banking, global hardware, and fintech platforms — reframed proof of the engineering behind DG DevWorks.",
  path: "/work",
});

export default function WorkIndexPage() {
  return (
    <Section className="pt-14">
      <SpecLabel>§00 — CASE STUDIES</SpecLabel>
      <h1 className="heading-display mt-3">Work</h1>
      <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
        Employer projects, reframed as proof of work — challenge, approach, and impact, without
        confidential specifics.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {caseStudies.map((caseStudy, index) => (
          <ScrollReveal key={caseStudy.slug} delay={index * 0.05}>
            <CaseStudyCard caseStudy={caseStudy} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
