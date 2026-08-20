# DG DevWorks Marketing Site

Marketing/portfolio site for DG DevWorks — a fully static, frontend-only Next.js site. There is no backend service and no database; the contact form POSTs directly from the browser to a Discord incoming webhook.

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript (`strict: true`)
- **Runtime / package manager:** [Bun](https://bun.sh) (`bun.lock` present in the repo — this is the only lockfile; use Bun for all installs/scripts)
- **Styling:** Tailwind CSS v4, `@theme inline` design tokens in `src/app/globals.css`
- **Fonts:** Inter (body/sans), Space Grotesk (headings), IBM Plex Mono (monospace/annotations), all loaded via `next/font/google`; see [Typography](#typography) below
- **Animation:** Framer Motion
- **Unit/component testing:** Vitest + React Testing Library + jsdom + `vitest-axe`
- **E2E testing:** Playwright + `@axe-core/playwright`
- **Linting:** ESLint (`eslint-config-next`)
- **Hosting:** Vercel, deployed from a static export (`output: 'export'`, see `next.config.ts` / `vercel.json`)

## Package Manager

This project uses **Bun** (`bun.lock` is the lockfile committed to the repo; `package.json` also pins `"packageManager": "bun@1.3.14"`). Use `bun`/`bunx` for all commands below — do not use `npm`, `yarn`, or `pnpm`, and do not commit an alternate lockfile.

## Local Setup

```bash
# 1. Install dependencies
bun install

# 2. Copy the env template and fill in real values (see Environment Variables below)
cp .env.example .env.local

# 3. Run the dev server
bun run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

To produce a production static export:

```bash
bun run build
```

This runs `next build` with `output: 'export'` (see `next.config.ts`), producing the static site in `out/`. To preview the export locally, serve `out/` with any static file server, e.g.:

```bash
bunx serve out
```

## Folder Structure

```
src/
  app/                  App Router routes (pages, layouts, sitemap.ts, robots.ts, opengraph-image.tsx)
    about/ contact/ pricing/ services/ services/[slug]/ work/ work/[slug]/
  components/
    layout/             Nav, Footer, MobileNavPanel, PortfolioDisclosureModal, ThemeToggle, Logotype
    ui/                 Reusable primitives: Button, Card, Section, CTABand, FAQAccordion, ScrollReveal, Badge, SpecLabel, StatCallout
  data/                 Typed content data (services, caseStudies, pricing, business, faq, portfolioDisclosure, types)
  lib/                  env.ts (env var accessors), discord.ts (webhook submission), theme.ts, seo.ts, navLinks.ts
docs/                   Internal planning notes — design spec, API contract, dev-stories tracker, session log (gitignored, local-only; not part of a fresh clone)
tests/
  unit/                 Vitest + React Testing Library specs (components, data, lib, seo, accessibility, security)
  e2e/                  Playwright specs (run against the built static export, not the dev server)
public/                 Static assets
out/                    Build output (static export) — generated, not committed
```

## Typography

Three typefaces, all loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS custom properties, mapped to role tokens in the Tailwind v4 `@theme inline` block in `src/app/globals.css`:

| Role token | Raw variable | Font | Usage |
| --- | --- | --- | --- |
| `--font-sans` | `--font-inter` | Inter | Body copy, UI text, `.heading-h3`/`.heading-h4` (weight 600) |
| `--font-heading` | `--font-space-grotesk` | Space Grotesk | `.heading-masthead`, `.heading-display`, `.heading-h2` (weight 500), `.text-voice` (weight 400) |
| `--font-mono` | `--font-ibm-plex-mono` | IBM Plex Mono | Monospace figures/annotations (`.font-mono-figure`, `.font-mono-annotation`) |

Space Grotesk replaced Instrument Serif as the heading font (see `docs/dev-stories-tracker.md`, Epic 1 / Feature 1.1). Space Grotesk is loaded as a variable font (weights 300–700 available, no `weight` prop passed to `next/font/google`) rather than a fixed static weight. A future story may move `.heading-h3`/`.heading-h4` from Inter onto `--font-heading`; see the Final Backlog Review in `docs/dev-stories-tracker.md`.

## Environment Variables

All environment variables are `NEXT_PUBLIC_*` because this is a fully static export with no server runtime — nothing here is a genuine secret. Accessed via typed helpers in `src/lib/env.ts` rather than `process.env` ad hoc. Copy `.env.example` to `.env.local` and fill in real values before deploying to production.

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (safe placeholder default) | Production domain used for canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph metadata | No trailing slash. Placeholder: `https://www.dgdevworks.com` |
| `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` | Yes (safe placeholder default) | Discord incoming webhook URL that receives contact form submissions (POSTed client-side, `?wait=true`) | Placeholder value is intentionally invalid; the contact form detects the placeholder and short-circuits instead of attempting a request. Get a real value from a Discord server's Integrations > Webhooks settings. |
| `NEXT_PUBLIC_BOOKING_URL` | Yes (safe placeholder default) | Booking/scheduling link used by every "Book a call" CTA sitewide | Placeholder: `https://cal.com/dgdevworks/placeholder`. Replace with a real Calendly (or equivalent) link before launch. |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | Google Search Console ownership verification meta tag value | Empty/unset is handled defensively (no crash) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics Measurement ID (e.g. `G-XXXXXXXXXX`) | Leave unset to disable analytics |

The 3 required vars ship with safe placeholder defaults (see `src/lib/env.ts`) so `next build` never fails without real values — but the placeholders must be replaced before a real production launch.

## Available Scripts

All scripts are run with `bun run <script>` (or `bun <script>` for scripts Bun executes natively):

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Start the Next.js dev server |
| `build` | `next build` | Production build / static export (writes to `out/`) |
| `start` | `next start` | Start the Next.js production server — **TODO:** not applicable to this static-export deployment target (Vercel serves `out/` directly); kept for local parity/debugging only |
| `lint` | `eslint` | Lint the codebase |
| `typecheck` | `tsc --noEmit` | TypeScript strict-mode type checking with no output |
| `test` | `vitest run` | Run the Vitest unit/component test suite once |
| `test:watch` | `vitest` | Run the Vitest suite in watch mode |
| `test:coverage` | `vitest run --coverage` | Run the Vitest suite with v8 coverage reporting |
| `test:e2e` | rebuilds with a realistic Discord webhook env var, then `playwright test` | Run the Playwright E2E suite against the actual static export build (not the dev server) |

## Testing

**Unit / component tests (Vitest):**

```bash
bun run test
```

Runs all specs under `tests/unit/**` (26 test files at last count) against jsdom, covering data-layer shape/cross-reference checks, components, `src/lib/*` accessors, SEO metadata/JSON-LD, and accessibility (`vitest-axe`) and security checks. Config: `vitest.config.ts`.

**End-to-end tests (Playwright):**

```bash
bun run test:e2e
```

This script first rebuilds the static export with a realistic (non-placeholder) `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` so the contact form's real code paths are exercised, serves `out/` as static files (`serve`), then runs Playwright (`tests/e2e/**`, 8 spec files at last count) against it — a production-equivalent build per the project's own testing convention (see `playwright.config.ts`). The real Discord endpoint is never contacted in tests; webhook calls are intercepted/mocked via `page.route()`.

To run Playwright directly against an already-built `out/` (skips the rebuild step):

```bash
bunx playwright test
```

**Type checking and linting:**

```bash
bun run typecheck
bun run lint
```

## Build / Deployment

This is a static-export Next.js site (`output: 'export'` in `next.config.ts`, `images.unoptimized: true` since there is no server-side image optimizer available). There is no `app/api/*` route handler and no server runtime in production.

Deployment target is **Vercel**, configured via `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "bun run build",
  "installCommand": "bun install --frozen-lockfile",
  "outputDirectory": "out"
}
```

Steps to deploy:

1. Set all required environment variables (see [Environment Variables](#environment-variables)) in the Vercel project settings — do not rely on the code-level placeholder defaults for production.
2. Push/merge to the branch connected to the Vercel project, or run `vercel --prod` from a machine with Vercel CLI access.
3. Vercel runs `bun install --frozen-lockfile` then `bun run build`, and serves the static `out/` directory.

**TODO:** an actual live Vercel preview/production deployment has not been independently verified end-to-end in this environment (no deploy credentials/network egress were available during the last QA pass). Confirm all routes serve correctly, and confirm the `Content-Type: image/png` header on the extensionless Open Graph image routes, on a real Vercel deployment before public launch.

## Architecture Summary

- **Next.js 16 App Router, static export.** All 14 routes (11 route templates, including 2 dynamic `[slug]` templates for services and case studies) are pre-rendered at build time via `generateStaticParams()`. No server runtime, no API routes, no middleware.
- **No backend, no database, no API, no Docker.** All content (services, case studies, pricing, business/contact info, FAQ, portfolio-disclosure copy) lives in typed TypeScript data files under `src/data/`, imported directly by pages and components. There is no CMS, no persistence layer, no `app/api/*` route handlers, and no containerization: the project builds to a static export and deploys directly to Vercel (see [Build / Deployment](#build--deployment)).
- **Contact form → Discord webhook.** The `/contact` form POSTs directly from the browser to a Discord incoming webhook URL (`NEXT_PUBLIC_DISCORD_WEBHOOK_URL`), formatted as an embed. This is the site's only external integration.
- **Theming.** Light-default / dark-toggle theme implemented via CSS custom properties and a `data-theme` attribute on `<html>`, set by a blocking inline script in the root layout before first paint (no flash of incorrect theme), with preference persisted via `localStorage`.
- **SEO/AEO/GEO.** Per-route `generateMetadata()`, `app/sitemap.ts` / `app/robots.ts` driven by the same data used for `generateStaticParams()`, per-route Open Graph images (`opengraph-image.tsx`, including 8 dynamic ones for services/case studies), and JSON-LD structured data (`Person`/`ProfessionalService` sitewide, `Service` per service page, `FAQPage` on `/pricing` and `/contact`).
- **Portfolio disclosure modal.** A sitewide, session-scoped modal (`src/components/layout/PortfolioDisclosureModal.tsx`) shown once per browser session on first load, disclosing this is a portfolio project and linking to `/contact`.

Deeper rationale behind these decisions (why, not just how) lives in internal planning notes (`docs/`) that are gitignored and not part of a fresh clone.

## Troubleshooting

- **Build fails or hangs on `bun install`:** confirm you're using Bun (matching `bun.lock`), not `npm`/`yarn`/`pnpm`. Mixing package managers/lockfiles is a known setup risk — this repo currently has only `bun.lock` committed.
- **Contact form shows a "not configured" / short-circuit state:** `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` is unset or still the documented placeholder (`src/lib/env.ts`'s `isDiscordWebhookPlaceholder()`). Set a real webhook URL in `.env.local` (or Vercel project settings) to test real submissions.
- **E2E tests fail locally with a missing browser/library error:** run `bunx playwright install --with-deps` once to install Playwright's browser binaries and OS dependencies.
- **Theme flashes the wrong value on load:** this should not happen — theme is set by a blocking inline script before first paint. If you see a flash, check that the script in the root layout (`src/app/layout.tsx`) hasn't been altered or moved after other blocking scripts/styles.
- **TODO:** no other troubleshooting scenarios have been documented yet from real-world usage; add to this section as issues are discovered.

## Known Open Items (pending owner follow-up before public launch)

These carry over from the project's design spec:

- **Pricing figures** (`src/data/pricing.ts`) are placeholder values pending confirmation (flagged in-code with a comment).
- **Real booking URL** — `NEXT_PUBLIC_BOOKING_URL` still points at a placeholder (`https://cal.com/dgdevworks/placeholder`); replace with a real scheduling link before launch.
- **Real production domain** — `NEXT_PUBLIC_SITE_URL` still points at a placeholder value; confirm/replace before launch (affects canonical URLs, sitemap, OG metadata).
- **Case study copy review** — case study content should get a final review pass before public launch.
- **Live Vercel deployment verification** — see [Build / Deployment](#build--deployment) above.
- **Known accessibility defects (open):** a WCAG AA color-contrast issue in the Footer (`text-text-tertiary` usage) and a WCAG 1.4.1 use-of-color issue on the About page's inline portfolio link (tracked internally as stories `E1-F3-S3` and `E3-F3-S1`).

## Contributing

- Run `bun run typecheck`, `bun run lint`, `bun run test`, and `bun run test:e2e` before opening a PR.
- Content changes (services, case studies, pricing, business info) should go through the typed data files in `src/data/`, not hardcoded inline copy in components/pages.
- New environment variables must be added to `.env.example` and documented in this README's Environment Variables table, and read via a typed accessor in `src/lib/env.ts` rather than `process.env` ad hoc (enforced by `tests/unit/security/security.test.ts`).
- **TODO:** no formal branch/PR/commit-message convention has been documented yet for this repo; follow the existing commit history style in the meantime.
