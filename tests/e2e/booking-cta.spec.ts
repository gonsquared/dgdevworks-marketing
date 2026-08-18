// Uses tests/e2e/fixtures.ts (not "@playwright/test" directly) so the
// sitewide PortfolioDisclosureModal (E1-F4-S2) is pre-dismissed via
// sessionStorage and never intercepts clicks on these unrelated CTA checks.
import { test, expect } from "./fixtures";

test.describe("Book a call CTA (E5-F2-S1)", () => {
  test("nav 'Book a call' link points to the configured booking URL and opens safely in a new tab", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Book a call" }).first();
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    const href = await cta.getAttribute("href");
    expect(href).toMatch(/^https?:\/\//);
  });

  test("Book a call CTA renders consistently on home, every service page, and the contact page", async ({
    page,
  }) => {
    for (const path of [
      "/",
      "/services/mvp-development",
      "/services/marketing-sites",
      "/services/modernization",
      "/services/fractional",
      "/contact",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("link", { name: "Book a call" }).first()).toBeVisible();
    }
  });

  test("home page and every service page end with a dual CTA: primary Book a call + secondary Send a message", async ({
    page,
  }) => {
    for (const path of ["/", "/services/mvp-development"]) {
      await page.goto(path);
      const ctaBand = page.locator("text=Ready to talk about your project?").locator("..").locator("..");
      await expect(ctaBand.getByRole("link", { name: "Book a call" })).toBeVisible();
      await expect(ctaBand.getByRole("link", { name: "Send a message" })).toBeVisible();
    }
  });
});
