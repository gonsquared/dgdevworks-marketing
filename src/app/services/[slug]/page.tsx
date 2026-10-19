import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { Section } from "@/components/ui/Section";
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

      <Section size="loose">
        <BackLink href="/services" label="Services" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="heading-display">{service.title}</h1>
            <p className="text-body-lead text-text-secondary mt-6">{service.summary}</p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-panel border border-border bg-surface p-7 shadow-panel md:p-8 lg:sticky lg:top-24">
              <p className="font-figure text-[clamp(1.75rem,1.3rem+1.2vw,2.25rem)] text-text-primary">
                {service.priceLabel}
              </p>
              {pricingPackage && <p className="text-ui text-text-secondary mt-3">{pricingPackage.timeframe}</p>}
              <Button href={bookingUrl} external variant="solid" size="lg" className="mt-7 w-full">
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section bleed className="bg-surface-sunken">
        <h2 className="heading-h2">How it runs</h2>
        <div className="mt-12">
          <Figure variant="phase-track" steps={service.process} />
        </div>
      </Section>

      <Section>
        <h2 className="heading-h2">What&apos;s included</h2>
        <ul className="mt-12 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          {service.includes.map((item) => (
            <li key={item} className="text-body text-text-secondary flex gap-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mt-1.5 size-4 shrink-0 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0 md:pt-0">
        <figure>
          <blockquote className="text-voice max-w-[28ch] text-[clamp(1.75rem,1.1rem+2.4vw,3rem)]">
            &ldquo;{service.idealClient}&rdquo;
          </blockquote>
          <figcaption className="text-ui text-text-secondary mt-5">Who this is for</figcaption>
        </figure>
      </Section>

      {relatedCaseStudies.length > 0 && (
        <Section bleed className="bg-surface-sunken">
          <h2 className="heading-h2">Proof this works</h2>
          <div className="mt-10 md:mt-12">
            {relatedCaseStudies.map((caseStudy) => (
              <IndexRow
                key={caseStudy.slug}
                href={`/work/${caseStudy.slug}`}
                title={caseStudy.title}
                summary={caseStudy.challenge}
                meta={caseStudy.headlineStat?.value}
              />
            ))}
          </div>
        </Section>
      )}

      <ClosingRecord />
    </>
  );
}
