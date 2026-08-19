import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { ProofStrip } from "@/components/ProofStrip";
import { CaseStudyLead } from "@/components/CaseStudyLead";
import { PricingTable } from "@/components/PricingTable";
import { IndexRow } from "@/components/ui/IndexRow";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ClosingRecord } from "@/components/ui/ClosingRecord";
import { services } from "@/data/services";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { pricing } from "@/data/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Product builds and marketing sites for startup founders",
  description:
    "Daryll, software engineer, builds MVPs, marketing sites, legacy modernizations, and fractional engineering engagements for startup founders.",
  path: "",
});

const LEAD_CASE_STUDY_SLUG = "stock-exchange-data-migration";

export default function HomePage() {
  const leadCaseStudy = getCaseStudyBySlug(LEAD_CASE_STUDY_SLUG)!;
  const otherCaseStudies = caseStudies.filter((cs) => cs.slug !== LEAD_CASE_STUDY_SLUG);

  return (
    <>
      <Section size="loose" rule="bottom">
        <Masthead />
      </Section>

      <Section bare rule="bottom">
        <ProofStrip />
      </Section>

      <Section rail={{ number: "01", label: "SERVICES" }}>
        <h2 className="heading-h2">What I help founders build</h2>
        <div className="mt-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.slug} delay={index * 0.035}>
              <IndexRow
                href={`/services/${service.slug}`}
                index={String(index + 1).padStart(2, "0")}
                title={service.title}
                summary={service.summary}
                meta={service.priceLabel}
              />
            </ScrollReveal>
          ))}
        </div>
        <Link href="/services" className="text-ui text-accent mt-6 inline-block hover:text-accent-hover">
          See every service →
        </Link>
      </Section>

      <Section rule="top" rail={{ number: "02", label: "PROOF OF WORK" }}>
        <h2 className="heading-h2">Shipped in production, not just planned</h2>
        <div className="mt-2">
          <CaseStudyLead caseStudy={leadCaseStudy} />
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

      <Section rule="top" rail={{ number: "03", label: "PRICING" }}>
        <h2 className="heading-h2">Indicative pricing, pending a scoping call</h2>
        <div className="mt-8">
          <PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />
        </div>
        <Link href="/pricing" className="text-ui text-accent mt-6 inline-block hover:text-accent-hover">
          See full pricing details →
        </Link>
      </Section>

      <ClosingRecord />
    </>
  );
}
