import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * E6-F1-S3: live-browser accessibility scan across all 14 pre-rendered
 * routes, against the actual static export build. This is the authoritative
 * accessibility gate (vs. the jsdom-level axe scan in
 * tests/unit/accessibility/pages-axe.test.tsx, which covers the same DOM
 * trees in a non-browser environment as a defense-in-depth measure).
 */
const ROUTES = [
  "/",
  "/services",
  "/services/mvp-development",
  "/services/marketing-sites",
  "/services/modernization",
  "/services/fractional",
  "/work",
  "/work/bank-platform-modernization",
  "/work/hardware-brand-partner-portals",
  "/work/retail-pos-platform",
  "/work/stock-exchange-data-migration",
  "/about",
  "/pricing",
  "/contact",
];

/**
 * Scrolls the full page height so every ScrollReveal-wrapped section (which
 * animates from opacity:0 until it enters the viewport) has been triggered
 * and settled before the axe scan runs — otherwise the scan can catch
 * content mid-fade-in and report a false-positive contrast violation that a
 * real visitor would never actually see.
 */
async function settleScrollRevealAnimations(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const distance = 400;
    const delay = 60;
    let scrolled = 0;
    const height = document.body.scrollHeight;
    while (scrolled < height) {
      window.scrollBy(0, distance);
      scrolled += distance;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

test.describe("Accessibility audit — axe scan across all 14 routes (E6-F1-S3)", () => {
  for (const route of ROUTES) {
    test(`${route} has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(route);
      await settleScrollRevealAnimations(page);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );
      expect(
        blocking,
        blocking.map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`).join("\n")
      ).toEqual([]);
    });
  }

  test("color contrast passes in both light and dark themes on the home page", async ({ page }) => {
    await page.goto("/");
    const lightResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const lightContrastViolations = lightResults.violations.filter((v) => v.id === "color-contrast");
    expect(lightContrastViolations).toEqual([]);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const darkResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const darkContrastViolations = darkResults.violations.filter((v) => v.id === "color-contrast");
    expect(darkContrastViolations).toEqual([]);
  });

  test("keyboard navigation reaches the theme toggle and activates it without a mouse", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Switch to dark theme" });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
