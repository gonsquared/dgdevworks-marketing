# DG DevWorks Marketing Site — API Contract

**Status:** No internal backend API exists. This document exists to satisfy the project's contract-first workflow requirement and to record the one external integration contract this site depends on, plus the static route inventory that frontend-coding-agent and qa-agent build/test against.

This project is a fully static export (`output: 'export'`). There is no `app/api/*` route handler, no server runtime, and no internal HTTP API surface of any kind.

---

## External Integration: Discord Webhook (Contact Form)

The `/contact` page's form POSTs directly from the browser to a Discord incoming webhook URL. This is a third-party API contract, not one this project defines — documented here because frontend-coding-agent must implement against it and qa-agent must test against it (with the real call mocked/stubbed per E6-F1-S2).

### POST `{NEXT_PUBLIC_DISCORD_WEBHOOK_URL}?wait=true`

**Auth:** None (the webhook URL itself is the credential — see Security note below). No auth header required or sent.

**Why `?wait=true`:** Without it, Discord returns `204 No Content` with no body, giving the client no way to distinguish "queued" from "confirmed delivered." With `?wait=true`, Discord returns the created message object on success, letting the UI show a genuine success state rather than an optimistic one.

**Request body (JSON):**

| Field | Type | Required |
|---|---|---|
| `username` | string | No — recommended override, e.g. `"DG DevWorks — Contact Form"` |
| `embeds` | array of Embed objects | Yes |

**Embed object:**

| Field | Type | Required |
|---|---|---|
| `title` | string | No — recommended: `"New Contact Form Submission"` |
| `color` | integer (decimal RGB) | No — recommended: site accent color as decimal int |
| `fields` | array of `{ name: string, value: string, inline: boolean }` | Yes — populate with `Name`, `Email`, `Message` |
| `timestamp` | string (ISO 8601) | No — recommended: submission time |

Example payload:

```json
{
  "username": "DG DevWorks — Contact Form",
  "embeds": [
    {
      "title": "New Contact Form Submission",
      "color": 3447003,
      "fields": [
        { "name": "Name", "value": "Jane Founder", "inline": true },
        { "name": "Email", "value": "jane@startup.com", "inline": true },
        { "name": "Message", "value": "We'd like to talk about an MVP build." }
      ],
      "timestamp": "2026-08-18T12:00:00.000Z"
    }
  ]
}
```

**Response codes:**

| Status | Meaning | Client handling |
|---|---|---|
| `200 OK` | Delivered; body contains the created Discord message object (only when `?wait=true` is used) | Show success state |
| `400 Bad Request` | Malformed payload (e.g. `embeds` missing/invalid shape) | Show generic error, log details for debugging, do not retry automatically |
| `401 Unauthorized` | Webhook URL invalid/revoked | Show generic error; this indicates a misconfigured `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` |
| `404 Not Found` | Webhook deleted on Discord's side | Same handling as 401 |
| `429 Too Many Requests` | Rate limited; response includes `Retry-After` header (seconds) | Show retry-friendly error message; do not hammer-retry |

**Failure/placeholder handling requirement (per E5-F1-S2):** if `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` is unset or still the placeholder default at build/runtime, the submit handler must short-circuit before attempting the fetch, log a clear dev-time console warning, and show the user a friendly "unable to send right now" state rather than throwing an unhandled exception or attempting a request to an invalid URL.

**Security note:** Because this is a static export with no backend, the webhook URL is necessarily embedded in the client-side JS bundle (`NEXT_PUBLIC_*` vars are always public). This means the webhook URL is technically discoverable by anyone inspecting the bundle, which is a spam-vector risk Discord webhooks are commonly exposed to. Recommended mitigations (implementation detail for frontend-coding-agent, not a blocker): a hidden honeypot field to deter basic bots, and treating Discord's own `429` rate-limiting as the primary abuse backstop for v1. This is documented further as a risk in the architecture output.

---

## Static Route Inventory

All routes below are pre-rendered at build time. All are `GET`-only, publicly accessible, no auth. This is the contract frontend-coding-agent builds against and qa-agent tests against for E4-F1-S1 (metadata), E4-F1-S2 (sitemap/robots), E4-F2-* (OG images), and E6-F1-S4 (cross-route SEO validation).

| Route | Type | Purpose | generateStaticParams |
|---|---|---|---|
| `/` | Static | Home — hero, services overview, proof snapshot, pricing snapshot, secondary CTA | N/A |
| `/services` | Static | Services index — links to all 4 service detail pages | N/A |
| `/services/mvp-development` | Dynamic (`[slug]`) | MVP/product build service detail | slug: `mvp-development` |
| `/services/marketing-sites` | Dynamic (`[slug]`) | Marketing/landing site build service detail | slug: `marketing-sites` |
| `/services/modernization` | Dynamic (`[slug]`) | Legacy modernization/migration service detail | slug: `modernization` |
| `/services/fractional` | Dynamic (`[slug]`) | Fractional/embedded senior engineer service detail | slug: `fractional` |
| `/work` | Static | Case studies index — links to all 4 case study detail pages | N/A |
| `/work/bank-platform-modernization` | Dynamic (`[slug]`) | Case study detail | slug: `bank-platform-modernization` |
| `/work/hardware-brand-partner-portals` | Dynamic (`[slug]`) | Case study detail | slug: `hardware-brand-partner-portals` |
| `/work/retail-pos-platform` | Dynamic (`[slug]`) | Case study detail | slug: `retail-pos-platform` |
| `/work/stock-exchange-data-migration` | Dynamic (`[slug]`) | Case study detail | slug: `stock-exchange-data-migration` |
| `/about` | Static | Daryll's story, DG DevWorks framing | N/A |
| `/pricing` | Static | All 4 packages, hourly rate, pricing FAQ | N/A |
| `/contact` | Static | Contact form + booking CTA + trust-signal line + FAQ | N/A |

**Total: 14 pre-rendered static pages across 11 route templates** (2 of which — `/services/[slug]` and `/work/[slug]` — each expand to 4 concrete pages via `generateStaticParams()`).

**Non-page static/computed routes** (not HTML pages, but part of the build's static output contract):

| Route | Purpose |
|---|---|
| `app/sitemap.ts` → `/sitemap.xml` | Generated from the same slug lists as the page routes above — must always list all 14 pages |
| `app/robots.ts` → `/robots.txt` | Allows crawling, references sitemap via `NEXT_PUBLIC_SITE_URL` |
| `app/opengraph-image.tsx` → `/opengraph-image` (root) | Static OG image for `/` |
| `app/services/[slug]/opengraph-image.tsx` | 4 static OG images, one per service slug |
| `app/work/[slug]/opengraph-image.tsx` | 4 static OG images, one per case study slug |

---

## Shared Models

These typed shapes (from `src/data/*.ts`) are the data contract shared between the content layer and every page component. There is no wire/serialization format to define (no network transport for these — they're imported directly at build time), but they are documented here as the canonical shapes both frontend-coding-agent and qa-agent must conform to and test against.

### `Service` (src/data/services.ts)

| Field | Type |
|---|---|
| `slug` | `string` (one of: `mvp-development`, `marketing-sites`, `modernization`, `fractional`) |
| `title` | `string` |
| `summary` | `string` |
| `includes` | `string[]` |
| `process` | `string[]` |
| `idealClient` | `string` |
| `priceLabel` | `string` |
| `relatedCaseStudySlugs` | `string[]` (must resolve to real `CaseStudy.slug` values) |

### `CaseStudy` (src/data/caseStudies.ts)

| Field | Type |
|---|---|
| `slug` | `string` (one of: `bank-platform-modernization`, `hardware-brand-partner-portals`, `retail-pos-platform`, `stock-exchange-data-migration`) |
| `title` | `string` |
| `challenge` | `string` |
| `approach` | `string` |
| `impact` | `string[]` |
| `relatedServiceSlugs` | `string[]` (must resolve to real `Service.slug` values) |

### `PricingData` / `PricingPackage` (src/data/pricing.ts)

| Field | Type |
|---|---|
| `hourlyRate` | `number` |
| `packages` | `PricingPackage[]` |

`PricingPackage`:

| Field | Type |
|---|---|
| `slug` | `string` |
| `name` | `string` |
| `priceLabel` | `string` |
| `timeframe` | `string` |
| `rangeNote` | `string` |

### `BusinessInfo` (src/data/business.ts)

| Field | Type |
|---|---|
| `brandName` | `string` |
| `tagline` | `string` |
| `positioningCopy` | `string` |
| `bookingUrl` | `string` (sourced from `NEXT_PUBLIC_BOOKING_URL`) |
| `contactEmail` | `string` |
| `socialLinks` | `{ linkedin: string, github: string, portfolio: string }` |

### `FAQItem` (typed source backing FAQPage JSON-LD on `/pricing` and `/contact`)

| Field | Type |
|---|---|
| `question` | `string` |
| `answer` | `string` |

### `DiscordWebhookEmbed` (client-only, external contract type — see Discord Webhook section above)

| Field | Type |
|---|---|
| `username` | `string?` |
| `embeds` | `Array<{ title?: string, color?: number, fields: Array<{ name: string, value: string, inline?: boolean }>, timestamp?: string }>` |
