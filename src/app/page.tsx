import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { ProofStrip } from "@/components/ProofStrip";
import { CaseStudyLead } from "@/components/CaseStudyLead";
import { PricingTable } from "@/components/PricingTable";
import { IndexRow } from "@/components/ui/IndexRow";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { Section } from "@/components/ui/Section";
import { ClosingRecord } from "@/components/ui/ClosingRecord";
import { services } from "@/data/services";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { pricing } from "@/data/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Product builds, modernization, and marketing sites",
  description:
    "Daryll, software engineer, builds MVPs, marketing sites, legacy modernizations, and fractional engineering engagements for companies and teams building, modernizing, or scaling software.",
  path: "",
});

const LEAD_CASE_STUDY_SLUG = "stock-exchange-data-migration";

export default function HomePage() {
  const leadCaseStudy = getCaseStudyBySlug(LEAD_CASE_STUDY_SLUG)!;
  const otherCaseStudies = caseStudies.filter((cs) => cs.slug !== LEAD_CASE_STUDY_SLUG);

  return (
    <>
      <Section size="loose">
        <Masthead />
      </Section>

      <Section size="tight" className="pt-4 md:pt-8">
        <ProofStrip />
      </Section>

      <Section>
        <h2 className="heading-h2 max-w-[18ch]">Pick the situation that sounds like yours</h2>
        <ServicesExplorer services={services} packages={pricing.packages} className="mt-12 md:mt-16" />
        <Link href="/services" className="text-ui text-accent link-underline mt-10 inline-block py-2">
          Compare every service
        </Link>
      </Section>

      <Section>
        <h2 className="heading-h2 max-w-[20ch]">Shipped in production, not just planned</h2>
        <div className="mt-12 md:mt-16">
          <CaseStudyLead caseStudy={leadCaseStudy} />
          <div className="mt-6 md:mt-10">
            {otherCaseStudies.map((caseStudy) => (
              <IndexRow
                key={caseStudy.slug}
                href={`/work/${caseStudy.slug}`}
                title={caseStudy.title}
                summary={caseStudy.challenge}
                meta={caseStudy.headlineStat?.value}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section bleed className="bg-surface-sunken">
        <h2 className="heading-h2 max-w-[20ch]">Indicative pricing, pending a scoping call</h2>
        <div className="mt-12 md:mt-16">
          <PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />
        </div>
        <Link href="/pricing" className="text-ui text-accent link-underline mt-10 inline-block py-2">
          See full pricing details
        </Link>
      </Section>

      <ClosingRecord />
    </>
  );
}
