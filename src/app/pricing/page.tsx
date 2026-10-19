import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PricingTable } from "@/components/PricingTable";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ClosingRecord } from "@/components/ui/ClosingRecord";
import { JsonLd } from "@/components/JsonLd";
import { pricing } from "@/data/pricing";
import { pricingFaq } from "@/data/faq";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Indicative pricing for MVP builds, marketing sites, legacy modernization, and fractional engineering, plus the DG DevWorks hourly rate.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(pricingFaq)} />

      <Section size="loose">
        <h1 className="heading-display">Pricing</h1>
        <p className="text-body-lead text-text-secondary mt-6">
          Every engagement starts with a scoping call. The figures below reflect where real projects
          of that type typically land.
        </p>
        <p className="text-ui mt-8 inline-flex items-baseline gap-3 rounded-full bg-accent-soft px-5 py-2 text-accent">
          <span>Hourly rate</span>
          <span className="font-figure text-2xl">${pricing.hourlyRate}/hr</span>
        </p>
      </Section>

      <Section className="pt-0 md:pt-0">
        <PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />

        <p className="text-ui text-text-secondary mt-10 max-w-2xl">
          All figures on this page are{" "}
          <strong className="text-text-primary">indicative, pending a scoping call</strong>. Actual pricing
          stays flexible and depends on the scope of your project, not a locked-in quote.
        </p>
      </Section>

      <Section bleed className="bg-surface-sunken">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <h2 className="heading-h2 lg:col-span-4">Pricing questions</h2>
          <div className="lg:col-span-8">
            <FAQAccordion items={pricingFaq} />
          </div>
        </div>
      </Section>

      <ClosingRecord />
    </>
  );
}
