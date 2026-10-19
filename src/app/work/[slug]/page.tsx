import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { Section } from "@/components/ui/Section";
import { IndexRow } from "@/components/ui/IndexRow";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { getServiceBySlug } from "@/data/services";
import { buildMetadata, caseStudyJsonLd } from "@/lib/seo";
import { getBookingUrl } from "@/lib/env";

interface CaseStudyPageParams {
  slug: string;
}

export function generateStaticParams(): CaseStudyPageParams[] {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

// Static export only supports the 4 slugs enumerated above.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<CaseStudyPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) {
    return buildMetadata({
      title: "Case study not found",
      description: "This case study could not be found.",
      path: `/work/${slug}`,
    });
  }
  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.challenge,
    path: `/work/${caseStudy.slug}`,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<CaseStudyPageParams>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedServices = caseStudy.relatedServiceSlugs
    .map((s) => getServiceBySlug(s))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <>
      <JsonLd data={caseStudyJsonLd(caseStudy)} />

      <Section size="loose">
        <BackLink href="/work" label="Work" />

        <h1 className="heading-display max-w-[20ch]">{caseStudy.title}</h1>
        {caseStudy.headlineStat && (
          <p className="text-ui mt-8 inline-flex items-baseline gap-3 rounded-full bg-accent-soft px-5 py-2 text-accent">
            <span className="font-figure text-2xl">{caseStudy.headlineStat.value}</span>
            <span>{caseStudy.headlineStat.label}</span>
          </p>
        )}
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <h2 className="heading-h3">Challenge</h2>
            <p className="text-body text-text-secondary mt-4">{caseStudy.challenge}</p>
            <h2 className="heading-h3 mt-12">Approach</h2>
            <p className="text-body text-text-secondary mt-4">{caseStudy.approach}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-panel bg-surface-sunken p-7 md:p-9 lg:sticky lg:top-24">
              <h2 className="heading-h3">Impact</h2>
              <ul className="mt-6 flex flex-col gap-5">
                {caseStudy.impact.map((stat) => (
                  <li key={stat} className="text-ui text-text-primary flex gap-3 leading-snug">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                    <span>{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {relatedServices.length > 0 && (
        <Section bleed className="bg-surface-sunken">
          <h2 className="heading-h2">The service this proves</h2>
          <div className="mt-10 md:mt-12">
            {relatedServices.map((service) => (
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
      )}

      <Section>
        <h2 className="heading-h2 max-w-[20ch]">Recognize a challenge like this in your own stack?</h2>
        <Button href={getBookingUrl()} external className="mt-8" size="lg">
          Book a call
        </Button>
      </Section>
    </>
  );
}
