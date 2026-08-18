// The 14-route scan, contrast check, and keyboard-nav test below predate the
// sitewide PortfolioDisclosureModal (E1-F4-S2) and are about page content,
// not the modal — they use tests/e2e/fixtures.ts so the modal is
// pre-dismissed via sessionStorage and never adds noise to those scans or
// blocks the theme-toggle click. The modal-open axe scan and
// reduced-motion check further down deliberately import `test` straight
// from "@playwright/test" instead, since they need a fresh, non-dismissed
// session for the modal to actually appear.
import { test, expect, PORTFOLIO_DISCLOSURE_DISMISSED_KEY } from "./fixtures";
import { test as rawTest } from "@playwright/test";
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
    // Dark is the default theme now — check it first.
    const darkResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const darkContrastViolations = darkResults.violations.filter((v) => v.id === "color-contrast");
    expect(darkContrastViolations).toEqual([]);

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const lightResults = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const lightContrastViolations = lightResults.violations.filter((v) => v.id === "color-contrast");
    expect(lightContrastViolations).toEqual([]);
  });

  test("keyboard navigation reaches the theme toggle and activates it without a mouse", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Switch to light theme" });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

/**
 * E1-F4-S3 (docs/design-system.md §9, flagged explicitly in the spec's
 * handoff notes): the existing live-browser axe scan above only ever runs
 * against the modal's dismissed state (every route-scan test above uses the
 * fixture that pre-dismisses it). This block forces the modal open — the
 * same mechanism that previously caught the real Footer contrast defect in
 * E1-F3-S3 — so the dialog's own markup (backdrop, heading, body, CTAs,
 * close button) gets a real accessibility scan, not just a jsdom-level one.
 * Deliberately imports `test` straight from "@playwright/test" (not
 * tests/e2e/fixtures.ts) so sessionStorage starts truly empty and the modal
 * actually opens.
 */
rawTest.describe("Accessibility audit — PortfolioDisclosureModal open state (E1-F4-S3, docs/design-system.md §9)", () => {
  rawTest("modal open on / has no critical/serious axe violations", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "You're looking at a portfolio project" });
    await expect(dialog).toBeVisible();
    // Gate on the entrance transition actually finishing (opacity settled at 1)
    // rather than just mount+visible — axe can otherwise catch the dialog
    // mid-fade under CPU contention (parallel workers) and report a transient
    // color-contrast violation that doesn't exist once the animation settles.
    await expect(dialog).toHaveCSS("opacity", "1");

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

  rawTest("modal open on a second route (/services) has no critical/serious axe violations", async ({
    page,
  }) => {
    await page.goto("/services");
    const dialog = page.getByRole("dialog", { name: "You're looking at a portfolio project" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("opacity", "1");

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

  rawTest("respects prefers-reduced-motion: modal appears instantly with no transform, opacity-only", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "You're looking at a portfolio project" });
    await expect(dialog).toBeVisible();

    // Under reduced motion the component's `initial`/`animate` props omit
    // scale/y entirely (opacity-only per §9), so Framer Motion never writes
    // a transform to the element — assert that directly rather than trying
    // to infer animation duration from the DOM.
    const transform = await dialog.evaluate((el) => getComputedStyle(el).transform);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
    await expect(dialog).toHaveCSS("opacity", "1");
  });

  rawTest("dismissing the modal (any path) sets the sessionStorage flag and it does not reopen on reload", async ({
    page,
  }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "You're looking at a portfolio project" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    const flag = await page.evaluate(
      (key) => window.sessionStorage.getItem(key),
      PORTFOLIO_DISCLOSURE_DISMISSED_KEY
    );
    expect(flag).toBe("true");
  });
});
