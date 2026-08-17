import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DISCORD_WEBHOOK_URL",
  "NEXT_PUBLIC_BOOKING_URL",
  "NEXT_PUBLIC_GOOGLE_VERIFICATION",
  "NEXT_PUBLIC_GA_ID",
] as const;

describe("src/lib/env.ts (E1-F1-S3)", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
    vi.resetModules();
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
    vi.resetModules();
  });

  it("required vars fall back to safe placeholder defaults when unset (build never fails)", async () => {
    const { getSiteUrl, getDiscordWebhookUrl, getBookingUrl } = await import("@/lib/env");
    expect(getSiteUrl().length).toBeGreaterThan(0);
    expect(() => new URL(getSiteUrl())).not.toThrow();
    expect(getDiscordWebhookUrl().length).toBeGreaterThan(0);
    expect(getBookingUrl().length).toBeGreaterThan(0);
  });

  it("getSiteUrl strips trailing slashes", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    vi.resetModules();
    const { getSiteUrl } = await import("@/lib/env");
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("getSiteUrl ignores whitespace-only values and falls back to the placeholder", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "   ";
    vi.resetModules();
    const { getSiteUrl } = await import("@/lib/env");
    expect(getSiteUrl().length).toBeGreaterThan(0);
    expect(getSiteUrl()).not.toBe("   ");
  });

  it("optional vars are read defensively and default to empty string with no crash when unset", async () => {
    const { getGoogleVerification, getGaId } = await import("@/lib/env");
    expect(() => getGoogleVerification()).not.toThrow();
    expect(() => getGaId()).not.toThrow();
    expect(getGoogleVerification()).toBe("");
    expect(getGaId()).toBe("");
  });

  it("optional vars pass through a real configured value", async () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123";
    vi.resetModules();
    const { getGaId } = await import("@/lib/env");
    expect(getGaId()).toBe("G-TEST123");
  });

  it("isDiscordWebhookPlaceholder is true for the placeholder default", async () => {
    const { getDiscordWebhookUrl, isDiscordWebhookPlaceholder } = await import("@/lib/env");
    expect(isDiscordWebhookPlaceholder(getDiscordWebhookUrl())).toBe(true);
  });

  it("isDiscordWebhookPlaceholder is true for unset/empty and for non-Discord URLs", async () => {
    const { isDiscordWebhookPlaceholder } = await import("@/lib/env");
    expect(isDiscordWebhookPlaceholder("")).toBe(true);
    expect(isDiscordWebhookPlaceholder("https://evil.example.com/webhook")).toBe(true);
    expect(isDiscordWebhookPlaceholder("https://discord.com/api/webhooks/PLACEHOLDER/PLACEHOLDER")).toBe(true);
  });

  it("isDiscordWebhookPlaceholder is false for a real-looking Discord webhook URL", async () => {
    const { isDiscordWebhookPlaceholder } = await import("@/lib/env");
    expect(isDiscordWebhookPlaceholder("https://discord.com/api/webhooks/123456789/real-token-value")).toBe(
      false
    );
  });

  it("a real configured NEXT_PUBLIC_DISCORD_WEBHOOK_URL is read through and recognized as non-placeholder", async () => {
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/999/real-token";
    vi.resetModules();
    const { getDiscordWebhookUrl, isDiscordWebhookPlaceholder } = await import("@/lib/env");
    expect(getDiscordWebhookUrl()).toBe("https://discord.com/api/webhooks/999/real-token");
    expect(isDiscordWebhookPlaceholder(getDiscordWebhookUrl())).toBe(false);
  });
});
