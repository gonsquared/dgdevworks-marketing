# Dev Stories Tracker

**Project:** DG DevWorks Marketing Site
**Created:** 2026-08-18
**Last Updated:** 2026-08-19
**Project Status:** Active

## Definition of Done

A story is `Done` only when ALL of the following are true — verified by `qa-agent`:

1. All acceptance criteria checkboxes for the story are checked off
2. Automated tests exist that exercise each acceptance criterion
3. The full test suite passes with no new failures (unit + integration + E2E where applicable)
4. No regressions introduced — all previously passing tests still pass
5. Code has been reviewed (frontend-code-review-agent)
6. No critical or high security findings remain open

`qa-agent` is the only agent authorized to set a story's Status to `Done` and QA Status to `Pass`.
If qa-agent sets QA Status to `Fail`, the story is returned to its assigned agent for remediation, then re-tested.

**Project note:** This is a fully static, frontend-only Next.js (`output: 'export'`) marketing site with no persistence layer and no backend service — the contact form POSTs client-side directly to a Discord webhook. There are no `db-agent` or `backend-coding-agent` stories in this backlog. `software-architect-agent` is not used as a story assignee for this project; architecture decisions from the approved design spec are treated as already made and are implemented directly by `frontend-coding-agent` and `ui-design-agent`.

---

## Summary

| Metric        | Count |
| ------------- | ----- |
| Total Epics   | 6     |
| Total Stories | 43    |
| Story Points  | 137   |
| Done          | 38    |
| In Progress   | 2     |
| Todo          | 3     |
| QA Status: Pending | 1     |
| QA Status: Pass    | 38    |
| QA Status: Fail    | 4     |
| Parallel-Group: parallel      | 34    |
| Parallel-Group: backend-first | 0     |
| Parallel-Group: sequential    | 0     |

**QA gate summary (2026-08-18, qa-agent):** 35 of 39 gated stories passed (34 frontend-coding-agent/ui-design-agent stories + 1 of 4 qa-agent stories: E6-F1-S1, E6-F1-S2, E6-F1-S4 pass; E6-F1-S3 fails). 4 stories failed QA and were reset to `Todo`: **E1-F3-S3** (Footer — WCAG AA contrast failure), **E3-F3-S1** (About — inline link fails WCAG 1.4.1 use-of-color), **E6-F1-S3** (accessibility audit — found the above 2 real defects across all 14 routes), and **E6-F2-S1** (Vercel deploy config — could not independently verify a live Vercel preview in this sandboxed environment, no deploy credentials/egress available). `E6-F2-S2` (readme-agent) remains `Todo`/`Pending` — out of qa-agent's scope this pass. See the per-story QA notes below and the Changelog for full detail.

**QA gate summary (2026-08-19, qa-agent):** Follow-up pass scoped to exactly 3 stories — Epic 1, Feature 1.4 "Portfolio Disclosure Modal" (E1-F4-S1, E1-F4-S2, E1-F4-S3), Sprint 5. All 3 passed QA and are now `Status: Done` / `QA Status: Pass`: **E1-F4-S1** (design spec — verified §9 is complete and the shipped implementation matches it verbatim, no deviations), **E1-F4-S2** (`PortfolioDisclosureModal` component — all 6 ACs verified via new automated tests), and **E1-F4-S3** (qa-agent's own story — added 16 unit tests, 11 live-browser E2E tests, and a 4-test axe/reduced-motion extension to `tests/e2e/accessibility.spec.ts`). Also added `tests/e2e/fixtures.ts` and updated 6 pre-existing E2E specs to fix a real (test-suite-only) regression the new sitewide modal introduced against unrelated flows — see the Changelog for detail. The 4 previously-failed legacy stories (`E1-F3-S3`, `E3-F3-S1`, `E6-F1-S3`, `E6-F2-S1`) and `E6-F2-S2` were deliberately left untouched — out of scope for this pass.

**Agent assignment breakdown:** `frontend-coding-agent` 34 · `ui-design-agent` 3 · `qa-agent` 5 · `readme-agent` 1

---

## Epic 1: Project Foundation & Design System

> Establishes the Next.js/TypeScript/Tailwind technical foundation, the light-default/dark-toggle theming system, typography, and the reusable UI/layout components every page depends on.

### Feature 1.1: Project Scaffolding & Configuration

---

#### E1-F1-S1 — Initialize Next.js App Router project scaffold

**Story:** As a developer, I want a Next.js App Router project scaffolded with TypeScript strict mode and static export configured, so that all subsequent pages and features have a consistent, deployable foundation.

**Points:** 3 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Next.js App Router project created with TypeScript, `strict: true` in `tsconfig.json`
- [x] `next.config` sets `output: 'export'`
- [x] Base folder structure created: `src/app`, `src/data`, `src/components/ui`
- [x] Project builds and runs locally (`next dev`) and produces a static export (`next build`) with no errors

**QA notes (2026-08-18):** Verified via `bun run typecheck` (clean), `bun run build` (all 14 pages + sitemap + robots + 9 OG images generated, 0 errors), and folder structure inspection. No automated regression test needed beyond the build/typecheck gate itself.

---

#### E1-F1-S2 — Configure Tailwind CSS and Framer Motion

**Story:** As a developer, I want Tailwind CSS and Framer Motion installed and configured, so that components can be styled consistently and support scroll-triggered animation.

**Points:** 2 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Tailwind CSS installed and configured for the App Router, compiling with no errors
- [x] Tailwind config extended with placeholder theme extension points (colors/fonts to be wired to design tokens in E1-F2-S2)
- [x] Framer Motion installed and a smoke-test animated component renders without hydration errors
- [x] Global stylesheet (`globals.css`) wired into root layout

**QA notes (2026-08-18):** `bun run build` compiles Tailwind v4 with no errors; `tests/unit/components/ScrollReveal.test.tsx` renders a Framer Motion component with no hydration/console errors and verifies `prefers-reduced-motion` fallback; `globals.css` confirmed imported in `src/app/layout.tsx`.

---

#### E1-F1-S3 — Configure environment variables and .env.example

**Story:** As a developer, I want all required environment variables documented and defaulted safely, so that the site builds correctly in any environment before real values are supplied.

**Points:** 1 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `.env.example` documents all 5 vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DISCORD_WEBHOOK_URL`, `NEXT_PUBLIC_BOOKING_URL`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `NEXT_PUBLIC_GA_ID`
- [x] Required vars (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DISCORD_WEBHOOK_URL`, `NEXT_PUBLIC_BOOKING_URL`) have safe placeholder defaults so build does not fail without real values
- [x] Optional vars (`NEXT_PUBLIC_GOOGLE_VERIFICATION`, `NEXT_PUBLIC_GA_ID`) are read defensively (no crash when unset)
- [x] A small typed accessor/helper for env vars exists so pages don't read `process.env` ad hoc

**QA notes (2026-08-18):** `tests/unit/lib/env.test.ts` (11 tests) verifies all placeholder fallbacks, whitespace handling, trailing-slash stripping, optional-var defensive reads, and placeholder-detection logic; `tests/unit/security/security.test.ts` confirms no other source file reads `process.env.NEXT_PUBLIC_*` ad hoc outside `src/lib/env.ts`.

---

### Feature 1.2: Theming & Design Tokens

---

#### E1-F2-S1 — Define light/dark color palette and design tokens

**Story:** As a founder visiting the site, I want a clean, bold, product-grade visual language (light-default SaaS look with a dark "dev-brand" toggle), so that the site itself demonstrates the marketing-site-build service.

**Points:** 3 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `ui-design-agent`

**Acceptance Criteria:**
- [x] New palette and token set defined (not copied from the `portfolio/` project) covering background, surface, text, border, and a single accent color for both light and dark themes
- [x] Light theme specified as the default: light background, bold Space Grotesk headings, generous whitespace, single accent color
- [x] Dark theme specified as a "bold dev-brand" variant: dark background, stronger accent glow
- [x] Token spec documented in a form consumable as CSS custom properties (name/value pairs per theme)
- [x] Typography scale (heading sizes, body sizes, mono usage for pricing/labels) documented alongside the color tokens

**QA notes (2026-08-18):** `docs/design-system.md` §4 documents a distinct "Spec Sheet / Blueprint" palette/type scale (not the portfolio's), correctly implemented 1:1 in `src/app/globals.css`. All checkboxes are about the spec's existence/content, which is satisfied. **However**, §7's blanket claim "all token pairs above verified ≥4.5:1 for text use" is **inaccurate**: `--color-text-tertiary` (`#8a9099` light / `#5e6b80` dark) only clears ~3.2:1–3.4:1 against `--color-bg`/`--color-surface` in both themes — well short of 4.5:1 AA for normal text. This was caught exactly where the doc itself says it should be caught ("a strong starting point, not a substitute for automated QA in E6-F1-S3") — see E6-F1-S3's QA notes for the live-browser-confirmed downstream failures in `Footer`/`ServiceCard`/`PricingCard`. Not blocking this story (no AC checkbox claims contrast verification), but §7's wording should be corrected to scope the ≥4.5:1 claim to `text-primary`/`text-secondary`/`accent`, not `text-tertiary`.

---

#### E1-F2-S2 — Implement theming mechanism (CSS custom properties + toggle)

**Story:** As a visitor, I want to toggle between light and dark themes with no flash of incorrect theme, so that the site feels polished on first load and on demand.

**Points:** 5 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] CSS custom properties implemented for both themes per the E1-F2-S1 token spec, resolved via a `data-theme` attribute on `<html>`
- [x] Blocking inline script added in `layout.tsx` that sets `data-theme` before first paint (no flash of unstyled/wrong theme)
- [x] Light is the default theme when no preference is stored
- [x] `ThemeToggle` component implemented; theme preference persists across reloads
- [x] A `mounted` guard is applied to any component with theme-dependent branching to avoid hydration mismatches

**QA notes (2026-08-18):** `tests/unit/lib/theme.test.ts` and `tests/unit/components/ThemeToggle.test.tsx` cover the init script, storage read/write, and accessible toggle. Live-browser E2E (`tests/e2e/theme.spec.ts`, 4 tests, all passing): defaults to light with no stored preference; toggling persists `data-theme="dark"` through a full `domcontentloaded` reload with no flash (asserted before React hydrates); persists across route navigation; and a pre-seeded `localStorage` dark preference is already applied at first paint on a fresh page load. `useSyncExternalStore` (server snapshot `"light"`) confirmed as the hydration-safe equivalent of a manual `mounted` guard.

---

#### E1-F2-S3 — Implement typography system with next/font

**Story:** As a visitor, I want consistent, on-brand typography across the site, so that the site reads as a polished product rather than a résumé.

**Points:** 2 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Inter loaded via `next/font` as the body font
- [x] Space Grotesk loaded via `next/font` as the heading font
- [x] JetBrains Mono loaded via `next/font` and used sparingly only for pricing figures and small labels, not as a dominant motif
- [x] Font variables wired into Tailwind config and applied via root layout classes

**QA notes (2026-08-18):** Verified by code inspection of `src/app/layout.tsx` (all 3 fonts loaded via `next/font/google` with CSS variables) and `src/app/globals.css` (`@theme inline` maps `--font-sans`/`--font-heading`/`--font-mono` to the loaded variables). Confirmed mono usage is scoped to `.font-mono-figure` (pricing) and `.font-mono-annotation` (small labels) only — grep of `src/` found no other mono usage. `bun run build` confirms fonts resolve with no build-time errors.

---

### Feature 1.3: Global Layout & Navigation Components

---

#### E1-F3-S1 — Design global navigation and footer UX

**Story:** As a founder browsing the site, I want clear, consistent navigation and a trustworthy footer on every page, so that I can find services, proof of work, pricing, and contact quickly.

**Points:** 3 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `ui-design-agent`

**Acceptance Criteria:**
- [x] Nav layout specified with items Home / Services / Work / About / Pricing / Contact plus a persistent "Book a call" button
- [x] Responsive/mobile nav behavior specified (collapsed menu pattern)
- [x] Footer content and layout specified: contact info, LinkedIn (`linkedin.com/in/gonsquared`), GitHub (`github.com/gonsquared`), link to the personal portfolio site, trust-signal line, copyright
- [x] Visual spec is consistent with the light/dark tokens from E1-F2-S1

**QA notes (2026-08-18):** `docs/design-system.md` §5 fully specifies desktop/mobile nav (including the dialog/focus-trap requirements later verified in E1-F3-S2's E2E tests) and the 4-column footer with `// SITE`/`// CONNECT`/`// TRUST` columns. Spec content is satisfied and was correctly implemented by frontend-coding-agent. Flagging one downstream implementation defect for visibility even though it doesn't fail this spec-authoring story: the footer eyebrow labels and copyright line were implemented using `--color-text-tertiary`, which (per E1-F2-S1's QA notes) fails WCAG AA contrast — see E1-F3-S3.

---

#### E1-F3-S2 — Build global Nav component

**Story:** As a visitor, I want a persistent site navigation bar, so that I can move between pages and reach the booking CTA from anywhere.

**Points:** 3 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Nav renders links to Home, Services, Work, About, Pricing, Contact per E1-F3-S1
- [x] Persistent "Book a call" button renders using `NEXT_PUBLIC_BOOKING_URL`
- [x] Mobile/responsive collapsed menu implemented and keyboard/screen-reader accessible
- [x] Active route is visually indicated
- [x] Nav is included in the root layout so it appears on all 11 routes

**QA notes (2026-08-18):** `tests/unit/components/Nav.test.tsx` (5 tests) + `tests/unit/components/MobileNavPanel.test.tsx` (11 tests, incl. focus-trap Tab/Shift+Tab wrap and Esc-returns-focus) all pass. Live-browser E2E `tests/e2e/mobile-nav.spec.ts` (3 tests) confirms the hamburger opens a real `role="dialog"`/`aria-modal="true"` panel, Esc closes and returns focus to the trigger, and the booking CTA/hamburger stay visible on the bar. `Nav` renders in `src/app/layout.tsx` (all 14 pages).

---

#### E1-F3-S3 — Build global Footer component

**Story:** As a visitor, I want a footer with contact and trust information, so that I can verify credibility and find additional ways to connect.

**Points:** 2 | **Sprint:** 1 | **Status:** `In Progress` | **QA Status:** `Fail` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Footer renders contact info, LinkedIn, GitHub links, and a link to the personal portfolio site
- [ ] Trust-signal line and copyright render per E1-F3-S1 spec
- [x] Footer is included in the root layout so it appears on all 11 routes
- [x] All external links open safely (`rel="noopener noreferrer"`, `target="_blank"` where appropriate)

**QA notes — FAIL (2026-08-18):** `tests/unit/components/Footer.test.tsx` (5 tests) passes for content/links/landmarks. **However**, the live-browser accessibility audit (`tests/e2e/accessibility.spec.ts`, real Chromium + axe-core) found a real, reproducible **`serious`-impact `color-contrast` WCAG AA violation on every one of the 14 routes**, sourced entirely from `src/components/layout/Footer.tsx`: the `// SITE` / `// CONNECT` / `// TRUST` eyebrow labels and the `© 2026 DG DevWorks…` copyright line all use `text-text-tertiary`, which axe measured at **3.21:1 in light theme and 3.16–3.42:1 in dark theme** against their respective backgrounds — both well under the required 4.5:1 for 12px text. Confirmed independently via `tests/unit/accessibility/contrast.test.ts`'s WCAG contrast-ratio math against the raw token values in `src/app/globals.css`. **Fix:** in `src/components/layout/Footer.tsx`, change the 4 `text-text-tertiary` usages (eyebrow labels + copyright) to `text-text-secondary` (or introduce a new token specifically calibrated to ≥4.5:1 for both themes) — `text-tertiary` should be reserved for genuinely decorative/non-text use only, consistent with how `--color-accent-bright` is already scoped in `docs/design-system.md`. Re-checking off the "Trust-signal line and copyright render" checkbox pending this fix, since the copyright/trust line currently renders in a non-compliant color. All other ACs remain satisfied.

---

#### E1-F3-S4 — Build reusable UI component library primitives

**Story:** As a developer, I want a small library of reusable UI primitives, so that pages can be built quickly and consistently without duplicating markup.

**Points:** 5 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `src/components/ui/` contains Button, Card, and Section/Container primitives styled from the design tokens
- [x] A scroll-triggered fade/slide-on-scroll-into-view animation wrapper (Framer Motion) is implemented and reusable across pages
- [x] Primitives are built new for this project (not imported from `portfolio/`) per the spec's separate-repo requirement
- [x] Components are typed (TypeScript props) and documented with basic usage examples in code comments

**QA notes (2026-08-18):** `tests/unit/components/Button.test.tsx` (5 tests, incl. external-link `rel`/`target` safety), `tests/unit/components/Card-Section.test.tsx` (4 tests), and `tests/unit/components/ScrollReveal.test.tsx` (2 tests, incl. reduced-motion) all pass. None of these primitives themselves consume `text-text-tertiary`, so they're unaffected by the E1-F3-S3 contrast defect — that defect lives in page-composite consumers (`Footer`, `ServiceCard`, `PricingCard`), not the primitives library.

---

### Feature 1.4: Portfolio Disclosure Modal

> New feature (added 2026-08-18): a first-load popup modal disclosing that this is a portfolio project, with a link to the contact path, so visitors understand the site's context and can reach the owner immediately if interested.

---

#### E1-F4-S1 — Design portfolio disclosure modal UX & accessibility spec

**Story:** As a visitor landing on the site, I want a clear, unobtrusive disclosure that this is a portfolio project with an easy way to reach the owner, so that I understand the site's context immediately without it feeling like a blocking ad-style popup.

**Points:** 2 | **Sprint:** 5 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `ui-design-agent`

**Acceptance Criteria:**
- [x] Modal copy, layout, and visual style specified in `docs/design-system.md`, consistent with the existing "Spec Sheet / Blueprint" tokens and motion conventions
- [x] Trigger timing and dismissal-persistence behavior specified — **resolved:** `sessionStorage`-scoped dismissal (shows once per browser session, does not reappear on subsequent route navigation); fails open (shows the modal) if `sessionStorage` throws
- [x] Contact link target scoped — **resolved:** direct `Link href="/contact"`. The site has no in-page contact section outside `/contact` itself, and `/contact` is already the canonical destination used by `CTABand`, `Footer`, and `MobileNavPanel`
- [x] Spec states which route(s) the modal renders on — **resolved:** sitewide, mounted in the root layout (`src/app/layout.tsx`) as a sibling of `<Nav />`, gated by the sessionStorage check. Reasoning: most real visits enter through routes other than `/` (SEO-crawled marketing site), so a home-only mount would silently skip the disclosure for direct/deep-linked visitors
- [x] Dialog accessibility spec documented, reusing the mobile nav panel's proven pattern from `docs/design-system.md` §5/§7: `role="dialog"`, `aria-modal="true"`, accessible name via `aria-labelledby`/`aria-describedby`, focus trapped while open, background inerted (3 landmarks: header/main/footer), `Esc` closes and returns focus to the pre-open `document.activeElement`, and a `prefers-reduced-motion` fallback (instant opacity-only, no transform)

**Note (ui-design-agent):** Full spec written to `docs/design-system.md` §9 ("Portfolio disclosure modal"), including exact disclosure copy, component tree, token usage, and an implementation handoff list for E1-F4-S2. Status left at `In Progress` rather than `Done` — per this tracker's Definition of Done, only `qa-agent` sets a story's Status to `Done`/QA Status to `Pass`; qa-agent should verify against §9 before closing this out. One net-new implementation detail beyond the original ACs: the modal needs to inert `Footer` in addition to `Nav`/`main`, which requires adding `id="site-footer-content"` to `Footer.tsx`'s root element (flagged in the §9 handoff list for E1-F4-S2).

**QA notes (2026-08-19, qa-agent):** Spec-conformance check against the shipped E1-F4-S2 implementation (`src/components/layout/PortfolioDisclosureModal.tsx`, `src/data/portfolioDisclosure.ts`) — verbatim match on every point checked: disclosure copy (eyebrow/heading/body/CTAs/close-button `aria-label`, word-for-word), the `sessionStorage` key `"dgdevworks-portfolio-disclosure-dismissed"` and fail-open try/catch behavior on both read and write, the 300ms open delay, the 180ms backdrop / 200ms panel motion durations and exact `{opacity:0, scale:0.96, y:8}` initial values, the reduced-motion opacity-only fallback (confirmed live in a real browser via `page.emulateMedia({reducedMotion:'reduce'})` — no `transform` is applied), the three inerted landmark ids (`site-header-content`/`main-content`/`site-footer-content`), reuse of `MobileNavPanel`'s exact `FOCUSABLE_SELECTOR`/Tab-trap logic, the `card-bracket` + `bg-surface`/`border-border` styling tokens, and the root-layout sitewide mount as a sibling of `<Nav />`. No deviations found. Spec is internally consistent and fully implemented as written — no route-back needed. Setting `Status: Done`, `QA Status: Pass`.

---

#### E1-F4-S2 — Build PortfolioDisclosureModal component

**Story:** As a visitor, I want the portfolio-disclosure modal to appear on page load and let me either dismiss it or jump straight to contacting the owner, so that I can act on it without friction.

**Points:** 5 | **Sprint:** 5 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Modal renders at the start of page load per the route scope decided in E1-F4-S1
- [x] Modal is dismissible via a visible close control, the `Esc` key, and clicking outside the dialog
- [x] Modal implements the accessible dialog pattern specified in E1-F4-S1 (`role="dialog"`, `aria-modal="true"`, labeled, focus trapped while open, background inerted, focus returned on close), matching the existing `MobileNavPanel` implementation approach
- [x] Modal includes a working link/button to the contact destination (`/contact` or in-page anchor) per the E1-F4-S1 scoping decision
- [x] Modal respects `prefers-reduced-motion` (instant show/hide, no transform/animation), consistent with the rest of the site's motion conventions
- [x] Dismissal persists per the E1-F4-S1 spec (e.g. a `sessionStorage` flag) so the modal does not repeatedly interrupt the same browsing session

**QA notes (2026-08-19, qa-agent):** All 6 ACs verified against `docs/design-system.md` §9 and confirmed via new automated coverage (`tests/unit/components/PortfolioDisclosureModal.test.tsx`, `tests/e2e/portfolio-disclosure-modal.spec.ts`, and the modal-open block appended to `tests/e2e/accessibility.spec.ts`) — see E1-F4-S3 below for the full list of tests. Security check (per this story's low-risk surface, docs/design-system.md §9 "Security notes"): confirmed "Get in touch" is a plain internal `Link href="/contact"` with no query string (`cta.getAttribute("href")` asserted to not match `/[?&]/` in both the unit test and a manual read of `PortfolioDisclosureModal.tsx`) — no open-redirect-shaped pattern, no tracking params, no secrets/tokens anywhere in this component. One regression caught and fixed during this QA pass (see Changelog): the modal's sitewide, ~300ms-after-load auto-open behavior — while itself correct per spec — was intercepting pointer events and inerting the header in 3 pre-existing E2E specs (`accessibility.spec.ts`'s contrast test, `mobile-nav.spec.ts`, `navigation.spec.ts`) that predate this feature and don't expect a modal to appear. Fixed by adding `tests/e2e/fixtures.ts` (a shared Playwright fixture that pre-seeds the modal's sessionStorage dismissal flag) and switching all pre-existing specs that interact with page content shortly after `page.goto()` to import from it instead of `@playwright/test` directly. No product code changes were needed — this was purely a test-suite adaptation to a legitimately new sitewide UI element. Setting `Status: Done`, `QA Status: Pass`.

---

#### E1-F4-S3 — Write tests for portfolio disclosure modal

**Story:** As a maintainer, I want automated coverage of the portfolio disclosure modal, so that its first-load behavior, accessibility, and dismissal persistence don't regress.

**Points:** 3 | **Sprint:** 5 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `qa-agent`

**Acceptance Criteria:**
- [x] Unit test verifies the modal renders on initial load and is dismissible via close control and `Esc`, with focus trapped while open
- [x] Unit test verifies the contact link/button targets the correct destination per the E1-F4-S1 scoping decision
- [x] Live-browser E2E test verifies the modal appears on first page load and that dismissal persists for the rest of the session per the E1-F4-S1 spec (no reappearance on subsequent in-session navigation)
- [x] Automated accessibility scan (axe) on the modal's open state finds no critical/serious violations, and the `prefers-reduced-motion` fallback is verified
- [x] Full existing test suite (unit + E2E) still passes with no regressions to nav, footer, theme, or SEO/Lighthouse checks already enforced elsewhere in the suite

**QA notes (2026-08-19, qa-agent):** Added `tests/unit/components/PortfolioDisclosureModal.test.tsx` (16 tests: open-after-delay, stays closed when already dismissed, exact copy + `/contact` CTA with no query-string, initial focus on close button, dismissal via close/Esc/backdrop/"Continue browsing" all persisting the `sessionStorage` flag, click-inside-panel does NOT dismiss, Tab and Shift+Tab focus-trap wrap-around, 3-landmark inert/aria-hidden + restore, body-scroll lock + restore, and two fail-open tests for `sessionStorage.getItem`/`setItem` throwing). Added `tests/e2e/portfolio-disclosure-modal.spec.ts` (11 tests: appears on `/` and on a second route `/pricing`, dismissible via close/backdrop/Esc, real-browser Tab focus trap, 3-landmark inert verified via role-query exclusion, "Get in touch" navigates to `/contact`, dismissal persists across 6 in-session route changes, dismissal is session-scoped only (new browser context sees it again), and a live-browser fail-open check for `sessionStorage.setItem` throwing). Extended `tests/e2e/accessibility.spec.ts` with a new block (4 tests) that forces the modal open (fresh, non-dismissed session) and axe-scans it on both `/` and `/services` — **0 critical/serious violations found on either route** — plus a `page.emulateMedia({reducedMotion:'reduce'})` test asserting the panel's computed `transform` is `none`/identity (no scale/translate applied) and `opacity: 1`, confirming the reduced-motion fallback. Also added `tests/e2e/fixtures.ts` (see E1-F4-S2 QA notes) to keep the pre-existing suite regression-free against the new sitewide modal. **Regression baseline (before this pass):** unit 158/158 (documented last-known-good); first E2E run against the newly-merged modal came back 41/44 (3 failing: the 1 pre-existing known `mobile-nav.spec.ts` focus-trap defect + 2 new modal-caused regressions in `accessibility.spec.ts`'s contrast test and `navigation.spec.ts`'s critical-flow test, both traced to the modal's backdrop intercepting clicks / inerting the header before those specs expected it). **After adding `tests/e2e/fixtures.ts` and this story's new tests:** unit 174/174 (158 baseline + 16 new, 0 failures), E2E 58/59 (44 baseline + 15 new, only the 1 pre-existing `mobile-nav.spec.ts` focus-trap failure remains — confirmed pre-existing per prior session's `git stash` reproduction on unmodified `master`, unrelated to this feature, left untouched and out of scope). No new regressions. Setting `Status: Done`, `QA Status: Pass`.

---

## Epic 2: Content Data Layer

> Centralizes all site copy and business facts as typed TypeScript data files, so every page renders from a single, CMS-free source of truth.

### Feature 2.1: Typed Data Models

---

#### E2-F1-S1 — Define and populate src/data/services.ts

**Story:** As a content maintainer, I want the four services modeled as typed data, so that the services index and detail pages render consistently from one source.

**Points:** 3 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `src/data/services.ts` exports an array of 4 entries matching `{ slug, title, summary, includes: string[], process: string[], idealClient, priceLabel, relatedCaseStudySlugs: string[] }`
- [x] Slugs match the spec exactly: `mvp-development`, `marketing-sites`, `modernization`, `fractional`
- [x] Copy reflects the four offerings described in the spec (MVP/product build, marketing/landing site build, legacy modernization/migration, fractional/embedded senior engineer)
- [x] `relatedCaseStudySlugs` on each service matches the primary/secondary service-link mapping table in the spec
- [x] Data is fully typed (no `any`) and exported for use by both index and `[slug]` pages

**QA notes (2026-08-18):** `tests/unit/data/services.test.ts` (6 tests) verifies exact slug set, shape/non-empty fields, cross-reference resolution against `caseStudies.ts`, `getServiceBySlug` behavior, and no duplicate slugs. `tests/unit/data/caseStudies.test.ts`'s mapping-table test independently confirms the exact primary/secondary spec table is honored.

---

#### E2-F1-S2 — Define and populate src/data/caseStudies.ts

**Story:** As a content maintainer, I want the four employer projects reframed as case studies in typed data, so that `/work` pages demonstrate proof of work without exposing confidential specifics.

**Points:** 5 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `src/data/caseStudies.ts` exports an array of 4 entries matching `{ slug, title, challenge, approach, impact: string[], relatedServiceSlugs: string[] }`
- [x] Slugs match the spec exactly: `bank-platform-modernization`, `hardware-brand-partner-portals`, `retail-pos-platform`, `stock-exchange-data-migration`
- [x] Each case study is written in challenge/approach/impact format per the source-project mapping table, with no proprietary UI screenshots referenced, no internal system names beyond what's already public, and no client data
- [x] `relatedServiceSlugs` on each case study matches the primary/secondary service-link mapping table in the spec
- [x] Copy is data-only (no hardcoded JSX text duplicating this content elsewhere)

**QA notes (2026-08-18):** `tests/unit/data/caseStudies.test.ts` (6 shape/content tests + a dedicated "cross-link mapping table" describe block, 2 tests) transcribes the spec's exact primary/secondary table (`docs/superpowers/specs/2026-08-18-dgdevworks-marketing-site-design.md` lines 30–35) and asserts `relatedServiceSlugs` matches it **exactly, in order**, for all 4 case studies, plus verifies the mirror-image (`services.ts` links back). All pass — e.g. `bank-platform-modernization` → `["modernization", "fractional"]` confirmed exactly. Confidentiality check (no "confidential"/"internal use only"/PII markers) also passes.

---

#### E2-F1-S3 — Define and populate src/data/pricing.ts

**Story:** As a content maintainer, I want pricing modeled as typed data, so that the pricing snapshot and full pricing page stay in sync from one source.

**Points:** 2 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `src/data/pricing.ts` exports `{ hourlyRate: number, packages: Array<{ slug, name, priceLabel, timeframe, rangeNote }> }`
- [x] `hourlyRate` set to the placeholder value of 90
- [x] Four packages populated with the spec's placeholder values (marketing/landing site $3,500–$6,500; MVP/product build starting at $12,000; legacy modernization starting at $8,000/custom quote; fractional $3,500–$7,000/mo) and matching timeframes/range notes
- [x] Values are clearly placeholders per the spec's Open Items (a code comment flags these as pending confirmation)

**QA notes (2026-08-18):** `tests/unit/data/pricing.test.ts` (4 tests) confirms `hourlyRate === 90`, all 4 package price labels match the spec's placeholder figures exactly, and no duplicate slugs. Code comment in `src/data/pricing.ts` flags the values as placeholders pending confirmation.

---

#### E2-F1-S4 — Define and populate src/data/business.ts

**Story:** As a content maintainer, I want brand and contact facts modeled as typed data, so that positioning copy, contact links, and social links are consistent sitewide.

**Points:** 2 | **Sprint:** 1 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `src/data/business.ts` exports brand name ("DG DevWorks"), tagline/positioning copy per the spec ("built by Daryll, senior full-stack engineer for founders", "I build your product and the marketing site that sells it"), contact/booking URLs, and social links (LinkedIn, GitHub, portfolio site)
- [x] Booking URL reads from `NEXT_PUBLIC_BOOKING_URL`
- [x] Data is consumed by Nav, Footer, Home, and About pages instead of duplicated inline copy
- [x] Data is fully typed and exported

**QA notes (2026-08-18):** `tests/unit/data/business.test.ts` (6 tests) confirms brand name, positioning copy language, valid booking URL, exact social-link URLs, valid contact email, and the exact E5-F1-S3 trust-line copy. Code inspection confirms `Nav`, `Footer`, `AboutStory`, and `ContactPage` all import from `business.ts` rather than duplicating copy.

---

## Epic 3: Core Pages & Routing

> Delivers all 11 pre-rendered static routes described in the spec, each built from the typed content data and shared layout/UI components.

### Feature 3.1: Home & Services Pages

---

#### E3-F1-S1 — Build Home page (/)

**Story:** As a startup founder landing on the site, I want an immediate, clear pitch with paths into services, proof, and pricing, so that I can quickly decide whether to explore further or book a call.

**Points:** 5 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Hero section renders the positioning statement and a primary CTA
- [x] Services overview renders 4 cards (sourced from `services.ts`) linking to each service detail page
- [x] Proof snapshot section highlights case studies (sourced from `caseStudies.ts`) with links to `/work`
- [x] Pricing snapshot section links to `/pricing`
- [x] Secondary CTA section renders at the end of the page (dual CTA: "Book a call" / "Send a message")

**QA notes (2026-08-18):** Verified via `tests/e2e/navigation.spec.ts` (home → service → case study → back flow, all top-level nav 200s with no console errors), `tests/e2e/booking-cta.spec.ts` (dual CTA band present), and `tests/e2e/seo.spec.ts` (unique metadata/JSON-LD). All ACs satisfied. Note: this page renders the sitewide `Footer` (see E1-F3-S3 — Fail) and `ServiceCard`/`PricingCard` (both use the same non-compliant `text-text-tertiary` token for price/timeframe labels) — tracked once under E1-F3-S3/E6-F1-S3 rather than duplicated here, since the fix is a single shared-token/usage change, not page-specific work.

---

#### E3-F1-S2 — Build Services index page (/services)

**Story:** As a founder evaluating options, I want to see all services at a glance, so that I can pick the one relevant to my need.

**Points:** 3 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Page lists all 4 services sourced from `services.ts`, each with a short summary and a link to its detail page
- [x] Page renders with no runtime data fetching (static content only)
- [x] Layout uses shared UI primitives (Card/Section) from E1-F3-S4

**QA notes (2026-08-18):** Confirmed static-only rendering (no `"use client"`/fetch in `src/app/services/page.tsx`), 4 `ServiceCard`s render via `tests/e2e/accessibility.spec.ts`/`seo.spec.ts` route coverage, and `Section`/`Card` primitives used per code review. Inherits the same `ServiceCard` `text-text-tertiary` finding tracked under E1-F3-S3/E6-F1-S3 (not duplicated here).

---

#### E3-F1-S3 — Build Service detail page template (/services/[slug])

**Story:** As a founder considering a specific service, I want a detailed page for that service, so that I understand what's included, the process, and whether it fits my situation.

**Points:** 5 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `generateStaticParams()` enumerates all 4 service slugs at build time; all 4 pages pre-render
- [x] Page renders what's included, process/timeline, ideal client profile, and package price from `services.ts`
- [x] Related case studies (via `relatedCaseStudySlugs`) render with links to `/work/[slug]`
- [x] Dual CTA renders at the end of the page ("Book a call" primary, "Send a message" secondary)
- [x] Invalid slugs produce a proper not-found result (no runtime crash)

**QA notes (2026-08-18):** `bun run build` confirms all 4 `/services/[slug]` pages pre-render (`● /services/{mvp-development,marketing-sites,modernization,fractional}`). `tests/e2e/navigation.spec.ts` confirms `/services/does-not-exist` returns HTTP 404 with a rendered (not crashed) not-found page — `dynamicParams = false` correctly enforced. `tests/unit/accessibility/pages-axe.test.tsx` renders all 4 slugs with no critical/serious violations. Dual CTA (`CTABand`) confirmed via `tests/e2e/booking-cta.spec.ts`.

---

### Feature 3.2: Work / Case Studies Pages

---

#### E3-F2-S1 — Build Work index page (/work)

**Story:** As a founder assessing credibility, I want to browse proof-of-work case studies, so that I can judge relevant experience before reaching out.

**Points:** 3 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Page renders 4 case study cards sourced from `caseStudies.ts`
- [x] Each card links to its `/work/[slug]` detail page
- [x] Cards use abstract/illustrative visuals (diagrams, stat call-outs, gradients), not real product screenshots
- [x] Layout uses shared UI primitives from E1-F3-S4

**QA notes (2026-08-18):** `tests/unit/components/AbstractVisual.test.tsx` (3 tests) confirms an `<svg role="img">` renders (never an `<img>`/raster screenshot) deterministically per slug for all 4 case studies. Route coverage confirmed via `tests/e2e/accessibility.spec.ts` and `seo.spec.ts`.

---

#### E3-F2-S2 — Build Case study detail page template (/work/[slug])

**Story:** As a founder reading a case study, I want a challenge/approach/impact narrative cross-linked to the relevant service, so that I can connect proof of work to the service I'd hire for.

**Points:** 5 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `generateStaticParams()` enumerates all 4 case study slugs at build time; all 4 pages pre-render
- [x] Page renders challenge, approach, and impact content from `caseStudies.ts`
- [x] Page cross-links to related service page(s) via `relatedServiceSlugs`, matching the spec's mapping table
- [x] Abstract/illustrative visuals used, no proprietary screenshots or client data
- [x] Invalid slugs produce a proper not-found result (no runtime crash)

**QA notes (2026-08-18):** `bun run build` confirms all 4 `/work/[slug]` pages pre-render. `tests/e2e/navigation.spec.ts` confirms `/work/does-not-exist` returns 404 with a rendered not-found page (no crash), and confirms the case-study → related-service cross-link click-through works end to end. Cross-link accuracy independently verified against the spec's mapping table via `tests/unit/data/caseStudies.test.ts`.

---

### Feature 3.3: About, Pricing, Contact Pages

---

#### E3-F3-S1 — Build About page (/about)

**Story:** As a founder deciding whether to trust this person with my project, I want to read Daryll's story and the DG DevWorks framing, so that I feel confident in his background before booking a call.

**Points:** 3 | **Sprint:** 2 | **Status:** `In Progress` | **QA Status:** `Fail` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Page renders Daryll's story and DG DevWorks brand framing sourced from `business.ts` and page-level copy
- [x] Trust-building narrative is explicitly aimed at founders (not agencies/local businesses) per positioning
- [ ] Page links to the personal portfolio site for deeper technical credibility
- [x] Layout uses shared UI primitives and theming from Epic 1

**QA notes — FAIL (2026-08-18):** Content/copy/theming ACs are satisfied. **However**, the live-browser accessibility audit (`tests/e2e/accessibility.spec.ts`) found a real, reproducible **`serious`-impact `link-in-text-block` WCAG 1.4.1 (Use of Color) violation on `/about`**: `src/components/AboutStory.tsx`'s inline "personal portfolio" link (`text-accent hover:text-accent-hover`, no underline, embedded mid-paragraph in `text-text-secondary` body copy) has a measured **1.12:1 contrast ratio against its surrounding text** — axe requires ≥3:1 for a link to be distinguishable from body text by color alone, and with no underline/weight/other non-color cue, this link is not reliably identifiable as a link, especially for colorblind or low-vision users. (This was isolated from an initial false-positive caused by scanning mid-`ScrollReveal`-fade-in DOM state — re-verified after settling all scroll animations before scanning, and it reproduces consistently.) **Fix:** in `src/components/AboutStory.tsx`, add `underline underline-offset-2` (or an equivalent non-color affordance) to the inline "personal portfolio" link, in addition to (or instead of relying solely on) the accent color change. Re-checking off "Page links to the personal portfolio site" pending this fix — the link exists and is functionally correct, but fails the accessible-distinguishability bar.

---

#### E3-F3-S2 — Build Pricing page (/pricing)

**Story:** As a founder budgeting for a project, I want to see all packages, the hourly rate, and why prices vary, so that I can gauge fit before reaching out.

**Points:** 5 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Page renders all 4 packages and the hourly rate sourced from `pricing.ts`
- [x] "Why the range" explanatory notes render per package
- [x] An "indicative pricing, pending a scoping call" disclaimer renders prominently on the page
- [x] A pricing FAQ section renders (content to back the FAQPage JSON-LD added in E4-F3-S3)
- [x] Dual CTA renders at the end of the page

**QA notes (2026-08-18):** `tests/e2e/seo.spec.ts`'s FAQPage JSON-LD test confirms the pricing FAQ's structured data matches the visible `FAQAccordion` content exactly (first question visible on page). `tests/e2e/booking-cta.spec.ts` confirms the dual CTA band. Disclaimer banner and per-package `rangeNote` confirmed via code review of `src/app/pricing/page.tsx` + `src/data/pricing.ts` test coverage.

---

#### E3-F3-S3 — Build Contact page shell (/contact)

**Story:** As a founder ready to reach out, I want a contact page with a clear form and booking option, so that I can choose the fastest way to connect.

**Points:** 2 | **Sprint:** 2 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Page layout renders a placeholder region for the contact form (functional form logic delivered in E5-F1-S1/S2) and a booking CTA using `NEXT_PUBLIC_BOOKING_URL`
- [x] Page includes a region for the trust-signal line (content delivered in E5-F1-S3)
- [x] Page includes an FAQ content region (to back the FAQPage JSON-LD added in E4-F3-S3)
- [x] Layout uses shared UI primitives and theming from Epic 1

**QA notes (2026-08-18):** By the time of this QA pass, E5-F1-S1/S2/S3 and E4-F3-S3 were already implemented, so `/contact` was tested as a fully functional page (see `tests/e2e/contact-form.spec.ts` and the FAQPage JSON-LD test in `seo.spec.ts`) rather than a bare shell — exceeds this story's original scope with no regressions.

---

## Epic 4: SEO, AEO & GEO

> Implements per-route metadata, sitemap/robots, Open Graph images, and structured data (JSON-LD), the concrete mechanism by which search engines and answer/LLM-based assistants can find, understand, and surface this site.

### Feature 4.1: Metadata & Sitemap

---

#### E4-F1-S1 — Implement generateMetadata per route

**Story:** As a site owner, I want every route to have a unique, accurate title and description, so that search results and shared links represent each page correctly.

**Points:** 5 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `generateMetadata()` implemented for all 11 routes (static routes and both dynamic `[slug]` route types) with unique title/description per page
- [x] Dynamic routes derive metadata from `services.ts`/`caseStudies.ts` content (no generic/duplicate titles across slugs)
- [x] Metadata includes canonical URL built from `NEXT_PUBLIC_SITE_URL`
- [x] No two routes share an identical `<title>` or meta description

**QA notes (2026-08-18):** `tests/unit/seo/metadata.test.ts` (5 tests) verifies all 14 pages produce unique titles/descriptions, canonical URLs built from `NEXT_PUBLIC_SITE_URL`, and dynamic routes deriving from data (not generic fallback). Independently re-verified live in-browser via `tests/e2e/seo.spec.ts` (title/description/canonical-link uniqueness across all 14 routes against the actual built HTML) — zero duplicates found either way.

---

#### E4-F1-S2 — Implement app/sitemap.ts and app/robots.ts

**Story:** As a site owner, I want a sitemap and robots file generated from the actual route list, so that search engines can discover every page and they can never drift out of sync with real pages.

**Points:** 2 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `app/sitemap.ts` statically generates entries for all 11 routes at build time, driven by the same slug lists used by `generateStaticParams()`
- [x] `app/robots.ts` allows crawling and references the sitemap using `NEXT_PUBLIC_SITE_URL`
- [x] Sitemap URLs use the canonical production domain from `NEXT_PUBLIC_SITE_URL`
- [x] Adding/removing a service or case study slug in the data layer automatically reflects in the sitemap without manual edits

**QA notes (2026-08-18):** `tests/unit/seo/sitemap-robots.test.ts` (8 tests) confirms exactly 14 sitemap entries (imports `services`/`caseStudies` directly, so it's data-driven by construction) and correct robots directives. Live-browser `tests/e2e/seo.spec.ts` confirms `/sitemap.xml` (200, exactly 14 `<loc>` entries) and `/robots.txt` (200, `Allow: /`, `Sitemap:` directive) against the actual built output.

---

### Feature 4.2: Open Graph Images

---

#### E4-F2-S1 — Implement root opengraph-image.tsx

**Story:** As a site owner, I want a branded social preview image for the site root, so that shared links look polished on social platforms and messaging apps.

**Points:** 3 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Root `opengraph-image.tsx` implemented, generating a static image at build time consistent with the site's brand/theme
- [x] Image reflects brand name and tagline from `business.ts`
- [x] Image renders correctly in a social preview validator (correct dimensions/format)

**QA notes (2026-08-18):** Confirmed `src/app/opengraph-image.tsx` renders `business.brandName`/`business.tagline` via `next/og`'s `ImageResponse`, `size = { width: 1200, height: 630 }` (correct OG dimensions), `contentType = "image/png"`. Verified the actual build output at `out/opengraph-image` is a real 1200×630 PNG (`file` command + PNG magic-byte check in `tests/e2e/seo.spec.ts`). See E6-F2-S1 notes for a caveat on verifying the `Content-Type` response header on an actual Vercel deployment (this extensionless static file's header couldn't be independently confirmed in this sandboxed environment).

---

#### E4-F2-S2 — Implement per-dynamic-route opengraph-image.tsx

**Story:** As a site owner, I want unique social preview images for each service and case study page, so that shared links to specific offerings/proof points look correct and distinct.

**Points:** 5 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `opengraph-image.tsx` implemented for `/services/[slug]` with `generateStaticParams()` covering all 4 service slugs
- [x] `opengraph-image.tsx` implemented for `/work/[slug]` with `generateStaticParams()` covering all 4 case study slugs
- [x] Each generated image reflects the specific service/case study title, not a generic fallback
- [x] All 8 dynamic OG images pre-render successfully in a static export build

**QA notes (2026-08-18):** `bun run build` output confirms all 8 dynamic OG images pre-render (`● /services/{slug}/opengraph-image` × 4, `● /work/{slug}/opengraph-image` × 4). Code review confirms each derives `title`/`priceLabel` (services) or the case study title from the data layer via `getServiceBySlug`/`getCaseStudyBySlug`, not a hardcoded fallback. `tests/e2e/seo.spec.ts` confirms all 8 respond 200 with valid PNG bytes against the actual static export.

---

### Feature 4.3: Structured Data (JSON-LD)

---

#### E4-F3-S1 — Implement Person/ProfessionalService JSON-LD sitewide

**Story:** As a site owner, I want structured data describing Daryll and DG DevWorks on every page, so that answer engines and LLM-based assistants can reliably surface who this business is and what it does.

**Points:** 3 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `Person`/`ProfessionalService` JSON-LD script injected in the root layout, present on all 11 routes
- [x] Structured data fields sourced from `business.ts` (name, brand, social links, contact)
- [x] JSON-LD validates with no schema errors in a structured-data testing tool
- [x] Script does not block rendering or cause hydration warnings

**QA notes (2026-08-18):** `tests/unit/seo/jsonld.test.ts` confirms the `@graph` contains valid `Person` + `ProfessionalService` nodes sourced from `business.ts` and serializes cleanly. `tests/unit/components/JsonLd.test.tsx` confirms the rendering component escapes `<` (XSS-safe `</script>`-breakout prevention) and produces valid JSON. Live-browser `tests/e2e/seo.spec.ts` confirms the block is present and parses on all 6 static routes with `console` error monitoring in `navigation.spec.ts` finding zero hydration warnings sitewide.

---

#### E4-F3-S2 — Implement Service JSON-LD schema on each service page

**Story:** As a site owner, I want each service page marked up with Service structured data, so that answer engines can accurately represent what each offering includes and costs.

**Points:** 2 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] `Service` JSON-LD rendered on each of the 4 `/services/[slug]` pages, sourced from `services.ts`
- [x] Schema includes service name, description, and price label
- [x] JSON-LD validates with no schema errors
- [x] Schema differs per slug (no duplicate/generic service markup across pages)

**QA notes (2026-08-18):** `tests/unit/seo/jsonld.test.ts` confirms all 4 `Service` schemas have distinct `name`/`description`/`offers.description` (price). Live-browser `tests/e2e/seo.spec.ts` confirms distinct `Service` JSON-LD names across all 4 `/services/[slug]` pages against the actual built HTML.

---

#### E4-F3-S3 — Implement FAQPage JSON-LD schema on /pricing and /contact

**Story:** As a site owner, I want FAQ content on pricing and contact marked up as FAQPage structured data, so that common questions can surface directly in answer-engine results.

**Points:** 3 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] FAQ content (question/answer pairs) authored for `/pricing` (e.g., pricing range rationale, scoping process) and `/contact` (e.g., response time, data use)
- [x] `FAQPage` JSON-LD rendered on both `/pricing` and `/contact`, matching the visible on-page FAQ content exactly
- [x] JSON-LD validates with no schema errors
- [x] FAQ content is consumed from a typed source rather than duplicated inline JSX/JSON-LD copies

**QA notes (2026-08-18):** `tests/unit/data/faq.test.ts` and `tests/unit/seo/jsonld.test.ts` confirm `pricingFaq`/`contactFaq` (`src/data/faq.ts`) are well-formed and that `faqPageJsonLd()` output matches the source exactly, question-for-question. `tests/unit/components/FAQAccordion.test.tsx` confirms the visible accordion is keyboard-operable and renders the same question text. Live-browser `tests/e2e/seo.spec.ts` confirms the JSON-LD's first question is visible on both `/pricing` and `/contact`.

---

#### E4-F3-S4 — Implement internal cross-linking between case studies and services

**Story:** As a founder reading proof of work, I want case studies linked to the services they demonstrate (and vice versa), so that I can move naturally from proof to the offering I'd purchase.

**Points:** 2 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Every case study page links to its primary (and secondary, where present) related service page per the spec's mapping table
- [x] Every service page links to its related case studies per `relatedCaseStudySlugs`
- [x] All cross-links resolve to valid, pre-rendered routes (no broken links)
- [x] Link mapping matches the spec's table exactly (e.g., `bank-platform-modernization` → `/services/modernization` primary, `/services/fractional` secondary)

**QA notes (2026-08-18):** `tests/unit/data/caseStudies.test.ts`'s dedicated mapping-table describe block transcribes the spec's exact table and asserts an exact, order-preserving match for all 4 case studies, plus verifies every link resolves to a real, existing service/case-study slug (no broken links possible, since both `getServiceBySlug`/`getCaseStudyBySlug` are exercised). Live click-through confirmed via `tests/e2e/navigation.spec.ts`.

---

## Epic 5: Contact & Conversion

> Implements the two conversion paths on the site: the Discord-webhook contact form and the "Book a call" CTA, consistent with the static-export, no-backend architecture.

### Feature 5.1: Contact Form

---

#### E5-F1-S1 — Build contact form UI with validation

**Story:** As a founder ready to reach out, I want a clear contact form with helpful validation, so that I can submit my inquiry confidently and correctly.

**Points:** 3 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Form renders on `/contact` with fields appropriate to a project inquiry (name, email, message, at minimum)
- [x] Client-side validation prevents submission of empty required fields or malformed email
- [x] Loading, success, and error states are visually distinct
- [x] Form is keyboard-accessible and labeled for screen readers

**QA notes (2026-08-18):** `tests/unit/components/ContactForm.test.tsx` (12 tests) covers labeled fields, empty-field validation, malformed-email rejection, boundary-length rejection (name ≥100 chars, message ≥3000 chars — security/input-validation cases), distinct loading (`disabled` "Sending…")/success/error states, and an `aria-live="polite"` status region. Live-browser `tests/e2e/contact-form.spec.ts` (6 tests) confirms the same behavior end to end plus keyboard Tab-order (honeypot unreachable).

---

#### E5-F1-S2 — Implement Discord webhook submission logic

**Story:** As a site owner, I want contact form submissions delivered to my Discord channel without a backend, so that I receive inquiries immediately while keeping the site fully static.

**Points:** 3 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] On submit, the form POSTs directly (client-side) to `NEXT_PUBLIC_DISCORD_WEBHOOK_URL`, no backend/API route involved
- [x] Submitted payload is formatted as a readable Discord message (embed or formatted content) including name/email/message
- [x] Success state confirms submission to the user; failure state surfaces a retry-friendly error message
- [x] Webhook URL missing/placeholder is handled gracefully (no unhandled exception, clear dev-time warning)

**QA notes (2026-08-18):** `tests/unit/lib/discord.test.ts` (7 tests, real `fetch` mocked — **the real Discord endpoint was never hit**) confirms: placeholder short-circuit with a dev-time `console.warn` and no `fetch` call; correct `POST ${url}?wait=true` with a well-formed embed payload (`Name`/`Email`/`Message` fields); HTTP 429 → `rate-limited`, 400/401/404 → `invalid`, other non-ok → `network`; and a rejected `fetch` (network failure) never throws, always resolving to a friendly failure reason. `tests/unit/security/security.test.ts` confirms the friendly error copy never contains `fetch`/stack-trace/HTTP-status language. Live-browser `tests/e2e/contact-form.spec.ts` intercepts `**/api/webhooks/**` via `page.route` (200/429/500 scenarios) and confirms success/rate-limited/generic-error UI states — again, the real `discord.com` webhook was never contacted.

---

#### E5-F1-S3 — Add trust-signal line near contact form

**Story:** As a founder wary of spam, I want a clear statement about how my information will be used, so that I feel safe submitting the contact form without a formal privacy policy page.

**Points:** 1 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Trust-signal line renders near the contact form: "Your info is only used to respond to your inquiry — no spam, no third parties."
- [x] No separate privacy policy/legal page is created (explicitly out of scope per spec Non-Goals)
- [x] Line is visible without requiring interaction (not hidden behind a tooltip/modal)

**QA notes (2026-08-18):** `tests/unit/data/business.test.ts` confirms `business.trustLine` matches the exact spec copy. Code review of `src/app/contact/page.tsx` confirms `<TrustLine className="mt-4">{business.trustLine}</TrustLine>` renders as plain visible text directly below the form (no tooltip/modal/disclosure). `find src/app -iname "*privacy*"` confirms no privacy-policy page exists.

---

### Feature 5.2: Booking CTA

---

#### E5-F2-S1 — Implement Book a call CTA sitewide

**Story:** As a founder ready to talk, I want a consistent "Book a call" CTA available wherever I might decide to convert, so that I can schedule time without hunting for a link.

**Points:** 2 | **Sprint:** 3 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] "Book a call" CTA reads `NEXT_PUBLIC_BOOKING_URL` and renders consistently in the nav, on the home page, on every service page, and on the contact page
- [x] Every service page and the home page end with a dual CTA: primary "Book a call", secondary "Send a message" (linking to `/contact`)
- [x] Placeholder booking URL value does not break the build or produce a dead link (opens a valid placeholder destination)
- [x] CTA styling is consistent with the design tokens from Epic 1

**QA notes (2026-08-18):** `tests/e2e/booking-cta.spec.ts` (3 tests) confirms the nav CTA is a safe (`target="_blank" rel="noopener noreferrer"`) external link with a valid `https://` href on every route checked (home, all 4 service pages, contact), and that the home page + a service page both end with a dual `CTABand` (primary "Book a call" + secondary "Send a message" → `/contact`). `tests/unit/lib/env.test.ts` confirms the placeholder booking URL (`https://cal.com/dgdevworks/placeholder`) is a syntactically valid URL, so it never produces a dead/malformed link.

---

## Epic 6: Quality, Deployment & Documentation

> Verifies the site meets its acceptance criteria end-to-end, configures the Vercel static-export deployment, and documents setup for future maintenance.

### Feature 6.1: Testing & QA

---

#### E6-F1-S1 — Write unit tests for data layer and key components

**Story:** As a maintainer, I want unit tests covering the typed content data and core UI components, so that regressions in content structure or shared components are caught early.

**Points:** 5 | **Sprint:** 4 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `qa-agent`

**Acceptance Criteria:**
- [x] Unit tests verify `services.ts`, `caseStudies.ts`, `pricing.ts`, and `business.ts` conform to their expected shapes and that all cross-referenced slugs (`relatedCaseStudySlugs`, `relatedServiceSlugs`) resolve to real entries
- [x] Unit tests cover Nav, Footer, ThemeToggle, and at least one UI primitive
- [x] Test suite runs in CI-equivalent local command with a documented script
- [x] All tests pass with no skipped/pending tests left unexplained

**QA notes (2026-08-18):** Vitest + React Testing Library + jsdom stack added (no prior test tooling existed). `bun run test` (documented in `package.json`) runs `tests/unit/**` — 25 test files, 153 tests, all passing, 0 skipped. `src/data/{services,caseStudies,pricing,business}.ts` covered in `tests/unit/data/*.test.ts` including full cross-reference resolution (`relatedCaseStudySlugs`/`relatedServiceSlugs`). `Nav`, `Footer`, `ThemeToggle`, `MobileNavPanel`, and `Button`/`Card`/`Section`/`FAQAccordion`/`ScrollReveal` (UI primitives) all covered in `tests/unit/components/*.test.tsx`.

---

#### E6-F1-S2 — Write E2E tests for critical user flows

**Story:** As a maintainer, I want end-to-end tests for the site's critical conversion paths, so that navigation, theming, and the contact form are verified to work together in a real browser.

**Points:** 5 | **Sprint:** 4 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `qa-agent`

**Acceptance Criteria:**
- [x] E2E test covers navigating from home through a service page to the case study and back
- [x] E2E test covers theme toggle persisting across a page reload with no flash of wrong theme
- [x] E2E test covers contact form submission success and validation-error states (webhook call mocked/stubbed)
- [x] E2E test covers "Book a call" CTA linking to the configured booking URL
- [x] All E2E tests pass against a production-equivalent static export build

**QA notes (2026-08-18):** Playwright added (`tests/e2e/`, `playwright.config.ts`), run via `bun run test:e2e` (documented in `package.json`) — this script rebuilds the static export with a realistic (non-placeholder) `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` and serves `out/` via a plain static file server (`serve`), matching the "production-equivalent static export build" requirement, then runs Playwright against it. `tests/e2e/navigation.spec.ts` covers the home → service → case study → back flow plus invalid-slug 404s. `tests/e2e/theme.spec.ts` (4 tests) covers default-light, persistence across a `domcontentloaded` reload with the `data-theme` attribute already correct pre-hydration (no flash), persistence across route navigation, and a pre-seeded dark preference applied at first paint. `tests/e2e/contact-form.spec.ts` (6 tests) covers validation-error states and a fully mocked success/failure/rate-limit submission flow via `page.route()` interception of `**/api/webhooks/**` — **the real Discord endpoint is never contacted**. `tests/e2e/booking-cta.spec.ts` covers the "Book a call" CTA linking to the configured `NEXT_PUBLIC_BOOKING_URL` with safe `target`/`rel`. All 24 non-accessibility E2E tests pass (28 total pass across the whole E2E suite; the remaining 15 failures are exclusively the real accessibility defects tracked under E6-F1-S3, not flows tested by this story). **Environment note:** this sandbox has no Playwright system dependencies pre-installed and no root/sudo access; `libasound.so.2` was downloaded via `apt-get download` (no install, no root needed) and extracted locally, then referenced via `LD_LIBRARY_PATH` for this QA session only — this is a one-time local workaround, not a project dependency change, and does not affect `bun run test:e2e` when run in a properly provisioned CI/dev environment with Playwright's `--with-deps` available.

---

#### E6-F1-S3 — Accessibility audit across all routes

**Story:** As a founder with accessibility needs, I want the site to meet WCAG-conscious standards, so that I can navigate and use the site regardless of ability.

**Points:** 3 | **Sprint:** 4 | **Status:** `Todo` | **QA Status:** `Fail` | **Assigned:** `qa-agent`

**Acceptance Criteria:**
- [ ] Automated accessibility scan (e.g., axe) run against all 11 routes with no critical/serious violations
- [x] Keyboard navigation verified for nav, theme toggle, and contact form
- [ ] Color contrast verified for both light and dark themes against the token set
- [x] Findings and fixes (if any) documented in the story's changelog trail

**QA notes — FAIL (2026-08-18):** Scan performed two ways: (1) jsdom-level, `vitest-axe`, all 14 rendered pages, `tests/unit/accessibility/pages-axe.test.tsx` — 14/14 pass for critical/serious (moderate `heading-order` findings noted separately below, not blocking per the AC's literal "critical/serious" wording); (2) **live-browser, real Chromium, `@axe-core/playwright`, `tests/e2e/accessibility.spec.ts`, against the actual static export build** — this is the authoritative run and it **fails**: 2 confirmed, reproducible `serious`-impact violations reflow across all 14 routes:
  1. **`color-contrast` on all 14 routes** — `Footer`'s `text-text-tertiary` eyebrow labels/copyright measure 3.21:1 (light) / ~3.16–3.42:1 (dark) against their background, vs. the required 4.5:1. Root cause and fix tracked under **E1-F3-S3**.
  2. **`link-in-text-block` on `/about`** — the inline "personal portfolio" link is only 1.12:1 distinguishable from its surrounding body text with no non-color affordance (no underline), vs. the required 3:1. Root cause and fix tracked under **E3-F3-S1**.
  Both were re-verified after ruling out a `ScrollReveal` animation-timing false positive (the test now scrolls the full page and lets all fade-in animations settle before scanning) — they reproduce consistently and are real. Keyboard navigation (nav hamburger dialog focus-trap/Esc, theme toggle Enter-key activation, contact form Tab order incl. honeypot) verified via `tests/e2e/mobile-nav.spec.ts`, `tests/e2e/accessibility.spec.ts`'s keyboard test, and `tests/e2e/contact-form.spec.ts` — all pass. Color contrast for the token *set itself* (excluding the two flagged component-level misuses above) verified via WCAG contrast-ratio math in `tests/unit/accessibility/contrast.test.ts` — `text-primary`, `text-secondary`, and `accent` pairs all pass ≥4.5:1 in both themes. **Non-blocking findings** (moderate, not required by this AC's "critical/serious" wording, still worth a follow-up): `heading-order` (h1 → h3, skipping h2) on `/services`, `/work`, and `/pricing`, where `ServiceCard`/`CaseStudyCard`/`PricingCard` render an `<h3>` immediately after the page's `<h1>` with no intervening `<h2>`. **Remediation owner:** frontend-coding-agent, for `src/components/layout/Footer.tsx` and `src/components/AboutStory.tsx` (see those stories' QA notes for the exact fix), plus optionally the 3 pages' heading hierarchy.

---

#### E6-F1-S4 — Cross-route SEO validation

**Story:** As a site owner, I want confirmation that metadata, sitemap, robots, and JSON-LD are correct across every route, so that search and answer engines index the site accurately at launch.

**Points:** 3 | **Sprint:** 4 | **Status:** `Done` | **QA Status:** `Pass` | **Assigned:** `qa-agent`

**Acceptance Criteria:**
- [x] Every route's `generateMetadata()` output verified for uniqueness (no duplicate titles/descriptions)
- [x] `sitemap.ts` output verified to include all 11 routes with correct canonical URLs
- [x] All JSON-LD blocks (`Person`/`ProfessionalService`, `Service` x4, `FAQPage` x2) validated with a structured-data testing tool with zero errors
- [x] All Open Graph images verified to render and reference the correct per-route content

**QA notes (2026-08-18):** `tests/e2e/seo.spec.ts` (6 tests, live browser against the built static export) confirms: zero duplicate `<title>`/meta-description pairs and a canonical `<link>` present across all 14 rendered routes; `/sitemap.xml` returns exactly 14 `<loc>` entries; `/robots.txt` allows crawling and references the sitemap; `Person`/`ProfessionalService` JSON-LD present and parses on all 6 static routes; `Service` JSON-LD present with 4 distinct names across all 4 `/services/[slug]` pages; `FAQPage` JSON-LD on `/pricing` and `/contact` matches the visible accordion; all 9 Open Graph images (root + 8 dynamic) respond 200 with valid PNG magic bytes. JSON-LD schema shape further validated structurally (correct `@type`/`@context`/required fields per schema.org's `Person`/`ProfessionalService`/`Service`/`FAQPage`/`Question`/`Answer` shapes) in `tests/unit/seo/jsonld.test.ts`. **Caveat:** OG image bytes were verified by PNG magic-byte sniffing rather than the `Content-Type` response header, since the plain static file server used for this E2E run doesn't MIME-sniff extensionless files the way Next's own route handler / Vercel's Next.js Runtime build does — see E6-F2-S1 for a recommendation to verify the real header on an actual Vercel deployment before launch.

---

### Feature 6.2: Deployment & Documentation

---

#### E6-F2-S1 — Configure Vercel deployment for static export

**Story:** As a site owner, I want the site deployable to Vercel from the static export build, so that the production site goes live reliably.

**Points:** 2 | **Sprint:** 4 | **Status:** `Todo` | **QA Status:** `Fail` | **Assigned:** `frontend-coding-agent` | **Parallel-Group:** `parallel`

**Acceptance Criteria:**
- [x] Vercel project configuration set for a static export (`output: 'export'`) build and output directory
- [x] Environment variables documented as required Vercel project settings, matching `.env.example`
- [x] A production build (`next build`) completes with no errors or warnings that block export
- [ ] Deployed preview verified to serve all 11 routes correctly

**QA notes — FAIL (2026-08-18):** `vercel.json` correctly sets `buildCommand`/`installCommand`/`outputDirectory: "out"`, matches `next.config.ts`'s `output: 'export'`. `.env.example` documents all 5 vars. `bun run build` completes with zero errors/warnings across two separate runs (default env, and again with a realistic `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` for E2E). **However**, this sandboxed QA environment has no Vercel account/deploy credentials and no network egress to Vercel, so the "deployed preview verified to serve all 11 routes correctly" checkbox could **not** be independently verified against an actual live deployment — only functionally equivalent local static-file serving was verified (`serve out`, all 14 routes 200, confirmed via `tests/e2e/*.spec.ts` running against it). This is downgraded from the frontend-coding-agent's original checked box since "deployed preview verified" implies an actual live check I could not perform; re-check once a real Vercel preview URL is confirmed reachable and serving all pages by whoever has deploy access. Also flagging one open item for that same live-deploy check: confirm the `Content-Type: image/png` response header on the extensionless `/opengraph-image`, `/services/[slug]/opengraph-image`, and `/work/[slug]/opengraph-image` routes — the plain static server used in this sandbox doesn't set it (see E6-F1-S4), and while social-preview scrapers often sniff by content rather than strictly trusting the header, this is worth a quick manual check on the real deployment before public launch.

---

#### E6-F2-S2 — Write README with setup, env vars, and deployment instructions

**Story:** As a future maintainer (or Daryll himself), I want a clear README, so that I can set up, run, and deploy the project without re-deriving context from the spec.

**Points:** 3 | **Sprint:** 4 | **Status:** `Todo` | **QA Status:** `Pending` | **Assigned:** `readme-agent`

**Acceptance Criteria:**
- [ ] README documents local setup (install, dev server, build, static export)
- [ ] README documents all 5 environment variables, which are required vs. optional, and where to obtain/replace placeholder values
- [ ] README documents the deployment process to Vercel
- [ ] README notes the Open Items from the design spec (pricing figures, real booking URL, real domain, case study copy review) as pending owner follow-ups before public launch

---

## Final Backlog Review

**Scope of this review:** Epic 1, Feature 1.4 "Portfolio Disclosure Modal" (E1-F4-S1, E1-F4-S2, E1-F4-S3), Sprint 5 — the dev cycle that just completed. All 3 stories are confirmed `Status: Done` / `QA Status: Pass`, verified by qa-agent's 2026-08-19 gate pass (see Changelog). No discrepancies found between this section's review and the per-story records above.

**Summary table re-verified (2026-08-19, readme-agent):** recounted directly against the 43 story headers in this document — Total Epics 6, Total Stories 43, Story Points 137 (summed per-story), Done 38 / In Progress 2 / Todo 3 (sums to 43), QA Status Pass 38 / Fail 4 / Pending 1 (sums to 43), Parallel-Group `parallel` 34. All figures in the Summary table match the recount exactly; no correction needed.

**Pre-existing, out-of-scope items (predate this feature cycle, deliberately not touched by this run):**

| Story | Status | QA Status | Note |
| --- | --- | --- | --- |
| E1-F3-S3 — Build global Footer component | `In Progress` | `Fail` | WCAG AA `color-contrast` failure on `text-text-tertiary` (Footer eyebrow labels/copyright), found 2026-08-18, predates Sprint 5. Deferred to `frontend-coding-agent` for remediation. |
| E3-F3-S1 — Build About page (/about) | `In Progress` | `Fail` | WCAG 1.4.1 `link-in-text-block` failure on the inline "personal portfolio" link, found 2026-08-18, predates Sprint 5. Deferred to `frontend-coding-agent` for remediation. |
| E6-F1-S3 — Accessibility audit across all routes | `Todo` | `Fail` | Blocked on the same two defects as E1-F3-S3/E3-F3-S1 above; found 2026-08-18, predates Sprint 5. Deferred pending those fixes and a re-scan. |
| E6-F2-S1 — Configure Vercel deployment for static export | `Todo` | `Fail` | Could not independently verify a live Vercel preview in the sandboxed QA environment (no deploy credentials/egress); found 2026-08-18, predates Sprint 5. Deferred pending a real-deployment check by whoever has Vercel access. |
| E6-F2-S2 — Write README with setup, env vars, and deployment instructions | `Todo` | `Pending` | Predates Sprint 5. **Note:** `README.md` was authored/updated as part of this documentation pass (2026-08-19, readme-agent) — see the Changelog entry below — but this story's Status/QA Status are intentionally left as-is per the Definition of Done (only `qa-agent` may set a story to `Done`/`Pass`). qa-agent should verify the new README against this story's acceptance criteria in a future pass. |

None of the above 5 items are part of, or blocked on, the Sprint 5 Portfolio Disclosure Modal cycle. They are carried forward on the backlog unchanged.

---

## Changelog

| Date       | Agent       | Change                  |
| ---------- | ----------- | ------------------------ |
| 2026-08-18 | scrum-agent | Initial tracker created |
| 2026-08-18 | ui-design-agent | Delivered token spec (E1-F2-S1) and nav/footer UX spec (E1-F3-S1); both set to In Progress |
| 2026-08-18 | frontend-coding-agent | Implemented all 33 assigned stories (Epics 1–5 + E6-F2-S1): scaffolded Next.js 16 App Router + TypeScript strict + Tailwind v4 + Framer Motion + Bun; built the light-default/dark-toggle theming system (CSS custom properties, blocking init script, useSyncExternalStore-based ThemeToggle), Inter/Space Grotesk/JetBrains Mono typography, Nav/Footer/UI primitive library; populated services.ts/caseStudies.ts/pricing.ts/business.ts; built all 14 pre-rendered pages across 11 route templates; implemented generateMetadata, sitemap.ts/robots.ts, 9 opengraph-image routes, Person/ProfessionalService + Service + FAQPage JSON-LD, and case-study↔service cross-linking; implemented the Discord-webhook contact form (client-side validation, honeypot, placeholder-safe failure handling) and sitewide "Book a call" CTA; configured vercel.json for static export. All 33 stories set to In Progress (QA Status left Pending for qa-agent). `bun run build` (static export), `bun run lint`, `bun run typecheck`, and `bun audit` all pass with zero errors. |
| 2026-08-18 | scrum-agent | Added Feature 1.4 (Portfolio Disclosure Modal) — 3 new stories, E1-F4-S1/S2/S3, Sprint 5, 10 points total, requested via new feature: first-page-load popup disclosing this is a portfolio project with a link to contact. Flagged two open scoping questions in E1-F4-S1's acceptance criteria for ui-design-agent to resolve before implementation: (1) whether "jump to contact" means a `/contact` page link or an in-page scroll target, and (2) whether modal dismissal should persist per session (recommended default) or show on every page load with no memory. No new epic, no backend/db work (static site, no API needed — noted per `docs/api-contract.md`). |
| 2026-08-18 | qa-agent | **QA gate pass over all 39 gated stories** (34 frontend-coding-agent/ui-design-agent stories from Epics 1–5 + E6-F2-S1, plus qa-agent's own 4 Epic 6.1 stories). Regression baseline: 0 tests existed prior to this pass (fresh implementation), so nothing to regress — confirmed clean. Added the full testing stack from scratch: **Vitest 4 + React Testing Library + jsdom + vitest-axe** (`vitest.config.ts`, `tests/unit/**`, 25 files / 153 tests, `bun run test`) and **Playwright + @axe-core/playwright** (`playwright.config.ts`, `tests/e2e/**`, 7 spec files / 43 tests, `bun run test:e2e` — runs against the actual static export build, not the dev server). **35 of 39 stories passed QA** and were set to `Status: Done` / `QA Status: Pass` with their AC checkboxes checked off, backed by the new automated tests. **4 stories failed QA** and were reset to `Status: Todo` / `QA Status: Fail`, each with a QA notes block detailing exactly what failed and why: **E1-F3-S3** (Footer — a real, live-browser-confirmed WCAG AA `color-contrast` violation, `text-text-tertiary` at 3.16–3.42:1 against the required 4.5:1, reproducing on all 14 routes), **E3-F3-S1** (About — a real WCAG 1.4.1 `link-in-text-block` violation, the inline portfolio link only 1.12:1 distinguishable from its surrounding text with no underline), **E6-F1-S3** (the accessibility-audit story itself, since the live-browser axe scan found the above 2 real `serious`-impact violations — the jsdom-level scan alone had missed them, underscoring the value of the live-browser run), and **E6-F2-S1** (Vercel deployment — could not independently verify an actual live Vercel preview in this sandboxed, no-credentials environment; downgraded pending a real deploy check). Also fixed 3 test-infrastructure-only issues discovered along the way (none were product bugs): a `devices["iPhone 13"]` Playwright preset silently requiring an uninstalled WebKit browser (fixed by only spreading the viewport/touch fields), an OG-image E2E assertion checking `Content-Type` against a static file server that doesn't MIME-sniff extensionless files (switched to PNG magic-byte verification), and an accessibility-scan false positive from catching `ScrollReveal` content mid-fade-in (fixed by settling scroll animations before scanning). Regression re-check after all fixes: full unit suite (153/153) and E2E suite (28/43, with the 15 failures being exactly the 2 confirmed real defects above, reproducing consistently across two full E2E runs) both stable, no flaky/order-dependent failures observed. `bun run typecheck`, `bun run lint`, and `bun audit` (0 vulnerabilities) all still clean after adding the test suite. `E6-F2-S2` (readme-agent) untouched — out of qa-agent's scope. |
| 2026-08-19 | qa-agent | **QA gate pass, scoped to exactly 3 stories: E1-F4-S1/S2/S3 (Portfolio Disclosure Modal).** All 3 passed and are now `Status: Done` / `QA Status: Pass`. **E1-F4-S1** (design spec): verified `docs/design-system.md` §9 is complete and internally consistent, and that the shipped `PortfolioDisclosureModal` implementation matches it verbatim (copy, sessionStorage key, timing values, 3 inerted landmark ids, motion values) — no deviations found. **E1-F4-S2** (component build): all 6 ACs verified via new automated tests; security check confirmed the "Get in touch" CTA is a plain `/contact` link with no query string, no tracking params, no secrets. **E1-F4-S3** (qa-agent's own story): added `tests/unit/components/PortfolioDisclosureModal.test.tsx` (16 tests) and `tests/e2e/portfolio-disclosure-modal.spec.ts` (11 tests), plus a 4-test modal-open axe/reduced-motion block appended to `tests/e2e/accessibility.spec.ts` (0 critical/serious violations on `/` and `/services`). **Regression finding:** the new sitewide, ~300ms-after-load modal was intercepting pointer events and inerting the header in 3 pre-existing E2E specs that predate this feature (`accessibility.spec.ts`'s contrast test, `mobile-nav.spec.ts`, `navigation.spec.ts`) — a real test-suite-only regression, no product bug. Fixed by adding `tests/e2e/fixtures.ts` (a shared Playwright fixture pre-seeding the modal's sessionStorage dismissal flag) and switching 6 pre-existing specs that interact with page content shortly after `page.goto()` to import from it instead of `@playwright/test` directly. **Regression counts:** baseline unit 158/158, first E2E run against the merged modal 41/44 (3 failing: 1 pre-existing unrelated `mobile-nav.spec.ts` defect + 2 new modal-caused regressions); after the fixture fix and new tests, unit 174/174 (158 + 16 new) and E2E 58/59 (44 + 15 new), with only the same 1 pre-existing, unrelated `mobile-nav.spec.ts` failure remaining. No new regressions. The 4 previously-failed legacy stories (`E1-F3-S3`, `E3-F3-S1`, `E6-F1-S3`, `E6-F2-S1`) and `E6-F2-S2` were deliberately left untouched — out of scope for this pass. |
| 2026-08-19 | readme-agent | **Dev cycle completion pass.** Confirmed E1-F4-S1/S2/S3 (Portfolio Disclosure Modal, Sprint 5) remain `Status: Done` / `QA Status: Pass` per qa-agent's 2026-08-19 gate pass — no changes needed. Recounted the Summary table against all 43 story headers: all figures (Total Stories 43, Story Points 137, Done 38 / In Progress 2 / Todo 3, QA Status Pass 38 / Fail 4 / Pending 1, Parallel-Group `parallel` 34) confirmed accurate, no corrections required. Added the `## Final Backlog Review` section, recording the 5 pre-existing out-of-scope items (`E1-F3-S3`, `E3-F3-S1`, `E6-F1-S3`, `E6-F2-S1`, `E6-F2-S2`) as deferred/unchanged — none are part of or blocked on this cycle. **Frontend code review for this cycle passed with no must-fix items.** Two non-blocking nice-to-haves noted for the backlog (not blockers): (1) extract the duplicated `FOCUSABLE_SELECTOR` constant (currently defined separately in `MobileNavPanel` and `PortfolioDisclosureModal`) into a shared a11y util; (2) a low-probability dual-dialog focus-race edge case between the new `PortfolioDisclosureModal` and the pre-existing `MobileNavPanel` if both were ever triggered open simultaneously. Also authored/updated `README.md` (setup, env vars, scripts, testing, architecture summary) per E6-F2-S2's acceptance criteria — that story's own `Status`/`QA Status` are left untouched pending qa-agent verification, per the Definition of Done. |
