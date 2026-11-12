import type { CaseStudy } from "./types";
import { business } from "./business";

/**
 * Case studies, sourced from the personal portfolio's project case studies
 * (portfolio/src/data/projects.ts and portfolio/src/app/projects/*). Slugs
 * match the portfolio's routes, and fullCaseStudyUrl points to the full
 * write-up there. Keep figures limited to what those write-ups state; don't
 * add metrics that aren't in the source.
 *
 * relatedServiceSlugs and services.ts relatedCaseStudySlugs mirror each other
 * (enforced by tests/unit/data/caseStudies.test.ts).
 */

const PORTFOLIO_URL = business.socialLinks.portfolio.replace(/\/+$/, "");

export const caseStudies: CaseStudy[] = [
  {
    slug: "dg-devteam",
    title: "Designing a Multi-Agent Workflow That Delivers Reviewed, Tested Software",
    context: "Multi-agent development workflow",
    challenge:
      "Without a workflow, an AI agent team can spend a large budget repeating discovery, making incompatible decisions, or handing off code with no clear definition of done. More parallel activity only makes that ambiguity harder to see.",
    approach:
      "Designed DG DevTeam, an open-source agent team for Codex and Claude Code that takes work from a structured backlog to reviewed, tested, and documented delivery. Planning agents turn a brief into a story tracker, architecture decisions, API contracts, and UI direction before any code is written. The tracker then decides whether backend and frontend work can safely run in parallel or must wait on a shared contract, and specialized coding agents work within clear ownership boundaries. QA, code review, documentation, GitHub, and deployment act as sequential gates, and any failure is routed back to the stage responsible for it.",
    impact: [
      "Planned work into explicit stories, contracts, architecture decisions, and UI direction before implementation began",
      "Ran backend and frontend work in parallel only when the dependency structure made it safe",
      "Made QA and code review gates that route findings back to the correct owner, not optional suggestions",
      "Produced a documented, review-ready delivery path from request through deployment",
    ],
    headlineStat: { value: "5", label: "delivery stages, each with a quality gate" },
    tags: ["AI Agents", "Orchestration", "Parallel Workflows", "Quality Gates", "Codex", "Claude Code"],
    image: {
      src: "/work/dg-devteam/primary-delivery-path.svg",
      alt: "DG DevTeam delivery path from brief and planning to shared contracts, parallel implementation, QA and review, and documented release; failures return to the responsible owner.",
      width: 1600,
      height: 920,
    },
    fullCaseStudyUrl: `${PORTFOLIO_URL}/projects/dg-devteam`,
    relatedServiceSlugs: ["fractional", "mvp-development"],
  },
  {
    slug: "n8n-reservation-automation",
    title: "Turning Messenger Conversations into Managed Reservations",
    context: "n8n automation",
    challenge:
      "Guests don't speak in database fields. They ask questions, change their minds, give details out of order, and come back later, yet the business still needs to understand intent, keep progress, and end up with a record it can act on.",
    approach:
      "Designed a reservation system as two coordinated n8n workflows. The first verifies and normalizes incoming Messenger messages, then uses a deterministic decision point to route simple questions to an inquiry path and reservation messages to a stateful booking path. Session state lives in Google Sheets, so a guest can create, cancel, or submit a reservation across several messages. OpenAI is used only where it helps most: extracting booking details from natural language. The second workflow watches for status changes, sends a confirmation or decline through the Meta Graph API, and records that the notification was sent. Approval decisions stay with the business; the automation's job is to communicate them clearly.",
    impact: [
      "Faster answers for repeat inquiries, without routing simple questions through an AI model",
      "Structured reservation data captured from natural conversation",
      "Supported new reservations, cancellations, and pending submissions while preserving state between messages",
      "Traceable notification state that guards against duplicate follow-ups and eases support",
    ],
    headlineStat: { value: "2", label: "coordinated workflows" },
    tags: ["n8n", "Meta Messenger", "OpenAI", "Google Sheets", "Graph API", "Workflow Automation"],
    image: {
      src: "/work/n8n-reservation-automation/workflow-overview.png",
      alt: "The reservation and inquiry workflow above the reservation status notification workflow in n8n.",
      width: 1672,
      height: 941,
    },
    fullCaseStudyUrl: `${PORTFOLIO_URL}/projects/n8n-reservation-automation`,
    relatedServiceSlugs: ["mvp-development"],
  },
  {
    slug: "moments-cafe-wordpress",
    title: "Building a Cafe Website the Owner Can Actually Run",
    context: "WordPress custom theme",
    challenge:
      "Small hospitality businesses usually get a generic template that looks like every other cafe, or a custom build they can't update without calling a developer. Neither holds up once the hours change or a holiday announcement is needed.",
    approach:
      "Designed and built Moments Cafe as a hand-coded classic WordPress theme: no page builder, no plugins, and no front-end framework. The editorial, photography-led design covers the menu, the cafe's story, and visit details. A dedicated Cafe Details panel in the WordPress Customizer lets the owner edit the announcement bar, address, phone, email, opening hours, and reservation link with a live preview. Every value is sanitized when saved and escaped when rendered. The theme ships one stylesheet and one small script, includes a skip link and an accessible mobile menu, respects reduced-motion settings, and runs locally with a single Docker Compose command.",
    impact: [
      "A distinctive, photography-led brand site instead of a reused template",
      "Day-to-day details the owner can update from the WordPress dashboard, with no developer needed",
      "A responsive, accessible layout that holds up from large desktops to small phones",
      "A small, readable codebase another developer can pick up quickly",
    ],
    headlineStat: { value: "7", label: "owner-editable details, no developer needed" },
    tags: ["WordPress", "PHP", "Custom Theme", "Customizer API", "CSS", "Responsive Design", "Docker"],
    image: {
      src: "/work/moments-cafe-wordpress/site-hero.jpg",
      alt: 'The Moments Cafe homepage: an announcement bar, navigation, and the headline "Take your time. Taste the moment." over a photo of a latte and croissant in a softly lit cafe.',
      width: 2000,
      height: 1125,
    },
    fullCaseStudyUrl: `${PORTFOLIO_URL}/projects/moments-cafe-wordpress`,
    relatedServiceSlugs: ["marketing-sites"],
  },
  {
    slug: "dgdevworks-marketing",
    title: "Building This Site: A Static Marketing Site Planned and Shipped by an Agent Team",
    context: "Next.js marketing site",
    challenge:
      "A one-person engineering practice needed a credible, fast marketing site that explains its services, shows real proof of work, and turns visitors into calls or messages, without a backend, database, or CMS to maintain.",
    approach:
      "Planned the site with the DG DevTeam agent workflow: a brief became a tracker of 6 epics and 43 user stories, a design system, and an API contract before any code was written, and each story passed QA and code review before it counted as done. The site is a Next.js 16 static export with every page pre-rendered from typed content files, so there's no server to run. A \"spec sheet\" design system with light and dark themes sets the look, with the theme applied before first paint so it never flashes. The contact form posts straight from the browser to a Discord webhook, with client-side validation, a honeypot, and friendly rate-limit handling. Every route gets its own metadata, Open Graph image, sitemap entry, and JSON-LD, and the test suite covers components, data, SEO, and accessibility with Vitest and Playwright.",
    impact: [
      "14 pages pre-rendered as static files, with no backend, database, or CMS to maintain",
      "A working contact form and booking flow with no server, plus a privacy policy that matches what the site actually does",
      "Per-route metadata, Open Graph images, sitemap, and structured data for search and answer engines",
      "Automated axe accessibility scans on every page, alongside unit, component, and end-to-end tests",
    ],
    headlineStat: { value: "43", label: "user stories, planned and shipped by an agent team" },
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Static Export", "Vitest", "Playwright", "DG DevTeam"],
    image: {
      src: "/work/dgdevworks-marketing/desktop-home.jpg",
      alt: "The DG DevWorks home page on desktop: the “From Ideas to Solutions.” masthead, the positioning statement, and a practice summary panel.",
      width: 2000,
      height: 1125,
    },
    screenshots: {
      desktop: [
        {
          src: "/work/dgdevworks-marketing/desktop-home.jpg",
          alt: "The DG DevWorks home page on desktop: the “From Ideas to Solutions.” masthead, the positioning statement, and a practice summary panel.",
          width: 2000,
          height: 1125,
          caption: "Home",
        },
        {
          src: "/work/dgdevworks-marketing/desktop-work.jpg",
          alt: "The Work page on desktop: a featured case study with its headline stat, followed by the rest of the case study list.",
          width: 2000,
          height: 1125,
          caption: "Work",
        },
        {
          src: "/work/dgdevworks-marketing/desktop-contact.jpg",
          alt: "The Contact page on desktop: the contact form with its privacy notice beside a Book a call panel and FAQ.",
          width: 2000,
          height: 1125,
          caption: "Contact",
        },
      ],
      mobile: [
        {
          src: "/work/dgdevworks-marketing/mobile-home.jpg",
          alt: "The DG DevWorks home page on a phone, showing the masthead and Book a call button.",
          width: 780,
          height: 1688,
          caption: "Home",
        },
        {
          src: "/work/dgdevworks-marketing/mobile-menu.jpg",
          alt: "The mobile navigation panel open on a phone, listing every page plus the call and message buttons.",
          width: 780,
          height: 1688,
          caption: "Navigation",
        },
        {
          src: "/work/dgdevworks-marketing/mobile-contact.jpg",
          alt: "The full contact form on a phone: name, email, and message fields, the privacy notice, and the Send message and Email me buttons.",
          width: 780,
          height: 1688,
          caption: "Contact",
        },
      ],
    },
    liveUrl: "https://marketing.dgdevworks.com",
    sourceUrl: "https://github.com/gonsquared/dgdevworks-marketing",
    fullCaseStudyUrl: `${PORTFOLIO_URL}/projects/dgdevworks-marketing`,
    relatedServiceSlugs: ["marketing-sites"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export default caseStudies;
