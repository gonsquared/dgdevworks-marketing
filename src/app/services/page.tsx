import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { IndexRow } from "@/components/ui/IndexRow";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { services } from "@/data/services";
import { pricing } from "@/data/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Four ways to work with DG DevWorks: MVP/product builds, marketing site builds, legacy modernization, and fractional engineering.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <Section size="loose">
        <h1 className="heading-display">Services</h1>
        <p className="text-body-lead text-text-secondary mt-6">
          Four ways to work together. Pick the one that matches where your project is right now.
        </p>
      </Section>

      <Section className="pt-0 md:pt-0">
        <h2 className="heading-h2">Which one are you?</h2>
        <ServicesExplorer services={services} packages={pricing.packages} className="mt-12 md:mt-16" />
      </Section>

      <Section bleed className="bg-surface-sunken">
        <h2 className="heading-h2">Compare every service</h2>
        <div className="mt-10 md:mt-12">
          {services.map((service) => (
            <IndexRow
              key={service.slug}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              meta={service.priceLabel}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
