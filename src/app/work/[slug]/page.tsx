import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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

      <Section size="loose" rule="bottom">
        <h1 className="heading-display">{caseStudy.title}</h1>
        {caseStudy.headlineStat && (
          <div className="mt-8 flex items-baseline gap-4 border-t border-rule pt-6">
            <p className="font-mono-figure text-accent">{caseStudy.headlineStat.value}</p>
            <p className="text-ui text-text-secondary">{caseStudy.headlineStat.label}</p>
          </div>
        )}
      </Section>

      <Section rule="bottom">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <h2 className="heading-h3">Challenge</h2>
              <p className="text-body text-text-secondary mt-3">{caseStudy.challenge}</p>
              <h2 className="heading-h3 mt-8">Approach</h2>
              <p className="text-body text-text-secondary mt-3">{caseStudy.approach}</p>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.05}>
              <h2 className="heading-h3">Impact</h2>
              <ul className="mt-3 flex flex-col gap-3 border-t border-rule pt-3">
                {caseStudy.impact.map((stat) => (
                  <li key={stat} className="text-body text-text-secondary flex gap-3 border-b border-rule pb-3">
                    <span aria-hidden="true" className="text-accent">
                      —
                    </span>
                    <span>{stat}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {relatedServices.length > 0 && (
        <Section rail={{ number: "01", label: "RELATED SERVICE" }}>
          <h2 className="heading-h2">The service this proves</h2>
          <div className="mt-8">
            {relatedServices.map((service, index) => (
              <IndexRow
                key={service.slug}
                href={`/services/${service.slug}`}
                index={String(index + 1).padStart(2, "0")}
                title={service.title}
                summary={service.summary}
                meta={service.priceLabel}
              />
            ))}
          </div>
        </Section>
      )}

      <Section rule="top">
        <p className="text-body text-text-secondary">Recognize a challenge like this in your own stack?</p>
        <Button href={getBookingUrl()} external className="mt-4" size="lg">
          Book a call
        </Button>
      </Section>
    </>
  );
}
