import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceCard } from "@/components/ServiceCard";
import { SpecLabel } from "@/components/ui/SpecLabel";
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
    <Section className="pt-14">
      <SpecLabel>§00 · SERVICES INDEX</SpecLabel>
      <h1 className="heading-display mt-3">Services</h1>
      <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">
        Four ways to work together. Pick the one that matches where your project is right now.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <ScrollReveal key={service.slug} delay={index * 0.05}>
            <ServiceCard service={service} index={index} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
