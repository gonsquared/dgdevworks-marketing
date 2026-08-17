import { test, expect } from "@playwright/test";

const WEBHOOK_PATTERN = "**/api/webhooks/**";

test.describe("Contact form (E6-F1-S2) — webhook mocked/stubbed, never hits the real Discord endpoint", () => {
  test("blocks submission of empty required fields with visible validation errors", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email.")).toBeVisible();
    await expect(page.getByText("Please enter a message.")).toBeVisible();
  });

  test("rejects a malformed email", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Jane Founder");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("Interested in an MVP build.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  });

  test("successful submission shows a success state (Discord call intercepted, never hits discord.com for real)", async ({
    page,
  }) => {
    let webhookCalled = false;
    await page.route(WEBHOOK_PATTERN, async (route) => {
      webhookCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "123", content: "ok" }),
      });
    });

    await page.goto("/contact");
    await page.getByLabel("Name").fill("Jane Founder");
    await page.getByLabel("Email").fill("jane@startup.com");
    await page.getByLabel("Message").fill("We'd like to talk about an MVP build.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText(/Thanks — your message has been sent/)).toBeVisible();
    expect(webhookCalled).toBe(true);
  });

  test("webhook failure shows a generic, retry-friendly error — never raw HTTP details", async ({ page }) => {
    await page.route(WEBHOOK_PATTERN, async (route) => {
      await route.fulfill({ status: 500, body: "Internal Server Error" });
    });

    await page.goto("/contact");
    await page.getByLabel("Name").fill("Jane Founder");
    await page.getByLabel("Email").fill("jane@startup.com");
    await page.getByLabel("Message").fill("We'd like to talk about an MVP build.");
    await page.getByRole("button", { name: "Send message" }).click();

    const status = page.getByText(/Something went wrong sending your message/);
    await expect(status).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/500|Internal Server Error|TypeError/);
  });

  test("429 rate-limit response shows a retry-friendly message distinct from the generic error", async ({
    page,
  }) => {
    await page.route(WEBHOOK_PATTERN, async (route) => {
      await route.fulfill({ status: 429, headers: { "Retry-After": "5" }, body: "" });
    });

    await page.goto("/contact");
    await page.getByLabel("Name").fill("Jane Founder");
    await page.getByLabel("Email").fill("jane@startup.com");
    await page.getByLabel("Message").fill("We'd like to talk about an MVP build.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText(/receiving a lot of messages/)).toBeVisible();
  });

  test("honeypot field is not reachable via sequential keyboard Tab navigation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").focus();
    await page.keyboard.press("Tab"); // -> Email
    await page.keyboard.press("Tab"); // -> Message
    // Honeypot must never receive focus via Tab (tabindex=-1); the next
    // focusable stop from Message should be the submit button.
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    expect(focused).not.toBe("company");
  });
});
