# DG DevWorks Marketing Site — Design Spec

**Date:** 2026-08-18
**Status:** Approved, ready for implementation planning

## Overview

A standalone marketing/services website for Daryll, freelancing as **DG DevWorks**, targeting startup founders. The site's job is to convert founders into clients across four services, and — because one of those services is "I build marketing sites" — the site itself is the primary proof of that capability.

This is a **separate project** from the existing personal portfolio (`portfolio/`), which remains a single-page resume-style site. This project lives in its own repo at `/home/gonsquared/dgdevworks/dgdevworks-site`.

## Positioning & Branding

- **Brand:** "DG DevWorks", fronted personally by Daryll — not an anonymous studio. Pattern: *"DG DevWorks — built by Daryll, senior full-stack engineer for founders."*
- **Core pitch:** *"I build your product and the marketing site that sells it."* The site itself demonstrates the marketing-site-build service; the case studies demonstrate the product/modernization/fractional services.
- **Target buyer:** startup founders (not local businesses, not agencies subcontracting — though the copy shouldn't actively exclude those readers).
- **Differentiation from `portfolio/`:** that site is a personal résumé/portfolio (dark-glass theme, single scrolling page, Hero→About→Skills→Experience→Projects→Contact). This site is a services/conversion site (light-default with dark toggle, multi-page, organized around services and case studies rather than a chronological work history). The portfolio is linked from this site's footer for readers who want deeper technical/code credibility, not the other way around as the primary site.

## Services (four offerings)

1. **MVP / product build** — full-stack build from idea to shipped product (frontend, backend, database, deployment). Core strength per work history (a regulated bank Next.js/microservices work, a stock-data platform's MERN migration).
2. **Marketing / landing site build** — fast, conversion-focused marketing sites (this site is the proof). Draws on the a global hardware brand portal migration (PHP/Drupal → Next.js).
3. **Legacy modernization / migration** — migrating old stacks (PHP/Angular/monoliths, Apigee, Django) to modern Next.js/microservices/Azure. Draws on a regulated bank API Management migration and the stock-data platform's Django→MERN migration.
4. **Fractional / embedded senior engineer** — part-time ongoing engagement: code review, mentoring, Agile/Scrum leadership. Draws on a regulated bank Scrum Lead role and a mentoring engagement at an enterprise consulting firm.

## Proof of Work — Case Studies

No freelance client case studies exist yet (all experience is employer-based). Employer projects are reframed as case studies, written in challenge/approach/impact format, **without confidential specifics** (no proprietary UI screenshots, no internal system names beyond what's already public, no client data).

| Case study slug | Source project | Reframed around | Primary service link | Secondary service link |
|---|---|---|---|---|
| `bank-platform-modernization` | A regulated bank — Apigee→Azure APIM migration, monolith→Next.js/microservices refactor, JWT+Key Vault | Legacy modernization at a regulated bank | `/services/modernization` | `/services/fractional` (Scrum Lead role) |
| `hardware-brand-partner-portals` | a global hardware brand Partner/Developer Portal — PHP/Drupal→Next.js, i18n+GeoIP, WCAG accessibility, SEO | Marketing/developer portal rebuild | `/services/marketing-sites` | — |
| `retail-pos-platform` | global electronics manufacturer POS — perf optimization, RTL/i18n (Arabic, Spanish), Cypress/Cucumber regression expansion | Full-stack feature delivery under enterprise QA rigor | `/services/mvp-development` | — |
| `stock-exchange-data-migration` | a regional stock exchange — Django/PostgreSQL→MERN migration, exchange's live feed parser, 40% query perf gain | Legacy system migration + real-time data product | `/services/mvp-development` | `/services/modernization` |

Case study visuals are abstract/illustrative graphics (diagrams, stat call-outs, gradients) — not real product screenshots, since the underlying UIs are confidential/proprietary.

## Site Structure (Approach B: full multi-page)

Static export (`output: 'export'`) with fully known routes — no user-generated or runtime-dynamic content, so static export loses nothing meaningful here (see Tech Architecture).

| Route | Content |
|---|---|
| `/` | Hero (positioning statement + primary CTA), services overview (4 cards linking to service pages), proof snapshot (case study highlights), pricing snapshot, secondary CTA |
| `/services` | Index of all 4 services — short summary + link to each detail page |
| `/services/mvp-development` | What's included, process/timeline, ideal client profile, package price, related case studies, dual CTA |
| `/services/marketing-sites` | Same structure as above |
| `/services/modernization` | Same structure as above |
| `/services/fractional` | Same structure as above |
| `/work` | Case studies index — 4 cards |
| `/work/[slug]` | Individual case study (challenge/approach/impact), cross-linked to related service page(s) |
| `/about` | Daryll's story, DG DevWorks framing, trust-building narrative aimed at founders |
| `/pricing` | All 4 packages + hourly rate, "why the range" notes, indicative-pricing disclaimer, pricing FAQ |
| `/contact` | Contact form (Discord webhook) + booking CTA (placeholder link), trust-signal line about data use |

Global nav: Home / Services / Work / About / Pricing / Contact, plus a persistent "Book a call" button. Footer: contact info, LinkedIn (`linkedin.com/in/gonsquared`), GitHub (`github.com/gonsquared`), link to personal portfolio site, trust-signal line, copyright.

## Tech Architecture

**Stack:** Next.js (App Router) + TypeScript (strict mode) + Tailwind CSS + Framer Motion, `output: 'export'`, deployed on Vercel. New standalone repo at `/home/gonsquared/dgdevworks/dgdevworks-site`.

**Static routing:** `/services/[slug]` and `/work/[slug]` use `generateStaticParams()` to enumerate the fixed slug lists (4 services, 4 case studies) at build time. All 11 routes are pre-rendered HTML — nothing is looked up at runtime.

**Content as typed data**, not hardcoded JSX (mirrors the portfolio's `src/data/` pattern):
- `src/data/services.ts` — array of `{ slug, title, summary, includes: string[], process: string[], idealClient: string, priceLabel: string, relatedCaseStudySlugs: string[] }`
- `src/data/caseStudies.ts` — array of `{ slug, title, challenge: string, approach: string, impact: string[], relatedServiceSlugs: string[] }`
- `src/data/pricing.ts` — `{ hourlyRate: number, packages: Array<{ slug, name, priceLabel, timeframe, rangeNote }> }`
- `src/data/business.ts` — brand name, tagline, positioning copy, contact/booking URLs, social links

**SEO / AEO / GEO:**
- `generateMetadata()` per route — unique title/description per page (the core advantage over a single-page site)
- `app/sitemap.ts` and `app/robots.ts` — statically generated from the same route list at build time, so they can't drift out of sync with actual pages
- `opengraph-image.tsx` at root plus per dynamic route (via `generateStaticParams`) for correct social preview cards on every page
- JSON-LD structured data: `Person`/`ProfessionalService` sitewide (in root layout), `Service` schema on each service page, `FAQPage` schema on `/pricing` and `/contact` — the concrete AEO/GEO lever, since answer engines and LLM-based assistants preferentially lift structured, well-marked-up facts
- Internal cross-linking between every case study and its related service page(s), per the mapping table above

**Theming:** Same mechanism as the portfolio (CSS custom properties resolved via a `data-theme` attribute on `<html>`, blocking inline script in `layout.tsx` to set the attribute before first paint, `mounted` guard on any component with theme-dependent branching to avoid hydration mismatches) — but with a **new palette and token set**, not copied from the portfolio. **Light is the default theme** (clean SaaS: light background, bold Space Grotesk headings, generous whitespace, single accent color), with a dark toggle available (bold dev-brand: dark background, stronger accent glow).

**Typography:** Inter (body) + Space Grotesk (headings) via `next/font`, carried over from the portfolio for brand consistency across Daryll's sites. JetBrains Mono is used sparingly (pricing figures, small labels) rather than as a dominant motif — this site should read as "product," not "terminal/résumé."

**Components:** New `src/components/ui/` built for this project (not imported from `portfolio/`, since it's a separate repo) — same craftsmanship level and scroll-triggered animation patterns (fade/slide on scroll into view), rebuilt for the new visual language.

**Contact & conversion:**
- Contact form reuses the portfolio's proven client-side pattern: POSTs to a Discord webhook (`NEXT_PUBLIC_DISCORD_WEBHOOK_URL`), no backend needed, consistent with static export.
- Booking CTA reads `NEXT_PUBLIC_BOOKING_URL` (placeholder value until a real Calendly-style link exists), rendered as "Book a call" in the nav and on every service/home/contact CTA.
- Every service page and the home page end with a dual CTA: primary "Book a call", secondary "Send a message".

**Environment variables:**

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Production domain for SEO/OG metadata |
| `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` | Yes | Discord webhook receiving contact form submissions |
| `NEXT_PUBLIC_BOOKING_URL` | Yes (placeholder default) | Booking/scheduling link for "Book a call" CTAs |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | Google Search Console ownership token |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics Measurement ID |

## Pricing (placeholder values — explicitly editable before launch)

Derived from real market data — freelance Senior Software Engineer average rate of **$101/hr** (range $73–$120, [contractrates.fyi](https://www.contractrates.fyi/Senior-Software-Engineer/hourly-rates), Aug 2026 crowdsourced data) — minus 10% per Daryll's instruction, rounded.

| Item | Placeholder value | Basis |
|---|---|---|
| Hourly rate | **$90/hr** | $101 avg − 10%, rounded |
| Marketing/landing site package | **$3,500–$6,500** | ~40–70 hrs at $90/hr, 1–2 week timeframe |
| MVP / product build package | **starting at $12,000** | 4–8 week timeframe, leaner-scope floor |
| Legacy modernization/migration | **starting at $8,000**, custom quote | scope varies too much for a fixed range |
| Fractional/embedded senior engineer | **$3,500–$7,000/mo** | ~10–20 hrs/week part-time retainer at $90/hr |

All figures ship with an "indicative, pending a scoping call" disclaimer on `/pricing`.

## Non-Goals (v1)

Explicitly out of scope — revisit once there's real freelance traction:

- No CMS or blog — content stays in typed data files under `src/data/`
- No testimonials section — omitted entirely (not built as an empty placeholder) since there are no freelance client testimonials yet; add once the first one exists
- No payment/invoicing integration
- No i18n/multi-language support for this site (despite it being a resume strength)
- No formal privacy policy/legal pages — instead, a single trust-signal line near the contact form: *"Your info is only used to respond to your inquiry — no spam, no third parties."*
- No live chat widget
- No A/B testing infrastructure
- No analytics beyond the optional `NEXT_PUBLIC_GA_ID`

## Open Items for Daryll Before Launch

These are flagged, not blocking spec approval — implementation can proceed with placeholders:

- Confirm or replace the placeholder pricing figures with real numbers
- Set up and provide the real `NEXT_PUBLIC_BOOKING_URL` (Calendly or equivalent)
- Register/confirm the production domain for `NEXT_PUBLIC_SITE_URL`
- Review the four reframed case study write-ups for accuracy and confidentiality before publishing (draft copy will be produced during implementation, based on the resume bullet points cited in this spec)
