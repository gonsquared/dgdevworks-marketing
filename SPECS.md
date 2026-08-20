# DG DevWorks Marketing Site Specifications

**Version:** 1.1
**Date:** 2026-08-20
**Status:** Active — Sprint 5 complete (Portfolio Disclosure Modal), 5 items carried on backlog (see §7)
**Author/Agent:** docs-agent

Sources: `docs/dev-stories-tracker.md` (6 epics, 43 stories, 137 points), `docs/design-system.md` (design/accessibility spec), `docs/api-contract.md` (external integration contract).

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Tech Stack & Architecture](#6-tech-stack--architecture)
7. [Constraints & Assumptions](#7-constraints--assumptions)
8. [Out of Scope](#8-out-of-scope)
9. [Glossary](#9-glossary)
10. [Revision History](#10-revision-history)

---

## 1. Project Overview

**Description.** DG DevWorks Marketing Site is a fully static, frontend-only Next.js marketing/portfolio site for Daryll G.'s freelance/fractional senior software engineering practice ("DG DevWorks"). It presents four service offerings, four case studies reframed from prior employer work, transparent placeholder pricing, an About/trust page, and a Discord-webhook-backed contact form — all rendered from a typed, CMS-free content layer and pre-rendered to 14 static HTML pages across 11 route templates.

**Problem Statement.** A senior engineer working with startup founders needs a credible, fast, professionally designed web presence that (a) clearly explains what he offers and to whom, (b) demonstrates real proof of work without exposing confidential employer/client detail, (c) is transparent about being a self-directed portfolio project rather than an active agency storefront, and (d) converts interested visitors into booked calls or messages — without standing up a backend, database, or CMS to maintain.

**Solution Summary.** The site is built as a Next.js App Router project with `output: 'export'`, deployed as static files (Vercel). All content (services, case studies, pricing, business/contact facts, FAQ) lives in typed `src/data/*.ts` modules, consumed at build time by page components — there is no runtime data fetching, no database, and no backend API route. The one external integration is a client-side POST to a Discord incoming webhook for contact-form submissions. A light-default/dark-toggle "Spec Sheet / Blueprint" design system, full SEO/AEO/GEO metadata (per-route metadata, sitemap, robots, JSON-LD, Open Graph images), and a sitewide portfolio-disclosure modal (added in Sprint 5) round out the feature set.

---

## 2. Goals & Success Metrics

| Goal | Success Metric | Target |
|---|---|---|
| Convert visiting founders into contact | Contact form submissions + booking-CTA click-throughs | `TODO` — no analytics baseline defined yet; `NEXT_PUBLIC_GA_ID` is wired but no target volume has been set by the business owner |
| Be discoverable by search and answer/LLM engines | Unique metadata, valid sitemap/robots, valid JSON-LD across all 14 routes | 0 duplicate titles/descriptions; 100% JSON-LD schema validation; all 14 routes indexed |
| Ship a credible, accessible, production-quality site | Automated accessibility scan (axe) across all routes | 0 critical/serious violations sitewide (currently **not met** — see §7 known gaps) |
| Demonstrate engineering craft through the build itself | Full automated test coverage (unit + E2E) with a documented CI-equivalent script | 100% of shipped stories backed by passing automated tests, 0 unexplained skips |
| Be transparent that this is a self-directed portfolio, not a live client storefront | Visitors are shown a clear, low-friction one-time disclosure with a path to contact | 1 disclosure impression per browsing session, sitewide, non-blocking |
| Keep the site maintainable with zero backend/infra overhead | Static export builds cleanly and deploys to a CDN-hosted static target | `next build` produces a static export with 0 errors; site deployable to Vercel with no server runtime |

---

## 3. User Personas

### Persona 1 — Startup Founder (Primary)

- **Role:** Non-technical or technically-literate founder/decision-maker at an early-stage startup, evaluating whether to hire a senior engineer for a build, a rescue/modernization, or fractional/embedded work.
- **Goals:** Quickly understand what DG DevWorks offers, judge credibility via real proof of work, understand roughly what it costs, and reach out with minimal friction.
- **Pain Points:** Wary of agencies that oversell and under-deliver; wants a single accountable senior engineer, not a subcontracted team; needs to move fast and doesn't want to hunt for pricing or a way to contact.
- **Key Actions:** Browses Services → matching Service detail → related Case Study → Pricing → Contact (scope-first path), or Work → Case Study → related Service → About → Contact (trust-first path); converts via "Book a call" (reachable from every page's nav) or the `/contact` form.

### Persona 2 — Technical Evaluator / Recruiter (Secondary)

- **Role:** A hiring manager, recruiter, or fellow engineer who lands on the site (e.g., via a shared link or the personal portfolio site) primarily to assess Daryll's technical background and craft, not necessarily to become a paying client.
- **Goals:** Confirm real-world engineering experience (case studies), see evidence of engineering discipline (this site's own spec-first build process, design-system rigor, test coverage), and understand this is a portfolio artifact rather than mistaking it for an active commercial agency.
- **Pain Points:** Needs the site to disclose its own nature quickly and honestly rather than presenting misleading "active client roster" signals; wants to reach Daryll directly without a sales-y funnel.
- **Key Actions:** Reads the Portfolio Disclosure Modal's message on first load, browses About/Work for engineering credibility, may click through to the personal portfolio site or `/contact`.

---

## 4. Functional Requirements

IDs use `REQ-<epic>.<feature>.<seq>`, one requirement per tracker story (story ID given in Notes for full traceability). Priority per the MoSCoW mapping in `docs/dev-stories-tracker.md`: Sprint 1 = **Must Have**, Sprint 2 = **Should Have**, Sprint 3+ = **Could Have**.

### Epic 1: Project Foundation & Design System

#### Feature 1.1 — Project Scaffolding & Configuration

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-1.1.1 | The project SHALL be scaffolded as a Next.js App Router application with TypeScript strict mode enabled and static export (`output: 'export'`) configured, producing a working `next dev` and a zero-error `next build`. | Must Have | Story E1-F1-S1. Done / Pass. |
| REQ-1.1.2 | Tailwind CSS and Framer Motion SHALL be installed and configured for the App Router, with a global stylesheet wired into the root layout and animated components rendering with no hydration errors. | Must Have | Story E1-F1-S2. Done / Pass. |
| REQ-1.1.3 | All required environment variables SHALL be documented in `.env.example` with safe placeholder defaults for required vars and defensive handling for optional vars, accessed via a single typed helper rather than ad hoc `process.env` reads. | Must Have | Story E1-F1-S3. Done / Pass. |

#### Feature 1.2 — Theming & Design Tokens

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-1.2.1 | A light-default / dark-toggle color palette and typography token set SHALL be defined and documented (background, surface, text, border, accent per theme; heading/body/mono type scale), distinct from any other DG DevWorks property's token set. | Must Have | Story E1-F2-S1. Done / Pass. Doc-accuracy caveat: §7's blanket "≥4.5:1 for all pairs" claim over-scopes `text-tertiary`, which does not clear AA — see REQ-1.3.3. |
| REQ-1.2.2 | The site SHALL implement the token set via CSS custom properties resolved by a `data-theme` attribute, defaulting to light with no flash of incorrect theme on load, and SHALL persist the visitor's theme preference across reloads and navigation via an accessible `ThemeToggle`. | Must Have | Story E1-F2-S2. Done / Pass. |
| REQ-1.2.3 | The site SHALL load Inter (body), Space Grotesk (headings, `--font-heading` token), and IBM Plex Mono (pricing figures / small labels / annotations) via `next/font`, wired into Tailwind and the root layout. Space Grotesk is selected specifically to read as **inviting and technical** — its mono-derived skeleton encodes "engineering" into a display face, and its idiosyncratic letterforms give it warmth without resorting to a soft geometric face — rather than the classic-serif register a heading face like Instrument Serif carries. | Must Have | Originally Story E1-F2-S3 (this text superseded that story's build; see REQ-1.2.4–1.2.6 for the subsequent Epic 1/Feature 1.1 "Heading Font Replacement" stories, `docs/dev-stories-tracker.md`, that carried the font through Instrument Serif and then to the current Space Grotesk implementation). Reconciliation note: this requirement previously drifted from the shipped stack twice — first the doc said JetBrains Mono while the site shipped IBM Plex Mono, and separately the doc said Space Grotesk while the site shipped Instrument Serif for headings. As of this revision the text above matches the actual shipped stack exactly. The Space Grotesk heading choice landing back on the original spec value is coincidental: it was arrived at independently this run via story E1-F1-S1's typeface evaluation ("inviting and technical" brief), not a reversion to this REQ. Done / Pass. |
| REQ-1.2.4 | The selection of the heading typeface SHALL be documented with a written rationale evaluating at least 2 Google Font candidates against a defined creative brief, confirming the chosen font's weight range against existing heading/voice CSS classes and its license terms for commercial/portfolio use, before implementation begins. | Must Have | Story E1-F1-S1. Done / Pass — see the Typeface Decision block in `docs/dev-stories-tracker.md` (4 candidates evaluated: Space Grotesk selected, Bricolage Grotesque held in reserve, IBM Plex Sans and Instrument Sans rejected; SIL OFL 1.1 confirmed). |
| REQ-1.2.5 | Every consumer of the heading font (Nav, Footer, Masthead/logotype, and all page heading instances) SHALL be verified to render correctly with the active heading font in both light and dark themes with no layout shift or clipping at existing breakpoints, and any doc comments describing which font a component uses SHALL be kept accurate. | Must Have | Story E1-F1-S3. Done / Pass — `Logotype.tsx` doc comment corrected; OG image generators confirmed font-independent (static `sans-serif`/`monospace`). |
| REQ-1.2.6 | Any change to the heading font SHALL be verified via a full unit/E2E regression run (no new failures) and a fresh accessibility (axe) scan confirming no new color-contrast or legibility violations across affected routes before the change is marked Done. | Must Have | Story E1-F1-S4. Done / Pass — 224/226 unit tests passing (2 pre-existing unrelated failures unchanged), 20/20 E2E axe checks passing across all 14 routes, zero new violations. |

#### Feature 1.3 — Global Layout & Navigation Components

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-1.3.1 | Global navigation and footer UX SHALL be specified with Home/Services/Work/About/Pricing/Contact links, a persistent booking CTA, a responsive mobile menu pattern, and footer contact/social/trust content consistent with the Epic 1 token set. | Must Have | Story E1-F3-S1. Done / Pass. |
| REQ-1.3.2 | A persistent, keyboard- and screen-reader-accessible Nav component SHALL render on all routes, linking to all 6 primary pages, displaying a `NEXT_PUBLIC_BOOKING_URL`-driven booking CTA, an accessible mobile menu, and an active-route indicator. | Must Have | Story E1-F3-S2. Done / Pass. |
| REQ-1.3.3 | A Footer component SHALL render on all routes with contact info, LinkedIn/GitHub/portfolio links (all opened safely), a trust-signal line, and a copyright line, all meeting WCAG AA color contrast (≥4.5:1). | Must Have | Story E1-F3-S3. **In Progress / QA Fail** — the trust-signal/copyright text currently uses `text-text-tertiary`, measured 3.16–3.42:1, below the 4.5:1 AA bar, reproducing on all 14 routes. Remediation owner: frontend-coding-agent. |
| REQ-1.3.4 | A reusable UI primitive library (Button, Card, Section/Container, scroll-reveal animation wrapper) SHALL be built new for this project, fully typed, and documented with usage examples. | Must Have | Story E1-F3-S4. Done / Pass. |

#### Feature 1.4 — Portfolio Disclosure Modal

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-1.4.1 | A sitewide portfolio-disclosure modal UX and accessibility spec SHALL define disclosure copy, trigger timing, session-scoped dismissal persistence (`sessionStorage`, fail-open on error), contact-link target, route scope, and an accessible dialog pattern (`role="dialog"`, `aria-modal`, labelled, focus-trapped, background inerted, Esc-to-close, reduced-motion fallback), documented in `docs/design-system.md` §9. | Could Have | Story E1-F4-S1, Sprint 5. Done / Pass (2026-08-19) — shipped implementation verified to match spec verbatim, no deviations. |
| REQ-1.4.2 | The site SHALL render a `PortfolioDisclosureModal`, mounted sitewide in the root layout, that opens ~300ms after first page load (once per browser session, gated by a fail-open `sessionStorage` check keyed `"dgdevworks-portfolio-disclosure-dismissed"`), is dismissible via a visible close control, `Esc`, or backdrop click, links to `/contact` via a plain internal link with no query string, and respects `prefers-reduced-motion` with an instant, transform-free fallback. | Could Have | Story E1-F4-S2, Sprint 5. Done / Pass (2026-08-19) — `src/components/layout/PortfolioDisclosureModal.tsx`, `src/data/portfolioDisclosure.ts`. |
| REQ-1.4.3 | Automated unit and live-browser E2E test coverage SHALL verify the portfolio disclosure modal's open/dismiss behavior, focus trap, contact-link target, session-scoped persistence (no reappearance on in-session navigation; reappears in a new browser session), and zero critical/serious axe violations in both default and reduced-motion states, with no regressions introduced to the pre-existing nav/footer/theme/SEO test suite. | Could Have | Story E1-F4-S3, Sprint 5. Done / Pass (2026-08-19) — 16 unit tests, 11 E2E tests, 4-test axe/reduced-motion extension; added `tests/e2e/fixtures.ts` to prevent regressions in 6 pre-existing specs (`accessibility.spec.ts`, `mobile-nav.spec.ts`, `navigation.spec.ts`, and 3 others updated to import the shared fixture). |

### Epic 2: Content Data Layer

#### Feature 2.1 — Typed Data Models

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-2.1.1 | `src/data/services.ts` SHALL export exactly 4 typed service entries (slugs: `mvp-development`, `marketing-sites`, `modernization`, `fractional`) with summary, includes, process, ideal client, price label, and related case-study cross-links matching the approved mapping table. | Must Have | Story E2-F1-S1. Done / Pass. |
| REQ-2.1.2 | `src/data/caseStudies.ts` SHALL export exactly 4 typed case-study entries (slugs: `bank-platform-modernization`, `hardware-brand-partner-portals`, `retail-pos-platform`, `stock-exchange-data-migration`) in challenge/approach/impact format, containing no proprietary screenshots, internal system names beyond what's already public, or client data, with related-service cross-links matching the approved mapping table. | Must Have | Story E2-F1-S2. Done / Pass. |
| REQ-2.1.3 | `src/data/pricing.ts` SHALL export a typed hourly rate and 4 pricing packages with placeholder values flagged (via code comment) as pending confirmation, consumed identically by the pricing snapshot and full pricing page. | Must Have | Story E2-F1-S3. Done / Pass. |
| REQ-2.1.4 | `src/data/business.ts` SHALL export brand name, tagline, positioning copy, booking URL (sourced from `NEXT_PUBLIC_BOOKING_URL`), and social links, consumed by Nav, Footer, Home, and About rather than duplicated inline. | Must Have | Story E2-F1-S4. Done / Pass. |

### Epic 3: Core Pages & Routing

#### Feature 3.1 — Home & Services Pages

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-3.1.1 | The Home page (`/`) SHALL render a hero with positioning statement and primary CTA, a 4-card services overview, a proof snapshot linking to `/work`, a pricing snapshot linking to `/pricing`, and a closing dual-CTA section. | Should Have | Story E3-F1-S1. Done / Pass. |
| REQ-3.1.2 | The Services index (`/services`) SHALL statically list all 4 services from `services.ts`, each summarized with a link to its detail page, using shared Card/Section primitives. | Should Have | Story E3-F1-S2. Done / Pass. |
| REQ-3.1.3 | Each Service detail page (`/services/[slug]`) SHALL be statically pre-rendered for all 4 slugs, rendering what's included, process, ideal client, price, related case studies, and a closing dual CTA; invalid slugs SHALL produce a proper not-found result with no runtime crash. | Should Have | Story E3-F1-S3. Done / Pass. |

#### Feature 3.2 — Work / Case Studies Pages

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-3.2.1 | The Work index (`/work`) SHALL render 4 case-study cards from `caseStudies.ts`, each linking to its detail page, using abstract/illustrative (non-screenshot) visuals. | Should Have | Story E3-F2-S1. Done / Pass. |
| REQ-3.2.2 | Each Case Study detail page (`/work/[slug]`) SHALL be statically pre-rendered for all 4 slugs, rendering challenge/approach/impact content and cross-links to related service page(s) per the approved mapping table; invalid slugs SHALL produce a proper not-found result. | Should Have | Story E3-F2-S2. Done / Pass. |

#### Feature 3.3 — About, Pricing, Contact Pages

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-3.3.1 | The About page (`/about`) SHALL render Daryll's story and DG DevWorks brand framing aimed at founders, including an outbound link to the personal portfolio site that is distinguishable from surrounding body text by a non-color affordance (e.g., underline), not color alone. | Should Have | Story E3-F3-S1. **In Progress / QA Fail** — inline "personal portfolio" link measured 1.12:1 against surrounding body text with no underline; fails WCAG 1.4.1 (Use of Color). Remediation owner: frontend-coding-agent. |
| REQ-3.3.2 | The Pricing page (`/pricing`) SHALL render all 4 packages and the hourly rate from `pricing.ts`, a per-package "why the range" note, a prominent indicative-pricing disclaimer, a pricing FAQ, and a closing dual CTA. | Should Have | Story E3-F3-S2. Done / Pass. |
| REQ-3.3.3 | The Contact page (`/contact`) SHALL render a contact form, a booking CTA using `NEXT_PUBLIC_BOOKING_URL`, a trust-signal-line region, and an FAQ region, using shared UI primitives and theming. | Should Have | Story E3-F3-S3. Done / Pass. |

### Epic 4: SEO, AEO & GEO

#### Feature 4.1 — Metadata & Sitemap

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-4.1.1 | Every route SHALL implement `generateMetadata()` producing a unique title, description, and canonical URL (from `NEXT_PUBLIC_SITE_URL`); no two routes SHALL share an identical title or description. | Could Have | Story E4-F1-S1. Done / Pass. |
| REQ-4.1.2 | `app/sitemap.ts` and `app/robots.ts` SHALL be generated from the same slug lists used by `generateStaticParams()`, so adding or removing a service/case-study slug automatically updates the sitemap with no manual edits, and robots SHALL allow crawling and reference the sitemap via `NEXT_PUBLIC_SITE_URL`. | Could Have | Story E4-F1-S2. Done / Pass. |

#### Feature 4.2 — Open Graph Images

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-4.2.1 | A root `opengraph-image.tsx` SHALL generate a static, correctly-dimensioned (1200×630) social preview image reflecting the brand name and tagline from `business.ts`. | Could Have | Story E4-F2-S1. Done / Pass. |
| REQ-4.2.2 | Each `/services/[slug]` and `/work/[slug]` route SHALL generate its own static OG image via `generateStaticParams()`, reflecting that page's specific title rather than a generic fallback, for all 8 dynamic routes. | Could Have | Story E4-F2-S2. Done / Pass. |

#### Feature 4.3 — Structured Data (JSON-LD)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-4.3.1 | `Person`/`ProfessionalService` JSON-LD sourced from `business.ts` SHALL be injected sitewide via the root layout, validating with no schema errors and causing no hydration warnings. | Could Have | Story E4-F3-S1. Done / Pass. |
| REQ-4.3.2 | Each Service detail page SHALL render distinct `Service` JSON-LD (name, description, price) sourced from `services.ts`, validating with no schema errors. | Could Have | Story E4-F3-S2. Done / Pass. |
| REQ-4.3.3 | `/pricing` and `/contact` SHALL render `FAQPage` JSON-LD, sourced from a single typed FAQ data source, matching the visible on-page FAQ content exactly. | Could Have | Story E4-F3-S3. Done / Pass. |
| REQ-4.3.4 | Every case study page SHALL link to its primary (and secondary, where present) related service page, and every service page SHALL link to its related case studies, matching the approved cross-link mapping table exactly, with no broken links. | Could Have | Story E4-F3-S4. Done / Pass. |

### Epic 5: Contact & Conversion

#### Feature 5.1 — Contact Form

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-5.1.1 | The `/contact` form SHALL collect name, email, and message with client-side validation preventing submission of empty required fields or a malformed email, distinct loading/success/error states, and full keyboard/screen-reader accessibility. | Could Have | Story E5-F1-S1. Done / Pass. |
| REQ-5.1.2 | On submit, the contact form SHALL POST directly (client-side, no backend) to `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` as a formatted Discord embed per `docs/api-contract.md`, confirm success to the user, surface a retry-friendly error on failure, and short-circuit gracefully (dev-time warning, no unhandled exception) when the webhook URL is unset or a placeholder. | Could Have | Story E5-F1-S2. Done / Pass. |
| REQ-5.1.3 | A trust-signal line explaining data use SHALL render, visibly and without requiring interaction, near the contact form, with no separate privacy-policy page created. | Could Have | Story E5-F1-S3. Done / Pass. |

#### Feature 5.2 — Booking CTA

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-5.2.1 | A "Book a call" CTA reading `NEXT_PUBLIC_BOOKING_URL` SHALL render consistently in the nav and on the home, every service, and the contact page; the home page and every service page SHALL close with a dual CTA (primary "Book a call", secondary "Send a message" to `/contact`); a placeholder booking URL SHALL never produce a dead or malformed link. | Could Have | Story E5-F2-S1. Done / Pass. |

### Epic 6: Quality, Deployment & Documentation

#### Feature 6.1 — Testing & QA

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-6.1.1 | Unit tests SHALL verify the shape of `services.ts`, `caseStudies.ts`, `pricing.ts`, and `business.ts`, resolve all cross-referenced slugs, and cover Nav, Footer, ThemeToggle, and at least one UI primitive, runnable via a documented script with all tests passing and none skipped. | Could Have | Story E6-F1-S1. Done / Pass. |
| REQ-6.1.2 | Live-browser E2E tests SHALL cover the home→service→case-study→back navigation flow, theme-toggle persistence across reload with no flash, contact-form success/validation-error states (webhook mocked), and the booking CTA, all passing against a production-equivalent static export build. | Could Have | Story E6-F1-S2. Done / Pass. |
| REQ-6.1.3 | An automated accessibility scan (axe) SHALL run against all 14 rendered pages with zero critical/serious violations, keyboard navigation SHALL be verified for nav/theme-toggle/contact-form, and color contrast SHALL be verified for both themes against the token set. | Could Have | Story E6-F1-S3. **Todo / QA Fail** — live-browser axe run found 2 real serious violations (Footer color-contrast per REQ-1.3.3; About link-in-text-block per REQ-3.3.1). Blocked pending both fixes and a re-scan. |
| REQ-6.1.4 | Metadata, sitemap, robots, and all JSON-LD blocks (`Person`/`ProfessionalService`, `Service` ×4, `FAQPage` ×2) SHALL be validated with zero errors across every route, and all 9 Open Graph images SHALL be verified to render with correct per-route content. | Could Have | Story E6-F1-S4. Done / Pass. |

#### Feature 6.2 — Deployment & Documentation

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| REQ-6.2.1 | The site SHALL be configured for deployment to Vercel as a static export (`output: 'export'`), with all required environment variables documented as Vercel project settings matching `.env.example`, a production build completing with zero blocking errors/warnings, and a deployed preview verified to serve all 14 pages correctly. | Could Have | Story E6-F2-S1. **Todo / QA Fail** — live Vercel preview could not be independently verified in the sandboxed QA environment (no deploy credentials/egress). Pending a real-deployment check by whoever has Vercel access. |
| REQ-6.2.2 | A README SHALL document local setup, all 5 environment variables (required vs. optional, where to obtain/replace placeholders), the Vercel deployment process, and the spec's pending Open Items (pricing figures, real booking URL, real domain, case-study copy review) as owner follow-ups before public launch. | Could Have | Story E6-F2-S2. **Todo / QA Pending** — `README.md` authored 2026-08-19 by readme-agent per these ACs; not yet verified by qa-agent, so Status/QA Status remain as tracked per the tracker's Definition of Done. |

---

## 5. Non-Functional Requirements

| Category | Requirement | Priority | Verification |
|---|---|---|---|
| Performance | The production build SHALL be a fully static export with no client-side data fetching on initial render; all content is inlined at build time. | Must Have | `next build` static export inspection; `bun run build` zero-error gate. |
| Performance | Theme resolution SHALL occur via a blocking inline script before first paint, so no flash of incorrect theme is visible. | Must Have | `tests/e2e/theme.spec.ts` (asserts `data-theme` correctness before React hydrates). |
| Security | The Discord webhook URL SHALL be treated as a public, client-embedded value (accepted risk of a fully static site) with a honeypot field and reliance on Discord's own rate limiting as spam mitigations. | Must Have | `docs/api-contract.md` Security note; `tests/unit/lib/discord.test.ts`. |
| Security | All external links (LinkedIn, GitHub, personal portfolio, booking URL) SHALL use `target="_blank" rel="noopener noreferrer"`. | Must Have | `tests/unit/components/Button.test.tsx`, `tests/e2e/booking-cta.spec.ts`. |
| Security | No `?redirect=`/`?next=`-style open-redirect params, auth, session/logout UX, or PII redisplay SHALL exist anywhere on the site. | Must Have | `tests/unit/security/security.test.ts`; code review. |
| Accessibility | All 14 routes SHALL pass an automated axe scan with zero critical/serious violations. | Must Have | `tests/e2e/accessibility.spec.ts`. **Currently not met** — see REQ-1.3.3 / REQ-3.3.1 / REQ-6.1.3. |
| Accessibility | All interactive elements SHALL expose a visible focus ring; all dialogs (mobile nav panel, portfolio disclosure modal) SHALL implement a full focus trap, `Esc`-to-close, and focus return on close. | Must Have | `tests/unit/components/MobileNavPanel.test.tsx`, `tests/unit/components/PortfolioDisclosureModal.test.tsx`, corresponding E2E specs. |
| Accessibility | All motion (scroll-reveal, mobile nav panel, portfolio disclosure modal) SHALL respect `prefers-reduced-motion` with an instant, transform-free fallback. | Must Have | `tests/unit/components/ScrollReveal.test.tsx`; `tests/e2e/accessibility.spec.ts` reduced-motion assertions. |
| Scalability | The site SHALL require no origin server, database, or backend runtime, and SHALL be servable entirely from a CDN/static host. | Must Have | `vercel.json` static-export config; `docs/api-contract.md` ("No internal backend API exists"). |
| Reliability | A production build (`next build`) SHALL complete with zero errors, and `bun run lint` / `bun run typecheck` / `bun audit` SHALL all pass clean before any story is marked Done. | Must Have | Definition of Done, `docs/dev-stories-tracker.md`. |
| Data Integrity | All cross-referenced content slugs (`relatedCaseStudySlugs`, `relatedServiceSlugs`) SHALL resolve to real entries in their respective typed data files; no broken cross-links. | Must Have | `tests/unit/data/caseStudies.test.ts`, `tests/unit/data/services.test.ts`. |
| Data Integrity | The sitemap SHALL always reflect the actual route list — driven by the same slug arrays used by `generateStaticParams()`, never hand-maintained separately. | Must Have | `tests/unit/seo/sitemap-robots.test.ts`, `tests/e2e/seo.spec.ts`. |

---

## 6. Tech Stack & Architecture

| Layer | Technology | Decision Rationale |
|---|---|---|
| Framework | Next.js (App Router), `output: 'export'` | Enables a fully static, backend-free deployment while retaining file-based routing, `generateStaticParams`, and built-in metadata/OG-image conventions. |
| Language | TypeScript, `strict: true` | All content is typed data (`src/data/*.ts`); strict mode catches shape drift in cross-referenced slugs at compile time. |
| Styling | Tailwind CSS v4 | Utility-first styling consumed against CSS custom-property design tokens (`globals.css`), enabling the light/dark theme switch with zero JS-driven style recalculation. |
| Animation | Framer Motion | Powers scroll-reveal, mobile nav panel, and portfolio disclosure modal transitions, gated by `useReducedMotion()` throughout. |
| Fonts | `next/font` (Inter, Space Grotesk, IBM Plex Mono) | Self-hosted, zero-layout-shift font loading consistent with the "Spec Sheet / Blueprint" design direction. Space Grotesk (headings) was selected to read as inviting and technical — see REQ-1.2.3–REQ-1.2.6 for the full selection rationale and reconciliation history, including an interim period where headings shipped in Instrument Serif before this decision. |
| Package manager / runtime | Bun | Single toolchain for install, dev server, build, lint, typecheck, and test scripts. |
| Unit testing | Vitest + React Testing Library + jsdom + vitest-axe | jsdom-level component and data-layer coverage, including a fast in-process axe pass across all 14 rendered pages. |
| E2E testing | Playwright + `@axe-core/playwright` | Authoritative live-Chromium accessibility, navigation, theming, and contact-form coverage against the actual static export build (not the dev server). |
| Contact delivery | Discord incoming webhook (client-side POST) | Avoids any backend/API route for a fully static site; documented as a public, client-embedded credential with accepted risk (`docs/api-contract.md`). |
| Hosting | Vercel (static export) | Zero-server-runtime hosting matching `output: 'export'`; `vercel.json` pins `outputDirectory: "out"`. |

**Architecture summary.** The site has no backend, no database, and no `app/api/*` route handlers — all 14 pages are pre-rendered at build time from typed data in `src/data/*.ts`, and the single external integration (the Discord webhook) is called directly from the browser. `software-architect-agent` was not used as a story assignee for this project; architecture decisions were made directly against the approved design spec and implemented by `frontend-coding-agent`/`ui-design-agent`.

---

## 7. Constraints & Assumptions

**Hard constraints:**

- The site MUST remain a fully static export (`output: 'export'`) with no server runtime, database, or backend API.
- The contact form MUST NOT route through any backend proxy; it POSTs directly to the Discord webhook from the browser, accepting the resulting public-webhook-URL exposure as a known risk.
- No CMS may be introduced — all content is hand-maintained in typed `src/data/*.ts` files.
- Case study content MUST NOT reference proprietary UI screenshots, undisclosed internal system names, or client data beyond what is already public.

**Assumptions that could invalidate requirements if wrong:**

- Pricing figures in `src/data/pricing.ts` (hourly rate $90; package ranges) are explicitly flagged placeholders pending the business owner's confirmation before public launch.
- `NEXT_PUBLIC_BOOKING_URL` currently resolves to a placeholder Cal.com-style URL, not a real, live booking calendar.
- `NEXT_PUBLIC_SITE_URL` / production domain has not yet been finalized; canonical URLs and the sitemap depend on this value being correct at deploy time.
- A live Vercel preview deployment has not yet been independently verified to serve all 14 routes (sandboxed QA environment had no deploy credentials/egress) — see REQ-6.2.1.
- Case-study copy is assumed to have been reviewed for confidentiality; a final legal/business-owner review pass before public launch is still an open item per REQ-6.2.2.

---

## 8. Out of Scope

- A CMS or any editor UI for non-developer content updates.
- User accounts, authentication, or session/logout flows.
- A dedicated privacy-policy page (a trust-signal line near the contact form is the accepted substitute per REQ-5.1.3).
- Payment processing or e-commerce checkout.
- Multi-language / i18n support.
- Live chat or real-time messaging.
- A backend API, database, or persistence layer of any kind — `db-agent` and `backend-coding-agent` are explicitly not used on this project.
- Blog or long-form content publishing system.

---

## 9. Glossary

| Term | Definition |
|---|---|
| Static export | A Next.js build mode (`output: 'export'`) that pre-renders every route to static HTML at build time, with no server runtime required at deploy time. |
| REQ ID | A stable requirement identifier in the format `REQ-<epic>.<feature>.<seq>`, traceable to a specific dev-stories-tracker story. |
| MoSCoW | The Must Have / Should Have / Could Have / Won't Have prioritization scheme used for all requirements in this document. |
| Dual CTA | The paired "Book a call" (primary, external booking link) / "Send a message" (secondary, links to `/contact`) call-to-action pattern used at the close of Home and every Service detail page. |
| AEO / GEO | Answer Engine Optimization / Generative Engine Optimization — structuring content and JSON-LD so that answer-engine and LLM-based assistants can accurately surface and cite the site. |
| JSON-LD | Structured data (schema.org vocabulary) embedded per route (`Person`/`ProfessionalService`, `Service`, `FAQPage`) to aid search/answer-engine understanding. |
| Portfolio disclosure modal | The sitewide, session-scoped dialog (Feature 1.4) informing visitors this is a self-directed portfolio project, shown once per browsing session ~300ms after first load. |
| `sessionStorage`-scoped | Persistence that lasts only for the current browser tab/session (cleared on tab close), used for the portfolio disclosure modal's dismissal flag. |
| Fail open | A defensive pattern where, if a mechanism (e.g., `sessionStorage` read/write) throws, the system defaults to the safer/more-visible behavior (showing the modal) rather than silently suppressing it. |
| Card-bracket | A visual motif (corner-bracket "registration marks," CAD/viewfinder-style ticks) reserved for the highest-signal elements in the "Spec Sheet / Blueprint" design direction — e.g., the hero visual, the recommended pricing tier, and the portfolio disclosure modal. |
| DoD (Definition of Done) | The tracker-defined bar a story must clear — all ACs checked, automated test coverage, full suite passing, no regressions, code reviewed, no open critical/high security findings — verified exclusively by `qa-agent`. |

---

## 10. Revision History

| Version | Date | Agent/Author | Changes |
|---|---|---|---|
| 1.0 | 2026-08-19 | docs-agent | Initial creation of SPECS.md, populated from `docs/dev-stories-tracker.md` (6 epics, 43 stories, 137 points) and `docs/design-system.md`. All 10 standard sections created. Functional requirements REQ-1.1.1 through REQ-6.2.2 (43 total) assigned across all 6 epics, including REQ-1.4.1–REQ-1.4.3 for the newly completed Feature 1.4 (Portfolio Disclosure Modal, Sprint 5, Status: Done / QA Status: Pass). Known open defects (Footer contrast — REQ-1.3.3; About inline-link contrast — REQ-3.3.1; blocked accessibility audit — REQ-6.1.3; unverified Vercel preview — REQ-6.2.1; README QA-pending — REQ-6.2.2) carried forward from the tracker's Final Backlog Review, flagged in their respective requirement Notes rather than hidden. |
| 1.1 | 2026-08-20 | docs-agent | Reconciled REQ-1.2.3 (Feature 1.2 — Theming & Design Tokens) with the actual shipped font stack after `docs/dev-stories-tracker.md`'s Epic 1 "Typography & Visual Identity" / Feature 1.1 "Heading Font Replacement" (4 stories, Sprint 1, all Done/Pass) landed the heading font on Space Grotesk. Two pieces of prior drift are now resolved: (1) REQ-1.2.3's mono-font text said JetBrains Mono while the site has shipped IBM Plex Mono — corrected to match reality; (2) REQ-1.2.3's heading-font text said Space Grotesk while the site had, in the interim, shipped Instrument Serif (a later, undocumented-in-this-spec reskin) — the site is now back on Space Grotesk, so text and implementation align again. This alignment is coincidental, not a reversion: this run's heading-font decision was made independently via a fresh "inviting and technical" brief (story E1-F1-S1), not by re-implementing the original REQ-1.2.3. Added REQ-1.2.4 (typeface selection & documentation requirement, traceable to E1-F1-S1), REQ-1.2.5 (heading-font consumer render-correctness verification, traceable to E1-F1-S3), and REQ-1.2.6 (regression/accessibility re-verification after a heading-font change, traceable to E1-F1-S4) to Feature 1.2 so all 4 stories in the tracker's Epic 1 have direct REQ traceability. Updated the Tech Stack & Architecture Fonts row (§6) to reflect IBM Plex Mono and reference the rationale. 3 requirements added (REQ-1.2.4, REQ-1.2.5, REQ-1.2.6), 1 requirement text updated (REQ-1.2.3). |
