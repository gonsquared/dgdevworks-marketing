import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { PricingCard } from "@/components/PricingCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABand } from "@/components/ui/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { pricing } from "@/data/pricing";
import { pricingFaq } from "@/data/faq";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Indicative pricing for MVP builds, marketing sites, legacy modernization, and fractional engineering — plus the DG DevWorks hourly rate.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(pricingFaq)} />

      <Section className="pt-14 pb-0">
        <SpecLabel>§00 — PRICING</SpecLabel>
        <h1 className="heading-display mt-3">Pricing</h1>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
          Every engagement starts with a scoping call — the figures below are the range real projects
          of that type tend to land in.
        </p>

        <div className="mt-8 rounded-md border border-border-strong bg-surface-sunken px-5 py-3 inline-block">
          <p className="text-ui text-text-secondary">
            Hourly rate:{" "}
            <span className="font-mono-figure text-accent align-middle">${pricing.hourlyRate}/hr</span>
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.packages.map((pkg, index) => (
            <ScrollReveal key={pkg.slug} delay={index * 0.05}>
              <PricingCard pkg={pkg} recommended={index === 0} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 rounded-md border border-accent bg-accent-soft px-5 py-4">
          <p className="text-ui text-text-primary">
            All figures on this page are <strong>indicative, pending a scoping call</strong> — they
            reflect current market rates for senior freelance engineering work, not a locked-in quote.
          </p>
        </div>
      </Section>

      <Section className="bg-surface">
        <SpecLabel>FAQ</SpecLabel>
        <h2 className="heading-h2 mt-3">Pricing questions</h2>
        <FAQAccordion items={pricingFaq} className="mt-8" />
      </Section>

      <CTABand />
    </>
  );
}
