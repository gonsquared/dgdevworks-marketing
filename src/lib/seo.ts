import type { Metadata } from "next";
import { getSiteUrl } from "./env";
import { business } from "@/data/business";
import type { CaseStudy, FAQItem, Service } from "@/data/types";

export interface RouteMetadataInput {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/services/mvp-development". Use "" for the root. */
  path: string;
}

/** Builds a unique, canonical-URL-bearing Metadata object for a single route. */
export function buildMetadata({ title, description, path }: RouteMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${business.brandName}`;

  return {
    // `absolute` bypasses the root layout's title template (which already
    // appends the brand name) so the brand name isn't doubled up.
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: business.brandName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/** Sitewide Person/ProfessionalService JSON-LD, injected once in the root layout. */
export function personProfessionalServiceJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Daryll",
        url: siteUrl,
        jobTitle: "Software Engineer",
        sameAs: [business.socialLinks.linkedin, business.socialLinks.github, business.socialLinks.portfolio],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#business`,
        name: business.brandName,
        url: siteUrl,
        description: business.positioningCopy,
        email: business.contactEmail,
        founder: { "@id": `${siteUrl}/#person` },
        sameAs: [business.socialLinks.linkedin, business.socialLinks.github],
      },
    ],
  };
}

/** Service JSON-LD for a single /services/[slug] page. */
export function serviceJsonLd(service: Service) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      description: service.priceLabel,
    },
    url: `${siteUrl}/services/${service.slug}`,
  };
}

/** FAQPage JSON-LD — content must match the visible FAQAccordion exactly. */
export function faqPageJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Lightweight CreativeWork/Article-style JSON-LD for case study pages (supplements Person/ProfessionalService). */
export function caseStudyJsonLd(caseStudy: CaseStudy) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: caseStudy.title,
    about: caseStudy.challenge,
    author: { "@id": `${siteUrl}/#person` },
    url: `${siteUrl}/work/${caseStudy.slug}`,
  };
}
