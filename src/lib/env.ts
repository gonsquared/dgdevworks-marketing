/**
 * Typed, defensive accessors for NEXT_PUBLIC_* environment variables.
 *
 * This project is a fully static export with no backend, so every env var
 * consumed here is intentionally public (baked into the client bundle at
 * build time). Nothing in this file should ever hold a real secret.
 *
 * All required vars ship with safe placeholder defaults so `next build`
 * never fails when real values haven't been supplied yet (see
 * docs/api-contract.md and .env.example).
 */

const PLACEHOLDER_SITE_URL = "https://www.dgdevworks.com";
const PLACEHOLDER_DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/PLACEHOLDER/PLACEHOLDER";
const PLACEHOLDER_BOOKING_URL = "https://cal.com/dgdevworks/placeholder";

function readVar(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

/** Production domain used for canonical URLs, sitemap, robots, OG metadata. No trailing slash. */
export function getSiteUrl(): string {
  return readVar(process.env.NEXT_PUBLIC_SITE_URL, PLACEHOLDER_SITE_URL).replace(/\/+$/, "");
}

/** Discord incoming webhook URL for the contact form. May still be the placeholder value. */
export function getDiscordWebhookUrl(): string {
  return readVar(
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL,
    PLACEHOLDER_DISCORD_WEBHOOK_URL
  );
}

/** True when the Discord webhook URL is unset or still the documented placeholder. */
export function isDiscordWebhookPlaceholder(url: string = getDiscordWebhookUrl()): boolean {
  return (
    !url ||
    url === PLACEHOLDER_DISCORD_WEBHOOK_URL ||
    url.includes("PLACEHOLDER") ||
    !url.startsWith("https://discord.com/api/webhooks/")
  );
}

/** Booking/scheduling link used by every "Book a call" CTA sitewide. */
export function getBookingUrl(): string {
  return readVar(process.env.NEXT_PUBLIC_BOOKING_URL, PLACEHOLDER_BOOKING_URL);
}

/** Optional Google Search Console verification token. Empty string when unset. */
export function getGoogleVerification(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION?.trim() ?? "";
}

/** Optional Google Analytics Measurement ID. Empty string when unset (analytics disabled). */
export function getGaId(): string {
  return process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
}

export const env = {
  siteUrl: getSiteUrl,
  discordWebhookUrl: getDiscordWebhookUrl,
  isDiscordWebhookPlaceholder,
  bookingUrl: getBookingUrl,
  googleVerification: getGoogleVerification,
  gaId: getGaId,
};
