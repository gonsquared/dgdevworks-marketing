import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { PricingCard } from "@/components/PricingCard";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CTABand } from "@/components/ui/CTABand";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { pricing } from "@/data/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Product builds and marketing sites for startup founders",
  description:
    "Daryll, senior full-stack engineer, builds MVPs, marketing sites, legacy modernizations, and fractional engineering engagements for startup founders.",
  path: "",
});

export default function HomePage() {
  return (
    <>
      <Section className="pt-6 pb-0 md:pt-8">
        <Hero />
      </Section>

      <Section>
        <SpecLabel>§01 · SERVICES</SpecLabel>
        <h2 className="heading-h2 mt-3">What I help founders build</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ScrollReveal key={service.slug} delay={index * 0.05}>
              <ServiceCard service={service} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SpecLabel>§02 · PROOF OF WORK</SpecLabel>
        <h2 className="heading-h2 mt-3">Shipped in production, not just planned</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((caseStudy, index) => (
            <ScrollReveal key={caseStudy.slug} delay={index * 0.05}>
              <CaseStudyCard caseStudy={caseStudy} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/work" className="text-ui text-accent hover:text-accent-hover">
            See all case studies →
          </Link>
        </div>
      </Section>

      <Section>
        <SpecLabel>§03 · PRICING</SpecLabel>
        <h2 className="heading-h2 mt-3">Indicative pricing, pending a scoping call</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.packages.map((pkg) => (
            <PricingCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/pricing" className="text-ui text-accent hover:text-accent-hover">
            See full pricing details →
          </Link>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
