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
    slug: "crm-platform-hardening",
    title: "Hardening a CRM for Secure, Reliable Daily Operations",
    challenge:
      "A growing CRM needed stronger security boundaries, more dependable contact and deal workflows, and a deployment foundation that could support continued product development without putting customer data or operational continuity at risk.",
    approach:
      "Secured the application by removing exposed credentials, restricting CORS, adding rate limits and security headers, and separating administrative credentials from browser access. Built a configurable Kanban pipeline, a timezone-safe meeting calendar, and attention-focused dashboards; strengthened contact integrity with server-validated duplicate checks, reversible archiving, and complete history; and added Alembic migrations, database-isolation checks, backup scripts, an API contract matrix, and a deployment verification runbook.",
    impact: [
      "Established 527 isolated Pytest tests across backend behavior and data boundaries",
      "Added frontend unit coverage and 43 Playwright end-to-end specifications",
      "Reduced security exposure with credential isolation, restricted CORS, rate limiting, and security headers",
      "Made deployment and recovery repeatable with migrations, backups, contract checks, and a verification runbook",
    ],
    headlineStat: { value: "527", label: "isolated backend tests" },
    relatedServiceSlugs: ["mvp-development", "modernization"],
  },
  {
    slug: "network-data-integration",
    title: "Connecting Network Data Across Enterprise Platforms",
    challenge:
      "A network-management application depended on data spread across ServiceNow, GraphQL services, and local tooling. Engineers needed reliable synchronization, faster UI access, and a repeatable local environment while services were moving from proprietary systems to third-party platforms.",
    approach:
      "Built and maintained Apache Airflow DAGs that consumed GraphQL query results and synchronized them to a local MongoDB cache. Designed GraphQL queries and APIs as an integration layer between ServiceNow and internal applications, migrated services while preserving compatibility with existing workflows, and automated local setup with shell scripts, Docker containers, and reusable command-line tooling.",
    impact: [
      "Improved data availability and enabled faster UI access through a synchronized local cache",
      "Reduced direct system dependencies with a GraphQL integration layer",
      "Enabled new engineers to establish functional development environments within their first week of access",
      "Reduced repetitive operational work through reusable command-line automation",
    ],
    headlineStat: { value: "1 week", label: "to a functional local environment" },
    relatedServiceSlugs: ["modernization", "fractional"],
  },
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
    headlineStat: { value: "0", label: "unplanned downtime during migration" },
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
    headlineStat: { value: "2", label: "portals migrated, zero content loss" },
    relatedServiceSlugs: ["marketing-sites"],
  },
  {
    slug: "retail-pos-platform",
    title: "Shipping Features Under Enterprise QA Rigor for a POS Platform",
    challenge:
      "A global electronics manufacturer's point-of-sale platform needed new features shipped against enterprise-grade quality bars, plus real internationalization (including Arabic RTL layouts), all without regressing a system retailers depend on at the register.",
    approach:
      "Delivered full-stack feature work on the POS platform while optimizing frontend performance for in-store hardware constraints. Implemented RTL layout support and localization for Arabic and Spanish markets, and expanded the automated regression suite using Cypress and Cucumber so new features shipped with confidence rather than manual re-testing.",
    impact: [
      "Shipped new POS features with measurable frontend performance gains",
      "Delivered full RTL layout support for Arabic, plus Spanish localization",
      "Expanded Cypress/Cucumber regression coverage, reducing manual QA cycles",
    ],
    headlineStat: { value: "2", label: "markets localized (Arabic RTL + Spanish)" },
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
    headlineStat: { value: "40%", label: "faster query performance" },
    relatedServiceSlugs: ["mvp-development", "modernization"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export default caseStudies;
