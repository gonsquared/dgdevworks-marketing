import { describe, it, expect, afterEach, vi } from "vitest";

describe("src/lib/discord.ts (E5-F1-S2 Discord webhook contract, docs/api-contract.md)", () => {
  const originalWebhook = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
  const originalFetch = global.fetch;

  afterEach(() => {
    if (originalWebhook === undefined) delete process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
    else process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = originalWebhook;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("short-circuits before fetching when the webhook URL is unset/placeholder, warns in dev, and never throws", async () => {
    delete process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
    vi.resetModules();
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { submitContactForm } = await import("@/lib/discord");
    const result = await submitContactForm({ name: "Jane", email: "jane@startup.com", message: "hello" });

    expect(result).toEqual({ ok: false, reason: "placeholder" });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });

  it("POSTs to `${webhookUrl}?wait=true` with a well-formed embed payload including name/email/message", async () => {
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/123/real-token";
    vi.resetModules();
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    global.fetch = fetchSpy as unknown as typeof fetch;

    const { submitContactForm } = await import("@/lib/discord");
    const result = await submitContactForm({
      name: "Jane Founder",
      email: "jane@startup.com",
      message: "We'd like to talk about an MVP build.",
    });

    expect(result).toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://discord.com/api/webhooks/123/real-token?wait=true");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(init.body);
    expect(body.embeds[0].color).toBe(5390995);
    expect(Array.isArray(body.embeds)).toBe(true);
    const fields = body.embeds[0].fields;
    expect(fields.find((f: { name: string }) => f.name === "Name").value).toBe("Jane Founder");
    expect(fields.find((f: { name: string }) => f.name === "Email").value).toBe("jane@startup.com");
    expect(fields.find((f: { name: string }) => f.name === "Message").value).toBe(
      "We'd like to talk about an MVP build."
    );
  });

  it("maps HTTP 429 to a rate-limited failure reason (retry-friendly, no hammer-retry)", async () => {
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/123/real-token";
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 }) as unknown as typeof fetch;

    const { submitContactForm } = await import("@/lib/discord");
    const result = await submitContactForm({ name: "A", email: "a@b.com", message: "hi" });
    expect(result).toEqual({ ok: false, reason: "rate-limited" });
  });

  it.each([400, 401, 404])(
    "maps HTTP %d to an 'invalid' failure reason (misconfigured webhook / malformed payload)",
    async (status) => {
      process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/123/real-token";
      vi.resetModules();
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status }) as unknown as typeof fetch;

      const { submitContactForm } = await import("@/lib/discord");
      const result = await submitContactForm({ name: "A", email: "a@b.com", message: "hi" });
      expect(result).toEqual({ ok: false, reason: "invalid" });
    }
  );

  it("maps other non-ok statuses to a generic 'network' failure reason", async () => {
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/123/real-token";
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

    const { submitContactForm } = await import("@/lib/discord");
    const result = await submitContactForm({ name: "A", email: "a@b.com", message: "hi" });
    expect(result).toEqual({ ok: false, reason: "network" });
  });

  it("never throws an unhandled exception on a network failure (fetch rejects) — no raw error surfaced", async () => {
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/123/real-token";
    vi.resetModules();
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch")) as unknown as typeof fetch;

    const { submitContactForm } = await import("@/lib/discord");
    const result = await submitContactForm({ name: "A", email: "a@b.com", message: "hi" });
    expect(result).toEqual({ ok: false, reason: "network" });
  });
});
