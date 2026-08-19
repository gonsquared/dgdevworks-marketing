import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { IndexRow } from "@/components/ui/IndexRow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Four ways to work with DG DevWorks: MVP/product builds, marketing site builds, legacy modernization, and fractional senior engineering.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <Section size="loose" rule="bottom">
        <h1 className="heading-display">Services</h1>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
          Four ways to work together. Pick the one that matches where your project is right now.
        </p>
      </Section>

      <Section rule="bottom">
        <h2 className="font-mono-annotation text-text-secondary">WHICH ONE ARE YOU?</h2>
        <div className="mt-4">
          {services.map((service, index) => (
            <IndexRow
              key={service.slug}
              href={`/services/${service.slug}`}
              index={String(index + 1).padStart(2, "0")}
              title={service.situation ?? service.title}
              summary={`Best fit: ${service.title}`}
            />
          ))}
        </div>
      </Section>

      <Section rail={{ number: "01", label: "ALL SERVICES" }}>
        <h2 className="heading-h2">The full index</h2>
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
      </Section>
    </>
  );
}
