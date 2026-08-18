import type { CaseStudy } from "./types";

/**
 * Employer projects reframed as case studies (challenge/approach/impact),
 * written without confidential specifics — no proprietary UI screenshots,
 * no internal system names beyond what's already public, no client data.
 *
 * relatedServiceSlugs mirrors the primary/secondary service-link mapping
 * table in the approved design spec.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "bank-platform-modernization",
    title: "Modernizing a Regulated Bank's API and Application Layer",
    challenge:
      "A regulated banking platform was running on an aging API gateway and a monolithic application layer. Every change carried compliance risk, releases were slow, and the team needed a path off legacy infrastructure without disrupting a live, regulated system.",
    approach:
      "Led the migration of the API management layer from a legacy gateway to Azure API Management, and incrementally refactored the monolith toward a Next.js and microservices architecture. Introduced JWT-based auth and Key Vault–backed secrets management to tighten the security posture as part of the migration, sequencing the work in phases so the platform stayed live and compliant throughout. Also served as Scrum Lead, running the delivery process for the team executing the migration.",
    impact: [
      "Migrated API management to Azure APIM with zero unplanned downtime",
      "Reduced release risk by decomposing the monolith into independently deployable services",
      "Strengthened the security posture with JWT auth and centralized secrets management",
      "Kept delivery on track via Scrum leadership across a multi-phase migration",
    ],
    relatedServiceSlugs: ["modernization", "fractional"],
  },
  {
    slug: "hardware-brand-partner-portals",
    title: "Rebuilding a Global Hardware Brand's Partner and Developer Portals",
    challenge:
      "A global hardware brand's partner and developer-facing portals ran on an aging PHP/Drupal stack that was slow to update, difficult to internationalize, and falling short on accessibility and SEO fundamentals for a global developer audience.",
    approach:
      "Rebuilt the portals on Next.js, adding internationalization and GeoIP-based localization so content served the right audience in the right language automatically. Brought the markup and interaction patterns up to WCAG accessibility standards and rebuilt the metadata/SEO layer for better discoverability, all while preserving the existing content the partner and developer communities relied on.",
    impact: [
      "Migrated two production portals from PHP/Drupal to Next.js with no content loss",
      "Added i18n and GeoIP localization for a global developer audience",
      "Brought markup up to WCAG accessibility standards",
      "Rebuilt SEO fundamentals (metadata, structured markup) for better discoverability",
    ],
    relatedServiceSlugs: ["marketing-sites"],
  },
  {
    slug: "retail-pos-platform",
    title: "Shipping Features Under Enterprise QA Rigor for a POS Platform",
    challenge:
      "A global electronics manufacturer's point-of-sale platform needed new features shipped against enterprise-grade quality bars, plus real internationalization (including Arabic RTL layouts) — all without regressing a system retailers depend on at the register.",
    approach:
      "Delivered full-stack feature work on the POS platform while optimizing frontend performance for in-store hardware constraints. Implemented RTL layout support and localization for Arabic and Spanish markets, and expanded the automated regression suite using Cypress and Cucumber so new features shipped with confidence rather than manual re-testing.",
    impact: [
      "Shipped new POS features with measurable frontend performance gains",
      "Delivered full RTL layout support for Arabic, plus Spanish localization",
      "Expanded Cypress/Cucumber regression coverage, reducing manual QA cycles",
    ],
    relatedServiceSlugs: ["mvp-development"],
  },
  {
    slug: "stock-exchange-data-migration",
    title: "Migrating a Real-Time Stock Data Product off Django",
    challenge:
      "A regional stock exchange data product was built on Django and PostgreSQL, with a real-time feed parser that was becoming a bottleneck as query volume grew. The stack needed to move to a more scalable foundation without interrupting a live, time-sensitive data product.",
    approach:
      "Led the migration from Django/PostgreSQL to a MERN (MongoDB, Express, React, Node) stack, rebuilding the exchange's live feed parser on the new stack and re-architecting the data layer for the query patterns the product actually needed.",
    impact: [
      "Migrated a live real-time data product from Django/PostgreSQL to MERN with no service interruption",
      "Rebuilt the exchange's live feed parser on the new stack",
      "Achieved a 40% improvement in query performance after migration",
    ],
    relatedServiceSlugs: ["mvp-development", "modernization"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export default caseStudies;
