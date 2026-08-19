// Uses tests/e2e/fixtures.ts (not "@playwright/test" directly) so the
// sitewide PortfolioDisclosureModal (E1-F4-S2) is pre-dismissed via
// sessionStorage and never intercepts clicks on these unrelated nav flows.
import { test, expect } from "./fixtures";

/**
 * E6-F1-S2: home -> service page -> case study -> back, against the
 * production-equivalent static export build served by playwright.config.ts.
 */
test.describe("Critical flow: Home -> Service -> Case study -> back", () => {
  test("navigates from home through a service page to its related case study and back", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DG DevWorks/);

    // Home -> a specific service via the services index rows. Selecting by
    // href pattern (not link text) so this stays correct regardless of
    // which component renders the row.
    await page.locator('a[href^="/services/"]').first().click();
    await expect(page).toHaveURL(/\/services\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Service detail -> a related case study.
    // Selecting by href pattern (not link text) so this stays correct
    // regardless of which component renders the row.
    const relatedCaseStudyLink = page.locator('a[href^="/work/"]').first();
    await expect(relatedCaseStudyLink).toBeVisible();
    const caseStudyHref = await relatedCaseStudyLink.getAttribute("href");
    await relatedCaseStudyLink.click();
    await expect(page).toHaveURL(new RegExp(caseStudyHref!.replace(/\//g, "\\/")));

    // Case study -> back to the related service via its cross-link.
    const relatedServiceLink = page.locator('a[href^="/services/"]').first();
    await expect(relatedServiceLink).toBeVisible();
    await relatedServiceLink.click();
    await expect(page).toHaveURL(/\/services\//);
  });

  test("full nav bar reaches every top-level route with a 200 response and no console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    for (const path of ["/", "/services", "/work", "/about", "/pricing", "/contact"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should respond 200`).toBe(200);
    }

    expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join("\n")}`).toEqual([]);
  });

  test("invalid /services/[slug] and /work/[slug] routes 404 without a runtime crash", async ({ page }) => {
    const badService = await page.goto("/services/does-not-exist");
    expect(badService?.status()).toBe(404);
    await expect(page.getByRole("heading").first()).toBeVisible();

    const badCaseStudy = await page.goto("/work/does-not-exist");
    expect(badCaseStudy?.status()).toBe(404);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
