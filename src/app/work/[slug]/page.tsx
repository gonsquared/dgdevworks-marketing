import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { Button } from "@/components/ui/Button";
import { AbstractVisual } from "@/components/AbstractVisual";
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

      <Section className="pt-14 pb-0">
        <SpecLabel>CASE STUDY</SpecLabel>
        <h1 className="heading-display mt-3">{caseStudy.title}</h1>
        <div className="card-bracket mt-8 aspect-[16/7] w-full overflow-hidden rounded-xl border border-border">
          <AbstractVisual variant={caseStudy.slug} label={`${caseStudy.title} illustrative graphic`} />
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <ScrollReveal>
            <h2 className="heading-h3">Challenge</h2>
            <p className="text-body text-text-secondary mt-3">{caseStudy.challenge}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="heading-h3">Approach</h2>
            <p className="text-body text-text-secondary mt-3">{caseStudy.approach}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="heading-h3">Impact</h2>
            <div className="card-bracket mt-3 flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
              {caseStudy.impact.map((stat) => (
                <p key={stat} className="text-body text-text-secondary flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ▸
                  </span>
                  <span>{stat}</span>
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {relatedServices.length > 0 && (
        <Section className="bg-surface">
          <SpecLabel>RELATED SERVICE</SpecLabel>
          <h2 className="heading-h2 mt-3">The service this proves</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-md border border-border-strong px-5 py-3 text-ui text-text-primary hover:border-accent hover:text-accent"
              >
                {service.title} →
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section className="text-center">
        <p className="text-body text-text-secondary">Interested in something similar?</p>
        <Button href={getBookingUrl()} external className="mt-4" size="lg">
          Book a call
        </Button>
      </Section>
    </>
  );
}
