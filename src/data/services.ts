import type { Service } from "./types";

/**
 * The four DG DevWorks service offerings. Source of truth for /services,
 * /services/[slug], home page overview, and Service JSON-LD (E4-F3-S2).
 *
 * relatedCaseStudySlugs mirrors the primary/secondary service-link mapping
 * table in docs/superpowers/specs/2026-08-18-dgdevworks-marketing-site-design.md.
 */
export const services: Service[] = [
  {
    slug: "mvp-development",
    title: "MVP / Product Build",
    summary:
      "A full-stack build from idea to shipped product. Frontend, backend, database, and deployment, all handled end to end by one software engineer.",
    situation: "I have an idea and no code yet.",
    includes: [
      "Technical scoping and architecture plan before any code is written",
      "Full-stack build: frontend, backend, database schema, and deployment pipeline",
      "Authentication, core business logic, and integrations for your product's critical path",
      "Weekly progress demos so you're never guessing at status",
      "Handoff docs and a clean, maintainable codebase you actually own",
    ],
    process: [
      "Scoping call to define the leanest version of your product that proves the core value",
      "Architecture and technical plan shared before build starts",
      "Iterative build in weekly milestones with live demos",
      "QA pass, deployment, and handoff walkthrough",
    ],
    idealClient:
      "Founders and product teams with a validated idea (or a first customer waiting) who need a working product shipped fast, without hiring a full team first.",
    priceLabel: "Starting at $8,400",
    relatedCaseStudySlugs: ["retail-pos-platform", "stock-exchange-data-migration"],
  },
  {
    slug: "marketing-sites",
    title: "Marketing / Landing Site Build",
    summary:
      "Fast, conversion-focused marketing sites built to sell. This site is the proof of the craft.",
    situation: "I need a site that actually converts.",
    includes: [
      "Conversion-focused copy structure and page flow, not just visual design",
      "Fully responsive, accessible (WCAG-conscious) implementation",
      "SEO fundamentals: metadata, sitemap, structured data from day one",
      "Fast, static-first build with no bloated CMS overhead",
      "Contact/lead-capture wired up and ready to receive inquiries",
    ],
    process: [
      "Discovery call to nail positioning and the pages you actually need",
      "Content and structure plan (site map, page-by-page outline)",
      "Build in a modern framework with performance and SEO baked in",
      "Launch, plus a short post-launch check-in",
    ],
    idealClient:
      "Any business that needs its site to turn visitors into leads or customers, not a generic template, and not a six-week agency process.",
    priceLabel: "$2,500–$3,500",
    relatedCaseStudySlugs: ["hardware-brand-partner-portals"],
  },
  {
    slug: "modernization",
    title: "Legacy Modernization / Migration",
    summary:
      "Migrating aging stacks (PHP, Angular, monoliths, Django, brittle API gateways) to a modern Next.js and microservices foundation.",
    situation: "I have a system that's slow to change and risky to touch.",
    includes: [
      "Audit of the existing system and a phased migration plan that avoids a risky big-bang rewrite",
      "Incremental migration to Next.js / microservices architecture",
      "API gateway and auth modernization where relevant",
      "Performance and query optimization as part of the migration, not an afterthought",
      "Regression coverage so the migration doesn't quietly break existing behavior",
    ],
    process: [
      "Technical audit of the current system and its risk areas",
      "Phased migration roadmap, sequenced to keep the system live throughout",
      "Incremental migration with regression testing at each phase",
      "Cutover, monitoring, and a stabilization period",
    ],
    idealClient:
      "Companies and teams carrying a legacy system that's now the bottleneck: slow to change, risky to touch, or blocking new hires from being productive.",
    priceLabel: "Starting at $5,600 (custom quote)",
    relatedCaseStudySlugs: ["bank-platform-modernization", "stock-exchange-data-migration"],
  },
  {
    slug: "fractional",
    title: "Fractional / Embedded Software Engineer",
    summary:
      "A part-time, ongoing software engineer embedded in your team: code review, mentoring, and Agile/Scrum leadership.",
    situation: "I have a team that needs senior judgment on tap.",
    includes: [
      "Regular code review and architectural guidance for your existing team",
      "Mentoring for junior/mid-level engineers",
      "Agile/Scrum facilitation and delivery leadership",
      "Flexible weekly hours (roughly 10–20 hrs/week) that scale with your needs",
      "Direct async access, no account manager between you and the engineer doing the work",
    ],
    process: [
      "Intro call to understand your team, stack, and current bottlenecks",
      "Lightweight engagement plan (cadence, focus areas, communication channel)",
      "Ongoing weekly involvement: review, mentoring, and delivery support",
      "Monthly check-in to adjust scope as your team's needs change",
    ],
    idealClient:
      "Teams at any stage that need senior-level engineering judgment on tap, without committing to a full-time senior hire.",
    priceLabel: "$2,450–$4,900/mo",
    relatedCaseStudySlugs: ["bank-platform-modernization"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export default services;
