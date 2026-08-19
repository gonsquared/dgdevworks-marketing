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

      <Section size="loose" rule="bottom">
        <h1 className="heading-display">Pricing</h1>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
          Every engagement starts with a scoping call. The figures below are the range real projects
          of that type tend to land in.
        </p>

        <div className="mt-8 border-t border-rule pt-4">
          <p className="text-ui text-text-secondary">
            Hourly rate: <span className="font-mono-figure text-accent align-middle">${pricing.hourlyRate}/hr</span>
          </p>
        </div>
      </Section>

      <Section rule="bottom">
        <PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />

        <p className="text-ui text-text-secondary mt-8 max-w-2xl">
          All figures on this page are{" "}
          <strong className="text-text-primary">indicative, pending a scoping call</strong>. Actual pricing
          stays flexible and depends on the scope of your project, not a locked-in quote.
        </p>
      </Section>

      <Section rail={{ number: "01", label: "FAQ" }}>
        <h2 className="heading-h2">Pricing questions</h2>
        <FAQAccordion items={pricingFaq} className="mt-8" />
      </Section>

      <ClosingRecord />
    </>
  );
}
