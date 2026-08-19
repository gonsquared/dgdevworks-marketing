import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CTABand } from "@/components/ui/CTABand";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { Surface } from "@/components/ui/Surface";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { JsonLd } from "@/components/JsonLd";
import { services, getServiceBySlug } from "@/data/services";
import { getCaseStudyBySlug } from "@/data/caseStudies";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

interface ServicePageParams {
  slug: string;
}

export function generateStaticParams(): ServicePageParams[] {
  return services.map((service) => ({ slug: service.slug }));
}

// Static export only supports the 4 slugs enumerated above — any other
// slug must 404 at build/dev time rather than attempt on-demand rendering.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ServicePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return buildMetadata({ title: "Service not found", description: "This service could not be found.", path: `/services/${slug}` });
  }
  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<ServicePageParams>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedCaseStudies = service.relatedCaseStudySlugs
    .map((s) => getCaseStudyBySlug(s))
    .filter((cs): cs is NonNullable<typeof cs> => Boolean(cs));

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <Section className="pt-14 pb-0">
        <SpecLabel>SERVICE DETAIL</SpecLabel>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="heading-display">{service.title}</h1>
          <p className="font-mono-figure text-accent">{service.priceLabel}</p>
        </div>
        <p className="text-body-lead text-text-secondary mt-4 max-w-2xl">{service.summary}</p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="heading-h2">What&apos;s included</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {service.includes.map((item) => (
                <li key={item} className="text-body text-text-secondary flex gap-3">
                  <span aria-hidden="true" className="text-accent">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="heading-h2">Process</h2>
            <ol className="mt-6 flex flex-col gap-4">
              {service.process.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono-annotation text-accent shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </Section>

      <Section className="bg-surface">
        <ScrollReveal>
          <Surface variant="panel">
            <h2 className="heading-h3">Ideal client</h2>
            <p className="text-body text-text-secondary mt-3">{service.idealClient}</p>
          </Surface>
        </ScrollReveal>
      </Section>

      {relatedCaseStudies.length > 0 && (
        <Section>
          <SpecLabel>RELATED WORK</SpecLabel>
          <h2 className="heading-h2 mt-3">Proof this works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedCaseStudies.map((caseStudy) => (
              <ScrollReveal key={caseStudy.slug}>
                <CaseStudyCard caseStudy={caseStudy} />
              </ScrollReveal>
            ))}
          </div>
        </Section>
      )}

      <CTABand />
    </>
  );
}
