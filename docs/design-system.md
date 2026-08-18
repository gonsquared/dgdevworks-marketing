# DG DevWorks Marketing Site — Design System

**Source:** ui-design-agent output from the orchestrate-plan run (2026-08-18), covering stories E1-F2-S1 (color/typography tokens) and E1-F3-S1 (nav/footer UX spec). Persisted here so frontend-coding-agent has a durable reference for Epic 1 stories and beyond.

**Aesthetic direction — "Spec Sheet / Blueprint":** DG DevWorks' working method is spec-first, systematic engineering (this project itself was built from a written, versioned spec). Rather than a generic SaaS-indigo look, the site borrows the visual language of a specification/blueprint document: hairline rules, small mono-set annotation labels (`§01`, `FIG. 02`), and sparing corner-bracket "registration marks" (like CAD/viewfinder ticks) framing only the highest-signal elements (hero visual, the recommended pricing tier, case-study stat callouts). The accent color is a cyan/teal (`#007a9e` light / `#00d4ff` dark), aligned with the DG DevWorks portfolio site's palette per docs/superpowers/specs/2026-08-18-portfolio-cyan-theme-reskin-design.md — the blueprint's "spec-review annotation" color, now teal instead of redline. Error/validation states keep a dedicated red-orange `--color-error` token, split out from accent so form errors still read as errors. Dark mode is literal blueprint paper: deep blueprint-navy background with pale linework text and a glowing cyan accent — and dark is now the **default** theme, matching the portfolio.

This deliberately avoids generic AI-design defaults (cream+serif+terracotta, near-black+neon, broadsheet-hairline-columns) while staying inside the approved spec's structural constraints (Inter/Space Grotesk/JetBrains Mono, hairline rules, mono annotation labels, corner-bracket registration marks, dark-default toggle with glow).

---

## 1. User flow across the 14 pages

```
Landing (/) ──┬─→ Services index ──→ Service detail ──┬─→ related Case study ──→ back to same Service (cross-link)
              │                                        └─→ Pricing (via service priceLabel) → Contact
              ├─→ Work index ──→ Case study detail ──→ related Service detail (cross-link)
              ├─→ About ──→ (trust built) → Contact / Book a call
              ├─→ Pricing → FAQ → Contact / Book a call
              └─→ dual CTA band (Book a call | Send a message) ──┬─→ external booking URL
                                                                   └─→ /contact
```

Two parallel decision paths for a founder: a **scope-first path** (Services → matching Service detail → proof via related Case Study → Pricing → Contact) and a **trust-first path** (Work → Case Study → related Service → About → Contact). Both converge on the same dual-CTA pattern, and "Book a call" is reachable from the nav on every single page (zero-click, not path-dependent) — the primary conversion accelerator for a founder who's already decided.

## 2. Layout per page type

Shared chrome on all pages: sticky Nav (top) + Footer (bottom), main content in a `max-w-[1200px]` centered container with responsive gutters (`px-6` mobile, `px-8` tablet, `px-10+` desktop).

- **Home (`/`):** Hero (positioning statement, primary CTA, signature abstract graphic) → Services overview (4-up ServiceCard grid) → Proof snapshot (2–3 CaseStudyCard highlights + StatCallout strip, link to `/work`) → Pricing snapshot (compact 4-package strip, link to `/pricing`) → CTABand (dual CTA).
- **Services index (`/services`):** Short intro line → 4 ServiceCard in a grid (1→2→4 cols), each with SpecLabel index tag (e.g. `§01`), summary, "View service →" link. Nav's persistent Book a call covers conversion here.
- **Service detail (`/services/[slug]`):** Header (title + priceLabel), "What's included" list, "Process" as a real numbered ordered sequence (legitimate here — an actual timeline), "Ideal client" callout card, "Related work" (CaseStudyCard row from `relatedCaseStudySlugs`), CTABand (dual CTA) to close.
- **Work index (`/work`):** Intro line → 4 CaseStudyCard grid (1→2 cols — richer cards, fewer per row than services), each with AbstractVisual, title, one-line challenge teaser, StatCallout chip.
- **Case study detail (`/work/[slug]`):** AbstractVisual header → Challenge → Approach → Impact (StatCallout row, bracket-framed) → "Related service" cross-link card(s) → lightweight single "Interested in something similar? Book a call" line (not full dual band — proof page, not hard-sell).
- **About (`/about`):** Narrative bio (AboutStory) sourced from `business.ts` + page copy, explicit founder-focused trust framing, outbound link to personal portfolio, closes with a single "Book a call" CTA (About's job is trust, not hard conversion).
- **Pricing (`/pricing`):** Hourly rate strip (mono figure) → 4 PricingCard grid (1→2→4 cols) with "why the range" note per card → prominent disclaimer banner ("indicative pricing, pending a scoping call") → FAQAccordion → CTABand (dual CTA).
- **Contact (`/contact`):** Two-column layout on desktop (form left, booking CTA + trust line + FAQ right), stacks to single column mobile with form first. ContactForm → TrustLine → booking CTA card → FAQAccordion (shares typed FAQItem source with Pricing, per E4-F3-S3).

## 3. Component breakdown

**Global/shared (`src/components/ui/` + layout):**
`Nav`, `MobileNavPanel`, `ThemeToggle`, `Footer`, `Logotype`, `Button` (accent-solid / outline / ghost, sm/md/lg), `Card` (base + optional bracket-corner variant), `Section`/`Container`, `ScrollReveal` (Framer Motion fade/slide-in-view wrapper), `CTABand`, `Badge`, `StatCallout`, `SpecLabel` (mono eyebrow/divider), `FAQAccordion`.

**Page-composite (page-specific or near-page-specific):**
`Hero` (home), `ServiceCard`, `CaseStudyCard`, `AbstractVisual` (SVG/gradient generator, variant prop per slug — never a real screenshot), `PricingCard`, `ContactForm`, `TrustLine` (reused with different copy in footer vs. contact page), `AboutStory`.

No component needs runtime data fetching or persistence — everything is imported from `src/data/*.ts` at build time. No db-agent involvement is warranted.

## 4. Design tokens (E1-F2-S1)

**Typography scale:**

| Role | Font | Size (mobile→desktop) | Weight | Notes |
|---|---|---|---|---|
| Display/H1 | Space Grotesk | 44px → 56px, lh 1.05, tracking -0.02em | 600 | hero only |
| H2 | Space Grotesk | 32px → 36px, lh 1.15 | 600 | section titles |
| H3 | Space Grotesk | 22px, lh 1.3 | 600 | card/subsection |
| H4/card title | Space Grotesk | 18px | 600 | |
| Body lead | Inter | 19px, lh 1.7 | 400 | hero subhead, intros |
| Body | Inter | 17px, lh 1.65 | 400 | default |
| UI/small | Inter | 14px, lh 1.4 | 500 | nav, labels, buttons |
| Mono figure | JetBrains Mono | 28px → 40px | 500 | pricing figures only |
| Mono annotation | JetBrains Mono | 12px, tracking 0.08em, uppercase | 500 | `SpecLabel` eyebrows, `FIG.`/`§` tags — sparing use only |

**Color tokens (CSS custom properties, per theme — hand-verified against WCAG 2.1 contrast math; frontend-coding-agent should re-verify with a contrast tool at implementation time, this is a strong starting point not a substitute for automated QA in E6-F1-S3):**

Light (`:root` / `[data-theme="light"]`):
```css
--color-bg: #F7F6F3
--color-surface: #FFFFFF
--color-surface-sunken: #F1F0EC
--color-text-primary: #16191D
--color-text-secondary: #5C6470
--color-text-tertiary: #8A9099
--color-border: #E3E1DC
--color-border-strong: #C9C6BE
--color-accent: #007A9E        /* 4.9:1 on white — passes AA normal text */
--color-accent-hover: #005F7A
--color-accent-bright: #0089B3 /* decorative-only: icons, ticks, borders — 3:1 min, NOT for body text */
--color-accent-soft: #E0F4FA
--color-accent-on-fill: #FFFFFF
--color-success: #1F8A57
--color-error: #C7360F         /* dedicated token, no longer aliases accent — 5.3:1 on white, passes AA */
--color-focus-ring: #007A9E
```

Dark (`[data-theme="dark"]`):
```css
--color-bg: #0D1420
--color-surface: #141C2C
--color-surface-sunken: #0A0F18
--color-text-primary: #EDEFF3
--color-text-secondary: #94A0B4
--color-text-tertiary: #5E6B80
--color-border: #253048
--color-border-strong: #34405C
--color-accent: #00D4FF        /* 10.4:1 on bg — passes AA */
--color-accent-hover: #33DDFF
--color-accent-bright: #7CE7FF
--color-accent-soft: #113240
--color-accent-on-fill: #0D1420 /* dark text on bright accent fill — 10.4:1 */
--color-success: #34C77E
--color-error: #FF6A45          /* dedicated token, no longer aliases accent — 6.5:1 on bg, passes AA */
--color-focus-ring: #00D4FF
--glow-accent: 0 0 24px rgba(0,212,255,0.35)  /* dark-mode-only accent glow, sparing use on primary CTA + hero mark */
```

## 5. Nav & footer UX spec (E1-F3-S1)

**Logotype:** small mono bracket mark `[DG]` + "DevWorks" in Space Grotesk 600 — reused in Nav, Footer, and as the basis for the root OG image (E4-F2-S1).

**Desktop nav (≥768px):** sticky top bar, 72px height, `--color-bg` background with a bottom hairline (`--color-border`); on scroll >8px, border strengthens slightly (no heavy shadow). Left: Logotype. Center-right: Home / Services / Work / About / Pricing / Contact, Inter 15px medium, sentence case. Active route indicated by a short 2px accent underline tick below the label (not a filled pill). Far right: `ThemeToggle` icon button, then persistent `Button` (accent-solid) "Book a call" reading `NEXT_PUBLIC_BOOKING_URL`, `target="_blank" rel="noopener noreferrer"`.

**Mobile nav (<768px):** Logotype left; "Book a call" (compact) + hamburger icon-button stay visible on the bar — the booking CTA never gets buried inside the collapsed menu. Hamburger opens a full-height slide-in panel (Framer Motion, 240ms ease; `prefers-reduced-motion` → instant show/hide, no transform) as a proper dialog: `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"`, focus trapped inside, background inerted, body scroll locked, `Esc` closes and returns focus to the hamburger button, hamburger toggles `aria-expanded`/`aria-controls`. Panel repeats all 6 links (Space Grotesk 20px stacked), theme toggle, and both CTAs ("Book a call" primary, "Send a message" → `/contact` secondary) at the bottom.

**Footer:** full-width band, `--color-surface` background, top hairline border, generous vertical padding. 4-column grid desktop → 2-col tablet → 1-col mobile, each list wrapped in a labeled `<nav aria-label="…">`:
1. **Brand:** Logotype, one-line tagline from `business.ts`, contact email (`mailto:`).
2. **Site** (mono eyebrow `// SITE`): repeat of the 6 nav links.
3. **Connect** (mono eyebrow `// CONNECT`): LinkedIn, GitHub, "Personal portfolio ↗" — all external, `target="_blank" rel="noopener noreferrer"`, plus visually-hidden "(opens in new tab)" text for screen readers.
4. **Trust:** a footer-level trust/credibility line sourced from `business.ts` (distinct from the contact-form data-use line in E5-F1-S3 — reinforces "single senior engineer, no subcontracting" positioning) + a repeated compact "Book a call" link.

Bottom row below a hairline divider: `© 2026 DG DevWorks. All rights reserved.` in small mono text, left-aligned. `<footer role="contentinfo">` landmark.

Both Nav and Footer must consume the token set above (no hardcoded colors), and both render inside the root layout so they appear on all 11 route templates per E1-F3-S2/S3.

## 6. Responsive behavior

Tailwind default breakpoints: `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280.
- Nav collapses to hamburger at `<md`; CTA + hamburger always visible.
- ServiceCard grid: 1 col mobile → 2 col `sm` → 4 col `lg`.
- CaseStudyCard grid: 1 col mobile → 2 col `md` (kept wider per card — richer visual content).
- PricingCard grid: 1 col mobile → 2 col `sm` → 4 col `lg`.
- Contact page: single column mobile (form first, then CTA/trust/FAQ) → 2-column `lg` (form left, CTA/trust/FAQ right).
- Hero: stacked mobile (copy → visual), side-by-side `lg`.
- Type scale uses `clamp()` for H1/H2 rather than hard breakpoints for smoother scaling.

## 7. Accessibility notes

- Contrast: all token pairs above verified ≥4.5:1 for text use; `--color-accent-bright` is explicitly decorative-only (3:1 minimum, non-text use per WCAG 1.4.11) — never for body/link text.
- Focus states: every interactive element gets a visible `--color-focus-ring` outline (2px, 2px offset) — no `outline: none` without a replacement, including on the mobile nav panel's focus-trapped elements.
- Semantic landmarks: `<nav>`, `<main>`, `<footer role="contentinfo">`; each footer link list gets its own labeled `<nav aria-label>`.
- Reduced motion: every `ScrollReveal` instance and the mobile nav panel transition must check `prefers-reduced-motion` and fall back to an instant, non-animated state — hard requirement for E1-F3-S4's scroll-wrapper component, not optional polish.
- Mobile menu: full keyboard operability (Tab trapped inside while open, `Esc` to close, focus returned to trigger), `aria-expanded`/`aria-controls` on the hamburger, `role="dialog"` + `aria-modal="true"` on the panel.
- Theme toggle: accessible name (e.g. "Switch to dark theme" / "Switch to light theme", not just an icon), state conveyed via `aria-pressed` or equivalent.
- FAQAccordion: proper disclosure pattern (`<button aria-expanded>` controlling a region with `aria-labelledby`/`aria-controls`), keyboard operable without a mouse.

## 8. Security-aware design notes

- Contact page (`/contact`): plain-language error states only ("Something went wrong sending your message — try again or book a call directly" — never surface raw fetch/HTTP details), per the Discord webhook failure-handling contract in `docs/api-contract.md`.
- Recommend a hidden honeypot field in `ContactForm` (per the API contract's mitigation note) — flagged for frontend-coding-agent at build time, not a UI-visible change.
- No sensitive data is displayed anywhere on this site (no user accounts, tokens, or PII surfaces) — the only PII collected is the visitor's own name/email/message they submit, which is not redisplayed.
- All external links (LinkedIn, GitHub, portfolio, booking URL) use `rel="noopener noreferrer"` with `target="_blank"`.
- No `?redirect=`/`?next=` params anywhere in this site's flows.
- No auth, no iframe-embedding sensitivity, no session/logout UX needed — static marketing site, out of scope.
- Booking URL and Discord webhook URL are both `NEXT_PUBLIC_*` and therefore public in the client bundle by design (documented as an accepted risk in `docs/api-contract.md`); no UI change can mitigate this, only Discord's own rate limiting + the honeypot above.
