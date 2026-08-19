import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ClosingRecord } from "@/components/ui/ClosingRecord";
import { IndexRow } from "@/components/ui/IndexRow";
import { Figure } from "@/components/ui/Figure";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { services, getServiceBySlug } from "@/data/services";
import { getCaseStudyBySlug } from "@/data/caseStudies";
import { pricing } from "@/data/pricing";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { getBookingUrl } from "@/lib/env";

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
  const pricingPackage = pricing.packages.find((pkg) => pkg.slug === service.slug);
  const bookingUrl = getBookingUrl();

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <Section size="loose" rule="bottom">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="heading-display">{service.title}</h1>
            <p className="text-body-lead text-text-secondary mt-4">{service.summary}</p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24">
              <p className="font-mono-figure text-accent">{service.priceLabel}</p>
              {pricingPackage && <p className="text-ui text-text-secondary mt-1">{pricingPackage.timeframe}</p>}
              <Button href={bookingUrl} external variant="solid" size="lg" className="mt-6 w-full">
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section rule="bottom">
        <h2 className="heading-h2">Process</h2>
        <div className="mt-8">
          <Figure variant="phase-track" steps={service.process} />
        </div>
      </Section>

      <Section rule="bottom">
        <h2 className="heading-h2">What&apos;s included</h2>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {service.includes.map((item) => (
            <li key={item} className="text-body text-text-secondary flex gap-3 border-t border-rule pt-4">
              <span aria-hidden="true" className="text-accent">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section rule="bottom">
        <ScrollReveal>
          <p className="text-voice text-2xl md:text-3xl">&ldquo;{service.idealClient}&rdquo;</p>
          <p className="font-mono-annotation text-text-secondary mt-4">IDEAL CLIENT</p>
        </ScrollReveal>
      </Section>

      {relatedCaseStudies.length > 0 && (
        <Section rail={{ number: "01", label: "RELATED WORK" }}>
          <h2 className="heading-h2">Proof this works</h2>
          <div className="mt-8">
            {relatedCaseStudies.map((caseStudy, index) => (
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
      )}

      <ClosingRecord />
    </>
  );
}
