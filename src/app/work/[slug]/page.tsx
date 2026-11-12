import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BackLink } from "@/components/ui/BackLink";
import { SpecLabel } from "@/components/ui/SpecLabel";
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
        <BackLink href="/work" label="Work" />

        {/* BackLink is inline-flex, so the eyebrow needs its own block line. */}
        <p>
          <SpecLabel>{caseStudy.context.toUpperCase()}</SpecLabel>
        </p>
        <h1 className="heading-display mt-3">{caseStudy.title}</h1>
        {caseStudy.headlineStat && (
          <div className="mt-8 flex items-baseline gap-4 border-t border-rule pt-6">
            <p className="font-mono-figure text-accent">{caseStudy.headlineStat.value}</p>
            <p className="text-ui text-text-secondary">{caseStudy.headlineStat.label}</p>
          </div>
        )}
        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2">
          {caseStudy.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono-annotation rounded-sm border border-rule px-2 py-1 text-text-secondary normal-case tracking-normal"
            >
              {tag}
            </li>
          ))}
        </ul>
        {/* Skip the lead image when the screenshot gallery below already shows it. */}
        {caseStudy.image && !caseStudy.screenshots?.desktop.some((shot) => shot.src === caseStudy.image?.src) && (
          <figure className="mt-10 overflow-hidden rounded-lg border border-rule bg-surface">
            <Image
              src={caseStudy.image.src}
              alt={caseStudy.image.alt}
              width={caseStudy.image.width}
              height={caseStudy.image.height}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full"
            />
          </figure>
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
              <ul className="mt-6 flex flex-col gap-2">
                {[
                  { href: caseStudy.fullCaseStudyUrl, label: "Read the full case study" },
                  ...(caseStudy.liveUrl ? [{ href: caseStudy.liveUrl, label: "Visit the live site" }] : []),
                  ...(caseStudy.sourceUrl ? [{ href: caseStudy.sourceUrl, label: "View the source on GitHub" }] : []),
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ui text-accent hover:text-accent-hover"
                    >
                      {link.label} ↗<span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {caseStudy.screenshots && (
        <Section rule="bottom" rail={{ number: "01", label: "SCREENSHOTS" }}>
          <h2 className="heading-h2">Desktop and mobile</h2>

          <h3 className="heading-h4 mt-10">Desktop</h3>
          <div className="mt-4 grid grid-cols-1 gap-8">
            {caseStudy.screenshots.desktop.map((shot) => (
              <figure key={shot.src}>
                <div className="overflow-hidden rounded-lg border border-rule bg-surface">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    className="h-auto w-full"
                  />
                </div>
                {shot.caption && (
                  <figcaption className="font-mono-annotation text-text-secondary mt-3">{shot.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>

          <h3 className="heading-h4 mt-14">Mobile</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
            {caseStudy.screenshots.mobile.map((shot) => (
              <figure key={shot.src}>
                <div className="overflow-hidden rounded-xl border border-rule bg-surface">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="h-auto w-full"
                  />
                </div>
                {shot.caption && (
                  <figcaption className="font-mono-annotation text-text-secondary mt-3">{shot.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <Section rail={{ number: caseStudy.screenshots ? "02" : "01", label: "RELATED SERVICE" }}>
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
